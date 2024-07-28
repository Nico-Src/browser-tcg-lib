import { Mesh, PlaneGeometry, MeshBasicMaterial } from 'three';
import { GAME_ZONE_CONFIG } from './config';

export default class CardSlot {
    constructor(pos, width, height) {
        // random guid
        this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.position = pos;
        this.width = width;
        this.height = height;
        this.card = null;

        this.planeGeometry = new PlaneGeometry(width - GAME_ZONE_CONFIG.padding, height - GAME_ZONE_CONFIG.padding, 64, 16);
        this.hoverHelper = new Mesh(this.planeGeometry, new MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0}));
        this.hoverHelper.position.set(this.position.x, this.position.y + 0.01, this.position.z);
        this.hoverHelper.rotation.set(-Math.PI / 2, 0, 0);
        this.hoverHelper.isCardSlot = true;
        this.hoverHelper.slotId = this.id;
    }
}