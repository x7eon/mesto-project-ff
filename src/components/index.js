import '../pages/index.css';
import { initialCards } from './cards.js';
import { makeCard, deleteCard, likeCard } from './card.js';
import { openPopup, closePopup, closePopupByEsc, closePopUpByOverlay } from './modal.js';

//  Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// DOM узлы
const page = document.querySelector('.page');
const plasesList = page.querySelector('.places__list');
const popups = page.querySelectorAll('.popup');
const popupEditProfile = page.querySelector('.popup_type_edit');
const popupAddCard = page.querySelector('.popup_type_new-card');
const popupImage = page.querySelector('.popup_type_image');
const profileName = page.querySelector('.profile__title');
const profileNameInput = page.querySelector('.popup__input_type_name');
const profileDescription = page.querySelector('.profile__description');
const profileDescriptionInput = page.querySelector('.popup__input_type_description')
const formAddCard = page.querySelector('.popup_type_new-card .popup__form');
const placeName = formAddCard.querySelector('.popup__input_type_card-name');
const linkImage = formAddCard.querySelector('.popup__input_type_url');
const formEditProfile = page.querySelector('.popup_type_edit .popup__form');
const nameInput = formEditProfile.querySelector('.popup__input_type_name');
const jobInput = formEditProfile.querySelector('.popup__input_type_description'); 

// Вывести карточки на страницу
initialCards.forEach(function (item) {
  plasesList.append(makeCard(item, deleteCard));
});

// Открытие поп-апа редактирования профиля, добавления карточки, картинки
page.addEventListener('click', function(evt) {
  if (evt.target.classList.contains('profile__edit-button')) {
    openPopup(popupEditProfile);
    profileNameInput.value = profileName.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
    document.addEventListener('keydown', closePopupByEsc); // Закрытие попапа нажатием на Esc
  }
  else if (evt.target.classList.contains('profile__add-button')) {
    openPopup(popupAddCard);
    document.addEventListener('keydown', closePopupByEsc); // Закрытие попапа нажатием на Esc
  }
  else if (evt.target.classList.contains('card__image')) {
    openPopup(popupImage);
    document.addEventListener('keydown', closePopupByEsc); // Закрытие попапа нажатием на Esc
  }
  else if (evt.target.classList.contains('popup__close')) {
    closePopup(evt.target.closest('.popup'));
    document.removeEventListener('keydown', closePopupByEsc);
  }
});

// Обработчики закрытия поп-апов кликом по оверлею
popups.forEach(function(popup) {
  popup.addEventListener('click', closePopUpByOverlay);
});

// Функция изменения данных профиля
function handleFormEditProfileSubmit(evt) {
  evt.preventDefault(); 
  profileName.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closePopup(popupEditProfile);
}

// Обработчик submit сохранения данных профиля
formEditProfile.addEventListener('submit', handleFormEditProfileSubmit);

// Функция добавления новой карточки
function handleFormAddCardSubmit(evt) {
  evt.preventDefault();
  const cardObject = {};
  cardObject.name = placeName.value;
  cardObject.alt = placeName.value;
  cardObject.link = linkImage.value;
  const newCard = makeCard(cardObject, deleteCard, likeCard, setImageToPopup);
  plasesList.prepend(newCard);
  closePopup(popupAddCard);
  placeName.value = '';
  linkImage.value = '';
}

// Обработчик submit для добавления новой карточки
formAddCard.addEventListener('submit', handleFormAddCardSubmit);

// Обработчик лайка карточки
plasesList.addEventListener('click', likeCard);

// Функция добавления картинки в поп-ап картинки
function setImageToPopup(evt) {
  const imagePopup = page.querySelector('.popup__image');
  const captionPopup = page.querySelector('.popup__caption');
  const card = evt.target.closest('.card');
  const cardTitle = card.querySelector('.card__title');
  if (evt.target.classList.contains('card__image')) {
    imagePopup.src = evt.target.src;
    captionPopup.textContent = cardTitle.textContent;
    imagePopup.alt = cardTitle.textContent;
  }
}

// Обработчик добавления картинки в поп-ап картинки
plasesList.addEventListener('click', setImageToPopup); 


export { cardTemplate, popupEditProfile, popupAddCard, popupImage };