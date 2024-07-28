
import { BoxGeometry, Vector3, MeshBasicMaterial, Mesh } from 'three';
import { CARD_CONFIG } from './config';
import { TEXTURE_MANAGER } from './textureManager';
import { CARD_DATA } from './data';

export default class CardManager{
    constructor(){
        this.init();
    }

    init(){
        this.cards = [];
        this.geometry = new BoxGeometry(CARD_CONFIG.size.width, CARD_CONFIG.size.height, CARD_CONFIG.size.depth);

        for(const card of CARD_DATA.cards) TEXTURE_MANAGER.loadTexture(card.name, card.path);
        
        TEXTURE_MANAGER.loadTexture('cover', '/card2.png');
        TEXTURE_MANAGER.loadTexture('game_zone_edge', '/game_zone_edge.png');
        
        this.edgeMaterial = new MeshBasicMaterial({color: 0x202020, transparent: true});

        for(let i = 0; i < CARD_DATA.cards.length; i++){
            const card = CARD_DATA.cards[i];
            const mat = [
                this.edgeMaterial,
                this.edgeMaterial,
                this.edgeMaterial,
                this.edgeMaterial,
                new MeshBasicMaterial({map: TEXTURE_MANAGER.get(card.name), transparent: true, specular: 0x000000, emissive: 0x000000, reflectivity: 0.0}),
                new MeshBasicMaterial({map: TEXTURE_MANAGER.get('cover'), transparent: true})
            ];

            const c = new Mesh(this.geometry, mat);
            this.configureCard(c, card.name);
        }
    }

    configureCard(card, name) {
        card.name = name;
        card.isCard = true;
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