import request from './request'
import axios from 'axios'

class Api {
    get(path, params = {}) {
        let config = { params }
        return request.get(path, config)
    }

    post(path, data = {}, config = {}) {
        return request.post(path, data, config)
    }

    // customerGet, customerPost
    // 自定义请求, 需指定绝对 url
    // 自己处理请求和响应逻辑 (如: 指定 headers 等)
    customerGet(url, config = {}) {
        return axios.get(url, config)
    }

    customerPost(url, data, config = {}) {
        return axios.post(url, data, config)
    }
}

export default Api
