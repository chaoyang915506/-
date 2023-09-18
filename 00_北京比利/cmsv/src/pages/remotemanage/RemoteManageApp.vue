<template>
    <div
        class="container-fluid"
        style="overflow: auto; width: 100%; height: 100%"
    >
        <div v-if="view === 'table'">
            <h2>遥控器管理</h2>
            <cool-table
                @edit-row="editTable"
                @key-row="keyTable"
                :columns="columns"
                :data="tableData"
                @del-row="delMessage"
                ref="messageTable"
            >
                <button class="btn btn-primary" @click="addnotice">新增</button>
            </cool-table>
        </div>
        <div v-if="view == 'form'" class="form-class">
            <vo novalidate v-slot="{ handleSubmit }" class="col-sm-6">
                <form @submit.prevent="handleSubmit(submit)">
                    <h2 style="text-align: center">{{ title }}</h2>
                    <!-- ID -->
                    <vp
                        class="form-group mt-3"
                        tag="div"
                        v-slot="v"
                        v-if="editData.id"
                    >
                        <label class="label-class">ID</label>
                        <div class="input-class">
                            <input
                                disabled
                                v-model="editData.id"
                                type="text"
                                class="form-control"
                            />
                        </div>
                    </vp>
                    <!-- 名字 -->
                    <vp
                        class="form-group mt-3"
                        tag="div"
                        v-slot="v"
                        name="名字"
                        rules="required"
                    >
                        <label class="label-class">名字</label>
                        <div class="input-class">
                            <input
                                v-model="editData.name"
                                type="text"
                                class="form-control"
                                v-validate="v"
                            />
                            <span class="err">{{ v.errors[0] }}</span>
                        </div>
                    </vp>
                    <!-- 型号代码 -->
                    <vp
                        class="form-group"
                        tag="div"
                        v-slot="v"
                        rules="required"
                        name="型号代码"
                    >
                        <label class="label-class control-label"
                            >型号代码</label
                        >
                        <div class="input-class">
                            <input
                                v-model="editData.code"
                                type="text"
                                class="form-control"
                                v-validate="v"
                            />
                            <span class="err">{{ v.errors[0] }}</span>
                        </div>
                    </vp>
                    <vp class="form-group parents" tag="div" v-slot="v">
                        <label class="label-class">内容描述</label>
                        <div class="input-class">
                            <textarea
                                class="form-control"
                                v-nulllabel="v"
                                v-model="editData.intro"
                                maxlength="34"
                                rows="2"
                            >
                            </textarea>
                            <!--  :class="[ < 10 ? 'now' : 'black']" -->
                            <!-- <span class="tips">可输入<i>{{}}</i>个字</span> -->
                            <span class="err">{{ v.errors[0] }}</span>
                        </div>
                    </vp>
                    <vp
                        class="form-group grounpos"
                        tag="div"
                        v-slot="v"
                        rules=":@startTime"
                    >
                        <label class="label-class control-label">图片</label>
                        <div class="input-class">
                            <cool-file-input
                                v-model="editData.pic"
                                :uploadUrl="backgroundImgUrl"
                                fileType="image"
                            ></cool-file-input>
                        </div>
                        <br />

                        <div class="invalid-feedback">
                            {{ v.errors[0] }}
                        </div>
                    </vp>
                    <!-- 操作 -->
                    <div class="form-group mt-4" style="margin-left: 25%">
                        <button type="submit" class="btn btn-dark">确定</button>
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
        <div v-if="view == 'keymanage'">
            <remote-key-manage
                @close="close"
                :remoteId="remoteId"
            ></remote-key-manage>
        </div>
    </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import RemoteManageApi from '@/api/RemoteManageApi'
import CoolFileInput from '@/components/CoolFileInput.vue'
import UploadApi from '@/api/UploadApi'
import RemoteKeyManage from './RemoteKeyManage.vue'
export default {
    data () {
        return {
            view: 'table',
            backgroundImgUrl: UploadApi.getUrl('image'),
            columns: [{
                checkbox: true
            }, {
                field: 'id', title: 'id', align: 'center'
            }, {
                field: 'name', title: '名称', align: 'center'
            },
            {
                field: 'code', title: '编号', align: 'center'
            },
            {
                field: 'intro', title: '描述', align: 'center'
            },
            {
                field: 'pic', title: '图片', align: 'center',
                formatter: (val, row, idx) => {
                    return `<img src="${val}" alt="">`
                }
            },
            {
                field: 'id', title: '操作', align: 'center',
                width: 250,
                formatter: (val, row, idx) => {
                    return `<button class="btn btn-info btn-sm" data-val=${val} data-emit="key-row">按键管理</button>
                    <button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">修改</button>
                  <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row" >删除</button>`
                }
            }],
            tableList: [],
            editData: {},
            title: '',
            remoteId: ''

        }
    },
    components: {
        CoolTable, CoolFileInput, RemoteKeyManage
    },
    computed: {
        tableData () {
            return this.tableList
        }
    },
    created () {
        this.getAllTable()
    },
    methods: {
        keyTable (val) {
            this.remoteId = val
            this.view = "keymanage"
        },
        async getAllTable () {
            try {
                const data = await RemoteManageApi.getTableData()
                this.tableList = data.list
            } catch (error) {

            }
        },
        close () {
            this.getAllTable()
            this.view = 'table'

        },
        addnotice () {
            this.title = '新增遥控器'
            this.editData = {
                pic: ''
            }
            this.view = 'form'
        },
        editTable (val) {
            this.title = '编辑遥控器'
            this.editData = JSON.parse(JSON.stringify(this.tableData.find(item => item.id == val)))
            this.view = 'form'
        },
        async delMessage (id) {
            try {
                const res = await this.$confirm('提示', `确定${this.tableData.find(item => item.id == id).name}删除吗？`)
                if (!res) return
                await RemoteManageApi.delRemoter(id)
                this.getAllTable()
                await this.$info('删除成功')
            } catch (error) {
                console.log(error)
            }
        },
        async submit () {
            try {
                if (this.editData.id) {
                    await RemoteManageApi.updateRemoter(this.editData)
                    await this.getAllTable()
                    await this.$info('更新成功')
                    this.view = 'table'
                } else {
                    await RemoteManageApi.addRomoter(this.editData)
                    await this.getAllTable()
                    await this.$info('新增成功')
                    this.view = 'table'
                }
            } catch (error) {
                console.log(error)
            }

        }
    },
}
</script>

<style lang="scss" scoped>
.label-class {
    display: inline-block;
    font-weight: 700;
    width: 21%;
    text-align: right;
    margin-right: 4%;
}
.input-class {
    display: inline-block;
    width: 75%;
}
.form-class {
    display: flex;
    justify-content: center;
}
.parents {
    display: flex;
    position: relative;
    align-items: center;
}
textarea {
    // resize: none;
}
.tips {
    position: absolute;
    right: 2%;
    bottom: 7%;
}
.now {
    color: red;
}
.black {
    color: #0069d9;
}
//错误样式
.err {
    font-size: 12px;
    position: absolute;
    width: 100%;
    margin-top: 0.25rem;
    font-size: 80%;
    color: #dc3545;
}
::v-deep .form-group {
    margin-bottom: 1.5rem;
}
</style>