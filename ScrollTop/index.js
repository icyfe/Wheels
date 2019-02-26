(function () {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global) ||
        this || {};
    const defaultoption = {
        speed: 10,
        showWhen: 400,
        fadeIn: 10
    }
    const util = {
        extend(target) {
            let arg = [...arguments].splice(1)
            console.log(arg)
            for (let i = 0; i < arg.length; i++) {
                for (let prop in arg[i]) {
                    if (arg[i].hasOwnProperty(prop)) {
                        target[prop] = arg[i][prop]
                    }
                }
            }
            console.log(target)
            return target
        },
        setOpacity(element,speed) {

        }
    }
    function ScrollToTop(element, option) {
        this.element = element
        this.option = util.extend({}, defaultoption, option)
        this.init()
    }
    const proto = ScrollToTop.prototype
    proto.init = function () {
        if (!this.element) {
            return new Error(" Domnode is not defined")
        }
        this.hideElemnt()
        this.bindScrollToTop()
        this.goToTop()
    }
    proto.hideElemnt = function () {
        util.setOpacity(this.element,0)
        this.status = 'hide'
    }
    proto.bindScrollToTop = function () {
        let self = this
        window.addEventListener('scroll', function () {

            if (this.scrollY > self.option.showWhen) {
                if (self.status == 'hide') {
                    self.element.style.opacity = 100
                    self.status = 'show'
                }
            } else {
                if (self.status == 'show') {
                    self.status = 'hide'
                    self.element.style.opacity = 0
                }
            }
        }, false)
    }
    proto.goToTop = function () {
        let self = this
        let timer = null
        this.element.addEventListener('click', function () {
            var oTop = document.body.scrollTop || document.documentElement.scrollTop;
            if (oTop > 0) {
                timer = setInterval(() => {
                    oTop = document.body.scrollTop || document.documentElement.scrollTop;
                    document.body.scrollTop = document.documentElement.scrollTop = oTop - self.option.speed;
                    if (oTop == 0) {
                        clearInterval(timer)
                    }
                }, 10);
            }
        })
    }
    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = ScrollToTop;
        }
        exports.ScrollToTop = ScrollToTop;
    } else {
        root.ScrollToTop = ScrollToTop;
    }
}());