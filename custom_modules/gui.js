import { GUI } from 'lil-gui';

export default class GUIWrapper{
    constructor(){
        this.gui = new GUI();
        this.gui.title('Debug');
        this.folders = [];
        this.hands = [];
        this.gameZoneControllers = [];
    }

    addFolder(name){
        const folder = this.gui.addFolder(name);
        this.folders.push({name: name, folder: folder});
        return folder;
    }

    add(obj, name){
        const controller = this.gui.add(obj, name);
        return controller;
    }

    addToFolder(obj,name,folder){
        const fol = this.folders.find(x => x.name === folder);
        if(folder){
            const controller = fol.folder.add(obj, name);
            return controller;
        }
    }

    addFolderToFolder(name, folder){
        const fol = this.folders.find(x => x.name === folder);
        if(folder){
            const folder = fol.folder.addFolder(name);
            this.folders.push({name: name, folder: folder});
            return folder;
        }
    }

    updateGameZones(gameZones){
        for(let c of this.gameZoneControllers) {
            c.controller.destroy();
        }
        this.gameZoneControllers = [];

        for(const gameZone of gameZones) {
            this.updateGameZone(gameZone);
        }
    }

    updateGameZone(gameZone){
        const folder = this.folders.find(x => x.name === gameZone.name);

        for(const cardSlot of gameZone.cardSlots) {
            if(!cardSlot.card){
                let empty = {name: 'null'};
                const c = folder.folder.add(empty, 'name').disable();
                this.gameZoneControllers.push({zone: gameZone.name, controller: c});
            } else {
                const c = folder.folder.add(cardSlot.card, 'name').disable();
                this.gameZoneControllers.push({zone: gameZone.name, controller: c});
            }
        }
    }
}