<template>
  <div
    class="container-fluid"
    style="overflow: auto; width: 100%; height: 100%"
  >
    <h2>引导页后台管理</h2>
    <!--表格数据  -->
    <div class="row" v-if="view === 'table'">
      <div class="col-12">
        <cool-table
          ref="table"
          :columns="columns"
          :data="dataList"
          @edit-row="editBtn"
          @del-row="delBtn"
        >
          <button class="btn btn-primary" @click="view = 'form'">新增</button>
          <button class="btn btn-danger ml-2" @click="delall">删除</button>
        </cool-table>
      </div>
    </div>
    <!-- 表单数据 -->
    <div v-if="view === 'form'" class="row">
      <div class="col-6">
        <gui-dance-form @close="close"></gui-dance-form>
      </div>
    </div>
    <div class="row" v-if="view === 'edit'">
      <div class="col-6">
        <gui-dance-edit
          :editData="editData"
          @editClose="editClose"
          :hotelList="hotelList"
        ></gui-dance-edit>
      </div>
    </div>
  </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import guiDanceForm from './guiDanceForm.vue'
import guiDanceApi from '@/api/guiDanceApi'
import guiDanceEdit from './guiDacnceEdit.vue'
import { stringify } from 'qs'
export default {
  data () {
    return {
      view: 'table',
      columns: [{
        checkbox: true
      },
      {
        field: 'name', title: '视频标题', align: 'center',
        formatter: (val, row, idx) => {
          return row.names[0].name
        }
      },
      {
        field: 'length', title: '视频长度', align: 'center',
      },
      {
        field: 'langId', title: '语言', align: 'center',
        formatter: (val, row, idx) => {
          return row.names[0].langId == '0' ? '中文' : '英文'
        }
      },
      {
        field: 'uploadTime', title: '上传时间', align: 'center'
      },
      {
        field: 'status', title: '视频状态', align: 'center',
        formatter: (val, row, idx) => {
          let a
          if (val == "0") {
            a = `<div
        class="switch-panel switch-left">
        <span class="switch-ico"></span> </div>`
          } else {
            a = `<div
        class="switch-panel switch-right">
        <span class="switch-ico"></span> </div>`
          }
          return a
        },
        events: {
          'click .switch-panel': (e, value, row) => {
            this.clickRow(e, row)
          }
        }
      },
      {
        field: 'id', title: '操作', align: 'center',
        formatter: (val, row, idx) => {
          return `<button class="btn btn-primary  btn-sm" data-val=${val} data-emit="edit-row">编辑</button>
                  <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row" >删除</button>`
        }
      }],
      dataList: [],
      editData: [],//编辑的数据
      flag: false,
      stateID: "",
      hotelList: [],//酒店信息
    }
  },
  methods: {
    //获取全部的数据
    async getall () {
      try {
        const data = await guiDanceApi.getAll()
        // console.log(data.list, '最新数据')
        this.dataList = data.list
        this.dataList.forEach(item => {
          item.uploadTime = this.formatYear(item.uploadTime)
          item.length = this.foamatter(item.length)
        })
      } catch (error) {
        console.log(error)
      }
    },
    //查看按钮
    editBtn (val) {
      let arr = []
      this.dataList.forEach(item => {
        if (item.id === val) {
          this.editData = item
        }
      })
      this.view = 'edit'
    },
    //全部酒店
    async gitAllHotel () {
      const data = await guiDanceApi.allHotel()
      this.hotelList = data.list
    },
    // 查看页面的返回
    editClose (val) {
      this.editData = []
      this.view = val
      this.getall()
    },
    //删除单个数据
    async delBtn (id) {
      try {
        const state = await this.$confirm('确定删除吗')
        if (state === true) {
          //     console.log(1);
          const data = await guiDanceApi.delGuiDanceV([id])
          // console.log(data, 'data数据')
          // console.log(state)
          await this.$info('删除成功')
          this.getall()
        }
      } catch (error) {
        console.log(error)
      }
    },
    //删除多个
    async delall () {
      try {
        const allid = this.$refs.table.getSelections()
        const index = allid.map(item => item.id)
        if (index.length > 0) {
          const state = await this.$confirm('确定删除吗')
          if (state) {
            console.log(state)
            const data = await guiDanceApi.delGuiDanceV(index)
            this.getall()
            await this.$info('删除成功')
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    //切换到table
    close (val) {
      this.view = val
      this.getall()
    },
    //处理成00:00:00未使用
    foamatter (leng) {
      const hour = Math.floor(leng / 3600)
      const minte = Math.floor(leng / 60 % 60)
      const second = Math.floor(leng % 60)
      // console.log(second, 'sdfas')
      return (hour < 10 ? "0" + hour : hour) + ':' + (minte < 10 ? "0" + minte : minte) + ':' + (second < 10 ? "0" + second : second)
    },
    //年-月-日
    formatYear (val) {
      const time = new Date(val)
      const Year = time.getFullYear()
      const MM = time.getMonth() + 1
      const Day = time.getDate()
      const Y = Year < 10 ? '0' + Year : Year
      const M = MM < 10 ? '0' + MM : MM
      const D = Day < 10 ? '0' + Day : Day
      return Y + '-' + M + '-' + D
    },
    // 切换状态
    async clickRow (e, row) {
      console.log(e)
      let data1 = { videoId: row.id }
      // let start = document.querySelector('.switch-panel')

      if (e.target.classList[1] == "switch-left") {
        // start.classList.remove('switch-left')
        // start.classList.add('switch-right')
        try {
          const data = await guiDanceApi.guidanceStart({ ...data1, status: 1 })
          await this.$info('启用成功')
          this.getall()
        } catch (error) {
          console.log(error)
          // this.$error('切换状态错误')
        }
      } else {
        //   start.classList.remove('switch-left')
        //   start.classList.add('switch-right')
        try {
          const data = await guiDanceApi.guidanceStart({ ...data1, status: 0 })

          //   e.target.innerHTML = '未启用'
          await this.$info('切换成功')
          this.getall()
        } catch (error) {
          console.log(error)
          // this.$error('切换状态错误')
        }
      }




      // console.log(e, row)
      // let data1
      // if (e.target.innerHTML == '未启用') {
      //   data1 = { videoId: row.id, status: 1 }
      //   console.log(data1)
      //   const data = await guiDanceApi.guidanceStart(data1)
      //   await this.$info('启用成功')
      //   e.target.innerHTML = '已启用'
      //   this.getall()
      // } else {
      //   data1 = { videoId: row.id, status: 0 }
      //   const data = await guiDanceApi.guidanceStart(data1)
      //   console.log(data)
      //   e.target.innerHTML = '未启用'
      //   await this.$info('切换成功')
      //   this.getall()

      // }
    }
  },
  created () {
    this.getall()
    this.gitAllHotel()
  },

  computed: {
    getFlag () {
      return this.flag
    }
  },
  components: { CoolTable, guiDanceForm, guiDanceEdit }
}
</script>

<style lang="scss" scoped>
::v-deep .switch-start {
  position: absolute;
  left: 9px;
  line-height: 18px;
}
::v-deep .switch-end {
  position: absolute;
  line-height: 18px;
  right: 11px;
}
::v-deep .switch-panel {
  position: relative;
  transition: 1s;
  width: 50px;
  height: 20px;
  margin-left: 30%;
  border-radius: 20px;
  background: #888;
  cursor: pointer;
}
::v-deep .switch-ico {
  left: 0;
  transition: 0.5s;
  float: left;
  margin-top: 1px;
  width: 18px;
  text-align: center;
  height: 18px;

  background: #fff;
  border-radius: 50%;
}
::v-deep .switch-left {
  background: #888;
}
::v-deep .switch-right {
  background: #13ce66;
}
::v-deep .switch-left .switch-ico {
  transform: translateX(0);
}
::v-deep .switch-right .switch-ico {
  transform: translateX(30px);
}
</style>