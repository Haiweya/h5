import {
    getToken,
    removeToken
} from '@utils/auth'

const defaultState = () => {
    return {
        token: getToken(),
        avatar: {},
    }
}

const getters = {

}

const mutations = {
    set_avatar: (state, avatar) => {
        state.avatar = avatar
    },
    set_token: (state, token) => {
        state.token = token
    },
    reset: (state) => {
        state = Object.assign({}, state, defaultState())
    },
    reset_token: (state) => {
        state.token = undefined
    }
}

const actions = {
    query({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {})
    },
    permissions({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {})
    },
    'reset-token'({
        commit,
        state
    }) {
        removeToken()
        commit('reset_token')
        commit('reset')
    }
}

export default {
    namespaced: true,
    state: defaultState(),
    getters,
    mutations,
    actions,
}