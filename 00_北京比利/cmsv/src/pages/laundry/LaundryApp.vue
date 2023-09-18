<template>
    <div class="container-fluid">
        <div v-show="view === 'table'" class="row p-3">
            <div class="col-12">
                <h2>洗衣服务</h2>
            </div>
            <div class="col-12">
                <form class="form-inline border p-2">
                    <label class="col-auto">选择类别：</label>
                    <select class="col-auto form-control" v-model="classFilter">
                        <option :value="0">全部</option>
                        <option v-for="c in classes" :key="c.id" :value="c.id">
                            {{ c.classes[0].name + " / " + c.classes[1].name }}
                        </option>
                    </select>
                </form>
            </div>
            <div class="col-12 my-3">
                <form class="form-inline border p-2" onsubmit="return false">
                    <label class="col-auto">服务费：</label>
                    <div class="input-group col-auto">
                        <input
                            v-model="serviceCharge"
                            type="number"
                            min="0"
                            class="form-control"
                        />
                        <div class="input-group-append">
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                    <label class="col-auto">加急费：</label>
                    <div class="input-group col-auto">
                        <input
                            v-model="expressCharge"
                            type="number"
                            min="0"
                            class="form-control"
                        />
                        <div class="input-group-append">
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        class="btn btn-primary"
                        @click="updateCharge"
                    >
                        更新
                    </button>
                </form>
            </div>
            <div class="col-12">
                <cool-table
                    ref="laundryTable"
                    :data="tableData"
                    :columns="columns"
                    :pageSize="5"
                    @edit-row="edit"
                    @del-row="delOne"
                >
                    <!-- <button class="btn btn-primary" @click="createClass">
                        新增分类
                    </button> -->
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
        <div v-if="view === 'form'" class="row p-3">
            <div class="col-12">
                <laundry-form
                    :value="laundryBody"
                    @change="initLaundries"
                    @close="view = 'table'"
                />
            </div>
        </div>
        <div v-else-if="view === 'classForm'" class="row p-3">
            <div class="col-12">
                <laundry-class-form
                    @change="initClasses"
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
import { LaundryApi, LaundryBody, LaundryChargeApi } from '@/api/LaundryApi'
import CoolTable from '@/components/CoolTable.vue'
import { mapActions, mapState } from 'vuex'
import LaundryForm from './LaundryForm.vue'
import LaundryClassForm from './class/LaundryClassForm.vue'
import CoolSorter from '@/components/CoolSorter.vue'

export default {
    name: 'LaundryApp',
    components: { CoolTable, LaundryForm, LaundryClassForm, CoolSorter },
    data() {
        return {
            view: 'table',
            classFilter: 0,
            originCharge: { serviceCharge: 0, expressCharge: 0 },
            serviceCharge: 0, expressCharge: 0,
            data: [],
            columns: [{
                checkbox: true
            }, {
                field: 'class', title: '所属分类', align: 'center',
                formatter: (val, row, idx) => val ? val.classes[0].name + ' / ' + val.classes[1].name : '未分类'
            }, {
                field: 'laundries', title: '名称', align: 'center',
                formatter: (val, row, idx) => val.find(v => v.langId === 0).name
            }, {
                field: 'laundries', title: 'Name', align: 'center',
                formatter: (val, row, idx) => val.find(v => v.langId === 1).name
            }, {
                field: 'price', title: '单价（分）', align: 'center'
            }, {
                field: 'id', title: '操作', align: 'center',
                formatter: (val, row, idx) => {
                    return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">修改</button>
                            <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row">删除</button>`
                }
            }],
            laundryBody: {},
            sortVisible: false,
            sortData: [],
        }
    },
    computed: {
        ...mapState({
            classes: s => s.classes,
        }),
        tableData() {
            return this.data.map(v => {
                return { ...v, class: this.classes.find(c => c.id === v.classId) }
            }).filter(v => this.classFilter === 0 ? true : (v.classId === this.classFilter))
        },
    },
    methods: {
        ...mapActions({
            initClasses: 'initClasses'
        }),
        getSelections() {
            return this.$refs.laundryTable.getSelections();
        },
        initCharge() {
            LaundryChargeApi.hotelCharge().then(data => {
                this.originCharge = data;
                this.serviceCharge = data.serviceCharge
                this.expressCharge = data.expressCharge
            }).catch(err => this.$error(err))
        },
        initLaundries() {
            LaundryApi.list().then(data => {
                this.data = data.list
            }).catch(err => this.$error(err))
        },
        create() {
            this.laundryBody = new LaundryBody()

            this.view = 'form'
        },
        edit(_id) {
            this.laundryBody = this.tableData.find(v => v.id === _id);

            this.view = 'form'
        },
        del() {
            const selections = this.getSelections();
            if (selections.length === 0) {
                return;
            }

            this.$confirm('确定删除').then(ok => {
                if (ok) {
                    LaundryApi.delete(selections.map(v => v.id)).then(() => {
                        return this.$info('删除成功')
                    }).then(() => {
                        this.initLaundries()
                    })
                }
            }).catch(err => this.$error(err))
        },
        delOne(_id) {
            this.$confirm('确定删除').then(ok => {
                if (ok) {
                    LaundryApi.delete([_id]).then(() => {
                        return this.$info('删除成功')
                    }).then(() => {
                        this.initLaundries()
                    })
                }
            }).catch(err => this.$error('删除失败'))
        },
        createClass() {
            this.view = 'classForm'
        },
        updateCharge() {
            this.originCharge.serviceCharge = this.serviceCharge
            this.originCharge.expressCharge = this.expressCharge
            LaundryChargeApi.update(this.originCharge).then(() => {
                this.initCharge()
            }).catch(err => this.$error(err))
        },
        sort() {
            this.sortData = this.tableData.map(v => {
                return { key: v.id, label: v.laundries[0].name }
            });

            this.sortVisible = true
        },
        updateSort(value) {
            if (!value||value.length === 0) {
                return
            }

            LaundryApi.updateSort(value.map(v => v.key)).then(_ => {
                return this.$info('更新成功')
            }).then(_ => this.initLaundries()).catch(err => this.$error(err))
        }
    },
    created() {
        this.initCharge()
        this.initLaundries()
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