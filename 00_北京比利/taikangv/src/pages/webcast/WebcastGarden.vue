<template>
  <div>
    <!-- @view-garden="viewGarden" -->
    <cool-table
      :data="hotels"
      :columns="columns"
      ref="table"
    >
      <!-- <button class="btn btn-primary mr-3" >推送园区 </button> -->
      <!-- <button class="btn btn-danger mr-3"> 园区列表 </button> -->
      <button
        class="btn btn-primary mr-3"
        @click="fullback"
      > 全部直播流 </button>
      <button
        v-if="canelList.length!==0"
        class="btn btn-primary mr-3"
        @click="canelBtn"
      > 取消推送 </button>

    </cool-table>
  </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import WebcastApi from '@/api/WebcastApi'
import { mapState } from 'vuex'
export default {
  ///全部园区
  data () {
    return {
      columns: [{
        checkbox: true
      }, {
        field: 'hotelName', title: '园区名称',
        // formatter: val => val.hotelName
      },
      {
        field: 'hotelId', title: '操作', align: 'center',
        formatter: (val, row, idx) => {
          return `<button class="btn btn-primary btn-sm" >查看园区直播流</button>`
        },
        // data-val=(${val}) data-emit="view-garden"
        events: {
          'click .btn': (e, row, idx) => {
            this.viewGarden(e, row, idx)
          }

        },
      },
      ],
      state: 0,
    }
  },
  props: {
    //首页用户点击的流筛的id
    canelList: {
      type: Array,
      default: () => ([])
    },
  },
  methods: {
    //用户点击首页的流后可以选择
    async canelBtn () {
      const seledata = this.$refs.table.getSelections()
      //酒店id 
      // console.log(seledata.map(item => item.hotelId), 'data')
      // console.log(this.canelList, '数组');流的数据
      try {
        if (seledata.length > 0) {
          const hotelId = seledata.map(item => item.hotelId)
          let arr = []
          this.limits.forEach(limit => {
            hotelId.forEach(item => {
              this.canelList.forEach(j => {

                if (limit.webcastId == j && limit.areaLimit == item) {
                  arr.push(limit.id)
                }
              })
            })

          })
          const data = await WebcastApi.canelpush(arr)
          // console.log(data);
          this.fullback()
          this.$info('取消成功')
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 查看对应直播流
    viewGarden (e, row, idx) {
      console.log(row, 'id')
      console.log(idx)
      this.$emit('hotelId', idx)
    },
    //关闭园区列表 跳转到首页
    fullback () {
      this.$emit('closeFarden', 'table')
    }
  },
  mounted () {
    console.log(this.canelList, '数组');
    ;
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