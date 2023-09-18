<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <h2 v-if="hotelFilter === 0">直播流管理</h2>
        <h2 v-else>所属园区:{{ gardenId.hotelName }}</h2>
      </div>
      <div v-if="view === 'table'" class="col-12">
        <!-- <form class="border rounded p-2" @submit.prevent>
                    <div class="form-row">
                        <div class="form-group col-2">
                            <label>推送范围：</label>
                            <select class="custom-select" v-model="hotelFilter">
                                <option :value="0">全部园区</option>
                                <option
                                    v-for="hotel in hotels"
                                    :key="hotel.hotelId"
                                    :value="hotel.hotelId"
                                >
                                    {{ hotel.hotelName }}
                                </option>
                            </select>
                        </div>
                    </div>
                </form> -->
        <cool-table
          ref="table"
          :data="tableData"
          :columns="columns"
          @update-limit="updateLimit"
        >
          <!-- <button>{{getlengt}}</button> -->
          <!-- @update-limit="updateLimit" -->
          <button class="btn btn-primary mr-3" @click="hotelFilter = 0">
            全部直播流
          </button>
          <button class="btn btn-danger mr-3" @click="gogarden">
            园区列表
          </button>
          <button
            v-if="hotelFilter === 0"
            class="btn btn-primary  mr-3"
            @click="pushAll"
          >
            推送直播流
          </button>

          <button
            v-if="hotelFilter !== 0"
            class="btn btn-primary"
            @click="offPushAll"
          >
            取消推送
          </button>
          <button v-else class="btn btn-primary" @click="offPush">
            取消推送
          </button>
        </cool-table>
      </div>
      <div v-if="view === 'test'" class="col-12">
        <webcast-limits
          :webcastId="limitWebcastId"
          :value="limitsModel"
          @change="refreshLimits"
          @close="view = 'table'"
        />
      </div>
      <!-- 园区列表 -->
      <div v-if="view === 'garden'" class="col-12">
        <webcast-garden
          :canelList="canelList"
          @hotelId="gethotelId"
          @closeFarden="closeFarden"
        ></webcast-garden>
      </div>
      <!-- 推送的园区 -->
      <div v-if="view === 'pushlist'" class="col-12">
        <webcast-push
          @closePushjj="closePushh"
          :selectList="selectList"
          :state="state"
        ></webcast-push>
      </div>
      <div v-if="view === 'lookhotel'" class="col-12">
        <webcast-all
          @gogarden="gogardennow"
          @closeall="closePushh"
          :updateDa="updateDa"
        ></webcast-all>
      </div>
    </div>
  </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import WebcastApi from '@/api/WebcastApi'
