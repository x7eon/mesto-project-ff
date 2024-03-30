import '../pages/index.css';
import { makeCard, deleteCard, changeLike } from './card.js';
import { openPopup, closePopup, handleClosePopUpByOverlay } from './modal.js';
import {
  validationSettings,
  enableValidation,
  clearValidation,
} from './validation.js';
import {
  config,
  getUserProfile,
  getCards,
  patchEditedUserProfile,
  postCard,
  patchAvatar,
  deleteCardFromServer,
  putLikeCard,
  deleteLikeCard,
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

const buttonSubmitAvatar = page.querySelector(
  '.popup_type_avatar .popup__button'
);
const buttonSubmitEditProfile = page.querySelector(
  '.popup_type_edit .popup__button'
);
const buttonSubmitAddCard = page.querySelector(
  '.popup_type_new-card .popup__button'
);
const buttonSubmitDelCard = page.querySelector(
  '.popup_type_confirm .popup__button'
);
const buttonTextSettings = {
  loading: 'Сохранение...',
  endLoading: 'Сохранить',
  deleting: 'Удаление...',
  endDeleting: 'Да',
};

// Переменные для сохранения id и элемента карточки
let cardIdToDelete;
let cardElementToDelete;

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
          currentUserId,
          handleSetImageToPopup,
          handleOpenPopupImage,
          handleOpenPopupDelCard,
          handleLikeCard
        )
      );
    });
  })
  .catch((err) => console.log(err));

// Обработчик открытия поп-апа подтверждения удаления карточки
function handleOpenPopupDelCard(cardId, currentCard) {
  cardIdToDelete = cardId;
  cardElementToDelete = currentCard;
  openPopup(popupConfirmDeleteCard);
}

// Обработчик открытия поп-апа смены аватара
function handleOpenPopupAvatar() {
  formAvatar.reset();
  clearValidation(formAvatar, validationSettings);
  openPopup(popupAvatar);
}

// Обработчик смены аватара профиля
function handleFormAvatarSubmit(evt) {
  evt.preventDefault();
  renderLoading(buttonSubmitAvatar, buttonTextSettings.loading);
  const newAvatarLink = inputAvatarLink.value;
  patchAvatar(config, newAvatarLink)
    .then((userDataEdited) => {
      avatarProfile.style.backgroundImage = `url(${userDataEdited.avatar})`;
      closePopup(popupAvatar);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      renderLoading(buttonSubmitAvatar, buttonTextSettings.endLoading);
    });
}

// Обработчик открытия поп-апа редактирования профиля
function handleOpenPopupProfileEdit() {
  inputProfileName.value = profileName.textContent;
  inputProfileDescription.value = profileDescription.textContent;
  clearValidation(formEditProfile, validationSettings);
  openPopup(popupEditProfile);
}

// Обработчик изменения данных профиля
function handleFormEditProfileSubmit(evt) {
  evt.preventDefault();
  renderLoading(buttonSubmitEditProfile, buttonTextSettings.loading);
  const nameValue = inputProfileName.value;
  const descriptionValue = inputProfileDescription.value;
  patchEditedUserProfile(config, nameValue, descriptionValue)
    .then((userDataEdited) => {
      profileName.textContent = userDataEdited.name;
      profileDescription.textContent = userDataEdited.about;
      closePopup(popupEditProfile);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      renderLoading(buttonSubmitEditProfile, buttonTextSettings.endLoading);
    });
}

// Обработчик открытия поп-апа добавления карточки
function handleOpenPopupAddCard() {
  formAddCard.reset();
  clearValidation(formAddCard, validationSettings);
  openPopup(popupAddCard);
}

// Обработчик добавления новой карточки
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
        currentUserId,
        handleSetImageToPopup,
        handleOpenPopupImage,
        handleOpenPopupDelCard,
        handleLikeCard
      );
      plasesList.prepend(newCard);
      closePopup(popupAddCard);
      formAddCard.reset();
    })
    .catch((err) => console.log(err))
    .finally(() => {
      renderLoading(buttonSubmitAddCard, buttonTextSettings.endLoading);
    });
}

// Обработчик открытия поп-апа картинки
function handleOpenPopupImage() {
  openPopup(popupImage);
}

// Обработчик добавления картинки в поп-ап картинки
function handleSetImageToPopup(name, link) {
  imagePopup.src = link;
  captionImagePopup.textContent = name;
  imagePopup.alt = name;
}

// Функция показа процесса загрузки данных на кнопке
const renderLoading = (button, content) => {
  button.textContent = content;
};

// Обработчик закрытия поп-апа кликом на крестик
function handleClosePopupByButton(evt) {
  closePopup(evt.target.closest('.popup'));
}

// Обработчик лайка карточки
function handleLikeCard(
  status,
  cardId,
  cardButtonLike,
  cardLikesCounter,
  updateLikesArray
) {
  !status
    ? putLikeCard(config, cardId)
        .then((res) => {
          updateLikesArray(res.likes);
          changeLike(res.likes, cardButtonLike, cardLikesCounter);
        })
        .catch((err) => console.log(err))
    : deleteLikeCard(config, cardId)
        .then((res) => {
          updateLikesArray(res.likes);
          changeLike(res.likes, cardButtonLike, cardLikesCounter);
        })
        .catch((err) => console.log(err));
}

// Обработчик подтверждения удаления карточки
function handleConfirmDelCard(evt) {
  evt.preventDefault();
  renderLoading(buttonSubmitDelCard, buttonTextSettings.deleting);
  deleteCardFromServer(config, cardIdToDelete)
    .then(() => {
      deleteCard(cardElementToDelete);
      closePopup(popupConfirmDeleteCard);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      renderLoading(buttonSubmitDelCard, buttonTextSettings.endDeleting);
    });
}

// Установка обработчика подтверждения удаления карточки
formConfirmDeleteCard.addEventListener('submit', handleConfirmDelCard);

// Установка обработчиков закрытия поп-апов кликом по кнопке крестик
popupCloseButtons.forEach(function (closeButton) {
  closeButton.addEventListener('click', handleClosePopupByButton);
});

// Установка обработчиков закрытия поп-апов кликом по оверлею
popups.forEach(function (popup) {
  popup.addEventListener('click', handleClosePopUpByOverlay);
});

// Установка обработчика submit смены аватара профиля
formAvatar.addEventListener('submit', handleFormAvatarSubmit);

// Установка обработчика submit сохранения данных профиля
formEditProfile.addEventListener('submit', handleFormEditProfileSubmit);

// Установка обработчика открытия поп-апа смены автара
avatarProfile.addEventListener('click', handleOpenPopupAvatar);

// Установка обработчика открытия поп-апа редактирования профиля
profileEditButton.addEventListener('click', handleOpenPopupProfileEdit);

// Установка обработчика открытия поп-апа добавления карточки
cardAddButton.addEventListener('click', handleOpenPopupAddCard);

// Установка обработчика submit для добавления новой карточки
formAddCard.addEventListener('submit', handleFormAddCardSubmit);

// Включение валидации
enableValidation(validationSettings);

export { cardTemplate };
