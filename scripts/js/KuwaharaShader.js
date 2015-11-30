 var KuwaharaShader = function(){
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

              "const int radius = 2;",

              "void main() ",
             "{",
             "     vec2 src_size = vec2 (1.0 / resolution.x, 1.0 / resolution.y);",
              "    // vec2 uv = fragCoord.xy/resolution.xy;",
              "    vec2 uv = vUv;",
              "    float n = float((radius + 1) * (radius + 1));",
              "    int i; ",
              "     int j;",
              "    vec3 m0 = vec3(0.0); vec3 m1 = vec3(0.0); vec3 m2 = vec3(0.0); vec3 m3 = vec3(0.0);",
              "    vec3 s0 = vec3(0.0); vec3 s1 = vec3(0.0); vec3 s2 = vec3(0.0); vec3 s3 = vec3(0.0);",
              "    vec3 c;",
              
              " vec2 q = vUv;",
              " vec2 p = -1.0 + 2.0*q;",
              " p.x *= resolution.x/resolution.y;",
              " vec2 m = mouse;",
              " m.x *= resolution.x/resolution.y;",
              " float r = sqrt( dot((p - m), (p - m)) );",
              " float a = atan(p.y, p.x);",
              "  vec3 col = texture2D(texture, vUv).rgb;",              
              "vec4 alpha = texture2D(alpha, vUv);",

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
              "        if(r < r2){",
              "            float f = smoothstep(r2, r2 - 0.5, r);",
              "            col = mix( col, m0, f);",
              "        }",
              "        gl_FragColor = vec4(col,1.0);",
              "    }",

              "    m1 /= n;",
              "    s1 = abs(s1 / n - m1 * m1);",

              "    sigma2 = s1.r + s1.g + s1.b;",
              "    if (sigma2 < min_sigma2) {",
              "        min_sigma2 = sigma2;",
              "        if(r < r2){",
              "            float f = smoothstep(r2, r2 - 0.5, r);",
              "            col = mix( col, m1, f);",
              "        }",
              "        gl_FragColor = vec4(col,1.0);",
              "    }",

              "    m2 /= n;",
              "    s2 = abs(s2 / n - m2 * m2);",

              "    sigma2 = s2.r + s2.g + s2.b;",
              "    if (sigma2 < min_sigma2) {",
              "        min_sigma2 = sigma2;",
              "        if(r < r2){",
              "            float f = smoothstep(r2, r2 - 0.5, r);",
              "            col = mix( col, m2, f);",
              "        }",
              "        gl_FragColor = vec4(col,1.0);",
              "    }",
              "    m3 /= n;",
              "    s3 = abs(s3 / n - m3 * m3);",

              "    sigma2 = s3.r + s3.g + s3.b;",
              "    if (sigma2 < min_sigma2) {",
              "        min_sigma2 = sigma2;",
              "        if(r < r2){",
              "            float f = smoothstep(r2, r2 - 0.5, r);",
              "            col = mix( col, m3, f);",
              "        }",
              "        gl_FragColor = vec4(col,1.0);",
              "    }",
              "}",


         
         ].join("\n");
 } 