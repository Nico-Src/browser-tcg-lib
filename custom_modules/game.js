import Engine from '@/custom_modules/engine';

export default class Game{
    constructor(width, height){
        this.engine = new Engine(width, height);
    }
}