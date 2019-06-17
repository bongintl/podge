require('./isIE.js');

var Promise = require('promise');

var background = require('./background.js');
var intro = require('./intro.js')

require('./sections.js')();
require('./menu.js')();
require('./attendees.js')();
require('./gallery.js')();

if('CSS' in window && 'supports' in window.CSS) {
    var support = window.CSS.supports('mix-blend-mode','soft-light');
        support = support?'mix-blend-mode':'';
        document.body.classList.add('blend-modes');
}

document.querySelector('.mo-menu-button').addEventListener('touchstart', function(){
    document.body.classList.toggle('menu-open');
    background.wobble();
});

document.body.addEventListener('showSection', function(){
    document.body.classList.remove('menu-open');
});

var introPromise = intro.go();

introPromise.then(function(){
    
    document.body.classList.add('intro-done');
    intro.transitionOut();
    
})

Promise.all( [ introPromise, background.init() ] ).then( background.start );