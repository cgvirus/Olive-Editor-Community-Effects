/***  
    Port of https://www.shadertoy.com/view/Ms2Xz3
    Adaption and Implementation by CGVIRUS for Olive-Editor Community
***/

uniform sampler2D tex;
varying vec2 uTexCoord;
uniform vec2 resolution;

const vec2 renderScale = vec2(1.,1.);
uniform float Threshold;
uniform float Intensity;
uniform float BlurSize;

vec4 BlurColor (in vec2 Coord, in sampler2D Tex, in float MipBias)
{
	vec2 TexelSize = MipBias/resolution.xy;
    
    vec4  Color = texture2D(Tex, Coord, MipBias);
    Color += texture2D(Tex, Coord + vec2(TexelSize.x,0.0), MipBias);    	
    Color += texture2D(Tex, Coord + vec2(-TexelSize.x,0.0), MipBias);    	
    Color += texture2D(Tex, Coord + vec2(0.0,TexelSize.y), MipBias);    	
    Color += texture2D(Tex, Coord + vec2(0.0,-TexelSize.y), MipBias);    	
    Color += texture2D(Tex, Coord + vec2(TexelSize.x,TexelSize.y), MipBias);    	
    Color += texture2D(Tex, Coord + vec2(-TexelSize.x,TexelSize.y), MipBias);    	
    Color += texture2D(Tex, Coord + vec2(TexelSize.x,-TexelSize.y), MipBias);    	
    Color += texture2D(Tex, Coord + vec2(-TexelSize.x,-TexelSize.y), MipBias);    

    return Color/9.0;
}

void main(void)
{
	vec2 uv = gl_FragCoord.xy/resolution.xy;
    
    vec4 Color = texture2D(tex, uv);
    
    vec4 Highlight = clamp(BlurColor(uv, tex, log2(BlurSize*renderScale.x))-(Threshold*0.1),0.0,1.0)*1.0/(1.0-(Threshold*0.1));
        
    gl_FragColor = 1.0-(1.0-Color)*(1.0-Highlight*(Intensity*0.1)); //Screen Blend Mode
}
