<template>
  <div
    class="container-fluid"
    style=" overflow:auto; width:100%; height:100%;"
  >
    <div class="row">
      <div class="col-12">
        <h2>设备厂商管理 </h2>
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
        </cool-table>
      </div>
    </div>
    <div
      v-if="view === 'form'"
      class="row"
    >
      <!-- DaviceFirmFrom -->
      <div class="col-6">
        <davice-firm-from
          @close="close"
          :editData="editData"
          :allid="allid"
        ></davice-firm-from>
      </div>
    </div>
  </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import DaviceFirmFrom from './DevicefirmForm.vue'
import DeviceFirmApi from '@/api/DeviceFirmApi'
export default {
  data () {
    return {
      view: 'table',
      columns: [{
        checkbox: true
      }, {
        field: 'vendorId', title: 'ID', align: 'center'
      }, {
        field: 'vendorName', title: '厂商名称', align: 'center'
      },
      {
        field: 'vendorDesc', title: '描述', align: 'center'
      },
      {
        field: 'vendorId', title: '操作', align: 'center',
        formatter: (val, row, idx) => {
          return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">修改</button>
                            <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row" >删除</button>`
        }
      }],
      tableList: [],
      editId: '', allid: []
    }
  },
  created () {
    this.getallData()
  },
  computed: {
    tableData () {
      return this.tableList
    },
    editData () {
      return this.tableData.filter(item => item.vendorId == this.editId)[0]
    }

  },
  methods: {
    //获取全部数据
    async getallData () {
      try {
        const data = await DeviceFirmApi.getfirm()
        this.tableList = data.list
        this.allid = data.list.map(item => item.vendorId)
        // console.log(data.list)
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
        console.log(id)
        await DeviceFirmApi.delData([id])
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
      console.log(selections, 'seltcet')
      if (selections.length === 0) {
        return
      }
      try {
        const ok = await this.$confirm('删除')
        if (!ok) {
          return
        }
        await DeviceFirmApi.delData(selections.map(v => v.vendorId))
        await this.$info('删除成功')
        this.getallData()
      } catch (error) {
        console.error(error)
        this.$error('删除失败')
      }
    },
  },
  components: {
    CoolTable, DaviceFirmFrom
  },
}
</script>

<style lang="scss" scoped>
</style>