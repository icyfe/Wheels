(function () {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global) ||
        this || {};
    const defaultoption = {
        color: '#0084FF'
    }
    const util = {
        extend(target, ...arg) {
            if (typeof target !== 'object') return
            for (let i = 0; i < arg.length; i++) {
                for (let prop in arg[i]) {
                    if (arg[i].hasOwnProperty(prop)) {
                        target[prop] = arg[i][prop]
                    }
                }
            }
            return target
        },
        getScrollTop() {
            const w = window
            if (w.pageYOffset) {
                return w.pageYOffset //优先获取window上的pageYoffset属性。
            }
            const d = document
            return d.documentElement.scrollTop
        },
        //获取可视窗口
        getViewPort() {
            return viewPort = window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight;
        }
    }
    function ProgressIndecator(options) {
        this.options = util.extend({}, defaultoption, options)
        this.init()
    }

    const prop = ProgressIndecator.prototype
    prop.init = function () {
        this.createElement()
        const width = this.getAcquisitionProgress()
        this.setWidth(width)
        this.bindScroll()
    }
    //创建节点
    prop.createElement = function () {
        this.div = document.createElement('div')
        this.div.style.position = 'fixed'
        this.div.style.background = this.options.color
        this.div.style.height = 6 + 'px'
        this.div.style.top = 0 + 'px'
        document.body.appendChild(this.div)
    }
    //获取进度
    prop.getAcquisitionProgress = function () {
        const totalHeight = document.documentElement.scrollHeight;
        const viewPort = util.getViewPort()
        this.scrollTop = util.getScrollTop()
        this.hiddenViewPort = totalHeight - viewPort
        const width = Math.max(this.scrollTop / this.hiddenViewPort, 0)
        return width
    }
    prop.setWidth = function (width) {
        this.div.style.width = width * 100 + '%'
    }
    prop.bindScroll = function () {
        let self = this
        window.addEventListener('scroll', function () {
            window.requestAnimationFrame(function () {
                let pre = Math.min((util.getScrollTop() / self.hiddenViewPort), 1)

                if (pre == 1) { return }
                self.setWidth(pre)
            })
        })
    }
    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = ProgressIndecator;
        }
        exports.ProgressIndecator = ProgressIndecator;
    } else {
        root.ProgressIndecator = ProgressIndecator;
    }
}())


// Promise.all = function (promises) {
//     return new Promise((resolve, reject) => {
//         let index = 0;
//         let arr = []
//         for (let i = 0, len = promises.length; i < len; i++) {
//             promises[i].then(data =>{
//                 arr.push(data);
//                 ++index
//             },reject)
//             if(index == len){
//                 resolve(arr)
//             }
//         }
//     })
// }