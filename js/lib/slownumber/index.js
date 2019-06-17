var rAF = require('bong-raf');

function SlowNumber( value, speed ) {
    
    this.value = value || 0;
    this.target = this.value;
    this.speed = speed || 0.05;
    
    this.stable = true;
    
}

SlowNumber.prototype.set = function( value ){
    
    if( value === this.target ) return;
    
    this.target = value;
    
    if( this.stable ) rAF.start( this.tick );
    
    this.stable = false;
    
}

SlowNumber.prototype.tick = function( now, dT ){
    
    this.value += ( this.target - this.current ) * this.speed;
    
    if( this.current === this.target ) {
        
        this.stable = true;
        
        return false;
        
    }
    
}

SlowNumber.prototype.stop = function(){
    
    rAF.stop( this.tick );
    
}