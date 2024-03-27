//Токен: 062c2d24-ce77-4e9f-b919-86bf3fb69e18
//Идентификатор группы: wff-cohort-9

const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-9',
  headers: {
    authorization: '062c2d24-ce77-4e9f-b919-86bf3fb69e18',
    'Content-Type': 'application/json',
  },
};

// Функция проверки ответа сервера
const checkResponse = (res) => (res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`)) 

// Функция получения данных пользователя с сервера
const getUserProfile = (config) => {
  return fetch(`${config.baseUrl + '/users/me'}`, {
    headers: config.headers,
  })
  .then(res => checkResponse(res))
};

// Функция получения карточек с сервера
const getCards = (config) => {
  return fetch(`${config.baseUrl + '/cards'}`, {
    headers: config.headers,
  })
  .then(res => checkResponse(res))
};

// Функция отправки измененных данных профиля пользователя на сервер
const patchEditedUserProfile = (config, nameValue, descriptionValue) => {
  return fetch(`${config.baseUrl + '/users/me'}`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: nameValue,
      about: descriptionValue,
    }),
  }).then(res => checkResponse(res))
};

// Функция добавления карточки на сервер
const postCard = (config, cardObject) => {
  return fetch(`${config.baseUrl + '/cards'}`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: cardObject.name,
      alt: cardObject.name,
      link: cardObject.link,
    }),
  }).then(res => checkResponse(res))
};

// Функция удаления карточки с сервера
const deleteCardFromServer = (config, cardId) => {
  return fetch(`${config.baseUrl + '/cards/' + cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  })
  .then(res => checkResponse(res))
};

// Функция постановки лайка на сервере
const putLikeCard = (config, cardId) => {
  return fetch(`${config.baseUrl + '/cards/likes/' + cardId}`, {
    method: 'PUT',
    headers: config.headers,
  }).then(res => checkResponse(res))
};

// Функция снятия лайка на сервере
const deleteLikeCard = (config, cardId) => {
  return fetch(`${config.baseUrl + '/cards/likes/' + cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  }).then(res => checkResponse(res))
};

// Функция смены аватара на сервере
const patchAvatar = (config, avatarLink) => {
  return fetch(`${config.baseUrl + '/users/me/avatar'}`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatarLink,
    }),
  }).then(res => checkResponse(res))
};

export {
  config,
  getUserProfile,
  getCards,
  patchEditedUserProfile,
  postCard,
  deleteCardFromServer,
  putLikeCard,
  deleteLikeCard,
  patchAvatar,
};
