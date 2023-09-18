<template>
    <div
        class="container-fluid"
        style="overflow: auto; width: 100%; height: 100%"
    >
        <!-- <div class="row"> -->
        <div class="col-12"></div>
        <div class="col-12" v-if="view === 'table'">
            <h2>天气城市列表</h2>
            <div class="card">
                <div class="card-header">查询条件</div>
                <div class="card-body row">
                    <div class="col-4 mb-3">
                        <label class="col-sm-4"> 中文名称 </label>
                        <div class="col-sm-8" style="display: inline-block">
                            <input
                                type="text"
                                class="form-control"
                                v-model="cityname"
                            />
                        </div>
                    </div>
                    <div class="col-4">
                        <label class="col-sm-4"> 英文名称 </label>
                        <div class="col-sm-8" style="display: inline-block">
                            <input
                                type="text"
                                class="form-control"
                                v-model="citynameen"
                            />
                        </div>
                    </div>
                    <div class="col-4">
                        <label class="col-sm-4"> 城市级别 </label>
                        <div class="col-sm-8" style="display: inline-block">
                            <select v-model="citylevel" class="form-control">
                                <!--  v-model="citylevel" -->
                                <option value="">全部</option>
                                <option value="0">国外城市</option>
                                <option value="1">普通城市</option>
                                <option value="2">省会城市</option>
                                <option value="3">直辖市</option>
                                <option value="4">港澳台</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-4">
                        <label class="col-sm-4"> 国家名称 </label>
                        <div class="col-sm-8" style="display: inline-block">
                            <input
                                type="text"
                                class="form-control"
                                v-model="countryen"
                            />
                        </div>
                    </div>
                    <div class="col-4">
                        <label class="col-sm-4"> 城市代码 </label>
                        <div class="col-sm-8" style="display: inline-block">
                            <input
                                type="text"
                                class="form-control"
                                v-model="citycode"
                            />
                        </div>
                    </div>
                    <!-- 状态 -->
                    <div class="col-4">
                        <label class="col-sm-4"> 状态 </label>
                        <div class="col-sm-8" style="display: inline-block">
                            <select class="form-control" v-model="citystate">
                                <option value="">全部</option>
                                <option value="1">启用</option>
                                <option value="0">禁用</option>
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
                <button class="btn btn-info" @click="multiStart">启用</button>
                <button class="btn btn-secondary ml-1" @click="multiStop">
                    禁用
                </button>
                <button class="btn btn-primary ml-1" @click="view = 'form'">
                    添加
                </button>
                <button class="btn btn-danger ml-1" @click="delMessages">
                    删除
                </button>
            </cool-table>
        </div>

        <div v-if="view == 'form'" class="centerbox">
            <weather-city-form
                @close="close"
                :editData="model"
                :cityString="cityString"
                :stringCityName="stringCityName"
            ></weather-city-form>
        </div>
    </div>
</template>

