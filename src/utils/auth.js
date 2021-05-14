import Cookies from 'js-cookie'
import {
    tokenKey
} from '../global/settings'

const keyByPre = (key) => {
    let port = window.location.port
    key = port + key
    return key
}

export function getToken() {
    let key = keyByPre(tokenKey)
    return Cookies.get(key)
}

export function setToken(token) {
    let key = keyByPre(tokenKey)
    return Cookies.set(key, token)
}

export function removeToken() {
    let key = keyByPre(tokenKey)
    return Cookies.remove(key)
}