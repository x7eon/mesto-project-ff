// Функция открытия поп-апа
function openPopup(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleClosePopupByEsc); // Обработчик закрытия попапа нажатием на Esc
}

// Функция закрытия поп-апа
function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleClosePopupByEsc);
}

// Обработчик закрытия поп-апа кликом по оверлею
function handleClosePopUpByOverlay(evt) {
  if (evt.currentTarget === evt.target) {
    closePopup(evt.target);
  }
}

// Обработчик закрытия поп-апа кнопкой Esc
function handleClosePopupByEsc(evt) {
  if (evt.key === 'Escape') {
    const popupOpened = document.querySelector('.popup_is-opened');
    closePopup(popupOpened);
  }
}

export { openPopup, closePopup, handleClosePopUpByOverlay };
