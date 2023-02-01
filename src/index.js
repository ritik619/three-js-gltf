import * as THREE from "three";
import GLTFLoader from "three-gltf-loader";
// import { DRACOLoader } from "@loaders.gl/draco";
import OrbitControls from "three-orbitcontrols";
// import { load } from "@loaders.gl/core";

console.log("OrbitControls", OrbitControls);

const backgroundColor = 0x000000;

/*////////////////////////////////////////*/

var renderCalls = [];
function render() {
  requestAnimationFrame(render);
  renderCalls.forEach((callback) => {
    callback();
  });
}
render();

/*////////////////////////////////////////*/

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  800
);
camera.position.set(5, 5, 5);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(backgroundColor); //0x );

renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = Math.pow(0.94, 5.0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

window.addEventListener(
  "resize",
  function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

document.body.appendChild(renderer.domElement);

function renderScene() {
  renderer.render(scene, camera);
}
renderCalls.push(renderScene);

/* ////////////////////////////////////////////////////////////////////////// */

var controls = new OrbitControls(camera, renderer.domElement);

controls.rotateSpeed = 0.3;
controls.zoomSpeed = 0.9;

controls.minDistance = 3;
controls.maxDistance = 20;

controls.minPolarAngle = 0; // radians
controls.maxPolarAngle = Math.PI / 2; // radians

controls.enableDamping = true;
controls.dampingFactor = 0.05;

renderCalls.push(function () {
  controls.update();
});

/* ////////////////////////////////////////////////////////////////////////// */

var light = new THREE.PointLight(0xffffcc, 5, 200);
light.position.set(4, 30, -20);
scene.add(light);

var light2 = new THREE.AmbientLight(0x20202a, 8, 100);
light2.position.set(30, -10, 30);
scene.add(light2);

/* ////////////////////////////////////////////////////////////////////////// */
async function run() {
  try {
    var loader = new GLTFLoader();
    loader.crossOrigin = true;
    loader.load(
      "/src/models/dragon.gltf",
      //"https://s3-us-west-2.amazonaws.com/s.cdpn.io/39255/ladybug.gltf",
      function (data) {
        var object = data.scene;
        object.position.set(0, 0, 0);
        object.scale.set(5, 5, 5);

        scene.add(object);
      }
    );

    // add texture
    var texture, material, plane;

    texture = new THREE.TextureLoader().load("/src/models/bg.png");
    texture.wrapT = THREE.RepeatWrapping;

    material = new THREE.MeshLambertMaterial({ map: texture });
    plane = new THREE.Mesh(new THREE.PlaneGeometry(52, 38), material);
    plane.doubleSided = true;
    plane.position.z = -3;
    // plane.rotation.y = Math.PI / 2;
    plane.rotation.z = 0; // Not sure what this number represents.
    scene.add(plane);

    // texture.wrapT = THREE.LoopRepeat; // This doesn't seem to work;
  } catch (e) {
    console.log(e);
  }
}

run();
