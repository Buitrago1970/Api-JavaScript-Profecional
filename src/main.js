const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  params: {
    'api_key': API_KEY,
  },
});
// Utils
const LazyLoader = new IntersectionObserver((elements) => {
  elements.forEach(entry => {
    if (entry.target.attributes.dataimg.nodeValue === 'https://image.tmdb.org/t/p/w300null') {
      entry.target.classList.add("movie-img--null");
    }
    if (entry.isIntersecting) {
      entry.target.setAttribute('src', entry.target.attributes.dataImg.nodeValue)
    }
  })
})
function createMovies(movies, container, clean = true) {
  if (clean) {
    container.innerHTML = '';
  }
  movies.forEach(movie => {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');
    movieContainer.addEventListener('click', () => {
      location.hash = '#movie=' + movie.id;
    });

    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute(
      'dataImg',
      'https://image.tmdb.org/t/p/w300' + movie.poster_path,
    );
    movieContainer.appendChild(movieImg);
    container.appendChild(movieContainer);
    LazyLoader.observe(movieImg)
  });
}
function createCategories(categories, container) {
  container.innerHTML = "";

  categories.forEach(category => {
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');

    const categoryTitle = document.createElement('h3');
    categoryTitle.classList.add('category-title');
    categoryTitle.setAttribute('id', 'id' + category.id);
    categoryTitle.addEventListener('click', () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}
// Llamados a la API
async function getTrendingMoviesPreview() {
  const { data } = await api('trending/movie/day');
  const movies = data.results;

  createMovies(movies, trendingMoviesPreviewList);
}
async function getCategegoriesPreview() {
  const { data } = await api('genre/movie/list');
  const categories = data.genres;

  createCategories(categories, categoriesPreviewList);
}
async function getMoviesByCategory(id) {
  const { data } = await api('discover/movie', {
    params: {
      with_genres: id,
    },
  });
  maxPage = data.total_pages
  const movies = data.results;
  createMovies(movies, genericSection);
}
function getPaginatedCategoryMovies(id) {
  return async function () {
    const {
      scrollTop,
      scrollHeight,
      clientHeight } = document.documentElement
    const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight - 20
    const isNotMaxPage = page < maxPage

    if (scrollIsBottom && isNotMaxPage) {
      page++
      const { data } = await api('discover/movie', {
        params: {
          with_genres: id,
          page
        },
      });
      const movies = data.results;
      createMovies(movies, genericSection, false);
    }
  }
}
async function getMoviesBySearch(query) {
  const { data } = await api('search/movie', {
    params: {
      query,
    },
  });
  maxPage = data.total_pages
  const movies = data.results;
  createMovies(movies, genericSection);
}
function getPaginatedMoviesBySearch(query) {
  return async function () {
    const {
      scrollTop,
      scrollHeight,
      clientHeight } = document.documentElement
    const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight - 20
    const isNotMaxPage = page < maxPage

    if (scrollIsBottom && isNotMaxPage) {
      page++
      const { data } = await api('search/movie', {
        params: {
          query,
          page
        },
      });
      const movies = data.results;
      createMovies(movies, genericSection, false);
    }
  }
}
async function getTrendingMovies() {
  const { data } = await api('trending/movie/day');
  const movies = data.results;
  maxPage = data.total_pages

  createMovies(movies, genericSection);
}
async function getPaginatedTrendingMovies() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement
  const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight - 20
  const isNotMaxPage = page < maxPage

  if (scrollIsBottom && isNotMaxPage) {
    const { data } = await api('trending/movie/day', {
      params: {
        page
      }
    });
    page++
    const movies = data.results;
    createMovies(movies, genericSection, false);
  }
}
async function getMovieById(id) {
  const { data: movie } = await api('movie/' + id);

  const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
  console.log(movieImgUrl)
  headerSection.style.background = `
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.35) 19.27%,
      rgba(0, 0, 0, 0) 29.17%
    ),
    url(${movieImgUrl})
  `;

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  createCategories(movie.genres, movieDetailCategoriesList);

  getRelatedMoviesId(id);
}
async function getRelatedMoviesId(id) {
  const { data } = await api(`movie/${id}/recommendations`);
  const relatedMovies = data.results;

  createMovies(relatedMovies, relatedMoviesContainer);
}
