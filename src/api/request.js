import axios from 'axios'
import store from '../stores'
import ResponseCode from '@global/response-code'
import Settings, {
    requestTimeout
} from '@global/settings'
import {
    MessageBox,
    Message
} from 'element-ui'

const Codes = ResponseCode
const TokenKey = Settings.tokenKey

const request = axios.create({
    // eslint-disable-next-line no-undef
    baseURL: api_source.url,
    timeout: requestTimeout,
})

request.interceptors.request.use(
    config => {
        let headers = config.headers || {}
        let token = store.getters.token // getToken()
        if (token !== undefined) {
            headers[TokenKey] = token
        } else {
            headers[TokenKey] = 'Bearer token'
        }

        return config
    },
    error => {
        console.error('request error', error)
        return Promise.reject(error)
    },
)

const redirectLoginCode = [
    Codes.tokenExpire,
    Codes.tokenNotExist,
    Codes.tokenInvalid,
    Codes.accountAbnormal
]

request.interceptors.response.use(
    response => {
        let r = response
        let info = r.data || {}
        if (r.status === Codes.httpSuccess) {
            let token = response.headers.Authorization
            if (token !== undefined) {
                store.commit('user/set_token', token)
            }

            const {
                code,
                msg: message = 'Error',
                data,
            } = info

            if (code === Codes.success) {
                return Promise.resolve(data)
            } else if (redirectLoginCode.includes(code)) {
                MessageBox.confirm(
                    message,
                    '提示', {
                        confirmButtonText: '重新登录',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                    store.dispatch('user/reset-token').then(() => {
                        window.location.reload()
                    })
                })
                return Promise.reject({
                    message,
                    data
                })
            } else {
                Message.error(message)
                return Promise.reject({
                    message,
                    data
                })
            }
        } else {
            let message = '请求异常，请稍后再试!'
            // 多条接口报错时，只弹出一个弹框
            if (document.getElementsByClassName('el-message').length === 0) {
                Message.error(message)
            }
            return Promise.reject({
                message: message,
                data: info
            })
        }
    },
    error => {
        if (document.getElementsByClassName('el-message').length === 0) {
            Message.error(error.message)
        }
        return Promise.reject({
            message: error.message,
            data: error
        })
    },
)

export default request
