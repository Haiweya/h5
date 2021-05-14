import Api from './api'

class CommonApi extends Api {
    constructor(scope) {
        super()
        this.scope = scope
    }

    resolvePath(path) {
        return this.scope + path
    }

    records(params) {
        let path = this.resolvePath('/list')
        return this.post(path, params)
    }

    add(data) {
        let path = this.resolvePath('/add')
        return this.post(path, data)
    }

    delete(data) {
        let path = this.resolvePath('/delete')
        return this.post(path, data)
    }

    update(data) {
        let path = this.resolvePath('/update')
        return this.post(path, data)
    }

    detail(id) {
        let path = this.resolvePath('/' + id)
        return this.post(path)
    }
}

export default CommonApi
