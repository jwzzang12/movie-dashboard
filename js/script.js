const baseImgUrl = 'https://image.tmdb.org/t/p/';
const movieContainer = document.getElementById('movie-container');
const detailContainer = document.getElementById('detail-container');
const detailsAside = document.getElementById('details');

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkN2Q2YjQzNmMyYWFmYmI5MDM0NTJkYjYyMjNkOWU2NiIsIm5iZiI6MTY2MTgyNDY3MC4wNTQwMDAxLCJzdWIiOiI2MzBkNmU5ZWJiY2FlMDAwN2U0OTZjOTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Vwc5gnWDhQRyZ2Kv5dgudocFXP-gbICaUomEyqLsVsY',
  },
};

function fetchMovies(endpoint) {
  movieContainer.innerHTML = '';
  fetch(endpoint, options)
    .then((res) => res.json())
    .then((res) => {
      displayMovies(res.results);
    })
    .catch((err) => console.error('Error fetching movies:', err));
}

async function fetchTrendingMovies(genreId) {
  movieContainer.innerHTML = '';
  const totalPages = 3;
  const allMovies = [];

  for (let page = 1; page <= totalPages; page++) {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?language=ko&page=${page}`, options);
      const data = await res.json();
      allMovies.push(...data.results);
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
    }
  }

  const filteredMovies = allMovies.filter((movie) => movie.genre_ids.includes(genreId));
  displayMovies(filteredMovies);
}

function displayMovies(movies) {
  movieContainer.innerHTML = movies
    .map(
      (movie) => `
        <div class="movies__item" data-id="${movie.id}">
          <img src="${baseImgUrl + 'w200' + movie.poster_path}" alt="${movie.title}">
        </div>
      `
    )
    .join('');

  document.querySelectorAll('.movies__item').forEach((card) => {
    card.addEventListener('click', () => {
      const movieId = card.getAttribute('data-id');
      fetchMovieDetails(movieId);
    });
  });
}

function fetchMovieDetails(movieId) {
  const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=ko`;
  const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko`;

  Promise.all([fetch(detailsUrl, options).then((res) => res.json()), fetch(creditsUrl, options).then((res) => res.json())])
    .then(([details, credits, providers]) => {
      const rating = details.vote_average.toFixed(1);

      detailContainer.innerHTML = `
        <div class="details__img-container">
          <img src="${details.poster_path ? baseImgUrl + 'original' + details.poster_path : defaultImg}" alt="${details.title}">
        </div>
        <div class="details__info">
          <div><span>${details.release_date}</span><span>개봉</span></div><div><span>평점</span><span>${rating}</span></div>
        </div>
        <p class="details__overview">${details.overview}</p>
        <h3>출연진</h3>
        <ul class="credits">
          ${credits.cast
            .slice(0, 5)
            .map(
              (actor) => `
            <li>
              <div class="credits__img-container">
                <img src="${baseImgUrl + 'w200' + actor.profile_path}" alt="${actor.name}의 프로필사진">
              </div>
              <div class="credits__actor-info">
                <div>${actor.name}</div>
                <div class="character">${actor.character}</div>
              </div>
            </li>`
            )
            .join('')}
        </ul>
      `;
    })
    .catch((err) => console.error('Error fetching movie details:', err));
}

const endpoints = {
  'now-playing': 'https://api.themoviedb.org/3/movie/now_playing?language=ko&page=1&region=KR',
  trending: 'https://api.themoviedb.org/3/trending/movie/week?language=ko',
  upcoming: 'https://api.themoviedb.org/3/movie/upcoming?language=ko&page=1&region=KR',
};

const genreMap = {
  action: 28,
  adventure: 12,
  comedy: 35,
  SF: 878,
  fantasy: 14,
  thriller: 53,
};

document.querySelectorAll('.tags__list li').forEach((navItem) => {
  navItem.addEventListener('click', () => {
    document.querySelectorAll('.tags__list li').forEach((item) => item.classList.remove('active'));
    navItem.classList.add('active');

    const id = navItem.id;
    if (endpoints[id]) {
      fetchMovies(endpoints[id]);
    } else if (genreMap[id]) {
      fetchTrendingMovies(genreMap[id]);
    }
  });
});

fetchMovies(endpoints['now-playing']);
document.getElementById('now-playing').classList.add('active');
fetchMovieDetails(696506);

document.addEventListener('DOMContentLoaded', () => {
  const videoModal = document.getElementById('video-modal');
  const mainPoster = document.querySelector('.video__img-container');
  const closeModal = document.getElementById('close-modal');
  const modalIframe = document.getElementById('modal__iframe');

  mainPoster.addEventListener('click', () => {
    videoModal.style.display = 'block';
    modalIframe.src = 'https://www.youtube.com/embed/fYhSVx-ys-Q?controls=1';
  });

  closeModal.addEventListener('click', () => {
    videoModal.style.display = 'none';
    modalIframe.src = '';
  });
});
