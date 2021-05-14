import store from '@stores'

class WS {
    static ws = undefined
    static retryTimesMax = 10

    static get instance() {
        if (this.ws === undefined) {
            this.ws = new WS()
        }
        return this.ws
    }

    path() {
        return process.env.VUE_APP_WS_URL
    }

    constructor() {
        this.connected = false
        this.retryTimes = 0
        this.messages = []
        this.subs = {}
        this.init()
    }

    maxRetry() {
        return this.retryTimes > WS.retryTimesMax
    }

    // 生成 uuid
    uuid(len = 10) {
        let s = 'abcdefghijklmnopqrstuvwxyz01234567890'
        let r = []
        while (r.length < len) {
            let index = s.length * Math.random()
            index = Math.trunc(index)
            let c = s[index]
            r.push(c)
        }

        r = r.join('')
        r = r + (new Date()).valueOf()
        return r
    }

    init() {
        let path = this.path()
        if (!path) {
            console.error('websokcet address undefined')
            return
        }
        if (typeof WebSocket === 'undefined') {
            console.error('socket invalid!')
            return
        }
        path = path + '/' + this.uuid()
        this.socket = new WebSocket(path)
        this.bindEvents()
    }

    bindEvents() {
        this.socket.onopen = this.onOpen.bind(this)
        this.socket.onmessage = this.onMessage.bind(this)
        this.socket.onclose = this.onClose.bind(this)
        this.socket.onerror = this.onError.bind(this)
    }

    send(type, params = {}) {
        let token = store.getters.token
        let s = {
            methodName: type,
            params,
            token,
        }
        try {
            s = JSON.stringify(s)
            if (this.connected) {
                this.sendData(s)
            } else if (this.socket.readyState === WebSocket.CONNECTING) {
                this.queueMessage(s)
            } else {
                this.queueMessage(s)
                this.retryConnect()
            }
        } catch (e) {
            console.log('send message error')
        }
    }

    sendData(data) {
        this.socket.send(data)
    }

    // 订阅指定的消息类型
    // 收到对应的消息类型, 执行回调函数
    sub(type, callback) {
        if (Object.prototype.toString.call(callback) !== '[object Function]') {
            return
        }
        let prev = this.subs[type] || []
        if (!prev.includes(callback)) {
            prev.push(callback)
            this.subs[type] = prev
        }
    }

    // 取消订阅
    unSub(type, callback) {
        let callbacks = this.subs[type] || []
        let index = callbacks.findIndex(cb => cb === callback)
        if (index !== -1) {
            callbacks.splice(index, 1)
        }
        this.subs[type] = callbacks
    }

    onOpen() {
        this.connected = true
        this.retryTimes = 0
        this.sendCachedMessage()
        // this.sendHeartBeat()
    }

    onMessage(ps = {}) {
        let data = ps.data || '{}'
        try {
            let parsedData = JSON.parse(data)
            let code = parsedData.code
            if (code === 200) {
                let ps = parsedData.params
                let type = ps.methodName
                let callbacks = this.subs[type] || []
                let data = parsedData.data || {}
                if (callbacks.length > 0) {
                    for (let callback of callbacks) {
                        callback(data)
                    }
                } else {
                    console.log('unsubscribed message type', type)
                }
            }
        } catch (e) {
            console.error('websocket recv message parsed fail', e)
        }
    }

    onClose() {
        // 前端主动关闭
        // 连接异常关闭
        // 服务器主动关闭连接
        this.connected = false
    }

    // 连接失败
    onError(ps) {
        this.connected = false
        this.retryConnect()
        console.log('onError', ps)
    }

    sendCachedMessage() {
        let ms = [...this.messages]
        this.messages = []
        ms.forEach(m => this.sendData(m))
    }

    sendHeartBeat() {
        if (this.connected) {
            let ts = (new Date()).valueOf()
            this.send('sys_heartbeat', ts)
        }
    }

    retryConnect() {
        if (!this.maxRetry()) {
            this.close()
            this.init()
            this.retryTimes += 1
        }
    }

    queueMessage(message) {
        if (!this.messages.includes(message)) {
            this.messages.push(message)
        }
    }

    close() {
        this.connected = false
        this.socket && this.socket.close()
    }
}

export default WS
