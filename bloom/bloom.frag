/*
getColor(): https://www.shadertoy.com/view/4dcXWs
Blend: https://github.com/jamieowen/glsl-blend
Tonemap: https://github.com/dmnsgn/glsl-tone-map
*/

uniform vec2 resolution;
uniform sampler2D image;
varying vec2 vTexCoord;

uniform float kThreshold;
uniform float kIntensity;
uniform float kRadius;

const vec2 renderScale = vec2(1.0);

vec3 getTexture(in sampler2D Tex, vec2 Coord, float MipBias)
{
    vec4 texture = texture2D(Tex, Coord, MipBias);
    vec3 color = pow(texture.rgb, vec3(2.2));

    return vec3(clamp(color-(kThreshold*0.1),0.0,1.0)*(kIntensity/10.0)/(1.0-(kThreshold*0.1)));
}

vec3 blurColor(sampler2D Tex, vec2 Coord, float MipBias)
{
	vec2 TexelSize = MipBias/resolution.xy;

    vec3 Color = getTexture(Tex, Coord, MipBias);
    Color += getTexture(Tex, Coord + vec2(TexelSize.x,0.0), MipBias);
    Color += getTexture(Tex, Coord + vec2(-TexelSize.x,0.0), MipBias);
    Color += getTexture(Tex, Coord + vec2(0.0,TexelSize.y), MipBias);
    Color += getTexture(Tex, Coord + vec2(0.0,-TexelSize.y), MipBias);
    Color += getTexture(Tex, Coord + vec2(TexelSize.x,TexelSize.y), MipBias);
    Color += getTexture(Tex, Coord + vec2(-TexelSize.x,TexelSize.y), MipBias);
    Color += getTexture(Tex, Coord + vec2(TexelSize.x,-TexelSize.y), MipBias);
    Color += getTexture(Tex, Coord + vec2(-TexelSize.x,-TexelSize.y), MipBias);

    return Color/9.0;
}

vec3 blend(vec3 a, vec3 b) {
    // return 1.0 - ((1.0 - a) * (1.0 - b));
    return max(a,b);
}

vec3 Tonemap(vec3 x) {
    return x / (x + 0.155) * 1.019;
}

void main()
{
    vec4 tx = texture2D(image, vTexCoord);
    vec3 blur = blurColor(image, vTexCoord, log2(kRadius*renderScale.x));

    vec3 col = blend(tx.rgb, Tonemap(blur));
    gl_FragColor = vec4(col, tx.a);
}
