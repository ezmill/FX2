function MeshShader(){
		var flowSnippet = [
			"vec2 p = fragCoord.xy / iResolution.xy;",

			// "vec2 uv = p*0.15 + 0.25;",


			"fragColor = vec4(col, 1.0);"
		].join("\n");

		this.uniforms = THREE.UniformsUtils.merge([
			{
				"texture"  : { type: "t", value: null },
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
			"uniform vec2 resolution;",
			"uniform vec2 mouse;",
			"uniform float r2;",
			"uniform float time;",
			"varying vec2 vUv;",

			"void main() {",
			// "	vec4 color = texture2D(texture, vUv);",
			// "   gl_FragColor = vec4(color.rgb, color.a);",
				"vec2 q = vUv;",
			    "vec2 p = -1.0 + 2.0*q;",
			    "p.x *= resolution.x/resolution.y;",
		    	// "vec2 m = -1.0 + 2.0*mouse.xy/resolution.xy;",
		    	"vec2 m = mouse;",
		    	"m.x *= resolution.x/resolution.y;",
			    "float r = sqrt( dot((p - m), (p - m)) );",
			    "float a = atan(p.y, p.x);",
			    "vec3 col = texture2D(texture, vUv).rgb;",
			    "vec3 col2 = vec3(0.0);",
			    // "col2*=2.0;",
			    // "vec3 col2 = texture2D(texture, vUv).rgb*vec3(2.0,2.0,2.0);",
			    "if(r < r2){",
			    // " 	col *= vec3(1.0, 0.0, 0.0);   ",
			    "	float f = smoothstep(r2, r2 - 0.5, r);",
			    "	col = mix( col, col2, f);",
			    "}",
				"gl_FragColor = vec4(col,1.0);",
			"}"


		
		].join("\n");
}