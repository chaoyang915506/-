<template>
  <div class="container-fluid">
    <h2>{{ vendor }}克隆</h2>
    <cool-table :columns="columns" :data="tableList"> </cool-table>
  </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import { HotelCloneApi } from '../LmsApi'
import env from '@/env'
import HotelApi from '@/api/HotelApi'
export default {
  data() {
    return {
      vendor: env.vendor,
      columns: [
        {
          field: 'hotelId',
          title: '酒店名称',
          align: 'center',
          formatter: (val) => {
            const hot = this.hotelList.find((it) => it.hotelId == env.hotelId)
            if (!hot) {
              return '-'
            }
            return hot.hotelName
          },
        },
        {
          field: 'cloneVersion',
          title: '克隆版本',
          align: 'center',
        },
        {
          field: 'cloneUrl',
          title: '克隆url',
          align: 'center',
        },
      ],
      tableList: [],
      hotelList: [],
    }
  },
  created() {
    this.getallData()
  },
  methods: {
    //获取全部数据
    async getallData() {
      try {
        const data1 = await HotelApi.list()
        this.hotelList = data1

        const data = await HotelCloneApi.list()
        this.tableList = [data]
      } catch (error) {
        this.$error(`该${this.vendor}没有数据`)
      }
    },
  },
  components: {
    CoolTable,
  },
}
</script>
