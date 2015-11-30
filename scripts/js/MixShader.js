var MixShader = function(){
        this.uniforms = THREE.UniformsUtils.merge([
            {
                "texture"  : { type: "t", value: null },
                "origTex"  : { type: "t", value: null },
                "alpha"  : { type: "t", value: null },
                "mouse"  : { type: "v2", value: null },
                "resolution"  : { type: "v2", value: null },
                "time"  : { type: "f", value: null },
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
            "varying vec2 vUv;",

            "void main()",
            "{",
            "	vec2 uv = gl_FragCoord.xy / resolution.xy * vec2(1.0,-1.0) + vec2(0.0, 1.0);",
            // "	int id = int(floor(uv.x * 5.0)) + int(floor(uv.y * 5.0))*5;",
            "	",
            "	// source texture (upper layer)",
            "	vec3 s = texture2D(origTex, vUv).xyz;",
            "	",
            "	// destination texture (lower layer)",
            "	vec3 d = texture2D(texture, vUv).xyz;",
            "	",
            "	vec3 c = vec3(0.0);",

            "	vec3 col = texture2D(texture, vUv).rgb;",
            "	vec3 alpha = texture2D(alpha, vUv).rgb;",
            "     vec2 q = vUv;",
            "     vec2 p = -1.0 + 2.0*q;",
            "     p.x *= resolution.x/resolution.y;",
            "     vec2 m = mouse;",
            "     m.x *= resolution.x/resolution.y;",
            "     float r = sqrt( dot((p - m), (p - m)) );",
            "     float a = atan(p.y, p.x);",
            "     if(r < r2){",
            "            float f = smoothstep(r2, r2 - 0.5, r);",
            "             col = mix( s, col, f);",
            "     }",
            "     gl_FragColor = texture2D(origTex, vUv);",
            "}",


        
        ].join("\n");
}