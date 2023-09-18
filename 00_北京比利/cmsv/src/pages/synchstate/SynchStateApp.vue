<template>
    <div
        class="container-fluid mt-3"
        style="overflow: auto; width: 100%; height: 100%"
    >
        <cool-table
            :data="tableData"
            ref="messageTable"
            :columns="columns"
            :options="options"
        >
            <el-tooltip class="item mb-3" effect="dark" placement="right-start">
                <div slot="content">
                    受数据方限制,每天同步次数不能超<br />过3次，请勿频繁同步 !
                </div>
                <el-button class="btn btn-danger" @click="issuce"
                    >立即同步</el-button
                >
            </el-tooltip>
        </cool-table>
    </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import SynchStateApi from '@/api/SynchStateApi'
// import moment from 'moment'
export default {
    data () {
        return {
            columns: [{
                checkbox: true
            }, {
                field: 'id', title: 'id', align: 'center'
            }, {
                field: 'syncDate', title: '同步日期', align: 'center',
                formatter: val => {
                    return this.$moment(val).format('YYYY-MM-DD')
                }
            },
            {
                field: 'syncStartTime', title: '同步开始时间', align: 'center',
                formatter: val => {
                    return this.$moment(val).format('YYYY-MM-DD HH:mm:ss')
                }
            },
            {
                field: 'syncStartTimeLong', title: '同步结束时间', align: 'center',
                formatter: val => {
                    return this.$moment(val).format('YYYY-MM-DD HH:mm:ss')
                }
            },
            {
                field: 'status', title: '同步状态', align: 'center',
                formatter: val => {
                    if (val == 1) {
                        return `<p class="succeed">同步成功</p>`
                    } else {
                        return `<p class="failed">同步失败</p>`
                    }
                }
            }
            ],
            tableList: [],
            options: {
                pageList: [15, 30, 45],
            }
        }
    },
    components: {
        CoolTable,
    },
    created () {
        this.getTable()
    },
    computed: {
        tableData () {
            return this.tableList
        }
    },
    methods: {
        async issuce () {
            try {
                const data = await SynchStateApi.issuceApi()
                await this.$info('已下发同步任务')
                await this.getTable()
            } catch (error) {

            }
        },
        async getTable () {
            try {
                const data = await SynchStateApi.getAllTable()
                this.tableList = data.rows
                // console.log(data)
            } catch (error) {

            }
        }
    },
}
</script>

<style lang="scss" scoped>
::v-deep .succeed {
    color: green;
}
::v-deep .failed {
    color: red;
}
</style>