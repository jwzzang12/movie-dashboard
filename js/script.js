const baseImgUrl = 'https://image.tmdb.org/t/p/w200';
const container = document.getElementById('main-container');

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkN2Q2YjQzNmMyYWFmYmI5MDM0NTJkYjYyMjNkOWU2NiIsIm5iZiI6MTY2MTgyNDY3MC4wNTQwMDAxLCJzdWIiOiI2MzBkNmU5ZWJiY2FlMDAwN2U0OTZjOTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Vwc5gnWDhQRyZ2Kv5dgudocFXP-gbICaUomEyqLsVsY',
  },
};

function fetchMovies(endpoint) {
  container.innerHTML = '';
  fetch(endpoint, options)
    .then((response) => response.json())
    .then((data) => {
      displayMovies(data.results);
    })
    .catch((error) => console.error('Error fetching movies:', error));
}

async function fetchTrendingMovies(genreId) {
  container.innerHTML = '';
  const totalPages = 3;
  const allMovies = [];

  for (let page = 1; page <= totalPages; page++) {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?language=ko&page=${page}`, options);
      const data = await response.json();
      allMovies.push(...data.results);
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
    }
  }

  const filteredMovies = allMovies.filter((movie) => movie.genre_ids.includes(genreId));
  displayMovies(filteredMovies);
}

function displayMovies(movies) {
  container.innerHTML = movies
    .map(
      (movie) => `
        <div class="movie-card">
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
