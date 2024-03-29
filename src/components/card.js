import { cardTemplate } from './index.js';

// Функция создания карточки
function makeCard(
  cardObject,
  currentUserId,
  handleSetImageToPopup,
  handleOpenPopupImage,
  handleOpenPopupDelCard,
  handleLikeCard
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

  if (!isOwnerCard(ownerId, currentUserId)) {
    cardDelButton.remove(); // Удаление кнопки удаления карточки из DOM
  }

  // Закрашивание кнопки, если карточка была лайкнута пользователем
  if (checkStatusLike(likesArray, currentUserId)) {
    cardButtonLike.classList.add('card__like-button_is-active');
  }

  // Установка обаботчика открытия поп-апа подтверждения удаления карточки
  cardDelButton.addEventListener('click', (evt) => {
    handleOpenPopupDelCard(cardId, evt.target.closest('.card'));
  });

  // Установка обработчика лайка карточки
  cardButtonLike.addEventListener('click', () => {
    handleLikeCard(
      checkStatusLike(likesArray, currentUserId),
      cardId,
      cardButtonLike,
      cardLikesCounter,
      (newLikesArray) => {
        likesArray = newLikesArray;
      }
    );
  });

  // Установка обработчика добавления картинки в поп-ап картинки
  cardImage.addEventListener('click', () => {
    handleSetImageToPopup(cardObject.name, cardObject.link);
  });

  // Установка обработчика открытия поп-апа картинки
  cardImage.addEventListener('click', handleOpenPopupImage);

  return cardElement;
}

// Функция проверки владельца карточки
function isOwnerCard(ownerId, currentId) {
  if (ownerId === currentId) {
    // Проверка соотвествия id владельца карточки с id текущего пользователя
    return true;
  }
}

// Функция удаления карточки из DOM
function deleteCard(card) {
  card.remove();
}

// Функция проверки статуса лайка НОВАЯ
function checkStatusLike(likesArray, currentUserId) {
  return likesArray.some((userObject) => userObject._id === currentUserId);
}

// Функция обновления кол-ва лайков и цвета кнопки
function changeLike(likes, cardButtonLike, cardLikesCounter) {
  cardLikesCounter.textContent = likes.length;
  cardButtonLike.classList.toggle('card__like-button_is-active');
}

export { makeCard, deleteCard, changeLike };
