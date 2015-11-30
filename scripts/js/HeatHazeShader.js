var HeatHazeShader = function(){
        this.uniforms = THREE.UniformsUtils.merge([
            {
                "texture"  : { type: "t", value: null },
                "origTex"  : { type: "t", value: null },
                "noise"  : { type: "t", value: null },
                "alpha"  : { type: "t", value: null },
                "mouse"  : { type: "v2", value: null },
                "resolution"  : { type: "v2", value: null },
                "time"  : { type: "f", value: null },
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
            "uniform sampler2D noise;",
            "uniform sampler2D alpha;",
            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform int id;",
            "uniform int id2;",
            "uniform float time;",
            "varying vec2 vUv;",

            "vec2 drop(vec2 uv, vec2 pos, float r)",
            "{",
            "    pos.y = fract(pos.y);",
            "    return (uv - pos) * exp(-pow(20.0 * length(uv - pos), 2.0));",
            "}",

            "void main()",
            "{",
            "    vec2 uv = vUv;",
            "    vec2 uv2 = vec2(uv.x * resolution.x / resolution.y, uv.y);",
            "    ",
            "    vec2 d = vec2(0.0, 0.0);",
            "    const int n = 20;",
            "    for(int i = 0; i < n; i++)",
            "    {",
            "        vec4 r = texture2D(noise, vec2(float(i) / float(n), 0.5));",
            "        vec2 pos = r.xy;",
            "        pos.x *= 2.0; // resolution.x / resolution.y;",
            "        pos.y += 10.0 * time * 0.02 * r.a;",
            "        //pos.x += sin(t + r.z);",
            "        d += 0.1 * drop(uv2.xy, pos, 0.03);",
            "    }",

            "   vec3 outcol = texture2D(texture, -uv.xy + d).rgb;",
            
            "   vec3 col = texture2D(texture, vUv).rgb;",
            "   vec3 alpha = texture2D(alpha, vUv).rgb;",

            "   if(dot(alpha, vec3(1.0))/3.0 > 0.1){",
            "       col = mix( col, outcol, dot(alpha, vec3(1.0))/3.0);",
            "   }",

            "   gl_FragColor = vec4(col,1.0);",
            "}",


        
        ].join("\n");
}
