<template>
    <div
        class="container-fluid"
        style="overflow: auto; width: 100%; height: 100%"
    >
        <!-- <div class="row"> -->
        <div class="col-12"></div>
        <div class="col-12" v-if="view === 'table'">
            <h2>{{ vendor }}天气城市列表</h2>
            <div class="card">
                <div class="card-header">查询条件</div>
                <div class="card-body row">
                    <div class="col-4 mb-3">
                        <label class="col-sm-4"> 城市名称 </label>
                        <div class="col-sm-8" style="display: inline-block">
                            <input
                                type="text"
                                class="form-control"
                                v-model="cityname"
                            />
                        </div>
                    </div>
                    <div class="col-4">
                        <label class="col-sm-4"> {{ vendor }}名称 </label>
                        <div class="col-sm-8" style="display: inline-block">
                            <input
                                type="text"
                                class="form-control"
                                v-model="gardenname"
                            />
                        </div>
                    </div>
                    <div class="col-4">
                        <label class="col-sm-4"> 语言 </label>
                        <div class="col-sm-8" style="display: inline-block">
                            <select v-model="languange" class="form-control">
                                <option value="">全部</option>
                                <option
                                    v-for="item in languageList"
                                    :key="item.langId"
                                    :value="item.langId + 1"
                                >
                                    {{ item.langLabel }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="col-4">
                        <label class="col-sm-4"> 城市类型 </label>
                        <div class="col-sm-8" style="display: inline-block">
                            <select v-model="citycode" class="form-control">
                                <!--  v-model="citylevel" -->
                                <option value="">全部</option>
                                <option value="0">国外</option>
                                <option value="1">国内</option>
                                <!-- <option value="2">省会城市</option>
                                <option value="3">直辖市</option>
                                <option value="4">港澳台</option> -->
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <cool-table
                @edit-row="editTable"
                @del-row="delMessage"
                ref="messageTable"
                :columns="columns"
                :data="tableData"
            >
                <!-- <button class="btn btn-info" @click="multiStart">启用</button>
                <button class="btn btn-secondary ml-1" @click="multiStop">
                    禁用
                </button> -->
                <button class="btn btn-primary ml-1" @click="addfile">
                    添加
                </button>
                <button class="btn btn-danger ml-1" @click="delMessages">
                    删除
                </button>
                <button class="btn btn-info ml-1" @click="iconmanager">
                    图标管理
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
                                    v-model="editData.id"
                                    disabled
                                    class="form-control"
                                    type="text"
                                />
                            </div>
                        </vp>
                        <!-- 园区名称 -->
                        <vp
                            class="form-group"
                            style="margin-top: 4%"
                            tag="div"
                            v-slot="v"
                            rules="required"
                            name="园区名称"
                        >
                            <label class="label-class"
                                >{{ vendor }}名称(*)</label
                            >
                            <div class="input-class">
                                <multiselect
                                    v-requiredSty="v"
                                    :searchable="true"
                                    v-model="gardenseled"
                                    :options="hotelList"
                                    placeholder="请选择"
                                    label="hotelName"
                                    track-by="hotelId"
                                ></multiselect>
                                <span class="err">{{ v.errors[0] }}</span>
                            </div>
                        </vp>
                        <!-- 城市名称 -->
                        <vp
                            class="form-group"
                            style="margin-top: 4%"
                            tag="div"
                            v-slot="v"
                            rules="required"
                            name="城市名称"
                        >
                            <label class="label-class">城市名称(*)</label>
                            <div class="input-class">
                                <multiselect
                                    v-requiredSty="v"
                                    :searchable="true"
                                    v-model="citynameSeled"
                                    :options="citylist"
                                    placeholder="请选择"
                                    label="cityName"
                                    track-by="cityId"
                                ></multiselect>
                                <span class="err">{{ v.errors[0] }}</span>
                            </div>
                        </vp>
                        <!-- 语言 -->
                        <vp
                            class="form-group"
                            style="margin-top: 4%"
                            tag="div"
                            v-slot="v"
                            rules="required"
                            name="语言"
                        >
                            <label class="label-class">语言(*)</label>
                            <div class="input-class">
                                <multiselect
                                    v-requiredSty="v"
                                    required
                                    :searchable="true"
                                    v-model="languageseled"
                                    :options="languageList"
                                    placeholder="请选择"
                                    label="langLabel"
                                    track-by="langLabel"
                                ></multiselect>
                                <span class="err">{{ v.errors[0] }}</span>
                            </div>
                        </vp>
                        <!-- 城市CODE -->
                        <vp
                            class="form-group"
                            style="margin-top: 4%"
                            tag="div"
                            v-slot="v"
                        >
                            <label class="label-class">城市CODE(*)</label>
                            <div class="input-class">
                                <label class="mr-3">
                                    <input
                                        v-model="editData.isDomestic"
                                        type="radio"
                                        name="radiobutton"
                                        value="1"
                                        checked
                                    />&nbsp;是
                                </label>
                                <label>
                                    <input
                                        v-model="editData.isDomestic"
                                        type="radio"
                                        name="radiobutton"
                                        value="0"
                                    />&nbsp;否
                                </label>
                            </div>
                        </vp>
                        <!-- 排序(*) -->
                        <vp
                            class="form-group"
                            style="margin-top: 4%"
                            tag="div"
                            v-slot="v"
                            name="排序"
                        >
                            <label class="label-class">排序(*)</label>
                            <div class="input-class">
                                <input
                                    v-model="editData.sort"
                                    class="form-control"
                                    type="number"
                                    placeholder="请输入数字"
                                    v-validate="v"
                                    required
                                />
                                <span class="err">{{ v.errors[0] }}</span>
                            </div>
                        </vp>
                        <!-- 城市图标 -->
                        <vp
                            style="margin-top: 4%"
                            class="form-group center-style"
                            tag="div"
                            v-slot="v"
                            rules="required"
                            name="城市图标"
                        >
                            <label class="label-class">城市图标(*)</label>
                            <div class="input-class">
                                <cool-file-input
                                    v-model="editData.icon"
                                    :uploadUrl="cityicon"
                                    fileType="image"
                                    v-requiredSty="v"
                                    required
                                    :extensions="extensions"
                                ></cool-file-input>
                                <span class="err">{{ v.errors[0] }}</span>
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
        <div v-if="view == 'iconmangger'">
            <garden-weather-city-talbe :iconlist="geticon" @backtable="close" />
        </div>
    </div>
</template>
<script>
import GardenWeatherCityApi from '@/api/GardenWeatherCityApi'
import CoolTable from '@/components/CoolTable.vue'
import env from '@/env'
import CoolFileInput from '@/components/CoolFileInput.vue'
import UploadApi from '@/api/UploadApi'
import Multiselect from 'vue-multiselect'
import GardenWeatherCityTalbe from './GardenWeatherCityTable.vue'
export default {
    data () {
        return {
            languageList: [],
            citylist: [],
            hotelList: [],

            citynameSeled: null,//城市名称
            gardenseled: null,//园区名称
            languageseled: null,//语言

            vendor: env.vendor,
            extensions: ['jpg', 'png', 'jpeg'],
            view: 'table',
            tableList: [],
            model: {},
            cityicon: UploadApi.getUrl("image"),

            citycode: '',//代码
            cityname: '',//中文名称
            gardenname: '',//园区名称
            languange: '',//语言

            countryen: '',//国家名称
            columns: [{
                checkbox: true
            }, {
                field: 'id', title: 'ID', align: 'center'
            }, {
                field: 'cityName', title: '城市名称', align: 'center'
            },
            {
                field: 'cityId', title: '城市ID', align: 'center'
            },
            {
                field: 'hotelName', title: `${env.vendor}名称`, align: 'center'
            },
            {
                field: 'hotelId', title: `${env.vendor}ID`, align: 'center'
            },
            {
                field: 'langId', title: '语言', align: 'center',
                formatter: val => {
                    const data = this.languageList.find(item => item.langId == val)
                    if (!data) {
                        return '-'
                    }
                    return data.langLabel
                }
            },
            {
                field: 'isDomestic', title: '城市类型', align: 'center',
                formatter: (val) => {
                    return val == '0' ? '国外' : '国内'
                }
            },
            {
                field: 'id', title: '操作', align: 'center',
                width: 300,
                formatter: (val, row, idx) => {
                    return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">修改</button>
                      <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row" >删除</button>`
                }
            }
            ],
            cityString: {},
            stringCityName: "",//城市名称string
            editData: {}
        }
    },
    computed: {
        tableData () {
            let gardenname = RegExp(this.gardenname, 'ig')
            let cityname = RegExp(this.cityname, 'ig')

            return this.tableList.filter(item => {
                return this.citycode == '' ? true : this.citycode == item.isDomestic
            }).filter(item => {
                return this.gardenname == '' ? true : gardenname.test(item.hotelName)
            }).filter(item => {
                return this.cityname == '' ? true : cityname.test(item.cityName)
            }).filter(item => {
                return this.languange == '' ? true : this.languange == item.langId + 1
            })
        },
        //icon 的id 数组
        geticon () {
            return this.tableList.map(item => item.id)
        }
    },
    created () {
        this.getHoteLangList()
    },
    methods: {
        //图标管理
        iconmanager () {
            this.view = 'iconmangger'
        },
        //添加
        addfile () {
            this.editData.isDomestic = 1
            this.view = 'form'
        },
        async submit () {
            try {
                // console.log('检验通过')
                //this.cityicon icon: this.cityicon,

                if (this.editData.id) {
                    // console.log(55)
                    let dataDat = { ...this.editData, cityId: this.citynameSeled.cityId, hotelId: this.gardenseled.hotelId, langId: this.languageseled.langId }
                    delete dataDat.iconEn
                    delete dataDat.limit
                    delete dataDat.offset

                    const data = await GardenWeatherCityApi.updateHotel(dataDat)
                    this.$info('修改成功')
                } else {
                    //新增
                    // this.cityicon  icon: this.cityicon,
                    const data = await GardenWeatherCityApi.addFormData({ ...this.editData, cityId: this.citynameSeled.cityId, id: '', hotelId: this.gardenseled.hotelId, langId: this.languageseled.langId })
                    await this.$info('新增成功')
                    this.view = 'table'
                }
                await this.close()
            } catch (error) {
                console.log(error)
                if (error == '数据库表中已经存在') {
                    this.close()
                }
                this.$error(error)
            }
        },
        //获取数据
        async getHoteLangList () {
            try {
                const data3 = await GardenWeatherCityApi.getHotelListApi()
                this.hotelList = data3
                const data2 = await GardenWeatherCityApi.getcity()
                this.citylist = data2
                const data1 = await GardenWeatherCityApi.language()
                this.languageList = data1
                const data = await GardenWeatherCityApi.getHotelLangList()
                this.tableList = data.rows

            } catch (error) {
                console.log(error)

            }
        },
        //关闭
        close (val) {
            this.citynameSeled = null
            this.gardenseled = null
            this.languageseled = null
            this.editData = {}
            this.getHoteLangList()
            this.view = 'table'
        },
        // 点击添加
        addnotice () {
            this.model = {}
        },
        //修改按钮
        editTable (val) {
            let data = this.tableList.find(item => item.id == val)
            if (data == undefined) return
            this.gardenseled = this.hotelList.find(item => item.hotelId == data.hotelId)
            this.citynameSeled = this.citylist.find(item => item.cityId == data.cityId)
            this.languageseled = this.languageList.find(item => item.langId == data.langId)
            this.editData = JSON.parse(JSON.stringify(data))
            this.view = 'form'
        },
        // // 删除单个
        async delMessage (id) {
            try {
                const ok = await this.$confirm('确定删除此项吗？')
                if (!ok) {
                    return
                }
                await GardenWeatherCityApi.deltelHotel({ idList: [id] })
                await this.$info('删除成功')
                this.getHoteLangList()
            } catch (error) {
                console.error(error)
                this.$error('删除失败')
            }
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
                await GardenWeatherCityApi.deltelHotel({ idList: selections.map(v => v.id) })
                await this.$info('删除成功')
                this.getHoteLangList()
            } catch (error) {
                console.error(error)
                this.$error('删除失败')
            }
        },
    },
    components: {
        CoolTable, CoolFileInput, Multiselect, GardenWeatherCityTalbe
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
::v-deep .is-invalid {
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