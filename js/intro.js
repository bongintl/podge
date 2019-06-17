var prefix = require('detectcss').prefixed;

var PREFIXED_TRANSITION_PROPERTY = prefix('transitionProperty');
var PREFIXED_TRANSITION_DURATION = prefix('transitionDuration');
var PREFIXED_TRANSITION_DELAY = prefix('transitionDelay')

var Promise = require('promise');

var shuffle = require('shuffle-array');

var intro = document.querySelector('.intro');

var letters = intro.innerHTML.split('');

intro.innerHTML = '';

letters = letters.map(function( letter ){
    
    var span = document.createElement('span');
    
    span.innerHTML = letter;
    
    intro.appendChild( span );
    
    return span;
    
})


module.exports = {
    
    go: function(){
        
        return Promise.race([
            
            new Promise( function( resolve ){
                
                var intro = document.querySelector('.intro');
                
                intro.addEventListener('click', resolve);
                
            }),
            
            new Promise( function( resolve ){
                
                setTimeout(resolve, 3000);
                
            }),
            
        ]);
        
    },
    
    transitionOut: function(){
        
        var duration = 3;
        
        letters.forEach(function( span ){
            
            span.style[ PREFIXED_TRANSITION_PROPERTY ] = 'opacity';
            span.style[ PREFIXED_TRANSITION_DURATION ] = '1s';
            span.style[ PREFIXED_TRANSITION_DELAY ] = Math.random() * duration + 's';
            
            span.style.opacity = 0;
            
        })
        
    }

}