var container;
var scene, camera, light, renderer;
var renderSize = new THREE.Vector2(window.innerWidth, 2500*(window.innerWidth/3750));
var mouse = new THREE.Vector2(0.0,0.0);
var mouseDown = false;
var r2 = 0.0;
var time = 0.0;
var mask;
var origTex;
var effect;
// var effects = [
// 	"oil paint",
// 	"edge detect",
// 	"revert",
// 	"rgb shift",
// 	"warp"
// ], effectIndex = 0;
var texture;
var fbMaterial;
var origTex = THREE.ImageUtils.loadTexture("assets/textures/test.jpg");
origTex.minFilter = origTex.magFilter = THREE.LinearFilter;
var nextEffectsSelector = document.getElementById("nextEffectsSelector");
var currentEffectsSelector = document.getElementById("effectsSelector");
init();
function init(){
	scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera( renderSize.x / - 2, renderSize.x / 2, renderSize.y / 2, renderSize.y / - 2, -10000, 10000 );
    camera.position.set(0,0,0);

	renderer = new THREE.WebGLRenderer({preserveDrawingBuffer:true});
	renderer.setSize( renderSize.x, renderSize.y );
	renderer.setClearColor(0xffffff,1.0);

	container = document.getElementById( 'container' );
	container.appendChild(renderer.domElement);

	createEffect();

	document.addEventListener("mousemove", onMouseMove);
	document.addEventListener("mousedown", onMouseDown);
	document.addEventListener("mouseup", onMouseUp);
	document.addEventListener("keydown", onKeyDown);
	animate();

}
function createEffect(){

	noise = THREE.ImageUtils.loadTexture("assets/textures/noise.png");
	noise.minFilter = noise.magFilter = THREE.LinearFilter;

	if(texture)texture.dispose();
	texture = THREE.ImageUtils.loadTexture("assets/textures/test.jpg");
	texture.minFilter = texture.magFilter = THREE.LinearFilter;

    effect = new Effect(currentEffectsSelector.options[currentEffectsSelector.selectedIndex].value);
    effect.init();
    if(effect.useMask){
		mask = new Mask();
		mask.init();
		alpha = new THREE.Texture(mask.canvas);
		alpha.minFilter = alpha.magFilter = THREE.LinearFilter;
		alpha.needsUpdate = true;
    } else {
		alpha = null;
    }
    if(fbMaterial)fbMaterial.dispose();
	fbMaterial = new FeedbackMaterial(renderer, scene, camera, texture, effect.shaders);  
    fbMaterial.init();
    for(var i = 0; i < fbMaterial.fbos.length; i++){
		if(fbMaterial.fbos[i].material.uniforms["id"])fbMaterial.fbos[i].material.uniforms["id"].value = effect.blendId;
	    	if(fbMaterial.fbos[i].material.uniforms["origTex"])fbMaterial.fbos[i].material.uniforms["origTex"].value = origTex;
		// if(fbMaterial.fbos[i].material.uniforms["origTex"])fbMaterial.fbos[i].material.uniforms["origTex"].value = origTex;
    	// if(fbMaterial.fbos[i].material.uniforms["id2"])fbMaterial.fbos[i].material.uniforms["id2"].value = effect.id2;
    }

    
}	
function createNewEffect(){
	// if(effectIndex == effects.length - 1){
	// 	effectIndex = 0;
	// } else {
	// 	effectIndex++;
	// }
    var blob = dataURItoBlob(renderer.domElement.toDataURL('image/jpg'));
    var file = window.URL.createObjectURL(blob);
    var img = new Image();
    img.src = file;
    img.onload = function(e) {
    	texture.dispose();
    	texture.image = img;

	    // effect = new Effect(effects[effectIndex]);
	    effect = new Effect(nextEffectsSelector.options[nextEffectsSelector.selectedIndex].value);
	    effect.init();
	    currentEffectsSelector.options[currentEffectsSelector.selectedIndex].innerHTML = nextEffectsSelector.options[nextEffectsSelector.selectedIndex].innerHTML;
		if(effect.useMask){
			mask = new Mask();
			mask.init();
			alpha = new THREE.Texture(mask.canvas);
			alpha.minFilter = alpha.magFilter = THREE.LinearFilter;
			alpha.needsUpdate = true;
		} else {
			alpha = null;
		}
		fbMaterial.dispose();
	    fbMaterial = new FeedbackMaterial(renderer, scene, camera, texture, effect.shaders);
	    fbMaterial.init();
	    for(var i = 0; i < fbMaterial.fbos.length; i++){
	    	if(fbMaterial.fbos[i].material.uniforms["id"])fbMaterial.fbos[i].material.uniforms["id"].value = effect.blendId;
	    	if(fbMaterial.fbos[i].material.uniforms["origTex"])fbMaterial.fbos[i].material.uniforms["origTex"].value = origTex;

	    	// if(fbMaterial.fbos[i].material.uniforms["id2"])fbMaterial.fbos[i].material.uniforms["id2"].value = Math.floor(Math.random()*25);
	    }
    }
}
function animate(){
	window.requestAnimationFrame(animate);
	draw();
}

function onMouseMove(event){
	if(effect.useMask){
		mask.mouse = new THREE.Vector2(event.pageX, event.pageY);		
	}
	mouse.x = ( event.pageX / renderSize.x ) * 2 - 1;
    mouse.y = - ( event.pageY / renderSize.y ) * 2 + 1;
}
function onMouseDown(){
	mouseDown = true;
	for(var i = 0; i < fbMaterial.fbos.length; i++){
		// if(fbMaterial.fbos[i].material.uniforms["id"])fbMaterial.fbos[i].material.uniforms["id"].value = Math.floor(Math.random()*25);
		// if(fbMaterial.fbos[i].material.uniforms["id2"])fbMaterial.fbos[i].material.uniforms["id2"].value = Math.floor(Math.random()*25);
	}
	// createNewEffect();
}
function onMouseUp(){
	mouseDown = false;
	r2 = 0;
}
function draw(){
	time += 0.01;
	if(mouseDown){
		r2 = 0.5;
	}

	if(effect.useMask){
		mask.update();
		alpha.needsUpdate = true;
	}
	fbMaterial.setUniforms();
    fbMaterial.update();
	renderer.render(scene, camera);
	fbMaterial.getNewFrame();
	fbMaterial.swapBuffers();
}
function onKeyDown(e){
	console.log(e);
	if(e.keyCode == '88'){
		// mask.switchColor();
		createNewEffect();
	}
	if(e.keyCode == '32'){
		e.preventDefault();
		// createNewEffect();
	}
}
function dataURItoBlob(dataURI) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {
        type: mimeString
    });
}