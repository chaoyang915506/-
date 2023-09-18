<template>
    <div class="container-fluid">
        <div class="row p-3">
            <div class="col-12">
                <h2>洗衣分类</h2>
            </div>
        </div>
        <div class="row p-3">
            <div class="col-12">
                <cool-table
                    v-show="view === 'table'"
                    ref="laundryClassTable"
                    :data="data"
                    :columns="columns"
                    :pageSize="5"
                    @edit-row="edit"
                    @del-row="delOne"
                >
                    <button class="btn btn-primary" @click="create">新增</button
                    >&nbsp;
                    <button class="btn btn-danger" @click="del">删除</button>
                </cool-table>
                <laundry-class-form
                    v-if="view === 'form'"
                    :value="laundryClassBody"
                    @change="initClasses"
                    @close="view = 'table'"
                />
            </div>
        </div>
    </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import { LaundryClassApi, LaundryClassBody } from '@/api/LaundryApi'
import LaundryClassForm from './LaundryClassForm.vue'

export default {
    components: { CoolTable, LaundryClassForm },
    name: 'LaundryClassApp',
    data() {
        return {
            view: 'table',
            data: [],
            columns: [{
                checkbox: true
            }, {
                field: 'classes', title: '名称', align: 'center',
                formatter: (val, row, idx) => val.find(v => v.langId === 0).name
            }, {
                field: 'classes', title: 'Name', align: 'center',
                formatter: (val, row, idx) => val.find(v => v.langId === 1).name
            }, {
                field: 'id', title: '操作', align: 'center',
                formatter: (val, row, idx) => {
                    return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">修改</button>&nbsp;
                    <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row">删除</button>`
                }
            }],
            laundryClassBody: {},
        }
    },
    methods: {
        initClasses() {
            LaundryClassApi.list().then(data => {
                this.data = data.list;
            }).catch(err => this.$error(err))
        },
        getSelections() {
            return this.$refs.laundryClassTable.getSelections()
        },
        create() {
            this.laundryClassBody = new LaundryClassBody()

            this.view = 'form'
        },
        edit(_id) {
            this.laundryClassBody = this.data.find(v => v.id === _id)

            this.view = 'form'
        },
        del() {
            const selections = this.getSelections()
            if (selections.length === 0) {
                return
            }

            this.$confirm('删除分类', '分类内项将移动到未分类').then(() => {
                return LaundryClassApi.delete(selections.map(v => v.id))
            }).then(() => {
                return this.$info('删除成功')
            }).then(() => {
                this.initClasses()
            }).catch(err => this.$error(err))
        },
        delOne(_id) {
            this.$confirm('删除分类', '分类内项将移动到未分类').then(() => {
                return LaundryClassApi.delete([_id])
            }).then(() => {
                return this.$info('删除成功')
            }).then(() => {
                this.initClasses()
            }).catch(err => this.$error(err))
        }
    },
    created() {
        this.initClasses()
    }
}
</script>