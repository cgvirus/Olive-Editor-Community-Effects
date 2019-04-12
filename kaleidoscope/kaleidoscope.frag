/***  
    Port of https://www.shadertoy.com/view/XsfGzj
    Adaption and Implementation by CGVIRUS for Olive-Editor Community
***/

uniform sampler2D tex;
varying vec2 uTexCoord;
uniform vec2 resolution;

uniform int mode;
uniform float amount;
uniform float size;
uniform bool addup;
uniform float rotation;
uniform float evolution;
uniform float distortX;
uniform float distortY;
vec2 mirror(vec2 x)
{
        return abs(fract(x/2.0) - 0.5)*2.0;
}

// There are two versions
// One adds up the colors from all the iterations, the other uses only the last.
void main(void)
{
        vec2 uv = ((2*gl_FragCoord.xy - resolution.xy)/resolution.x)/size;
        vec2 uv2 = (gl_FragCoord.xy - resolution.xy);

        float a = (rotation*evolution)/100;
        vec4 color = vec4(0.0);
        for (float i = 1.0; i < 10.0; i += 1.0) {
                uv = vec2(sin(a)*uv.y - cos(a)*uv.x, sin(a)*uv.x + cos(a)*uv.y);
                uv = mirror(uv*(amount*0.1));

                if(mode == 0)
                {a += i+distortX;
                a /= i+distortY;}

                else if(mode == 1)
                {a *= i+distortX;
                a -= i+distortY;}
                
                else if(mode == 2)
                {a -= i+distortX;
                a *= i+distortY;}
                
                else if(mode == 3)
                {a /= i+distortX;
                a += i+distortY;}
                
                else if(mode == 4)
                {a += i+distortX;
                a -= i+distortY;}
                
                else if(mode == 5)
                {a -= i+distortX;
                a += i+distortY;}     


        }

        gl_FragColor = texture2D(tex, mirror(uv*vec2(1.,resolution.x/resolution.y)*2.0));
}
