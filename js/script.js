const apiKey = 'd7d6b436c2aafbb903452db6223d9e66';
const baseImgUrl = 'https://image.tmdb.org/t/p/w200';

function fetchMovies(endpoint, containerId) {
  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      const movies = data.results;
      const container = document.getElementById(containerId);
      movies.forEach((movie) => {
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
              <div class="img-container"><img src="${baseImgUrl + movie.poster_path}" alt="${movie.title}"></div>
              <div class="card-content">
                <h3>${movie.title}</h3>
                <p>Rating: ${movie.vote_average}</p>
              </div>
            `;
        container.appendChild(card);
      });
    })
    .catch((error) => console.error('Error fetching movies:', error));
}

const nowPlayingEndpoint = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko&page=1`;
const popularEndpoint = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko&page=1`;
const upcomingEndpoint = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=ko&page=1`;
const topRatedEndpoint = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=ko&page=1`;

fetchMovies(nowPlayingEndpoint, 'now-playing-container');
fetchMovies(popularEndpoint, 'popular-container');
fetchMovies(upcomingEndpoint, 'upcoming-container');
fetchMovies(topRatedEndpoint, 'top-rated-container');
