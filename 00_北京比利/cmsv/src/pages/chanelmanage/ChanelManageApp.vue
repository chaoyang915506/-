<template>
    <div class="container-fluid" style="height:100%,width:100%,overflow:auto">
        <div v-if="view == 'table'">
            <h2>epg频道对应管理</h2>
            <div class="card">
                <div class="card-header">查询条件</div>
                <div class="card-body row">
                    <div class="col-3 mb-3">
                        <label class="col-sm-6 label-style"> 频道code </label>
                        <div class="col-sm-6 input-format">
                            <input
                                type="text"
                                v-model="code"
                                class="form-control"
                            />
                        </div>
                    </div>
                    <div class="col-3">
                        <label class="col-sm-6 label-style">
                            数据源频道code
                        </label>
                        <div class="col-sm-6 input-format">
                            <input
                                type="text"
                                v-model="epgcode"
                                class="form-control"
                            />
                        </div>
                    </div>
                    <div class="col-3">
                        <label class="col-sm-6 label-style"> 频道名称 </label>
                        <div class="col-sm-6 input-format">
                            <input
                                type="text"
                                v-model="channelName"
                                class="form-control"
                            />
                        </div>
                    </div>
                    <div class="col-3">
                        <label class="col-sm-6 label-style"> 数据源 </label>
                        <div class="col-sm-6 input-format">
                            <select class="form-control" @change="seleData">
                                <option value="">全部</option>
                                <option value="1">酷控</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <cool-table
                @edit-row="editTable"
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
                <button class="btn btn-primary ml-1" @click="handleExport">
                    导出
                </button>

                <iframe name="newpage" style="display: none"></iframe>
                <button class="btn btn-danger ml-1" @click="importExcel">
                    导入
                    <input
                        type="file"
                        ref="files"
                        @change="changeExcel"
                        style="display: none"
                    />
                </button>
                <!-- <cool-upload-excel
                    :on-success="handleSuccess"
                    :before-upload="beforeUpload"
                ></cool-upload-excel> -->
            </cool-table>
        </div>
        <div v-if="view == 'form'" class="form-class">
            <vo v-slot="{ handleSubmit }" class="col-sm-6">
                <form novalidate @submit.prevent="handleSubmit(submit)">
                    <h3 class="title">{{ title }}</h3>
                    <!-- id -->
                    <vp
                        class="form-group"
                        tag="div"
                        v-slot="v"
                        v-if="editData.id"
                    >
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
                    <!-- 频道code -->
                    <vp
                        class="form-group"
                        tag="div"
                        v-slot="v"
                        rules="required"
                        name="频道code"
                    >
                        <label class="label-class">频道code</label>
                        <div class="input-class">
                            <input
                                class="form-control"
                                v-model="editData.code"
                                v-validate="v"
                                type="text"
                            />
                            <span class="err">{{ v.errors[0] }}</span>
                        </div>
                    </vp>
                    <!-- 频道源 -->
                    <vp
                        class="form-group"
                        style="margin-top: 4%"
                        tag="div"
                        v-slot="v"
                    >
                        <label class="label-class">频道源</label>
                        <div class="input-class">
                            <select
                                class="form-control"
                                v-validate="v"
                                v-model="editData.source"
                            >
                                <option value="1" selected>酷控</option>
                            </select>
                        </div>
                    </vp>
                    <!-- 数据源频道code -->
                    <vp
                        class="form-group"
                        style="margin-top: 4%"
                        tag="div"
                        v-slot="v"
                    >
                        <label class="label-class">数据源频道code</label>
                        <div class="input-class">
                            <input
                                v-model="editData.epgChannelCode"
                                class="form-control"
                                type="text"
                                maxlength="20"
                                v-validate="v"
                            />
                        </div>
                    </vp>
                    <!-- 频道Logo -->
                    <vp
                        class="form-group"
                        style="margin-top: 4%"
                        tag="div"
                        v-slot="v"
                    >
                        <label class="label-class">频道Logo</label>
                        <div class="input-class">
                            <input
                                class="form-control"
                                type="text"
                                v-model="editData.epgLogo"
                                v-validate="v"
                            />
                            <span class="err">{{ v.errors[0] }}</span>
                        </div>
                    </vp>

                    <!-- 频道名称 -->
                    <vp
                        class="form-group"
                        style="margin-top: 4%"
                        tag="div"
                        v-slot="v"
                    >
                        <label class="label-class">频道名称</label>
                        <div class="input-class">
                            <input
                                class="form-control"
                                type="text"
                                v-model="editData.epgName"
                                v-validate="v"
                            />
                        </div>
                    </vp>
                    <!-- 操作 -->
                    <div class="form-group mt-4" style="margin-left: 25%">
                        <button class="btn btn-dark">确定</button>
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
        <cool-loading :loading="loading"></cool-loading>
    </div>
</template>

<script>

