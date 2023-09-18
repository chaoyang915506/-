<template>
    <div class="nav nav-pills flex-column">
        <div class="nav-item">
            <a
                class="nav-link"
                :class="curGroupId === 0 ? 'active' : 'text-dark'"
                href="#"
                @click.prevent="setCurGroupId(0)"
            >全部</a>
        </div>
        <div v-for="group in groups" :key="group.id" class="nav-item">
            <a
                class="nav-link"
                :title="group.desc"
                :class="curGroupId === group.id ? 'active' : 'text-dark'"
                href="#"
                @click.prevent="setCurGroupId(group.id)"
            >{{ group.name }}</a>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'SyscnfGroup',
    computed: {
        ...mapState({
            groups: state => state.groups,
            curGroupId: state => state.curGroupId,
        })
    },
    methods: {
        ...mapMutations({
            setCurGroupId: 'setCurGroupId',
        }),
    },
}
</script>

<style>
</style>