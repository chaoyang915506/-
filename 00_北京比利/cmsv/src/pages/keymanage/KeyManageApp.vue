<template>
    <div
        class="container-fluid"
        style="overflow: auto; width: 100%; height: 100%"
    >
        <div>
            <div class="row">
                <div class="col-12" v-if="view === 'table'">
                    <h2>按键管理</h2>
                    <cool-table
                        @edit-row="editTable"
                        :columns="columns"
                        :data="tableData"
                        :pageSize="10"
                        @del-row="delMessage"
                        ref="messageTable"
                    >
                        <button class="btn btn-primary" @click="addfile">
                            添加
                        </button>
                        <button
                            class="btn btn-danger ml-1"
                            @click="delMessages"
                        >
                            删除
                        </button>
                        <button
                            class="btn btn-info ml-1"
                            @click="view = 'twopage'"
                        >
                            基础按键
                        </button>
                    </cool-table>
                </div>
            </div>
        </div>
        <div v-if="view === 'form'" class="centerbox mt-4">
            <!-- DaviceFirmFrom -->
            <div class="col-sm-6">
                <vo v-slot="{ handleSubmit }">
                    <form novalidate @submit.prevent="handleSubmit(submit)">
                        <!-- Id -->
                        <vp
                            class="form-group"
                            tag="div"
                            v-slot="v"
                            v-if="model.id"
                        >
                            <label>ID</label>
                            <input
                                type="text"
                                disabled
                                v-model="model.id"
                                class="form-control"
                                v-validate="v"
                                required
                            />
                        </vp>
                        <!-- hotelId -->
                        <vp class="form-group" tag="div" v-slot="v">
                            <label>{{ vendor }}名称</label>
                            <select
                                v-model="model.hotelId"
                                class="form-control"
                                disabled
                            >
                                <option
                                    v-for="item in garden"
                                    :key="item.hotelId"
                                    :value="item.hotelId"
                                >
                                    {{ item.hotelName }}
                                </option>
                            </select>
                        </vp>
                        <!-- keyId -->
                        <vp class="form-group" tag="div" v-slot="v">
                            <label>按键名称</label>
                            <select
                                class="custom-select"
                                v-validate="v"
                                v-model="model.keyId"
                                required
                            >
                                <option disabled selected value="">
                                    请选择
                                </option>
                                <option
                                    v-for="item in $store.state.keylist"
                                    :value="item.key.id"
                                    :key="item.key.id"
                                >
                                    {{ item.key.keyName }}
                                </option>
                            </select>
                        </vp>
                        <!-- itemBasicId -->
                        <vp class="form-group" tag="div" v-slot="v">
                            <label>栏目名称</label>
                            <select
                                placeholder="请选择"
                                class="custom-select"
                                v-validate="v"
                                required
                                v-model="model.itemBasicId"
                            >
                                <option disabled selected value="">
                                    请选择
                                </option>
                                <option
                                    v-for="item in countList"
                                    :value="item.itemBasicId"
                                    :key="item.itemBasicId"
                                >
                                    {{ item.itemBasicDesc }}
                                </option>
                            </select>
                        </vp>
                        <!-- uid -->
                        <vp class="form-group" tag="div" v-slot="v">
                            <label>目标栏目UID</label>
                            <input
                                v-model="model.uid"
                                class="form-control"
                                v-validate="v"
                                required
                            />
                        </vp>
                        <!-- action -->
                        <vp class="form-group" tag="div" v-slot="v">
                            <label>动作</label>
                            <select
                                placeholder="请选择"
                                class="custom-select"
                                v-validate="v"
                                v-model="model.action"
                                required
                            >
                                <option disabled selected value="">
                                    请选择
                                </option>
                                <option value="item">栏目跳转</option>
                                <option value="pin">pin码快捷键</option>
                                <option value="source">信号源跳转</option>
                                <option value="moudle">外部应用跳转</option>
                                <option value="none">按键不可用</option>
                            </select>
                        </vp>
                        <!-- 目标信号源名称 -->
                        <vp class="form-group" tag="div" v-slot="v">
                            <label>目标信号源名称</label>
                            <input
                                type="text"
                                v-model="model.source"
                                class="form-control"
                                v-validate="v"
                                required
                            />
                        </vp>
                        <!-- 目标应用参数 -->
                        <vp class="form-group" tag="div" v-slot="v">
                            <label>目标应用参数</label>
                            <input
                                type="text"
                                v-model="model.param"
                                class="form-control"
                                v-validate="v"
                                required
                            />
                        </vp>
                        <!-- 操作 -->
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">
                                {{ keyCount }}
                            </button>
                            <button
                                class="btn btn-secondary ml-1"
                                @click="close"
                            >
                                返回
                            </button>
                        </div>
                    </form>
                </vo>
            </div>
        </div>
        <div v-if="view == 'twopage'">
            <KeyManageBacicsKey @close="close" />
        </div>
    </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import KeyManageApi from '@/api/KeyManageApi'
