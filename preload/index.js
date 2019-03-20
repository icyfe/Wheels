(function () {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global) ||
        this || {};
    var util = {
        extend: function (target) {
            for (var i = 1, len = arguments.length; i < len; i++) {
                for (var prop in arguments[i]) {
                    if (arguments[i].hasOwnProperty(prop)) {
                        console.log(arguments[i].prop)
                        target[prop] = arguments[i][prop]
                    }
                }
            }
            return target
        },
        isArray: function (arr) {
            return Array.isArray(arr) ? Array : Object.prototype.toString.call(arr) == '[object Array]'
        }
    }
    var defaultoption = {
        progress: function () { },
        complete: function () { }
    }
    function Preload(pics, option) {
        if (!util.isArray(pics)) {
            return new Error('pics must be arrays')
        }
        console.log('选项', option)
        this.index = this.failnum = 0
        this.pics = pics;
        this.option = util.extend({}, defaultoption, option)
        this.init()
    }
    var proto = Preload.prototype
    proto.init = function () {
        for (var i = 0, len = this.pics.length; i < len; i++) {
            this.createImg(pics[i])
        }
        console.log(this.option, this.pics)
    }
    proto.createImg = function (src) {
        var img = new Image()
        var self = this
        img.onload = function () {
            img.onload = null
            self.progress(src, 'success')
        }
        img.onerror = function () {
            self.progress(src, 'fail')
        }
        img.src = src
    }
    proto.progress = function (src, type) {
        if (type == 'fail') this.failnum++
        this.index++;
        var picslen = this.pics.length
        this.option.progress(this.index, picslen, type)
        if (this.index == this.pics.length) {
            this.option.complete(this.index - this.failnum, this.failnum)
        }
    }
    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = Preload;
        }
        exports.Preload = Preload;
    } else {
        root.Preload = Preload;
    }
}())