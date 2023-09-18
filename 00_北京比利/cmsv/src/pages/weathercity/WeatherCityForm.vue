<template>
    <div class="col-sm-6 mr-top">
        <vo v-slot="{ handleSubmit }" v-if="view == 'form'">
            <form novalidate @submit.prevent="handleSubmit(submit)">
                <vp class="form-group" tag="div" v-slot="v">
                    <label class="label-class">ID</label>
                    <div class="input-class">
                        <input
                            disabled
                            class="form-control"
                            type="text"
                            v-model="city.cityId"
                        />
                    </div>
                </vp>
                <vp class="form-group" tag="div" v-slot="v">
                    <label class="label-class">城市名称(*)</label>
                    <div class="input-class">
                        <input
                            @focus="sample_modal = true"
                            class="form-control"
                            type="text"
                            v-model="language"
                            v-validate="v"
                            required
                        />
                    </div>
                </vp>
                <!-- 城市CODE -->
                <vp class="form-group" tag="div" v-slot="v">
                    <label class="label-class">城市CODE(*)</label>
                    <div class="input-class">
                        <input
                            v-model="city.cityCode"
                            class="form-control"
                            type="text"
                            v-validate="v"
                            required
                        />
                    </div>
                </vp>
                <!-- 城市级别 -->
                <vp class="form-group" tag="div" v-slot="v">
                    <label class="label-class">城市级别(*)</label>
                    <div class="input-class">
                        <select class="form-control" v-model="city.cityLevel">
                            <option value="0">国外城市</option>
                            <option value="1">普通城市</option>
                            <option value="2">省会城市</option>
                            <option value="3">直辖市</option>
                            <option value="4">港澳台</option>
                        </select>
                    </div>
                </vp>
                <!-- 区域中文名称 -->
                <vp class="form-group" tag="div" v-slot="v">
                    <label class="label-class">区域中文名称(*)</label>
                    <div class="input-class">
                        <input
                            v-model="city.area"
                            class="form-control"
                            type="text"
                            v-validate="v"
                            required
                        />
                    </div>
                </vp>
                <!-- 区域英文名称 -->
                <vp class="form-group" tag="div" v-slot="v">
                    <label class="label-class">区域英文名称(*)</label>
                    <div class="input-class">
                        <input
                            v-model="city.areaEn"
                            class="form-control"
                            type="text"
                            v-validate="v"
                            required
                        />
                    </div>
                </vp>
                <!-- 省中文名称 -->
                <vp class="form-group" tag="div" v-slot="v">
                    <label class="label-class">省中文名称(*)</label>
                    <div class="input-class">
                        <input
                            v-model="city.province"
                            class="form-control"
                            type="text"
                            v-validate="v"
                            required
                        />
                    </div>
                </vp>
                <!-- 省英文名称 -->
                <vp class="form-group" tag="div" v-slot="v">
                    <label class="label-class">省英文名称(*)</label>
                    <div class="input-class">
                        <input
                            v-model="city.provinceEn"
                            class="form-control"
                            type="text"
                            v-validate="v"
                            required
                        />
                    </div>
                </vp>
                <!-- 国家中文名称 -->
                <vp class="form-group" tag="div" v-slot="v">
                    <label class="label-class">国家中文名称(*)</label>
                    <div class="input-class">
                        <input
                            v-model="city.country"
                            class="form-control"
                            type="text"
                            v-validate="v"
                            required
                        />
                    </div>
                </vp>
                <!-- 国家英文名称 -->
                <vp class="form-group" tag="div" v-slot="v">
                    <label class="label-class">国家英文名称(*)</label>
                    <div class="input-class">
                        <input
                            v-model="city.countryEn"
                            class="form-control"
                            type="text"
                            v-validate="v"
                            required
                        />
                    </div>
                </vp>
                <!-- 是否启用 -->
                <vp class="form-group" tag="div" v-slot="v">
                    <label class="label-class">是否启用(*)</label>
                    <div class="input-class">
                        <select class="form-control" v-model="city.enable">
                            <option value="1">启用</option>
                            <option value="0">禁用</option>
                        </select>
                    </div>
                </vp>
                <!-- 操作 -->
                <div class="form-group" style="margin-left: 25%">
                    <button type="submit" class="btn btn-dark">确定</button>
                    <!-- <button
                        type="button"
                        class="btn btn-dark ml-1"
                        :disabled="activeupdate"
                    >
                        激活更新
                    </button> -->
                    <!-- <button
                        type="button"
                        class="btn btn-dark ml-1"
                        :disabled="update"
                    >
                        更新
                    </button> -->
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
        <div v-if="sample_modal">
            <div class="modal" v-on:click.self="sample_modal = false">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">添加城市名称</h4>
                            <button
                                type="button"
                                class="close"
                                v-on:click="sample_modal = false"
                            >
                                ×
                            </button>
                        </div>
                        <div class="modal-body">
                            <div
                                class="mt-1"
                                v-for="item in languageall"
                                :key="item.langId"
                            >
                                <label class="label-class">{{
                                    item.langLabel
                                }}</label>
                                <div class="input-class">
                                    <input
                                        class="form-control"
                                        type="text"
                                        v-model="citymodel['l' + item.langId]"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-primary"
                                @click="citynameadd"
                            >
                                确定
                            </button>
                            <button
                                type="button"
                                class="btn btn-secondary"
                                @click="sample_modal = false"
                            >
                                取消
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
import WeatherCityApi from '@/api/WeatherCityApi'
import { stringify } from 'qs'
export default {
    data () {
        return {
            view: 'form',

            sample_modal: false,
            city: JSON.parse(JSON.stringify(this.editData)),//双向第一层编辑
            languageall: [],//全部语言

            language: JSON.parse(JSON.stringify(this.stringCityName)),//语言的使用

            inputlanguage: JSON.parse(JSON.stringify(this.stringCityName)),

            citymodel: JSON.parse(JSON.stringify(this.cityString)),//报存输入的城市
        }
    },
    props: {
        editData: {
            type: Object,
            default: () => ({})
        },
        allid: {
            type: Array,
            default: () => ([])
        },
        //城市名称
        cityString: {
            type: Object,
            default: () => { }
        },
        //城市名string
        stringCityName: {
            type: String,
            required: false
        }
    },
    created () {
        this.getLanguage()
    },
    methods: {
        //城市名称集合
        citynameadd () {
            let string = ''
            for (let key in this.citymodel) {

                if (this.citymodel[key] !== '' && this.citymodel[key] !== null && key !== 'id') {
                    string += this.citymodel[key] + '|'
                }
            }
            string = string.substring(0, string.lastIndexOf('|'))
            this.language = string
            this.sample_modal = false
        },
        //获取全部语言
        async getLanguage () {
            try {
                const data = await WeatherCityApi.getlanguageAll()
                this.languageall = data
            } catch (error) {
                console.log(error)
            }
        },
        close () {
            this.$emit('close', 'table')
        },
        async submit () {
            let obj = {}
            for (let key in this.languageall) {
                obj['l' + key] = ''
            }
            // console.log(obj)
            try {
                // console.log(this.city.cityId, 'didfsa')
                if (this.city.cityId !== undefined) {
                    // console.log('编辑', { city: { ...this.city, cityName: this.inputlanguage }, cmsString: { ...this.language, id: this.city.nameId } })
                    const data = await WeatherCityApi.editWeather({ city: { ...this.city, cityName: this.language }, cmsString: { ...obj,...this.citymodel, id: this.city.nameId } })
                    await this.$info('编辑成功')
                    this.$emit('close', 'table')
                } else {
                    // console.log('新增', { city: { ...this.city, cityId: '', cityName: this.inputlanguage }, cmsString: this.language })
                    const data = await WeatherCityApi.addWeather({ city: { ...this.city, cityId: '', cityName: this.language }, cmsString: { ...obj, ...this.citymodel } })
                    await this.$info('新增成功')
                    this.$emit('close', 'table')
                }
            } catch (error) {
                console.log(error)
                this.$error('操作失败')
            }

        },
    }
}
</script>

<style lang="scss" scoped>
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
.mr-top {
    margin-top: 4%;
}
/* 让模态框显示 */
.modal {
    display: block;
}
.modal-title {
    margin-bottom: 0;
    line-height: 0.5;
    font-size: 24px;
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
::v-deep .modal-dialog {
    max-width: 80%;
    min-width: 600px;
}
::v-deep .modal-body {
    padding: 1rem 3rem 0rem 0rem;
}
::v-deep .modal {
    overflow: auto;
}
::v-deep .modal-footer {
    border-top: 0;
}
</style>