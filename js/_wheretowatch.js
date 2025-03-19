const providersUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`;

fetch(providersUrl, options).then((res) => res.json()),

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