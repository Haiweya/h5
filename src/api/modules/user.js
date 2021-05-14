import Api from '../api'

// 用户
class UserApi extends Api {
    constructor() {
        super()
        this.scope = '/user-center'
    }

    resolvePath(path) {
        return this.scope + path
    }

    login(data) {
        let path = this.resolvePath('/login')
        return this.post(path, data)
    }

    changePassword(data) {
        let path = this.resolvePath('/change-password')
        return this.post(path, data)
    }

    queryRoutes(data) {
        let path = this.resolvePath('/add-user')
        return this.post(path, data)
    }

    logout() {
        let path = this.resolvePath('/logout')
        return this.get(path)
    }

    loadInfo() {
        let path = this.resolvePath('/bytoken/select')
        return this.get(path)
    }

    usersByUserCenter({
        page,
        per,
        ...args
    }) {
        let path = this.resolvePath(`/select/sysUser/${page}/${per}`)
        return this.post(path, args)
    }

    departmentPath(page, per) {
        let path = this.resolvePath(`/select/sysDept/${page}/${per}`)
        return path
    }

    arePath(page, per) {
        let path = this.resolvePath(`/select/sysRegion/${page}/${per}`)
        return path
    }

    // 分页区域路段
    areListPath(page, per) {
        let path = this.resolvePath(`/select/sysRegionRangeLink/showPage/${page}/${per}`)
        return path
    }
}

export default UserApi