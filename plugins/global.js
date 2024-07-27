import { CARD_CONFIG } from '@/custom_modules/config';
import CardManager from '@/custom_modules/cardManager';
import GameZone from '@/custom_modules/gameZone';

export default defineNuxtPlugin(() => {
    window.cardManager = new CardManager();
    window.GameZone = GameZone;
    window.CARD_CONFIG = CARD_CONFIG;
});