var MeshShader = function(){
		var flowSnippet = [
			"vec2 p = fragCoord.xy / iResolution.xy;",

			// "vec2 uv = p*0.15 + 0.25;",


			"fragColor = vec4(col, 1.0);"
		].join("\n");

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
			// "	vec4 color = texture2D(texture, vUv);",
			// "   gl_FragColor = vec4(color.rgb, color.a);",
				// "vec2 q = vUv;",
			    // "vec2 p = -1.0 + 2.0*q;",
			    // "p.x *= resolution.x/resolution.y;",
		    	// "vec2 m = -1.0 + 2.0*mouse.xy/resolution.xy;",
		    	// "vec2 m = mouse;",
		    	// "m.x *= resolution.x/resolution.y;",
			    // "float r = sqrt( dot((p - m), (p - m)) );",
			    // "float a = atan(p.y, p.x);",
			    "vec3 col = texture2D(texture, vUv).rgb;",

			    "vec2 uv = vUv;",
			    
			    "vec2 e = 1.0/resolution.xy;",
			    
			    
			    "float am1 = 0.5 + 0.5*sin( time );",
			    "float am2 = cos( time*4.0 );",
			    
			    "for( int i=0; i<20; i++ )",
			    "{",
			    "	float h  = dot( texture2D(texture, uv*.1,          -100.0).xyz, vec3(0.33) );",
			    "	float h1 = dot( texture2D(texture, uv+vec2(e.x,0.0), -100.0).xyz, vec3(0.33) );",
			    "	float h2 = dot( texture2D(texture, uv+vec2(0.0,e.y), -100.0).xyz, vec3(0.33) );",
			    "	vec2 g = 0.001*vec2( (h1-h), (h2-h) )/e;",
			    "	vec2 f = g.yx*vec2(-1.0,1.0);",
			    "	",
			    "	g = mix( g, f, am1 );",
			    "	",
			    "	uv -= 0.001*g*am2;",
			    "}",
			    
			    "vec3 col2 = texture2D(texture, uv).xyz;",
			    "vec4 alpha = texture2D(alpha, vUv);",
			    // "col2*=2.0;",
			    // "vec3 col2 = texture2D(texture, vUv).rgb*vec3(2.0,2.0,2.0);",
			    "if(dot(alpha.rgb, vec3(1.0))/3.0 > 0.1){",
			    // " 	col *= vec3(1.0, 0.0, 0.0);   ",
			    // "	float f = smoothstep(r2, r2 - 0.5, r);",
			    "	col = mix( col, col2, dot(alpha.rgb, vec3(1.0))/3.0);",
			    // "	col = col2;",
			    "}",
				"gl_FragColor = vec4(mix(col, alpha.rgb,0.0),1.0);",
			"}"


		
		].join("\n");
}