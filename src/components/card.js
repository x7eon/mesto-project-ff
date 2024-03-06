import { cardTemplate } from "./index.js";

// Функция создания карточки
function makeCard(object, deleteCard, likeCard, setImageToPopup) {
  const cardElement = cardTemplate.cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardButtonDel = cardElement.querySelector(".card__delete-button");
   
  cardImage.src = object.link;
  cardTitle.textContent = object.name;
  cardImage.alt = object.alt;

  cardButtonDel.addEventListener('click', deleteCard); // обработчик удаления карточки

  return cardElement;
}

// Функция удаления карточки
function deleteCard(evt) {
  const card = evt.target.closest('.card');
  card.remove();
}

// Функция лайка карточки
function likeCard(evt) {
  if (evt.target.classList.contains('card__like-button')) { 
    evt.target.classList.toggle('card__like-button_is-active');
  }
}

export { makeCard, deleteCard, likeCard };