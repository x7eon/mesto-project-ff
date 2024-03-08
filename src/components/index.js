import '../pages/index.css';
import { initialCards } from './cards.js';
import { makeCard, deleteCard, likeCard } from './card.js';
import { openPopup, closePopup, closePopUpByOverlay } from './modal.js';

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
const inputProfileDescription = page.querySelector('.popup__input_type_description')
const formAddCard = page.querySelector('.popup_type_new-card .popup__form');
const inputPlaceNameForm = formAddCard.querySelector('.popup__input_type_card-name');
const inputLinkImageForm = formAddCard.querySelector('.popup__input_type_url');
const formEditProfile = page.querySelector('.popup_type_edit .popup__form');
const profileEditButton = page.querySelector('.profile__edit-button');
const cardAddButton = page.querySelector('.profile__add-button');
const popupCloseButtons = page.querySelectorAll('.popup__close');

// Вывести карточки на страницу
initialCards.forEach(function (item) {
  plasesList.append(makeCard(item, deleteCard, likeCard, setImageToPopup, openPopupImage));
});

// Функция открытия поп-апа редактирования профиля 
function openPopupProfileEdit() {
  inputProfileName.value = profileName.textContent;
  inputProfileDescription.value = profileDescription.textContent;
  openPopup(popupEditProfile);
}

// Функция открытия поп-апа добавления карточки
function openPopupAddCard() {
  openPopup(popupAddCard);
}

// Функция добавления картинки в поп-ап картинки 
function setImageToPopup(evt) {
  const card = evt.target.closest('.card'); 
  const cardTitle = card.querySelector('.card__title'); 
  if (evt.target.classList.contains('card__image')) { 
    imagePopup.src = evt.target.src; 
    captionImagePopup.textContent = cardTitle.textContent; 
    imagePopup.alt = cardTitle.textContent; 
  } 
}

// Функция открытия поп-апа картинки
function openPopupImage() {
  openPopup(popupImage);
}

// Функция добавления новой карточки
function handleFormAddCardSubmit(evt) {
  evt.preventDefault();
  const cardObject = {};
  cardObject.name = inputPlaceNameForm.value;
  cardObject.alt = inputPlaceNameForm.value;
  cardObject.link = inputLinkImageForm.value;
  const newCard = makeCard(cardObject, deleteCard, likeCard, setImageToPopup, openPopupImage);
  plasesList.prepend(newCard);
  closePopup(popupAddCard);
  formAddCard.reset();
}

// Фукнция закрытия поп-апа кликом на крестик
function closePopupByButton (evt) {
  closePopup(evt.target.closest('.popup'));
}

// Функция изменения данных профиля
function handleFormEditProfileSubmit(evt) {
  evt.preventDefault(); 
  profileName.textContent = inputProfileName.value;
  profileDescription.textContent = inputProfileDescription.value;
  closePopup(popupEditProfile);
}

// Обработчики закрытия поп-апов кликом по кнопке крестик
popupCloseButtons.forEach(function(closeButton) {
  closeButton.addEventListener('click', closePopupByButton)
});

// Обработчики закрытия поп-апов кликом по оверлею
popups.forEach(function(popup) {
  popup.addEventListener('click', closePopUpByOverlay);
});

// Обработчик submit сохранения данных профиля
formEditProfile.addEventListener('submit', handleFormEditProfileSubmit);

// Обработчик открытия поп-апа редактирования профиля
profileEditButton.addEventListener('click', openPopupProfileEdit);

// Обработчик открытия поп-апа добавления карточки
cardAddButton.addEventListener('click', openPopupAddCard);

// Обработчик submit для добавления новой карточки
formAddCard.addEventListener('submit', handleFormAddCardSubmit);

export { cardTemplate };