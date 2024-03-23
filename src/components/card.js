import { cardTemplate } from './index.js';
import { config, deleteCardFromServer, putLikeCard, deleteLikeCard } from './api.js';

// Функция создания карточки
function makeCard(cardObject, deleteCard, likeCard, setImageToPopup, openPopupImage, currentUserId) {
  const cardElement = cardTemplate.cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDelButton = cardElement.querySelector('.card__delete-button');
  const cardButtonLike = cardElement.querySelector('.card__like-button');
  const cardLikesCounter = cardElement.querySelector('.card__like-counter');
  const cardId = cardObject._id;

  const likesArray = cardObject.likes;
 
  cardImage.src = cardObject.link;
  cardTitle.textContent = cardObject.name;
  cardImage.alt = cardObject.name;
  cardLikesCounter.textContent = likesArray.length;

  if (cardObject.owner._id !== currentUserId) {   // Проверка соотвествия id владельца карточки с id текущего пользователя
    cardDelButton.remove(); // Удаление кнопки "удалить карточку"
  }

  if (isLiked(likesArray, currentUserId)) {
    cardButtonLike.classList.add('card__like-button_is-active');
  }
  
  cardDelButton.addEventListener('click', (evt) => { // обработчик удаления карточки с сервера и из DOM
    deleteCardFromServer(config, cardId)
      .then(deleteCard(evt))
  });

  cardButtonLike.addEventListener('click', (evt) => {  // Обработчик лайка карточки
    
    if(!isLiked(likesArray, currentUserId)) {    
      putLikeCard(config, cardId)
        .then((resCardObject) => updateCountLikes(cardLikesCounter, resCardObject)) 
        .then(() => likeCard(evt))
    }
    else {
      deleteLikeCard(config, cardId)
        .then((resCardObject) => updateCountLikes(cardLikesCounter, resCardObject)) 
        .then(() => likeCard(evt))
    }
  });

  cardImage.addEventListener('click', setImageToPopup); // Обработчик добавления картинки в поп-ап картинки
  cardImage.addEventListener('click', openPopupImage); // обработчик открытия поп-апа картинки

  return cardElement;
}

// Функция проверки лайкнутости
function isLiked(likesArray, currentUserId) {
  return likesArray.some((userObject) => userObject._id === currentUserId); 
}

// Функция обновления счетчика лайков
function updateCountLikes(cardLikesCounter, cardObject) {
  cardLikesCounter.textContent = cardObject.likes.length;
}

// Функция удаления карточки из DOM
function deleteCard(evt) {
  const card = evt.target.closest('.card');
  card.remove();
}

// Функция переключения лайка карточки
function likeCard(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

export { makeCard, deleteCard, likeCard };