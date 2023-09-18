<template>
    <div>
        <h4>图标管理</h4>
        <cool-table :columns="columns" :data="tableData" @edit-row="editTable">
            <select class="form-control selectSty" v-model="languageSeled">
                <option value="">全部语言</option>
                <option
                    v-for="item in language"
                    :key="item.langId"
                    :value="item.langId"
                >
                    {{ item.langLabel }}
                </option>
            </select>
            <button
                style="float: left"
                class="btn btn-secondary ml-1"
                @click="backtable"
            >
                返回上一级
            </button>
        </cool-table>
        <div v-if="sample_modal">
            <div class="modal" v-on:click.self="backedit">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">修改图标地址</h4>
                            <button
                                type="button"
                                class="close"
                                v-on:click="backedit"
                            >
                                ×
                            </button>
                        </div>
                        <div class="modal-body">
                            <cool-file-input
                                v-model="iconUrl"
                                :uploadUrl="cityicon"
                                fileType="image"
                                :extensions="extensions"
                            ></cool-file-input>
                        </div>
                        <div class="modal-footer">
                            <button
                                type="button"
                                @click="ensure"
                                class="btn btn-primary"
                            >
                                确定修改
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-backdrop show"></div>
        </div>
    </div>
</template>

<script>
import GardenWeatherCityApi from '@/api/GardenWeatherCityApi'
import CoolFileInput from '@/components/CoolFileInput.vue'
import UploadApi from '@/api/UploadApi'
import CoolTable from '@/components/CoolTable.vue'
export default {
    props: {
        iconlist: {
            type: Array,
            defalut: []
        },
    },
    data () {
        return {
            extensions: ['jpg', 'png', 'jpeg'],
            cityicon: UploadApi.getUrl("image"),
            sample_modal: false,
            languageSeled: '',//选中的语言
            extensions: ['jpg', 'png', 'jpeg'],
            iconmanagerlist: [],//全部数据
            language: [],//语言数据
            gardenlsit: [],//园区数据
            citylist: [],//城市列表
            pictureList: [],//图片合集
            uploadPic: UploadApi.getUrl('image'),
            iconUrl: '',
            editData: null,
            columns: [ {
                field: 'id', title: 'ID', align: 'center'
            }, {
                field: 'hotelId', title: '酒店', align: 'center',
                formatter: val => {
                    let data = this.gardenlsit.find(item => item.hotelId == val).hotelName
                    return data
                }
            },
            {
                field: 'icon', title: '图片地址', align: 'center',
                formatter: val => {
                    return `<div class="center">${val}</div>`
                }
            },
            {
                field: 'langId', title: '语言', align: 'center',
                formatter: val => {
                    let data = this.language.find(item => item.langId == val).langLabel
                    return data
                }
            },
            {
                field: 'id', title: '操作', align: 'center',
                formatter: (val) => {
                    return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">修改</button>`
                }
            }
            ],
        }
    },
    components: {
        CoolFileInput, CoolTable
    },
    created () {
        this.getlanguage()
    },
    computed: {
        tableData () {
            return this.iconmanagerlist.filter(item => {
                return this.languageSeled !== '' ? item.langId == this.languageSeled : true
            })
        }
    },
    methods: {
        //关闭后清空数据
        backedit () {
            this.iconUrl = ''
            this.sample_modal = false
        },
        //返回首页
        backtable () {
            this.$emit('backtable')
        },
        editTable (id) {
            this.sample_modal = true
            this.iconUrl = this.iconmanagerlist.find(item => item.id == id).icon
            //编辑的内容
            this.editData = this.iconmanagerlist.filter(item => item.id == id)[0]
        },
        // 确定
        async ensure () {
            try {
                // console.log({ ...this.editData, icon: this.iconUrl })
                const data = await GardenWeatherCityApi.updatemanager({ ...this.editData, icon: this.iconUrl })
                // console.log(data)
                await this.$info('修改成功')
                this.sample_modal = false
                this.getlanguage()
            } catch (error) {
                console.log(error)
            }
        },
        async getlanguage () {
            try {
                const data = await GardenWeatherCityApi.language()//获取语言
                // console.log(data)
                this.language = data
                const data1 = await GardenWeatherCityApi.getHotelListApi()//获取园区
                this.gardenlsit = data1
                // console.log(data1)
                const data2 = await GardenWeatherCityApi.getcity()//获取城市
                // console.log(data2)
                this.citylist = data2
                const iconmanager = await GardenWeatherCityApi.iconmanager({ ids: this.iconlist })
                // console.log(iconmanager, 'icon')
                this.iconmanagerlist = iconmanager
                this.pictureList = this.iconmanagerlist.map(item => item.icon)
            } catch (error) {
                console.log(error)
            }
        }
    },
}
</script>

<style lang="scss" scoped>
/* 让模态框显示 */
.modal {
    display: block;
}
::v-deep .modal-dialog {
    max-width: 70%;
    margin: 1.75rem auto;
}
/* 如果不使用vue的transition的话可以不设置 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
::v-deep .center {
    display: block;
    justify-content: center;
    align-items: center;
    word-wrap: break-word;
    word-break: normal;
}
td {
    text-align: center;
    vertical-align: middle;
}
::v-deep .selectSty {
    width: 45%;
    float: left;
}
</style>