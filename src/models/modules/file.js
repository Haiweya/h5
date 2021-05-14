import {
    FileApi
} from '@api'
import store from '../../stores'
import Settings from '@global/settings'

const TokenKey = Settings.tokenKey

// 文件相关操作
class FileModel {
    constructor() {
        this.api = new FileApi()
    }

    headers() {
        let token = store.getters.token
        let headers = {
            'content-type': 'multipart/form-data'
        }
        if (token !== undefined) {
            headers[TokenKey] = token
        } else {
            headers[TokenKey] = 'Bearer token'
        }
        return headers
    }

    upload(file) {
        return this.api.upload(file)
    }

    download(url) {
        return this.api.download(url)
    }

    downloadFile(file) {
        return this.api.downloadFile(file)
    }

    delete(id) {
        return this.api.delete(id)
    }

    // 批量删除
    deletes(fileList) {
        const data = fileList.map(item => {
            return {
                file: item.raw.id,
            }
        })
        return this.api.deletes(data)
    }

    downLoadStore(url) {
        return this.api.downLoadStore(url)
    }

    uploadFiles() {

    }
}

export default FileModel