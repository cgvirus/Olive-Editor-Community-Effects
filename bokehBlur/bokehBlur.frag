// https://www.shadertoy.com/view/4d2Xzw
// Bokeh disc.
// original version by David Hoskins.
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

//Adaption and Implementation by CGVIRUS for Olive-Editor Community
//Fixed for Scaling and Noise, Optimized for MIPMAP


uniform sampler2D tex;
varying vec2 uTexCoord;
uniform vec2 resolution;

#define USE_MIPMAP
#define GOLDEN_ANGLE 2.39996323


uniform float Samples;
uniform float Amount;
uniform float Exposure;

mat2 rot = mat2(cos(GOLDEN_ANGLE), sin(GOLDEN_ANGLE), -sin(GOLDEN_ANGLE), cos(GOLDEN_ANGLE));

vec3 Bokeh(sampler2D tex, vec2 uv, float radius, float amount)
{
    vec2 rscale = vec2(1.0,1.0);
    vec3 acc = vec3(0.0);
    vec3 div = vec3(0.0);
    vec2 pixel = (1.0 / resolution.xy)*rscale;
    float r = 1.0;
    vec2 vangle = vec2(0.0,radius); 
    amount += radius*5000.0;
    
    for (int j = 0; j < int(Samples); j++)
    {  
        r += 1. / r;
        vangle = rot * vangle;
        vec2 tuv = (uv + pixel * (r-1.) * vangle);
        vec3 col = texture2DLod(tex, tuv, radius*.8).xyz;
        col *= Exposure; 
        vec3 bokeh = pow(col, vec3(9.0)) * amount+.4;
        acc += col * bokeh;
        div += bokeh;
    }
    return acc / div;
}

void main()
{
    
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float a = 40.0;
    // uv *= vec2(1.0, 1.0);
    gl_FragColor = vec4(Bokeh(tex, uv, Amount, a), gl_FragColor.a);
    
    
}