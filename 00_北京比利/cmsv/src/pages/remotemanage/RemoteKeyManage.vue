<template>
    <div>
        <div v-if="view == 'table'">
            <h2>图标管理</h2>
            <cool-table
                @edit-row="editTable"
                :columns="columns"
                :data="tableData"
                ref="messageTable"
            >
                <button class="btn btn-secondary" @click="onblack">
                    返回上一级
                </button>
            </cool-table>
        </div>
        <!-- <cool-modal
            title="编辑图标"
            :visible="modalVisible"
            :footer="{ visible: false }"
            @hidden="modalVisible = false"
        > -->
        <div v-if="view == 'form'" class="center-form">
            <vo v-slot="{ handleSubmit }" class="col-sm-6 mt-3">
                <form novalidate @submit.prevent="handleSubmit(submit)">
                    <!-- id -->
                    <h2 style="text-align: center; margin-bottom: 1rem">
                        修改图标
                    </h2>
                    <vp class="form-group" tag="div" v-slot="v">
                        <label class="label-class">ID</label>
                        <div class="input-class">
                            <input
                                disabled
                                v-model="editData.id"
                                class="form-control"
                                type="text"
                            />
                        </div>
                    </vp>
                    <!-- 遥控器 -->
                    <vp class="form-group" tag="div" v-slot="v">
                        <label class="label-class">遥控器</label>
                        <div class="input-class">
                            <select class="form-control" disabled>
                                <option
                                    :value="item.id"
                                    v-for="item in keyname"
                                    :key="item.id"
                                >
                                    {{ item.name }}
                                </option>
                            </select>
                        </div>
                    </vp>
                    <!-- 按键 -->
                    <vp
                        class="form-group"
                        style="margin-top: 4%"
                        tag="div"
                        v-slot="v"
                    >
                        <label class="label-class">按键</label>
                        <div class="input-class">
                            <select
                                class="form-control"
                                v-model="editData.kId"
                                disabled
                            >
                                <option
                                    :value="item.key.id"
                                    v-for="item in keylist"
                                    :key="item.key.id"
                                >
                                    {{ item.key.labelCn }}
                                </option>
                            </select>
                            <span class="err">{{ v.errors[0] }}</span>
                        </div>
                    </vp>
                    <!-- 白色图标 -->
                    <vp
                        class="form-group"
                        style="margin-top: 4%"
                        tag="div"
                        v-slot="v"
                    >
                        <label class="label-class">白色图标</label>
                        <div class="input-class">
                            <cool-file-input
                                v-model="editData.iconWhite"
                                :uploadUrl="uploatImage"
                                fileType="image"
                            >
                            </cool-file-input>
                        </div>
                    </vp>
                    <!-- 黑色图标 -->
                    <vp
                        class="form-group"
                        style="margin-top: 4%"
                        tag="div"
                        v-slot="v"
                    >
                        <label class="label-class">黑色图标</label>
                        <div class="input-class">
                            <cool-file-input
                                v-model="editData.iconBlack"
                                :uploadUrl="uploatImage"
                                fileType="image"
                            >
                            </cool-file-input>
                        </div>
                    </vp>

                    <!-- 操作 -->
                    <div class="form-group mt-4" style="margin-left: 25%">
                        <button type="submit" class="btn btn-primary">
                            确定
                        </button>
                        <button
                            type="button"
                            class="btn-secondary btn ml-1"
                            @click="shut"
                        >
                            返回
                        </button>
                    </div>
                </form>
            </vo>
        </div>
        <!-- </cool-modal> -->
    </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import RemoteManageApi from '@/api/RemoteManageApi'
// import CoolModal from '@/components/CoolModal.vue'
import CoolFileInput from '@/components/CoolFileInput.vue'
import UploadApi from '@/api/UploadApi'
export default {
    components: {
        CoolTable, CoolFileInput
    },
    data () {
        return {
            view: 'table',
            tableData: [],
            uploatImage: UploadApi.getUrl('image'),
            columns: [{
                checkbox: true
            }, {
                field: 'id', title: 'id', align: 'center'
            }, {
                field: 'rId', title: '遥控器', align: 'center',
                formatter: val => {
                    const data = this.keyname.find(item => item.id == val).name
                    if (data) {
                        return data
                    } else {
                        return '-'
                    }
                }
            },
            {
                field: 'kId', title: '按键', align: 'center',
                formatter: val => {
                    if (val) {
                        let data = this.keylist.find(item => item.key.id == val).key.labelCn
                        if (data) {
                            return data
                        } else {
                            return '-'
                        }
                    }
                }
            },
            {
                field: 'iconWhite', title: '白色图标', align: 'center',
                formatter: (val, row, idx) => {
                    if (val) {
                        return `<div class="picture"><img class="picicon" src="${val}" alt=""></div>`
                    } else {
                        return '-'
                    }
                }
            },
            {
                field: 'iconBlack', title: '黑色图标', align: 'center',
                formatter: (val, row, idx) => {
                    if (val) {
                        return `<img src="${val}" class="picicon" alt="">`
                    } else {
                        return '-'
                    }
                }
            },
            {
                field: 'id', title: '操作', align: 'center',
                formatter: (val, row, idx) => {
                    return `
                    <button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">修改</button>`
                }
            }],
            keylist: [],
            keyname: [],
            // modalVisible: false,//默认关闭
            editData: {}
        }
    },
    props: {
        remoteId: {
            type: Number,
            required: true
        },
    },
    created () {
        this.getAllRemote()
    },
    methods: {
        shut () {
            this.getAllRemote()
            // this.modalVisible = false
            this.view = 'table'
        },
        async submit () {
            try {
                console.log(this.editData, 'de')
                await RemoteManageApi.saveRemoterKeys(this.editData.id, this.editData)
                await this.getAllRemote()
                this.view = 'table'
                await this.$info('修改成功')
            } catch (error) {
                console.log(error)
            }

        },
        onblack () {
            this.$emit('close')
        },
        close () {
            this.view = 'table'
            this.getAllRemote()
            this.editData = {}
        },
        editTable (val) {
            this.editData = JSON.parse(JSON.stringify(this.tableData.find(item => item.id == val)))
            // console.log(this.editData);
            // this.modalVisible = true
            this.view = 'form'
        },
        async getAllRemote () {
            try {


                const namekey = await RemoteManageApi.getTableData()
                this.keyname = namekey.list
                // console.log(namekey)
                const data = await RemoteManageApi.getcmsKey()
                // console.log(data, 'data')
                this.keylist = data.rows
                const nowkey = await RemoteManageApi.getRemoterKyes(this.remoteId)
                // console.log(nowkey, 'key')
                this.tableData = nowkey.list
            } catch (error) {

            }
        }
    },
}
</script>

<style lang="scss" scoped>
::v-deep .picture {
    width: 100%;
    height: 100%;
    background-color: black;
}
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
// ::v-deep .modal-body {
//     padding-right: 8rem;
//     height: 500px;
//     overflow: auto;
//     // scroll: auto;
// }
// ::v-deep .file-drop-zone-title {
//     color: #aaa;
//     font-size: 1em;
//     padding: 18px 10px;
// }
.center-form {
    display: flex;
    justify-content: center;
}
::v-deep .picicon {
    background-size: contain;
    height: 100px;
}
</style>