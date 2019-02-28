(function () {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global) ||
        this || {};
    var util = {
        extend(target) {
            let arg = [...arguments].splice(1)
            for (let i = 0; i < arg.length; i++) {
                for (let prop in arg[i]) {
                    if (arg[i].hasOwnProperty(prop)) {
                        target[prop] = arg[i][prop]
                    }
                }
            }
            return target
        },
        addEvent: function (elem, type, fn) {
            if (document.addEventListener) {
                elem.addEventListener(type, fn, false);
                return fn;
            } else if (document.attachEvent) {
                var bound = function () {
                    return fn.apply(elem, arguments)
                }
                elem.attachEvent('on' + type, bound);
                return bound;
            }
        },
        removeEvent: function (elem, type, fn) {
            if (document.removeEventListener) {
                elem.removeEventListener(type, fn, false)
            }
            else {
                elem.detachEvent("on" + type, fn)
            }
        }
    }
    var defaultOption = {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
    function Lazy(option) {
        this.option = util.extend({}, defaultOption, option)
        this.init()
    }
    var prop = Lazy.prototype
    prop.init = function () {
        this.getViewPortPostion()
        this.bindScroll()
    }
    prop.getViewPortPostion = function () {
        this.view = {
            top: 0 - (parseInt(this.option.top, 10) || 0),
            right: document.documentElement.clientWidth + (parseInt(this.option.right, 10), 10),
            left: 0 - (parseInt(this.option.left, 10) || 0),
            bottom: document.documentElement.clientHeight + (parseInt(this.option.right, 10), 10)
        }
    }
    prop.bindScroll = function () {
        var scroll = util.addEvent(root, 'scroll', this.handleLazyLoad.bind(this))
        var load = util.addEvent(root, 'load', this.handleLazyLoad.bind(this))
        this.event = {
            scroll,
            load
        }
    }
    prop.handleLazyLoad = function () {
        var timer = null
        var self = this
        clearTimeout(timer)
        timer = setTimeout(function () {
            timer = null
            self.render()
        }, 250)
    }
    prop.render = function () {
        var Dnode = document.querySelectorAll('[data-lazy-src], [data-lazy-background]');
        var len = Dnode.length
        for (var i = 0; i < len; i++) {
            if (this.checkinView(Dnode[i])) {
                if (Dnode[i].getAttribute('data-lazy-background') != null) {
                    Dnode[i].style.backgroundImage = 'url(' + elem.getAttribute('data-lazy-background') + ')';
                } else if (Dnode[i].getAttribute('data-lazy-src') != null) {
                    Dnode[i].src = Dnode[i].getAttribute('data-lazy-src')
                }
                Dnode[i].removeAttribute('data-lazy-backgroun')
                Dnode[i].removeAttribute('data-lazy-src')
            }
        }
        if (!len) {
            util.removeEvent(root, 'scroll', this.event.scrollEvent)
            util.removeEvent(root, 'load', this.event.loadEvent)
        }
    }
    prop.checkinView = function (element) {
        if (this.isHidden(element)) { return false }
        var rect = element.getBoundingClientRect();
        return rect.top <= this.view.bottom && rect.bottom >= this.view.top && rect.left <= this.view.right && rect.right >= this.view.left
    }
    prop.isHidden = function (element) {
        return (element.offsetParent === null);
    }
    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = Lazy;
        }
        exports.Lazy = Lazy;
    } else {
        root.Lazy = Lazy;
    }
}());