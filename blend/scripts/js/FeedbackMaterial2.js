function FeedbackMaterial(RENDERER, SCENE, CAMERA, TEXTURE, SHADERS){

    this.renderer = RENDERER;
    this.scene = SCENE;
    this.camera = CAMERA;
    this.texture = TEXTURE;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.shader1 = SHADERS[0];
    this.shader2 = SHADERS[1];
    this.shader3 = SHADERS[2];
    // this.shader4 = SHADERS[3];
    // this.shader5 = SHADERS[4];
    this.outputShader = SHADERS[3]

    this.mesh;
    
    //this.geometry = new THREE.PlaneBufferGeometry(renderSize.x, renderSize.y);
    
    
    this.fbos = [];
    this.init = function(){

        this.fbos[0] = new FeedbackObject(this.shader1);
        this.fbos[0].material.uniforms.texture.value = this.texture;

        this.fbos[1] = new FeedbackObject(this.shader2); 
        this.fbos[1].material.uniforms.texture.value = this.fbos[0].renderTarget;
        this.fbos[1].material.uniforms.texture2.value = this.texture;

        this.fbos[2] = new FeedbackObject(this.shader3); 
        this.fbos[2].material.uniforms.texture.value = this.fbos[1].renderTarget;

        // this.fbos.push(this.fbo1);
        // this.fbos.push(this.frameDiff);
        // this.fbos.push(this.fbo2);
        // 
        for(var i = 0; i < this.fbos.length; i++){
          this.fbos[i].material.uniforms.resolution.value = new THREE.Vector2(renderSize.x, renderSize.y);
        }
        
        this.fbos[0].material.uniforms.texture.value = this.fbos[1].renderTarget; 

        this.material = new THREE.ShaderMaterial({
            uniforms: this.outputShader.uniforms,
            vertexShader: this.outputShader.vertexShader,
            fragmentShader: this.outputShader.fragmentShader,
            transparent: true,
            side: 2
        });
        this.material.uniforms["texture"].value = this.fbos[2].renderTarget;
        this.material.uniforms["texture"].minFilter = this.material.uniforms["texture"].magFilter = THREE.LinearFilter;
        this.material.uniforms["resolution"].value = new THREE.Vector2(renderSize.x, renderSize.y);
        this.material.uniforms["mouse"].value = new THREE.Vector2(renderSize.x, 0);
        
        this.geometry = new THREE.PlaneGeometry(renderSize.x, renderSize.y, 0);
        // this.geometry = new THREE.PlaneGeometry(2560/2,1600/2, 0);
        // this.geometry = new THREE.PlaneGeometry(1080,720, 0);

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0,0,0);
        this.scene.add(this.mesh);  
    }

    this.resize = function(){
        for(var i = 0; i < this.fbos.length; i++){
          this.fbos[i].material.uniforms.resolution.value = new THREE.Vector2(renderSize.x, renderSize.y);
        }
    }

    this.update = function(){
        // this.fbo2.render(this.renderer, this.camera);
        this.fbos[1].render(this.renderer, this.camera);
        this.fbos[2].render(this.renderer, this.camera);

        // this.fbo4.render(this.renderer, this.camera);
    }
    this.expand = function(scl){
        this.frameDiff.mesh.scale.set(scl,scl,scl);
    }
    this.getNewFrame = function(){
        this.fbos[0].render(this.renderer, this.camera);
    }
    this.swapBuffers = function(){
        var a = this.fbos[2].renderTarget;
        this.fbos[2].renderTarget = this.fbos[0].renderTarget;
        this.fbos[0].renderTarget = a;
    }
    this.setUniforms = function(){
        for(var i = 0; i < this.fbos.length; i++){
          this.fbos[i].material.uniforms.time.value = time;
          if(this.fbos[i].material.uniforms["r2"])this.fbos[i].material.uniforms["r2"].value = r2;
          if(this.fbos[i].material.uniforms["resolution"])this.fbos[i].material.uniforms["resolution"].value = new THREE.Vector2(renderSize.x, renderSize.y);
          if(this.fbos[i].material.uniforms["alpha"])this.fbos[i].material.uniforms["alpha"].value = alpha;
          if(this.material.uniforms["alpha"])this.material.uniforms["alpha"].value = alpha;
          if(this.fbos[i].material.uniforms["mouse"])this.fbos[i].material.uniforms["mouse"].value = new THREE.Vector2(mouse.x, mouse.y);;
        }
    }
    this.disposeFbos = function(NEWSHADERS, NEWTEXTURE){
        // this.fbo2.render(this.renderer,this.camera);
        // this.newTex = this.material.uniforms["texture"].value.clone();
        // mask.erase();
        // this.newTex = THREE.ImageUtils.loadTexture("assets/textures/test.jpg");
        for(var i = 0; i < this.fbos.length; i++){
            this.fbos[i].dispose();
        }
        this.shader1 = NEWSHADERS[0];
        this.shader2 = NEWSHADERS[1];
        this.shader3 = NEWSHADERS[2];
        this.outputShader = NEWSHADERS[3]

        this.fbos[0].initialize(this.shader1);
        // this.fbos[0] = new FeedbackObject(this.shader1);
        this.fbos[0].material.uniforms.texture.value = NEWTEXTURE;

        this.fbos[1].initialize(this.shader2);
        // this.fbos[1] = new FeedbackObject(this.shader2);
        this.fbos[1].material.uniforms.texture.value = this.fbos[0].renderTarget;

        this.fbos[2].initialize(this.shader3);
        // this.fbos[2] = new FeedbackObject(this.shader3); 
        this.fbos[2].material.uniforms.texture.value = this.fbos[1].renderTarget;


            // this.getNewFrame();
            // this.update();
        // this.fbos[0].material.uniforms.texture.value = this.fbos[1].renderTarget; 
        this.setUniforms();

        this.material.dispose();
        this.geometry.dispose();
        this.scene.remove(this.mesh);
        this.material = new THREE.ShaderMaterial({
            uniforms: this.outputShader.uniforms,
            vertexShader: this.outputShader.vertexShader,
            fragmentShader: this.outputShader.fragmentShader,
            transparent: true,
            side: 2
        });
        this.material.uniforms["texture"].value = this.fbos[2].renderTarget;
        // this.material.uniforms["texture"].value = NEWTEXTURE;
        this.material.uniforms["texture"].minFilter = this.material.uniforms["texture"].magFilter = THREE.LinearFilter;
        this.material.uniforms["resolution"].value = new THREE.Vector2(renderSize.x, renderSize.y);
        this.material.uniforms["mouse"].value = new THREE.Vector2(renderSize.x, 0);
        
        this.geometry = new THREE.PlaneGeometry(renderSize.x, renderSize.y, 0);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0,0,0);
        this.scene.add(this.mesh);  
    }
}
function FeedbackObject(SHADER) {
    this.scene = new THREE.Scene();
    this.renderTarget, this.shader, this.material, this.geometry, this.mesh;
    // this.renderTarget = new THREE.WebGLRenderTarget(renderSize.x, renderSize.y, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat});
    // this.shader = SHADER;
    // this.material = new THREE.ShaderMaterial({
    //     uniforms: this.shader.uniforms,
    //     vertexShader: this.shader.vertexShader,
    //     fragmentShader: this.shader.fragmentShader    
    // });
    // this.geometry = new THREE.PlaneGeometry(renderSize.x, renderSize.y);
    // this.mesh = new THREE.Mesh(this.geometry, this.material);
    // this.mesh.position.set(0, 0, 0);
    // this.scene.add(this.mesh);
    this.initialize = function(SHADER){
        this.renderTarget = new THREE.WebGLRenderTarget(renderSize.x, renderSize.y, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat});
        this.shader = SHADER;
        this.material = new THREE.ShaderMaterial({
            uniforms: this.shader.uniforms,
            vertexShader: this.shader.vertexShader,
            fragmentShader: this.shader.fragmentShader    
        });
        this.geometry = new THREE.PlaneGeometry(renderSize.x, renderSize.y);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, 0, 0);
        this.scene.add(this.mesh);
    }
    this.initialize(SHADER);
    this.render = function(RENDERER, CAMERA){
        RENDERER.render(this.scene, CAMERA, this.renderTarget, true);
    }
    this.dispose = function(){
        this.renderTarget.dispose();
        this.material.dispose();
        this.material.uniforms.texture.value.dispose();
        this.geometry.dispose();
        this.scene.remove(this.mesh);
    }
}