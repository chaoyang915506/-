<template>
  <div
    class="container-fluid"
    style="overflow: auto; width: 100%; height: 100%,backgroundColor:#f2f2f2"
  >
    <div v-if="count === 'home'">
      <h3>栏目管理</h3>
      <!-- 预留按钮 -->
      <el-button class="btn btn-primary" @click="addTopColumn"
        >添加顶级栏目</el-button
      >
      <el-button class="btn btn-success mr-2" @click="addWelcomepage"
        >欢迎页管理</el-button
      >
      <button
        v-if="topData.length > 1"
        class="btn btn-info mr-2"
        @click="topdatasort"
      >
        顶级栏目排序
      </button>
      <!-- 语言 -->
      <select
        v-model="languages"
        class="custom-select mr-2"
        @change="changelange"
      >
        <option
          :value="item.langId"
          v-for="item in languageList"
          :key="item.id"
        >
          {{ item.label }}
        </option>
      </select>
      <el-table
        class="mt-3 mb-4"
        :data="tableData"
        :row-key="getRowKeys"
        border
        :cell-style="cellStyle"
        style="width:100%"
        :expand-row-keys="expands"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column prop="item.itemId" label="ID" align="center">
        </el-table-column>
        <!--名称 -->
        <el-table-column prop="item.itemMenuName" label="名称" align="center">
        </el-table-column>
        <!-- 基础栏目 -->
        <el-table-column
          prop="item.itemMenuName"
          label="基础栏目"
          align="center"
          :formatter="hasBackFormat"
        >
        </el-table-column>
        <!-- UID -->
        <el-table-column
          prop="itemId"
          label="UID"
          align="center"
          :formatter="getUidcolumn"
        >
        </el-table-column>
        <!-- 启用 -->
        <el-table-column prop="item.isEnable" label="启用" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.item.isEnable"
              active-value="1"
              inactive-value="0"
              @change="(e) => changeCheckboxone(e, row.item)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column prop="itemId" label="操作" align="center" width="350">
          <template #default="{ row }">
            <el-tooltip
              class="item"
              effect="dark"
              content="添加子栏目"
              placement="top"
            >
              <button
                class="btn btn-primary btn-sm mr-3"
                @click="addSonColumn(row)"
              >
                <i class="el-icon-plus"></i>
              </button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="修改栏目"
              placement="top"
            >
              <button
                class="btn btn-success btn-sm mr-3"
                @click="editColumn(row)"
              >
                <i class="el-icon-edit"></i>
              </button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="修改栏目内容"
              placement="top"
            >
              <button
                class="btn btn-secondary btn-sm mr-3"
                @click="editColumnCounent(row)"
              >
                <i class="el-icon-edit-outline"></i>
              </button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="管理子栏目排序"
              placement="top"
            >
              <button
                v-if="row.children !== null && row.children.length > 1"
                class="btn btn-info btn-sm mr-3"
                @click="managecolumn(row)"
              >
                <i class="el-icon-d-caret"></i>
              </button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除栏目"
              placement="top"
            >
              <button
                class="btn btn-danger btn-sm mr-3"
                @click="delcolumn(row)"
              >
                <i class="el-icon-delete"></i>
              </button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <column-count
      v-if="count == 'count'"
      :tranfer="tranfer"
      @backhome="backhome"
      @clearform="clearform"
    ></column-count>
    <cool-modal
      :visible="modelVisible"
      style="    overflow: hidden;"
      title="拖拽排序"
      @hidden="modelVisible = false"
      :footer="{ visible: true }"
    >
      <table class="table" style="text-align: center">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">名称</th>
            <th scope="col">拖拽按钮</th>
          </tr>
        </thead>
        <tbody class="tbody-table">
          <tr v-for="idx in draglist" :key="idx.itemId">
            <td>{{ idx.itemId }}</td>
            <td>{{ idx.itemMenuName }}</td>
            <td><i class="my-handle bi bi-arrows-move"></i></td>
          </tr>
        </tbody>
      </table>
      <template #footer>
        <button class="btn btn-secondary" @click="modelVisible = false">
          返回
        </button>
        <button class="btn btn-primary mr-1" @click="submitSort">
          确定
        </button>
      </template>
    </cool-modal>
    <!-- 欢迎页 -->
    <welcome
      v-if="count == 'welcome'"
      :tranfer="tranfer"
      @goBack="clearform"
    ></welcome>
    <!-- 新增栏目管理 -->
    <add-column-count
      v-if="count == 'addcount'"
      :userLanguage="languageList"
      @backhome="backhome"
      :itemEdit="itemEdit"
      :editData="editData"
      :basicItemList="basicItemList"
      :columnListName="columnListName"
      :columnData="columnData"
    ></add-column-count>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import ColumnManageApi from '@/api/CoumnManageApi'
