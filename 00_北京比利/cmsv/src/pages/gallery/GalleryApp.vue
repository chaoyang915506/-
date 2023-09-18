<template>
  <div
    class="container-fluid"
    style="overflow: auto; width: 100%; height: 100%"
  >
    <div class="row">
      <div class="col-12">
        <h2>左邻右舍</h2>
      </div>
      <div class="col-12" v-if="view === 'table'">
        <cool-table
          @edit-row="editTable"
          :columns="columns"
          :data="tableData"
          :pageSize="10"
          @del-row="delMessage"
          ref="messageTable"
          @del-sort="delsort"
        >
          <button class="btn btn-primary floatL" @click="view = 'form'">
            添加
          </button>
          <button class="btn btn-danger ml-1 floatL" @click="delMessages">
            删除
          </button>
          <button class="btn btn-primary ml-1 floatL" @click="clickBgc">
            <i class="bi bi-pencil"></i> <span>内容背景</span>
          </button>
          <select
            class="form-control selectsty ml-1 floatL"
            v-model="selectData"
          >
            <option selected value="">全部园区</option>
            <option
              :value="item.hotelId"
              v-for="item in gardenList"
              :key="item.hotelId"
            >
              {{ item.hotelName }}
            </option>
          </select>
        </cool-table>
      </div>
    </div>
    <div v-if="view === 'form'" class="row">
      <div class="col-6">
        <GalleryForm
          @close="close"
          :editData="editData"
          :vaule="messageModel"
        />
      </div>
    </div>
    <!-- 背景图的上传 -->
    <div v-if="view === 'contpic'" class="row">
      <div class="col-6">
        <form>
          <div class="form-group">
            <label>内容背景图</label>
            <cool-file-input
              v-model="bagpic"
              :uploadUrl="backgroundImgUrl"
              fileType="image"
              :extensions="['jpg','png']"
            />
          </div>
          <div class="form-group">
            <button type="button" @click="submitbgc" class="btn btn-primary">
              确定
            </button>
            <button
              type="button"
              class="btn btn-secondary ml-1"
              @click="closetable"
            >
              返回
            </button>
          </div>
        </form>
      </div>
    </div>
    <transition name="fade">
      <div v-if="sample_modal">
        <div class="modal" v-on:click.self="sample_modal = false">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">排序</h4>
                <button
                  type="button"
                  class="close"
                  v-on:click="sample_modal = false"
                >
                  ×
                </button>
              </div>
              <form @submit.prevent="submitpage">
                <div class="modal-body">
                  <input
                    placeholder="输入序号将排序到指定序号位置"
                    v-model="userpage"
                    v-myfocus
                    type="number"
                    class="form-control"
                    required
                    min="1"
                    :max="tableData.length"
                  />
                </div>
                <div class="modal-footer">
                  <button type="submit" class="btn btn-primary">确定</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="modal-backdrop show"></div>
      </div>
    </transition>
  </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import GalleryForm from './GalleryForm.vue'
