
 var SobelShader = function(){
         this.uniforms = THREE.UniformsUtils.merge([
             {
                 "texture"  : { type: "t", value: null },
                 "origTex"  : { type: "t", value: null },
                 "alpha"  : { type: "t", value: null },
                 "mouse"  : { type: "v2", value: null },
                 "resolution"  : { type: "v2", value: null },
                 "time"  : { type: "f", value: null },
                 "r2"  : { type: "f", value: null }

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
            "uniform sampler2D alpha;",
            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform float r2;",
            "uniform float time;",
            "varying vec2 vUv;",

            "vec3 sample(const int x, const int y, in vec2 fragCoord)",
            "{",
            "    vec2 uv = fragCoord.xy / resolution.xy * resolution.xy;",
            "    uv = (uv + vec2(x, y)) / resolution.xy;",
            "    return texture2D(texture, uv).xyz;",
            "}",

            "float luminance(vec3 c)",
            "{",
            "    return dot(c, vec3(.2126, .7152, .0722));",
            "}",

            "vec3 filter(in vec2 fragCoord)",
            "{",
            "    vec3 hc =sample(-1,-1, fragCoord) *  1. + sample( 0,-1, fragCoord) *  2.",
            "             +sample( 1,-1, fragCoord) *  1. + sample(-1, 1, fragCoord) * -1.",
            "             +sample( 0, 1, fragCoord) * -2. + sample( 1, 1, fragCoord) * -1.;        ",

            "    vec3 vc =sample(-1,-1, fragCoord) *  1. + sample(-1, 0, fragCoord) *  2.",
            "             +sample(-1, 1, fragCoord) *  1. + sample( 1,-1, fragCoord) * -1.",
            "             +sample( 1, 0, fragCoord) * -2. + sample( 1, 1, fragCoord) * -1.;",

            "    return sample(0, 0, fragCoord) * pow(luminance(vc*vc + hc*hc), .6);",
            "}",

            "void main()",
            "{",
            "    float u = gl_FragCoord.x / resolution.x;",
            "    float m = mouse.x / resolution.x;",
            "    ",
            "    float l = smoothstep(0., 1. / resolution.y, abs(m - u));",
            "    ",
            "    vec2 fc = gl_FragCoord.xy;",
            "    // fc.y = resolution.y - fragCoord.y;",
            "    ",
            "    vec3 cf = filter(fc);",
            "    vec3 cl = sample(0, 0, fc);",
            "    vec3 cr = (u < m ? cl : cf) * l;",

            "    vec3 col = texture2D(texture, vUv).rgb;",
            "    vec4 alpha = texture2D(alpha, vUv);",
            "    if(dot(alpha.rgb, vec3(1.0))/3.0 > 0.1){",
            "       col = mix( col, cr, dot(alpha.rgb, vec3(1.0))/3.0);",
            "    }",
            "    gl_FragColor = vec4(col, 1);",
            "}"


         
         ].join("\n");
 }