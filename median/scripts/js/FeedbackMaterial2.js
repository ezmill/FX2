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

        this.fbo1 = new FeedbackObject(this.shader1);
        this.fbo1.material.uniforms.texture.value = this.texture;

        // this.fbo2 = new FeedbackObject(this.shader2); 
        // this.fbo2.material.uniforms.texture.value = this.fbo1.renderTarget;

        this.frameDiff = new FeedbackObject(this.shader2); 
        this.frameDiff.material.uniforms.texture.value = this.fbo1.renderTarget;
        // this.frameDiff.material.uniforms.texture2.value = this.fbo2.renderTarget;
        this.frameDiff.material.uniforms.texture2.value = this.texture;
        // this.frameDiff.material.uniforms.texture3.value = this.texture;

        this.fbo2 = new FeedbackObject(this.shader3); 
        this.fbo2.material.uniforms.texture.value = this.frameDiff.renderTarget;

        // this.fbo4 = new FeedbackObject(this.shader5); 
        // this.fbo4.material.uniforms.texture.value = this.fbo3.renderTarget;

        this.fbos.push(this.fbo1);
        // this.fbos.push(this.fbo2);
        this.fbos.push(this.frameDiff);
        this.fbos.push(this.fbo2);
        // this.fbos.push(this.fbo4);
        
        for(var i = 0; i < this.fbos.length; i++){
          this.fbos[i].material.uniforms.resolution.value = new THREE.Vector2(renderSize.x, renderSize.y);
        }
        
        this.fbo1.material.uniforms.texture.value = this.frameDiff.renderTarget; 

        this.material = new THREE.ShaderMaterial({
            uniforms: this.outputShader.uniforms,
            vertexShader: this.outputShader.vertexShader,
            fragmentShader: this.outputShader.fragmentShader,
            transparent: true,
            side: 2
        });
        this.material.uniforms["texture"].value = this.fbo2.renderTarget;
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
        this.frameDiff.render(this.renderer, this.camera);
        this.fbo2.render(this.renderer, this.camera);
        // this.fbo4.render(this.renderer, this.camera);
    }
    this.expand = function(scl){
        this.frameDiff.mesh.scale.set(scl,scl,scl);
    }
    this.getNewFrame = function(){
        this.fbo1.render(this.renderer, this.camera);
    }
    this.swapBuffers = function(){
        var a = this.fbo2.renderTarget;
        this.fbo2.renderTarget = this.fbo1.renderTarget;
        this.fbo1.renderTarget = a;
    }
}
function FeedbackObject(SHADER) {
    this.scene = new THREE.Scene();
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

    this.render = function(RENDERER, CAMERA){
        RENDERER.render(this.scene, CAMERA, this.renderTarget, true);
    }
}