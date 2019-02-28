(function () {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global) ||
        this || {};
    const util = {
        extend(target) {
            let arg = [...arguments]
            for (let i = 0; i < arg.length; i++) {
                for (let prop in arg[i]) {
                    if (arg[i].hasOwnProperty(prop)) {
                        target[prop] = arg[i][prop]
                    }
                }
            }
            return target
        },
        getScrollOffet() {
            var w = window;
            if (w.pageXOffset != null) return { x: w.pageXOffset, y: w.pageYOffset };
            var d = w.document;
            if (document.compatMode == "CSS1Compat") {
                return {
                    x: d.documentElement.scrollLeft,
                    y: d.documentElement.scrollTop
                }
            }
            return { x: d.body.scrollLeft, y: d.body.scrollTop }
        },
        removeProperty: function (element, name) {
            if (element.style.removeProperty) {
                element.style.removeProperty(name);
            } else {
                element.style.removeAttribute(name);
            }
        }
    }
    const defaultOption = {
        offset: 20
    }
    function Sticky(element, option) {
        this.element = element
        this.option = util.extend({}, defaultOption, option);
        this.init()
    }
    const prop = Sticky.prototype
    prop.init = function () {
        if (!this.element) {
            return new TypeError('must be bind a dom')
        }
        this.getRectPostion()
        this.bindScroll()
    }
    prop.getRectPostion = function () {
        let rect = this.element.getBoundingClientRect()
        this.eTop = rect.top - this.option.offset
        this.eLeft = rect.left + util.getScrollOffet().x
        console.log(rect, this.eLeft, this.eTop)
    }
    prop.bindScroll = function () {
        window.addEventListener('scroll', () => {
            console.log('11', util.getScrollOffet().y)
            if (util.getScrollOffet().y > this.eTop) {
                this.setSticky()
            } else {
                this.setNormal()
            }
        })
    }
    prop.setSticky = function () {
        this.element.style.position = 'fixed'
        this.element.style.left = this.eLeft + 'px'
        this.element.style.top = this.option.offset + 'px'
    }
    prop.setNormal = function () {
        util.removeProperty(this.element, 'position')
        util.removeProperty(this.element, 'left')
        util.removeProperty(this.element, 'top')
    }
    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = Sticky;
        }
        exports.Sticky = Sticky;
    } else {
        root.Sticky = Sticky;
    }
}())