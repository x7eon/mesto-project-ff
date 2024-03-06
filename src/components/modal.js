import { popupEditProfile, popupAddCard, popupImage } from './index.js';

// Функция открытия поп-апа
function openPopup(popup) {
  popup.classList.add('popup_is-opened'); 
}

// Функция закрытия поп-апа
function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
}

// Функция закрытия поп-апа кнопкой Esc
function closePopupByEsc(evt) {
  if (evt.key === 'Escape') {
    if (popupEditProfile.classList.contains('popup_is-opened')) {
      closePopup(popupEditProfile);
    }
    else if (popupAddCard.classList.contains('popup_is-opened')) {
      closePopup(popupAddCard);
    } 
    else if (popupImage.classList.contains('popup_is-opened')) {
      closePopup(popupImage);
    }
  }
}

// Закрытие поп-апов кликом по оверлею
function closePopUpByOverlay (evt) {
  if (evt.currentTarget === evt.target) {
    closePopup(evt.target);
  }
} 


export { openPopup, closePopup, closePopupByEsc, closePopUpByOverlay };