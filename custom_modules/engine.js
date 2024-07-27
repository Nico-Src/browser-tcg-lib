import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';

export default class Engine{
    constructor(){
        this.modelLoader = new GLTFLoader();

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // create renderer
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.renderer.setClearColor(0xFEFEFE);
        this.renderer.shadowMap.enabled = true;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

        this.renderer.domElement.oncontextmenu = (e) => e.preventDefault();

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45,this.width / this.height,0.1,1000);

        // create orbit controls
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);

        // camera positioning
        this.camera.position.set(0, 10, 5);
        this.orbit.target = new THREE.Vector3(0, 2.5, 0);
        this.orbit.update();
        // this.orbit.enabled = false;

        // create grid helper
        const gridHelper = new THREE.GridHelper(12, 12);
        this.scene.add(gridHelper);

        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.9);
        directionalLight.position.y = 10;
        this.scene.add(directionalLight);
        directionalLight.castShadow = true;

        const ambientLight = new THREE.AmbientLight(0xCCCCCC, 0.95);
        this.scene.add(ambientLight);

        this.raycaster = new THREE.Raycaster();

        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.width, this.height);
        });
    }

    add(object){
        this.scene.add(object);
    }
}