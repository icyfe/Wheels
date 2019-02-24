(function () {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global) ||
        this || {};
    function EventEmitter() {
        this._event = {}
    }
    function indexOf(listeners, listener) {
        if (!listener) return
        let result = -1
        let item = typeof listener == 'object' ? listener.listener : listener
        for (let i = 0; i < listeners.length; i++) {
            if (item == listeners[i].listener) {
                result = i
                break
            }
        }
        return result
    }
    //判断是否为函数否则就抛错
    function isValidListener(listener) {
        if (typeof listener == 'function') {
            return true
        } else if (listener && typeof listener == 'object') {
            isValidListener(listener.listener)
        } else {
            return false
        }
    }
    let proto = EventEmitter.prototype
    //注册监听事件
    proto.on = function (eventname, listener) {

        if (!isValidListener(listener)) {
            return new TypeError('listener must be a funcition')
        }

        const event = this._event
        const listeners = event[eventname] = event[eventname] || []
        //判读是否已经是被包裹的监听事件，否则就默认可以执行多次
        const listenerIsWrapped = typeof listener == 'object'
        if (indexOf(listeners, listener) == -1) {
            listeners.push(listenerIsWrapped ? listener : {
                listener,
                once: false
            })
        }
    }
    //只能执行一次的监听事件
    proto.once = function (eventname, listener) {
        return this.on(eventname, {
            listener,
            once: true
        })
    }
    //移除事件
    // params1:事件名称，
    //params2:要移除的事件函数
    proto.off = function (eventname, listener) {
        let listeners = this._event(eventname)
        let idx = 0
        if (!listeners) return
        for (let i = 0; i < listeners.length; i++) {
            if (listener == listeners[i]) {
                idx = i;
                break
            }
        }
        if (idx) {
            listeners.splice(idx, 1, null)
        }
        return this
    }
    // 触发事件emit
    //params1:要触发非事件，
    //params2:要触发的函数
    proto.emit = function (eventname, arg) {
        let listeners = this._event[eventname]//取出事件组

        if (!listeners) return

        for (let i = 0; i < listeners.length; i++) {
            let listener = listeners[i]
            listener.listener.apply(this, arg)
            if (listener.once) {
                this.off(eventname, listener)
            }
        }
        return this
    }
    // 删除某一个类型的所有事件，支持只传入具体事件只删除当前传入的事件
    proto.alloff = function (eventname) {
        if (eventname) {
            this._event[eventname] = [] //如果有具体事件就只删除当前的
        } else {
            this._event = {} //否則就刪除所有的事件
        }
        return this
    }
    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = EventEmitter;
        }
        exports.EventEmitter = EventEmitter;
    } else {
        root.EventEmitter = EventEmitter;
    }
}());