let EventEmitter = require('./index')

let event = new EventEmitter();
function a() {
    console.log('one')
}
function b() {
    console.log('two')
}
function c() {
    console.log('three')
}
event.on('demo',a)
event.on('demo',b)
event.on('demo',c)
event.emit('demo')