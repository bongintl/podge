var SlowNumber = require('./slowNumber.js');

var x = SlowNumber();
var y = SlowNumber();

function start(speed, prop){
	
	var prop = prop || 'client';
		
	window.addEventListener('mousemove', function(e){
		
		x( e[prop + 'X'] );
		y( e[prop + 'Y'] );
		
	})
	
}

function onChange(fn){
	
	function listener(){
		fn( x(), y() );
	}
	
	x.onChange( listener );
	y.onChange( listener );
	
}

module.exports = {
	start: start,
	onChange: onChange
}