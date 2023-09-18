<template>
    <cool-table
        ref="webcastLimitsTable"
        :data="tableData"
        :columns="columns"
        @del-limit="deleteLimit"
    >
        <form class="form-inline" @submit.prevent>
            <div class="input-group">
                <select class="custom-select" v-model="hotelId">
                    <option :value="0" disabled>请选择园区添加</option>
                    <option
                        v-for="hotel in hotels"
                        :key="hotel.hotelId"
                        :value="hotel.hotelId"
                    >
                        {{ hotel.hotelName }}
                    </option>
                </select>
                <div class="input-group-append">
                    <button class="btn btn-primary" @click="addLimit">
                        添加
                    </button>
                </div>
            </div>
            <button class="btn btn-danger ml-1" @click="deleteLimits">
                取消推送
            </button>
            <button type="submit" class="btn btn-primary ml-1" @click="confirm">
                确认
            </button>
            <button class="btn btn-secondary ml-1" @click="close">返回</button>
        </form>
    </cool-table>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import { mapState } from 'vuex'
import WebcastApi from '@/api/WebcastApi'

export default {
    name: 'WebcastLimits',
    components: { CoolTable },
    props: {
        webcastId: Number,
        value: Array,
    },
    data() {
        return {
            columns: [{
                checkbox: true
            }, {
                field: 'hotel', title: '园区名称',
                formatter: val => val.hotelName
            },
                //  {
                //     field: 'id', title: '操作', align: 'center',
                //     formatter: val => {
                //         return `<button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-limit">删除</button>`
                //     }
                // }
            ],
            hotelId: 0,
        }
    },
    computed: {
        ...mapState(['hotels']),
        tableData() {
            return this.value
        }
    },
    methods: {
        addLimit() {
            if (this.hotelId === 0) {
                return
            }

            if (this.tableData.find(limit => limit.areaLimit === this.hotelId)) {
                return
            }


            this.tableData.push({
                id: 0, webcastId: this.webcastId,
                hotel: this.hotels.find(hotel => hotel.hotelId === this.hotelId),
                areaLimit: this.hotelId,
            })
        },
        deleteLimits() {
            const selections = this.$refs.webcastLimitsTable.getSelections().map(limit => limit.areaLimit)
            if (selections.length === 0) {
                return
            }

            selections.forEach(areaLimit => {
                this.tableData.splice(this.tableData.findIndex(limit => limit.areaLimit === areaLimit), 1)
            })
        },
        deleteLimit(id) {

        },
        async confirm() {
            try {
                await WebcastApi.updateWebcastLimits(this.webcastId, this.tableData.map(limit => limit.areaLimit))
                await this.$info('更新推送园区成功')
                this.$emit('change')
                this.close()
            } catch (error) {
                console.error(error)

                this.$error(error)
            }
        },
        close() {
            this.$emit('close')
        }
    }
}
</script>