<template>
  <div class="container-fluid">
    <div v-if="view == 'table'">
      <h2>
        直播回放管理
      </h2>
      <div class="card">
        <div class="card-header">
          查询条件
        </div>
        <div class="card-body row">
          <div class="col-3">
            <label class="col-4">标题</label>
            <div class="col-8" style="display: inline-block">
              <input type="text" class="form-control" v-model="title" />
            </div>
          </div>
          <div class="col-3">
            <label class="col-4">类型</label>
            <div class="col-8" style="display: inline-block">
              <select class="form-control" v-model="state">
                <option value="">全部</option>
                <!-- <option value="102">待开始</option> -->
                <option value="103">直播</option>
                <option value="105">回放</option>
              </select>
            </div>
          </div>
          <div class="col-3">
            <label class="col-4"> 状态 </label>
            <div class="col-8" style="display: inline-block">
              <select class="form-control" v-model="stauts">
                <option value="">全部</option>
                <option value="1">上线</option>
                <option value="2">下线</option>
              </select>
            </div>
          </div>
          <div class="col-3">
            <label class="col-4"> 园区 </label>
            <div class="col-8" style="display: inline-block">
              <select class="form-control" v-model="garden">
                <option value="">全部</option>
                <option
                  :value="i.hotelId"
                  v-for="i in gardenlist"
                  :key="i.hotelId"
                  >{{ i.hotelName }}</option
                >
              </select>
            </div>
          </div>
        </div>
      </div>
      <cool-table
        class="tableCool"
        :columns="columns"
        :data="tableData"
        ref="messageTable"
        @look-row="lookRow"
        @edit-row="editRow"
        @del-row="delRow"
      >
        <button class="btn btn-primary mr-1" @click="addlive">
          新增
        </button>
        <button class="btn btn-primary mr-1" @click="online">
          上线
        </button>
        <button class="btn btn-primary mr-1" @click="offline">
          下线
        </button>
        <button class="btn btn-danger mr-1" @click="batchdelete">
          批量删除
        </button>
        <button class="btn btn-primary mr-1" @click="view = 'group'">
          分组管理
        </button>
      </cool-table>
    </div>
    <play-back-group-from
      v-if="view == 'addform'"
      class="col-12"
      @close="close"
      :groupList="groupList"
      :formd="formd"
      style="justify-content: center;"
    ></play-back-group-from>
    <play-back-manage
      v-if="view == 'group'"
      @close="close"
      :table="JSON.parse(JSON.stringify(tableData))"
      :groupList="groupList"
    ></play-back-manage>
    <play-back-garden
      v-if="view == 'gardenonline'"
      :gardenlist="gardenlist"
      :statusOnup="statusOnup"
      :limits="limits"
      @close="close"
      :ids="ids"
      :gardens="gardens"
    ></play-back-garden>
    <cool-modal
      class="online_garden"
      :visible="online_garden"
      title="查看上线园区"
      @hidden="online_garden = false"
      :footer="{ visible: false }"
    >
      <div style="height:100%;justify-content: center;padding: 1%;">
        <table class="table  table-bordered ">
          <thead class="thead-light">
            <tr>
              <th scope="col">序号</th>
              <th scope="col">园区名称</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(idx, ind) in lookgarden" :key="idx.hotleId">
              <td>{{ ind + 1 }}</td>
              <td>{{ idx.hotelName }}</td>
            </tr>
          </tbody>
        </table>
        <div name="footer" style="text-align: right;" class="mr-2 mt-4">
          <button class="btn-secondary btn mr-2" @click="online_garden = false">
            返回
          </button>
        </div>
      </div>
    </cool-modal>
  </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import PlayBackGroupFrom from './PlayBackGroupFrom.vue'
