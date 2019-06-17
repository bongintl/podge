uniform vec2 u_mouse;
uniform sampler2D u_texture;
uniform sampler2D u_displace;
uniform float u_progress;

varying vec2 vUv;

void main(){
	
	vec3 displace = texture2D( u_displace, vUv + u_mouse * -0.2 ).rgb * vec3(2.0) - vec3(1.0);
	
	float distance = pow(1.0 - length( abs( vUv - vec2(0.5) ) ), 2.0);
	
	displace *= distance;
	
	vec2 texCoord = clamp( vUv + displace.rg * u_progress * 0.001, vec2(0.0), vec2(1.0) );
	
	vec4 color = texture2D(u_texture, texCoord);
	
	gl_FragColor = color;
	
}