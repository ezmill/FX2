var container;
var scene, camera, light, renderer;
var renderSize = new THREE.Vector2(window.innerWidth, 2500*(window.innerWidth/3750));
// var renderSize = new THREE.Vector2(2448,3264);
var mouse = new THREE.Vector2(0.0,0.0);
var mouseDown = false;
var r2 = 0.0;
var time = 0.0;
init();
animate();

function init(){
	scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera( renderSize.x / - 2, renderSize.x / 2, renderSize.y / 2, renderSize.y / - 2, -10000, 10000 );
    // camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1,10000);
    camera.position.z = 1;
	renderer = new THREE.WebGLRenderer({preserveDrawingBuffer:true});
	renderer.setSize( renderSize.x, renderSize.y );
	renderer.setClearColor(0xffffff,1.0);

	container = document.getElementById( 'container' );
	container.appendChild(renderer.domElement);

	texture = THREE.ImageUtils.loadTexture("assets/textures/test.jpg");
	texture.minFilter = texture.magFilter = THREE.NearestFilter;
    alpha = THREE.ImageUtils.loadTexture("assets/textures/alpha.jpg");
    alpha.minFilter = alpha.magFilter = THREE.NearestFilter;
	var customShaders = new CustomShaders();
    var customShaders2 = new CustomShaders();
    shaders = [ 
        // customShaders.blurShader,
        // paintFlow,
       	customShaders2.heatHazeShader,
        customShaders.diffShader, 
        customShaders2.colorShader,
        // customShaders2.paintShader 
        customShaders.passShader
    ];
    fbMaterial = new FeedbackMaterial(renderer, scene, camera, texture, shaders);  
    fbMaterial.init();

	document.addEventListener("mousemove", onMouseMove);
	document.addEventListener("mousedown", onMouseDown);
	document.addEventListener("mouseup", onMouseUp);
    document.addEventListener( 'keydown', function(){screenshot(renderer)}, false );

}

function animate(){
	window.requestAnimationFrame(animate);
	draw();
}

function onMouseMove(event){
	mouse.x = ( event.pageX / renderSize.x ) * 2 - 1;
    mouse.y = - ( event.pageY / renderSize.y ) * 2 + 1;
    for(var i = 0; i < fbMaterial.fbos.length; i++){
      fbMaterial.fbos[i].material.uniforms.mouse.value = new THREE.Vector2(mouse.x, mouse.y);
    }
}
function onMouseDown(){
	mouseDown = true;
}
function onMouseUp(){
	mouseDown = false;
	r2 = 0;
}
function draw(){
	time += 0.01;
	if(mouseDown){
		// r2 += 0.005;
		r2 = 0.5;
	}
	for(var i = 0; i < fbMaterial.fbos.length; i++){
      if(fbMaterial.fbos[i].material.uniforms["r2"])fbMaterial.fbos[i].material.uniforms["r2"].value = r2;
	  if(fbMaterial.fbos[i].material.uniforms["alpha"])fbMaterial.fbos[i].material.uniforms["alpha"].value = alpha;
      fbMaterial.fbos[i].material.uniforms["time"].value = time;

	}
    // texture.needsUpdate = true;

    fbMaterial.update();
	renderer.render(scene, camera);
	fbMaterial.getNewFrame();
	fbMaterial.swapBuffers();
}
function screenshot(renderer) {
    if (event.keyCode == "32") {
        grabScreen(renderer);

        function grabScreen(renderer) {
            var blob = dataURItoBlob(renderer.domElement.toDataURL('image/png'));
            var file = window.URL.createObjectURL(blob);
            var img = new Image();
            img.src = file;
            img.onload = function(e) {
                window.open(this.src);

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

        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
    }
}