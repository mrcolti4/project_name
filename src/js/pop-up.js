import { Loader } from './loader';
import { markUpRating } from './utils/markUpRating';
import localctorage from './utils/localctorage';
import { KEY } from './constants';
// Всі посилання
import { popUpRefs } from './refs';

let recipeId;
// Запуск по кліку
// setTimeout(() => {
//   finallInitPage('6462a8f74c3d0ddd28897fc1');
// }, 2000)

// /** Відкриття та закриття модального вікна */
popUpRefs.closeBtn.addEventListener('click', closeModalClose);
popUpRefs.backdropRecipe.addEventListener('click', clickBackdropClick);
function openModalOpen() {
  // Loader.Start();
  setTimeout(() => {
    window.addEventListener('keydown', onEscPress);
    document.body.classList.add('overflowHidden');
    popUpRefs.backdropRecipe.classList.add('active');
    popUpRefs.modalRecipe.classList.add('active');
    // Loader.Stop();
  }, 50);
}
function closeModalClose() {
  window.removeEventListener('keydown', onEscPress);
  document.body.classList.remove('overflowHidden');
  popUpRefs.backdropRecipe.classList.remove('active');
  popUpRefs.modalRecipe.classList.remove('active');
}
function clickBackdropClick(e) {
  if (e.currentTarget === e.target) {
    stopVideos();
    closeModalClose();
  }
}
function onEscPress(e) {
  if (e.code === 'Escape') {
    closeModalClose();
  }
}

function addIdToModal(id) {
  popUpRefs.modalRecipe.dataset.id = id;
}
// /** Кінець Відкриття та закриття модального вікна */

export function finallInitPage(id) {
  fetchRecipeById(id).then(data => {
    isFavorite(data._id);
    renderVIDEO(data);
    renderRanting(data);
    markUpRating();
    renderIngridient(data);
    renderHashtags(data);
    renderText(data);
    openModalOpen();
    addIdToModal(data._id);
  });
}

async function fetchRecipeById(id) {
  const resp = await fetch(
    `https://tasty-treats-backend.p.goit.global/api/recipes/${id}`
  );
  const data = await resp.json();
  return data;
}

// YouTUBE module
popUpRefs.closeVideo.addEventListener('click', stopVideos);
popUpRefs.btnOpenYouTube.addEventListener('click', openPlayer);

function stopVideos() {
  popUpRefs.trailerBox.classList.remove('active');

  document.querySelectorAll('iframe').forEach(video => {
    video.src = video.src;
  });
  document.querySelectorAll('video').forEach(video => {
    video.pause();
  });
}
function openPlayer() {
  popUpRefs.trailerBox.classList.add('active');
}
// end YouTUBE module

//  Рендер частин сторінки
function getKeyYouTybe(url) {
  let indexLast = url.split('').length;

  let key = url.split('').splice(32, indexLast).join('');
  return key;
}
function renderVIDEO(data) {
  const markUp = `
   <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/${getKeyYouTybe(
                  data.youtube
                )}?origin=https://mrcolti4.github.io"

title = "YouTube video player"
frameborder = "0"
allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen
  ></iframe >
`;
  popUpRefs.tiezer.innerHTML = markUp;
}
function renderRanting(data) {
  let markupR = `
  <div class="cards__rating rating">
          <div class="rating__value detail">${data.rating}</div>
          <div class="rating__body">
            <div class="rating__active"></div>
            <div class="rating__items">
              <input
                type="radio"
                class="rating__item"
                name="rating"
                value="1"
              />
              <input
                type="radio"
                class="rating__item"
                name="rating"
                value="2"
              />
              <input
                type="radio"
                class="rating__item"
                name="rating"
                value="3"
              />
              <input
                type="radio"
                class="rating__item"
                name="rating"
                value="4"
              />
              <input
                type="radio"
                class="rating__item"
                name="rating"
                value="5"
              />
            </div>
          </div>
        </div>`;
  popUpRefs.ratingBox.innerHTML = markupR;
}
function renderIngridient(data) {
  const markup = data.ingredients
    .map(({ measure, name }) => {
      return `<li class="recipes-subtitle">
                ${name}
                <p class="recipes-inf" p>${measure}</p>
              </li>`;
    })
    .join('');

  popUpRefs.IngredientBox.innerHTML = markup;
}
function renderHashtags(data) {
  if (data.tags.length === 0) {
    return;
  }
  const markup = data.tags
    .map(tag => {
      return ` <li class="hashtags">#${tag}</li>`;
    })
    .join('');

  popUpRefs.hashtagsBox.innerHTML = markup;
}
function renderText(data) {
  popUpRefs.preview.src = data.preview;
  popUpRefs.title.textContent = data.title;
  popUpRefs.textContentBox.textContent = data.instructions;
  popUpRefs.time.textContent = data.time + ' min';
}

// Додавання кнопки відповідно від того чи додана вона до улюблених
function isFavorite(id) {
  const favCards = localctorage.load(KEY) || {};
  if (Object.keys(favCards).includes(id)) {
    popUpRefs.removeFromFavoriteBtn.classList.remove('hidden');
    popUpRefs.addToFavoriteBtn.classList.add('hidden');
    return;
  }
  popUpRefs.removeFromFavoriteBtn.classList.add('hidden');
  popUpRefs.addToFavoriteBtn.classList.remove('hidden');
}
