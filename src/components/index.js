import "../pages/index.css";
import { makeCard, deleteCard, likeCard } from "./card.js";
import { openPopup, closePopup, closePopUpByOverlay } from "./modal.js";
import { validationSettings } from "./validation.js";
import { enableValidation, clearValidation } from "./validation.js";
import {
  config,
  getUserProfile,
  getCards,
  patchEditedUserProfile,
  postCard,
  patchAvatar,
} from "./api.js";

import { deleteCardFromServer } from "./api.js";

//  Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// DOM узлы
const page = document.querySelector(".page");
const plasesList = page.querySelector(".places__list");
const popups = page.querySelectorAll(".popup");
const popupEditProfile = page.querySelector(".popup_type_edit");
const popupAddCard = page.querySelector(".popup_type_new-card");
const popupImage = page.querySelector(".popup_type_image");
const imagePopup = page.querySelector(".popup__image");
const captionImagePopup = page.querySelector(".popup__caption");
const profileName = page.querySelector(".profile__title");
const inputProfileName = page.querySelector(".popup__input_type_name");
const profileDescription = page.querySelector(".profile__description");
const inputProfileDescription = page.querySelector(
  ".popup__input_type_description"
);
const formAddCard = page.querySelector(".popup_type_new-card .popup__form");
const inputPlaceNameForm = formAddCard.querySelector(
  ".popup__input_type_card-name"
);
const inputLinkImageForm = formAddCard.querySelector(".popup__input_type_url");
const formEditProfile = page.querySelector(".popup_type_edit .popup__form");
const profileEditButton = page.querySelector(".profile__edit-button");
const cardAddButton = page.querySelector(".profile__add-button");
const popupCloseButtons = page.querySelectorAll(".popup__close");
const profileImage = page.querySelector(".profile__image");
const avatarProfile = page.querySelector(".profile__image");
const popupAvatar = page.querySelector(".popup_type_avatar");
const inputAvatarLink = page.querySelector(".popup__input_type_avatar-link");
const formAvatar = page.querySelector(".popup_type_avatar .popup__form");

const popupConfirmDeleteCard = page.querySelector(".popup_type_confirm");
const formConfirmDeleteCard = page.querySelector(
  ".popup_type_confirm .popup__form"
);

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
          deleteCard,
          likeCard,
          setImageToPopup,
          openPopupImage,
          currentUserId,
          popupConfirmDeleteCard
        )
      );
    });
  })
  .catch((err) => console.log(err));

// НОВЫЙ КОД

// Функция открытия поп-апа подтверждения удаления карточки
export function openPopupConfirmDeleteCard() {
  openPopup(popupConfirmDeleteCard);
}

import { cardIdToDelete } from "./card.js";
import { cardElementToDelete } from "./card.js";

// Обработчик отправки формы подтверждения удаления карточки
formConfirmDeleteCard.addEventListener("submit", (evt) => {
  evt.preventDefault();
  deleteCardFromServer(config, cardIdToDelete)
    .then((res) => {
      if (res.ok) {
        deleteCard(cardElementToDelete);
      }
    })
    .catch((err) => console.log(err));
  closePopup(popupConfirmDeleteCard);
});

// КОНЕЦ НОВОГО КОДА

// Функция открытия поп-апа смены аватара
function openPopupAvatar() {
  formAvatar.reset();
  clearValidation(formAvatar, validationSettings);
  openPopup(popupAvatar);
}

// Функция смены аватара профиля
function handleFormAvatarSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, popupAvatar);
  const newAvatarLink = inputAvatarLink.value;
  patchAvatar(config, newAvatarLink)
    .then((userDataEdited) => {
      avatarProfile.style.backgroundImage = `url(${userDataEdited.avatar})`;
    })
    .catch((err) => console.log(err))
    .finally(() => {
      renderLoading(false, popupAvatar);
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
  renderLoading(true, popupEditProfile);
  const nameValue = inputProfileName.value;
  const descriptionValue = inputProfileDescription.value;
  patchEditedUserProfile(config, nameValue, descriptionValue)
    .then((userDataEdited) => {
      profileName.textContent = userDataEdited.name;
      profileDescription.textContent = userDataEdited.about;
    })
    .catch((err) => console.log(err))
    .finally(() => {
      renderLoading(false, popupEditProfile);
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
  renderLoading(true, popupAddCard);
  const cardObject = {};
  cardObject.name = inputPlaceNameForm.value;
  cardObject.alt = inputPlaceNameForm.value;
  cardObject.link = inputLinkImageForm.value;
  postCard(config, cardObject)
    .then((card) => {
      const currentUserId = card.owner._id;
      const newCard = makeCard(
        card,
        deleteCard,
        likeCard,
        setImageToPopup,
        openPopupImage,
        currentUserId
      );
      plasesList.prepend(newCard);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      renderLoading(false, popupAddCard);
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
function setImageToPopup(evt) {
  const card = evt.target.closest(".card");
  const cardTitle = card.querySelector(".card__title");
  if (evt.target.classList.contains("card__image")) {
    imagePopup.src = evt.target.src;
    captionImagePopup.textContent = cardTitle.textContent;
    imagePopup.alt = cardTitle.textContent;
  }
}

// Функция показа процесса загрузки данных на кнопке
const renderLoading = (isLoading, popupElement) => {
  const popupButton = popupElement.querySelector(".popup__button");
  isLoading
    ? (popupButton.textContent = "Сохранение...")
    : (popupButton.textContent = "Сохранить");
};

// Фукнция закрытия поп-апа кликом на крестик
function closePopupByButton(evt) {
  closePopup(evt.target.closest(".popup"));
}

// Обработчики закрытия поп-апов кликом по кнопке крестик
popupCloseButtons.forEach(function (closeButton) {
  closeButton.addEventListener("click", closePopupByButton);
});

// Обработчики закрытия поп-апов кликом по оверлею
popups.forEach(function (popup) {
  popup.addEventListener("click", closePopUpByOverlay);
});

// Обработчик submit смены аватара профиля
formAvatar.addEventListener("submit", handleFormAvatarSubmit);

// Обработчик submit сохранения данных профиля
formEditProfile.addEventListener("submit", handleFormEditProfileSubmit);

// Обработчик открытия поп-апа смены автара
avatarProfile.addEventListener("click", openPopupAvatar);

// Обработчик открытия поп-апа редактирования профиля
profileEditButton.addEventListener("click", openPopupProfileEdit);

// Обработчик открытия поп-апа добавления карточки
cardAddButton.addEventListener("click", openPopupAddCard);

// Обработчик submit для добавления новой карточки
formAddCard.addEventListener("submit", handleFormAddCardSubmit);

enableValidation(validationSettings);

export { cardTemplate };
