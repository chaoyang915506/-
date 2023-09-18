<template>
  <div class="container-fluid">
    <div class="row">
      <header class="col-12">
        <h2>设备控制页面</h2>
      </header>
      <div class="col-12">
        <form class="form" novalidate @submit.prevent>
          <div class="form-row">
            <div class="form-group col">
              <label>房间：</label>
              <select class="custom-select" v-model="roomIdFilter">
                <option :value="-1">全部</option>
                <option
                  v-for="room in rooms"
                  :key="room.roomId"
                  :value="room.roomId"
                >
                  {{ room.roomNumber }}
                </option>
              </select>
            </div>
            <div class="form-group col">
              <label>连线状态：</label>
              <select class="custom-select" v-model="statusFilter">
                <option :value="-1">全部</option>
                <option :value="0">离线</option>
                <option :value="1">在线</option>
              </select>
            </div>
            <div class="form-group col">
              <label>应用状态：</label>
              <select class="custom-select" v-model="appStatusFilter">
                <option :value="-1">全部</option>
                <option :value="0">异常</option>
                <option :value="1">正常</option>
              </select>
            </div>
          </div>
        </form>
      </div>
      <div class="col-12">
        <cool-table
          :options="options"
          ref="deviceTable"
          :data="tableData"
          :columns="columns"
          @restart-row="restart"
        >
          <button type="button" class="btn btn-primary mr-1" @click="restarts">
            重启所选
          </button>
          <button class="btn btn-danger mr-1" @click="restartAll">
            重启全部
          </button>
          <button type="button" class="btn btn-primary mr-1" @click="update">
            升级固件
          </button>
        </cool-table>
      </div>
    </div>
  </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import DeviceApi from '@/api/DeviceApi'
import { mapState } from 'vuex'

export default {
  components: { CoolTable },
  name: 'DeviceApp',
  data () {
    return {
      roomIdFilter: -1,
      statusFilter: -1,
      appStatusFilter: -1,
      deviceStatuses: [],
      columns: [{
        checkbox: true,
      }, {
        field: 'roomNumber', title: '房间号'
      }, {
        field: 'deviceSerial', title: '设备序列号'
      }, {
        field: 'status.version', title: '固件版本',
        formatter: (val, row, idx) => val === "" || val === "未知" ? '未知' : val
      }, {
        field: 'status.status', title: '连线状态',
        formatter: (val, row, idx) => {
          switch (val) {
            case -1:
              return '未知'
            case 0:
              return '离线'
            case 1:
              return '在线'
          }
        }
      },
      {
        field: 'status.time', title: '时长',
        formatter: val => {
          if (val < 0) {
            return '未知'
          } else if (val < 60) {
            return val + 's'
          } else if (val < 3600) {
            const m = parseInt(val / 60)
            const s = parseInt(val % 60)
            return m + 'm' + s + 's'
          } else if (val < 86400) {
            const h = parseInt(val / 3600)
            const m = parseInt(val % 3600 / 60)
            const s = parseInt(val % 60)
            return h + 'h' + m + 'm' + s + 's'
          } else {
            const d = parseInt(val / 86400)
            const h = parseInt(val % 86400 / 3600)
            const m = parseInt(val % 3600 / 60)
            const s = parseInt(val % 60)
            return d + 'd' + h + 'h' + m + 'm' + s + 's'
          }
        }
      },
      {
        field: 'status.appStatus', title: '应用状态',
        formatter: (val, row, idx) => {
          return val === 1 ? "正常" : "异常"
        }
      }, {
        field: 'deviceSerial', title: '操作',
        formatter: (val, row, idx) => {
          return `<button class="btn btn-primary btn-sm" data-val="${val}" data-emit="restart-row">重启</button>`
        }
      }],
      options: {
        pageList: [5, 10, 20, 50, 100]
      }
    }
  },
  computed: {
    ...mapState({
      rooms: s => s.rooms,
    }),
    tableData () {
      return this.rooms.filter(room => {
        // roomIdFilter
        return this.roomIdFilter === -1 ? true : room.roomId === this.roomIdFilter
      }).flatMap(room => room.deviceList.map(device => {
        device.roomNumber = room.roomNumber
        return device
      })).map(device => {
        const status = this.deviceStatuses.find(status => device.deviceSerial === status.sn)
        if (!status) {
          device.status = {
            status: 0, time: -1, appStatus: 0, version: '未知'
          }
          return device
        }
        device.status = status
        // if (device.status.version === "") {
        //   device.status.version = "未知"
        // }
        return device
      }).filter(device => {
        // appStatusFilter
        return (this.appStatusFilter === -1 ? true : device.status.appStatus == this.appStatusFilter)
          &&
          // statusFilter
          (this.statusFilter === -1 ? true : device.status.status == this.statusFilter)
      })
    }
  },
  methods: {
    async update () {
      const length = this.$refs.deviceTable.getSelections()
      if (length.length === 0) {
        return
      }
      try {
        const ok = await this.$confirm('升级' + length.length + '个设备')
        if (!ok) {
          return
        }
        console.log(length.map(item => item.deviceSerial))
        await DeviceApi.updataData(length.map(item => item.deviceSerial))
        await this.$info(`已发送升级到${length.length}个设备`)

      } catch (error) {
        this.$error('发送升级失败')
      }
    },
    async restart (sn) {
      try {
        const ok = await this.$confirm('重启' + sn)
        if (!ok) {
          return
        }

        await DeviceApi.restart([sn])
        await this.$info('已发送重启到' + sn)
      } catch (error) {
        console.log(error)

        this.$error('发送重启失败')
      }
    },
    async restarts () {
      const selects = this.$refs.deviceTable.getSelections()
      if (selects.length === 0) {
        return
      }

      try {
        const ok = await this.$confirm('重启' + selects.length + '个设备')
        if (!ok) {
          return
        }
        await DeviceApi.restart(selects.map(v => v.deviceSerial))
        await this.$info('已发送重启到' + selects.length + '个设备')
      } catch (error) {
        console.error(error)

        this.$error('发送重启失败')
      }
    },
    async restartAll () {
      try {
        const ok = await this.$confirm('重启' + this.tableData.length + '个设备')
        if (!ok) {
          return
        }

        await DeviceApi.restart(this.tableData.map(v => v.deviceSerial))
        await this.$info('已发送重启到' + this.tableData.length + '个设备')
      } catch (error) {
        console.error(error)

        this.$error('发送重启失败')
      }
    }
  },
  created () {
    DeviceApi.list().then(data => {
      this.deviceStatuses = data.list
    }).catch(err => {
      console.error(err)

      this.$error('获取设备状态失败')
    })
  }
}
</script>
