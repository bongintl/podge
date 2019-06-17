var Promise = require('promise');
var THREE = require('three');

var loader = new THREE.TextureLoader();

function loadTexture( url ){
    
    return new Promise( function( resolve ) {
        
        loader.load( url, resolve );
        
    });
    
}

function loadTextures( urls ) {
    
    return Promise.all( urls.map( loadTexture ) );
    
}

function getUrls( count ){
    
    var urls = [];
    
    var str;
    
    for ( var i = 0; i < count; i++ ) {
        
        str = String(i);
        
        while( str.length < 5 ) str = '0' + str;
        
        str = 'img/layers' + str + '.png';
        
        urls.push( str );
        
    }
    
    return urls;
    
}

function shuffle( arr ) {
    
    var j, x, i;
    
    for (i = arr.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = arr[i - 1];
        arr[i - 1] = arr[j];
        arr[j] = x;
    }
	
	return arr;
    
}

module.exports = {
    
    load: function(){
        
        return loadTextures( shuffle( getUrls(10) ) );
        
    }
    
};