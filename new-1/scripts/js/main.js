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
var shaders = [RgbShiftShader, DenoiseShader, RevertShader];
var shaderIndex = 0;
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
	origTex = THREE.ImageUtils.loadTexture("assets/textures/test.jpg");
	mask = new Mask();
	mask.init();
	alpha = new THREE.Texture(mask.canvas);
	alpha.minFilter = alpha.magFilter = THREE.LinearFilter;
	alpha.needsUpdate = true;
	// shader = new RgbShiftShader();
	shader = new shaders[shaderIndex]();
	material = new THREE.ShaderMaterial({
		uniforms: shader.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader,
		side: 2,
		transparent: true
	});
	material.uniforms["texture"].value = texture;
	material.uniforms["origTex"].value = origTex;
	material.uniforms["alpha"].value = alpha;
	material.uniforms["resolution"].value = renderSize;
	material.uniforms["r2"].value = r2;
	material.uniforms["time"].value = time;
	geometry = new THREE.PlaneBufferGeometry(renderSize.x, renderSize.y);
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
}
function createNewEffect(){
	texture.dispose();
	material.dispose();
	geometry.dispose();
	scene.remove(mesh);
    var blob = dataURItoBlob(renderer.domElement.toDataURL('image/png'));
    var file = window.URL.createObjectURL(blob);
    var img = new Image();
    img.src = file;
    img.onload = function(e) {
		texture.image = img;
	    mask.erase();
		// shader = new DenoiseShader();
		shader = new shaders[shaderIndex]();
		material = new THREE.ShaderMaterial({
			uniforms: shader.uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader,
			side: 2,
			transparent: true
		});
		material.uniforms["texture"].value = texture;
		material.uniforms["origTex"].value = origTex;
		material.uniforms["alpha"].value = alpha;
		material.uniforms["resolution"].value = renderSize;
		material.uniforms["r2"].value = r2;
		material.uniforms["time"].value = time;
		geometry = new THREE.PlaneBufferGeometry(renderSize.x, renderSize.y);
		mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);
    }
}
function animate(){
	window.requestAnimationFrame(animate);
	draw();
}

function onMouseMove(event){
	mask.mouse = new THREE.Vector2(event.pageX, event.pageY);
	mouse.x = ( event.clientX / renderSize.x ) * 2 - 1;
    mouse.y = - ( event.clientY / renderSize.y ) * 2 + 1;
	material.uniforms["mouse"].value = new THREE.Vector2(mouse.x, mouse.y);
}
function onMouseDown(){
	mouseDown = true;
}
function onMouseUp(){
	mouseDown = false;
	// r2 = 0;
}
function draw(){
	time += 0.01;
	material.uniforms["time"].value = time;
	mask.update();
	alpha.needsUpdate = true;
	if(mouseDown){
		r2 = 1.0;
		material.uniforms["r2"].value = r2;
	}
	renderer.render(scene, camera);
}
function onKeyDown(e){
	console.log(e);
	if(e.keyCode == '88'){
		mask.switchColor();
	}
	if(e.keyCode == '32'){
		e.preventDefault();
		if(shaderIndex == shaders.length - 1){
			shaderIndex = 0;
		} else {
			shaderIndex++;
		}
		createNewEffect();
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