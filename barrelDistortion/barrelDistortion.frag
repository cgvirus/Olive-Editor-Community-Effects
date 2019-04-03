/***

    Port of  https://www.shadertoy.com/view/XssGz8
	Original idea by Kusma: https://github.com/kusma/vlee/blob/master/data/postprocess.fx
    Adapted by CGVIRUS for the Olive-Editor Community

***/

uniform sampler2D tex;
varying vec2 vTexCoord;
uniform vec2 resolution;
uniform float time;
const vec2 renderScale = vec2(1.,1.);

uniform float max_distort_px;
uniform float min_distort_factor;

float remap( float t, float a, float b ) {
	return clamp( (t - a) / (b - a), 0.0, 1.0 );
}
vec2 remap( vec2 t, vec2 a, vec2 b ) {
	return clamp( (t - a) / (b - a), 0.0, 1.0 );
}

vec3 spectrum_offset_rgb( float t )
{
    float t0 = 3.0 * t - 1.5;
	vec3 ret = clamp( vec3( -t0, 1.0-abs(t0), t0), 0.0, 1.0);
    return ret;
}

/*
// For future OCIIO
const float gamma = 2.2;
vec3 lin2srgb( vec3 c )
{
    return pow( c, vec3(gamma) );
}
vec3 srgb2lin( vec3 c )
{
    return pow( c, vec3(1.0/gamma));
}
*/

vec3 yCgCo2rgb(vec3 ycc)
{
    float R = ycc.x - ycc.y + ycc.z;
	float G = ycc.x + ycc.y;
	float B = ycc.x - ycc.y - ycc.z;
    return vec3(R,G,B);
}

vec3 spectrum_offset_ycgco( float t )
{
    vec3 ygo = vec3( 1.0, 0.0, -1.25*t );
    return yCgCo2rgb( ygo );
}

vec3 yuv2rgb( vec3 yuv )
{
    vec3 rgb;
    rgb.r = yuv.x + yuv.z * 1.13983;
    rgb.g = yuv.x + dot( vec2(-0.39465, -0.58060), yuv.yz );
    rgb.b = yuv.x + yuv.y * 2.03211;
    return rgb;
}

vec2 radialdistort(vec2 coord, vec2 amt)
{
	vec2 cc = coord - 0.5;
	return coord + 2.0 * cc * amt;
}

vec2 barrelDistortion( vec2 p, vec2 amt )
{
    p = 2.0 * p - 1.0;

    float maxBarrelPower = sqrt(5.0);
    float radius = dot(p,p);
    p *= pow(vec2(radius), maxBarrelPower * amt);
	/* */

    return p * 0.5 + 0.5;
}

vec2 brownConradyDistortion(vec2 uv, float dist)
{
    uv = uv * 2.0 - 1.0;
    float barrelDistortion1 = 0.1 * dist;
    float barrelDistortion2 = -0.025 * dist;

    float r2 = dot(uv,uv);
    uv *= 1.0 + barrelDistortion1 * r2 + barrelDistortion2 * r2 * r2;

    return uv * 0.5 + 0.5;
}

vec2 distort( vec2 uv, float t, vec2 min_distort, vec2 max_distort )
{
    vec2 dist = mix( min_distort, max_distort, t );
    return brownConradyDistortion( uv, 75.0 * dist.x );
}

vec3 spectrum_offset_yuv( float t )
{
    vec3 yuv = vec3( 1.0, 0.0, -1.0*t );
    return yuv2rgb( yuv );
}

vec3 spectrum_offset( float t )
{
  	return spectrum_offset_rgb( t );
}

float nrand( vec2 n )
{
	return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
}

vec3 render( vec2 uv )
{
    #if defined( DEBUG )
    if ( uv.x > 0.7 && uv.y > 0.7 )
    {
        float d = length( vec2(0.77)- uv );
        d = min( d, length( vec2(0.82)- uv ) );
        d = min( d, length( vec2(0.875)- uv ) );      
        return vec3( step( d, 0.025) );
    }
    #endif
    
    return texture( tex, uv ).rgb;
}

void main()
{	
	vec2 uv = gl_FragCoord.xy/resolution.xy;

	vec2 max_distort = vec2(max_distort_px) * renderScale.xy / resolution.xy;
    vec2 min_distort = (1.+min_distort_factor) * max_distort;

    vec2 oversiz = distort( vec2(1.0), 1.0, min_distort, max_distort );
    uv = remap( uv, 1.0-oversiz, oversiz );
    
    
    const int num_iter = 7;
    const float stepsiz = 1.0 / (float(num_iter)-1.0);
    float rnd = nrand( uv + fract(time) );
    float t = rnd * stepsiz;
    
    vec3 sumcol = vec3(0.0);
	vec3 sumw = vec3(0.0);
	for ( int i=0; i<num_iter; ++i )
	{
		vec3 w = spectrum_offset( t );
		sumw += w;
        vec2 uvd = distort(uv, t, min_distort, max_distort ); //TODO: move out of loop
		sumcol += w * render( uvd );
        t += stepsiz;
	}
    sumcol.rgb /= sumw;
    
    vec3 outcol = sumcol.rgb;
	//for future OCIIO
    //outcol = lin2srgb( outcol );
    outcol += rnd/255.0;
    
	gl_FragColor = vec4( outcol, gl_FragColor.a);
}
