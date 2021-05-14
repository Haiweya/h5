class Model {
    records(cond) {
        return this.api.records(cond)
    }

    recordsTrans(cond, { pageNo = 1, pageSize = 10 }) {
        let cs = { ...cond, pageNo, pageSize }
        cs = this.filterNull(cs)
        return this.records(cs).then(({ records, size, total }) => {
            let pager = {
                pageNo,
                pageSize: pageSize,
                total,
            }

            return {
                records,
                pager,
            }
        })
    }

    add(data) {
        return this.api.add(data)
    }

    delete(id) {
        return this.api.delete(id)
    }

    update(data) {
        return this.api.update(data)
    }

    detail(id) {
        return this.api.detail(id)
    }

    filterNull(params) {
        let ps = Object.entries(params).reduce((acc, [k, v]) => {
            let nullable = v === null || v === '' || v === undefined
            if (!nullable) {
                acc[k] = v
            }
            return acc
        }, {})

        return ps
    }
}

export default Model
