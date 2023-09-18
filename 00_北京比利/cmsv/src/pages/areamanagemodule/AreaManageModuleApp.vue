<template>
    <div
        class="container-fluid"
        style="overflow: auto; width: 100%; height: 100%"
    >
        <div class="col-12" v-if="view === 'table'">
            <h2>区域管理模块</h2>
            <div class="card">
                <div class="card-header">查询条件</div>
                <div class="card-body row">
                    <div class="col-4 mb-3">
                        <label class="col-sm-4"> 中文名称 </label>
                        <div class="col-sm-8" style="display: inline-block">
                            <input
                                type="text"
                                v-model="nameCn"
                                class="form-control"
                            />
                        </div>
                    </div>
                    <div class="col-4">
                        <label class="col-sm-4"> 英文名称 </label>
                        <div class="col-sm-8" style="display: inline-block">
                            <input
                                type="text"
                                v-model="nameEn"
                                class="form-control"
                            />
                        </div>
                    </div>
                    <div class="col-4">
                        <label class="col-sm-4"> 区域类型 </label>
                        <div class="col-sm-8" style="display: inline-block">
                            <select v-model="areaType" class="form-control">
                                <option value="">未选择</option>
                                <option value="0">省</option>
                                <option value="1">国家</option>
                                <option value="2">洲</option>
                                <option value="3">其他</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <cool-table
                @edit-row="editTable"
                @editor="editor"
                @del-row="manageCity"
                ref="messageTable"
                :columns="columns"
                :data="tableData"
            >
                <button class="btn btn-primary ml-1" @click="addfile">
                    添加
                </button>
                <button class="btn btn-danger ml-1" @click="delMessages">
                    删除
                </button>
            </cool-table>
        </div>

        <div v-if="view == 'form'" class="centerbox">
            <div class="col-sm-6 mr-top">
                <vo v-slot="{ handleSubmit }" v-if="view == 'form'">
                    <form novalidate @submit.prevent="handleSubmit(submit)">
                        <!-- id -->
                        <vp class="form-group" tag="div" v-slot="v">
                            <label class="label-class">ID</label>
                            <div class="input-class">
                                <input
                                    v-model="model.id"
                                    disabled
                                    class="form-control"
                                    type="text"
                                />
                            </div>
                        </vp>
                        <!-- 区域中文名称 -->
                        <vp
                            class="form-group"
                            style="margin-top: 4%"
                            tag="div"
                            v-slot="v"
                            rules="required"
                            name="区域中文名称"
                        >
                            <label class="label-class">区域中文名称(*)</label>
                            <div class="input-class">
                                <input
                                    v-model="model.name"
                                    class="form-control"
                                    type="text"
                                    maxlength="20"
                                    v-validate="v"
                                    required
                                />
                                <span class="err">{{ v.errors[0] }}</span>
                            </div>
                        </vp>
                        <!-- 区域英文名称 -->
                        <vp
                            class="form-group"
                            style="margin-top: 4%"
                            tag="div"
                            v-slot="v"
                            rules="required"
                            name="区域英文名称"
                        >
                            <label class="label-class">区域英文名称(*)</label>
                            <div class="input-class">
                                <input
                                    v-model="model.nameEn"
                                    class="form-control"
                                    type="text"
                                    maxlength="20"
                                    v-validate="v"
                                    required
                                />
                                <span class="err">{{ v.errors[0] }}</span>
                            </div>
                        </vp>
                        <!-- 区域类型 -->
                        <vp
                            class="form-group"
                            style="margin-top: 4%"
                            tag="div"
                            v-slot="v"
                            name="语言"
                        >
                            <label class="label-class">区域类型(*)</label>
                            <div class="input-class">
                                <select
                                    class="form-control"
                                    v-model="model.type"
                                    v-validate="v"
                                    required
                                >
                                    <option value="0">省</option>
                                    <option value="1">国家</option>
                                    <option value="2">洲</option>
                                    <option value="3">其他</option>
                                </select>
                                <span class="err">{{ v.errors[0] }}</span>
                            </div>
                        </vp>
                        <!-- 区域热度 -->
                        <vp
                            class="form-group"
                            style="margin-top: 4%"
                            tag="div"
                            v-slot="v"
                        >
                            <label class="label-class">区域热度</label>
                            <div class="input-class">
                                <input
                                    v-model="model.hot"
                                    class="form-control"
                                    type="number"
                                    max="1000"
                                    min="0"
                                    value="0"
                                    placeholder="请输入数字"
                                    v-validate="v"
                                    required
                                />
                            </div>
                        </vp>
                        <!-- 操作 -->
                        <div class="form-group mt-4" style="margin-left: 25%">
                            <button type="submit" class="btn btn-dark">
                                确定
                            </button>
                            <button
                                type="button"
                                class="btn-dark btn ml-1"
                                @click="close"
                            >
                                返回
                            </button>
                        </div>
                    </form>
                </vo>
            </div>
        </div>
        <area-manage-module-form
            v-if="view == 'count'"
            class="col-12 centerbox"
            :areaId="areaId"
            :matchCity="matchCity"
            @close="close"
        ></area-manage-module-form>
    </div>