import store from '@/store'
import { mapState } from 'vuex'
import env from '@/env'
import KeyManageBacicsKey from './KeyManageBacicsKey.vue'
export default {
    data () {
        return {
            vendor: env.vendor,
            view: 'table',
            keyCount: '添加',
            columns: [{
                checkbox: true
            }, {
                field: 'id', title: 'ID', align: 'center'
            }, {
                field: 'hotelId', title: `${env.vendor}`, align: 'center',
                formatter: val => {
                    const hotelName = this.garden.find(name => name.hotelId == val)
                    if (!hotelName) {
                        return '-'
                    }
                    return hotelName.hotelName
                }
            },
            {
                field: 'keyId', title: '按键', align: 'center',
                formatter: val => {
                    const keyname = this.keylist.find(idx => idx.key.id == val)
                    if (!keyname) {
                        return '-'
                    }
                    return keyname.key.keyName
                }
            },
            {
                field: 'action', title: '动作', align: 'center',
                formatter: val => {
                    if (val == 'item') {
                        return '栏目跳转'
                    } else if (val == 'pin') {
                        return 'pin码快捷键'
                    } else if (val == 'source') {
                        return '信号源跳转'
                    } else if (val == 'moudle') {
                        return '外部应用跳转'
                    } else {
                        return '按键不可用'
                    }
                }
            },
            {
                field: 'itemBasicId', title: '栏目', align: 'center',
                formatter: val => {
                    const itemBasicId = this.countList.find(it => it.itemBasicId == val)
                    if (!itemBasicId) {
                        return '-'
                    }
                    return itemBasicId.itemBasicDesc
                }
            },
            {
                field: 'uid', title: '目标栏目的uid', align: 'center'
            },
            {
                field: 'source', title: '目标信号源', align: 'center'
            },
            {
                field: 'param', title: '目标应用参数', align: 'center'
            },
            {
                field: 'id', title: '操作', align: 'center',
                width: 300,
                formatter: (val, row, idx) => {
                    return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">修改</button>
                            <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row" >删除</button>`
                }
            }],
            tableList: [],
            allid: [],
            countList: [],//栏目数据
            model: {}
        }
    },
    created () {
        this.getallData()
    },
    computed: {
        ...mapState(['garden', 'keylist']),
        tableData () {
            let bd = this.tableList
            return bd
        },
    },
    methods: {
        addfile () {
            // console.log(env.hotelId, 'env')
            let data = JSON.parse(JSON.stringify(env.hotelId))
            // console.log(data, 'data')
            if (data == null || data == 'null') {
                return this.$error(`请选择${env.vendor}`)
            } else {
                this.keyCount = '添加'
                this.model.hotelId = env.hotelId
                this.view = 'form'
            }
        },
        //获取全部数据
        async getallData () {
            try {
                const data1 = await KeyManageApi.getSelectCount()
                this.countList = data1
                const data = await KeyManageApi.getTableData()
                this.tableList = data.rows
            } catch (error) {
                console.log(error)
                // this.$error('获取数据失败')
            }
        },
        async submit () {
            try {
                if (!this.model.id) {
                    const data = await KeyManageApi.addhotel(this.model)
                    this.$info('新增成功')
                } else {
                    const data = await KeyManageApi.editupdate(this.model)
                    this.$info('修改成功')
                }
            } catch (error) {
                console.log(error)
                this.$error('操作失败')
            }
        },
        //头层表格返回
        close () {
            this.view = 'table'
            this.model = {}
            this.getallData()
        },
        //修改按钮
        editTable (val) {
            this.keyCount = '更新'
            let editdata = this.tableData.filter(item => item.id == val)[0]
            this.model = JSON.parse(JSON.stringify(editdata))
            this.view = 'form'
        },
        // 删除单个
        async delMessage (id) {
            try {
                const ok = await this.$confirm(`确定删除ID为${id}的按键吗?`)
                if (!ok) {
                    return
                }
                // 调用接口
                await KeyManageApi.deleteDate([id])
                await this.$info('删除成功')
                this.getallData()
            } catch (error) {
                // console.error(error)
                this.$error('删除失败')
            }
        },
        // 删除多个
        async delMessages () {
            const selections = this.$refs.messageTable.getSelections()
            if (selections.length == 0) return
            try {
                const ok = await this.$confirm(`确定删除${selections.length}条记录吗?`)
                if (!ok) return
                await KeyManageApi.deleteAll({ idList: selections.map(v => v.id) })
                await this.$info('删除成功')
                this.getallData()
            } catch (error) {
                console.error(error)
                this.$error('删除失败')
            }
        },
    },
    components: {
        CoolTable, KeyManageBacicsKey
    },
}
</script>

<style lang="scss" scoped>
.centerbox {
    display: flex;
    // justify-items: center;
    justify-content: center;
}
</style>