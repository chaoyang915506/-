<template>
  <div>
    <div v-if="view == 'table'">
      <h2>基础配置管理</h2>
      <div class="card">
        <div class="card-header">查询条件</div>
        <div class="card-body row">
          <div class="col-4 mb-3">
            <label class="col-sm-5"> 分组名称 </label>
            <div class="col-sm-7" style="display: inline-block">
              <input type="text" class="form-control" v-model="groupname" />
            </div>
          </div>
        </div>
      </div>
      <cool-table
        @edit-row="editTable"
        @del-row="manageCity"
        ref="messageTable"
        :columns="columns"
        :data="tableData"
        @config-row="configFn"
      >
        <button class="btn btn-primary ml-1" @click="addfile">
          添加
        </button>
        <button class="btn btn-danger ml-1" @click="delMessages">
          删除
        </button>
        <button class="btn btn-primary ml-1" @click="backmanage">
          返回
        </button>
      </cool-table>
    </div>
    <div v-if="view == 'transfer'" class="container">
      <div class="row mt-4">
        <div class="col-5">
          <!-- 区域中文名 -->
          <div class="form-inline">
            <label class="mr-4">未添加的配置</label>
            <div class="input-group mb-2 mr-sm-2">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  <i class="bi bi-search"></i>
                </div>
              </div>
              <input type="text" v-model="allareaSearch" class="form-control" />
            </div>
          </div>
          <!-- 盒子 -->
          <div class="boxstyle" ref="leftbox">
            <ul>
              <li
                v-for="(item, index) in residuceList"
                :key="item.id"
                @click="moveitemAll(item, index)"
              >
                <p>{{ item.key }}&nbsp;|&nbsp;{{ item.name }}</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-2 center">
          <div style="display: flex; flex-direction: column">
            <i
              class="bi bi-arrow-right-square-fill iconsize"
              @click="rightAll"
            ></i>
            <i
              class="bi bi-arrow-left-square-fill iconsize"
              @click="leftAll"
            ></i>
          </div>
        </div>
        <div class="col-5">
          <!-- 区域中文名 -->
          <div class="form-inline">
            <label class="mr-4">已添加的配置</label>
            <div class="input-group mb-2 mr-sm-2">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  <i class="bi bi-search"></i>
                </div>
              </div>
              <input type="text" v-model="checkedSearch" class="form-control" />
            </div>
          </div>
          <!-- 盒子 -->
          <div class="boxstyle" ref="rightbox">
            <ul>
              <li
                v-for="(item, index) in childrenSeledList"
                :key="item.id"
                @click="pruneList(item, index)"
              >
                <p>{{ item.key }}&nbsp;|&nbsp; {{ item.name }}</p>
              </li>
            </ul>
          </div>
          <div class="mt-4">
            <button class="btn btn-primary" @click="saveSubmit">
              保存
            </button>
            <button class="btn btn-secondary ml-1" @click="backprePage">
              返回
            </button>
          </div>
        </div>
      </div>
    </div>
    <cool-modal
      :visible="modelVisible"
      :title="title"
      @hidden="modelVisible = false"
      :footer="{ visible: false }"
    >
      <vo v-slot="{ handleSubmit }" class="col-sm-6" v-if="modelVisible">
        <form novalidate @submit.prevent="handleSubmit(submit)">
          <vp
            class="form-group"
            tag="div"
            v-slot="v"
            rules="required"
            v-if="editData.id !== '-1'"
          >
            <label class="labelClass">id</label>
            <div style="width: 100%">
              <input
                class="form-control"
                v-model="editData.id"
                v-validate="v"
              />
            </div>
            <span class="err">{{ v.errors[0] }}</span>
          </vp>
          <vp
            class="form-group"
            tag="div"
            v-slot="v"
            name="组名"
            rules="required"
          >
            <label class="labelClass">name</label>
            <div style="width: 100%">
              <input
                class="form-control"
                v-model="editData.name"
                v-validate="v"
              />
            </div>
            <span class="err">{{ v.errors[0] }}</span>
          </vp>
          <vp
            class="form-group"
            tag="div"
            v-slot="v"
            name="描述"
            rules="required"
          >
            <label class="labelClass">desc</label>
            <input
              class="form-control"
              v-validate="v"
              v-model="editData.desc"
            />
            <span class="err">{{ v.errors[0] }}</span>
          </vp>
          <div class="form-group mt-4">
            <button type="button" class="btn btn-secondary" @click="closepop">
              关闭
            </button>
            <button type="submit" class="btn btn-primary ml-1">
              确定
            </button>
          </div>
        </form>
      </vo>
      <!--  -->
    </cool-modal>
  </div>
</template>

