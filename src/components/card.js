import { cardTemplate } from './index.js';

// Функция создания карточки
function makeCard(object, deleteCard, likeCard, setImageToPopup, openPopupImage) {
  const cardElement = cardTemplate.cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDelButton = cardElement.querySelector('.card__delete-button');
  const cardButtonLike = cardElement.querySelector('.card__like-button');
   
  cardImage.src = object.link;
  cardTitle.textContent = object.name;
  cardImage.alt = object.alt;

  cardDelButton.addEventListener('click', deleteCard); // обработчик удаления карточки
  cardButtonLike.addEventListener('click', likeCard); // Обработчик лайка карточки
  cardImage.addEventListener('click', setImageToPopup); // Обработчик добавления картинки в поп-ап картинки
  cardImage.addEventListener('click', openPopupImage); // обработчик открытия поп-апа картинки

  return cardElement;
}

// Функция удаления карточки
function deleteCard(evt) {
  const card = evt.target.closest('.card');
  card.remove();
}

// Функция лайка карточки
function likeCard(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

export { makeCard, deleteCard, likeCard };