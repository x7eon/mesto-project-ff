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
  const ownerId = cardObject.owner._id;
  let likesArray = cardObject.likes;
  cardImage.src = cardObject.link;
  cardTitle.textContent = cardObject.name;
  cardImage.alt = cardObject.name;
  cardLikesCounter.textContent = likesArray.length;

  if (!isOwnerCard(ownerId, currentUserId)) {
    cardDelButton.remove(); // Удаление кнопки удаления карточки из DOM
  }

  if (isLikedByCurrentUser(likesArray, currentUserId)) {
    cardButtonLike.classList.add('card__like-button_is-active');
  }
  
  cardDelButton.addEventListener('click', (evt) => { // обработчик удаления карточки с сервера и из DOM
    deleteCardFromServer(config, cardId)
      .then(deleteCard(evt))
      .catch((err) => console.log(err))
  });

  cardButtonLike.addEventListener('click', (evt) => { // Обработчик лайка карточки
    if(!isLikedByCurrentUser(likesArray, currentUserId)) {    
      putLikeCard(config, cardId)
        .then((cardObject) => {
          likesArray = cardObject.likes;
          updateCountLikes(cardLikesCounter, cardObject);
        })
        .then(() => likeCard(evt))
        .catch((err) => console.log(err))
    }
    else {
      deleteLikeCard(config, cardId)
        .then((cardObject) => {
          likesArray = cardObject.likes;
          updateCountLikes(cardLikesCounter, cardObject);
        }) 
        .then(() => likeCard(evt))
        .catch((err) => console.log(err))
    }
  });

  cardImage.addEventListener('click', setImageToPopup); // Обработчик добавления картинки в поп-ап картинки
  cardImage.addEventListener('click', openPopupImage); // обработчик открытия поп-апа картинки

  return cardElement;
}

// Функция проверки владельца карточки
function isOwnerCard(ownerId, currentId) {
  if (ownerId === currentId) { // Проверка соотвествия id владельца карточки с id текущего пользователя
    return true;
  }
}

// Функция проверки лайкнутости
function isLikedByCurrentUser(likesArray, currentUserId) {
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

// Функция переключения класса лайка карточки
function likeCard(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

export { makeCard, deleteCard, likeCard };