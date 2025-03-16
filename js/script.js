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

function fetchMovies(endpoint, containerElement) {
  // Clear any existing movies before loading new ones
  containerElement.innerHTML = '';

  fetch(endpoint, options)
    .then((response) => response.json())
    .then((data) => {
      const movies = data.results;
      console.log(movies);
      movies.forEach((movie) => {
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
              <div class="img-container">
                <img src="${baseImgUrl + movie.poster_path}" alt="${movie.title}">
              </div>
              <div class="card-content">
                <h3>${movie.title}</h3>
                <p>Rating: ${movie.vote_average}</p>
              </div>
            `;
        containerElement.appendChild(card);
      });
    })
    .catch((error) => console.error('Error fetching movies:', error));
}

const nowPlayingEndpoint = `https://api.themoviedb.org/3/movie/now_playing?&language=ko&page=1&region=KR`;
const trendingEndpoint = `https://api.themoviedb.org/3/trending/movie/day?language=ko`;
const upcomingEndpoint = `https://api.themoviedb.org/3/movie/upcoming?&language=ko&page=1&region=KR`;

document.querySelectorAll('.tag-nav li').forEach((navItem) => {
  navItem.addEventListener('click', () => {
    document.querySelectorAll('.tag-nav li').forEach((item) => item.classList.remove('active'));
    navItem.classList.add('active');

    let endpoint;
    switch (navItem.id) {
      case 'now-playing':
        endpoint = nowPlayingEndpoint;
        break;
      case 'trending':
        endpoint = trendingEndpoint;
        break;
      case 'upcoming':
        endpoint = upcomingEndpoint;
        break;
      default:
        endpoint = nowPlayingEndpoint;
    }
    fetchMovies(endpoint, container);
  });
});

fetchMovies(nowPlayingEndpoint, container);
