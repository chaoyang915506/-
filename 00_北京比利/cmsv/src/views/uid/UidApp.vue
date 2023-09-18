<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <h1>UID管理</h1>
            </div>
            <div class="col-12">
                <cool-table
                    v-if="view === 'table'"
                    :data="uidList"
                    :columns="columns"
                    @edit="edit"
                    @delete="del"
                >
                    <button class="btn btn-outline-primary" @click="create">新建</button>&nbsp;
                </cool-table>
                <div v-else-if="view === 'form'" class="col-10 offset-1">
                    <uid-form :value="uid" @change="refreshUids" @close="view = 'table'" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { UidApi } from '@/api/UidApi'
import common from '@/common'
import CoolTable from '@/components/CoolTable.vue'
import UidForm from './UidForm.vue'
import { Uid } from './Uid'
import { mapMutations, mapState } from 'vuex'

export default {
    name: 'UidApp',
    components: { CoolTable, UidForm },
    data() {
        return {
            view: 'table',
            columns: [{
                checkbox: true, align: 'center',
            }, {
                field: 'name', title: '名称', align: 'center',
                formatter: (val, row, idx) => `<a href="#" data-val="${row.id}" data-emit="edit">${val}</a>`
            }, {
                field: 'uid', title: 'UID', align: 'center',
            }, {
                field: 'uri', title: '模块路径',
            }, {
                field: 'id', title: '操作', formatter: (val, row, idx) =>
                    `<a href="#" data-val="${val}" data-emit="delete"><i class="glyphicon glyphicon-trash text-danger"></i></a>`
            }],
            uid: {},
        }
    },
    computed: {
        ...mapState({
            uidList: state => state.uids.sort((a, b) => a.id - b.id),
        }),
    },
    methods: {
        ...mapMutations({
            setUids: 'setUids',
        }),
        create() {
            this.uid = new Uid();
            
            this.view = 'form';
        },
        edit(_id) {
            this.uid = this.uidList.find(uid => uid.id === _id);

            this.view = 'form';
        },
        del(_id) {
            common.confirm('删除', '', () => {
                UidApi.delete([_id]).then(data => {
                    common.info('已删除', () => {
                        this.refreshUids();
                    });
                }).catch(err => common.error(err))
            });
        },
        refreshUids() {
            UidApi.list().then(data => {
                this.setUids(data.list);
            }).catch(err => common.error(err));
        },
    },
    created() {
        this.refreshUids();
    }
}
</script>

<style scoped>
</style>