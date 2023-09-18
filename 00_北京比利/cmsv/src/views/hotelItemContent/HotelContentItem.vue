<template>
    <div class="border rounded p-1" :class="{'border-success': selected}" @click="$emit('update:selected', !selected)">
        <img class="img-fluid rounded" alt="加载失败..." :src="content.miImage" draggable="false" />
    </div>
</template>

<script>
export default {
    name: 'HotelContentItem',
    props: {
        selected: {
            type: Boolean, required: false
        },
        content: Object,
    },
    data() {
        return {
        }
    },
    computed: {
    },
}
</script>

<style scoped lang="scss">
.border {
    border-width: 2px !important;
}

img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
</style>