let page = 1
let maxPage;
let infiniteScroll;

searchFormBtn.addEventListener('click', () => {
  location.hash = '#search=' + searchFormInput.value;
});

trendingBtn.addEventListener('click', () => {
  location.hash = '#trends';
});

arrowBtn.addEventListener('click', () => {
  history.back();
});

window.addEventListener('DOMContentLoaded', navigatorPath, false);
window.addEventListener('hashchange', navigatorPath, false);
window.addEventListener('scroll', infiniteScroll, false)



function navigatorPath() {

  if (infiniteScroll) {
    window.removeEventListener('scroll', infiniteScroll, { passive: false });
    infiniteScroll = undefined;
  }
  if (location.hash.startsWith('#trends')) {
    trendsPage();
  } else if (location.hash.startsWith('#search=')) {
    searchPage();
  } else if (location.hash.startsWith('#movie=')) {
    movieDetailsPage();
  } else if (location.hash.startsWith('#category=')) {
    categoriesPage();
  } else {
    homePage();
  }
  if (infiniteScroll) {
    window.addEventListener('scroll', infiniteScroll, { passive: false })
  }

  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function homePage() {
  console.log('Home!!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.add('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.remove('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.remove('inactive');


  trendingPreviewSection.classList.remove('inactive');
  categoriesPreviewSection.classList.remove('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.add('inactive');

  getTrendingMoviesPreview();
  getCategegoriesPreview();
  getlikedMovies()
}

function categoriesPage() {
  console.log('categories!!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');
  FavoritesMoviesContainer.classList.add('inactive')


  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  // ['#category', 'id-name']
  const [_, categoryData] = location.hash.split('=');
  const [categoryId, categoryName] = categoryData.split('-');

  headerCategoryTitle.innerHTML = categoryName;

  getMoviesByCategory(categoryId);
  infiniteScroll = getPaginatedCategoryMovies(categoryId)

}

function movieDetailsPage() {
  console.log('Movie!!');

  headerSection.classList.add('header-container--long');
  // headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.add('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.add('inactive');
  FavoritesMoviesContainer.classList.add('inactive')


  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.remove('inactive');

  // ['#movie', '234567']
  const [_, movieId] = location.hash.split('=');
  getMovieById(movieId);
}

function searchPage() {
  console.log('Search!!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.add('inactive');
  FavoritesMoviesContainer.classList.add('inactive')

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');
  FavoritesMoviesContainer.classList.add('inactive')


  // ['#search', 'platzi']
  const [_, query] = location.hash.split('=');
  getMoviesBySearch(query);
  infiniteScroll = getPaginatedMoviesBySearch(query)

}

function trendsPage() {
  console.log('TRENDS!!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  FavoritesMoviesContainer.classList.add('inactive')

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');
  FavoritesMoviesContainer.classList.add('inactive')


  headerCategoryTitle.innerHTML = 'Tendencias';
  infiniteScroll = getPaginatedTrendingMovies

  getTrendingMovies();
}


