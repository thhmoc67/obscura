/*
(function(){
var date1 = (new Date('2014/12/6 09:00:00 +0900'));
var date2 = (new Date('2014/12/7 17:00:00 +0900'));
var timez = (new Date()).toString().replace(/(\S+ ){5}/, "");
document.getElementById("utc").innerHTML = date1.toUTCString() + " - " + date2.toUTCString();
document.getElementById("date").innerHTML = date1.toLocaleString() + " - " + date2.toLocaleString() + " " + timez;
})();
*/

var camera, scene, renderer, composer;
var object, light;
var obj = [];
var glitchPass;

init();
animate();

function init() {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 400;
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x0066FF, 1, 900 );
	object = new THREE.Object3D();
	scene.add( object );

	var geometry = new THREE.BoxGeometry( 3, 2, 1 );
	for ( var i = 0; i < 100; i ++ ) {
		var rnd = Math.random();
		var col = new THREE.Color(0, 0.2*rnd, 0.7*rnd);
		var material = new THREE.MeshBasicMaterial( { color: col, shading: THREE.NoShading } );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize();
		mesh.position.multiplyScalar( Math.random() * 400 );
		// mesh.rotation.set(0, Math.random()*2, 0);
		mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 40;
		object.add( mesh );
		obj[i] = mesh;
	}
	scene.add( new THREE.AmbientLight( 0xFFFFFF ) );

	// postprocessing
	composer = new THREE.EffectComposer( renderer );
	composer.addPass( new THREE.RenderPass( scene, camera ) );
	glitchPass = new THREE.GlitchPass();
	glitchPass.renderToScreen = true;
	composer.addPass( glitchPass );
	window.addEventListener( 'resize', onWindowResize, false );
	updateOptions();
}

function updateOptions() {
	var a = document.getElementsByClassName("glitch");
	for (var i = 0; i < a.length; i++) {
		a[i].onmouseover = function(){glitchPass.goWild=true;};
		a[i].onmouseout = function(){glitchPass.goWild=false;};
	}
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

var wait = 0;
function animate() {
	window.setTimeout(function(){requestAnimationFrame(animate)}, 0);
	if (++wait>2) {wait=0;} else {return;}
	// var time = Date.now();
	object.rotation.x += 0.004;
	object.rotation.y += 0.01;
	composer.render();
}
