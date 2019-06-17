var Promise = require('promise');

var SlowNumber = require('./lib/slowNumber.js');
var slowMouse = require('./lib/slowMouse.js');
var GyroNorm = require('./lib/gyronorm.js');

var currProgress = 0;
var MAX_PROGRESS = 2500;

var hasGyro = window.innerWidth <= 1024 ? undefined : false;

var IMAGES = (function(){
	
	var arr = [];
	
	var str;
	
	for ( var i = 0; i < 5; i++ ) {
		
		str = String(i + 1);
		
		//while(str.length < 5) str = '0' + str;
		
		str = 'img/bg/bg_' + str + '.png';
		
		arr.push(str);
		
	}
	
    var j, x, i;
    
    for (i = arr.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = arr[i - 1];
        arr[i - 1] = arr[j];
        arr[j] = x;
    }
	
	return arr;
	
})()

var NEAR = -2000;
var SCENE_SIZE = new THREE.Vector3(window.innerWidth/2, window.innerHeight/2, 300);
var SEGMENT_SIZE = 40;
var SEGMENTS = 30;
var FOV = 45;
var HALF_FOV_TAN = Math.tan( THREE.Math.degToRad(FOV) / 2 );
var DPR = window.devicePixelRatio || 1;

var currMouse = new THREE.Vector2(0,0);
var mouse = new THREE.Vector2(0,0);

var progress = { value: 0 };

var u_ratioScreen = { value: 1 };
var MAX_TEX_SIZE = 0.9;
var MIN_TEX_SIZE = 0.2;

var displacementMap = require('./displacementMap.js');
var displaceVertexShader = require('../shaders/displaceVertex.c')();
var displaceFragmentShader = require('../shaders/displaceFragment.c')();

var renderer = new THREE.WebGLRenderer({alpha: true});
//renderer.setClearColor( 0xFFFFFF );
renderer.domElement.classList.add('loading');
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 30000);
//camera.position.x = 1500;
//camera.position.y = 2000;
//camera.rotation.x = -Math.PI/2;
//camera.rotation.y = Math.PI/8;

var loader = new THREE.TextureLoader();

var meshes = [];

function createMesh(texture){
	
	var h = texture.image.height / texture.image.width;
	
	var geometry = new THREE.PlaneGeometry( 1, h, SEGMENTS, SEGMENTS );
	
	var dispMap = displacementMap(Math.random() * 50, renderer);
	
	var material = new THREE.RawShaderMaterial({
		transparent: true,
		side: THREE.DoubleSide,
		uniforms: {
			u_progress: progress,
			u_displace: { value: dispMap },
			u_texture: { value: texture },
			u_mouse: { value: mouse },
			u_ratio: { value: texture.image.width / texture.image.height },
			u_size: { value: Math.random() * (MAX_TEX_SIZE - MIN_TEX_SIZE) + MIN_TEX_SIZE },
			u_maxProgress: { value: MAX_PROGRESS },
			u_ratioScreen: u_ratioScreen
		},
		fragmentShader: displaceFragmentShader,
		//wireframe: true,
		vertexShader: displaceVertexShader
	});
	
	return new THREE.Mesh( geometry, material );
	
}

function identity(x){
	return x;
}

function getMeshZ(i){
	return NEAR - (SCENE_SIZE.z * i );
}

function getSize(mesh){
	return new THREE.Box3().setFromObject( mesh ).size();
}

function getVisibleBounds(z){
	
	var y = Math.abs( 2 * HALF_FOV_TAN * z );
	
	var aspect = window.innerWidth / window.innerHeight;
	
	var fovX = 2 * Math.atan( HALF_FOV_TAN * aspect );
	
	var x  = Math.abs( Math.tan( fovX / 2 ) * z * 2 );
	
	return {x: x, y: y};
	
}

var minScale = 0.6;
var maxScale = 0.8;