import GalleryApi from '@/api/GalleryApi'
import Sortable from 'sortablejs'
import { mapState } from 'vuex'
import UploadApi from '@/api/UploadApi'
import CoolFileInput from '@/components/CoolFileInput.vue'
import Axios from 'axios'
import env from '@/env'
export default {
  name: 'GalleryApp',
  data () {
    return {
      messageModel: '新增',
      view: 'table',//当前页面要显示的内容
      fileType: 'video',
      // 背景图URL
      backgroundImgUrl: UploadApi.getUrl('image'),
      columns: [{
        checkbox: true
      },
      {
        field: '',
        title: '序号',
        sortable: true,
        align: "center",
        width: 40,
        formatter: function (value, row, index) {
          return index + 1
        }
      }, {
        field: 'type', title: '类型', align: 'center',
        formatter: (val, row, idx) => val === 0 ? '图片' : '视频'
      }, {
        field: 'author', title: '作者', align: 'center',
        // formatter: (val, row, idx) => val.find(v => v.langId === 1).name
      },
      {
        field: 'hotelIdName', title: '园区', align: 'center'
      },
      {
        field: 'title', title: '内容标题', align: 'center'
      },
      {
        field: 'text', title: '内容描述', align: 'center'
      },
      {
        field: 'id', title: '拖拽排序', align: 'center',
        formatter: (val, row, idx) => {
          return `<i class="my-handle bi bi-arrows-move"></i>`
        }
      },
      {
        field: 'id', title: '操作', align: 'center',
        formatter: (val, row, idx) => {
          return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">修改</button>
                            <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row" >删除</button>
                             <button class="btn btn-primary btn-sm" data-val=${idx} data-emit="del-sort" >排序</button>`
        }
      }],
      tableList: [
      ],//表格数据
      //当前点击修改的id
      editId: '',
      gardenList: [],
      selectData: '',
      sample_modal: false,
      userpage: '',
      indexd: '',
      bagpic: '',//背景图片
    }
  },
  created () {
    this.getLinkData()
  },
  directives: {
    myfocus: {
      inserted: function (el, binding) {
        //console.log(el)
        el.focus()
      }
    }
  },
  components: {
    CoolTable, GalleryForm, CoolFileInput
  },
  methods: {
    closetable () {
      this.bagpic = ''
      this.view = 'table'
      this.getLinkData()
    },
    clickBgc () {
      // try {
      //   this.view = 'contpic'
      //   const data = await GalleryApi.getupdata()
      //   this.bagpic = data.data.data.url
      //   this.view = 'contpic'
      // } catch (error) {
      //   console.log(error)
      // }
      // this.view = 'contpic'
      GalleryApi.getupdata().then(data => {
        if (data.data.data) {
          this.bagpic = data.data.data.url
        } else {
          this.bagpic = ''
        }

      }).then(() => {
        this.view = 'contpic'
      }).catch((err) => {
        console.log(err)
      })
    },
    //提交背景图片
    submitbgc () {
      if (!this.bagpic) {
        //multipart/form-data
        this.$error('请选择要上传的内容背景图')
      } else {
        const params = new URLSearchParams()
        params.append('url', this.bagpic)
        Axios.post(this.updataPic, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          // console.log(res, '成功')
          this.$info('上传成功')
          this.closetable()
        }).catch((err) => {
          console.log(err)
          this.$error('上传失败')
        })
      }
    },
    async getLinkData () {
      await this.getgarden()
      await this.getallData()
      this.selectData = 1
      this.rowDrop()
      setTimeout(() => {
        this.selectData = ""
      }, 30)
    },
    delsort (idx) {
      this.sample_modal = true
      this.indexd = idx
    },//确定跳转
    submitpage () {
      let num = JSON.parse(JSON.stringify(this.userpage)) - 1
      this.drapin(num, this.indexd)
      this.sample_modal = false
      this.userpage = '',
        this.indexd = ''
    },
    //获取园区数据
    getgarden () {
      GalleryApi.getdata().then(data => {
        // console.log(data.data.list, 'sdfad')
        this.gardenList = data.list
      }).catch((error) => {
        console.log(error)
        // this.$error('获取数据失败')
      })
    },
    //获取全部数据
    async getallData () {
      try {
        const data = await GalleryApi.getShowCount()
        //保存数据到tableData
        this.tableList = data.list
      } catch (error) {
        this.$error('获取数据失败')
      }
    },//重新获取数据
    getdata () {
      this.getallData()
    },
    //子传父关闭添加
    close (val) {
      this.view = val
      this.editId = ''
      this.getallData()
      this.getLinkData()
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
        // console.log(ok)
        if (!ok) {
          return
        }
        // 调用接口
        // console.log(id)
        await GalleryApi.delData([id])
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
        await GalleryApi.delData(selections.map(v => v.id))
        await this.$info('删除成功')
        this.getallData()
      } catch (error) {
        console.error(error)
        this.$error('删除失败')
      }
    },
    // 行拖拽
    rowDrop () {
      // 此时找到的元素是要拖拽元素的父容器
      const tbody = document.querySelector('.table tbody')
      const _this = this
      Sortable.create(tbody, {
        //  指定父元素下可被拖拽的子元素
        draggable: "tr",
        handle: ".my-handle",
        onEnd ({ newIndex, oldIndex }) {
          // console.log(arr, 'shuju2')
          _this.drapin(newIndex, oldIndex)
          // console.log(this.tableData[oldIndex], oldIndex, 'shuju')
          const currRow = _this.tableData.splice(oldIndex, 1)[0]
          _this.tableData.splice(newIndex, 0, currRow)
        }
      })
    },
    //处理数据
    async drapin (i, j) {
      // i新的下标  j 旧的下标
      // 如果新的下标大于旧的向下拖拽 如果旧的下标大于新的向上拖拽
      let idArr = []
      let sotrArr = []
      let node
      if (i > j) {
        //向下拖拽
        // this.tableData.forEach(item=>{
        // sort 向下拖拽是越来越大
        // })
        for (let it = j; it <= i; it++) {
          idArr.push(this.tableData[it].id)
          sotrArr.push(this.tableData[it].sort)
          // sort1.push(this.tableData[it].sort)
        }
        idArr.push(idArr[0])
        // idArr.shift()
        idArr.splice(0, 1)
        node = idArr.map(item => {
          return {
            id: item
          }
        })
        sotrArr.forEach((item, index) => {
          node[index]['sort'] = item
        })
      } else {
        //新1 旧的29
        for (let it = i; it <= j; it++) {
          idArr.push(this.tableData[it].id)

          sotrArr.push(this.tableData[it].sort)
        }
        // console.log(idArr)
        idArr.unshift(idArr[idArr.length - 1])
        // idArr.splice(j, 1)
        // idArr.splice(idArr[idArr.length - 1], 1)
        idArr.pop()
        node = idArr.map(item => {
          return {
            id: item
          }
        })
        sotrArr.forEach((item, index) => [
          node[index]['sort'] = item
        ])

      }
      try {
        const data = await GalleryApi.sortData(node)
        this.getallData()
        this.$info('排序成功')
      } catch (error) {
        this.$error('排序失败')
        this.getallData()
      }
    }
  },
  mounted () {
    this.rowDrop()

  },
  computed: {
    updataPic () {
      return env.cms + '/cms/gallery/background?token=' + env.token
    },
    ...mapState(['graden']),
    tableData () {
      let bd = this.tableList
      bd.forEach(item => {
        return this.graden.forEach(j => {
          if (item.authorOrg == j.hotelId) {
            item.hotelIdName = j.hotelName
          }
        })
      })

      return this.selectData == '' ? bd : bd.filter(item => item.authorOrg === this.selectData)

    },
    //获取点击修改的数据传给子级
    editData: {
      get () {
        if (this.editId) {
          const data = this.tableData.filter(item => {
            return item.id === this.editId
          })
          return data[0]
        } else {
          const index = {
            type: 0,
            // authorOrg:'请选择园区'
          }
          return index
        }
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.heghtH {
  height: 100%;
}
::v-deep .my-handle:active {
  cursor: move;
}
::v-deep .fixed-table-toolbar {
  min-width: 900px;
}
::v-deep .fixed-table-container {
  min-width: 900px;
}
::v-deep .bs-bars {
  min-width: 600px;
}
::v-deep .selectsty {
  // float: right;
  // width: 120px;
  width: 25%;
  // height: 100%;
  // margin-right: 10%;
}
.floatL {
  float: left;
}

/* 让模态框显示 */
.modal {
  display: block;
}

/* 如果不使用vue的transition的话可以不设置 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
::v-deep .modal-content {
  margin-top: 40%;
}
.bi-pencil::before {
  font-size: 13px;
}
</style>