import PlayBackManage from './PlayBackManage.vue'
import CoolModal from '@/components/CoolModal.vue'
import PlayBackGroupApi from '@/api/PlayBackGroupApi'
import Axios from 'axios'
import PlayBackGarden from './PlayBackGarden.vue'
class formDddd {
  constructor() {
    this.title = ''
    this.imgUrl = ''
    this.status = '103'
    this.startTime = ''
    this.introduce = ''
    this.liveWatchUrl = ''
    this.playbackUrl = ''
    this.categoryId = ''
    this.playbackImgUrl = ''
    this.endTime = ''
  }
}
export default {
  data() {
    return {
      view: 'table',
      columns: [
        {
          checkbox: true,
        },
        {
          field: '',
          title: '序号',
          align: 'center',
          formatter: (val, row, idx) => {
            return idx + 1
          },
        },
        {
          field: 'title',
          title: '标题',
          align: 'center',
          formatter: (val) => {
            return `<div class="over_p">${val}</div>`
          },
        },
        {
          field: 'status',
          title: '类型',
          align: 'center',
          formatter: (val) => {
            if (val == '103') {
              return '直播'
            } else if (val == '105') {
              return '回放'
            } else {
              return '-'
            }
          },
        },
        {
          field: 'categoryId',
          title: '分组',
          align: 'center',
          formatter: (val, row) => {
            const group = this.groupList.find((v) => v.id == val)
            if (group) {
              return group.name
            } else {
              return '-'
            }
          },
        },
        {
          field: 'startTime',
          title: '直播时间',
          align: 'center',
          formatter: (val, row, idx) => {
            console.log(row.startTime, row.endTime)
            if (row.status == '103') {
              return `${
                typeof row.startTime == 'object'
                  ? '暂无开始时间'
                  : row.startTime
              }---${
                typeof row.endTime == 'object' ? '暂无结束时间' : row.endTime
              }`
            } else if (row.status == '105') {
              return '暂无直播'
            }
          },
        },
        {
          field: '',
          title: '状态',
          align: 'center',
          formatter: (val, row) => {
            if (row.limits.length == 0) {
              return '下线'
            } else {
              return '上线'
            }
          },
        },
        {
          field: 'id',
          title: '操作',
          align: 'center',
          formatter: (val) => {
            let data = this.tableData.find((idx) => idx.id == val)
            let btn = `<button class="btn btn-primary btn-sm mr-1" data-val=${val} data-emit="look-row">查看上线园区</button>`
            let btn1 = `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">编辑</button>
            <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row">删除</button>`
            if (data && data.limits.length !== 0) {
              return btn + btn1
            }
            return btn1
          },
        },
      ],
      formd: new formDddd(),
      tableList: [],
      online_garden: false,
      groupList: [], //分组all
      gardenlist: [], //园区
      title: '',
      state: '',
      garden: '',
      stauts: '', //当前的上线还是没有
      gardens: [], //上线或者没上线要选择的
      ids: [], //要推送的id或者取消的
      limits: [], //已经推送的
      lookgarden: [], //上线的园区
      statusOnup: '',
    }
  },
  created() {
    this.getAllData()
  },
  computed: {
    tableData() {
      let title = RegExp(this.title, 'ig')
      return this.tableList
        .map((webcast) => {
          let limits = this.limits.filter((i) => i.webcastId == webcast.id)
          return { ...webcast, limits }
        })
        .filter((i) => {
          return this.title == '' ? true : title.test(i.title)
        })
        .filter((i) => {
          return this.state == '' ? true : i.status == this.state
        })
        .filter((i) => {
          return this.garden !== ''
            ? i.limits.map((idx) => idx.hotelId).includes(this.garden)
            : true
        })
        .filter((i) => {
          if (this.stauts == '') {
            return i
          } else if (this.stauts == 1) {
            return i.limits.length > 0 ? true : false
          } else if (this.stauts == 2) {
            return i.limits.length == 0 ? true : false
          }
        })
        .sort((a, b) => b.id - a.id)
    },
  },
  methods: {
    addlive() {
      this.formd = new formDddd()
      this.view = 'addform'
    },
    online() {
      this.statusOnup = '上线'
      const checkout = this.$refs.messageTable.getSelections()
      if (checkout.length == 0) return this.$error('请选择要上线的内容！')
      this.ids = checkout.map((i) => i.id)
      let data = checkout.map((i) => i.limits.map((idx) => idx.hotelId))
      // this.gardens
      let arr2 = []
      let garden = this.gardenlist.map((id) => id.hotelId).sort((a, b) => a - b)
      let arr = [
        ...new Set(
          data
            .map((i) => {
              let item = i.sort((a, b) => a - b)
              let red = garden
                .map((x, j) => {
                  if (item.findIndex((id) => id == x) == -1) {
                    return x
                  } else {
                    return '-1'
                  }
                })
                .filter((i) => i && i !== -1)
              return red
            })
            .flat()
        ),
      ]
        .map((i) => {
          let obj = this.gardenlist.find((id) => id.hotelId == i)
          return obj
        })
        .filter((i) => i)
      // this.gardens = this.gardenlist
      this.gardens = arr
      if (this.gardens.length == 0)
        return this.$error('当前选中已完成全园区上线')
      this.view = 'gardenonline'
    },
    // 下线的数据
    offline(val) {
      this.statusOnup = '下线'
      this.gardens = []
      const checkout = this.$refs.messageTable.getSelections()

      let juede = true

      for (let i = 0; i < checkout.length; i++) {
        if (checkout[i].limits.length == 0) {
          if (checkout.every((i) => i.limits.length == 0)) {
            this.$error('当前内容为下线状态')
          } else {
            this.$error(
              `标题为 ${checkout[i].title} 的内容还没上线,请选择已上线的内容进行操作！`
            )
          }
          juede = false
          break
        }
      }
      if (juede == false) return
      if (checkout.length == 0) return this.$error('请选择要下线的内容！')

      let arr = []
      this.ids = checkout.map((i) => i.id)

      checkout
        .map((item) => item.id)
        .map((idx) => {
          let hotel = this.tableData.find((i) => i.id == idx)
          if (hotel) {
            arr.push(...hotel.limits)
          }
        })
      let newdat = new Set(arr.map((i) => i.areaLimit))
      newdat.forEach((i) => {
        const data = arr.find((idx) => idx.hotelId == i)
        if (data) {
          this.gardens.push(data)
        }
      })
      this.close('form')
      if (this.gardens.length == 0) return this.$error('该内容还未上线')
      this.view = 'gardenonline'
    },
    close(val) {
      if (val == 'form') {
        this.view = 'table'
        this.getAllData()
      } else if (val == 'add') {
        this.view = 'table'
        this.formd = new formDddd()
      } else if (val == 'group') {
        this.view = 'table'
      } else {
        this.getAllData()
      }
    },
    //获取全部
    getAllData() {
      this.getgroup()
      Axios.all([
        PlayBackGroupApi.getGraden(),
        PlayBackGroupApi.limits(),
        PlayBackGroupApi.webcasts(),
      ])
        .then(
          Axios.spread((garden, limits, data) => {
            this.gardenlist = garden.list
            let dat
            this.limits = limits.list.map((i) => {
              dat = garden.list.find((idx) => idx.hotelId == i.areaLimit)
              if (dat) {
                return {
                  ...i,
                  hotelId: dat.hotelId,
                  hotelName: dat.hotelName,
                }
              } else {
                return i
              }
            })
            this.tableList = data.list
          })
        )
        .catch((err) => {
          this.$error('获取数据失败')
        })
    },
    getgroup() {
      PlayBackGroupApi.getcategory().then((group) => {
        this.groupList = group.list
      })
    },
    //查看
    lookRow(val) {
      let data = this.tableData.find((idx) => idx.id == val)
      if (data && data.limits.length !== 0) {
        this.lookgarden = data.limits
        this.online_garden = true
      } else {
        return this.$error('该内容没有上线的园区')
      }
    },
    // 编辑
    editRow(val) {
      let data = this.tableList.find((i) => i.id == val)
      if (data) {
        this.formd = {
          ...data,
          endTime:
            data.endTime && typeof data.endTime != 'object'
              ? new Date(data.endTime).format('yyyy-MM-ddThh:mm:ss')
              : '',
          startTime:
            data.startTime && typeof data.startTime != 'object'
              ? new Date(data.startTime).format('yyyy-MM-ddThh:mm:ss')
              : '',
        }
        this.view = 'addform'
      }
    },
    // 删除
    delRow(val) {
      this.$confirm('提示', '确定删除吗？').then((res) => {
        if (res == 'ok') {
          PlayBackGroupApi.dellive([val]).then((da) => {
            this.getAllData()
            this.$info('删除成功')
          })
        }
      })
    },
    // 批量删除
    batchdelete() {
      const batch = this.$refs.messageTable.getSelections()
      if (batch.length == 0) return this.$error('请选择要删除的内容')
      this.$confirm('提示', '确定删除选中的内容吗？').then((res) => {
        if (res == 'ok') {
          PlayBackGroupApi.dellive(batch.map((i) => i.id)).then((da) => {
            this.getAllData()
            this.$info('删除成功')
          })
        }
      })
    },
  },
  components: {
    CoolTable,
    PlayBackGroupFrom,
    PlayBackManage,
    CoolModal,
    PlayBackGarden,
  },
}
</script>

<style lang="scss" scoped>
/deep/.online_garden .modal-open .modal {
  overflow: hidden;
}
/deep/ .online_garden .modal-dialog .modal-xl {
  height: 100%;
}
/deep/.online_garden .modal.show .modal-dialog {
  height: 100%;
}
/deep/.online_garden .modal-content {
  min-height: 10%;
  max-height: 90%;
}
/deep/.online_garden .modal-body {
  height: 100%;
  padding: 0;
  overflow: auto;
}
th,
td {
  text-align: center;
}
/deep/.tableCool td {
  max-width: 200px;
  overflow-wrap: break-word;
}
/deep/.over_p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
