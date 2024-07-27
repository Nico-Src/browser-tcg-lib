import { PlaneGeometry } from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import MeshUtils from '@/custom_modules/utils';

export default class GameZone{
    constructor(pos, width, height, depth){
        // Create the shape
        this.baseGeometry = MeshUtils.createRoundedRectShape(0, 0, width, height, depth * 4);
        this.edgeGeometry = new PlaneGeometry(.1,.1);
        const hoverPlane = new PlaneGeometry(width, height, 64, 16);

        // get points of the rounded rect shape
        const points = this.baseGeometry.getPoints();

        // create LineGeometry
        this.lineGeometry = new LineGeometry();
        const positions = [];
        for (let i = 0; i < points.length; i++) positions.push(points[i].x, points[i].y, 0);
        this.lineGeometry.setPositions(positions);

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
        this.mesh.position.set(...pos);

        this.hoverHelper.rotation.set(-Math.PI / 2, 0, 0);
        this.hoverHelper.position.set(pos[0] + width / 2, pos[1], pos[2] + height / 2);

        // init hover edges
        this.initHoverEdges();
    }

    initHoverEdges(){
        this.hoverEdges = [];
        for(let i = 0; i < 4; i++){
            // add new edge
            this.hoverEdges.push(new Mesh(roundedEdge, new MeshBasicMaterial({map: TEXTURE_MANAGER.get('game_zone_edge'), transparent: true})));
            // position and rotate based on index
            switch(i){
                case 0:
                    this.hoverEdges[i].position.set(pos[0], pos[1], pos[2]);
                    this.hoverEdges[i].rotation.set(-Math.PI / 2, 0, 0);
                    break;
                case 1:
                    this.hoverEdges[i].position.set(pos[0] + width, pos[1], pos[2]);
                    this.hoverEdges[i].rotation.set(-Math.PI / 2, 0, -Math.PI / 2);
                    break;
                case 2:
                    this.hoverEdges[i].position.set(pos[0], pos[1], pos[2] + height);
                    this.hoverEdges[i].rotation.set(-Math.PI / 2, 0, -Math.PI / 2 + Math.PI);
                    break;
                case 3:
                    this.hoverEdges[i].position.set(pos[0] + width, pos[1], pos[2] + height);
                    this.hoverEdges[i].rotation.set(-Math.PI / 2, 0, Math.PI);
                    break;
            }
        }
    }
}

module.exports = GameZone;