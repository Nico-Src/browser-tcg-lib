
import { BoxGeometry, Vector3, MeshBasicMaterial, Mesh } from 'three';
import { CARD_CONFIG } from './config';
import { TEXTURE_MANAGER } from './textureManager';

export default class CardManager{
    constructor(){
        this.init();
    }

    init(){
        this.cards = [];
        this.geometry = new BoxGeometry(CARD_CONFIG.size.width, CARD_CONFIG.size.height, CARD_CONFIG.size.depth);

        this.positions = [
            new Vector3(-.5, 6.032, 3.81),
            new Vector3(-.25, 6.017, 3.77),
            new Vector3(0, 6.002, 3.75),
            new Vector3(.25, 5.987, 3.77),
            new Vector3(.5, 5.972, 3.81),
        ];

        this.rotations = [
            new Vector3(-Math.PI / 2, 0, 0.15),
            new Vector3(-Math.PI / 2, 0, 0.10),
            new Vector3(-Math.PI / 2, 0, 0),
            new Vector3(-Math.PI / 2, 0, -0.10),
            new Vector3(-Math.PI / 2, 0, -0.15)
        ];

        this.cardData = [
            {name: 'citizen1', path: '/citizen1.png'},
            {name: 'citizen2', path: '/citizen2.png'},
            {name: 'citizen3', path: '/citizen3.png'},
            {name: 'citizen4', path: '/citizen4.png'},
            {name: 'emperor', path: '/emperor.png'},
            {name: 'slave', path: '/slave.png'},
        ];

        for(const card of this.cardData) TEXTURE_MANAGER.loadTexture(card.name, card.path);
        
        TEXTURE_MANAGER.loadTexture('cover', '/card2.png');
        TEXTURE_MANAGER.loadTexture('game_zone_edge', '/game_zone_edge.png');
        
        this.edgeMaterial = new MeshBasicMaterial({color: 0x202020});

        for(let i = 0; i < this.cardData.length - 1; i++){
            const card = this.cardData[i];
            const mat = [
                this.edgeMaterial,
                this.edgeMaterial,
                this.edgeMaterial,
                this.edgeMaterial,
                new MeshBasicMaterial({map: TEXTURE_MANAGER.get(card.name)}),
                new MeshBasicMaterial({map: TEXTURE_MANAGER.get('cover')})
            ];

            const c = new Mesh(this.geometry, mat);
            c.position.set(...this.positions[i]);
            c.rotation.set(...this.rotations[i]);
            this.configureCard(c, card.name, i);
        }
    }

    configureCard(card, name, index) {
        card.name = name;
        card.isCard = true;
        card.inHandIndex = index;
        card.castShadow = true;
        this.cards.push(card);
    }

    addVideoCard(card,video,scene){
        this.cardData.push(card);
        const mat = [
            this.edgeMaterial,
            this.edgeMaterial,
            this.edgeMaterial,
            this.edgeMaterial,
            new MeshBasicMaterial({map: new VideoTexture(video)}),
            new MeshBasicMaterial({map: TEXTURE_MANAGER.get('cover')})
        ];
        mat[4].needsUpdate = true;

        const c = new Mesh(this.geometry, mat);
        c.position.set(...this.positions[4]);
        c.rotation.set(...this.rotations[4]);
        this.configureCard(c, card.name, 4);
        scene.add(c);
    }
}

module.exports = CardManager;