import { mapState } from 'vuex'
import WebcastLimits from './WebcastLimits.vue'
import WebcastGarden from './WebcastGarden.vue'
import WebcastPush from './WebcastPush.vue'
// import WebcastEdit from './WebcastEdit.vue'
import WebcastAll from './WebcastAll.vue'
export default {
  name: 'WebcastApp',
  components: {
    CoolTable,
    WebcastLimits,
    WebcastGarden,
    WebcastPush,
    WebcastAll,
  },
  data() {
    return {
      view: 'table',
      webcasts: [],
      columns: [
        {
          checkbox: true,
          // formatter:stateFormatter
        },
        {
          field: 'title',
          title: '标题',
        },
        {
          field: 'startTime',
          title: '开始时间',
        },
        {
          field: 'enableTime',
          title: '生效时间',
        },
        {
          field: 'disableTime',
          title: '失效时间',
        },
        {
          field: 'id',
          title: '操作',
          align: 'center',
          formatter: (val) => {
            return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="update-limit">查看投放园区</button>`
          },
        },
      ],
      hotelFilter: 0,
      limitWebcastId: 0,
      limitsModel: [],
      //用户选中的数据1
      selectList: [],
      gardenId: '', //当前的园区
      canelList: [], //取消推送的多个流
      updateDa: [], //传给查看页面的数据
      listlimit: [],
      state: '', //要显示那个按钮
    }
  },

  computed: {
    ...mapState(['hotels']),
    limits() {
      return this.$store.state.limits.map((limit) => {
        return {
          ...limit,
          hotel: this.hotels.find((hotel) => hotel.hotelId === limit.areaLimit),
        }
      })
    },
    //全部数据
    tableData() {
      const webcasts = this.webcasts.map((webcast) => {
        webcast.limits = this.limits.filter(
          (limit) => limit.webcastId === webcast.id
        )
        return webcast
      })
      console.log(webcasts, 'why')
      if (this.hotelFilter === 0) {
        return webcasts
      }

      return webcasts.filter((webcast) => {
        return webcast.limits.find(
          (limit) => limit.areaLimit === this.hotelFilter
        )
      })
    },
  },
  methods: {
    //取消推送
    offPush() {
      const length = this.$refs.table.getSelections()
      if (length.length === 0) return this.$error('请选择直播流')

      this.selectList = length.map((item) => item.id)

      console.log(length.map((item) => item.id))
      this.state = 'canel'
      this.view = 'pushlist'
    },
    getlengt() {
      let data = this.$refs.table.getSelections()
      if (data.length !== 0) {
        this.btnsty = 0
      } else {
        this.btnsty = '1'
      }
    },
    //查看页返回到首页
    closeEdit(val) {
      this.view = val
    },
    //取消推送
    async offPushAll() {
      // console.log(pushData.length, '取消')
      try {
        //当前用户选中取消推送的项目
        const pushData = this.$refs.table.getSelections()
        if (pushData.length === 0) return
        let webcastId = pushData.map((item) => item.id)

        let arr = []
        this.listlimit.forEach((limits) => {
          webcastId.filter((item) => {
            if (
              limits.webcastId == item &&
              limits.areaLimit == this.gardenId.hotelId
            ) {
              arr.push(limits.id)
            }
          })
        })

        await WebcastApi.canelpush(arr)
        this.hotelFilter = this.gardenId.hotelId
        this.refreshLimits()
        this.$info('取消成功')
      } catch (error) {}
    },
    //展示给用户对应园区的直播流
    gethotelId(val) {
      this.gardenId = val
      console.log(val, '所属酒店')
      this.hotelFilter = val.hotelId
      this.view = 'table'
      //   console.log(val, '传递id')
    },
    //判断用户有没有选中跳转到园区
    pushAll() {
      const length = this.$refs.table.getSelections()
      if (length.length === 0) return this.$error('请选择直播流')

      this.selectList = length.map((item) => item.id)

      console.log(length.map((item) => item.id))
      this.state = 'pushall'
      this.view = 'pushlist'
    },
    //看投放园区跳园区列表
    gogardennow() {
      this.view = 'garden'
      this.hotelFilter = 0
    },
    //园区列表
    gogarden() {
      this.view = 'garden'
      this.hotelFilter = 0
      const list = this.$refs.table.getSelections()
      if (list.length !== 0) {
        console.log(list, 'list园区列表')
        this.canelList = list.map((v) => v.id) //选中流的id 数组
        // console.log(list.map(v => v.id)[0], 'data,li')
      }
    },
    //园区页跳首页
    closeFarden(val) {
      this.view = val
      this.hotelFilter = 0
      this.canelList = []
      this.refreshLimits() //如果用户没取消返回取消一级选中
    }, //推送选中直播流返回首页
    closePushh() {
      this.view = 'table'
      this.hotelFilter = 0
      this.refreshLimits()
    },
    //编辑用户跳到新页面看所有数据
    updateLimit(val) {
      this.updateDa = this.webcasts.filter((item) => item.id === val)
      console.log(this.webcasts.filter((item) => item.id === val))
      this.view = 'lookhotel'
    },

    //首页的推送直播流
    // updateLimit (webcastId) {
    //   this.limitWebcastId = webcastId
    //   this.limitsModel = this.limits.filter(limit => limit.webcastId === webcastId)
    //   this.view = 'limits'
    // },
    //获取全部数据
    refreshLimits() {
      WebcastApi.limits()
        .then((data) => {
          this.$store.commit('setLimits', data.list)
        })
        .catch((err) => {
          console.error(err)

          this.$error(err)
        })
    },
    async getlimits() {
      const data = await WebcastApi.limits()
      console.log(data, '数据')
      this.listlimit = data.list
    },
  },
  created() {
    this.getlimits()
    WebcastApi.webcasts()
      .then((data) => {
        this.webcasts = data.list
        console.log(data.list, 'list')
      })
      .catch((err) => {
        console.error(err)
        this.$error('获取直播数据失败')
      })
  },
}
</script>
