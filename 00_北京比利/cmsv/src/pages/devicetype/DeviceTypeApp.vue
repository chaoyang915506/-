<template>
  <div
    class="container-fluid"
    style=" overflow:auto; width:100%; height:100%;"
  >
    <div class="row">
      <div class="col-12">
        <h2>设备类型管理 </h2>
      </div>
      <div
        class="col-12"
        v-if="view === 'table'"
      >
        <cool-table
          @edit-row="editTable"
          :columns="columns"
          :data="tableData"
          :pageSize="10"
          @del-row="delMessage"
          ref="messageTable"
        >
          <button
            class="btn btn-primary"
            @click="view = 'form'"
          >添加</button>
          <button
            class="btn btn-danger ml-1"
            @click="delMessages"
          >删除</button>
          <div class="form-group divsty ml-1">
            <select
              class="form-control"
              id="exampleFormControlSelect1"
              v-model="selectedate"
            >
              <option value="">全部电视型号</option>
              <option
                v-for="item in $store.state.firm"
                :key="item.vendorId"
                :value="item.vendorId"
              >{{item.vendorName}}</option>

            </select>
          </div>
        </cool-table>
      </div>
    </div>
    <div
      v-if="view === 'form'"
      class="row"
    >
      <div class="col-6">
        <davice-from
          @close="close"
          :editData="editData"
          :allid="allid"
        ></davice-from>
      </div>
    </div>
  </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import DeviceTypeApi from '@/api/DeviceTypeApi'
import DaviceFrom from './DeviceForm.vue'
import { mapState } from 'vuex'
import store from '@/store'
export default {
  data () {
    return {
      view: 'table',
      columns: [{
        checkbox: true
      }, {
        field: 'id', title: 'ID', align: 'center'
      }, {
        field: 'vendorId', title: '厂商名称', align: 'center',
        formatter: (val, row, idx) => {
          let data = this.firm.find(item => item.vendorId === val)
          if (!data) {
            return '-'
          }
          return data.vendorName
        }
      },
      {
        field: 'name', title: '名称', align: 'center'
      },
      {
        field: 'desc', title: '描述', align: 'center'
      },
      {
        field: 'id', title: '操作', align: 'center',
        formatter: (val, row, idx) => {
          return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">修改</button>
                            <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row" >删除</button>`
        }
      }],
      tableList: [{ 'id': 1, 'vendorId': 2, 'name': 'dksfjsd', 'desc': 'dfjdksj' }],
      editId: '',//编辑id
      selectedate: "",
      allid: []
    }
  },
  created () {
    this.getallData()
  },
  computed: {
    ...mapState(['firm']),
    tableData () {
      return this.selectedate === "" ? this.tableList : this.tableList.filter(item => item.vendorId === this.selectedate)
    },
    editData () {
      return this.tableData.filter(item => item.id === this.editId)[0]
    }
  },
  methods: {
    //获取全部数据
    async getallData () {
      try {
        const data = await DeviceTypeApi.getAllDevice()
        //保存数据到tableData
        this.tableList = data.list
        this.allid = data.list.map(item => item.id)
        // console.log(data.list, '数据')

      } catch (error) {
        this.$error('获取数据失败')
      }
    },
    //子传父关闭添加
    close (val) {
      this.view = val
      this.editId = ''
      this.getallData()
    },
    //修改按钮
    editTable (val) {
      // console.log(val)
      this.editId = val
      this.view = 'form'
    },
    // 删除单个
    async delMessage (id) {
      try {
        const ok = await this.$confirm('删除')
        console.log(ok)
        if (!ok) {
          return
        }
        // 调用接口
        // console.log(id)
        await DeviceTypeApi.delData([id])
        await this.$info('删除成功')
        this.getallData()
        // this.refresh()
      } catch (error) {
        console.error(error)
        this.$error('删除失败')
      }
    },
    // 删除多个
    async delMessages () {
      const selections = this.$refs.messageTable.getSelections()
      if (selections.length === 0) {
        return
      }
      try {
        const ok = await this.$confirm('删除')
        if (!ok) {
          return
        }
        await DeviceTypeApi.delData(selections.map(v => v.id))
        await this.$info('删除成功')
        this.getallData()
      } catch (error) {
        console.error(error)
        this.$error('删除失败')
      }
    },
  },
  components: {
    CoolTable, DaviceFrom
  },
}
</script>

<style lang="scss" scoped>
::v-deep .divsty {
  float: right;
  width: 150px;
}
</style>