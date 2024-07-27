import {Shape} from 'three';

export default class MeshUtils{
    static createRoundedRectShape(x, y, width, height, radius) {
        const shape = new Shape();
        shape.moveTo(x, y + radius);
        shape.lineTo(x, y + height - radius);
        shape.absarc(x + radius, y + height - radius, radius, Math.PI, Math.PI / 2, true);
        shape.lineTo(x + width - radius, y + height);
        shape.absarc(x + width - radius, y + height - radius, radius, Math.PI / 2, 0, true);
        shape.lineTo(x + width, y + radius);
        shape.absarc(x + width - radius, y + radius, radius, 0, -Math.PI / 2, true);
        shape.lineTo(x + radius, y);
        shape.absarc(x + radius, y + radius, radius, -Math.PI / 2, -Math.PI, true);
        return shape;
    }
}