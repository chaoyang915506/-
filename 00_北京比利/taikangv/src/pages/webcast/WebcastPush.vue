<template>
  <div>
    <cool-table
      :data="hotels"
      :columns="columns"
      ref="pushtable"
    >
      <button
        class="btn btn-primary mr-3"
        @click="closePushe"
      > 全部直播流 </button>
      <button v-if="state==='pushall'"
        class="btn btn-primary mr-3"
        @click="pushGarden"
      > 确定推送 </button>
      <button v-if="state==='canel'"
        class="btn btn-primary mr-3"
        @click="canelGarden"
      > 取消推送 </button>
      <!-- <button class="btn btn-danger mr-3"> 园区列表 </button> -->

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
        // formatter: val => val.hotelName
      },
        // {
        //   field: 'id', title: '操作', align: 'center',
        //   formatter: val => {
        //     return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="del-limit">推送园区</button>`
        //   }
        // }
      ],
    }
  },
  props: {
    //第一层用户选中的直播流
    selectList: {
      type: Array,
      default: () => ([])
    },
    state:{
      type:String,
      default:''
    }
  },
  methods: {
    async canelGarden () {
      const seledata = this.$refs.pushtable.getSelections()
      //酒店id 
      // console.log(seledata.map(item => item.hotelId), 'data')
      // console.log(this.canelList, '数组');流的数据
      try {
        if (seledata.length > 0) {
          const hotelId = seledata.map(item => item.hotelId)


          let arr = []
          this.limits.forEach(limit => {
            hotelId.forEach(item => {
              this.selectList.forEach(j => {

                if (limit.webcastId == j && limit.areaLimit == item) {
                  arr.push(limit.id)
                }
              })
            })

          })
          const data = await WebcastApi.canelpush(arr)
          this.closePushe()
          this.$info('取消成功')
        }else{
          this.$error('请选择园区')
        }
      } catch (error) {
        console.log(error)
      }
    },
    //推送
    async pushGarden () {
      const List = this.$refs.pushtable.getSelections()
      if (List.length === 0) return
      console.log(this.selectList)

      const hotelId = List.map(i => i.hotelId)

      let arr = []
      hotelId.forEach(item => {
        this.selectList.forEach(j => {
          arr.push({
            webcastId: j,
            areaLimit: item
          })
        })
      })

      try {
        const data = await WebcastApi.pushData(arr)
        this.closePushe()
        this.$info('推送成功')
      } catch (error) {
        console.log(error)
      }
    },
    //关闭园区列表 跳转到首页
    closePushe () {
      this.$emit('closePushjj', 'table')
    }
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