</template>
<script>
import AreaManageModuleApi from '@/api/AreaManageModuleApi'
import CoolTable from '@/components/CoolTable.vue'
import env from '@/env'
import AreaManageModuleForm from './AreaManageModuleForm.vue'
export default {
    data () {
        return {
            nameCn: '',
            nameEn: '',
            areaType: '',
            model: {},
            view: 'table',
            tableList: [],
            areaId: '',//记忆id
            matchCity: '',//区分管理子区域和管理城市
            columns: [{
                checkbox: true
            }, {
                field: 'id', title: 'ID', align: 'center'
            }, {
                field: 'name', title: '中文名称', align: 'center'
            },
            {
                field: 'nameEn', title: '英文名称', align: 'center'
            },
            {
                field: 'type', title: '区域', align: 'center',
                formatter: val => {
                    if (val == 0) {
                        return '省'
                    } else if (val == 1) {
                        return '国家'
                    } else if (val == 2) {
                        return '洲'
                    } else {
                        return '其他'
                    }
                }
            },
            {
                field: 'hot', title: '热度', align: 'center'
            },
            {
                field: 'id', title: '操作', align: 'center',
                width: 300,
                formatter: (val, row, idx) => {
                    return `
                  <button class="btn btn-success btn-sm" data-val=${val} data-emit="editor" >编辑</button>
                  <button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">管理子区域</button>
                      <button class="btn btn-info btn-sm" data-val=${val} data-emit="del-row" >管理城市</button>
                      `
                }
            }
            ],
        }
    },
    computed: {
        tableData () {
            let Chinese = RegExp(this.nameCn, 'ig')
            let English = RegExp(this.nameEn, 'ig')
            return this.tableList.filter(item => {
                return this.nameCn == '' ? true : Chinese.test(item.name)
            }).filter(item => {
                return this.nameEn == '' ? true : English.test(item.nameEn)
            }).filter(idx => {
                return this.areaType == '' ? true : this.areaType == idx.type
            })
        },
    },
    created () {
        this.getHoteLangList()
    },
    methods: {
        // 返回关闭、
        close () {
            this.getHoteLangList()
            this.view = 'table'
        },
        //编辑
        editor (id) {
            let data = this.tableData.find(item => item.id == id)
            this.model = JSON.parse(JSON.stringify(data))
            this.view = 'form'
        },
        //添加
        addfile () {
            this.model = {
                type: 0,
                hot: 0
            }
            this.view = 'form'
        },
        //提交
        async submit () {
            try {
                if (this.model.id) {
                    const data = await AreaManageModuleApi.editTable(this.model)
                    this.$info('修改成功')
                } else {
                    //新增
                    const data = await AreaManageModuleApi.addTable({ ...this.model, id: '-1' })
                    await this.$info('新增成功')
                }
                this.view = 'table'
                this.getHoteLangList()
            } catch (error) {
                console.log(error)
                this.$error(error)
            }
        },
        //获取数据
        async getHoteLangList () {
            try {
                const tableD = await AreaManageModuleApi.getTableData()
                this.tableList = tableD.rows
            } catch (error) {
                console.log(error)

            }
        },
        //管理子区域按钮
        editTable (val) {
            this.matchCity = 'areaSon'
            this.areaId = val
            this.view = 'count'
        },
        //管理城市
        manageCity (val) {
            this.matchCity = 'manageCity'
            this.areaId = val
            this.view = 'count'
        },
        // // 删除多个
        async delMessages () {
            const selections = this.$refs.messageTable.getSelections()
            if (selections.length === 0) return

            try {
                const ok = await this.$confirm(`确定删除${selections.length}项吗？`)
                if (!ok) {
                    return
                }
                await AreaManageModuleApi.deleteTable({ idList: selections.map(v => v.id) })
                await this.$info('删除成功')
                this.getHoteLangList()
            } catch (error) {
                console.error(error)
                this.$error('删除失败')
            }
        },
    },
    components: {
        CoolTable, AreaManageModuleForm
    },
}
</script>

<style lang="scss" scoped>
::v-deep td {
    max-width: 300px;
}

.mr-top {
    margin-top: 3%;
}
label {
    font-size: 15px;
}
.centerbox {
    display: flex;
    margin-top: 4%;
    // justify-items: center;
    justify-content: center;
}
.input-class {
    display: inline-block;
    width: 75%;
}
.label-class {
    display: inline-block;
    font-weight: 700;
    width: 21%;
    text-align: right;
    margin-right: 4%;
}
.center-style {
    display: flex;
    align-items: center;
}
//错误样式
.err {
    font-size: 12px;
    position: absolute;
    width: 100%;
    font-size: 80%;
    color: #dc3545;
}
.is-block {
    border: 1px solid red;
    border-radius: 5px;
}
::v-deep.is-invalid {
    background-image: none;
}
// palcehotle样式
input::placeholder {
    color: #adadad;
    display: inline-block;
    margin-bottom: 10px;
    padding-top: 2px;
    font-size: 12px;
    
}
</style>