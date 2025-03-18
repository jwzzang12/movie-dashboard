const baseImgUrl = 'https://image.tmdb.org/t/p/w200';
const mainContainer = document.getElementById('main-container');
const detailsContainer = document.getElementById('details-container');
const detailsAside = document.getElementById('details');
// const closeBtn = document.getElementById('close-btn');

// closeBtn.addEventListener('click', () => {
//   detailsAside.style.display = 'none';
// });

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkN2Q2YjQzNmMyYWFmYmI5MDM0NTJkYjYyMjNkOWU2NiIsIm5iZiI6MTY2MTgyNDY3MC4wNTQwMDAxLCJzdWIiOiI2MzBkNmU5ZWJiY2FlMDAwN2U0OTZjOTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Vwc5gnWDhQRyZ2Kv5dgudocFXP-gbICaUomEyqLsVsY',
  },
};

function fetchMovies(endpoint) {
  mainContainer.innerHTML = '';
  fetch(endpoint, options)
    .then((res) => res.json())
    .then((res) => {
      displayMovies(res.results);
    })
    .catch((err) => console.error('Error fetching movies:', err));
}

async function fetchTrendingMovies(genreId) {
  mainContainer.innerHTML = '';
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
  mainContainer.innerHTML = movies
    .map(
      (movie) => `
        <div class="movie-card" data-id="${movie.id}">
          <div class="img-container">
            <img src="${baseImgUrl + movie.poster_path}" alt="${movie.title}">
          </div>
          <div class="card-content">
            <h3>${movie.title}</h3>
            <p>Rating: ${movie.vote_average}</p>
          </div>
        </div>
      `
    )
    .join('');

  document.querySelectorAll('.movie-card').forEach((card) => {
    card.addEventListener('click', () => {
      // detailsAside.style.display = 'block';
      const movieId = card.getAttribute('data-id');
      fetchMovieDetails(movieId);
    });
  });
}

function fetchMovieDetails(movieId) {
  const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=ko`;
  const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko`;
  const providersUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`;

  Promise.all([
    fetch(detailsUrl, options).then((res) => res.json()),
    fetch(creditsUrl, options).then((res) => res.json()),
    fetch(providersUrl, options).then((res) => res.json()),
  ])
    .then(([details, credits, providers]) => {
      detailsContainer.innerHTML = `
        <div class="detail__img-container">
          <img src="${details.poster_path ? baseImgUrl + details.poster_path : defaultImg}" alt="${details.title}">
        </div>
        <div>
          <div><span>개봉연도</span><span>${details.release_date}</span></div><div><span>평점</span><span>${details.vote_average}</span></div>
        </div>
        <p>${details.overview}</p>
        ${
          providers.results?.KR?.buy
            ? `<h3>구매</h3>
          <div class="providers__info">
            ${providers.results.KR.buy
              .map(
                (provider) => `
                  <span>${provider.provider_name}</span>`
              )
              .join('')}
          </div>`
            : ''
        }
        ${
          providers.results?.KR?.flatrate
            ? `<h3>시청할 수 있는 서비스</h3>
          <div class="providers__info">
            ${providers.results.KR.flatrate
              .map(
                (provider) => `
                    <span>${provider.provider_name}</span>`
              )
              .join('')}
          </div>`
            : ''
        }
        <h3>출연진</h3>
        <ul>
          ${credits.cast
            .slice(0, 5)
            .map(
              (actor) => `
            <li>
              <div class="credits__img-container">
                <img src="${baseImgUrl + actor.profile_path}" alt="${actor.name}의 프로필사진">
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
  family: 10751,
  fantasy: 14,
  thriller: 53,
};

document.querySelectorAll('.tag-nav li').forEach((navItem) => {
  navItem.addEventListener('click', () => {
    document.querySelectorAll('.tag-nav li').forEach((item) => item.classList.remove('active'));
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
fetchMovieDetails(696506);
