/***

    Port of  https://www.shadertoy.com/view/Mdf3Dn
    Adapted by CGVIRUS for the Olive-Editor Community

***/


uniform sampler2D tex;
varying vec2 vTexCoord;
uniform vec2 resolution;
const vec2 renderScale = vec2(1.,1.);

#define D2R(d) radians(d)
#define SST 0.888
#define SSQ 0.288

uniform float DOTSIZE;
uniform float scale;
uniform float angle;


vec2 ORIGIN = 0.5 * resolution.xy;

vec4 rgb2cmyki(in vec3 c)
{
	float k = max(max(c.r, c.g), c.b);
	return min(vec4(c.rgb / k, k), 1.0);
}

vec3 cmyki2rgb(in vec4 c)
{
	return c.rgb * c.a;
}

vec2 px2uv(in vec2 px)
{
	return vec2(px / resolution.xy);
}

vec2 grid(in vec2 px)
{
	return px - mod(px,renderScale.x*scale);
}

vec4 ss(in vec4 v)
{
	return smoothstep(SST-SSQ, SST+SSQ, v);
}

vec4 halftone(in vec2 fc,in mat2 m)
{
	vec2 smp = (grid(m*fc) + 0.5*renderScale.x*scale) * m;
	float s = min(length(fc-smp) / (DOTSIZE*0.5*renderScale.x*scale), 1.0);
    vec3 texc = texture2D(tex, px2uv(smp+ORIGIN)).rgb;
    //ftexc = pow(texc, vec3(2.2)); // Gamma decode.
	vec4 c = rgb2cmyki(texc);
	return c+s;
}

mat2 rotm(in float r)
{
	float cr = cos(r);
	float sr = sin(r);
	return mat2(
		cr,-sr,
		sr,cr
	);
}

void main()
{
	float R = D2R(angle);
	
	vec2 fc = gl_FragCoord.xy - ORIGIN;
	
	mat2 mc = rotm(R + D2R(15.0));
	mat2 mm = rotm(R + D2R(75.0));
	mat2 my = rotm(R);
	mat2 mk = rotm(R + D2R(45.0));
	
	float k = halftone(fc, mk).a;
	vec3 c = cmyki2rgb(ss(vec4(
		halftone(fc, mc).r,
		halftone(fc, mm).g,
		halftone(fc, my).b,
		halftone(fc, mk).a
	)));
    
    //c = pow(c, vec3(1.0/2.2)); // Gamma encode.
	gl_FragColor = vec4(c, 1.0);
}
