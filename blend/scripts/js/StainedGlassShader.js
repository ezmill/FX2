var StainedGlassShader = function(){
        this.uniforms = THREE.UniformsUtils.merge([
            {
                "texture"  : { type: "t", value: null },
                "origTex"  : { type: "t", value: null },
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
            "uniform sampler2D alpha;",
            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform float time;",
            "varying vec2 vUv;",

            "float s;",
            "void srand(vec2 p){",
            "	s=sin(dot(p,vec2(423.62431,321.54323)));",
            "}",
            "float rand(){",
            "	s=fract(s*32322.65432+0.12333);",
            "	return abs(fract(s));",
            "}",
            "float grad(float t){",
            "	return 6.0*pow(t,5.0)-15.0*pow(t,4.0)+10.0*pow(t,3.0);",
            "}",
            "mat2 rot2d(float a){",
            "	float c=cos(a);",
            "	float s=sin(a);",
            "	return mat2(",
            "		c,-s,",
            "		s, c);",
            "}",
            "#define RES 100.0",
            "vec4 voronoi2d(vec2 p,float t){",
            "	float v=8.0;",
            "	vec4 c;",
            "	vec2 f=floor(p);",
            "	for(float i=-3.0;i<3.0;i++)",
            "	for(float j=-3.0;j<3.0;j++){",
            "		srand(f+vec2(i,j));",
            "		vec2 o;",
            "		o.x=rand();",
            "		o.y=rand();",
            "		o*=rot2d(t*(rand()-0.1));",
            "		float d=distance(p,f+vec2(i,j)+o);",
            "		if(d<v){",
            "			v=d;",
            "			c=texture2D(texture,(f+vec2(i,j)+o)/RES);",
            "		}",
            "	}",
            "	return c;",
            "}",
            "void main(){",

            "	float t = time;",
            "	float r = resolution.x/resolution.y;",
            "	vec2 uv = vUv;",

            "	vec4 c=voronoi2d(uv*RES,t);",
            "	vec3 col = texture2D(texture, vUv).rgb;",
            "	vec3 alpha = texture2D(alpha, vUv).rgb;",

            // "	if(dot(alpha, vec3(1.0))/3.0 > 0.1){",
            // "   	col = mix( col, c.rgb, dot(alpha, vec3(1.0))/3.0);",
            // "	}",

            // "	gl_FragColor = vec4(col,1.0);",
            "	gl_FragColor = c;",
            "}",


        
        ].join("\n");
}