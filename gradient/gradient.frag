
uniform float time;
uniform vec2 resolution;
uniform vec3 top;
uniform vec3 bottom;

void main( void ) {

	float y = gl_FragCoord.y / resolution.y;
	vec4 topColor = vec4(top, 1.0);
	vec4 bottomColor = vec4(bottom,1.0);
	vec4 color = mix(topColor, bottomColor, y);
	
	gl_FragColor = color;

}