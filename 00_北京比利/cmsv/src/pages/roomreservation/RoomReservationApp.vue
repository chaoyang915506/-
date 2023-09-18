<template>
    <div class="container-fluid" style="height:100%,width:100%,overflow:auto">
        <div v-if="view == 'table'">
            <h2>订餐管理</h2>
            <div class="card">
                <div class="card-header">查询条件</div>
                <div class="card-body row">
                    <div class="col-4 mb-3">
                        <label class="col-sm-4"> 城市名称 </label>
                        <div class="col-sm-8" style="display: inline-block">
                            <select class="form-control" @change="checked">
                                <option
                                    :value="item.langId"
                                    v-for="item in languageList"
                                    :key="item.id"
                                >
                                    {{ item.label }}
                                </option>
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
                <button class="btn btn-primary ml-1" @click="putaway">
                    上架
                </button>

                <iframe name="newpage" style="display: none"></iframe>
                <button class="btn btn-danger ml-1" @click="soldout">
                    下架
                </button>
            </cool-table>
        </div>
        <div v-if="view == 'form'" style="margin: 20px">
            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li
                    class="nav-item"
                    role="presentation"
                    v-for="(item, i) in languageList"
                    :key="item.id"
                >
                    <a
                        :class="['nav-link', activeSysIdx == item.langId]"
                        id="home-tab"
                        data-toggle="tab"
                        aria-controls="home"
                        aria-selected="true"
                        @click="activeNav(item.langId, item)"
                        >{{ item.label }}</a
                    >
                </li>
            </ul>
            <div class="tab-content" id="myTabContent">
                <div
                    :class="[
                        'tab-pane',
                        'fade',
                        'show',
                        activeSysIdx == item.langId ? 'active' : 'null',
                    ]"
                    id="home"
                    role="tabpanel"
                    aria-labelledby="home-tab"
                    v-for="item in languageList"
                    :key="item.id"
                    v-if="activeSysIdx == item.langId"
                >
                    <vo v-slot="{ handleSubmit }" class="col-sm-6">
                        <form novalidate @submit.prevent="handleSubmit(submit)">
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
                            <!-- 金额(单位:分) -->
                            <vp class="form-group" tag="div" v-slot="v">
                                <label class="label-class">金额(单位:分)</label>
                                <div class="input-class">
                                    <input
                                        class="form-control"
                                        v-model="editData.code"
                                        type="text"
                                    />
                                </div>
                            </vp>
                            <!-- 频道code -->
                            <vp class="form-group" tag="div" v-slot="v">
                                <label class="label-class">金额单位</label>
                                <div class="input-class">
                                    <multiselect
                                        placeholder="全部"
                                        :options="monetyList"
                                        :custom-label="nameWithLang"
                                        track-by="id"
                                    >
                                        <template v-slot:noResult
                                            >找不到数据</template
                                        >
                                        <template #noOptions
                                            >没有数据了</template
                                        >
                                    </multiselect>
                                </div>
                            </vp>
                            <!-- 外部系统ID -->
                            <vp
                                class="form-group"
                                style="margin-top: 4%"
                                tag="div"
                                v-slot="v"
                                name="外部系统ID"
                            >
                                <label class="label-class">外部系统ID</label>
                                <div class="input-class">
                                    <input
                                        class="form-control"
                                        type="text"
                                        maxlength="20"
                                        v-validate="v"
                                        required
                                    />
                                    <span class="err">{{ v.errors[0] }}</span>
                                </div>
                            </vp>
                            <!-- 状态 -->
                            <vp
                                class="form-group"
                                style="margin-top: 4%"
                                tag="div"
                                v-slot="v"
                                name="状态"
                            >
                                <label class="label-class">状态</label>
                                <div class="input-class">
                                    <label class="mr-3">
                                        <input
                                            v-model="editData.isDomestic"
                                            type="radio"
                                            name="radiobutton"
                                            value="1"
                                            checked
                                        />&nbsp;上架
                                    </label>
                                    <label>
                                        <input
                                            v-model="editData.isDomestic"
                                            type="radio"
                                            name="radiobutton"
                                            value="0"
                                        />&nbsp;下架
                                    </label>
                                    <span class="err">{{ v.errors[0] }}</span>
                                </div>
                            </vp>
                            <!-- 功能性 -->
                            <vp
                                class="form-group"
                                style="margin-top: 4%"
                                tag="div"
                                v-slot="v"
                                name="功能性"
                            >
                                <label class="label-class">功能性</label>
                                <div class="input-class">
                                    <label class="mr-3">
                                        <input
                                            type="radio"
                                            name="function"
                                            value="1"
                                            checked
                                        />&nbsp;菜品
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="function"
                                            value="0"
                                        />&nbsp;宣传页
                                    </label>
                                    <span class="err">{{ v.errors[0] }}</span>
                                </div>
                            </vp>
                            <!-- 呈现类型 -->
                            <vp
                                class="form-group"
                                style="margin-top: 4%"
                                tag="div"
                                v-slot="v"
                                name="呈现类型"
                            >
                                <label class="label-class">呈现类型</label>
                                <div class="input-class">
                                    <select class="form-control" v-validate="v">
                                        <option value="1" selected>图片</option>
                                        <option value="2">视频</option>
                                    </select>
                                    <span class="err">{{ v.errors[0] }}</span>
                                </div>
                            </vp>
                            <!-- 名字 -->
                            <vp
                                class="form-group"
                                style="margin-top: 4%"
                                tag="div"
                                v-slot="v"
                                rules="required"
                                name="名字"
                            >
                                <label class="label-class">名字</label>
                                <div class="input-class">
                                    <input
                                        class="form-control"
                                        type="text"
                                        maxlength="20"
                                        v-validate="v"
                                        required
                                    />
                                    <span class="err">{{ v.errors[0] }}</span>
                                </div>
                            </vp>
                            <!-- 图片 -->
                            <vp
                                class="form-group"
                                style="margin-top: 4%"
                                tag="div"
                                v-slot="v"
                                rules="required"
                                name="图片"
                            >
                                <label class="label-class">图片</label>
                                <div class="input-class">
                                    <cool-file-input
                                        :uploadUrl="cityicon"
                                        fileType="image"
                                        :extensions="extensions"
                                    ></cool-file-input>
                                    <span class="err">{{ v.errors[0] }}</span>
                                </div>
                            </vp>
                            <!-- 视频 -->
                            <vp
                                class="form-group"
                                style="margin-top: 4%"
                                tag="div"
                                v-slot="v"
                                rules="required"
                                name="视频"
                            >
                                <label class="label-class">视频</label>
                                <div class="input-class">
                                    <cool-file-input
                                        :uploadUrl="cityicon"
                                        fileType="image"
                                        :extensions="extensions"
                                    ></cool-file-input>
                                    <span class="err">{{ v.errors[0] }}</span>
                                </div>
                            </vp>
                            <!-- 描述价格图片 -->
                            <vp
                                class="form-group"
                                style="margin-top: 4%"
                                tag="div"
                                v-slot="v"
                                rules="required"
                                name="描述价格图片"
                            >
                                <label class="label-class">描述价格图片</label>
                                <div class="input-class">
                                    <cool-file-input
                                        :uploadUrl="cityicon"
                                        fileType="image"
                                        :extensions="extensions"
                                    ></cool-file-input>
                                    <span class="err">{{ v.errors[0] }}</span>
                                </div>
                            </vp>
                            <!-- 按键指示图 -->
                            <vp
                                class="form-group"
                                style="margin-top: 4%"
                                tag="div"
                                v-slot="v"
                                rules="required"
                                name="按键指示图"
                            >
                                <label class="label-class">按键指示图</label>
                                <div class="input-class">
                                    <cool-file-input
                                        :uploadUrl="cityicon"
                                        fileType="image"
                                        :extensions="extensions"
                                    ></cool-file-input>
                                    <span class="err">{{ v.errors[0] }}</span>
                                </div>
                            </vp>
                            <!-- 操作 -->
                            <div
                                class="form-group mt-4"
                                style="margin-left: 25%"
                            >
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
        </div>
    </div>
