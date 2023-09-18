<template>
    <div>
        <div v-if="view == 'table'">
            <div class="card mt-1">
                <div class="card-header">查询条件</div>
                <div class="card-body row">
                    <div class="col-4 mb-3">
                        <label class="col-sm-4"> 按键名称 </label>
                        <div class="col-sm-8" style="display: inline-block">
                            <input
                                type="text"
                                class="form-control"
                                v-model="keyName"
                            />
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
                <button class="btn btn-primary ml-1" @click="view = 'form'">
                    添加
                </button>
                <button class="btn btn-danger ml-1" @click="delMessages">
                    删除
                </button>
                <button class="btn btn-dark ml-1" @click="callback">
                    返回
                </button>
            </cool-table>
        </div>
        <div v-if="view == 'form'" class="centerbox mt-3">
            <div class="col-sm-6 mr-top">
                <vo v-slot="{ handleSubmit }" v-if="view == 'form'">
                    <form novalidate @submit.prevent="handleSubmit(submit)">
                        <vp
                            v-if="model.id"
                            class="form-group"
                            tag="div"
                            v-slot="v"
                        >
                            <label class="label-class">ID</label>
                            <div class="input-class">
                                <input
                                    disabled
                                    class="form-control"
                                    type="text"
                                    v-model="model.id"
                                />
                            </div>
                        </vp>
                        <vp class="form-group" tag="div" v-slot="v">
                            <label class="label-class">按键名称</label>
                            <div class="input-class">
                                <input
                                    class="form-control"
                                    type="text"
                                    v-model="model.keyName"
                                    v-validate="v"
                                    required
                                />
                            </div>
                        </vp>
                        <vp class="form-group" tag="div" v-slot="v">
                            <label class="label-class">多语言名称</label>
                            <div class="input-class">
                                <input
                                    class="form-control"
                                    @focus="sample_modal = true"
                                    v-model="stringCityName"
                                    type="text"
                                    v-validate="v"
                                    required
                                />
                            </div>
                        </vp>

                        <!-- 操作 -->
                        <div class="form-group" style="margin-left: 25%">
                            <button type="submit" class="btn-primary btn">
                                确定
                            </button>
                            <button
                                class="btn-secondary btn ml-1"
                                @click="closeform"
                            >
                                返回
                            </button>
                        </div>
                    </form>
                </vo>
            </div>

            <!-- 弹框 -->
            <div
                v-if="sample_modal"
                style="height:100%,width:100%,overflow:auto"
            >
                <div class="modal" v-on:click.self="sample_modal = false">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">多语言名称</h4>
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
                                    v-for="item in languageList"
                                    :key="item.langId"
                                >
                                    <label class="label-class">{{
                                        item.langLabel
                                    }}</label>
                                    <div class="input-class">
                                        <input
                                            class="form-control"
                                            type="text"
                                            v-model="
                                                language['l' + item.langId]
                                            "
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button
                                    type="button"
                                    class="btn btn-primary"
                                    @click="addlanguage"
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
    </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import KeyManageApi from '@/api/KeyManageApi'
export default {
    components: {
        CoolTable,
    },
    data () {
        return {
            view: 'table',
            sample_modal: false,
            keyName: '',//keyname
            columns: [{
                checkbox: true
            }, {
                field: 'key.id', title: 'ID', align: 'center'
            }, {
                field: 'key.keyName', title: '按键', align: 'center'
            },
            {
                field: 'key.labelCn', title: '中文名', align: 'center'
            },
            {
                field: 'key.labelEn', title: '英文名', align: 'center'
            },
            {
                field: 'key.id', title: '操作', align: 'center',
                width: 300,
                formatter: (val, row, idx) => {
                    return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">修改</button>
                      <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row" >删除</button>`
                }
            }
            ],
            model: {},
            cityString: {},
            keylist: [],
            languageList: [],//语言包
            language: {},//双向绑定语言
            stringCityName: '',//字符串城市
        }
    },
    computed: {
        tableData () {
            let keyname = RegExp(this.keyName, 'ig')
            return this.keylist.filter(item => {
                return this.keyName == '' ? true : keyname.test(item.key.keyName)
            })
        },
    },
    created () {
        this.getkeylistApi()
        this.getlanguage()
    },
    methods: {
        //新增或者修改提交
        async submit () {
            try {
                let obj = {}
                for (let langlist in this.languageList) {
                    obj['l' + langlist] = ''
                }
                console.log(this.model.id, 'id')
                if (this.model.id !== undefined) {
                    console.log('修改')
                    const data = await KeyManageApi.deitkey({ key: { ...this.model, labelEn: this.language.l1, labelCn: this.language.l0 }, name: { ...obj, ...this.language } })
                    await this.$info('修改成功')
                } else {
                    console.log('新增')
                    const data = await KeyManageApi.addkey({ key: { ...this.model, labelEn: this.language.l1, labelCn: this.language.l0 }, name: { ...obj, ...this.language } })
                    await this.$info('新增成功')
                }
                this.closeform()

            } catch (error) {
                console.log(error)
                this.$error("操作失败")
            }
        },
        //确定赋值给input框
        addlanguage () {
            let string = ''
            for (let key in this.language) {
                if (key !== 'id' && this.language[key] !== null && this.language[key] !== '') {
                    string += this.language[key] + '|'
                }
            }
            string = string.substring(0, string.lastIndexOf('|'))
            this.stringCityName = string
            this.sample_modal = false
        },
        //语言
        async getlanguage () {
            try {
                const data = await KeyManageApi.getlanguage()
                this.languageList = data
            } catch (error) {
                console.log(error)
            }
        },
        //按键key
        async getkeylistApi () {
            try {
                const data = await KeyManageApi.getbasicsKeyList()
                this.keylist = data.rows
            } catch (error) {
                console.log(error)
                this.$error('获取数据失败')
            }
        },
        //返回按钮
        closeform () {
            this.model = {}
            this.stringCityName = ''
            this.language = {}

            this.getkeylistApi()
            this.view = 'table'

        },
        //返回上一级talbe
        callback () {
            this.$emit('close')
        },
        // 点击添加
        addnotice () {
            this.model = {}
        },
        //修改按钮
        editTable (val) {
            KeyManageApi.geteditdata(val).then(data => {
                this.model = JSON.parse(JSON.stringify(data.key))
                this.language = JSON.parse(JSON.stringify(data.name))
                let string = ''
                for (let key in data.name) {
                    if (key !== 'id' && data.name[key] !== '' && data.name[key] !== null) {
                        string += data.name[key] + '|'
                    }
                }
                string = string.substring(0, string.lastIndexOf('|'))
                this.stringCityName = string
            })
            this.view = 'form'
        },
        // 删除单个
        async delMessage (id) {
            try {
                const ok = await this.$confirm(`确定删除id为${id}的基础按键吗？`)
                if (!ok) return
                await KeyManageApi.deletekey(id)
                await this.$info('删除成功')
                this.getkeylistApi()
            } catch (error) {
                console.error(error)
                this.$error('删除失败')
            }
        },
        // 删除多个
        async delMessages () {
            const selections = this.$refs.messageTable.getSelections()
            if (selections.length === 0) return
            try {
                const ok = await this.$confirm('删除')
                if (!ok) return
                await KeyManageApi.deletAllkey({ idList: selections.map(v => v.key.id) })
                await this.$info('删除成功')
                this.getkeylistApi()
            } catch (error) {
                console.error(error)
                this.$error('删除失败')
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.centerbox {
    display: flex;
    // justify-items: center;
    justify-content: center;
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
</style>