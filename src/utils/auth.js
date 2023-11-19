import Cookies from 'js-cookie'

const TokenKey = 'Admin-ID'
const IdKey = 'ID'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setId(id) {

  return Cookies.set(IdKey, id)
}

export function getId() {
  return Cookies.get(IdKey)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
