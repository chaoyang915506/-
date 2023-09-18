<template>
  <div
    class="container-fluid"
    style="overflow: auto; width: 100%; height: 100%"
  >
    <div v-if="view == 'table'">
      <h2>{{ vendor }}电影版权分组</h2>
      <cool-table
        ref="messageTable"
        :columns="columns"
        :data="tableData"
        @edit-row="editTable"
        @delete-row="deleteAll"
      >
        <!-- @delete-row="deleteAll" -->
        <button class="btn btn-primary ml-1" @click="addfile">
          新增
        </button>
        <!-- <button class="btn btn-danger ml-1" @click="delMessages">
                    批量删除
                </button> -->
      </cool-table>
    </div>
    <div v-if="view == 'form'" style="padding: 4%">
      <h4 class="mb-4">{{ title }}</h4>
      <vo v-slot="{ handleSubmit }">
        <form novalidate @submit.prevent="handleSubmit(submit)">
          <vp
            class="form-group mt-2"
            tag="div"
            v-slot="v"
            rules="required|max:30"
            name="分组名称"
          >
            <label class="control-label">分组名称</label>
            <div style="width: 50%">
              <input
                class="form-control"
                v-validate="v"
                placeholder="请输入内容"
                v-model="editData.class.name"
              />
            </div>
            <span class="err">{{ v.errors[0] }}</span>
          </vp>
          <!-- <div style="text-align: center"> -->
          <!-- :left-default-checked="[2, 3]"
                        :right-default-checked="[1]" -->
          <!-- :render-content="renderFunc" -->
          <!-- @change="handleChange" -->
          <vp class="form-group mt-2" tag="div" v-slot="v">
            <label class="control-label">选择{{ vendor }}</label>
            <el-transfer
              style="text-align: left; display: inline-block,width: 100%;"
              v-model="editData.hotelIds"
              class="mt-2"
              filterable
              :props="{
                key: 'hotelId',
                label: 'hotelName',
              }"
              :titles="[`未选中的${vendor}`, `已选中${vendor}`]"
              :button-texts="['到左边', '到右边']"
              :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}',
              }"
              :data="hoteldata"
            >
            </el-transfer>
            <span class="err">{{ v.errors[0] }}</span>
          </vp>
          <div class="form-group mt-2" style="float: right">
            <button class="btn btn-secondary" @click="backtable">
              返回
            </button>
            <button class="btn btn-primary ml-1">确定</button>
          </div>
          <!-- </div> -->
        </form>
      </vo>
    </div>
  </div>
</template>

<script>
class formda {
  constructor() {
    this.class = {
      desc: '',
      name: '',
    }
    this.hotelIds = []
  }
}
import MoviceCopyRightApi from '@/api/MoviceCopyRrightApi'
import CoolTable from '@/components/CoolTable.vue'
import env from '@/env'
export default {
  data() {
    return {
      vendor: env.vendor,
      columns: [
        // {
        //   checkbox: true,
        // },
        {
          field: '',
          title: '序号',
          align: 'center',
          formatter: (val, row, index) => {
            return index + 1
          },
        },
        {
          field: 'class.name',
          title: '分组名称',
          align: 'center',
        },
        {
          field: 'class.id',
          title: '操作',
          align: 'center',
          formatter: (val, row, idx) => {
            return `<button class="btn btn-primary btn-sm edit" data-val=${val} data-emit="edit-row">编辑</button>
                       <button class="btn btn-danger btn-sm" data-val=${val} data-emit="delete-row" >删除</button>
                      `
          },
        },
      ],
      view: 'table',

      title: '',
      editData: new formda(), //表单的数据
      hoteldata: [], //全部酒店数据
      tableData: [],
    }
  },
  components: {
    CoolTable,
  },
  created() {
    this.getCopyRight()
  },
  methods: {
    //返回到talbe
    backtable() {
      this.getCopyRight()
      this.view = 'table'
    },
    //获取全部的数据
    async getCopyRight() {
      try {
        //获取全部版权的数据
        const data = await MoviceCopyRightApi.getcopyright()
        this.tableData = data.list
        // console.log(data.list, 'dat')
        //全部酒店
        const hotelList = await MoviceCopyRightApi.getHotelList()
        this.hoteldata = hotelList
        // console.log(hotelList, 'lsit')
      } catch (error) {
        this.$error(error)
      }
    },
    // handleChange (value, direction, movedKeys) {
    //     console.log(value, direction, movedKeys)
    // },
    //编辑
    editTable(val) {
      this.editData = this.tableData.find((item) => item.class.id == val)
      this.title = '编辑'
      this.view = 'form'
    },
    // 新增
    addfile() {
      this.editData = new formda()
      this.title = '新增'
      this.view = 'form'
    },
    // //删除多个
    // async delMessages () {
    //     let selections = this.$refs.messageTable.getSelections()
    //     if (selections.length == 0) return
    //     try {
    //         const ok = await this.$confirm('删除！', `确定删除此项吗`)
    //         if (!ok) return
    //         await MoviceCopyRightApi.deletemediaTypes({ ids: selections.map(item => item.id) })
    //         await this.$refs.messageTable.refresh()
    //         await this.$info('删除成功')
    //     } catch (error) {
    //         console.log(error)
    //         this.$error('删除失败', '删除配置分组失败')
    //     }
    // },
    //删除单个
    async deleteAll(val) {
      try {
        const res = await this.$confirm('提示', `确定删除此项吗？`)
        if (!res) return
        await MoviceCopyRightApi.delcopyright([val])
        await this.getCopyRight()
        await this.$info('删除数据成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 新建和编辑
    async submit() {
      try {
        // console.log(this.editData.hotelList)
        if (this.editData.hotelIds.length == 0)
          return this.$error(`${env.vendor}不能为空！`)

        if (this.editData.class.id) {
          await MoviceCopyRightApi.editcopyright(this.editData)
          await this.backtable()
          await this.$info('编辑成功')
        } else {
          await MoviceCopyRightApi.addcopyright(this.editData)
          await this.backtable()
          await this.$info('添加成功')
        }
      } catch (error) {
        this.$error(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
// *号
.control-label:before {
  color: red;
  content: '*';
  position: absolute;
  margin-left: -10px;
}
//错误样式
.err {
  font-size: 12px;
  position: absolute;
  width: 100%;
  margin-bottom: 0.25rem;
  font-size: 80%;
  color: #dc3545;
}
::v-deep .form-group {
  position: relative;
  margin-bottom: 2 rem;
}
.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}
::v-deep .el-transfer-panel {
  width: 34%;
  border: 1 px solid black;
  min-height: 460px;
}
::v-deep .el-transfer-panel__list.is-filterable {
  // height: 460px;
  height: 340px;
} // *号
.control-label:before {
  color: red;
  content: '*';
  position: absolute;
  margin-left: -10px;
}
//穿梭框的样式问题
::v-deep .el-button--primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}
::v-deep .el-button--primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}
::v-deep .el-transfer__button.is-disabled,
.el-transfer__button.is-disabled:hover {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}
::v-deep .el-transfer-panel__item.el-checkbox .el-checkbox__label {
  color: #212529;
}
::v-deep .el-checkbox__inner {
  border: 1 px solid black;
}
//错误样式
.err {
  font-size: 12px;
  position: absolute;
  width: 100%;
  font-size: 80%;
  color: #dc3545;
}
</style>
