import Model from '../model'
import { UserApi } from '@api'

// 用户
class UserModel extends Model {
    constructor() {
        super()
        this.api = new UserApi()
    }

    login({ account, password }) {
        let data = {
            username: account,
            password,
        }
        return this.api.login(data)
    }

    loginPhone({ phone, code }) {
        let data = {
            phone,
            code,
        }
        return this.api.login(data)
    }

    changePassword({ password1: p }) {
        return this.api.changePassword({ password: p })
    }

    loadInfo() {
        return this.api.loadInfo()
    }

    sendCode(account) {
        return this.api.sendCode(account)
    }

    queryRoutes() {
        return this.api.queryRoutes()
    }

    logout() {
        return this.api.logout()
    }

    // 从用户中心加载远程搜索用户, 不传参数默认获取一个列表
    usersByUserCenter(params = {}) {
        let { key, ...args } = params
        let ps = { page: 1, per: 10, ...args }
        if (key !== undefined) {
            ps = Object.assign(ps, { name: `lk|${key}` })
        }
        return this.api.usersByUserCenter(ps).then(({ records }) => {
            records = records.map(({ id, name, phone }) => {
                return { id, name: name || '未分配名称', phone }
            })
            return records
        })
    }

    usersByUserCenterEdit(ids) {
        ids = [].concat(ids)
        return this.usersByUserCenter({ id: `in|${ids.join(';')}` })
    }
}

export default UserModel
