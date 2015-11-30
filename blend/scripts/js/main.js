var container;
var scene, camera, light, renderer;
var renderSize = new THREE.Vector2(window.innerWidth, 2500*(window.innerWidth/3750));
// var renderSize = new THREE.Vector2(740, 503);
var mouse = new THREE.Vector2(0.0,0.0);
var mouseDown = false;
var r2 = 0.0;
var time = 0.0;
var mask;
var origTex;
// var shaders = [RgbShiftShader, DenoiseShader, SobelShader, KuwaharaShader, RevertShader];
var shaders = [DenoiseShader];
var shaderIndex = 0;
var rtt;
init();
animate();

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
}
function createEffect(){
	texture = THREE.ImageUtils.loadTexture("assets/textures/test.jpg");
	texture.minFilter = texture.magFilter = THREE.LinearFilter;
	noise = THREE.ImageUtils.loadTexture("assets/textures/noise.png");
	noise.minFilter = noise.magFilter = THREE.LinearFilter;

	mask = new Mask();
	mask.init();
	alpha = new THREE.Texture(mask.canvas);
	alpha.minFilter = alpha.magFilter = THREE.LinearFilter;
	alpha.needsUpdate = true;

	var shader = new KuwaharaShader();
	var shader2 = new BarrelBlurShader();
	var customShaders = new CustomShaders();
    var customShaders2 = new CustomShaders();
    shaders = [ 
       	customShaders.colorShader,
        customShaders.diffShader, 
        shader2,
        customShaders.passShader
    ];
	fbMaterial = new FeedbackMaterial(renderer, scene, camera, texture, shaders);  
    fbMaterial.init();
    for(var i = 0; i < fbMaterial.fbos.length; i++){
    	// if(fbMaterial.fbos[i].material.uniforms["id"])fbMaterial.fbos[i].material.uniforms["id"].value = 3;
    	if(fbMaterial.fbos[i].material.uniforms["noise"])fbMaterial.fbos[i].material.uniforms["noise"].value = noise;
    	if(fbMaterial.fbos[i].material.uniforms["id2"])fbMaterial.fbos[i].material.uniforms["id"].value = Math.floor(Math.random()*25);
    	if(fbMaterial.fbos[i].material.uniforms["id2"])fbMaterial.fbos[i].material.uniforms["id2"].value = Math.floor(Math.random()*25);
    	// if(fbMaterial.fbos[i].material.uniforms["id2"])fbMaterial.fbos[i].material.uniforms["id2"].value = 17;
    }
	
}	
function createNewEffect(){
	var newShader = new KuwaharaShader();
	var newShader2 = new DenoiseShader();
	var newShaders = new CustomShaders();
    var newShaders2 = new CustomShaders();
    newShaders = [ 
       	newShaders.colorShader,
        newShaders.diffShader, 
        newShader2,
        newShaders.passShader
    ];
    var blob = dataURItoBlob(renderer.domElement.toDataURL('image/jpg'));
    var file = window.URL.createObjectURL(blob);
    var img = new Image();
    img.src = file;
    img.onload = function(e) {
    	texture.dispose();
    	texture.image = img;
    	// console.log(img);
		fbMaterial.disposeFbos(newShaders, texture);
		// fbMaterial.setUniforms();
	    fbMaterial.update();
		renderer.render(scene, camera);
		fbMaterial.getNewFrame();
		fbMaterial.swapBuffers();
    }

	for(var i = 0; i < fbMaterial.fbos.length; i++){
		if(fbMaterial.fbos[i].material.uniforms["id"])fbMaterial.fbos[i].material.uniforms["id"].value = Math.floor(Math.random()*25);
		if(fbMaterial.fbos[i].material.uniforms["id2"])fbMaterial.fbos[i].material.uniforms["id2"].value = Math.floor(Math.random()*25);
	}
	
	// if(shaderIndex == shaders.length - 1){
	// 	shaderIndex = 0;
	// } else {
	// 	shaderIndex++;
	// }
}
function animate(){
	window.requestAnimationFrame(animate);
	draw();
}

function onMouseMove(event){
	mask.mouse = new THREE.Vector2(event.pageX, event.pageY);
	mouse.x = ( event.clientX / renderSize.x ) * 2 - 1;
    mouse.y = - ( event.clientY / renderSize.y ) * 2 + 1;
}
function onMouseDown(){
	mouseDown = true;
	for(var i = 0; i < fbMaterial.fbos.length; i++){
		if(fbMaterial.fbos[i].material.uniforms["id"])fbMaterial.fbos[i].material.uniforms["id"].value = Math.floor(Math.random()*25);
		if(fbMaterial.fbos[i].material.uniforms["id2"])fbMaterial.fbos[i].material.uniforms["id2"].value = Math.floor(Math.random()*25);
	}
	// createNewEffect();
}
function onMouseUp(){
	mouseDown = false;
	r2 = 0;
}
function draw(){
	time += 0.01;
	mask.update();
	alpha.needsUpdate = true;
	if(mouseDown){
		fbMaterial.setUniforms();
		r2 = 0.5;
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
		// if(shaderIndex == shaders.length - 1){
		// 	shaderIndex = 0;
		// } else {
		// 	shaderIndex++;
		// }
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