import { Vector2 } from 'three';
import { TABlE_CONFIG } from './config';
import { gsap } from 'gsap';
import { CARD_DATA } from './data';

export default class Controls {
    constructor(engine, game) {
        this.engine = engine;
        this.game = game;
        this.mouse = new Vector2();
        this.hoveredCard = null;
        this.pickedCard = null;

        this.engine.renderer.domElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if(this.hoveredCard){
                const card = CARD_DATA.cards.find(card => card.name === this.hoveredCard.name);
                this.game.setCardInfo(card);
            }
        });

        this.engine.renderer.domElement.addEventListener('click', (e) => {
            if(this.hoveredCard && this.hoveredCard.isPlaced === true && !this.pickedCard){
                let slot;
                for(const zone of this.game.gameZones){
                    slot = zone.cardSlots.find(slot => slot.id === this.hoveredCard.slot);
                    if(slot) break;
                }
                slot.card = null;
                this.hoveredCard.isPlaced = false;
                this.hoveredCard.slot = null;
                this.game.hand.push(this.hoveredCard);
                this.game.calcHandPosition();
                this.game.gui.updateGameZones(this.game.gameZones);
                this.updateCardsState();
                return;
            }

            if(this.hoveredCard && !this.hoveredCard.isPlaced){
                // check if there is already a card selected
                if(!this.pickedCard){
                    this.hoveredCard.isSelected = true;
                    this.pickedCard = this.hoveredCard;
                // check if the card is already selected (if so unselect it)
                } else if(this.pickedCard === this.hoveredCard){
                    this.hoveredCard.isSelected = false;
                    this.pickedCard = null;
                // if the card is not selected, select it
                } else {
                    this.pickedCard.isSelected = false;
                    this.hoveredCard.isSelected = true;
                    this.pickedCard = this.hoveredCard;
                }
            }

            this.updateCardsState();

            if(this.pickedCard){
                this.engine.raycaster.setFromCamera(this.mouse, this.engine.camera);
                // check if there is an intersection with any of the gameZones hoverHelpers
                const intersects = this.engine.raycaster.intersectObjects(this.game.gameZones.map(zone => zone.hoverHelper));

                if(intersects.length > 0){
                    const zoneId = intersects[0].object.zoneId;
                    const zone = this.game.gameZones.find(zone => zone.id === zoneId);
                    
                    const slotIntersects = this.engine.raycaster.intersectObjects(zone.cardSlots.map(slot => slot.hoverHelper));
                    const slot = zone.cardSlots.find(slot => slot.id === slotIntersects[0].object.slotId);

                    if(slot && !slot.card){
                        slot.card = this.pickedCard;
                        this.pickedCard.isPlaced = true;
                        this.pickedCard.slot = slot.id;
                        this.pickedCard.isSelected = false;
                        this.pickedCard = null;
                        this.game.hand = this.game.hand.filter(card => !card.isPlaced);
                        this.game.calcHandPosition();
                        this.game.gui.updateGameZones(this.game.gameZones);

                        this.cardToSlot(slot.card, slot);
                        this.engine.scene.children.filter(c => c.isCardSlot).forEach(c => c.hovered = false);
                    }
                }
            }
        });

        this.engine.renderer.domElement.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        
            this.engine.raycaster.setFromCamera(this.mouse, this.engine.camera);
            const cardIntersects = this.engine.raycaster.intersectObjects(this.engine.scene.children.filter(c => c.isCard));

            // check if card is hovered
            if (cardIntersects.length > 0){ if(this.hoveredCard !== cardIntersects[0].object) this.hoveredCard = cardIntersects[0].object; }
            else this.hoveredCard = null;

            if(this.pickedCard){
                const cardSlotIntersects = this.engine.raycaster.intersectObjects(this.engine.scene.children.filter(c => c.isCardSlot));
                if (cardSlotIntersects.length > 0){
                    const slot = cardSlotIntersects[0].object;
                    slot.hovered = true;
                } else {
                    this.engine.scene.children.filter(c => c.isCardSlot).forEach(c => c.hovered = false);
                }
            }
        
            // check if game zone is hovered
            for(let i = 0; i < this.game.gameZones.length; i++) {
                this.game.gameZones[i].hovered = this.engine.raycaster.intersectObject(this.game.gameZones[i].hoverHelper).length > 0;
            }
        
            // if there is a hovered card (transition into hovered state)
            if (this.hoveredCard) {
                const tl = new gsap.timeline({defaults: {duration: 0.3, delay: 0}});
                if(this.hoveredCard.isPlaced) tl.to(this.hoveredCard.scale, {x: 0.9, y: 0.9, z: 0.9});
                else tl.to(this.hoveredCard.position, {z: this.game.handPositions[this.hoveredCard.index].z - 0.10});
            }

            this.updateCardsState();
        });
    }

    updateCardsState(){
        // transition all other cards back to default position (except placed and hovered card)
        this.engine.scene.children.forEach(c => {
            if (c.isCard) {
                if (c !== this.hoveredCard) {
                    const tl = new gsap.timeline({defaults: {duration: 0.3, delay: 0}});
                    if(c.isPlaced){
                        tl.to(c.scale, {x: 1, y: 1, z: 1});
                    } else if(!c.isSelected) {
                        tl.to(c.position, {z: this.game.handPositions[c.index].z});
                    }
                }
            }

            if(c.isCardSlot){
                const tl = new gsap.timeline({defaults: {duration: 0.3, delay: 0}});
                if(c.hovered) tl.to(c.material, {opacity: 0.25});
                else tl.to(c.material, {opacity: 0});
            }
        });
    }

    cardToSlot(card, slot){
        const t = new gsap.timeline({
            defaults: {duration: 0.2, delay: 0}
        });

        t.to(card.rotation, {y: Math.PI,z: 0,x: -Math.PI / 2})
        .to(card.position, {y: TABlE_CONFIG.height,z: slot.position.z, x: slot.position.x}, 0)
        .to(card.rotation, {y: 0,delay: 0.5,}, 0)
        .to(card.position, {y: TABlE_CONFIG.height + .7,delay: 0.5}, 0)
        .to(card.position, {y: TABlE_CONFIG.height,duration: 0.3,delay: 0.7}, 0);
    }
}