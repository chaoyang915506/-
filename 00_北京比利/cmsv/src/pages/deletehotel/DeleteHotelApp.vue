<template>
    <div
        class="container-fluid"
        style="overflow: auto; width: 100%; height: 100%"
    >
        <div class="col-12">
            <h2>{{ vendor }}删除页面</h2>
            <div class="card">
                <div class="card-header">查询条件</div>
                <div class="card-body row">
                    <div class="col-4 mb-3">
                        <label class="col-sm-4"> {{ vendor }}名称 </label>
                        <div class="col-sm-8" style="display: inline-block">
                            <input
                                type="text"
                                v-model="hotelName"
                                class="form-control"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <cool-table
                @del-row="delTable"
                ref="messageTable"
                :columns="columns"
                :data="tableData"
            >
            </cool-table>
        </div>
    </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import env from '@/env'
import DeleteHotelApi from '@/api/DeleteHotelApi'
export default {
    data () {
        return {
            vendor: env.vendor,
            columns: [{
                checkbox: true
            }, {
                field: 'cmsHotel.hotelId', title: 'ID', align: 'center'
            }, {
                field: 'cmsHotel.hotelName', title: `${env.vendor}名称`, align: 'center',
            },
            {
                field: 'cmsHotel.hotelEnName', title: `${env.vendor}英文名`, align: 'center',
            },
            {
                field: 'cmsHotel.city', title: '所在城市', align: 'center'
            },
            {
                field: 'cmsTemplate.templateDesc', title: '所用模板', align: 'center'
            },
            {
                field: 'cmsHotel.hotelDesc', title: `${env.vendor}描述`, align: 'center'
            },
            {
                field: 'cmsHotel.hotelId', title: '操作', align: 'center',
                formatter: val => {
                    return `
                      <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row" >删除</button>
                      `
                }
            }
            ],
            hotelName: '',//搜索框的条件
            tableList: [],
            vendor: env.vendor,
        }
    },
    computed: {
        tableData () {
            let hotelname = new RegExp(this.hotelName, 'ig')
            return this.tableList.filter(item => {
                return this.hotelName == '' ? true : hotelname.test(item.cmsHotel.hotelName)
            })
        }
    },
    created () {
        this.getAllTable()
    },
    methods: {
        // 删除
        async delTable (val) {
            try {
                let hotelName = this.tableData.find(item => item.cmsHotel.hotelId == val).cmsHotel.hotelName
                const res = await this.$confirm('提示', `删除${this.vendor}会删除与${this.vendor}有关的全部数据，确定删除id是:${val},${this.vendor}名字是：${hotelName}?`)
                if (!res) return
                console.log(32)
                await DeleteHotelApi.delteHotel(val)
                await this.$info('删除成功')
                await this.getAllTable()

            } catch (error) {
                console.log(error)
            }
        },
        async getAllTable () {
            try {

                const data = await DeleteHotelApi.getTableData()
                this.tableList = data.rows
            } catch (error) {
                console.log(error)
            }
        }
    },
    components: {
        CoolTable,
    },
}
</script>

<style lang="scss" scoped>
::v-deep .swal-text {
    text-align: center;
}
</style>