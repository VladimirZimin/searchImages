// import 'simple-lightbox/dist/simpleLightbox.min.css';
// import './sass/main.scss';
import getRefs from './js/get-refs';
import { onScroll, onToTopBtn } from './js/scroll';
import fetchImages from './js/api-service';
import cardTemplates from './templates/card.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simple-lightbox';

const refs = getRefs();
const perPage = 24;
let query = '';
let page = 1;
let lightbox;

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreButton.addEventListener('click', onLoadMore);

onScroll();
onToTopBtn();

function onSearch(evt) {
  evt.preventDefault();

  clearGalleryBox();
  query = evt.currentTarget.elements.query.value.trim();
  page = 1;

  noHiddenLoadMoreBtn();

  if (query === '') {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.',
    );
    return;
  }

  fetchImages(query, page, perPage)
    .then(images => {
      if (images.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      } else {
        renderGalleryCards(images.hits);
        hiddenLoadMoreBtn();
        lightbox = new SimpleLightbox({ elements: '.gallery a' });
        Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      resetSearchForm();
    });
}

function onLoadMore() {
  page += 1;

  fetchImages(query, page, perPage)
    .then(images => {
      renderGalleryCards(images.hits);
      const totalPages = Math.ceil(images.totalHits / perPage);
      lightbox = new SimpleLightbox({ elements: '.gallery a' });

      if (page > totalPages) {
        noHiddenLoadMoreBtn();
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results.",
        );
      }
    })
    .catch(error => console.log(error));
}

function renderGalleryCards(hits) {
  refs.galleryBox.insertAdjacentHTML('beforeend', cardTemplates(hits));
}

function clearGalleryBox() {
  refs.galleryBox.innerHTML = '';
}

function hiddenLoadMoreBtn() {
  refs.loadMoreButton.classList.remove('js-hidden');
}
// скрыто
function noHiddenLoadMoreBtn() {
  refs.loadMoreButton.classList.add('js-hidden');
}

function resetSearchForm() {
  refs.searchForm.reset();
}
