var CustomShaders = function(){
	this.passShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null }

			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			
			"uniform sampler2D texture; ",
			"varying vec2 vUv;",

			"void main() {",
			"	vec4 color = texture2D(texture, vUv);",
			"	if(color.a>0.0){",
			"   	gl_FragColor = vec4(color.rgb, color.a);",
			"   } else {",
			"   	discard;",
			"   }",
			"}"
		
		].join("\n")
		
	},
	this.gridShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null }

			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			
			"uniform sampler2D texture;",
			"uniform vec2 resolution;",
			"uniform vec2 mouse;",
			"uniform float r2;",
			"varying vec2 vUv;",

			"void main() {",
			// "	vec4 color = vec4(0.0);",
			"		vec4	color = texture2D(texture, vUv);",

			"	if(mod(gl_FragCoord.x, 0.003) == 0.0){",

			"		if(mod(gl_FragCoord.y, 0.003) == 0.0){",

			"			color = 1.0 - texture2D(texture, vUv);",
			// "			color = vec4(0.0);",

			"		}",

			"	}",
			// "	vec4 color = texture2D(texture, vUv);",
			"	vec2 q = vUv;",
		    "	vec2 p = -1.0 + 2.0*q;",
		    "	p.x *= resolution.x/resolution.y;",
	    	"	vec2 m = mouse;",
	    	"	m.x *= resolution.x/resolution.y;",
		    "	float r = sqrt( dot((p - m), (p - m)) );",
		    "	float a = atan(p.y, p.x);",
		    "	vec3 col = texture2D(texture, vUv).rgb;",
		    "	if(r < r2){",
		    "		float f = smoothstep(r2, r2 - 0.5, r);",
		    "		col = mix( col, color.rgb, f);",
		    "	}",
			"    gl_FragColor = vec4(color.rgb, 1.0);",
			"}"
		
		].join("\n")
		
	},
	this.colorShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null }

			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
					
			"uniform sampler2D texture;",
			"varying vec2 vUv;",

			"vec3 rainbow(float h) {",
			"  h = mod(mod(h, 1.0) + 1.0, 1.0);",
			"  float h6 = h * 6.0;",
			"  float r = clamp(h6 - 4.0, 0.0, 1.0) +",
			"    clamp(2.0 - h6, 0.0, 1.0);",
			"  float g = h6 < 2.0",
			"    ? clamp(h6, 0.0, 1.0)",
			"    : clamp(4.0 - h6, 0.0, 1.0);",
			"  float b = h6 < 4.0",
			"    ? clamp(h6 - 2.0, 0.0, 1.0)",
			"    : clamp(6.0 - h6, 0.0, 1.0);",
			"  return vec3(r, g, b);",
			"}",

			"vec3 rgb2hsv(vec3 c)",
			"{",
			"    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);",
			"    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));",
			"    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));",
			"    ",
			"    float d = q.x - min(q.w, q.y);",
			"    float e = 1.0e-10;",
			"    return vec3(abs(( (q.z + (q.w - q.y) / (6.0 * d + e))) ), d / (q.x + e), q.x);",
			"}",

			"vec3 hsv2rgb(vec3 c)",
			"{",
			"    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);",
			"    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);",
			"    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);",
			"}",


			"void main(){",

			"  vec4 tex0 = texture2D(texture, vUv);",
			"  vec3 hsv = rgb2hsv(tex0.rgb);",

			"  hsv.r += 0.003;",
			"  hsv.r = mod(hsv.r, 1.0);",
			"  hsv.g *= 1.01;",
			"  // hsv.g = mod(hsv.g, 1.0);",
			"  vec3 rgb = hsv2rgb(hsv); ",

			"  gl_FragColor = vec4(rgb,1.0);",
			"}"
		
		].join("\n")
	
	},

	this.flowShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"r2"  : { type: "f", value: null }

			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			
			"uniform vec2 resolution;",
			"uniform float time;",
			"uniform float r2;",
			"uniform sampler2D texture;",
			"varying vec2 vUv;",
			"uniform vec2 mouse;",

			"void main( void ){",
			"    vec2 uv = vUv;",

			"    vec2 e = 1.0/resolution.xy;",


			"    float am1 = 0.5 + 0.5*0.927180409;",
			"    float am2 = 10.0;",

			"    for( int i=0; i<20; i++ ){",
			"    	float h  = dot( texture2D(texture, uv*0.1       ).xyz, vec3(1.0) );",
			"    	float h1 = dot( texture2D(texture, uv+vec2(e.x,0.0)).xyz, vec3(1.0) );",
			"    	float h2 = dot( texture2D(texture, uv+vec2(0.0,e.y)).xyz, vec3(1.0) );",
			"    	vec2 g = 0.001*vec2( (h-h2), (h-h1) )/e;",
			// "    	vec2 g = 0.001*vec2( (h1-h), (h2-h) )/e;",
			"    	vec2 f = g.yx*vec2(50.0*mouse.x, 50.0*mouse.y);",
			// "    	vec2 f = g.yx*vec2(-1.0,1.0);",

			"   	g = mix( g, f, am1 );",

			"    	uv -= 0.00005*g*am2;",
			"    }",

			"    vec3 col2 = texture2D(texture, uv).xyz;",
			"	vec2 q = vUv;",
		    "	vec2 p = -1.0 + 2.0*q;",
		    "	p.x *= resolution.x/resolution.y;",
	    	"	vec2 m = mouse;",
	    	"	m.x *= resolution.x/resolution.y;",
		    "	float r = sqrt( dot((p - m), (p - m)) );",
		    "	float a = atan(p.y, p.x);",
		    "	vec3 col = texture2D(texture, vUv).rgb;",
		    "	if(r < r2){",
		    "		float f = smoothstep(r2, r2 - 0.5, r);",
		    "		col = mix( col, col2, f);",
		    "	}",
			"    gl_FragColor = vec4(col, 1.0);",
			"}"
		
		].join("\n")
	
	},
	this.blurShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"r2"  : { type: "f", value: null }
			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			
			"uniform sampler2D texture;",
			"uniform vec2 resolution;",
			"uniform vec2 mouse;",
			"uniform float r2;",

			"varying vec2 vUv;",

			"void main() {",
			"  float step_w = 1.0/resolution.x;",
			"  float step_h = 1.0/resolution.y;",
			"  vec2 tc = vUv;",
			"  vec4 input0 = texture2D(texture,tc);",
			"   ",
			"  vec2 x1 = vec2(step_w, 0.0);",
			"  vec2 y1 = vec2(0.0, step_h);",
			"    ",
			"  input0 += texture2D(texture, tc+x1); // right",
			"  input0 += texture2D(texture, tc-x1); // left",
			"  input0 += texture2D(texture, tc+y1); // top",
			"  input0 += texture2D(texture, tc-y1); // bottom",

			"  input0 *=0.2;",
			"	vec2 q = vUv;",
		    "	vec2 p = -1.0 + 2.0*q;",
		    "	p.x *= resolution.x/resolution.y;",
	    	"	vec2 m = mouse;",
	    	"	m.x *= resolution.x/resolution.y;",
		    "	float r = sqrt( dot((p - m), (p - m)) );",
		    "	float a = atan(p.y, p.x);",
		    "	vec3 col = texture2D(texture, vUv).rgb;",
		    "	if(r < r2){",
		    "		float f = smoothstep(r2, r2 - 0.5, r);",
		    "		col = mix( col, input0.rgb, f);",
		    "	}",
			"	gl_FragColor = vec4(col,1.0);",

			// "  gl_FragColor = input0;",
			"}"
		
		].join("\n")
	
	},
	this.sharpenShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null }
			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			
			"uniform sampler2D texture;",
			"uniform vec2 resolution;",
			"varying vec2 vUv;",

			"float kernel[9];",
			"vec2 offset[9];",

			"void main() {",
			"	float step_w = 1.0/resolution.x;",
			"	float step_h = 1.0/resolution.y;",
			"	vec2 tc = vUv;",
			"	vec4 input0 = texture2D(texture,tc);",
			"	kernel[0] = -1.0; kernel[1] = -1.0; kernel[2] = -1.0;",
			"	kernel[3] = -1.0; kernel[4] = 8.0; kernel[5] = -1.0;",
			"	kernel[6] = -1.0; kernel[7] = -1.0; kernel[8] = -1.0;",
			"	offset[0] = vec2(-step_w, -step_h);",
			"	offset[1] = vec2(0.0, -step_h);",
			"	offset[2] = vec2(step_w, -step_h);",
			"	offset[3] = vec2(-step_w, 0.0);",
			"	offset[4] = vec2(0.0, 0.0);",
			"	offset[5] = vec2(step_w, 0.0);",
			"	offset[6] = vec2(-step_w, step_h);",
			"	offset[7] = vec2(0.0, step_h);",
			"	offset[8] = vec2(step_w, step_h);",
			"	input0 += texture2D(texture, tc + offset[0]) * kernel[0];",
			"	input0 += texture2D(texture, tc + offset[1]) * kernel[1];",
			"	input0 += texture2D(texture, tc + offset[2]) * kernel[2];",
			"	input0 += texture2D(texture, tc + offset[3]) * kernel[3];",
			"	input0 += texture2D(texture, tc + offset[4]) * kernel[4];",
			"	input0 += texture2D(texture, tc + offset[5]) * kernel[5];",
			"	input0 += texture2D(texture, tc + offset[6]) * kernel[6];",
			"	input0 += texture2D(texture, tc + offset[7]) * kernel[7];",
			"	input0 += texture2D(texture, tc + offset[8]) * kernel[8];",
			"	float kernelWeight = kernel[0] + kernel[2] + kernel[3] + kernel[4] + kernel[5] + kernel[6] + kernel[7] + kernel[8];",
			"	if (kernelWeight <= 0.0) {",
			"	   kernelWeight = 1.0;",
			"	}",
			"	gl_FragColor = vec4((input0/kernelWeight).rgb, 1.0);",
			"}"
		
		].join("\n")
		},
	this.diffShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"texture2"  : { type: "t", value: null },
				"doDiff"  : { type: "f", value: null },
				// "texture3"  : { type: "t", value: null }

			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			
			"uniform sampler2D texture;",
			"uniform sampler2D texture2;",
			// "uniform sampler2D texture3;",
			"uniform float doDiff;",
			"varying vec2 vUv;",

			"void main() {",
			"  vec4 tex0 = texture2D(texture, vUv);",
			"  vec4 tex1 = texture2D(texture2, vUv);",
			// "  vec4 tex2 = texture2D(texture3, vUv);",

			"  vec4 fc = (tex1 - tex0);",
			// "  vec4 add = (fc + tex0);",
			"  gl_FragColor = vec4(fc);",
			"}"
		
		].join("\n")
		
	},
	this.diffShader2 = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"texture2"  : { type: "t", value: null },
				// "texture3"  : { type: "t", value: null }

			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			
			"uniform sampler2D texture;",
			"uniform sampler2D texture2;",
			// "uniform sampler2D texture3;",
			"varying vec2 vUv;",

			"void main() {",
			"  vec4 tex0 = texture2D(texture, vUv);",
			"  vec4 tex1 = texture2D(texture2, vUv);",
			// "  vec4 tex2 = texture2D(texture3, vUv);",

			"  vec4 fc = (tex1 - tex0);",
			"  vec4 add = (fc + tex0);",
			"  gl_FragColor = vec4(add);",
			"}"
		
		].join("\n")
		
	},
	this.reposShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"r2"  : { type: "f", value: null }

			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			

			"varying vec2 vUv;",
			"uniform sampler2D texture;",
			"uniform vec2 mouse;",
			"uniform vec2 resolution;",

			"uniform float r2;",

			"vec3 rgb2hsv(vec3 c)",
			"{",
			"    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);",
			"    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));",
			"    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));",
			"    ",
			"    float d = q.x - min(q.w, q.y);",
			"    float e = 1.0e-10;",
			"    return vec3(abs(( (q.z + (q.w - q.y) / (6.0 * d + e))) ), d / (q.x + e), q.x);",
			"}",

			"vec3 hsv2rgb(vec3 c)",
			"{",
			"    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);",
			"    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);",
			"    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);",
			"}",

			"void main(){",

			"    vec2 tc = vUv;",
			"    vec4 look = texture2D(texture,tc);",
			// "    vec2 offs = vec2(look.y-look.x,look.w-look.z)*0.001;",
			// "    vec2 offs = vec2(look.y-look.x,look.w-look.z)*vec2(mouse.x/3.333, mouse.y/3.333);",
			"    vec2 offs = vec2(look.y-look.x,look.w-look.z)*vec2(mouse.x/50.0, mouse.y/50.0);",
			// "    vec2 offs = vec2(look.y-look.x,look.w-look.z)*vec2(0.0, 0.01);",
			"    vec2 coord = offs+tc;",
			"    vec4 repos = texture2D(texture, coord);",
			"    repos*=1.001;",
			// "    gl_FragColor = repos;",
			"  vec3 hsv = rgb2hsv(repos.rgb);",

			"  hsv.r += 0.3;",
			"  hsv.r = mod(hsv.r, 1.0);",
			"  hsv.g *= 1.01;",
			"  //hsv.g = mod(hsv.g, 1.0);",
			"  repos.rgb = hsv2rgb(hsv); ",

			"	vec2 q = vUv;",
		    "	vec2 p = -1.0 + 2.0*q;",
		    "	p.x *= resolution.x/resolution.y;",
	    	"	vec2 m = mouse;",
	    	"	m.x *= resolution.x/resolution.y;",
		    "	float r = sqrt( dot((p - m), (p - m)) );",
		    "	float a = atan(p.y, p.x);",
		    "	vec3 col = texture2D(texture, vUv).rgb;",
		    "	if(r < r2){",
		    "		float f = smoothstep(r2, r2 - 0.5, r);",
		    "		col = mix( col, repos.rgb, f);",
		    "	}",
			"	gl_FragColor = vec4(col,1.0);",
			"}"
		
		].join("\n")
		
	},
	this.alphaShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null }

			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			
			"uniform sampler2D texture; ",
			"varying vec2 vUv;",

	        "void main() {",
	      
	        "    float avg = dot(texture2D(texture, vUv).rgb, vec3(1.0))/3.0;",
	        // "    if(texture2D(texture, vUv).rgb > 0.1){",
	        "    if(avg > 0.5){",
	        "      gl_FragColor = vec4(texture2D(texture, vUv).rgb, texture2D(texture, vUv).a);",
	        "    }",
	        "    else {",
	        "      discard;",
	        // "      gl_FragColor = vec4(texture2D(texture, vUv).rgb, avg);",
	        "    }",
	        "    ",
			"}"
		].join("\n")
		
	},	
	this.passThroughShader = {
	    uniforms: THREE.UniformsUtils.merge( [

	        {
	            "texture"  : { type: "t", value: null },
	            "mouse"  : { type: "v2", value: null },
	            "resolution"  : { type: "v2", value: null },
	            "texture2"  : { type: "t", value: null },
	            "color"  : { type: "c", value: new THREE.Color('#'+Math.floor(Math.random()*16777215).toString(16)) }
	        }
	    ] ),

	    vertexShader: [
	        "varying vec2 vUv;",
	        "uniform float time;",
	        "void main() {",
	        "    vUv = uv;",
	        "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
	        "}"
	    ].join("\n"),

	    fragmentShader: [
	        "uniform sampler2D texture; ",
	        "uniform sampler2D texture2; ",
	        "uniform vec3 color; ",
	        "varying vec2 vUv;",

	        "void main() {",
	        // "    float avg = normalize((texture2D(texture, vUv).rgb + texture2D(texture2, vUv).rgb)*0.5);",
	        // "    float avg = dot(texture2D(texture2, vUv), vec4(1.0))/3.0;",
	        // "    float avg = dot(texture2D(texture, vUv).rgb, vec3(1.0))/3.0;",
	        // "    if(avg < 0.1){",
	        "      gl_FragColor = vec4(texture2D(texture, vUv).rgb, texture2D(texture, vUv).a);",
	        // "      gl_FragColor = vec4(1.0,0.0,0.0,1.0);",
	        // "      gl_FragColor = vec4(color,1.0);",
	        // "    }",
	        // "    else {",
	        // "      discard;",
	        // "    }",
	        "    ",
	        "}"
	    ].join("\n")
	}
	this.warpShader = {
	    uniforms: THREE.UniformsUtils.merge( [

	        {
	            "texture"  : { type: "t", value: null },
	            "mouse"  : { type: "v2", value: null },
	            "time"  : { type: "f", value: null },
	            "resolution"  : { type: "v2", value: null },
	        }
	    ] ),

	    vertexShader: [
	        "varying vec2 vUv;",
	        "uniform float time;",
	        "void main() {",
	        "    vUv = uv;",
	        "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
	        "}"
	    ].join("\n"),

	    fragmentShader: [
			"uniform vec2 resolution;",
			"uniform float time;",
			"uniform sampler2D texture;",
			"varying vec2 vUv;",
			"uniform vec2 mouse;",

			"void main(){",
			"	vec2 q = (-resolution.xy + 2.0*gl_FragCoord.xy) / resolution.y;",
			// "	vec2 q = vUv;",
			"    vec2 p = q;",
			"    ",
			// "    p += .2*cos( 1.5*p.yx + 1.0*time + vec2(0.1,1.1) );",
			// "	p += .2*cos( 2.4*p.yx + 1.6*time + vec2(4.5,2.6) );",
			// "	p += .2*cos( 3.3*p.yx + 1.2*time + vec2(3.2,3.4) );",
			// "	p += .2*cos( 4.2*p.yx + 1.7*time + vec2(1.8,5.2) );",
			// "	p += .2*cos( 9.1*p.yx + 1.1*time + vec2(6.3,3.9) );",
			"    p += .2*cos( 1.5*p.yx + 1.0*time + vec2(0.1*mouse.x,1.1*mouse.y) );",
			"	p += .2*cos( 2.4*p.yx + 1.6*time + vec2(4.5*mouse.x,2.6*mouse.y) );",
			"	p += .2*cos( 3.3*p.yx + 1.2*time + vec2(3.2*mouse.x,3.4*mouse.y) );",
			"	p += .2*cos( 4.2*p.yx + 1.7*time + vec2(1.8*mouse.x,5.2*mouse.y) );",
			"	p += .2*cos( 9.1*p.yx + 1.1*time + vec2(6.3*mouse.x,3.9*mouse.y) );",

			"	float r = length( p );",
			"    ",
			// "    vec3 col = texture2D( texture, vec2(r,     0.0), 0.0 ).rgb;",
			"    vec3 col = texture2D( texture, p).rgb;",

			"    gl_FragColor = vec4( col, 1.0 );",
			"}"
	    ].join("\n")

	}
	this.warp2 = {
	    uniforms: THREE.UniformsUtils.merge( [

	        {
	            "texture"  : { type: "t", value: null },
	            "mouse"  : { type: "v2", value: null },
	            "time"  : { type: "f", value: null },
	            "resolution"  : { type: "v2", value: null },
	        }
	    ] ),

	    vertexShader: [
	        "varying vec2 vUv;",
	        "uniform float time;",
	        "void main() {",
	        "    vUv = uv;",
	        "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
	        "}"
	    ].join("\n"),

	    fragmentShader: [
			"uniform vec2 resolution;",
			"uniform float time;",
			"uniform sampler2D texture;",
			"varying vec2 vUv;",
			"uniform vec2 mouse;",
			"vec3 rgb2hsv(vec3 c)",
			"{",
			"    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);",
			"    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));",
			"    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));",
			"    ",
			"    float d = q.x - min(q.w, q.y);",
			"    float e = 1.0e-10;",
			"    return vec3(abs(( (q.z + (q.w - q.y) / (6.0 * d + e))) ), d / (q.x + e), q.x);",
			"}",

			"vec3 hsv2rgb(vec3 c)",
			"{",
			"    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);",
			"    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);",
			"    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);",
			"}",
			"float rand(vec2 p)",
			"{",
			"    vec2 n = floor(p/2.0);",
			"     return fract(cos(dot(n,vec2(48.233,39.645)))*375.42); ",
			"}",
			"float srand(vec2 p)",
			"{",
			"     vec2 f = floor(p);",
			"    vec2 s = smoothstep(vec2(0.0),vec2(1.0),fract(p));",
			"    ",
			"    return mix(mix(rand(f),rand(f+vec2(1.0,0.0)),s.x),",
			"           mix(rand(f+vec2(0.0,1.0)),rand(f+vec2(1.0,1.0)),s.x),s.y);",
			"}",
			"float noise(vec2 p)",
			"{",
			"     float total = srand(p/128.0)*0.5+srand(p/64.0)*0.35+srand(p/32.0)*0.1+srand(p/16.0)*0.05;",
			"    return total;",
			"}",
			"void main()",
			"{",
			"    float t = time;",
			"    vec2 warp = vec2(noise(gl_FragCoord.xy+t)+noise(gl_FragCoord.xy*0.5+t*3.5),",
			"                     noise(gl_FragCoord.xy+128.0-t)+noise(gl_FragCoord.xy*0.6-t*2.5))*0.5-0.25;",
			// "    vec2 uv = gl_FragCoord.xy / resolution.xy+warp;",
			"	 vec2 mW = warp*mouse;",
			"    vec2 uv = vUv+mW*sin(time);",
			"    vec4 look = gl_FragColor = texture2D(texture,uv);",
			"    vec2 offs = vec2(look.y-look.x,look.w-look.z)*vec2(mouse.x*uv.x/100.0, mouse.y*uv.y/100.0);",
			"    vec2 coord = offs+vUv;",
			"    vec4 repos = texture2D(texture, coord);",

			"    gl_FragColor = texture2D(texture,uv);",
			// "    gl_FragColor = repos;",
			"  vec4 tex0 = repos;",
			"  vec3 hsv = rgb2hsv(tex0.rgb);",
			"  hsv.r += 0.01;",
			"  //hsv.r = mod(hsv.r, 1.0);",
			"  hsv.g *= 1.001;",
			"  // hsv.g = mod(hsv.g, 1.0);",
			"  vec3 rgb = hsv2rgb(hsv); ",
			"  gl_FragColor = vec4(rgb,1.0);",
			"}"
	    ].join("\n")

	}
	this.bumpShader =  {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"lightWidth"  : { type: "f", value: 3.5 },
				"lightBrightness"  : { type: "f", value: 1.0 }
			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			
			"uniform sampler2D texture;",
			"uniform vec2 mouse;",
			"uniform float time;",
			"uniform float lightWidth;",
			"uniform float lightBrightness;",
			"varying vec2 vUv;",
			"uniform vec2 resolution;",


			"void main() {",
			"vec2 texelWidth = 1.0/resolution; ",
			"    vec4 input0 = texture2D(texture,vUv);",


			"    float step = 5.0;",
			"    float tl = abs(texture2D(texture, vUv + texelWidth * vec2(-step, -step)).x);   // top left",
			"    float  l = abs(texture2D(texture, vUv + texelWidth * vec2(-step,  0.0)).x);   // left",
			"    float bl = abs(texture2D(texture, vUv + texelWidth * vec2(-step,  step)).x);   // bottom left",
			"    float  t = abs(texture2D(texture, vUv + texelWidth * vec2( 0.0, -step)).x);   // top",
			"    float  b = abs(texture2D(texture, vUv + texelWidth * vec2( 0.0,  step)).x);   // bottom",
			"    float tr = abs(texture2D(texture, vUv + texelWidth * vec2( step, -step)).x);   // top right",
			"    float  r = abs(texture2D(texture, vUv + texelWidth * vec2( step,  0.0)).x);   // right",
			"    float br = abs(texture2D(texture, vUv + texelWidth * vec2( step,  step)).x);   // bottom right",

			"    float mult = 0.01;",

			"    float dX = tr*mult + 2.0*r*mult + br*mult -tl*mult - 2.0*l*mult - bl*mult;",
			"    float dY = bl*mult + 2.0*b*mult + br*mult -tl*mult - 2.0*t*mult - tr*mult;",
			"    ",

			"    vec4 diffuseColor = texture2D(texture, vUv);",

			"    vec3 color = normalize(vec3(dX,dY,1.0/50.0));",
			"    ",
			"    for( int i = 0; i<4; i++){",
			"      color +=color;",
			"    }",

			"    vec3 lightDir = vec3( vec2( mouse.x/resolution.x, 1.0-mouse.y/resolution.y)-(gl_FragCoord.xy / vec2(resolution.x,resolution.y)), lightWidth );",
			"    lightDir.x *= resolution.x/resolution.y;",

			"    float D = length(lightDir);",

			"    vec3 N = normalize(color);",
			"    vec3 L = normalize(lightDir);",
			"    vec3 H = normalize(L);",

			"    vec4 lightColor = input0;",
			"    vec4 ambientColor = vec4(vec3(input0.rgb*lightBrightness),0.5);",
			"    ",
			"    vec3 falloff = vec3(1.0,3.0,20.5);",
			"  ",
			"    vec3 diffuse = (lightColor.rgb * lightColor.a) * max(dot(N, L), 0.0);",
			"    vec3 ambient = ambientColor.rgb * ambientColor.a;",
			"    ",
			"    float shin = 1000.1;",
			"    float sf = max(0.0,dot(N,H));",
			"    sf = pow(sf, shin);",
			"  ",
			"    float attenuation = 1.0 / (falloff.x + (falloff.y*D) + (falloff.z * D * D) );",

			"    vec3 intensity =  ambient+(diffuse+sf ) * attenuation;",
			"    vec3 finalColor = (diffuseColor.rgb * intensity);",

			"    vec3 col = ambient+( finalColor+sf );",

			"    color *=0.5;",
			"    color +=0.5;",

			"    // vec4 C = index == 0 ? vec4(col, 1.0) : vec4(color, 1.0);",
			"    vec4 C = vec4(col, 1.0);",
			"    gl_FragColor = C;",
			"}"
		
		].join("\n")
		
	},
	this.paintShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null }

			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			
			"uniform sampler2D texture; ",
			"uniform vec2 resolution; ",
			"varying vec2 vUv;",

 
			 "const int radius = 1;",

			 "void main() {",
			"	 vec2 src_size = vec2 (1.0 / resolution.x, 1.0 / resolution.y);",
			 "    //vec2 uv = gl_FragCoord.xy/resolution.xy;",
			 "    vec2 uv = vUv;",
			 "    float n = float((radius + 1) * (radius + 1));",
			 "    int i; ",
			"	 int j;",
			 "    vec3 m0 = vec3(0.0); vec3 m1 = vec3(0.0); vec3 m2 = vec3(0.0); vec3 m3 = vec3(0.0);",
			 "    vec3 s0 = vec3(0.0); vec3 s1 = vec3(0.0); vec3 s2 = vec3(0.0); vec3 s3 = vec3(0.0);",
			 "    vec3 c;",

			 "    for (int j = -radius; j <= 0; ++j)  {",
			 "        for (int i = -radius; i <= 0; ++i)  {",
			 "            c = texture2D(texture, uv + vec2(i,j) * src_size).rgb;",
			 "            m0 += c;",
			 "            s0 += c * c;",
			 "        }",
			 "    }",

			 "    for (int j = -radius; j <= 0; ++j)  {",
			 "        for (int i = 0; i <= radius; ++i)  {",
			 "            c = texture2D(texture, uv + vec2(i,j) * src_size).rgb;",
			 "            m1 += c;",
			 "            s1 += c * c;",
			 "        }",
			 "    }",

			 "    for (int j = 0; j <= radius; ++j)  {",
			 "        for (int i = 0; i <= radius; ++i)  {",
			 "            c = texture2D(texture, uv + vec2(i,j) * src_size).rgb;",
			 "            m2 += c;",
			 "            s2 += c * c;",
			 "        }",
			 "    }",

			 "    for (int j = 0; j <= radius; ++j)  {",
			 "        for (int i = -radius; i <= 0; ++i)  {",
			 "            c = texture2D(texture, uv + vec2(i,j) * src_size).rgb;",
			 "            m3 += c;",
			 "            s3 += c * c;",
			 "        }",
			 "    }",


			 "    float min_sigma2 = 1e+2;",
			 "    m0 /= n;",
			 "    s0 = abs(s0 / n - m0 * m0);",

			 "    float sigma2 = s0.r + s0.g + s0.b;",
			 "    if (sigma2 < min_sigma2) {",
			 "        min_sigma2 = sigma2;",
			 "        gl_FragColor = vec4(m0, 1.0);",
			 "    }",

			 "    m1 /= n;",
			 "    s1 = abs(s1 / n - m1 * m1);",

			 "    sigma2 = s1.r + s1.g + s1.b;",
			 "    if (sigma2 < min_sigma2) {",
			 "        min_sigma2 = sigma2;",
			 "        gl_FragColor = vec4(m1, 1.0);",
			 "    }",

			 "    m2 /= n;",
			 "    s2 = abs(s2 / n - m2 * m2);",

			 "    sigma2 = s2.r + s2.g + s2.b;",
			 "    if (sigma2 < min_sigma2) {",
			 "        min_sigma2 = sigma2;",
			 "        gl_FragColor = vec4(m2, 1.0);",
			 "    }",

			 "    m3 /= n;",
			 "    s3 = abs(s3 / n - m3 * m3);",

			 "    sigma2 = s3.r + s3.g + s3.b;",
			 "    if (sigma2 < min_sigma2) {",
			 "        min_sigma2 = sigma2;",
			 "        gl_FragColor = vec4(m3, 1.0);",
			 "    }",
			 "}"
		
		].join("\n")
		
	}
}













