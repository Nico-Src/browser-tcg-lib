import { SRGBColorSpace, TextureLoader } from 'three';

class TextureManager{
    constructor(){
        this.textureLoader = new TextureLoader();
        this.textures = {};
    }

    loadTexture(name, path){
        if(this.textures[name] === undefined) {
            this.textures[name] = this.textureLoader.load(path);
            this.textures[name].colorSpace = SRGBColorSpace;
        } else console.log(`Texture ${name} already loaded.`);

        return this.textures[name];
    }

    get(name){
        return this.textures[name];
    }
}

export const TEXTURE_MANAGER = new TextureManager();