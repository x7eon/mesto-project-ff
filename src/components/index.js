import '../pages/index.css';
import { makeCard, deleteCard,  } from './card.js';
//likeCard
import { openPopup, closePopup, closePopUpByOverlay } from './modal.js';
import { validationSettings, enableValidation, clearValidation } from './validation.js';
import {
  config,
  getUserProfile,
  getCards,
  patchEditedUserProfile,
  postCard,
  patchAvatar,
  // deleteCardFromServer,
  // putLikeCard
} from './api.js';

//  Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// DOM узлы
const page = document.querySelector('.page');
const plasesList = page.querySelector('.places__list');
const popups = page.querySelectorAll('.popup');
const popupEditProfile = page.querySelector('.popup_type_edit');
const popupAddCard = page.querySelector('.popup_type_new-card');
const popupImage = page.querySelector('.popup_type_image');
const imagePopup = page.querySelector('.popup__image');
const captionImagePopup = page.querySelector('.popup__caption');
const profileName = page.querySelector('.profile__title');
const inputProfileName = page.querySelector('.popup__input_type_name');
const profileDescription = page.querySelector('.profile__description');
const inputProfileDescription = page.querySelector(
  '.popup__input_type_description'
);
const formAddCard = page.querySelector('.popup_type_new-card .popup__form');
const inputPlaceNameForm = formAddCard.querySelector(
  '.popup__input_type_card-name'
);
const inputLinkImageForm = formAddCard.querySelector('.popup__input_type_url');
const formEditProfile = page.querySelector('.popup_type_edit .popup__form');
const profileEditButton = page.querySelector('.profile__edit-button');
const cardAddButton = page.querySelector('.profile__add-button');
const popupCloseButtons = page.querySelectorAll('.popup__close');
const profileImage = page.querySelector('.profile__image');
const avatarProfile = page.querySelector('.profile__image');
const popupAvatar = page.querySelector('.popup_type_avatar');
const inputAvatarLink = page.querySelector('.popup__input_type_avatar-link');
const formAvatar = page.querySelector('.popup_type_avatar .popup__form');
const popupConfirmDeleteCard = page.querySelector('.popup_type_confirm');
const formConfirmDeleteCard = page.querySelector(
  '.popup_type_confirm .popup__form'
);

const buttonSubmitAvatar = page.querySelector('.popup_type_avatar .popup__button');
const buttonSubmitEditProfile = page.querySelector('.popup_type_edit .popup__button');
const buttonSubmitAddCard = page.querySelector('.popup_type_new-card .popup__button');
const buttonSubmitDelCard = page.querySelector('.popup_type_confirm .popup__button');
const buttonTextSettings = { 
  loading: 'Сохранение...',
  endLoading:  'Сохранить',
  deleting: 'Удаление...',
  endDeleting: 'Да'
}

// Получение массива объектов карточек с сервера, объекта с информацией о пользователе, вставка их в DOM
Promise.all([getCards(config), getUserProfile(config)])
  .then(([cards, userData]) => {
    profileName.textContent = userData.name; // Добавление имени пользователя в DOM
    profileDescription.textContent = userData.about; // Добавление описания пользователя в DOM
    profileImage.style.backgroundImage = `url(${userData.avatar})`; // Добавление ссылки на картинку для аватара в DOM
    const currentUserId = userData._id; // Запись id пользователя

    cards.forEach((card) => {
      plasesList.append(
        makeCard(
          card,
          // likeCard,
          setImageToPopup,
          openPopupImage,
          currentUserId,
          openPopupConfirmDeleteCard,
          handleLikeCard,
        )
      );
    });
  })
  .catch((err) => console.log(err));

let cardIdToDelete;
let cardElementToDelete;

// Функция открытия поп-апа подтверждения удаления карточки
function openPopupConfirmDeleteCard(cardId, currentCard) {
  cardIdToDelete = cardId;
  cardElementToDelete = currentCard;
  openPopup(popupConfirmDeleteCard);
}

// Обработчик отправки формы подтверждения удаления карточки
formConfirmDeleteCard.addEventListener('submit', (evt) => {
  evt.preventDefault();
  renderLoading(buttonSubmitDelCard, buttonTextSettings.deleting)
  deleteCardFromServer(config, cardIdToDelete)
    .then(() => {
      deleteCard(cardElementToDelete);
      closePopup(popupConfirmDeleteCard);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      renderLoading(buttonSubmitDelCard, buttonTextSettings.endDeleting)
    })
});

// Функция открытия поп-апа смены аватара
function openPopupAvatar() {
  formAvatar.reset();
  clearValidation(formAvatar, validationSettings);
  openPopup(popupAvatar);
}

