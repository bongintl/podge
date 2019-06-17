var THREE = require('three');
var _ = require('lodash');

var loader = require('./loader.js');
var meshCreator = require('./meshCreator.js');

var FOV = 45;
var HALF_FOV_TAN = Math.tan( THREE.Math.degToRad(FOV) / 2 );

var MIN_OBJECT_SIZE = .2;
var MAX_OBJECT_SIZE = .8;

var NEAREST_OBJECT = -2000;
var DEPTH = -3000;
var CENTER = new THREE.Vector3( 0, 0, NEAREST_OBJECT );

var SHARED_UNIFORMS = {
    u_progress: { value: 0 },
    u_mouse: { value: new THREE.Vector2() }
};

var MAX_PROGRESS = 2500;
var MAX_CAMERA_DISTANCE = .3;

var renderer, camera, scene;
var angles, radii, scales;

function getMaxRadius( z ){
    
    var y = Math.abs( 2 * HALF_FOV_TAN * z );
    
    var aspect = window.innerWidth / window.innerHeight;
    
    var fovX = 2 * Math.atan( HALF_FOV_TAN * aspect );
    
    var x = Math.abs( Math.tan( fovX / 2 ) * z * 2 );
    
    return Math.min( x, y );
    
}

module.exports = {
    
    init: function(){
        
        renderer = new THREE.WebGLRenderer( { alpha: true } );
        camera = new THREE.PerspectiveCamera( FOV, window.innerWidth / window.innerHeight, 0.1, 30000 );
        scene = new THREE.Scene();
        
        return loader.load().then( textures => {
            
            angles = _.range( textures.length ).map( () => Math.random() * Math.PI * 2 );
            radii = _.range( textures.length ).map( () => Math.random() );
            scales = _.range( textures.length ).map( () => Math.random() * (MAX_OBJECT_SIZE - MIN_OBJECT_SIZE) + MIN_OBJECT_SIZE );
            
            textures.map( meshCreator( SHARED_UNIFORMS ) )
                .map( scene.add );
                
            window.addEventListener( 'resize', this.layout );
                
            this.layout();
            
        });
        
    },
    
    render: function(){
        
        renderer.render( scene, camera );
        
    },
    
    layout: function(){
        
    	renderer.setSize(window.innerWidth, window.innerHeight);
    	camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        
        var depthStep = DEPTH / scene.children.length;
        
        scene.children.forEach( ( mesh, i ) => {
            
            var z = NEAREST_OBJECT + depthStep * i;
            
            var maxRadius = getMaxRadius( z );
            
            var img = mesh.material.uniforms.u_texture.value.image;
            var diagonal = Math.sqrt( img.width * img.width + img.height * img.height ) / img.width;
            
            var scale = 1 / diagonal;
            scale *= maxRadius * scales[ i ];
            mesh.scale.x = mesh.scale.y = scale;
            
            var scaledDiagonal = scale * diagonal;
            
            var r = ( maxRadius - scaledDiagonal ) * radii[ i ];
            var a = angles[ i ];
            
            var x = Math.cos( a ) * r;
            var y = Math.sin( a ) * r;
            
            mesh.position.set( x, y, z );
            
        });
        
        this.render();
        
    },
    
    setProgress: function( x ){
        
        SHARED_UNIFORMS.u_progress.value = x;
        
    },
    
    setCamera: function( x, y ) {
        
        var max = MAX_CAMERA_DISTANCE * Math.max( window.innerWidth, window.innerHeight );
        
        camera.position.x = x * max;
        camera.position.y = y * max;
        
        camera.lookAt( CENTER );
        
        camera.updateProjectionMatrix();
        
    }
    
};