require('./polyfill.js');

var EventEmitter = require('events');

var emitter = new EventEmitter();
var running = false;

function tick(){
    
    var now = Date.now();
    var dT = now - then;
    
    emitter.emit('frame', now, dT);
    
    if( emitter.listenerCount( 'frame' ) !== 0 ) {
        
        requestAnimationFrame( tick );
        
    }
    
}

function start( fn ) {
    
    var wrappedFn = function(){
        
        if ( fn.apply( null, arguments ) === false ) {
            
            emitter.removeListener( 'frame', wrappedFn );
            
        }
        
    }
    
    emitter.on( 'frame', wrappedFn );
    
    if( emitter.listenerCount( 'frame' ) === 1 ) {
        
        tick();
        
    }
    
    return function() {
        
        emitter.removeListener( 'frame', wrappedFn );
        
    }
    
}