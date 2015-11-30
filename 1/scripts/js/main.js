var container;
var scene, camera, light, renderer;
var renderSize = new THREE.Vector2(window.innerWidth, 2500*(window.innerWidth/3750));
//wtf
// var renderSize = new THREE.Vector2(2448,3264);
var mouse = new THREE.Vector2(0.0,0.0);
var mouseDown = false;
// var r2 = 1.0;
var r2 = 0.0;
var time = 0.0;
var capturer = new CCapture( { framerate: 60, format: 'webm', workersPath: 'js/' } );

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

    
    _texture = THREE.ImageUtils.loadTexture("assets/textures/test.jpg");
	_texture.minFilter = _texture.magFilter = THREE.NearestFilter;
    _scene = new THREE.Scene();
    _camera = new THREE.OrthographicCamera( renderSize.x / - 2, renderSize.x / 2, renderSize.y / 2, renderSize.y / - 2, -10000, 10000 );
    _camera.position.z = 1;
    _renderer = new THREE.WebGLRenderer({preserveDrawingBuffer:true});
    _renderer.setSize( renderSize.x, renderSize.y );
    _renderer.setClearColor(0xffffff,1.0);
    _customShaders = new CustomShaders();
    _geo = new THREE.PlaneBufferGeometry(renderSize.x, renderSize.y);
    // _geo = new THREE.SphereGeometry(500,250,250);
    _mat = new THREE.ShaderMaterial({
            uniforms: _customShaders.gridShader.uniforms,
            fragmentShader: _customShaders.gridShader.fragmentShader,
            vertexShader: _customShaders.gridShader.vertexShader,
            transparent: true
        });
    _mat.uniforms.texture.value = _texture;
    _mat.uniforms.grid.value = 1.0;
    _mesh = new THREE.Mesh(_geo , _mat);
    _scene.add(_mesh);
    // container.appendChild(_renderer.domElement);

    texture = new THREE.Texture(_renderer.domElement);
    // texture = new THREE.Texture(_renderer.domElement);
    texture.minFilter = texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

	// shader = new MeshShader();
	// material = new THREE.ShaderMaterial({
		// uniforms: shader.uniforms,
		// vertexShader: shader.vertexShader,
		// fragmentShader: shader.fragmentShader,
		// side: 2,
		// transparent: true
	// });
	// material.uniforms["texture"].value = texture;
	// material.uniforms["resolution"].value = renderSize;
	// material.uniforms["r2"].value = r2;
	// material.uniforms["time"].value = time;
	// geometry = new THREE.PlaneBufferGeometry(renderSize.x, renderSize.y);
	// mesh = new THREE.Mesh(geometry, material);
	// scene.add(mesh);

	var customShaders = new CustomShaders();
    var customShaders2 = new CustomShaders();
    shaders = [ 
        // customShaders.gridShader,
        // paintFlow,
        // customShaders2.gridShader,
       	customShaders2.reposShader,
        customShaders2.blurShader,
        customShaders.diffShader, 
        customShaders2.reposShader,
        customShaders.blurShader,
        customShaders.passShader 
        // customShaders.bumpShader
    ];
    fbMaterial = new FeedbackMaterial(renderer, scene, camera, texture, shaders);  
    fbMaterial.init();

	document.addEventListener("mousemove", onMouseMove);
	document.addEventListener("mousedown", onMouseDown);
	document.addEventListener("mouseup", onMouseUp);
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    document.addEventListener( 'touchend', onDocumentTouchEnd, false );
    document.addEventListener( 'touchcancel', onDocumentTouchEnd, false );
    document.addEventListener( 'touchleave', onDocumentTouchEnd, false );
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
      // fbMaterial.fbos[i].material.uniforms.mouse.value = new THREE.Vector2(0.01,0.01);
    }
}
function onDocumentTouchStart( event ) {
    if ( event.touches.length === 1 ) {
        event.preventDefault();
        gradient.sampleColors();
        r2 = Math.random()*2.0;
        mouse.x = ( event.touches[ 0 ].pageX / renderSize.x ) * 2 - 1;
        mouse.y = - ( event.touches[ 0 ].pageY / renderSize.y ) * 2 + 1;
    }
}

