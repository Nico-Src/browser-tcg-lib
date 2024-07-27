<script setup>
import { CARD_CONFIG } from '~/custom_modules/config';

const route = useRoute();
const router = useRouter();
const snackbar = useSnackbar();

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';

const gltfLoader = new GLTFLoader();

let hoveredCard;
const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let currentPlacement = -2;

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild(renderer.domElement);
renderer.domElement.oncontextmenu = (e) => e.preventDefault();

// Sets the color of the background.
renderer.setClearColor(0xFEFEFE);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Sets orbit control to move the camera around.
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning.
camera.position.set(0, 10, 5);
// Has to be done everytime we update the camera position.
orbit.target = new THREE.Vector3(0, 2.5, 0);
orbit.update();
// orbit.enabled = false;

// Creates a 12 by 12 grid helper.
const gridHelper = new THREE.GridHelper(12, 12);
scene.add(gridHelper);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.9);
directionalLight.position.y = 10;
scene.add(directionalLight);
directionalLight.castShadow = true;

const ambientLight = new THREE.AmbientLight(0xCCCCCC, 0.95);
scene.add(ambientLight);

gltfLoader.load('/kitchen_table.glb', function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.rotateY(Math.PI / 2);
    model.scale.set(0.35, 0.35, 0.35);
    model.position.set(0.25, 0, 0);

    model.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
});

const gameZone = new GameZone([-2.25, 3.18, 0.55], CARD_CONFIG.size.width + 0.1, CARD_CONFIG.size.height + 0.1, 0.015);
const gameZone2 = new GameZone([-1.5, 3.18, 0.55], (CARD_CONFIG.size.width + 0.1) * 4, CARD_CONFIG.size.height + 0.1, 0.015);

const gameZones = [gameZone, gameZone2];

for(const gameZone of gameZones) {
    scene.add(gameZone.mesh);
    scene.add(gameZone.hoverHelper);
    for(const edge of gameZone.hoverEdges){
        scene.add(edge);
    }
}

function animate() {
    renderer.render(scene, camera);

    for(let i = 0; i < gameZones.length; i++) {
        for(const edge of gameZones[i].hoverEdges) {
            const tl = new gsap.timeline({
                defaults: {duration: 0.2, delay: 0}
            });

            if(gameZones[i].hovered) tl.add('hover').to(edge.scale, {x: 1, y: 1, z: 1}, 'hover').to(edge.material, {opacity: 1}, 'hover');
            else tl.add('hover').to(edge.material, {opacity: 0, delay: 0.1}, 'hover').to(edge.scale, {x: 0.5, y: 0.5, z: 0.5}, 'hover');
        }
    }
}

renderer.setAnimationLoop(animate);

/*onMounted(() => {
    const video = document.querySelector("#test");
    video.muted = true;
    video.loop = true;
    video.play();
    window.cardManager.addVideoCard({name: 'video', path: '/test.mp4'}, video, scene);
});*/

window.addEventListener('click', function (e) {
    if(!e.ctrlKey) {
        if(hoveredCard && (!hoveredCard.isPlaced || !hoveredCard.isPreviewed)) {
            hoveredCard.isPlaced = true;
            const tl = new gsap.timeline({
                defaults: {duration: 0.3, delay: 0}
            });

            tl.to(hoveredCard.rotation, {y: Math.PI,z: 0,x: -Math.PI / 2})
            .to(hoveredCard.position, {y: 3.18,z: 0.9,x: currentPlacement}, 0)
            .to(hoveredCard.rotation, {y: 0,delay: 0.5,}, 0)
            .to(hoveredCard.position, {y: 3.88,delay: 0.5}, 0)
            .to(hoveredCard.position, {y: 3.18,duration: 0.3,delay: 0.7}, 0);
            currentPlacement+=0.75;
        }
    } else {
        if(hoveredCard && !hoveredCard.isPreviewed) {
            hoveredCard.isPreviewed = true;
            const tl = new gsap.timeline({
                defaults: {duration: 0.3, delay: 0}
            });

            // show card in front of camera
            tl.to(hoveredCard.rotation, {
                x: Math.PI / 1.25,
                y: Math.PI, z: -Math.PI
            })
            .to(hoveredCard.position, {
                x: 0,
                y: 7.5,
                z: 3,
            }, 0)
            .to(hoveredCard.scale, {
                x: 2.0,
                y: 2.0,
                z: 2.0,
            }, 0);
        }
    }
});

window.addEventListener('mousemove', function (e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mousePosition, camera);
    const intersects = raycaster.intersectObject(scene);

    if (intersects.length > 0) {
        if(intersects[0].object.isCard && hoveredCard !== intersects[0].object) {
            hoveredCard = intersects[0].object;
        } else if(!intersects[0].object.isCard){
            hoveredCard = null;
        }
    } else hoveredCard = null;

    for(let i = 0; i < gameZones.length; i++) {
        gameZones[i].hovered = raycaster.intersectObject(gameZones[i].hoverHelper).length > 0;
    }

    if (hoveredCard && !hoveredCard.isPlaced && !hoveredCard.isPreviewed) {
        const tl = new gsap.timeline({
            defaults: {duration: 0.3, delay: 0}
        });

        tl.to(hoveredCard.position, {
            y: window.cardManager.positions[hoveredCard.inHandIndex].y + 0.5
        });
    }

    scene.children.forEach(card => {
        if (card.isCard) {
            if (card !== hoveredCard && !card.isPlaced && !card.isPreviewed) {
                const tl = new gsap.timeline({
                    defaults: {duration: 0.3, delay: 0}
                });

                tl.to(card.position, {
                    y: window.cardManager.positions[card.inHandIndex].y
                });
            }
        }
    });
});

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.cardManager.cards.forEach(card => {
    // set camera as parent of card
    scene.add(card);
});

useSeoMeta({
    // wrap title in computed function so title gets updated correctly
    title: () => 'Home',
});
</script>
<script>

</script>
<template>
    <div class="bg" ref="scrollEl">

    </div>
</template>
<style scoped>
.bg{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
}

.video-texture{
    pointer-events: none;
}
</style>