<template>
    <div class="mainView">
        <video class="player" controls="" autoplay="" name="media">
            <source :src="videoSrc" type="video/mp4">
        </video>
        <span id="quitMovie" @click="quitPlayer" class="glyphicon glyphicon-remove quitPlayer"></span>
    </div>
</template>

<script>
export default {
    name: "MoviePlayer",
    props: {
        videoSrc: {
            type: String,
            required: true
        },
    },
    methods: {
        quitPlayer() {
            this.$emit('quitPlayer');
        }
    }
}
</script>

<style scoped lang="scss">
.mainView {
    width: 100%;
    height: 100%;
}

.player {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%
}

.quitPlayer {
    position: fixed;
    top: 20px;
    width: 20px;
    height: 20px;
    right: 20px;
    font-size: 22px;
    color: white;
    background-color: black;
}
</style>