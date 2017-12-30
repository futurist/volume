var Win32Volume = require('win32-volume');

// Win32Volume.setVolume(0.7, function (success) {
//     console.log('setVolume:', success);
// });

// Win32Volume.setMute(true, function (success) {
//     console.log('setMute:', success);
// });

// or you can use blocking functions..

// var result = Win32Volume.setMuteSync(true);
// var result = Win32Volume.setVolumeSync(0.7);



var keyhook = require('node-win32-keyhook')

const KeyNames={
    '[': 0xdb,
    ']': 0xdd,
    'F9': 0x78,
    'F10': 0x79,
    'F11': 0x7a,
    'F12': 0x7b,
    'CTRL': 0xa2,
    'SHIFT': 0xa0,
}

var isMute = false
var isCtrl = false
var isShift = false
var vol = 0.1

function stepVol(step){
    return vol = Math.min(1, Math.max(vol+step, 0))
}

function key_down(keycode) { // A function that converts the keycode to hexadecimal notation
    console.log('Key Down: 0x'+parseInt(keycode).toString(16))
    let step = isShift||isCtrl ? 0.1 : 0.01
    if(keycode==KeyNames['[']) Win32Volume.setVolumeSync(stepVol(-step))
    if(keycode==KeyNames[']']) Win32Volume.setVolumeSync(stepVol(+0.01))
    if(keycode==KeyNames['F10']) Win32Volume.setMuteSync(isMute^=1)
    if(keycode==KeyNames['CTRL']) isCtrl = true
    if(keycode==KeyNames['SHIFT']) isShift = true
    console.log('cur volume:', isMute, vol)
}

function key_up(keycode) { // A function that converts the keycode to hexadecimal notation
    console.log('Key Up: 0x'+parseInt(keycode).toString(16))
    if(keycode==KeyNames['CTRL']) isCtrl = false
    if(keycode==KeyNames['SHIFT']) isShift = false
}

keyhook.create(key_down, key_up); // Create the hook, and set the key_down and key_up callback

// setTimeout(()=>{
// 	keyhook.destroy(); // Remove the hook
// }, 3000)

var nodeCleanup = require('node-cleanup')
nodeCleanup(function (exitCode, signal) {
    keyhook.destroy()
    console.log('keyhook destroyed')
})

// keep node running
setInterval(() => {}, Number.POSITIVE_INFINITY)
