import Api from '../api'
import store from '../../stores'
import { tokenKey, uploadFileTimeout } from '@global/settings'

// 文件, 图片等上传, 下载
class FileApi extends Api {
    constructor() {
        super()
        this.scope = '/file'
    }

    resolvePath(path) {
        return this.scope + path
    }

    // 全路径, 包括 base url
    uploadUrl() {
        // eslint-disable-next-line no-undef
        let base = api_source.url
        let path = this.resolvePath('/Upload')
        return base + path
    }

    upload(file) {
        let form = new FormData()
        form.append('file', file)
        let headers = this._headers()
        let path = this.resolvePath('/Upload')
        return this.post(path, form, {
            headers,
            timeout: uploadFileTimeout,
        })
    }

    uploadFiles(files) {
        let form = new FormData()
        form.append('files', files)
        let headers = this._headers()
        let path = this.resolvePath('/Upload-files')
        return this.post(path, form, {
            headers,
        })
    }

    download(url, name) {
        // 开发模式下, 去除 url 中的主机名, 解决跨域问题
        let isDev = process.env.NODE_ENV === 'development'
        if (isDev) {
            let downloadTag = '/api/device/file/download/'
            url = downloadTag + url.split(downloadTag)[1]
        }

        let headers = this._headers()
        this.customerGet(url, {
            headers: headers,
            responseType: 'blob',
        }).then(res => {
            let data = res.data
            let headers = res.headers
            let disposition = headers['content-disposition']
            let filename = disposition.split('filename=')[1]
            filename = decodeURI(filename)
            filename = name || filename.replace(/"/g, '')

            let save = (window.navigator || {}).msSaveOrOpenBlob
            if (save) {
                save(data, filename)
            } else {
                const createObjectUrl = (blob) => {
                    return (window.URL) ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob)
                }
                let b = new Blob([data])
                let bl = createObjectUrl(b)

                let a = document.createElement('a')
                a.href = bl
                a.download = filename
                a.click()
                window.URL.revokeObjectURL(bl)
            }
        })
    }

    downloadFile(file) {
        let path = `/api/emer/file/download/${encodeURI(file)}`
        return this.download(path)
    }

    delete(id) {
        let path = this.resolvePath('/delete')
        return this.post(path, { file: id })
    }

    // 批量删除
    deletes(data) {
        let path = this.resolvePath('/delete/list')
        return this.post(path, data)
    }

    _headers() {
        let token = store.getters.token
        let headers = { 'content-type': 'multipart/form-data' }
        if (token !== undefined) {
            headers[tokenKey] = token
        } else {
            headers[tokenKey] = 'Bearer token'
        }
        return headers
    }
}

export default FileApi
