precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec2 u_mouse;
uniform sampler2D u_displace;
uniform float u_progress;

attribute vec2 uv;
attribute vec3 position;

varying vec2 vUv;

void main() {
	
    vUv = uv;
    
    vec4 p = vec4(position,1.0);
    
    vec4 displace = texture2D(u_displace, vUv + u_mouse ) * vec4(2.0) - vec4(1.0);
    
    p.z += displace.z * u_progress * 5.0;
    
    gl_Position = projectionMatrix * modelViewMatrix * p;
    
}