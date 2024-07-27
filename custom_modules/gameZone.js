import { PlaneGeometry, Mesh, MeshBasicMaterial } from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { TEXTURE_MANAGER } from './textureManager';
import { CARD_CONFIG, GAME_ZONE_CONFIG, TABlE_CONFIG } from './config';
import MeshUtils from '@/custom_modules/utils';
import CardSlot from '@/custom_modules/cardSlot';

export default class GameZone{
    constructor(pos, rows, columns){
        this.rows = rows;
        this.columns = columns;
        this.cardSlots = [];

        // calc dimensions of the game zone
        const width = (CARD_CONFIG.size.width * this.columns) + (GAME_ZONE_CONFIG.padding * this.columns);
        const height = (CARD_CONFIG.size.height * this.rows) + (GAME_ZONE_CONFIG.padding * this.rows);
        const depth = CARD_CONFIG.size.depth;

        this.initCardSlots(pos);

        // Create the shape
        this.baseGeometry = MeshUtils.createRoundedRectShape(0, 0, width, height, depth * 4);
        this.edgeGeometry = new PlaneGeometry(.1,.1);
        const hoverPlane = new PlaneGeometry(width, height, 64, 16);

        // get points of the rounded rect shape
        const points = this.baseGeometry.getPoints();

        // create LineGeometry
        this.lineGeometry = new LineGeometry();
        this.linePositions = [];
        for (let i = 0; i < points.length; i++) this.linePositions.push(points[i].x, points[i].y, 0);
        this.lineGeometry.setPositions(this.linePositions);

        // create line material
        const lineMaterial = new LineMaterial({
            color: 0xffffff,
            linewidth: 2,
        });

        // Create the line using Line2
        this.mesh = new Line2(this.lineGeometry, lineMaterial);

        // create hover helper (hidden plane to detect hover)
        this.hoverHelper = new Mesh(hoverPlane, new MeshBasicMaterial({color: 0xFFFFFF}));
        this.hoverHelper.visible = false;
        this.hoverHelper.isGameZone = true; // for hover detection

        this.mesh.computeLineDistances();

        // position mesh and hover helper
        this.mesh.rotation.set(Math.PI / 2, 0, 0);
        this.mesh.position.set(pos.x,pos.y,pos.z);

        this.hoverHelper.rotation.set(-Math.PI / 2, 0, 0);
        this.hoverHelper.position.set(pos.x + width / 2, pos.y, pos.z + height / 2);

        // init hover edges
        this.initHoverEdges(pos, width, height);
    }

    // init card slots (position for each slot)
    initCardSlots(pos){
        let x = (GAME_ZONE_CONFIG.padding / 2) + pos.x + (CARD_CONFIG.size.width / 2);
        let z = GAME_ZONE_CONFIG.padding / 2 + pos.z + (CARD_CONFIG.size.height / 2);

        const slotWidth = CARD_CONFIG.size.width + GAME_ZONE_CONFIG.padding;
        const slotHeight = CARD_CONFIG.size.height + GAME_ZONE_CONFIG.padding;

        for(let row = 0; row < this.rows; row++){
            for(let column = 0; column < this.columns; column++){
                this.cardSlots.push(new CardSlot({x, y: TABlE_CONFIG.height, z}));

                x += slotWidth;
            }

            // increase z when going to next row
            z += slotHeight;
            // reset x
            x = (GAME_ZONE_CONFIG.padding / 2) + pos.x + (CARD_CONFIG.size.width / 2);
        }
    }

    // create hover edge planes (for the hover effect)
    initHoverEdges(pos, width, height){
        this.hoverEdges = [];
        for(let i = 0; i < 4; i++){
            // add new edge
            this.hoverEdges.push(new Mesh(this.edgeGeometry, new MeshBasicMaterial({map: TEXTURE_MANAGER.get('game_zone_edge'), transparent: true})));
            // position and rotate based on index
            switch(i){
                case 0:
                    this.hoverEdges[i].position.set(pos.x, pos.y, pos.z);
                    this.hoverEdges[i].rotation.set(-Math.PI / 2, 0, 0);
                    break;
                case 1:
                    this.hoverEdges[i].position.set(pos.x + width, pos.y, pos.z);
                    this.hoverEdges[i].rotation.set(-Math.PI / 2, 0, -Math.PI / 2);
                    break;
                case 2:
                    this.hoverEdges[i].position.set(pos.x, pos.y, pos.z + height);
                    this.hoverEdges[i].rotation.set(-Math.PI / 2, 0, -Math.PI / 2 + Math.PI);
                    break;
                case 3:
                    this.hoverEdges[i].position.set(pos.x + width, pos.y, pos.z + height);
                    this.hoverEdges[i].rotation.set(-Math.PI / 2, 0, Math.PI);
                    break;
            }
        }
    }
}

module.exports = GameZone;