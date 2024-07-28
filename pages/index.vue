<script setup>
import { CARD_CONFIG, TABlE_CONFIG } from '@/custom_modules/config';
import Game from '@/custom_modules/game';

const route = useRoute();
const router = useRouter();
const snackbar = useSnackbar();
const cardInfo = ref(null);
const cardInfoObj = ref({show: false, name: '', img: ''});

const game = new Game({cardInfo, cardInfoObj});

onMounted(() => {
    /* const video = document.querySelector("#test");
    video.muted = true;
    video.loop = true;
    video.play();
    window.cardManager.addVideoCard({name: 'video', path: '/test.mp4'}, video, scene); */
    document.body.appendChild(game.engine.renderer.domElement);
});

function closeCardInfo(){
    cardInfoObj.value.show = false;
    setTimeout(() => {
        cardInfoObj.value = {show: false, name: '', img: ''};
    }, 500);
}

useSeoMeta({
    // wrap title in computed function so title gets updated correctly
    title: () => 'Home',
});
</script>
<script>

</script>
<template>
    <div class="bg" ref="scrollEl">
        <div id="card-info" @click="closeCardInfo" ref="cardInfo" :class="`card-info ${cardInfoObj.show ? '' : 'info-hidden'} ${cardInfoObj.orientation}`">
            <div class="image-wrapper">
                <div class="bg-image">
                    <img class="image" :src="cardInfoObj.img" />
                    <div class="overlay"></div>
                </div>
                <img class="image" :src="cardInfoObj.img" />
            </div>
            <p class="name">{{ cardInfoObj.name }}</p>
        </div>
    </div>
</template>
<style scoped>
.bg{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
}

.video-texture{
    pointer-events: none;
}

#card-info{
    width: 300px;
    height: fit-content;
    border-radius: 4px;
    position: fixed;
    left: 20px;
    top: 20px;
    z-index: 20;
    background-color: #202020;
    opacity: 1;
    pointer-events: all;
    transform: translateX(0);
    transition: opacity .2s ease, transform .2s ease;
    overflow: hidden;
    box-shadow: 0 0 5px rgba(0, 0, 0, .5);

    &.info-hidden{
        opacity: 0;
        pointer-events: none;
        transform: translateX(-100px);
        
        .image{
            opacity: 0;
        }
    }

    &.landscape{
        width: 430px;
        height: fit-content;

        .image{
            height: 380px;
            width: unset !important;
            transform: rotate(90deg);
        }
    }

    .image-wrapper{
        width: 100%;
        height: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        padding: 10px;
        position: relative;

        .bg-image{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            position: absolute;
            inset: 0;
            z-index: 0;

            .image{
                min-width: 150%;
                min-height: 150%;
                object-fit: cover;
                filter: blur(15px);
            }

            .overlay{
                width: 100%;
                height: 100%;
                position: absolute;
                inset: 0;
                background-color: rgba(255, 255, 255, .5);
                z-index: 1;
            }
        }

        .image{
            width: 250px;
            opacity: 1;
            transition: opacity .1s ease;
            border-radius: 15px;
            z-index: 1;
        }
    }

    .name{
        margin-top: 10px;
        font-size: 24px;
        font-weight: bold;
        color: white;
        text-align: center;
    }
}
</style>