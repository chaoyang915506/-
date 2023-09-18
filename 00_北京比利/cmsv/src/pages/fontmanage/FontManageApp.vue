<template>
    <div class="container-fluid" style="height:100%,width:100%,overflow:auto">
        <h2>{{ vendor }}字体管理</h2>
        <div v-if="view == 'table'">
            <cool-table
                @edit-row="editTable"
                :columns="columns"
                :data="tableData"
                :pageSize="10"
                @del-row="delMessage"
                ref="messageTable"
                ><button class="btn btn-primary btn-sm" @click="addfont">
                    添加新字体
                </button>
            </cool-table>
        </div>
        <div v-if="view == 'form'" class="row">
            <div class="col-3"></div>
            <div class="col-6">
                <vo v-slot="{ handleSubmit }">
                    <form novalidate @submit.prevent="handleSubmit(submit)">
                        <!-- 酒店名称 -->
                        <vp class="form-group" tag="div" v-slot="v">
                            <label>酒店名字(Hotel Name)</label>
                            <select
                                class="custom-select"
                                v-validate="v"
                                required
                                v-model="editData.hotelId"
                                disabled
                            >
                                <option
                                    v-for="item in hotelList"
                                    :value="item.hotelId"
                                    :key="item.hotelId"
                                >
                                    {{ item.hotelName }}
                                </option>
                            </select>
                        </vp>

                        <!-- Language -->
                        <vp class="form-group" tag="div" v-slot="v">
                            <label>语言(Language)</label>
                            <select
                                v-model="editData.langId"
                                class="custom-select"
                                v-validate="v"
                                required
                            >
                                <option
                                    :value="item.langId"
                                    v-for="item in languageList"
                                    :key="item.langId"
                                >
                                    {{ item.label }}
                                </option>
                            </select>
                        </vp>
                        <!-- weight -->
                        <vp class="form-group" tag="div" v-slot="v">
                            <label>字体粗细(weight)</label>
                            <select
                                v-model="editData.weight"
                                class="custom-select"
                                v-validate="v"
                                required
                            >
                                <option selected value="1">normal</option>
                                <option value="2">bold</option>
                            </select>
                        </vp>
                        <!-- style -->
                        <vp class="form-group" tag="div" v-slot="v">
                            <label>字体(style)</label>
                            <select
                                v-model="editData.style"
                                class="custom-select"
                                v-validate="v"
                                required
                            >
                                <option selected value="1">normal</option>
                                <option value="2">italic</option>
                            </select>
                        </vp>
                        <!-- format -->
                        <vp class="form-group" tag="div" v-slot="v">
                            <label>格式(format)</label>
                            <select
                                v-model="editData.formats"
                                class="custom-select"
                                v-validate="v"
                                required
                            >
                                <option value="opentype">opentype</option>
                                <option value="truetype">truetype</option>
                            </select>
                        </vp>
                        <vp class="form-group parents" tag="div" v-slot="v">
                            <label>字体描述(Font Desc)</label>
                            <textarea
                                v-model="editData.fontDesc"
                                class="form-control"
                                v-nulllabel="v"
                                maxlength="50"
                                rows="3"
                            >
                            </textarea>
                            <span class="tips"
                                >可输入<i
                                    :class="[reduceNum < 10 ? 'now' : 'black']"
                                    >{{ reduceNum }}</i
                                >个字</span
                            >
                            <!-- <span class="err">{{ v.errors[0] }}</span> -->
                        </vp>
                        <vp
                            class="form-group margin-bottom"
                            tag="div"
                            v-slot="v"
                            rules="required"
                            name="字体文件"
                        >
                            <label>文件地址(Font Url)</label>
                            <cool-file-input
                                v-model="editData.fontFile"
                                :uploadUrl="fontUrl"
                                :opts="opt"
                                v-requiredSty="v"
                                :extensions="extensions"
                            ></cool-file-input>
                            <span class="err">{{ v.errors[0] }}</span>
                        </vp>

                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">
                                确定
                            </button>
                            <button
                                type="button"
                                class="btn btn-secondary ml-1"
                                @click="backtable"
                            >
                                返回
                            </button>
                        </div>
                    </form>
                </vo>
            </div>
            <div class="col-3"></div>
        </div>
    </div>
</template>


