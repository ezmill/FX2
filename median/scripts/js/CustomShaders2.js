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
	this.colorShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"alpha"  : { type: "t", value: null },
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
			"uniform sampler2D alpha;",
			"uniform vec2 resolution;",
			"uniform vec2 mouse;",
			"uniform float r2;",
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

			"  //hsv.r += 0.1;",
			"  //hsv.r = mod(hsv.r, 1.0);",
			"  //hsv.g *= 1.1;",
			"  // hsv.g = mod(hsv.g, 1.0);",
			"  vec3 rgb = hsv2rgb(hsv); ",

			"    vec3 col2 = rgb;",
			"	vec2 q = vUv;",
		    "	vec2 p = -1.0 + 2.0*q;",
		    "	p.x *= resolution.x/resolution.y;",
	    	"	vec2 m = mouse;",
	    	"	m.x *= resolution.x/resolution.y;",
		    "	float r = sqrt( dot((p - m), (p - m)) );",
		    "	float a = atan(p.y, p.x);",
		    "	vec3 col = texture2D(texture, vUv).rgb;",
		    "	vec4 alpha = texture2D(alpha, vUv);",
		    // "	if(r < r2 && (dot(alpha.rgb, vec3(1.0))/3.0) < 0.1){",
		    "	if(r < r2){",
		    "		float f = smoothstep(r2, r2 - 0.5, r);",
		    "		col = mix( col, col2, f);",
		    "	}",
			"    gl_FragColor = vec4(col, 1.0);",
			// "  gl_FragColor = vec4(rgb,1.0);",
			"}"
		
		].join("\n")
	
	},

	this.flowShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"alpha"  : { type: "t", value: null },
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
			"uniform sampler2D alpha;",
			"varying vec2 vUv;",
			"uniform vec2 mouse;",

			"void main( void ){",
			"    vec2 uv = vUv;",

			"    vec2 e = 1.0/resolution.xy;",


			"    float am1 = 0.5 + 0.5*0.927180409;",
			"    float am2 = 10.0;",

			"    for( int i=0; i<20; i++ ){",
			"    	float h  = dot( texture2D(texture, uv*0.99            ).xyz,   vec3(0.333) );",
			"    	float h1 = dot( texture2D(texture, uv+vec2(e.x,0.0)).xyz, vec3(0.333) );",
			"    	float h2 = dot( texture2D(texture, uv+vec2(0.0,e.y)).xyz, vec3(0.333) );",
			"    	vec2 g = 0.001*vec2( (h-h2), (h-h1) )/e;",
			// "    	vec2 g = 0.001*vec2( (h1-h), (h2-h) )/e;",
			"    	vec2 f = g.yx*vec2(30.0*mouse.x, 30.0*mouse.y);",
			// "    	vec2 f = g.yx*vec2(-1.0,1.0);",

			"   	g = mix( g, f, am1 );",

			"    	uv += 0.00005*g*am2;",
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
		    "	vec4 alpha = texture2D(alpha, vUv);",
		    "	if(r < r2 && (dot(alpha.rgb, vec3(1.0))/3.0) < 0.1){",
		    "		float f = smoothstep(r2, r2 - 0.5, r);",
		    "		col = mix( col, col2, f);",
		    "	}",
			"    gl_FragColor = vec4(col, 1.0);",
			"}"
		
		].join("\n")
	
	},
	this.sobelShader = {
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
			"vec3 sample(const int x, const int y, in vec2 fc)",
			"{",
			"    vec2 uv = fc.xy / resolution.xy * resolution.xy;",
			"    uv = (uv + vec2(x, y)) / resolution.xy;",
			"    return texture2D(texture, uv).xyz;",
			"}",

			"float luminance(vec3 c)",
			"{",
			"    return dot(c, vec3(.2126, .7152, .0722));",
			"}",

			"vec3 filter(in vec2 fc)",
			"{",
			"    vec3 hc =sample(-1,-1, fc) *  1. + sample( 0,-1, fc) *  2.",
			"             +sample( 1,-1, fc) *  1. + sample(-1, 1, fc) * -1.",
			"             +sample( 0, 1, fc) * -2. + sample( 1, 1, fc) * -1.;",

			"    vec3 vc =sample(-1,-1, fc) *  1. + sample(-1, 0, fc) *  2.",
			"             +sample(-1, 1, fc) *  1. + sample( 1,-1, fc) * -1.",
			"             +sample( 1, 0, fc) * -2. + sample( 1, 1, fc) * -1.;",

			"    return sample(0, 0, fc) * pow(luminance(vc*vc + hc*hc), .6);",
			"}",

			"void main()",
			"{",
			"    float u = gl_FragCoord.x / resolution.x;",
			"    float m = mouse.x / resolution.x;",
			"    ",
			"    float l = smoothstep(0., 1. / resolution.y, abs(m - u));",
			"    ",
			"    vec2 fc = gl_FragCoord.xy;",
			// "    fc.y = resolution.y - gl_FragCoord.y;",
			"    ",
			"    vec3 cf = filter(fc);",
			"    vec3 cl = sample(0, 0, fc);",
			"    vec3 cr = (u < m ? cl : cf) * l;",
			// "    gl_FragColor = vec4(cr, 1);",
			"	vec2 q = vUv;",
		    "	vec2 p = -1.0 + 2.0*q;",
		    "	p.x *= resolution.x/resolution.y;",
	    	"	vec2 m0 = mouse;",
	    	"	m0.x *= resolution.x/resolution.y;",
		    "	float r = sqrt( dot((p - m0), (p - m0)) );",
		    "	float a = atan(p.y, p.x);",
		    "	vec3 col = texture2D(texture, vUv).rgb;",
		    "	if(r < r2){",
		    "		float f = smoothstep(r2, r2 - 0.5, r);",
		    "		col = mix( col, cr, f);",
		    "	}",
			"	gl_FragColor = vec4(col,1.0);",

			// "  gl_FragColor = input0;",
			"}"
		
		].join("\n")

	},
	this.medianShader = {
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
			"uniform float time;",
			"varying vec2 vUv;",
		
			"//Looks like 16 is too much for Windows!",
			"//16/32 is pretty good on Mac, 64 works but slow.",
			"#define SORT_SIZE   8",

			"//get color by packing 3 channels into 1 Or just do luminance to get some fps back :)",
			"#define COLOR 1 ",

			"//ramp the radius up and down... at the cost of some silly code which goes also slower",
			"#define RAMP 0",


			"float sort[SORT_SIZE];",

			"#define SWAP(a,b) { float t = max(sort[a],sort[b]); sort[a] = min(sort[a],sort[b]); sort[b] = t; }",

			"//various sized sorting networks generated with this:",
			"//http://pages.ripco.net/~jgamble/nw.html",

			"#define SORT8 SWAP(0, 1);  SWAP(2, 3); SWAP(0, 2); SWAP(1, 3); SWAP(1, 2); SWAP(4, 5); SWAP(6, 7); SWAP(4, 6); SWAP(5, 7); SWAP(5, 6); SWAP(0, 4); SWAP(1, 5); SWAP(1, 4); SWAP(2, 6); SWAP(3, 7); SWAP(3, 6); SWAP(2, 4); SWAP(3, 5); SWAP(3, 4);",

			"#define SORT16 SWAP(0, 1); SWAP(2, 3); SWAP(4, 5); SWAP(6, 7); SWAP(8, 9); SWAP(10, 11); SWAP(12, 13); SWAP(14, 15); SWAP(0, 2); SWAP(4, 6); SWAP(8, 10); SWAP(12, 14); SWAP(1, 3); SWAP(5, 7); SWAP(9, 11); SWAP(13, 15); SWAP(0, 4); SWAP(8, 12); SWAP(1, 5); SWAP(9, 13); SWAP(2, 6); SWAP(10, 14); SWAP(3, 7); SWAP(11, 15); SWAP(0, 8); SWAP(1, 9); SWAP(2, 10); SWAP(3, 11); SWAP(4, 12); SWAP(5, 13); SWAP(6, 14); SWAP(7, 15); SWAP(5, 10); SWAP(6, 9); SWAP(3, 12); SWAP(13, 14); SWAP(7, 11); SWAP(1, 2); SWAP(4, 8); SWAP(1, 4); SWAP(7, 13); SWAP(2, 8); SWAP(11, 14); SWAP(2, 4); SWAP(5, 6); SWAP(9, 10); SWAP(11, 13); SWAP(3, 8); SWAP(7, 12); SWAP(6, 8); SWAP(10, 12); SWAP(3, 5); SWAP(7, 9); SWAP(3, 4); SWAP(5, 6); SWAP(7, 8); SWAP(9, 10); SWAP(11, 12); SWAP(6, 7); SWAP(8, 9);",

			"#define SORT32 SWAP(0, 16); SWAP(1, 17); SWAP(2, 18); SWAP(3, 19); SWAP(4, 20); SWAP(5, 21); SWAP(6, 22); SWAP(7, 23); SWAP(8, 24); SWAP(9, 25); SWAP(10, 26); SWAP(11, 27); SWAP(12, 28); SWAP(13, 29); SWAP(14, 30); SWAP(15, 31); SWAP(0, 8); SWAP(1, 9); SWAP(2, 10); SWAP(3, 11); SWAP(4, 12); SWAP(5, 13); SWAP(6, 14); SWAP(7, 15); SWAP(16, 24); SWAP(17, 25); SWAP(18, 26); SWAP(19, 27); SWAP(20, 28); SWAP(21, 29); SWAP(22, 30); SWAP(23, 31); SWAP(8, 16); SWAP(9, 17); SWAP(10, 18); SWAP(11, 19); SWAP(12, 20); SWAP(13, 21); SWAP(14, 22); SWAP(15, 23); SWAP(0, 4); SWAP(1, 5); SWAP(2, 6); SWAP(3, 7); SWAP(24, 28); SWAP(25, 29); SWAP(26, 30); SWAP(27, 31); SWAP(8, 12); SWAP(9, 13); SWAP(10, 14); SWAP(11, 15); SWAP(16, 20); SWAP(17, 21); SWAP(18, 22); SWAP(19, 23); SWAP(0, 2); SWAP(1, 3); SWAP(28, 30); SWAP(29, 31); SWAP(4, 16); SWAP(5, 17); SWAP(6, 18); SWAP(7, 19); SWAP(12, 24); SWAP(13, 25); SWAP(14, 26); SWAP(15, 27); SWAP(0, 1); SWAP(30, 31); SWAP(4, 8); SWAP(5, 9); SWAP(6, 10); SWAP(7, 11); SWAP(12, 16); SWAP(13, 17); SWAP(14, 18); SWAP(15, 19); SWAP(20, 24); SWAP(21, 25); SWAP(22, 26); SWAP(23, 27); SWAP(4, 6); SWAP(5, 7); SWAP(8, 10); SWAP(9, 11); SWAP(12, 14); SWAP(13, 15); SWAP(16, 18); SWAP(17, 19); SWAP(20, 22); SWAP(21, 23); SWAP(24, 26); SWAP(25, 27); SWAP(2, 16); SWAP(3, 17); SWAP(6, 20); SWAP(7, 21); SWAP(10, 24); SWAP(11, 25); SWAP(14, 28); SWAP(15, 29); SWAP(2, 8); SWAP(3, 9); SWAP(6, 12); SWAP(7, 13); SWAP(10, 16); SWAP(11, 17); SWAP(14, 20); SWAP(15, 21); SWAP(18, 24); SWAP(19, 25); SWAP(22, 28); SWAP(23, 29); SWAP(2, 4); SWAP(3, 5); SWAP(6, 8); SWAP(7, 9); SWAP(10, 12); SWAP(11, 13); SWAP(14, 16); SWAP(15, 17); SWAP(18, 20); SWAP(19, 21); SWAP(22, 24); SWAP(23, 25); SWAP(26, 28); SWAP(27, 29); SWAP(2, 3); SWAP(4, 5); SWAP(6, 7); SWAP(8, 9); SWAP(10, 11); SWAP(12, 13); SWAP(14, 15); SWAP(16, 17); SWAP(18, 19); SWAP(20, 21); SWAP(22, 23); SWAP(24, 25); SWAP(26, 27); SWAP(28, 29); SWAP(1, 16); SWAP(3, 18); SWAP(5, 20); SWAP(7, 22); SWAP(9, 24); SWAP(11, 26); SWAP(13, 28); SWAP(15, 30); SWAP(1, 8); SWAP(3, 10); SWAP(5, 12); SWAP(7, 14); SWAP(9, 16); SWAP(11, 18); SWAP(13, 20); SWAP(15, 22); SWAP(17, 24); SWAP(19, 26); SWAP(21, 28); SWAP(23, 30); SWAP(1, 4); SWAP(3, 6); SWAP(5, 8); SWAP(7, 10); SWAP(9, 12); SWAP(11, 14); SWAP(13, 16); SWAP(15, 18); SWAP(17, 20); SWAP(19, 22); SWAP(21, 24); SWAP(23, 26); SWAP(25, 28); SWAP(27, 30); SWAP(1, 2); SWAP(3, 4); SWAP(5, 6); SWAP(7, 8); SWAP(9, 10); SWAP(11, 12); SWAP(13, 14); SWAP(15, 16); SWAP(17, 18); SWAP(19, 20); SWAP(21, 22); SWAP(23, 24); SWAP(25, 26); SWAP(27, 28); SWAP(29, 30);",

			"#define SORT64 SWAP(0, 32); SWAP(1, 33); SWAP(2, 34); SWAP(3, 35); SWAP(4, 36); SWAP(5, 37); SWAP(6, 38); SWAP(7, 39); SWAP(8, 40); SWAP(9, 41); SWAP(10, 42); SWAP(11, 43); SWAP(12, 44); SWAP(13, 45); SWAP(14, 46); SWAP(15, 47); SWAP(16, 48); SWAP(17, 49); SWAP(18, 50); SWAP(19, 51); SWAP(20, 52); SWAP(21, 53); SWAP(22, 54); SWAP(23, 55); SWAP(24, 56); SWAP(25, 57); SWAP(26, 58); SWAP(27, 59); SWAP(28, 60); SWAP(29, 61); SWAP(30, 62); SWAP(31, 63); SWAP(0, 16); SWAP(1, 17); SWAP(2, 18); SWAP(3, 19); SWAP(4, 20); SWAP(5, 21); SWAP(6, 22); SWAP(7, 23); SWAP(8, 24); SWAP(9, 25); SWAP(10, 26); SWAP(11, 27); SWAP(12, 28); SWAP(13, 29); SWAP(14, 30); SWAP(15, 31); SWAP(32, 48); SWAP(33, 49); SWAP(34, 50); SWAP(35, 51); SWAP(36, 52); SWAP(37, 53); SWAP(38, 54); SWAP(39, 55); SWAP(40, 56); SWAP(41, 57); SWAP(42, 58); SWAP(43, 59); SWAP(44, 60); SWAP(45, 61); SWAP(46, 62); SWAP(47, 63); SWAP(16, 32); SWAP(17, 33); SWAP(18, 34); SWAP(19, 35); SWAP(20, 36); SWAP(21, 37); SWAP(22, 38); SWAP(23, 39); SWAP(24, 40); SWAP(25, 41); SWAP(26, 42); SWAP(27, 43); SWAP(28, 44); SWAP(29, 45); SWAP(30, 46); SWAP(31, 47); SWAP(0, 8); SWAP(1, 9); SWAP(2, 10); SWAP(3, 11); SWAP(4, 12); SWAP(5, 13); SWAP(6, 14); SWAP(7, 15); SWAP(48, 56); SWAP(49, 57); SWAP(50, 58); SWAP(51, 59); SWAP(52, 60); SWAP(53, 61); SWAP(54, 62); SWAP(55, 63); SWAP(16, 24); SWAP(17, 25); SWAP(18, 26); SWAP(19, 27); SWAP(20, 28); SWAP(21, 29); SWAP(22, 30); SWAP(23, 31); SWAP(32, 40); SWAP(33, 41); SWAP(34, 42); SWAP(35, 43); SWAP(36, 44); SWAP(37, 45); SWAP(38, 46); SWAP(39, 47); SWAP(0, 4); SWAP(1, 5); SWAP(2, 6); SWAP(3, 7); SWAP(56, 60); SWAP(57, 61); SWAP(58, 62); SWAP(59, 63); SWAP(8, 32); SWAP(9, 33); SWAP(10, 34); SWAP(11, 35); SWAP(12, 36); SWAP(13, 37); SWAP(14, 38); SWAP(15, 39); SWAP(24, 48); SWAP(25, 49); SWAP(26, 50); SWAP(27, 51); SWAP(28, 52); SWAP(29, 53); SWAP(30, 54); SWAP(31, 55); SWAP(0, 2); SWAP(1, 3); SWAP(60, 62); SWAP(61, 63); SWAP(8, 16); SWAP(9, 17); SWAP(10, 18); SWAP(11, 19); SWAP(12, 20); SWAP(13, 21); SWAP(14, 22); SWAP(15, 23); SWAP(24, 32); SWAP(25, 33); SWAP(26, 34); SWAP(27, 35); SWAP(28, 36); SWAP(29, 37); SWAP(30, 38); SWAP(31, 39); SWAP(40, 48); SWAP(41, 49); SWAP(42, 50); SWAP(43, 51); SWAP(44, 52); SWAP(45, 53); SWAP(46, 54); SWAP(47, 55); SWAP(0, 1); SWAP(62, 63); SWAP(8, 12); SWAP(9, 13); SWAP(10, 14); SWAP(11, 15); SWAP(16, 20); SWAP(17, 21); SWAP(18, 22); SWAP(19, 23); SWAP(24, 28); SWAP(25, 29); SWAP(26, 30); SWAP(27, 31); SWAP(32, 36); SWAP(33, 37); SWAP(34, 38); SWAP(35, 39); SWAP(40, 44); SWAP(41, 45); SWAP(42, 46); SWAP(43, 47); SWAP(48, 52); SWAP(49, 53); SWAP(50, 54); SWAP(51, 55); SWAP(4, 32); SWAP(5, 33); SWAP(6, 34); SWAP(7, 35); SWAP(12, 40); SWAP(13, 41); SWAP(14, 42); SWAP(15, 43); SWAP(20, 48); SWAP(21, 49); SWAP(22, 50); SWAP(23, 51); SWAP(28, 56); SWAP(29, 57); SWAP(30, 58); SWAP(31, 59); SWAP(4, 16); SWAP(5, 17); SWAP(6, 18); SWAP(7, 19); SWAP(12, 24); SWAP(13, 25); SWAP(14, 26); SWAP(15, 27); SWAP(20, 32); SWAP(21, 33); SWAP(22, 34); SWAP(23, 35); SWAP(28, 40); SWAP(29, 41); SWAP(30, 42); SWAP(31, 43); SWAP(36, 48); SWAP(37, 49); SWAP(38, 50); SWAP(39, 51); SWAP(44, 56); SWAP(45, 57); SWAP(46, 58); SWAP(47, 59); SWAP(4, 8); SWAP(5, 9); SWAP(6, 10); SWAP(7, 11); SWAP(12, 16); SWAP(13, 17); SWAP(14, 18); SWAP(15, 19); SWAP(20, 24); SWAP(21, 25); SWAP(22, 26); SWAP(23, 27); SWAP(28, 32); SWAP(29, 33); SWAP(30, 34); SWAP(31, 35); SWAP(36, 40); SWAP(37, 41); SWAP(38, 42); SWAP(39, 43); SWAP(44, 48); SWAP(45, 49); SWAP(46, 50); SWAP(47, 51); SWAP(52, 56); SWAP(53, 57); SWAP(54, 58); SWAP(55, 59); SWAP(4, 6); SWAP(5, 7); SWAP(8, 10); SWAP(9, 11); SWAP(12, 14); SWAP(13, 15); SWAP(16, 18); SWAP(17, 19); SWAP(20, 22); SWAP(21, 23); SWAP(24, 26); SWAP(25, 27); SWAP(28, 30); SWAP(29, 31); SWAP(32, 34); SWAP(33, 35); SWAP(36, 38); SWAP(37, 39); SWAP(40, 42); SWAP(41, 43); SWAP(44, 46); SWAP(45, 47); SWAP(48, 50); SWAP(49, 51); SWAP(52, 54); SWAP(53, 55); SWAP(56, 58); SWAP(57, 59); SWAP(2, 32); SWAP(3, 33); SWAP(6, 36); SWAP(7, 37); SWAP(10, 40); SWAP(11, 41); SWAP(14, 44); SWAP(15, 45); SWAP(18, 48); SWAP(19, 49); SWAP(22, 52); SWAP(23, 53); SWAP(26, 56); SWAP(27, 57); SWAP(30, 60); SWAP(31, 61); SWAP(2, 16); SWAP(3, 17); SWAP(6, 20); SWAP(7, 21); SWAP(10, 24); SWAP(11, 25); SWAP(14, 28); SWAP(15, 29); SWAP(18, 32); SWAP(19, 33); SWAP(22, 36); SWAP(23, 37); SWAP(26, 40); SWAP(27, 41); SWAP(30, 44); SWAP(31, 45); SWAP(34, 48); SWAP(35, 49); SWAP(38, 52); SWAP(39, 53); SWAP(42, 56); SWAP(43, 57); SWAP(46, 60); SWAP(47, 61); SWAP(2, 8); SWAP(3, 9); SWAP(6, 12); SWAP(7, 13); SWAP(10, 16); SWAP(11, 17); SWAP(14, 20); SWAP(15, 21); SWAP(18, 24); SWAP(19, 25); SWAP(22, 28); SWAP(23, 29); SWAP(26, 32); SWAP(27, 33); SWAP(30, 36); SWAP(31, 37); SWAP(34, 40); SWAP(35, 41); SWAP(38, 44); SWAP(39, 45); SWAP(42, 48); SWAP(43, 49); SWAP(46, 52); SWAP(47, 53); SWAP(50, 56); SWAP(51, 57); SWAP(54, 60); SWAP(55, 61); SWAP(2, 4); SWAP(3, 5); SWAP(6, 8); SWAP(7, 9); SWAP(10, 12); SWAP(11, 13); SWAP(14, 16); SWAP(15, 17); SWAP(18, 20); SWAP(19, 21); SWAP(22, 24); SWAP(23, 25); SWAP(26, 28); SWAP(27, 29); SWAP(30, 32); SWAP(31, 33); SWAP(34, 36); SWAP(35, 37); SWAP(38, 40); SWAP(39, 41); SWAP(42, 44); SWAP(43, 45); SWAP(46, 48); SWAP(47, 49); SWAP(50, 52); SWAP(51, 53); SWAP(54, 56); SWAP(55, 57); SWAP(58, 60); SWAP(59, 61); SWAP(2, 3); SWAP(4, 5); SWAP(6, 7); SWAP(8, 9); SWAP(10, 11); SWAP(12, 13); SWAP(14, 15); SWAP(16, 17); SWAP(18, 19); SWAP(20, 21); SWAP(22, 23); SWAP(24, 25); SWAP(26, 27); SWAP(28, 29); SWAP(30, 31); SWAP(32, 33); SWAP(34, 35); SWAP(36, 37); SWAP(38, 39); SWAP(40, 41); SWAP(42, 43); SWAP(44, 45); SWAP(46, 47); SWAP(48, 49); SWAP(50, 51); SWAP(52, 53); SWAP(54, 55); SWAP(56, 57); SWAP(58, 59); SWAP(60, 61); SWAP(1, 32); SWAP(3, 34); SWAP(5, 36); SWAP(7, 38); SWAP(9, 40); SWAP(11, 42); SWAP(13, 44); SWAP(15, 46); SWAP(17, 48); SWAP(19, 50); SWAP(21, 52); SWAP(23, 54); SWAP(25, 56); SWAP(27, 58); SWAP(29, 60); SWAP(31, 62); SWAP(1, 16); SWAP(3, 18); SWAP(5, 20); SWAP(7, 22); SWAP(9, 24); SWAP(11, 26); SWAP(13, 28); SWAP(15, 30); SWAP(17, 32); SWAP(19, 34); SWAP(21, 36); SWAP(23, 38); SWAP(25, 40); SWAP(27, 42); SWAP(29, 44); SWAP(31, 46); SWAP(33, 48); SWAP(35, 50); SWAP(37, 52); SWAP(39, 54); SWAP(41, 56); SWAP(43, 58); SWAP(45, 60); SWAP(47, 62); SWAP(1, 8); SWAP(3, 10); SWAP(5, 12); SWAP(7, 14); SWAP(9, 16); SWAP(11, 18); SWAP(13, 20); SWAP(15, 22); SWAP(17, 24); SWAP(19, 26); SWAP(21, 28); SWAP(23, 30); SWAP(25, 32); SWAP(27, 34); SWAP(29, 36); SWAP(31, 38); SWAP(33, 40); SWAP(35, 42); SWAP(37, 44); SWAP(39, 46); SWAP(41, 48); SWAP(43, 50); SWAP(45, 52); SWAP(47, 54); SWAP(49, 56); SWAP(51, 58); SWAP(53, 60); SWAP(55, 62); SWAP(1, 4); SWAP(3, 6); SWAP(5, 8); SWAP(7, 10); SWAP(9, 12); SWAP(11, 14); SWAP(13, 16); SWAP(15, 18); SWAP(17, 20); SWAP(19, 22); SWAP(21, 24); SWAP(23, 26); SWAP(25, 28); SWAP(27, 30); SWAP(29, 32); SWAP(31, 34); SWAP(33, 36); SWAP(35, 38); SWAP(37, 40); SWAP(39, 42); SWAP(41, 44); SWAP(43, 46); SWAP(45, 48); SWAP(47, 50); SWAP(49, 52); SWAP(51, 54); SWAP(53, 56); SWAP(55, 58); SWAP(57, 60); SWAP(59, 62); SWAP(1, 2); SWAP(3, 4); SWAP(5, 6); SWAP(7, 8); SWAP(9, 10); SWAP(11, 12); SWAP(13, 14); SWAP(15, 16); SWAP(17, 18); SWAP(19, 20); SWAP(21, 22); SWAP(23, 24); SWAP(25, 26); SWAP(27, 28); SWAP(29, 30); SWAP(31, 32); SWAP(33, 34); SWAP(35, 36); SWAP(37, 38); SWAP(39, 40); SWAP(41, 42); SWAP(43, 44); SWAP(45, 46); SWAP(47, 48); SWAP(49, 50); SWAP(51, 52); SWAP(53, 54); SWAP(55, 56); SWAP(57, 58); SWAP(59, 60); SWAP(61, 62);",

			"void Sort()",
			"{",
			"    #if (SORT_SIZE == 8)",
			"    SORT8",
			"    #endif  ",
			"    #if (SORT_SIZE == 16)",
			"    SORT16",
			"    #endif",
			"    #if (SORT_SIZE == 32)",
			"    SORT32",
			"    #endif",
			"    #if (SORT_SIZE == 64)",
			"    SORT64",
			"    #endif  ",
			"}",

			"float medians[SORT_SIZE];",

			"float quant(float x)",
			"{",
			"    x = clamp(x,0.,1.);",
			"    return floor(x*255.);",
			"}",

			"float pack(vec3 c)",
			"{   ",
			"    float lum = (c.x+c.y+c.z)*(1./3.);",

			"#if COLOR   ",
			"    //want to sort by luminance I guess so put that in MSB and quantize everything to 8 bit",
			"    //since floats represent 24 bit ints you get 3 channels and only have to sort a scalar value",
			"    return quant(c.x) + quant(c.y)*256. + quant(lum) * 65536.;",
			"#else   ",
			"    return lum;",
			"#endif  ",
			"}",

			"vec3 unpack(float x)",
			"{",
			"#if COLOR       ",
			"    float lum = floor(x * (1./65536.)) * (1./255.);",
			"    vec3 c;",
			"    c.x = floor(mod(x,256.))            * (1./255.);",
			"    c.y = floor(mod(x*(1./256.),256.)) * (1./255.);",
			"    c.z = lum * 3. - c.y - c.x;",
			"    return c;",
			"#else",
			"    return vec3(x); ",
			"#endif  ",
			"}",

			"void main()",
			"{",
			"    vec2 ooRes = vec2(1) / resolution.xy;",

			"#if RAMP    ",
			"    //pick a radius to ramp up and down to demo the effect ... sorting networks are fixed size.",
			"    float r = (sin(time+5.)*0.5+0.5)*float(SORT_SIZE/2)*1.1;",
			"#endif",
			"    ",
			"    //do a bunch of 1D sorts on X",
			"    for (int j=0; j<SORT_SIZE; j++)",
			"    {",
			"        //gather all X the texels for this Y",
			"        for (int i=0; i<SORT_SIZE; i++)",
			"        {",
			"            vec2 uv = (gl_FragCoord.xy + vec2(i,j)-vec2(SORT_SIZE/2)) * ooRes;",
			// "            uv.y=1.-uv.y; //upside down",
			"            float c = pack( texture2D(texture,uv).xyz );",
			"                                                            ",
			"#if RAMP    ",
			"            if (float(i)<float(SORT_SIZE/2) - r) c=-1e10;   //force to beginning of sorted list",
			"            if (float(i)>float(SORT_SIZE/2) + r) c=1e10;    //force to end of sorted list",
			"#endif          ",
			"            sort[i]=c;          ",
			"        }",
			"            ",
			"        Sort();",
			"        ",
			"        //keep the median from X",
			"        float m = sort[(SORT_SIZE/2)];",

			"#if RAMP            ",
			"        if (float(j)<float(SORT_SIZE/2) - r) m=-1e10;",
			"        if (float(j)>float(SORT_SIZE/2) + r) m=1e10;                ",
			"#endif  ",
			"        medians[j] = m;",
			"    }",

			"    //sort the medians",
			"    for (int i=0; i<SORT_SIZE; i++)",
			"    {",
			"        sort[i]=medians[i];",
			"    }   ",
			"    Sort();",
			"    ",
			"    //median of medians is pretty near the true median",
			"    vec3 cr = unpack(sort[(SORT_SIZE/2)]);",
			"	vec2 q = vUv;",
		    "	vec2 p = -1.0 + 2.0*q;",
		    "	p.x *= resolution.x/resolution.y;",
	    	"	vec2 m = mouse;",
	    	"	m.x *= resolution.x/resolution.y;",
		    "	float r0 = sqrt( dot((p - m), (p - m)) );",
		    "	float a = atan(p.y, p.x);",
		    "	vec3 col = texture2D(texture, vUv).rgb;",
		    "	if(r0 < r2){",
		    "		float f = smoothstep(r2, r2 - 0.5, r0);",
		    "		col = mix( col, cr, f);",
		    "	}",
			"	gl_FragColor = vec4(col,1.0);",

			// "  gl_FragColor = input0;",
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
			"  float step_w = 30.0/resolution.x;",
			"  float step_h = 30.0/resolution.y;",
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

			"  input0 *=0.21;",
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
	this.gaussianShader = {

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

			"float kernel[9];",
			"vec2 offset[9];",

			"void main() {",
			"	float step_w = 1.0/resolution.x;",
			"	float step_h = 1.0/resolution.y;",
			"	vec2 tc = vUv;",
			"	vec4 input0 = texture2D(texture,tc);",
			"	kernel[0] = 1.0; kernel[1] = 1.0; kernel[2] = 1.0;",
			"	kernel[3] = 1.0; kernel[4] = 8.0; kernel[5] = 1.0;",
			"	kernel[6] = 1.0; kernel[7] = 1.0; kernel[8] = 1.0;",
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
			"	float kernelWeight = kernel[0] + kernel[1] + kernel[2] + kernel[3] + kernel[4] + kernel[5] + kernel[6] + kernel[7] + kernel[8];",
			"	if (kernelWeight <= 0.0) {",
			"	   kernelWeight = 1.0;",
			"	}",

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
		    "		col = mix( col, (input0/kernelWeight).rgb, f);",
		    "	}",
			"	gl_FragColor = vec4(col,1.0);",
			// "	gl_FragColor = vec4(, 1.0);",
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
				"alpha"  : { type: "t", value: null },
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
			"uniform sampler2D alpha;",
			"uniform vec2 mouse;",
			"uniform vec2 resolution;",

			"uniform float r2;",

			"void main(){",

			"    vec2 tc = vUv;",
			"    vec4 look = texture2D(texture,tc);",
			// "    vec2 offs = vec2(look.y-look.x,look.w-look.z)*0.001;",
			"    vec2 offs = vec2(look.y-look.x,look.w-look.z)*vec2(mouse.x/33.333, mouse.y/33.333);",
			// "    vec2 offs = vec2(look.y-look.x,look.w-look.z)*vec2(0.0, 0.01);",
			"    vec2 coord = offs+tc;",
			"    vec4 repos = texture2D(texture, coord);",
			"    repos*=1.001;",
			// "    gl_FragColor = repos;",

			"	vec2 q = vUv;",
		    "	vec2 p = -1.0 + 2.0*q;",
		    "	p.x *= resolution.x/resolution.y;",
	    	"	vec2 m = mouse;",
	    	"	m.x *= resolution.x/resolution.y;",
		    "	float r = sqrt( dot((p - m), (p - m)) );",
		    "	float a = atan(p.y, p.x);",
		    "	vec3 col = texture2D(texture, vUv).rgb;",
		    "	vec4 alpha = texture2D(alpha, vUv);",
		    "	if(r < r2 && (dot(alpha.rgb, vec3(1.0))/3.0) < 0.1){",
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
				"lightWidth"  : { type: "f", value: 9.5 },
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













