// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
const plasesList = document.querySelector(".places__list");

// @todo: Функция создания карточки
function makeCard(object, deleteCard) {
  const cardElement = cardTemplate.cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardButtonDel = cardElement.querySelector(".card__delete-button");

  cardImage.src = object.link;
  cardTitle.textContent = object.name;

  cardButtonDel.addEventListener("click", deleteCard);

  return cardElement;
}

// @todo: Функция удаления карточки

function deleteCard(evt) {
  const card = evt.target.closest(".card");
  card.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach(function (item) {
  plasesList.append(makeCard(item, deleteCard));
});