function positionMeshCirc( mesh, i ){
	
	var z = getMeshZ(i);
	
	var bounds = getVisibleBounds(z);
	
	var minBound = Math.max(bounds.x, bounds.y);
	
	var img = mesh.material.uniforms.u_texture.value.image;
	var diagonal = Math.sqrt( img.width * img.width + img.height * img.height ) / img.width;
	
	var scale = 1 / diagonal;
	
	scale *= minBound;
	
	scale *= ( Math.pow( Math.random(), 5 ) * (maxScale - minScale) + minScale)
	
	mesh.rotation.z = Math.random() * 2 * Math.PI;
	
	mesh.scale.x = mesh.scale.y = scale;
	
	var scaledDiagonal = scale * diagonal;
	
	var maxR = (minBound - scaledDiagonal) * .2;
	
	var r = maxR * Math.random();
	
	var a = Math.random() * 2 * Math.PI;
	
	var x = Math.cos(a) * r;
	var y = Math.sin(a) * r;
	
	mesh.position.set( x, y, z );
	
}

function loadTextures(){
	
	return Promise.all( IMAGES.map(function(url, i){
		
		var p = new Promise(function(resolve){
			
			loader.load(url, function(texture){
				
				var mesh = createMesh(texture);
				
				meshes[i] = mesh;
				
				resolve();
				
			})
		
		})
		
		return p;
		
	}));
	
}

function addObjects(){
	
	meshes.forEach(function(mesh, i){
		
		positionMeshCirc( mesh, i );
			
		scene.add(mesh);
		
	})
	
	renderer.render(scene, camera);
	
	renderer.domElement.classList.remove('loading');
	
}

function onmousemove(e){
	currMouse.x = e.clientX / window.innerWidth * 2 - 1;
	currMouse.y = e.clientY / window.innerHeight * 2 - 1;
}

function resize(){
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = u_ratioScreen.value = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.render(scene, camera)
}

var focus = new THREE.Vector3(0, 0, -3000);

function setCenter(x, y){
	
	camera.position.x = x * 1000;
	camera.position.y = y * 1000;
	
	mouse.set(x, y);
	
	camera.lookAt( focus );
	camera.updateProjectionMatrix();
	
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', onmousemove);

resize();

module.exports = {
	progress: SlowNumber(0),
	maxProgress: MAX_PROGRESS,
	setProgress: function(x){
		progress.value = x;
	},
	setCenter: setCenter,
	render: renderer.render.bind(renderer, scene, camera),
	element: renderer.domElement,
	wobble: function(){
		
		var currTarget = this.progress.target();
		
		if(currTarget < this.maxProgress) this.progress( currTarget + this.maxProgress / 20 );
		
	},
	
	init: function(){
		
		var background = this;
		
		var maxScrollTop = 0;
		
		var cursor = document.getElementById('cursor');
		
		background.progress.onChange(this.setProgress);
		
		slowMouse.start();
		slowMouse.onChange(function(x, y){
			if(hasGyro !== false) return;
			background.setCenter( x / window.innerWidth, y / window.innerHeight );
			if(background.progress.target() < background.maxProgress) background.progress.add(.05);
			background.render();
		});

		window.addEventListener('touchmove', function(e){
			if(background.progress.target() < background.maxProgress) background.progress.add(.05);
		})
		
		if( window.innerWidth < 1024 ) {
		
		var gm = new GyroNorm();
		
			gm.init().then(function(){
				
				gm.start(function(data){
					
					if( data.do.alpha === 0 && data.do.beta === 0 && data.do.gamma === 0 ) {
						hasGyro = false;
						gm.end();
						return;
					}
					
					hasGyro = true;
					
					background.setCenter( data.do.gamma / 50, (data.do.beta - 90) / 50 );
					if(background.progress.target() < background.maxProgress) background.progress.add(.05);
					
					background.render();
					
				})
				
			}).catch(function(e){
				
				hasGyro = false;
				
			})
		
		}
		
		return loadTextures();
		
	},
	
	start: addObjects
	
}