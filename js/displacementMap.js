//var THREE = require('three');
var shaderSource = require('../shaders/displacementMapGenerator.c')();

var SIZE = 1024;

var scene = new THREE.Scene();

var camera = new THREE.Camera();
camera.position.z = 1;

var geometry = new THREE.PlaneBufferGeometry(2, 2);

var material = new THREE.ShaderMaterial({
	uniforms: {
		u_slice: { value: 0 },
		u_resolution: { value: new THREE.Vector2(SIZE, SIZE) }
	},
	fragmentShader: shaderSource
});

var mesh = new THREE.Mesh( geometry, material );

scene.add( mesh );

module.exports = function(slice, renderer){
	
	var target = new THREE.WebGLRenderTarget(SIZE, SIZE, {
		wrapS: THREE.MirroredRepeatWrapping,
		wrapT: THREE.MirroredRepeatWrapping
	});
	
	material.uniforms.u_slice.value = slice;
    
    renderer.render(scene, camera, target);
    
    return target.texture;
	
}