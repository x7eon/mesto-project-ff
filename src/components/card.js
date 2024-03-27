import { cardTemplate } from './index.js';
import {
  config,
  putLikeCard,
  deleteLikeCard,
} from './api.js';

// Функция создания карточки
function makeCard(
  cardObject,
  likeCard,
  setImageToPopup,
  openPopupImage,
  currentUserId,
  openPopupConfirmDeleteCard,
) {
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
  cardLikesCounter.textContent = cardObject.likes.length;

  if (!isOwnerCard(ownerId, currentUserId)) {
    cardDelButton.remove(); // Удаление кнопки удаления карточки из DOM
  }

  if (isLikedByCurrentUser(likesArray, currentUserId)) {
    cardButtonLike.classList.add('card__like-button_is-active');
  }

  // Обаботчик открытия поп-апа подтверждения удаления карточки
  cardDelButton.addEventListener('click', (evt) => {
    openPopupConfirmDeleteCard(cardId, evt.target.closest('.card'));
  });

  // Обработчик лайка карточки
  cardButtonLike.addEventListener('click', (evt) => {
    if (!isLikedByCurrentUser(likesArray, currentUserId)) {
      putLikeCard(config, cardId)
        .then((cardObject) => {
          likesArray = cardObject.likes;
          updateCountLikes(cardLikesCounter, cardObject);
        })
        .then(() => likeCard(evt))
        .catch((err) => console.log(err));
    } else {
      deleteLikeCard(config, cardId)
        .then((cardObject) => {
          likesArray = cardObject.likes;
          updateCountLikes(cardLikesCounter, cardObject);
        })
        .then(() => likeCard(evt))
        .catch((err) => console.log(err));
    }
  });

  // Обработчик добавления картинки в поп-ап картинки
  cardImage.addEventListener('click', () => {
    setImageToPopup(cardObject.name, cardObject.link)
  }); 

  // обработчик открытия поп-апа картинки
  cardImage.addEventListener('click', openPopupImage); 

  return cardElement;
}

// Функция проверки владельца карточки
function isOwnerCard(ownerId, currentId) {
  if (ownerId === currentId) {
    // Проверка соотвествия id владельца карточки с id текущего пользователя
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
function deleteCard(card) {
  card.remove();
}

// Функция переключения класса лайка карточки
function likeCard(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

export { makeCard, deleteCard, likeCard };
