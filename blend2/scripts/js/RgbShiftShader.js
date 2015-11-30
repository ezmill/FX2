var RgbShiftShader = function(){
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

            "void main() {",

                "vec3 col = texture2D(texture, vUv).rgb;",
                "vec4 alpha = texture2D(alpha, vUv);",

                "float ChromaticAberration = 10.0 / 10.0 + 8.0;",
                "vec2 uv = vUv;",

                "vec2 texel = 1.0 / resolution.xy;",

                "vec2 coords = (uv - 0.5) * 2.0;",
                "float coordDot = dot (coords, coords);",

                "vec2 precompute = ChromaticAberration * coordDot * coords;",
                "vec2 uvR = uv - texel.xy * precompute;",
                "vec2 uvB = uv + texel.xy * precompute;",

                "vec4 color;",
                "color.r = texture2D(texture, uvR).r;",
                "color.g = texture2D(texture, uv).g;",
                "color.b = texture2D(texture, uvB).b;",

                "vec4 col2 = color;",
                
                // "col2*=2.0;",
                // "vec3 alpha = texture2D(alpha, vUv).rgb;",
                // "   vec2 q = vUv;",
                // "   vec2 p = -1.0 + 2.0*q;",
                // "   p.x *= resolution.x/resolution.y;",
                // "   vec2 m = mouse;",
                // "   m.x *= resolution.x/resolution.y;",
                // "   float r = sqrt( dot((p - m), (p - m)) );",
                // "   float a = atan(p.y, p.x);",
                // "   if(r < r2){",
                "if(dot(alpha.rgb, vec3(1.0))/3.0 > 0.1){",
                // "    float f = smoothstep(r2, r2 - 0.5, r);",
                // "    col = mix( col, col2.rgb, f);",
                "   col = mix( col, col2.rgb, dot(alpha.rgb, vec3(1.0))/3.0);",
                "}",
                "gl_FragColor = vec4(col,1.0);",
                // "gl_FragColor = col;",
            "}"


        
        ].join("\n");
}