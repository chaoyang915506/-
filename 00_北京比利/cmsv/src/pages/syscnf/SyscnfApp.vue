<template>
    <div class="container-fluid">
        <div class="row">
            <header class="col-12 pt-3">
                <h2>
                    <i>园区配置</i>
                </h2>
                <hr />
            </header>
            <main class="col-12">
                <div class="row h-99">
                    <div class="col-2">
                        <syscnf-group />
                    </div>
                    <div class="col-2 border-left border-right h-100">
                        <div class="mb-3 pt-1" style="position: sticky; top: 0">
                            <input
                                class="form-control"
                                v-model="cnfNameFilter"
                                placeholder="搜索配置项"
                            />
                        </div>
                        <div
                            class="px-1"
                            style="overflow: hidden auto; height: 95%"
                        >
                            <p v-for="cnf in cnfs" :key="cnf.id">
                                <a class="text-dark" :href="'#' + cnf.key">{{
                                    cnf.name
                                }}</a>
                            </p>
                        </div>
                    </div>
                    <div class="col-8 px-5 h-100" style="overflow: hidden auto">
                        <div class="row">
                            <div
                                v-for="cnf in cnfs"
                                :key="cnf.id"
                                :id="cnf.key"
                                class="col-12"
                            >
                                <syscnf-item
                                    class="mb-5"
                                    :syscnf="cnf"
                                    @change="refreshSyscnf"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
import { SyscnfGroupApi, SyscnfApi, SyscnfMetaApi } from '@/api/SyscnfApi'
import { mapState } from 'vuex'
import SyscnfGroup from './SyscnfGroup.vue'
import SyscnfItem from './SyscnfItem.vue'

export default {
    name: 'SysCnfApp',
    components: { SyscnfGroup, SyscnfItem },
    data() {
        return {
            syscnfMetas: [],
            syscnfs: [],
            cnfNameFilter: '',
        }
    },
    computed: {
        ...mapState({
            metas: state => state.metas,
            sys: state => state.sys,
        }),
        cnfs() {
            return this.metas.map(syscnf => {
                const value = this.sys.find(i => i.cnfName === syscnf.key)
                return {
                    ...syscnf, ...value
                }
            }).filter(syscnf => {
                return this.cnfNameFilter === '' || syscnf.name.indexOf(this.cnfNameFilter) !== -1
            }).filter(syscnf => {
                return this.$store.state.curGroupId === 0 || syscnf.groupIds.indexOf(this.$store.state.curGroupId) !== -1
            })
        }
    },
    methods: {
        refreshSyscnf() {
            SyscnfApi.list()
                .then(data => {
                    this.sys = data.list
                })
                .catch(err => this.$error(err))

            this.$forceUpdate()
        }
    },
    created() {
        // this.syscnfMetas = this.metas
        // this.syscnfs = this.sys
    }
}
</script>

<style scoped lang="scss">
main {
    position: fixed;
    top: 5.5rem;
    bottom: 1rem;
    overflow: hidden;
    height: auto;
}
</style>