<script>
import WeatherCityApi from '@/api/WeatherCityApi'
import CoolTable from '@/components/CoolTable.vue'
import env from '@/env'
import WeatherCityForm from './WeatherCityForm.vue'
export default {
    data () {
        return {
            view: 'table',
            tableList: [],
            model: {
                cityLevel: 0, enable: 1
            },
            // searchcondititon: '',//搜索条件
            citylevel: '',//城市级别
            citystate: '',//状态+
            citycode: '',//代码
            citynameen: '',//英文名称
            cityname: '',//中文名称
            countryen: '',//国家名称
            columns: [{
                checkbox: true
            }, {
                field: 'cityId', title: 'cityId', align: 'center'
            }, {
                field: 'cityName', title: '中文名称', align: 'center'
            },
            {
                field: 'cityNameEn', title: '英文名称', align: 'center'
            },
            {
                field: 'cityCode', title: '城市代码', align: 'center'
            },
            {
                field: 'cityLevel', title: '城市级别', align: 'center',
                formatter: (val, row, idx) => {
                    let data
                    if (val == 0) {
                        return '国外城市'
                    } else if (val == 1) {
                        return '普通城市'
                    } else if (val == 2) {
                        return '省会城市'
                    } else if (val == 3) {
                        return '直辖市'
                    } else {
                        return '港澳台'
                    }
                }
            },
            {
                field: 'countryEn', title: '国家名称', align: 'center',
                formatter: (val, row, idx) => {
                    return `<p class="countent">${val}</p>`
                }
            },
            {
                field: 'enable', title: '状态', align: 'center',
                formatter: (val, row, idx) => {
                    let data
                    if (val == 0) {
                        data = '禁用'
                    } else {
                        data = '启用'
                    }
                    return data
                }
            },
            {
                field: 'cityId', title: '操作', align: 'center',
                width: 300,
                formatter: (val, row, idx) => {
                    return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">修改</button>
                      <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row" >删除</button>`
                }
            }
            ],
            cityString: {},
            stringCityName: "",//城市名称string
        }
    },
    computed: {
        tableData () {
            let citycode = RegExp(this.citycode, 'ig')
            let citynameen = RegExp(this.citynameen, 'ig')
            let cityname = RegExp(this.cityname, 'ig')
            let countryen = RegExp(this.countryen, 'ig')
            return this.tableList.filter(item => {
                return this.citylevel == '' ? true : item.cityLevel == this.citylevel
            }).filter(item => {
                return this.citystate == '' ? true : item.enable == this.citystate
            }).filter(item => {
                return this.citycode == '' ? true : citycode.test(item.cityCode)
            }).filter(item => {
                return this.citynameen == '' ? true : citynameen.test(item.cityNameEn)
            }).filter(item => {
                return this.cityname == '' ? true : cityname.test(item.cityName)
            }).filter(item => {
                return this.countryen == '' ? true : countryen.test(item.countryEn)
            })
        },
    },
    created () {
        this.getallData()
    },
    methods: {
        //多个启动
        async multiStart () {
            const select = this.$refs.messageTable.getSelections()
            try {
                if (select.length > 0) {
                    // console.log(select.map(item=>item.cityId), 'data,dafs')
                    const data = await WeatherCityApi.allStart({ enable: 1, idList: select.map(item => item.cityId) })
                    this.$info('启动成功')
                    this.getallData()
                }
            } catch (error) {
                console.log(error)
                this.$error('操作失败')
            }
        },
        //多个禁止
        async multiStop () {
            const select = this.$refs.messageTable.getSelections()
            try {
                if (select.length > 0) {
                    // console.log(99)
                    // console.log(select.map(item=>item.cityId), 'data,dafs')
                    const data = await WeatherCityApi.allStart({ enable: 0, idList: select.map(item => item.cityId) })
                    this.$info('禁用成功')
                    this.getallData()
                }
            } catch (error) {
                console.log(error)
                this.$error('操作失败')
            }
        },
        close (val) {
            this.model = {
                cityLevel: 0, enable: 1
            }
            this.cityString = {}
            this.stringCityName = ""
            this.getallData()
            this.view = val
        },
        //获取全部数据
        async getallData () {
            try {
                const data = await WeatherCityApi.getallCity()
                this.tableList = data.rows
            } catch (error) {
                console.log(error)
            }
        },
        // 点击添加
        addnotice () {
            this.model = {
                cityLevel: 0, enable: 1
            }
        },
        //修改按钮
        editTable (val) {
            this.model = this.tableData.filter(item => item.cityId === val)[0]
            WeatherCityApi.getcityName(val).then((data) => {
                for (let key in data.cmsString) {
                    if (key !== 'id' && data.cmsString[key] !== '' && data.cmsString[key] !== null) {
                        this.stringCityName += data.cmsString[key] + '|'
                    }
                }
                this.stringCityName = this.stringCityName.substring(0, this.stringCityName.lastIndexOf('|'))
                this.cityString = data.cmsString
            }).then(() => {
                this.view = 'form'
            })
        },
        // // 删除单个
        async delMessage (id) {
            try {
                const ok = await this.$confirm('删除')
                if (!ok) {
                    return
                }
                await WeatherCityApi.delListData({ idList: [id] })
                await this.$info('删除成功')
                this.getallData()
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
                const ok = await this.$confirm('删除')
                if (!ok) {
                    return
                }
                await WeatherCityApi.delListData({ idList: selections.map(v => v.cityId) })
                await this.$info('删除成功')
                this.getallData()
            } catch (error) {
                console.error(error)
                this.$error('删除失败')
            }
        },
    },
    components: {
        CoolTable, WeatherCityForm
    },
}
</script>

<style lang="scss" scoped>
::v-deep td {
    max-width: 300px;
}
// ::v-deep td {
//     max-width: 300px;
// }
// .mr-top {
//     margin-top: 1%;
// }
label {
    font-size: 15px;
}
.centerbox {
    display: flex;
    // justify-items: center;
    justify-content: center;
}
</style>