var BrushChunk = {  

	text:[
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
	    "		col = mix( col, col2mix, f);",
	    "	}",
	    "	gl_FragColor = vec4(col,1.0);",

	].join("\n")
};