// Функция смены аватара профиля
function handleFormAvatarSubmit(evt) {
  evt.preventDefault();
  renderLoading(buttonSubmitAvatar, buttonTextSettings.loading)
  const newAvatarLink = inputAvatarLink.value;
  patchAvatar(config, newAvatarLink)
    .then((userDataEdited) => {
      avatarProfile.style.backgroundImage = `url(${userDataEdited.avatar})`;
    })
    .catch((err) => console.log(err))
    .finally(() => {
      renderLoading(buttonSubmitAvatar, buttonTextSettings.endLoading)
    });
  closePopup(popupAvatar);
}

// Функция открытия поп-апа редактирования профиля
function openPopupProfileEdit() {
  inputProfileName.value = profileName.textContent;
  inputProfileDescription.value = profileDescription.textContent;
  clearValidation(formEditProfile, validationSettings);
  openPopup(popupEditProfile);
}

// Функция изменения данных профиля
function handleFormEditProfileSubmit(evt) {
  evt.preventDefault();
  renderLoading(buttonSubmitEditProfile, buttonTextSettings.loading)
  const nameValue = inputProfileName.value;
  const descriptionValue = inputProfileDescription.value;
  patchEditedUserProfile(config, nameValue, descriptionValue)
    .then((userDataEdited) => {
      profileName.textContent = userDataEdited.name;
      profileDescription.textContent = userDataEdited.about;
    })
    .catch((err) => console.log(err))
    .finally(() => {
      renderLoading(buttonSubmitEditProfile, buttonTextSettings.endLoading)
    });
  closePopup(popupEditProfile);
}

// Функция открытия поп-апа добавления карточки
function openPopupAddCard() {
  formAddCard.reset();
  clearValidation(formAddCard, validationSettings);
  openPopup(popupAddCard);
}

// Функция добавления новой карточки
function handleFormAddCardSubmit(evt) {
  evt.preventDefault();
  renderLoading(buttonSubmitAddCard, buttonTextSettings.loading);
  const cardObject = {};
  cardObject.name = inputPlaceNameForm.value;
  cardObject.link = inputLinkImageForm.value;
  postCard(config, cardObject)
    .then((card) => {
      const currentUserId = card.owner._id;
      const newCard = makeCard(
        card,
        setImageToPopup,
        openPopupImage,
        currentUserId,
        openPopupConfirmDeleteCard,
        handleLikeCard,
        card.likes
      );
      plasesList.prepend(newCard);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      renderLoading(buttonSubmitAddCard, buttonTextSettings.endLoading);
    });
  closePopup(popupAddCard);
  formAddCard.reset();
  clearValidation(formAddCard, validationSettings);
}

// Функция открытия поп-апа картинки
function openPopupImage() {
  openPopup(popupImage);
}

// Функция добавления картинки в поп-ап картинки
function setImageToPopup(name, link) {
    imagePopup.src = link;
    captionImagePopup.textContent = name;
    imagePopup.alt = name;
};

// Функция показа процесса загрузки данных на кнопке
const renderLoading = (button, content) => {
  button.textContent = content;
};

// Фукнция закрытия поп-апа кликом на крестик
function closePopupByButton(evt) {
  closePopup(evt.target.closest('.popup'));
}

// Обработчики закрытия поп-апов кликом по кнопке крестик
popupCloseButtons.forEach(function (closeButton) {
  closeButton.addEventListener('click', closePopupByButton);
});

// Обработчики закрытия поп-апов кликом по оверлею
popups.forEach(function (popup) {
  popup.addEventListener('click', closePopUpByOverlay);
});

// Обработчик submit смены аватара профиля
formAvatar.addEventListener('submit', handleFormAvatarSubmit);

// Обработчик submit сохранения данных профиля
// formEditProfile.addEventListener('submit', handleFormEditProfileSubmit);

formEditProfile.addEventListener('submit', handleFormEditProfileSubmit);

// Обработчик открытия поп-апа смены автара
avatarProfile.addEventListener('click', openPopupAvatar);

// Обработчик открытия поп-апа редактирования профиля
profileEditButton.addEventListener('click', openPopupProfileEdit);

// Обработчик открытия поп-апа добавления карточки
cardAddButton.addEventListener('click', openPopupAddCard);

// Обработчик submit для добавления новой карточки
formAddCard.addEventListener('submit', handleFormAddCardSubmit);

import { changeLike } from './card.js'
import { putLikeCard, deleteLikeCard } from './api.js'

// Функция лайка карточки
function handleLikeCard(status, cardId, cardButtonLike, cardLikesCounter, updateLikesArray) {
  !status ?
  putLikeCard(config, cardId)
  .then(res => {
    updateLikesArray(res.like);
    changeLike(res.likes, cardButtonLike, cardLikesCounter);
  })
  .catch(err => console.log(err)) 
  : deleteLikeCard(config, cardId)
  .then(res => {
    updateLikesArray(res.like);
    changeLike(res.likes, cardButtonLike, cardLikesCounter);
  })
  .catch(err => console.log(err))
}

enableValidation(validationSettings);

export { cardTemplate };
