var THREE = require('three');
var displacementMap = require('./displacementMap.js').init();

var displaceVertexShaderSource = require('../shaders/displaceVertex.c')();
var displaceFragmentShaderSource = require('../shaders/displaceFragment.c')();

var SEGMENTS = 30;

module.exports = function( sharedUniforms ) {
    
    return function( texture ) {
        
        var h = texture.image.height / texture.image.width;
        
        var geometry = new THREE.PlaneGeometry( 1, h, SEGMENTS, SEGMENTS );
        
        var dispMap = displacementMap( Math.random() * 50 );
        
        var uniforms = {
            u_texture: { value: texture },
            u_displace: { value: dispMap }
        };
        
        for ( var uniform in sharedUniforms ) {
            
            uniforms[ uniform ] = sharedUniforms[ uniform ];
            
        }
        
        var material = new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.DoubleSide,
            uniforms: uniforms,
            vertexShader: displaceVertexShaderSource,
            fragmentShader: displaceFragmentShaderSource
        });
        
        return new THREE.Mesh( geometry, material );
        
    };
    
};