import CoolTable from '@/components/CoolTable.vue'
import ChanelManageApi from '@/api/ChanelManageApi'
import env from '@/env'
import CoolLoading from '@/components/CoolLoading.vue'
// import CoolUploadExcel from '@/components/CoolUploadExcel.vue'
import KeyManageApi from '@/api/KeyManageApi'
import Axios from 'axios'
export default {
    data () {
        return {
            view: 'table',
            loading: false,
            columns: [{
                checkbox: true
            }, {
                field: 'id', title: 'id', align: 'center'
            }, {
                field: 'code', title: '频道code', align: 'center'
            },
            {
                field: 'epgChannelCode', title: '数据源频道code', align: 'center',
            },
            {
                field: 'source', title: '数据源', align: 'center',
                formatter: val => {
                    if (val == 1) {
                        return '酷控'
                    } else {
                        return '未知'
                    }
                }
            },
            {
                field: 'epgName', title: '频道名字', align: 'center'
            },
            {
                field: 'epgLogo', title: '频道logo', align: 'center',
                formatter: val => {
                    return `<div class="p-class">${val}</div>`
                },
            },
            {
                field: 'id', title: '操作', align: 'center',
                width: 300,
                formatter: (val, row, idx) => {
                    return `
                  <button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">修改</button>
                      <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row" >删除</button>
                      `
                }
            }
            ],
            tableList: [],

            code: '',
            epgcode: '',
            channelName: '',
            source: '',

            title: '添加直播epg',
            editData: {},
            state: false,
        }
    },
    components: {
        CoolTable, CoolLoading
    },
    computed: {
        tableData () {
            let code = new RegExp(this.code, 'ig')
            let datacode = new RegExp(this.epgcode, 'ig')
            let channel = new RegExp(this.channelName, 'ig')
            return this.tableList.filter(item => {
                return this.code == '' ? true : code.test(item.code)
            }).filter(idx => {
                return this.epgcode == '' ? true : datacode.test(idx.epgChannelCode)
            }).filter(jk => {
                return this.channelName == '' ? true : channel.test(jk.epgName)
            }).filter(source => {
                return this.source == '' ? true : source.source == this.source
            })
        },
        exportExcel () {
            return env.cms + '/cms/cmsEpg/getAll?code=&epgChannelCode=&epgName=&token=' + env.token
        },
        importUrl () {
            return env.cms + '/cms/cmsEpg/importEpgChannel?token=' + env.token
        }
    },
    created () {
        this.getAllData()
    },
    methods: {
        // beforeUpload (file) {
        //     const fileName = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)
        //     if (fileName !== 'xls' && fileName !== 'xlsx') {
        //         // return this.$error('文件格式不正确')
        //         return false
        //     } else {
        //         return true
        //     }
        // },
        // async handleSuccess (res) {
        //     let header = ['频道code', '数据源(1:酷控)', '数据源频道code', '频道Logo', '频道名称']
        //     header.forEach((item, inx) => {
        //         if (res.header[inx] !== header[inx]) {
        //             this.$error('excel标题有误,请按格式重新上传')
        //             this.state = true
        //             return false
        //         }
        //     })
        //     let data = await this.tarnsfromKeys(res.results)
        //     let codelist = data.map(item => item.code)
        //     let sourcelist = data.map(item => item.source)
        //     for (let i = 0; i < data.length; i++) {
        //         if ((data[i].code, codelist) == -1) {
        //             // console.log(data[i].code)
        //             // this.$error(`导入channel列表第${i + 2}行频道code重复，请检查!`)
        //             // return
        //         } else if (data[i].code.trim() == '') {
        //             this.$error(`导入channel列表第${i + 2}行频道code不能为空!`)
        //             return
        //         }
        //     }
        //     // if (data[i].source.trim() == '') {
        //     //     this.$error(`导入channel列表第${i + 2}行频道code不能为空!`)
        //     //     return
        //     // } else if (data[i].source !== 1) {
        //     //     this.$error(`导入channel列表第${i + 2}行频道code最大长度为256！`)
        //     //     return
        //     // } else if (sourcelist.indexOf(data[i].source) !== true) {
        //     //     this.$error(`导入channel列表第${i + 2}行频道code重复，请检查!`)
        //     //     return
        //     // }
        //     if (this.state == false) {
        //         await ChanelManageApi.uploadApi(data)
        //         await this.$info('导入成功')
        //     }


        // },
        // tarnsfromKeys (excelResuls) {
        //     const suerRelations = {
        //         '频道Logo': 'epgLogo',
        //         '频道code': 'code',
        //         '数据源(1:酷控)': 'source',
        //         '数据源频道code': 'epgChannelCode',
        //         '频道名称': 'epgName'
        //     }
        //     //存数据
        //     const newArr = []
        //     excelResuls.forEach(itx => {
        //         const objInfo = {}
        //         for (const zhkey in itx) {
        //             let enKey = suerRelations[zhkey]
        //             objInfo[enKey] = itx[zhkey]

        //         }
        //         newArr.push(objInfo)
        //     })
        //     return newArr
        // },
        transformExcelData (list, headers) {
            let parent = []
            list.forEach(item => {
                let childArray = []
                for (let key in item) {
                    if (headers.includes(key)) {
                        childArray.push(item[key])
                    }
                }
                parent.push(childArray)
            })
            return parent
        },
        async handleExport () {
            const apidata = await ChanelManageApi.exportApi()
            const ships = {
                '频道code': 'code',
                '数据源(1:酷控)': 'source',
                '数据源频道code': 'epgChannelCode',
                '频道Logo': 'epgLogo',
                '频道名称': 'epgName'
            }
            let data = this.transformExcelData(apidata.list, Object.values(ships))
            const excel = await import('@/utils/Export2Excel')
            const header = Object.keys(ships)

            excel.export_json_to_excel({
                header, // excel导出的表头
                data, // excel导出的数据
                filename: 'epgChannel', // 导出Excel文件名
                autoWidth: true, // 导出Excel数据列的宽度自适应
                bookType: 'xlsx' // 导出文件类型
            })
        },

        async changeExcel (ev) {
            let data = this.$refs.files.files[0]
            let suffix = data.name.substring(data.name.lastIndexOf('.') + 1, data.name.length)
            if (suffix !== 'xlsx' && suffix !== 'xls') {
                this.$error('文件格式不正确')
            }
            this.loading = true
            const file = new FormData()

            file.append('excelFile', data)
            Axios.post(this.importUrl, file, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                if (res.data.code === '0x0000') {
                    this.$info(res.data.msg)
                    this.$refs.files.value = ""
                    this.loading = false
                } else if (res.data.msg == 'wrong startRow') {
                    this.$error('导入epgChannel列表为空!')
                    this.loading = false

                }
                else {
                    this.$error(res.data.msg)
                    this.$refs.files.value = ""
                    this.loading = false

                }
                this.getAllData()
            }).catch(err => {
                this.$refs.files.value = ""
                this.getAllData()
                console.log(err)
                this.$error(err)
                this.loading = false

            })
        },
        importExcel () {
            this.$refs.files.click()
        },
        //data
        async getAllData () {
            try {
                const data = await ChanelManageApi.getallTable()
                this.tableList = data.rows
            } catch (error) {
                console.log(error)
            }
        },
        //数据源
        async seleData (e) {
            try {
                this.tableList = []
                const data = await ChanelManageApi.getallTable(e.target.value)
                this.tableList = data.rows
            } catch (error) {
                console.log(error)
            }
        },
        // 新增
        addfile () {
            this.title = '添加直播epg'
            this.editData = {}
            this.editData.source = 1
            this.view = 'form'
        },
        //删除多个
        async delMessages () {
            let selections = this.$refs.messageTable.getSelections()
            if (selections.length == 0) return
            try {
                const ok = await this.$confirm(`确定删除选择的频道吗？`)
                if (!ok) return

                await ChanelManageApi.delepgAllApi({ idList: selections.map(item => item.id) })
                await this.$info('删除成功')
                await this.close()
            } catch (error) {
                console.log(error)
            }
        },//删除单个
        async manageCity (val) {
            try {
                const res = await this.$confirm(`确定删除id是：${val}的频道吗？`)
                if (!res) return
                await ChanelManageApi.delepgApi(val)
                await this.getAllData()
                await this.$info('删除成功')
            } catch (error) {
                console.log(error)
            }
        },

        editTable (val) {
            this.title = '编辑直播epg'
            let data = this.tableData.find(item => item.id == val)
            this.editData = JSON.parse(JSON.stringify(data))
            this.view = 'form'
        },
        async submit () {
            try {
                console.log(this.editTable, 'edit')

                if (this.editData.id) {
                    await ChanelManageApi.editepgApi(this.editData)
                    await this.$info('编辑成功')
                    await this.close()
                } else {
                    await ChanelManageApi.addepgApi({ epgChannelCode: "", epgLogo: "", epgName: "", id: "", ...this.editData })
                    await this.$info('添加成功')
                    await this.close()
                }
            } catch (error) {
                console.log(error)
            }
        },
        close () {
            this.view = 'table'
            this.getAllData()
        }
    },
}
</script>

<style lang="scss" scoped>
::v-deep .label-style {
    font-size: 16px;
    font-weight: 700;
    width: 40%;
}
::v-deep .input-format {
    float: right;
    display: inline-block;
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
.title {
    text-align: center;
    margin: 3% 0;
}
::v-deep .p-class {
    word-wrap: break-word;
    word-break: normal;
}
::v-deep td {
    max-width: 300px;
}
::v-deep .col-sm-6 {
    padding-left: 0;
}
.err {
    font-size: 12px;
    position: absolute;
    width: 100%;
    font-size: 80%;
    color: #dc3545;
}
</style>