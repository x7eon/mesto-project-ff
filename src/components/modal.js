// Функция открытия поп-апа
function openPopup(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', closePopupByEsc); // Обработчик закрытия попапа нажатием на Esc
}

// Функция закрытия поп-апа
function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closePopupByEsc);
}

// Фукнция закрытия поп-апа кликом по оверлею
function closePopUpByOverlay(evt) {
  if (evt.currentTarget === evt.target) {
    closePopup(evt.target);
  }
}

// Функция закрытия поп-апа кнопкой Esc
function closePopupByEsc(evt) {
  if (evt.key === 'Escape') {
    const popupOpened = document.querySelector('.popup_is-opened');
    closePopup(popupOpened);
  }
}

export { openPopup, closePopup, closePopUpByOverlay };
