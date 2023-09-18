<template>
  <div>
    <cool-table
      :data="updateDa[0].limits"
      :columns="columns"
      ref="table"
    >
      <!-- <button class="btn btn-primary mr-3" >推送园区 </button> -->
      <!-- <button class="btn btn-danger mr-3"> 园区列表 </button> -->
      <button
        class="btn btn-primary mr-3"
        @click="fullbackone"
      > 全部直播流 </button>
      <button
            class="btn btn-danger mr-3"
            @click="gogarden"
          > 园区列表 </button>
      <button
        class="btn btn-primary mr-3"
        @click="canellist"
      > 取消推送 </button>

    </cool-table>

  </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import WebcastApi from '@/api/WebcastApi'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      columns: [{
        checkbox: true
      }, {
        field: 'hotelName', title: '园区名称',
        formatter: (val, row, idx) => {
          return row.hotel.hotelName
        }
      },
        // {
        //   field: 'hotelId', title: '操作', align: 'center',
        //   formatter: (val, row, idx) => {
        //     return `<button class="btn btn-primary btn-sm" >查看园区直播流</button>`
        //   },
        //   // data-val=(${val}) data-emit="view-garden"
        //   events: {
        //     'click .btn': (e, row, idx) => {
        //       this.viewGarden(e, row, idx)
        //     }

        // },
        // },
      ],
      state: 0,
    }
  },
  methods: {
    gogarden(){
      
      this.$emit('gogarden')
    },
    fullbackone () {
      this.$emit('closeall')
    },//取消推送
    async canellist () {
      const hotel = this.$refs.table.getSelections()

      const hotelId = hotel.map(item => item.hotel.hotelId)
      // 流的id 
      //  console.log( this.updateDa.map(item=>item.id),'流的id');
      const webcastId = this.updateDa.map(item => item.id)

      let arr = []
      this.limits.forEach(limits => {
        hotelId.forEach(item => {
          console.log(this.updateDa[0].id)
          if (limits.webcastId == this.updateDa[0].id && limits.areaLimit == item) {
            arr.push(limits.id)
          }
        })
      })
      console.log(arr, 'sdfs')
      try {
        if (hotelId.length > 0) {
          await WebcastApi.canelpush(arr)
          this.fullbackone()
          this.$info('取消成功')
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  props: {
    updateDa: {
      type: Array,
      default: () => ([])
    },
  },
  computed: {
    ...mapState(['hotels', 'limits'])
  },
  components: {
    CoolTable,
  },
}

</script>

<style lang="scss" scoped>
</style>