function onDocumentTouchMove( event ) {
    if ( event.touches.length === 1 ) {
        event.preventDefault();
        mouse.x = ( event.touches[ 0 ].pageX / renderSize.x ) * 2 - 1;
        mouse.y = - ( event.touches[ 0 ].pageY / renderSize.y ) * 2 + 1;
    }
}
    
function onDocumentTouchEnd( event ) {
    mouse.x = 0; 
    mouse.y = 0;
}
var counter = 0;
function onMouseDown(){
	mouseDown = true;
    // gradient.jumpForward();
    r2 = 1.0;
    if(counter%2 == 0){
        _mat.uniforms.grid.value = 0.0;
    } else {
        _mat.uniforms.grid.value = 1.0;
    }
    counter++;

}
function onMouseUp(){
	mouseDown = false;
	r2 = 0;
}
function draw(){

	time += 0.01;
	// material.uniforms["time"].value = time;
	// if(mouseDown){
		// r2 = 0.005;
	// r2 = Math.random()*3.0;
	// }
    // mouse.x = ( Math.random()) * 2 - 1;
    // mouse.y = - ( Math.random()) * 2 + 1;

	for(var i = 0; i < fbMaterial.fbos.length; i++){
	  fbMaterial.fbos[i].material.uniforms.time.value = time;
	  if(fbMaterial.fbos[i].material.uniforms["r2"])fbMaterial.fbos[i].material.uniforms["r2"].value = r2;
      // fbMaterial.fbos[i].material.uniforms.mouse.value = new THREE.Vector2(Math.sin(time), Math.cos(time));
      fbMaterial.fbos[i].material.uniforms.mouse.value = new THREE.Vector2(mouse.x,mouse.y);
      fbMaterial.material.uniforms.mouse.value = new THREE.Vector2(renderSize.x/2, renderSize.y/2);

	}
    _mesh.material.uniforms.time.value = time;
    _mesh.material.uniforms.mouse.value = new THREE.Vector2(mouse.x,mouse.y);;

    _renderer.render(_scene, _camera);

    texture.needsUpdate = true;

    fbMaterial.update();
	renderer.render(scene, camera);
    // fbMaterial.expand(1.005);
	fbMaterial.getNewFrame();
	fbMaterial.swapBuffers();

    capturer.capture( renderer.domElement );
}
function screenshot(renderer) {
    if (event.keyCode == "32") {
        grabScreen(renderer);

        function grabScreen(renderer) {
            // var blob = dataURItoBlob(renderer.domElement.toDataURL('image/png'));
            // var file = window.URL.createObjectURL(blob);
            // var img = new Image();
            // img.src = file;
            // img.onload = function(e) {
                // window.open(this.src);
// 
            // }
            var date = new Date();
            var components = [
                date.getYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            ];
            // var mili = components.join("");
            // var mili = 1;
            renderedImage = renderer.domElement.toDataURL('image/png');
            $.ajax({
                type: "POST",
                url: "scripts/js/upload.php",
                data: { 
                  img: renderedImage
                }
              }).done(function(o) {
                 
                 saveFile(o);
              }).fail(function(o){                 
                alert("upload failed");
              });
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
    if (event.keyCode == "82") {
                    capturer.start();
    }
    if (event.keyCode == "84") {
        capturer.stop();
        capturer.save(function(blob) {
            window.location = blob;
        });
    }
}
function saveFile(mili){
    var xmlhttp;
     
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }else{// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
     
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
            console.log(xmlhttp.responseText);
            // document.getElementById("linkHolder").value="http://ezmill.github.io/output/view.php?n="+xmlhttp.responseText;
            // initLink();
        }
    }
     // console.log(mili);
    // var str = makeSuperString();    
    // xmlhttp.open("GET","save.php?v="+str+"&nm="+mili, true);
    // xmlhttp.send();
}
 


function hslaColor(h,s,l,a)
  {
    return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
  }