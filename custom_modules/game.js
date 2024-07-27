import { Vector3 } from 'three';
import Engine from '@/custom_modules/engine';
import Controls from '@/custom_modules/controls';
import { TABlE_CONFIG } from '@/custom_modules/config';
import { gsap } from 'gsap';
import GUIWrapper from '@/custom_modules/gui'; 

export default class Game{
    constructor(width, height){
        this.engine = new Engine(width, height);
        this.controls = new Controls(this.engine, this);
        this.gui = new GUIWrapper();
        this.hand = [];

        // add table
        this.engine.modelLoader.load('/kitchen_table.glb', (gltf) => {
            const model = gltf.scene;
            this.engine.add(model);

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

        // add game zones
        const gameZone = new GameZone('Ablagestapel', {x: -2.25, y: TABlE_CONFIG.height, z: 0.55}, 1, 1);
        const gameZone2 = new GameZone('Spielstapel', {x: -1.5, y: TABlE_CONFIG.height, z: 0.55}, 2, 2);

        this.gui.addFolder('Game-Zones');
        this.gui.addFolderToFolder('Ablagestapel', 'Game-Zones');
        this.gui.addFolderToFolder('Spielstapel', 'Game-Zones');

        this.gameZones = [gameZone, gameZone2];

        this.gui.updateGameZones(this.gameZones);

        for(const gameZone of this.gameZones) {
            this.engine.add(gameZone.mesh);
            this.engine.add(gameZone.hoverHelper);
            for(const edge of gameZone.hoverEdges){
                this.engine.add(edge);
            }
        }

        this.gui.addFolder('Hand');
        const cardsInHand = 5;

        for(let i = 0; i < cardsInHand; i++) {
            const randomCard = window.cardManager.cards[Math.floor(Math.random() * window.cardManager.cards.length)];
            const cloned = randomCard.clone();

            cloned.name = randomCard.name;
            cloned.isCard = true;

            this.hand.push(cloned);
            this.engine.add(cloned);
        }

        this.calcHandPosition();

        // set animation loop
        this.engine.renderer.setAnimationLoop(this.animate.bind(this));
    }

    animate(){
        this.engine.renderer.render(this.engine.scene, this.engine.camera);
        
        for(let i = 0; i < this.gameZones.length; i++) {
            for(const edge of this.gameZones[i].hoverEdges) {
                const tl = new gsap.timeline({
                    defaults: {duration: 0.2, delay: 0}
                });
        
                if(this.gameZones[i].hovered) tl.add('hover').to(edge.scale, {x: 1, y: 1, z: 1}, 'hover').to(edge.material, {opacity: 1}, 'hover');
                else tl.add('hover').to(edge.material, {opacity: 0, delay: 0.1}, 'hover').to(edge.scale, {x: 0.5, y: 0.5, z: 0.5}, 'hover');
            }
        }
    }

    calcHandPosition(){
        for(const controller of this.gui.hands) {
            controller.destroy();
        }
        this.gui.hands = [];

        const middlePosition = new Vector3(0, 6.002, 3.75);
        const middleRotation = new Vector3(-Math.PI / 2, 0, 0);

        const offset = {x: 0.25, y: 0.01, z: 0.04};

        this.handPositions = [];
        this.handRotations = [];

        const totalCards = this.hand.length;
        const middleIndex = Math.floor(totalCards / 2);

        const rotation = new Vector3(
            middleRotation.x,
            middleRotation.y,
            middleRotation.z
        );

        for (let i = 0; i < totalCards; i++) {
            let positionOffset = (i - middleIndex) * offset.x;

            // calc position
            let position = new Vector3(
                middlePosition.x + positionOffset,
                middlePosition.y + (i - middleIndex) * offset.y,
                middlePosition.z
            );

            this.handPositions.push(position);
        }

        this.hand.forEach((card, index) => {
            card.index = index;
            const t1 = new gsap.timeline({
                defaults: {duration: 0.2, ease: 'power3.out'}
            });
            t1.add('transition').to(card.position, {x: this.handPositions[index].x, y: this.handPositions[index].y, z: this.handPositions[index].z}, 'transition').to(card.rotation, {x: rotation.x, y: rotation.y, z: rotation.z}, 'transition');
            card.rotation.set(...rotation);

            const c = this.gui.addToFolder(this.hand[index], 'name', 'Hand').disable();
            this.gui.hands.push(c);
        });
    }
}