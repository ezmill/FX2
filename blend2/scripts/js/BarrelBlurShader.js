var BarrelBlurShader = function(px){
        this.uniforms = THREE.UniformsUtils.merge([
            {
                "texture"  : { type: "t", value: null },
                "origTex"  : { type: "t", value: null },
                "alpha"  : { type: "t", value: null },
                "mouse"  : { type: "v2", value: null },
                "resolution"  : { type: "v2", value: null },
                "time"  : { type: "f", value: null },
                "MAX_DIST_PX"  : { type: "f", value: px },
                "r2"  : { type: "f", value: null },
                "id"  : { type: "i", value: null },
                "id2"  : { type: "i", value: null }

            }
        ]);

        this.vertexShader = [

            "varying vec2 vUv;",
            "void main() {",
            "    vUv = uv;",
            "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        
        ].join("\n");
        
        this.fragmentShader = [
            
            "uniform sampler2D texture;",
            "uniform sampler2D origTex;",
            "uniform sampler2D alpha;",
            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform int id;",
            "uniform int id2;",
            "uniform float time;",
            "uniform float r2;",
            "uniform float MAX_DIST_PX;",
            "varying vec2 vUv;",

            "float linterp( float t ) {",
            "    return clamp( 1.0 - abs( 2.0*t - 1.0 ), 0.0, 1.0 );",
            "}",

            "float remap( float t, float a, float b ) {",
            "    return clamp( (t - a) / (b - a), 0.0, 1.0 );",
            "}",
            "vec2 remap( vec2 t, vec2 a, vec2 b ) {",
            "    return clamp( (t - a) / (b - a), 0.0, 1.0 );",
            "}",

            "vec3 spectrum_offset_rgb( float t ) {",
            "    vec3 ret;",
            "    float lo = step(t,0.5);",
            "    float hi = 1.0-lo;",
            "    float w = linterp( remap( t, 1.0/6.0, 5.0/6.0 ) );",
            "    ret = vec3(lo,1.0,hi) * vec3(1.0-w, w, 1.0-w);",

            "    return pow( ret, vec3(1.0/2.2) );",
            "}",

            "const float gamma = 2.2;",
            "vec3 lin2srgb( vec3 c )",
            "{",
            "    return pow( c, vec3(gamma) );",
            "}",
            "vec3 srgb2lin( vec3 c )",
            "{",
            "    return pow( c, vec3(1.0/gamma));",
            "}",


            "vec3 yCgCo2rgb(vec3 ycc)",
            "{",
            "    float R = ycc.x - ycc.y + ycc.z;",
            "    float G = ycc.x + ycc.y;",
            "    float B = ycc.x - ycc.y - ycc.z;",
            "    return vec3(R,G,B);",
            "}",

            "vec3 spectrum_offset_ycgco( float t )",
            "{",
            "    //vec3 ygo = vec3( 1.0, 1.5*t, 0.0 ); //green-pink",
            "    //vec3 ygo = vec3( 1.0, -1.5*t, 0.0 ); //green-purple",
            "    vec3 ygo = vec3( 1.0, 0.0, -1.25*t ); //cyan-orange",
            "    //vec3 ygo = vec3( 1.0, 0.0, 1.5*t ); //brownyello-blue",
            "    return yCgCo2rgb( ygo );",
            "}",

            "vec3 yuv2rgb( vec3 yuv )",
            "{",
            "    vec3 rgb;",
            "    rgb.r = yuv.x + yuv.z * 1.13983;",
            "    rgb.g = yuv.x + dot( vec2(-0.39465, -0.58060), yuv.yz );",
            "    rgb.b = yuv.x + yuv.y * 2.03211;",
            "    return rgb;",
            "}",


            "// ====",

            "//note: from https://www.shadertoy.com/view/XslGz8",
            "vec2 radialdistort(vec2 coord, vec2 amt)",
            "{",
            "    vec2 cc = coord - 0.5;",
            "    return coord + 2.0 * cc * amt;",
            "}",

            "// Given a vec2 in [-1,+1], generate a texture coord in [0,+1]",
            "vec2 barrelDistortion( vec2 p, vec2 amt )",
            "{",
            "    p = 2.0 * p - 1.0;",

            "    /*",
            "    const float maxBarrelPower = 5.0;",
            "    //note: http://glsl.heroku.com/e#3290.7 , copied from Little Grasshopper",
            "    float theta  = atan(p.y, p.x);",
            "    vec2 radius = vec2( length(p) );",
            "    radius = pow(radius, 1.0 + maxBarrelPower * amt);",
            "    p.x = radius.x * cos(theta);",
            "    p.y = radius.y * sin(theta);",

            "    /*/",
            "    // much faster version",
            "    //const float maxBarrelPower = 5.0;",
            "    //float radius = length(p);",
            "    const float maxBarrelPower = sqrt(5.0);",
            "    float radius = dot(p,p); //faster but doesn't match above accurately",
            "    p *= pow(vec2(radius), maxBarrelPower * amt);",
            "    /* */",

            "    return p * 0.5 + 0.5;",
            "}",

            "//note: from https://www.shadertoy.com/view/MlSXR3",
            "vec2 brownConradyDistortion(vec2 uv, float dist)",
            "{",
            "    uv = uv * 2.0 - 1.0;",
            "    // positive values of K1 give barrel distortion, negative give pincushion",
            "    float barrelDistortion1 = 0.1 * dist; // K1 in text books",
            "    float barrelDistortion2 = -0.025 * dist; // K2 in text books",

            "    float r2 = dot(uv,uv);",
            "    uv *= 1.0 + barrelDistortion1 * r2 + barrelDistortion2 * r2 * r2;",
            "    //uv *= 1.0 + barrelDistortion1 * r2;",
            "    ",
            "    // tangential distortion (due to off center lens elements)",
            "    // is not modeled in this function, but if it was, the terms would go here",
            "    return uv * 0.5 + 0.5;",
            "}",

            "vec2 distort( vec2 uv, float t, vec2 min_distort, vec2 max_distort )",
            "{",
            "    vec2 dist = mix( min_distort, max_distort, t );",
            "    //return radialdistort( uv, 2.0 * dist );",
            "    //return barrelDistortion( uv, 1.75 * dist ); //distortion at center",
            "    return brownConradyDistortion( uv, 75.0 * dist.x );",
            "}",

            "// ====",

            "vec3 spectrum_offset_yuv( float t )",
            "{",
            "    //vec3 yuv = vec3( 1.0, 3.0*t, 0.0 ); //purple-green",
            "    //vec3 yuv = vec3( 1.0, 0.0, 2.0*t ); //purple-green",
            "    vec3 yuv = vec3( 1.0, 0.0, -1.0*t ); //cyan-orange",
            "    //vec3 yuv = vec3( 1.0, -0.75*t, 0.0 ); //brownyello-blue",
            "    return yuv2rgb( yuv );",
            "}",

            "vec3 spectrum_offset( float t )",
            "{",
            "    return spectrum_offset_rgb( t );",
            "    //return spectrum_offset_ycgco( t );",
            "    //return spectrum_offset_yuv( t );",
            "}",

            "// ====",

            "float nrand( vec2 n )",
            "{",
            "    return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);",
            "}",

            "void main()",
            "{    ",
            "    // vec2 uv = fragCoord.xy/resolution.xy;",
            "    vec2 uv = vUv;",
            "    ",
            // "    const float MAX_DIST_PX = 0.1;",
            "    float max_distort_px = MAX_DIST_PX * (1.0-mouse.x/resolution.x);",
            "    vec2 max_distort = vec2(max_distort_px) / resolution.xy;",
            "    vec2 min_distort = 0.5 * max_distort;",

            "    //vec2 oversiz = vec2(1.0);",
            "    vec2 oversiz = distort( vec2(1.0), 1.0, min_distort, max_distort );",
            "    uv = remap( uv, 1.0-oversiz, oversiz );",
            "    ",
            "    //debug oversiz",
            "    //vec2 distuv = distort( uv, 1.0, max_distort );",
            "    //if ( abs(distuv.x-0.5)>0.5 || abs(distuv.y-0.5)>0.5)",
            "    //{",
            "    //    fragColor = vec4( 1.0, 0.0, 0.0, 1.0 ); return;",
            "    //}",
            "    ",
            "    vec3 sumcol = vec3(0.0);",
            "    vec3 sumw = vec3(0.0);",
            "    float rnd = nrand( uv + fract(time) );",
            "    const int num_iter = 8;",
            "    for ( int i=0; i<num_iter;++i )",
            "    {",
            "        float t = (float(i)+rnd) / float(num_iter-1);",
            "        vec3 w = spectrum_offset( t );",
            "        sumw += w;",
            "        sumcol += w * srgb2lin(texture2D( texture, distort(uv, t, min_distort, max_distort ) ).rgb);",
            "    }",
            "    sumcol.rgb /= sumw;",
            "    ",
            "    vec3 outcol = lin2srgb(sumcol.rgb);",
            "    outcol += rnd/255.0;",

            // "    gl_FragColor = vec4( outcol, 1.0);",
            "   vec3 col = texture2D(texture, vUv).rgb;",
            "   vec3 alpha = texture2D(alpha, vUv).rgb;",

            "   if(dot(alpha, vec3(1.0))/3.0 > 0.1){",
            "       col = mix( col, outcol, dot(alpha, vec3(1.0))/3.0);",
            "   }",
            // "   vec2 q = vUv;",
            // "   vec2 p = -1.0 + 2.0*q;",
            // "   p.x *= resolution.x/resolution.y;",
            // "   vec2 m = mouse;",
            // "   m.x *= resolution.x/resolution.y;",
            // "   float r = sqrt( dot((p - m), (p - m)) );",
            // "   float a = atan(p.y, p.x);",
            // "   if(r < r2){",
            // "     float f = smoothstep(r2, r2 - 0.5, r);",
            // "     col = mix( col, outcol, f);",
            // "   }",
            "   gl_FragColor = vec4(col,1.0);",
            "}",


        
        ].join("\n");
}
