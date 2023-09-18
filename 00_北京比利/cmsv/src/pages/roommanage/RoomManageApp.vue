<template>
    <div
        class="container-fluid"
        style="overflow: auto; width: 100%; height: 100%"
    >
        <div class="col-12" v-if="view === 'table'">
            <h2>{{ vendor }}客房管理</h2>
            <div class="card">
                <div class="card-header">查询条件</div>
                <div class="card-body row">
                    <div class="col-4 mb-3">
                        <label class="col-sm-4"> 房间id </label>
                        <div class="col-sm-8" style="display: inline-block">
                            <input
                                type="text"
                                v-model="roomid"
                                class="form-control"
                            />
                        </div>
                    </div>
                    <div class="col-4">
                        <label class="col-sm-4"> 房间号 </label>
                        <div class="col-sm-8" style="display: inline-block">
                            <input
                                type="text"
                                v-model="roomNumber"
                                class="form-control"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <cool-table
                @row-editor="editor"
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
            </cool-table>
        </div>

        <div v-if="view == 'form'" class="centerbox">
            <div class="col-sm-6 mr-top">
                <vo v-slot="{ handleSubmit }" v-if="view == 'form'">
                    <form novalidate @submit.prevent="handleSubmit(submit)">
                        <!-- id -->
                        <vp
                            class="form-group"
                            tag="div"
                            v-slot="v"
                            v-if="model.cmsHotelRoom.roomId"
                        >
                            <label class="label-class">ID</label>
                            <div class="input-class">
                                <input
                                    v-model="model.cmsHotelRoom.roomId"
                                    disabled
                                    class="form-control"
                                    type="text"
                                />
                            </div>
                        </vp>
                        <!-- 房间号 -->
                        <vp
                            class="form-group"
                            style="margin-top: 4%"
                            tag="div"
                            v-slot="v"
                            rules="required|max:50"
                            name="房间号"
                        >
                            <label class="label-class">房间号</label>
                            <div class="input-class">
                                <input
                                    v-model="model.cmsHotelRoom.roomNumber"
                                    class="form-control"
                                    type="text"
                                    v-validate="v"
                                    required
                                />
                                <span class="err">{{ v.errors[0] }}</span>
                            </div>
                        </vp>
                        <!-- 区域英文名称 -->
                        <vp
                            class="form-group"
                            style="margin-top: 4%"
                            tag="div"
                            v-slot="v"
                        >
                            <label class="label-class">客房电话</label>
                            <div class="input-class">
                                <input
                                    v-model="model.cmsHotelRoom.phone"
                                    class="form-control"
                                    type="text"
                                    maxlength="20"
                                    v-validate="v"
                                />
                                <span class="err">{{ v.errors[0] }}</span>
                            </div>
                        </vp>
                        <!-- 区域类型 -->
                        <!-- <vp
                            class="form-group"
                            style="margin-top: 4%"
                            tag="div"
                            v-slot="v"
                            name="语言"
                        >
                            <label class="label-class">区域类型(*)</label>
                            <div class="input-class">
                                <select
                                    class="form-control"
                                    v-model="model.type"
                                    v-validate="v"
                                    required
                                >
                                    <option value="0">省</option>
                                    <option value="1">国家</option>
                                    <option value="2">洲</option>
                                    <option value="3">其他</option>
                                </select>
                                <span class="err">{{ v.errors[0] }}</span>
                            </div>
                        </vp> -->
                        <!-- 区域热度 -->
                        <!-- <vp
                            class="form-group"
                            style="margin-top: 4%"
                            tag="div"
                            v-slot="v"
                        >
                            <label class="label-class">区域热度</label>
                            <div class="input-class">
                                <input
                                    v-model="model.hot"
                                    class="form-control"
                                    type="number"
                                    max="1000"
                                    min="0"
                                    value="0"
                                    placeholder="请输入数字"
                                    v-validate="v"
                                    required
                                />
                            </div>
                        </vp> -->
                        <!-- 操作 -->
                        <div class="form-group mt-4" style="margin-left: 25%">
                            <button type="submit" class="btn btn-dark">
                                {{ button }}
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
</template>
<script>
import AreaManageModuleApi from '@/api/AreaManageModuleApi'
import RoomManageApi from '@/api/RoomManageApi'
import CoolTable from '@/components/CoolTable.vue'
import env from '@/env'
export default {
    data () {
        return {
            vendor: env.vendor,

            roomid: '',
            roomNumber: '',

            model: {},
            view: 'table',
            tableList: [],
            columns: [{
                checkbox: true
            }, {
                field: 'cmsHotelRoom.roomId', title: '房间id', align: 'center'
            }, {
                field: 'cmsHotelRoom.roomNumber', title: '房间号', align: 'center'
            },
            {
                field: 'cmsHotelRoom.hotelId', title: '酒店id', align: 'center'
            },
            {
                field: 'cmsHotelRoom.phone', title: '电话', align: 'center'
            },
            {
                field: 'devices.length', title: '设备总数', align: 'center'
            },
            {
                field: 'cmsHotelRoom.roomId', title: '操作', align: 'center',
                formatter: (val, row, idx) => {
                    return `<button class="btn btn-primary btn-sm editor" data-val=${val} data-emit="row-editor" >编辑</button>
                      <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row" >删除</button>`
                },
            }],
            button: '确定',
        }
    },
    computed: {
        tableData () {
            let roomid = RegExp(this.roomid, 'ig')
            let roomNumber = RegExp(this.roomNumber, 'ig')
            return this.tableList.filter(item => {
                return this.roomid == '' ? true : roomid.test(item.cmsHotelRoom.roomId)
            }).filter(item => {
                return this.roomNumber == '' ? true : roomNumber.test(item.cmsHotelRoom.roomNumber)
            })
        },
    },
    created () {
        this.getHoteLangList()
    },
    methods: {
        // 返回关闭、
        close () {
            this.getHoteLangList()
            this.view = 'table'
        },
        //编辑
        editor (val) {
            this.button = '更新'
            let data = this.tableData.find(item => item.cmsHotelRoom.roomId == val)
            this.model = JSON.parse(JSON.stringify(data))
            this.view = 'form'
        },
        //添加
        addfile () {
            this.button = '确定'
            this.model = { cmsHotelRoom: {} }
            this.view = 'form'
        },
        //提交
        async submit () {
            try {
                if (this.model.cmsHotelRoom.roomId) {
                    const data = await RoomManageApi.updateRoom({ ...this.model.cmsHotelRoom, hotelId: env.hotelId })
                    this.$info('修改成功')
                } else {
                    //新增
                    const data = await RoomManageApi.addRoom({ ...this.model.cmsHotelRoom, hotelId: env.hotelId })
                    await this.$info('新增房间成功')
                }
                this.view = 'table'
                this.getHoteLangList()
            } catch (error) {
                console.log(error)
                this.$error(error)
            }
        },
        //获取数据
        async getHoteLangList () {
            try {
                const tableD = await RoomManageApi.getHotelRoom()
                console.log(tableD.rows, 'data')
                this.tableList = tableD.rows
            } catch (error) {
                console.log(error)

            }
        },
        //单个删除
        async manageCity (val) {
            console.log(val, 'cal')
            try {
                const res = await this.$confirm('您确定要删除这些数据吗？', '删除房间的同时会把房间中的设备全部删除，请谨慎操作！')

                if (!res) return
                await RoomManageApi.deleteHotelRoom(val)
                await this.getHoteLangList()
                await this.$info('删除房间及房间内设备成功')
                this.view = 'table'
            } catch (error) {
                console.log(error)
            }
        },
        // // 删除多个
        async delMessages () {
            const selections = this.$refs.messageTable.getSelections()
            if (selections.length === 0) return

            try {
                const res = await this.$confirm('您确定要删除这些数据吗？', '删除房间的同时会把房间中的设备全部删除，请谨慎操作！')

                if (!res) return
                await RoomManageApi.deleteAllRoom({ hotelId: env.hotelId, idList: selections.map(v => v.cmsHotelRoom.roomId) })
                await this.$info('删除成功')
                this.getHoteLangList()
                this.view = 'table'
            } catch (error) {
                console.error(error)
                this.$error('删除失败')
            }
        },
    },
    components: {
        CoolTable,
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
    margin-top: 4%;
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