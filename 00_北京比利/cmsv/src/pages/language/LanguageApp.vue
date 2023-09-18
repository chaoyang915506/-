<template>
  <div
    class="container-fluid"
    style="overflow: auto; width: 100%; height: 100%"
  >
    <div class="row">
      <div class="col-12">
        <h2>语言管理</h2>
      </div>
      <div class="col-12" v-if="view === 'table'">
        <cool-table
          @edit-row="editTable"
          :columns="columns"
          :data="tableData"
          :pageSize="10"
          ref="messageTable"
        >
          <button
            class="btn btn-primary mr-1 float-left"
            @click="view = 'form'"
          >
            添加
          </button>
          <button class="btn btn-danger mr-1 float-left" @click="refresh">
            刷新
          </button>
          <!-- <select-picker
            search
            :dropdown-data="dropdownData"
            placeholder="请选择..."
            v-model="defaultSelectText"
            @change="changeSelect"
          /> -->
          <select class="form-control serchsty" v-model="seleted">
            <option value="">全部</option>
            <option
              :value="item.langId"
              v-for="item in selectList"
              :key="item.langId"
            >
              {{ item.langDesc }}
            </option>
          </select>
        </cool-table>
      </div>
    </div>
    <div v-if="view === 'form'" class="row">
      <div class="col-6">
        <LanguageFrom
          @closefrom="closefrom"
          @close="close"
          :editData="editData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import LanguageApi from '@/api/LanguageApi'
import LanguageFrom from './LanguageFrom.vue'
export default {
  name: 'GalleryApp',
  data () {
    return {
      messageModel: '新增',
      view: 'table',//当前页面要显示的内容
      fileType: 'video',
      columns: [{
        checkbox: true
      }, {
        field: 'langId', title: 'ID', align: 'center'
      }, {
        field: 'langDesc', title: '语言名称', align: 'center'
      },
      {
        field: 'guestLanguage', title: '简写', align: 'center'
      },
      {
        field: 'langLabel', title: '标签', align: 'center'
      },
      {
        field: 'tag', title: '语言tag', align: 'center'
      },
      {
        field: 'langId', title: '操作', align: 'center',
        formatter: (val, row, idx) => {
          return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">修改</button>`
        }
      }],
      tableList: [],//表格数据
      //当前点击修改的id
      editId: '',
      // dropdownData: ['Vue', 'React', 'Angular', 'jQuery'],
      // defaultSelectText: '',
      selectList: [],
      seleted: '',//用户选择的语言
      clearI: ''
    }
  },
  created () {
    // this.getallData()
    this.getlang()
  },
  components: {
    CoolTable, LanguageFrom
  },
  methods: {
    // changeSelect ({ data, text }) {
    //   console.log(data)
    //   this.defaultSelectText = text
    // },
    //刷新
    refresh () {
      this.tableList = []
      // this.getallData()
      this.getlang()
    },
    //获取全部语言
    // async getallData () {
    //   try {
    //     const data = await LanguageApi.getShowCount()
    //     this.selectList = data.rows
    //     // console.log(data, '全部列表的数据')
    //   } catch (error) {
    //     console.log(error)
    //     this.$error('获取数据失败')
    //   }
    // },
    //获取全部列表数据
    async getlang () {
      try {
        let data = await LanguageApi.getalllanguage()
        // console.log(data, '全部语言的数据')
        this.tableList = data
        this.selectList = data
      } catch (error) {
        console.log(error)
        this.$error('获取数据失败')
      }
    },
    closefrom (val) {
      this.view = val
      this.editId = ''
    },
    //子传父关闭添加
    close (val) {
      this.view = val
      this.editId = '-8888'
      this.getlang()
    },
    //修改按钮
    editTable (val) {
      this.editId = val
      this.view = 'form'
    },
  },
  watch: {
    editId (newd) {
      console.log(newd, 'sdh')
      if (newd == 0) {
        this.editId = '-999'
      }
    }
  },
  computed: {
    tableData () {
      return this.seleted === '' ? this.tableList : this.tableList.filter(item => item.langId == this.seleted)
    },
    //获取点击修改的数据传给子级
    editData: {
      get () {
        if (this.editId) {
          // this.editId == '-999' ? this.tableData[0]:this.tableData.find(item => {item.langId == this.editId})
          if (this.editId == '-999') {
            return this.tableData[0]
          } else {
          console.log(this.tableData[0], '0')
          const data = this.tableData.find(item => {
            return item.langId == this.editId
          })
          return data
          }
        }
        else {
          return
        }
      }
    },
    //全部语言名称
    // langugeAll () {
    //   return this.tableList.map(item => item.langLabel)
    // }
    //
  },
}
</script>
<style lang="scss" scoped>
::v-deep .serchsty {
  float: left;
  display: inline-block;
  width: 30%;
}
::v-deep .bs-bars {
  width: 50%;
}
</style>