import env from '@/env'
import CoolModal from '@/components/CoolModal.vue'
import ColumnCount from '@/pages/columncount/ColumnCountApp.vue'
import Welcome from '@/views/welcome/WelcomeApp.vue'
import AddColumnCount from './AddColumnCount.vue'
export default {
  data() {
    return {
      count: 'home',
      //首页表格数据

      expands: [],
      languages: '', //用户选择的语言
      tableData: [],
      languageList: [], //语言
      basicList: [], //基础栏目
      checkedIds: [],
      // expandRowKeys: ['176', '6419'],//展开行的id数组
      modelVisible: false, //弹出框的显示隐藏
      draglist: [], //拖拽的数据
      topData: [],
      tranfer: {}, //传递的参数
      itemEdit: null, //传递顶级或者添加或者编辑的参数
      editData: 999, //识别编辑还是新增
      columnListName: [], //编辑内容看父级的栏目信息
      basicItemList: [], //基础栏目
      columnData: [],
    }
  },
  created() {
    this.getcolumn()
  },
  mounted() {
    this.rowDrop()
  },
  computed: {
    //sort调用接口的数据
    sortData() {
      return this.draglist.map((item) => item.itemBasicId)
    },
    sectionTwo() {
      let parentTwo = []
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].children == null) continue
        for (let j = 0; j < this.tableData[i].children.length; j++) {
          if (
            parentTwo.indexOf(this.tableData[i].children[j].item.itemId) == -1
          ) {
            parentTwo.push(this.tableData[i].children[j].item.itemId)
          }
        }
      }
      return parentTwo
    },
    firstColun() {
      let firstColun = []
      for (let i = 0; i < this.tableData.length; i++) {
        if (firstColun.indexOf(this.tableData[i].item.itemId)) {
          firstColun.push(this.tableData[i].item.itemId)
        }
      }
      return firstColun
    },
  },
  methods: {
    cellStyle(column) {
      /*  if (column.row.item.isEnable == 0 && column.columnIndex == 1) {
        return 'background:rgb(128, 128, 128);color:rgb(220, 220, 220);'
      }  */ if (
        column.row.item.parentItemId == '-1'
      ) {
        //顶级
        return 'background:#f5f5f5;'
      }
      //次顶级
      else if (this.firstColun.includes(column.row.item.parentItemId)) {
        return 'background:#dcdcdc;'
      } else if (this.sectionTwo.includes(column.row.item.parentItemId)) {
        return 'background:#c0c0c0'
      } else {
        return 'background:#a9a9a9'
      }
    },
    //清空表单
    clearform() {
      this.tranfer = null
      this.count = 'home'
    },
    getRowKeys(row) {
      return row.item.itemId
    },
    // 其他页跳转到当前的首页
    backhome() {
      this.getcolumn()
      this.count = 'home'
    },
    topdatasort() {
      this.draglist = this.topData
      this.modelVisible = true
    },
    //排序
    async submitSort() {
      try {
        await ColumnManageApi.itemlistSort(this.sortData)
        this.modelVisible = false
        await this.getcolumn()
        await this.$info('排序成功')
      } catch (error) {
        console.log(error)
        this.$error('排序失败')
      }
    },
    managecolumn(row) {
      this.draglist = row.children.map((ite) => ite.item)
      this.modelVisible = true
    },
    //删除栏目
    async delcolumn(row) {
      try {
        const res = await this.$confirm(
          '确定删除栏目？',
          '子栏目和栏目内容将被一起删除'
        )
        if (!res) return
        await ColumnManageApi.delColumnApi(row.item.itemBasicId)
        await this.getcolumn()
        this.$info('删除栏目成功')
      } catch (error) {
        this.$error('删除栏目失败')
      }
    },
    //编辑栏目内容
    editColumnCounent(row) {
      this.tranfer = {
        hotelId: env.hotelId,
        itemBasicId: row.item.itemBasicId,
      }
      this.count = 'count'
    },
    //编辑栏目
    async editColumn(row) {
      this.itemEdit = {
        itemId: row.item.itemId,
      }
      await this.getAllcolumn(row.item.itemBasicId)
      this.editData = 888
      this.count = 'addcount'
    },
    //添加子栏目
    async addSonColumn(row) {
      this.editData = 999
      this.itemEdit = {
        itemId: row.item.itemId,
        itemNameSortId: Array.isArray(row.children)
          ? row.children.length.toString()
          : '',
      }
      await this.getAllcolumn(row.item.itemBasicId)
      this.count = 'addcount'
    },
    //获取编辑或者新增的数据
    async getAllcolumn(val) {
      try {
        const columndata = await ColumnManageApi.getItemByBasicId(val)
        this.columnData = columndata
      } catch (error) {
        console.log(error)
      }
    },
    //添加欢迎页
    addWelcomepage() {
      this.count = 'welcome'
      this.tranfer = {
        guest: 'data',
      }
    },
    //添加顶级栏目
    addTopColumn() {
      this.itemEdit = {
        itemId: -8888,
        itemNameSortId: Array.isArray(this.tableData)
          ? this.tableData.length.toString()
          : '',
      }
      this.count = 'addcount'
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector('.table .tbody-table')
      const _this = this
      Sortable.create(tbody, {
        draggable: 'tr',
        handle: '.my-handle',
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.draglist.splice(oldIndex, 1)[0]
          _this.draglist.splice(newIndex, 0, currRow)
        },
      })
    },
    //启用的逻辑
    async changeCheckboxone(e, item) {
      try {
        await ColumnManageApi.setItemStatus({
          itemBasicId: item.itemBasicId,
          status: e,
        })
        await this.getcolumn()
        await this.$info('设置栏目状态成功')
      } catch (error) {
        this.$error('设置栏目状态失败')
      }
    },
    // id的样式和id
    idformatter(row) {
      return `<i class="my-handle bi bi-arrows-move"></i>+${row.item.itemId}`
    },
    //拼接UID
    getUidcolumn(row, column) {
      let data = this.basicList.find(
        (item) => item.itemBasicId == row.item.itemBasicId
      )
      let string = ''
      // 根据type的长度拼接只做了type上百位
      if (data.type.toString().length == 1) {
        string = '0000' + data.type.toString() + row.item.configType.toString()
      } else if (data.type.toString().length == 2) {
        string = '000' + data.type.toString() + row.item.configType.toString()
      } else {
        string = '00' + data.type.toString() + row.item.configType.toString()
      }
      return string
    },
    //处理基础栏目数据
    hasBackFormat(row, column) {
      if (row.item.itemBasicId == -1) {
        return '主页'
      } else {
        let data = this.basicList.find(
          (item) => item.itemBasicId == row.item.itemBasicId
        )
        return data.itemBasicDesc
      }
    },
    // 切换中英文
    changelange(e) {
      this.languages = e.target.value
      this.getcolumn(e.target.value)
    },
    //获取全部栏目
    async getcolumn(val) {
      const language = await ColumnManageApi.getlangagelist()
      this.languageList = language
      if (!val) {
        this.languages = language[0].langId
      }

      const basicDesic = await ColumnManageApi.getAllBasicList()
      this.basicList = basicDesic
      try {
        const colunmList = await ColumnManageApi.getTableData(this.languages)
        const colunmListName = await ColumnManageApi.getcolumnAllName()
        this.columnListName = colunmListName

        if (colunmList !== null && colunmList !== undefined) {
          this.topData = colunmList.map((ite) => {
            if (ite.item.parentItemId == '-1') {
              return ite.item
            }
          })
          this.tableData = colunmList
        }
      } catch (error) {
        console.log(error)
      }
      //基础栏目
      const basicItem = await ColumnManageApi.getUnusedBasicItems()
      this.basicItemList = basicItem
    },
  },
  components: {
    CoolModal,
    ColumnCount,
    AddColumnCount,
    Welcome,
  },
}
</script>
<style scoped lang="scss">
// 选择语言的样式
::v-deep .custom-select {
  width: 15%;
}
::v-deep .forbidden {
  background: #d3d3d3;
}
::v-deep .modal-dialog .modal-xl {
  height: 100%;
}
::v-deep .modal.show .modal-dialog {
  height: 100%;
}
::v-deep .modal-content {
  min-height: 10%;
  max-height: 90%;
}
::v-deep  .modal-body {
  height: 100%;
  padding: 0;
  overflow: auto;
}
::v-deep .modal-footer {
  justify-content: flex-start;
}
.table {
  margin-bottom: 0;
}
</style>
