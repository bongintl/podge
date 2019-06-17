var THREE = require('three');
var shaderSource = require('./shaders/displacementMapGenerator.c')();

var SIZE = 1024;

var scene, camera, renderer, material;

module.exports = {
    
    init: function() {
        
        scene = new THREE.Scene();
        
        renderer = new THREE.WebGLRenderer();
        
        camera = new THREE.Camera();
        
        camera.position.z = 1;
        
        material = new THREE.ShaderMaterial({
        	uniforms: {
        		u_slice: { value: 0 },
        		u_resolution: { value: new THREE.Vector2( SIZE, SIZE ) }
        	},
        	fragmentShader: shaderSource
        });
        
        var geometry = new THREE.PlaneBufferGeometry(2, 2);
        
        var mesh = new THREE.Mesh( geometry, material );
        
        scene.add( mesh );
        
        return this;
        
    },
    
    create: function( slice ) {
        
        var target = new THREE.WebGLRenderTarget( SIZE, SIZE, {
    		wrapS: THREE.MirroredRepeatWrapping,
    		wrapT: THREE.MirroredRepeatWrapping
        });
        
        material.uniforms.u_slice.value = slice;
        
        renderer.render( scene, camera, target );
        
        return target.texture;
        
    }
    
};