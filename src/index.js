import './css/styles.css';
import { getImages } from './js/apiService';
import { createMarkup } from './js/createMarkup';
import refs from './js/refs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let searchTerm;
let page = 1;
var lightbox = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  searchTerm = e.target.searchQuery.value;
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
  page = 1;
  if (searchTerm === '') {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  getImages(searchTerm, page)
    .then(resp => {
      if (resp.data.totalHits === 0) {
        searchTerm = '';
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      Notify.success(`"Hooray! We found ${resp.data.totalHits} images."`);
      refs.gallery.insertAdjacentHTML(
        'beforeend',
        createMarkup(resp.data.hits)
      );
      lightbox.refresh();
      page += 1;
      refs.loadMoreBtn.classList.remove('is-hidden');
    })
    .catch(error => console.log(error));
}

function onLoadMore(e) {
  getImages(searchTerm, page)
    .then(resp => {
      page += 1;
      refs.gallery.insertAdjacentHTML(
        'beforeend',
        createMarkup(resp.data.hits)
      );
      lightbox.refresh();
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });

      if (resp.data.hits < 40) {
        searchTerm = '';
        refs.loadMoreBtn.classList.add('is-hidden');
        return Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => {
      if (error.response) {
        refs.loadMoreBtn.classList.add('is-hidden');
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    });
}
