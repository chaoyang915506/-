<template>
    <div class="container-fluid p-3">
        <div class="row">
            <div class="col-12">
                <h2>客房报修</h2>
            </div>
        </div>
        <div v-if="view === 'table'" class="row">
            <div class="col-12">
                <form class="form-inline border p-2">
                    <label class="col-auto">报修类型：</label>
                    <select
                        class="col-auto form-control"
                        v-model="repairTypeFilter"
                    >
                        <option :value="0">全部</option>
                        <option :value="1">客房维修</option>
                        <option :value="2">工程报修</option>
                    </select>
                </form>
            </div>
            <div class="col-12">
                <cool-table
                    ref="table"
                    :data="tableData"
                    :columns="columns"
                    :pageSize="5"
                    @edit-row="edit"
                    @del-row="delOne"
                >
                    <button class="btn btn-primary" @click="create">
                        新增
                    </button>
                    <button class="btn btn-danger ml-1" @click="del">
                        删除
                    </button>
                    <button class="btn btn-primary ml-1" @click="sort">
                        排序
                    </button>
                </cool-table>
            </div>
        </div>
        <div v-else-if="view === 'form'" class="row">
            <div class="col-12 pt-2">
                <repair-form
                    :value="repairValue"
                    @change="initRepairs"
                    @close="view = 'table'"
                />
            </div>
        </div>
        <div v-if="sortVisible" class="sorter-container">
            <cool-sorter
                class="w-50"
                style="position: absolute; left: 25%; top: 25%"
                :value="sortData"
                @ok="updateSort"
                @close="sortVisible = false"
            />
        </div>
    </div>
</template>

<script>
import RepairApi, { Repair } from '@/api/RepairApi'
import CoolTable from '@/components/CoolTable.vue'
import CoolModal from '@/components/CoolModal.vue'
import CoolSorter from '@/components/CoolSorter.vue'
import RepairForm from './RepairForm.vue'

export default {
    name: 'RepairApp',
    components: { CoolTable, RepairForm, CoolModal, CoolSorter },
    data() {
        return {
            view: 'table',
            repairTypeFilter: 0,
            data: [],
            columns: [{
                checkbox: true
            }, {
                field: 'repairType', title: '报修类型', align: 'center',
                formatter: (val, row, idx) => val === 1 ? '客房维修' : '工程报修'
            }, {
                field: 'repairLangs', title: '名称', align: 'center',
                formatter: (val, row, idx) => val.find(v => v.langId === 0).repairLangName
            }, {
                field: 'repairLangs', title: 'Name', align: 'center',
                formatter: (val, row, idx) => val.find(v => v.langId === 1).repairLangName
            }, {
                field: 'repairExternalCode', title: '对接系统编码', align: 'center',
            }, {
                field: 'repairId', title: '操作', align: 'center',
                formatter: (val, row, idx) => `<button class="btn btn-primary btn-sm" data-val=${val} data-emit=edit-row>更新</button>
                    <button class="btn btn-danger btn-sm" data-val=${val} data-emit=del-row>删除</button>`
            }],
            repairValue: {},
            sortVisible: false,
            sortData: [],
        }
    },
    computed: {
        tableData() {
            return this.data.filter(v => this.repairTypeFilter === 0 ? true : v.repairType === this.repairTypeFilter)
        }
    },
    methods: {
        initRepairs() {
            RepairApi.list().then(data => {
                this.data = data.list
            }).catch(err => this.$error(err))
        },
        getSelections() {
            return this.$refs.table.getSelections()
        },
        create() {
            this.repairValue = new Repair

            this.view = 'form'
        },
        edit(_id) {
            this.repairValue = this.data.find(v => v.repairId === _id)

            this.view = 'form'
        },
        del() {
            const selections = this.getSelections()
            if (selections.length === 0) return

            this.$confirm('确定删除吗？').then(ok => {
                if (ok) {
                    RepairApi.delete(selections.map(v => v.repairId)).then(() => {
                        return this.$info('删除成功')
                    }).then(() => {
                        this.initRepairs()
                    })
                }
            }).catch(err => this.$error(err))
        },
        delOne(_id) {
            this.$confirm('确定删除吗？').then(ok => {
                if (ok) {
                    RepairApi.delete([_id]).then(() => {
                        return this.$info('删除成功')
                    }).then(() => {
                        this.initRepairs()
                    })
                }
            }).catch(err => this.$error(err))
        },
        sort() {
            this.sortData = this.tableData.map(v => {
                return { key: v.repairId, label: v.repairLangs[0].repairLangName }
            });

            this.sortVisible = true
        },
        updateSort(value) {
            if (!value||value.length === 0) {
                return
            }

            RepairApi.updateSort(value.map(v => v.key)).then(_ => {
                return this.$info('更新成功')
            }).then(_ => this.initRepairs()).catch(err => this.$error(err))
        }
    },
    created() {
        this.initRepairs()
    }
}
</script>

<style lang="scss" scoped>
.sorter-container {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: fixed;
    background-color: rgba(0, 0, 0, 0.5);
}
</style>