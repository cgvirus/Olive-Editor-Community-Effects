/***

    Port of https://www.shadertoy.com/view/lslGRr
    Adapted by CGVIRUS for the Olive-Editor Community

***/


uniform sampler2D tex;
varying vec2 vTexCoord;
uniform vec2 resolution;
const vec2 renderScale = vec2(1.,1.);

uniform float sharpness;

void main(void)
{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
	vec2 step = 1.0 / resolution.xy;
	
	vec3 texA = texture2D( tex, uv + vec2(-step.x, -step.y) * 1.5 ).rgb;
	vec3 texB = texture2D( tex, uv + vec2( step.x, -step.y) * 1.5 ).rgb;
	vec3 texC = texture2D( tex, uv + vec2(-step.x,  step.y) * 1.5 ).rgb;
	vec3 texD = texture2D( tex, uv + vec2( step.x,  step.y) * 1.5 ).rgb;
   
    vec3 around = 0.25 * (texA + texB + texC + texD);
	vec3 center  = texture2D( tex, uv ).rgb;
	
	// vec3 col = center + (center - around) * sharpness;
	vec3 col = center + (center - around) * sharpness;
	
    gl_FragColor = vec4(col,gl_FragColor.a);
}
