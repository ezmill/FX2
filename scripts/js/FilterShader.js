var FilterShader = function(type){
      if(type == "warm"){
            var warm = 1.0;
      } else {
            var warm = 0.0;                          
      }

        this.uniforms = THREE.UniformsUtils.merge([
            {
                "texture"  : { type: "t", value: null },
                "origTex"  : { type: "t", value: null },
                "alpha"  : { type: "t", value: null },
                "mouse"  : { type: "v2", value: null },
                "resolution"  : { type: "v2", value: null },
                "time"  : { type: "f", value: null },
                "warm"  : { type: "f", value: warm },
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
            "uniform float warm;",
            "varying vec2 vUv;",

            "float lumin( vec4 color ) { return dot( color, vec4( 0.299, 0.587, 0.114, 0.0 ) ); }",
            " ",
            "vec4 filterByColor( vec4 color, vec4 filter )",
            "{    ",
            "    float lumOld = lumin( color );",
            "    color *= filter;",
            "    float lumNew = lumin( color );",
            "   ",
            "    return color * ( lumOld / lumNew );",
            "}",


            "void main(){",
            
            "	vec4 col = texture2D(texture, vUv);",
            "	vec3 alpha = texture2D(alpha, vUv).rgb;",

            "      vec4 filterColorWarm = vec4( 1.33, 1.21, 1.0, 1.0 );",
            "      vec4 filterColorCold = vec4( 1.0, 1.1515, 1.33, 1.0 );",

            "      vec4 colorWarm = filterByColor( col, filterColorWarm );",
            "      vec4 colorCold = filterByColor( col, filterColorCold );",
            "     vec4 c;",
            "     if(warm > 0.0){",
            "           c = colorWarm;",            
            "     } else {",
            "           c = colorCold;",                              
            "     }",
            "	if(dot(alpha, vec3(1.0))/3.0 > 0.1){",
            "   	 col.rgb = mix( col.rgb, c.rgb, dot(alpha, vec3(1.0))/3.0);",
            "	}",

            "	gl_FragColor = vec4(col.rgb,1.0);",
            "}",


        
        ].join("\n");
}