<script>
import CoolTable from '@/components/CoolTable.vue'
import env from '@/env'
import qs from 'qs'
import FontMangageApi from '@/api/FontManageApi'
import UploadApi from '@/api/UploadApi'
import CoolFileInput from '@/components/CoolFileInput.vue'
export default {
    data () {
        return {
            view: 'table',
            hotelId: env.hotelId,
            fileType_font: 'object',
            extensions: ['ttf', 'otf'],//规定上传的格式+
            fontUrl: UploadApi.getUrl('static'),
            vendor: env.vendor,
            columns: [ {
                field: 'id', title: 'ID', align: 'center'
            }, {
                field: 'hotelId', title: `${env.vendor}`, align: 'center',
                formatter: val => {
                    let data = this.hotelList.find(item => item.hotelId == val).hotelName
                    return !data ? '-' : data
                }
            },
            {
                field: 'style', title: '字体(style)', align: 'center',
                formatter: val => {
                    return val == '1' ? 'normal' : 'italic'
                }
            },
            {
                field: 'weight', title: '字体粗细(weight)', align: 'center',
                formatter: val => {
                    return val == '1' ? 'normal' : 'bold'
                }
            },
            {
                field: 'formats', title: '格式(formats)', align: 'center'
            },
            {
                field: 'langId', title: '语言', align: 'center',
                formatter: val => {
                    let data = this.languageList.find(item => item.langId == val).label
                    return !data ? '-' : data
                }
            },
            {
                field: 'id', title: '操作', align: 'center',
                formatter: (val, row, idx) => {
                    return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">修改</button>
                            <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row" >删除</button>`
                }
            }],
            tablelist: [],
            hotelList: [],//酒店或者园区
            languageList: [],//语言
            editData: {},
            opt: {
                showPreview: false
            },
            maxlength: 50
        }
    },
    computed: {
        tableData () {
            return this.tablelist
        },
        //用户输入的字数
        lenghtsize () {
            return this.editData.fontDesc ? this.editData.fontDesc.length : '0'
        },
        //用户剩余输入的字数
        reduceNum () {
            return 50 - this.lenghtsize
        }
    },
    created () {
        this.getTableData()
    },
    methods: {
        async submit () {
            try {
                if (this.editData.id) {
                    await FontMangageApi.updateApi(this.editData)
                    await this.$info('修改成功')
                    await this.backtable()
                } else {
                    await FontMangageApi.addfontApi(this.editData)
                    await this.$info('新增成功')
                    await this.backtable()
                }

            } catch (error) {
                let data = error.substring(error.length - 14)
                    this.$error('字体已经存在，不可以再添加！')
                // if (data == '字体已经存在，不可以再添加！') {
                // } else {
                //     // this.$error(error)
                // }

            }
        },
        backtable () {
            this.getTableData()
            this.view = 'table'
        },
        addfont () {
            this.editData = {
                hotelId: env.hotelId,
                style: 1,
                weight: 1,
                formats: 'opentype',
                langId: 0,
                fontFile: ''
            }
            this.view = 'form'
        },
        async getTableData () {
            try {
                const language = await FontMangageApi.getlanguageApi()
                this.languageList = language
                const hotel = await FontMangageApi.getGarden()
                this.hotelList = hotel
                const font = await FontMangageApi.getfontController()
                this.tablelist = font
            } catch (error) {

            }
        },
        editTable (val) {
            let data = this.tableData.find(item => item.id == val)
            this.editData = JSON.parse(JSON.stringify(data))
            this.view = 'form'
            // console.log(this.editData)
        },
        //删除
        async delMessage (id) {
            try {
                let res = await this.$confirm('确定删除此项吗？')
                if (!res) return
                await FontMangageApi.delfontmanage(id)
                await this.$info('删除成功')
                await this.getTableData()
            } catch (error) {
                console.log(error)
            }
        }
    },
    components: {
        CoolTable, CoolFileInput
    },
}
</script>
<style lang="scss" >
// ::v-deep .swal-title {
//     word-wrap: break-all;
// }
</style>
<style lang="scss" scoped>
::v-deep .error {
    width: 100px;
    text-align: center;
}
::v-deep .margin-bottom {
    margin-bottom: 1.3rem;
}
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
.is-none {
    border: 1px solid #28a745;
    border-radius: 5px;
    // border-color: #28a745;
}
.centerform {
    display: flex;
    justify-content: center;
}
.parents {
    position: relative;
    // width: 100%;
    // height: 100px;
}
textarea {
    resize: none;
}
.tips {
    position: absolute;
    right: 2%;
    bottom: 7%;
}
.now {
    color: red;
}
//
.black {
    color: #0069d9;
}
</style>