</template>

<script>

import CoolTable from '@/components/CoolTable.vue'
import RoomReservationApi from '@/api/RoomReservationApi'
import env from '@/env'
import Multiselect from 'vue-multiselect'
import KeyManageApi from '@/api/KeyManageApi'
import Axios from 'axios'
import CoolFileInput from '@/components/CoolFileInput.vue'
import UploadApi from '@/api/UploadApi'
export default {
    data () {
        return {
            view: 'form',
            columns: [{
                checkbox: true
            }, {
                field: 'id', title: 'id', align: 'center'
            }, {
                field: 'name', title: '菜品', align: 'center'
            },
            {
                field: 'epgChannelCode', title: '功能性', align: 'center'
            },
            {
                field: 'fee', title: '金额(单位:分)', align: 'center',
            },
            {
                field: 'epgName', title: '币种', align: 'center'
            },
            {
                field: 'epgLogo', title: '状态', align: 'center'
            },
            {
                field: 'epgLogo', title: '外部系统ID', align: 'center'
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

            editData: {},
            state: false,

            extensions: ['jpg', 'png', 'jpeg'],
            menuList: [],//菜单数据
            languageList: [],//语言
            active: true,
            activeSysIdx: '-1',//当前显示的语言
            monetyList: [],//钱
            cityicon: UploadApi.getUrl("image"),
        }
    },
    components: {
        CoolTable, Multiselect, CoolFileInput
    },
    computed: {
        tableData () {
            return this.menuList
        },
    },
    created () {
        this.getAllData()
    },
    methods: {
        nameWithLang ({ name, nameEn }) {
            return `${name}|${nameEn}`
        },
        activeNav (i, item) {
            this.activeSysIdx = i
        },
        //上架
        putaway () {
        },
        //下架
        soldout () {
        },
        checked (e) {
            this.getAllData(e.target.value)
        },
        //data
        async getAllData (val) {
            try {
                const language = await RoomReservationApi.getlanguage()
                this.languageList = language


                const menu = await RoomReservationApi.getBypage(val)
                this.menuList = menu.rows

                const monety = await RoomReservationApi.getAllMoney()
                this.monetyList = monety.list
                console.log(monety, 'monety')

            } catch (error) {
                console.log(error)
            }
        },
        // 新增
        addfile () {
            this.title = env.vendor + '菜品添加'
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
                if (this.editData.id) {
                    await ChanelManageApi.editepgApi(this.editData)
                    await this.$info('编辑成功')
                    await this.close()
                } else {
                    await ChanelManageApi.addepgApi(this.editData)
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
    width: 250px;
    word-wrap: break-word;
    word-break: normal;
}
::v-deep td {
    max-width: 400px;
}
::v-deep .col-sm-6 {
    padding-left: 0;
}

::v-deep #myTab {
    display: flex;
    justify-content: center;
}
</style>