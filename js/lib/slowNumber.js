var rAF = require('./rAF.js');

module.exports = function SlowNumber(value, speed){
	
	var current = value || 0;
	var target = current;
	
	var speed = speed || 0.05;
	
	var stable = true;
	var onChange = false;
	
	function tick(){
		
		current += (target - current) * speed;
		
		if(onChange) onChange(current);
		
		if(current === target) {
			stable = true;
			return false;
		}
		
	}
	
	var sn = function(value){
		
		if(value){
			
			if(value === target) return;
			
			target = value;
			
			if(stable) rAF.start(tick);
			
			stable = false;
			
		} else {
			
			return current;
			
		}
		
	}
	
	sn.stop = function(){
		current = target;
		rAF.stop(tick);
	}
	
	sn.onChange = function(fn){
		onChange = fn;
	}
	
	sn.target = function(){
		return target;
	}
	
	sn.add = function(x){
		sn( target + x );
	}
	
	sn.off = sn.onChange.bind(null, false);
	
	return sn;
	
}