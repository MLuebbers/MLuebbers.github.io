import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import portrait from "./media/normals.png";

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( 200, 200 );
renderer.domElement.classList.add("portrait");
window.addEventListener("resize", () => {
    renderer.setSize(window.clientWidth, 200);
});
document.body.appendChild( renderer.domElement );

const normalMap = new THREE.TextureLoader().load(portrait);
const light = new THREE.PointLight(new THREE.Color(0xFFFFFF), 0.5);
light.position.set(0, 1, 1);
scene.add(light);

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial();
material.color = new THREE.Color(0xFFFFFF);
material.roughness = 0.1;

material.normalMap = normalMap;
material.normalScale = new THREE.Vector2(4,4);

camera.position.z = 1.5

const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
    light.position.y = window.scrollY/window.innerHeight * 2 - 1;
}
animate();

if ( WebGL.isWebGLAvailable() ) {
	animate();
} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById('container').appendChild( warning );

}