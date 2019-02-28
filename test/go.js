function go(...arg) {
    let str = 'go'
    console.log('1', arg)
    var _go = function (arg) {
        console.log('2', arg)
        if (arg && arg[0]) {
            return str + arg[0]
        } else {
            str = str + 'o'
            return _go
        }
    }
    return _go(arg)
}

// console.log(go('l'))
console.log(go())
console.log(go()()('l'))
// console.log(go()()()('l'))