<script>
class formda {
  constructor() {
    this.name = ''
    this.desc = ''
    this.id = '-1'
  }
}
import { syscnfMetaListApi } from '@/api/SyscnfApi'
import CoolTable from '@/components/CoolTable.vue'
import CoolModal from '@/components/CoolModal.vue'
import env from '@/env'
export default {
  data() {
    return {
      view: 'table',
      columns: [
        {
          checkbox: true,
        },
        {
          field: 'id',
          title: 'id',
          align: 'center',
        },
        {
          field: 'name',
          title: '名称',
          align: 'center',
        },
        {
          field: 'desc',
          title: '描述',
          align: 'center',
        },
        {
          field: 'id',
          title: '操作',
          align: 'center',
          formatter: (val, row, idx) => {
            return `
                  <button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">修改</button>
                      <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row" >删除</button>
                      <button class="btn btn-info btn-sm" data-val=${val} data-emit="config-row" >配置配置</button>
                      `
          },
        },
      ],
      tableList: [],
      groupname: '',
      modelVisible: false,
      title: '',
      editData: new formda(),
      excbygroupList: [], //全部的
      Incbygrouplist: [], //右侧部分的
      allareaSearch: '', //已添加的区域search
      checkedSearch: '', //未添加的区域search
      configId: '', //配置的id
    }
  },
  components: {
    CoolTable,
    CoolModal,
  },
  computed: {
    tableData() {
      let groupname = new RegExp(this.groupname, 'ig')
      return this.tableList.filter((item) => {
        return this.groupname == '' ? true : groupname.test(item.name)
      })
    },
    // 未选的全部
    residuceList() {
      let condition = RegExp(this.allareaSearch, 'ig')
      return this.excbygroupList.filter((item) => {
        return this.allareaSearch == ''
          ? true
          : condition.test(item.key) || condition.test(item.name)
      })
    },
    //子区域
    childrenSeledList() {
      let condition = RegExp(this.checkedSearch, 'ig')
      return this.Incbygrouplist.filter((item) => {
        return this.checkedSearch == ''
          ? true
          : condition.test(item.key) || condition.test(item.name)
      })
    },
  },
  created() {
    this.getAllData()
  },
  methods: {
    backprePage() {
      this.getAllData()
      this.view = 'table'
    },
    async getcolumn() {
      try {
        const data = await MediaSortApi.getColumnApi()

        this.selectColumn = data[0].itemBasicId

        this.columnList = data
        const seled = await MediaSortApi.getColumnCountApi(
          this.columnList.find((idx) => idx.itemBasicId == this.selectColumn)
            .type
        )
        // console.log(seled)
        this.AllNotSeled = seled
      } catch (error) {
        console.log(error)
      }
    },
    //右边全部
    rightAll() {
      // console.log('goright')
      // console.log('goright')
      if (this.residuceList.length == 0) return
      this.Incbygrouplist = [...this.childrenSeledList, ...this.residuceList]
      let arr = []
      this.excbygroupList.forEach((it) => {
        let index = this.residuceList.findIndex((idx) => {
          if (it.id == idx.id) return true
        })
        if (index == -1) {
          arr.push(it)
        }
      })
      this.excbygroupList = arr
      this.$nextTick(() => {
        this.$refs.rightbox.scrollTop = this.$refs.rightbox.scrollHeight
      })
    },
    leftAll() {
      // console.log('goleft', this.ChildrenList.length)
      if (this.childrenSeledList.length == 0) return
      this.excbygroupList = [...this.residuceList, ...this.childrenSeledList]
      let arr = []
      this.Incbygrouplist.forEach((idx) => {
        let index = this.childrenSeledList.findIndex((item) => {
          if (item.id == idx.id) return true
        })
        if (index == -1) {
          arr.push(idx)
        }
      })

      this.Incbygrouplist = arr
      this.$nextTick(() => {
        // console.log(this.$refs.leftbox.scrollHeight)
        this.$refs.leftbox.scrollTop = this.$refs.leftbox.scrollHeight
      })
    },
    //给选中区域添加
    moveitemAll(item, index) {
      // console.log('添加')
      this.excbygroupList = this.residuceList.filter(
        (idx) => idx.id !== item.id
      )
      this.Incbygrouplist.push(item)
      this.$nextTick(() => {
        this.$refs.rightbox.scrollTop = this.$refs.rightbox.scrollHeight
      })
    },
    //给选中区域删除
    pruneList(item, index) {
      this.Incbygrouplist = this.Incbygrouplist.filter(
        (idx) => idx.id !== item.id
      )
      this.excbygroupList.push(item)
      this.$nextTick(() => {
        // console.log(this.$refs.leftbox.scrollHeight)
        this.$refs.leftbox.scrollTop = this.$refs.leftbox.scrollHeight
      })
    },
    //保存排序
    async saveSubmit() {
      try {
        let listM = this.Incbygrouplist.map((item, index) => {
          return {
            sort: index,
            syscnfId: item.id,
            groupId: this.configId,
          }
        })
        // console.log(listM, '数据们')
        if (listM.length > 0) {
          await syscnfMetaListApi.delAndSave({
            groupId: this.configId,
            list: listM,
          })
        } else {
          await syscnfMetaListApi.deleteByGroupId(this.configId)
        }
        await this.getAllData()
        // this.view = 'table'
        swal({
          title: '保存成功',
          icon: 'success',
          buttons: true,
          buttons: ['继续查看', '返回'],
        }).then((res) => {
          console.log(res, 'res')
          // Incbygrouplist
          if (res == true) {
            this.Incbygrouplist = []
            this.getAllData()
            this.view = 'table'
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 配置配置
    async configFn(val) {
      this.configId = val
      this.view = 'transfer'
      try {
        const excbygroup = await syscnfMetaListApi.getExcByGroupId(val)
        this.excbygroupList = excbygroup
        // console.log(excbygroup, 'excbygroup')

        const Incbygroup = await syscnfMetaListApi.getIncByGroupId(val)
        // console.log(Incbygroup, 'incybgroup')
        if (Incbygroup == null) {
          this.Incbygrouplist = []
        } else {
          this.Incbygrouplist = Incbygroup
        }
      } catch (error) {
        console.log(error)
      }
    },
    //返回table
    backmanage() {
      this.$emit('backtable')
    },
    closepop() {
      this.editData = {}
      this.getAllData()
      this.modelVisible = false
    },
    //data
    async getAllData() {
      try {
        const data = await syscnfMetaListApi.getGroupPage()
        this.tableList = data.rows
      } catch (error) {
        console.log(error)
      }
    },
    // 新增
    addfile() {
      this.editData = new formda()
      this.title = '添加配置分组'
      this.modelVisible = true
    },
    //删除多个
    async delMessages() {
      let selections = this.$refs.messageTable.getSelections()
      if (selections.length == 0) return
      try {
        const ok = await this.$confirm('删除！', `确定删除配置分组吗？`)
        if (!ok) return
        await syscnfMetaListApi.batchDeleteAll({
          ids: selections.map((item) => item.id),
        })
        await this.getAllData()
        await this.$info('删除成功')
      } catch (error) {
        console.log(error)
        this.$error('删除失败', '删除配置分组失败')
      }
    }, //删除单个
    async manageCity(val) {
      try {
        const res = await this.$confirm('提示', `确定删除此项吗？`)
        if (!res) return
        await syscnfMetaListApi.deleteGroup(val)
        await this.getAllData()
        await this.$info('删除数据成功')
      } catch (error) {
        console.log(error)
      }
    },
    //编辑的点击
    editTable(val) {
      this.title = '编辑配置分组'
      this.editData = this.tableData.find((item) => item.id == val)
      this.modelVisible = true
    },
    // 新建和编辑
    async submit() {
      try {
        if (this.editData.id !== '-1') {
          await syscnfMetaListApi.updateGroup(this.editData)
          await this.getAllData()
          this.modelVisible = false
          await this.$info('编辑成功')
          this.refresh()
        } else {
          await syscnfMetaListApi.updateAdd(this.editData)
          await this.getAllData()
          this.modelVisible = false
          await this.$info('添加成功')
          this.refresh()
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .modal-body {
  padding: 1rem 6rem;
}
::v-deep .labelClass {
  min-width: 15%;
}
::v-deep .form-group {
  position: relative;
  margin-bottom: 5%;
  display: flex;
  justify-content: right;
  align-items: center;
}
.err {
  font-size: 12px;
  position: absolute;
  color: #dc3545;
  width: 100%;
  left: 16%;
  bottom: -52%;
}
@media screen and(min-width:0px) and(max-width:1000px) {
  ::v-deep .form-group {
    position: relative;
    margin-bottom: 10%;
    display: flex;
    justify-content: right;
    align-items: center;
  }
}
.iconsize {
  font-size: 35px;
  color: #007bff;
  border-color: #007bff;
}
.center {
  // padding: 41% 0 41% 4%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
::v-deep .form-inline .input-group,
.form-inline .custom-select {
  width: 55%;
}

label {
  width: 20%;
}
.boxstyle {
  margin-top: 5%;
  text-align: center;
  width: 83%;
  border: 2px solid #007bff;
  height: 600px;
  padding: 5% 5% 5% 0;
  border-radius: 10px;
  overflow: auto;
}
li {
  list-style: none;
  margin-bottom: 3%;
  margin-right: 6%;
  border-bottom: 1px solid #8f8f8f;
  padding-bottom: 5%;
}
p {
  padding: 0;
  margin: 0;
  line-height: 1.4;
  word-wrap: break-word;
  font-weight: 700;
}
</style>
