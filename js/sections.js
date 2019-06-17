var $ = require('jquery');

var PREFIXED_TRANSFORM = require('detectcss').prefixed('transform');

module.exports = function(){
    
    var NAMES = ['about', 'details', 'menu', 'attendees', 'supporters', 'gallery'];

    var background = require('./background.js');
    
    var menu = document.querySelectorAll('.nav');
    var phoneMenu = document.querySelectorAll('.mo-menu a');
    
    console.log(phoneMenu)
    var sections = document.querySelectorAll('section');
    var currSection = -1;
    var scrollTops = [];
    
    for(var i = 0; i < menu.length; i++) scrollTops.push(0);
    
    function openSection(i){
    	
    	if(i === currSection) return;
    	
    	var section = sections[i];
    	section.classList.add('front', 'visited');
    	section.style[ PREFIXED_TRANSFORM ] = 'none';
    	section.style.zIndex = "";
    	scrollTo( 0, scrollTops[i] );
    	
    	window.location.hash = NAMES[i];
    	
    	section.dispatchEvent( new Event('showSection', {bubbles: true}) );
    	
    	menu[i].classList.add('nav_active');
    	
    	currSection = i;
    	
    }
    
    var maxZ = -10000;
    
    function closeSection(i){
    	
    	if(i === -1) return;
    	
    	menu[ i ].classList.remove('nav_active');
    	
    	var section = sections[i];
    	section.style[ PREFIXED_TRANSFORM ] = 'translateY(' + -pageYOffset + 'px)';
    	scrollTops[i] = pageYOffset;
    	section.classList.remove('front');
    	section.style.zIndex = maxZ++;
    	menu[i].classList.remove('nav_active');
    	
    	section.dispatchEvent( new Event('hideSection', {bubbles: true}) );
    	
    }
    
    function switchSection(i){
        if( currSection === i ) return;
    	closeSection(currSection);
    	openSection(i);
    	background.wobble();
    }
    
    function bindEvents( elements, event ){
        
       $(elements).each(function(i){
        	
        	this.addEventListener( event, function(){
        		switchSection(i);
        	});
        	
        });  
        
    }
    
    bindEvents( menu, 'click' )
    bindEvents( phoneMenu, 'touchstart' )
    
    background.element.addEventListener('click', function(){
    	closeSection(currSection);
    	
    	for( var i = 0; i < sections.length; i++ ) {
    	    sections[i].classList.remove('visited');
    	}
    	
    	currSection = -1;
    });
    
    if( window.location.hash ){
        
        var idx = NAMES.indexOf( window.location.hash.substr(1) );
        
        if( idx > -1 ) {
            
            openSection( idx );
            
        } else {
            
            window.location.hash = '';
            
        }
        
    }

}