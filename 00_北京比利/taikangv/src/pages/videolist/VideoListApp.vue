<template>
  <div class="container-fluid">
    <h2>视频管理</h2>
    <div v-if="view == 'table'">
      <cool-table
        ref="vtable"
        :columns="columns"
        :data="tableList"
        @edit-row="editCick"
        @del-row="delCick"
      >
        <button @click="updteVideo" class="btn btn-outline-primary btn-sm mr-1">
          上传视频
        </button>
        <button @click="delall" class="btn btn-outline-primary btn-sm mr-1">
          删除
        </button>
      </cool-table>
    </div>
    <div v-if="view == 'form'" class="col-6 ml-4">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>ID</label>
          <input
            class="form-control"
            v-model="editData.id"
            disabled
            type="text"
          />
        </div>
        <div class="form-group">
          <label>名称</label>
          <input class="form-control" v-model="editData.name" type="text" />
        </div>
        <div class="form-group">
          <label>文件大小</label>
          <input class="form-control" v-model="size" type="text" disabled />
        </div>
        <div class="form-group">
          <label>URL</label>
          <textarea
            class="form-control"
            v-model="editData.url"
            type="text"
            disabled
            rows="2"
          ></textarea>
        </div>
        <div class="form-group">
          <label>时长</label>
          <input class="form-control" v-model="duration" type="text" disabled />
        </div>
        <div class="form-group">
          <label>上传时间</label>
          <input
            class="form-control"
            v-model="uploadTime"
            type="text"
            disabled
          />
        </div>

        <div class="form-group">
          <button type="submit" class="btn btn-primary">确定</button>
          <button class="btn btn-secondary ml-1" @click="backVideo">
            返回
          </button>
        </div>
      </form>
    </div>
    <div v-if="view == 'update'" class="col-12">
      <GoldVideo @close="backVideo" />
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import VideoListApi from '@/api/VideoListApi'
import { parseDate2Str } from './common'
import GoldVideo from './GoldVideo.vue'
import dayjs from 'dayjs'
import env from '@/env'
import Axios from 'axios'
export default {
  data () {
    return {
      view: 'table',
      columns: [{
        checkbox: true
      },

      {
        field: 'id', title: 'ID',
        width: 5,
        align: "center",
      },
      {
        field: 'name', title: '名称',
        width: 5,
        align: "center",
      },
      {
        field: 'size', title: '文件大小',
        formatter: (val, row, idx) => {
          let size
          if (val < 1024) {
            size = val
          } else if (val < (1024 * 1024)) {
            let tem = val / 1024
            size = tem.toFixed(2) + 'KB'
          } else if (val < (1024 * 1024 * 1024)) {
            let tem = val / (1024 * 1024)
            size = tem.toFixed(2) + 'MB'
          } else {
            let tem = val / (1024 * 1024 * 1024)
            size = tem.toFixed(2) + 'GB'
          }
          return size
        },
        width: 5,
        align: "center",
      },
      {
        field: 'url', title: 'URL地址',
        formatter: (val, row, idx) => {
          return `<div class="tabsty">${val}</div>`
        },
        width: 130,
        align: "center",
      },
      {
        field: 'duration', title: '时长',
        formatter: (val, row, idx) => {
          if (val > 0) {
            let hour = Math.floor(val / 3600)
            let minute = Math.floor(val % 3600 / 60)
            let second = Math.floor((val - 60 * minute) % 60)
            if (hour < 10) {
              hour = '0' + hour
            }
            if (minute < 10) {
              minute = "0" + minute
            }
            if (second < 10) {
              second = "0" + second
            }
            return hour + ':' + minute + ':' + second
          }
        },
        width: 5,
        align: "center",
      },
      {
        field: 'uploadTime', title: '上传时间',
        formatter: (val, row, idx) => {
          return `<div class="datasty">${parseDate2Str(new Date(val), 'YYYY-MM-DD HH:mm:ss')}</div>`
          //  parseDate2Str(new Date(val), 'YYYY-MM-DD HH:mm:ss')
        },
        align: 'center',
        width: 180
      },
      // {
      //   field: '',
      //   title: '序号',
      //   sortable: true,
      //   align: "center",
      //   width: 40,
      //   formatter: function (value, row, index) {
      //     return `<button class="btn btn-primary btn-sm mr-1" data-row=${index}   data-emit=edit-row >编辑</button> 
      //     <button class="btn btn-danger btn-sm" data-val=${row}   data-emit=del-row >删除</button>`
      //   }
      // },
      {
        field: 'id', title: '操作', align: 'center',
        width: 200,
        align: "center",
        formatter: (val, row, idx) => {
          return `<button class="btn btn-primary btn-sm mr-1" data-val=${val}   data-emit=edit-row >编辑</button> 
            <button class="btn btn-danger btn-sm" data-val=${val}   data-emit=del-row >删除</button>`
        }
      }
      ],
      tableList: [],
      editData: {},
    }
  },
  components: {
    CoolTable, GoldVideo
  },
  created () {
    this.getVideo()
  },
  methods: {
    //返回视频管理
    backVideo () {
      this.view = 'table'
      this.getVideo()
    },
    // 删除
    async delCick (id) {
      try {
        const ok = await this.$confirm('删除')
        if (!ok) {
          return
        }
        // 调用接口
        // console.log(this.tableList[id].name);
        await VideoListApi.delVideo([id])
        await this.$info('删除成功')
        this.getVideo()
      } catch (error) {
        console.error(error)

        this.$error('删除失败')
      }
    },//删除多个
    async delall () {
      let data = this.$refs.vtable.getSelections()
      if (data.length === 0) {
        return
      } else {
        try {
          const ok = await this.$confirm('删除')
          if (!ok) {
            return
          }
          await VideoListApi.delVideo(data.map(v => v.id))
          await this.$info('删除成功')
          this.getVideo()
        } catch (error) {
          this.$error('删除失败')
        }
      }
    },
    //格式化大小mb
    formatSize (val) {
      let size
      if (val < 1024) {
        size = val
      } else if (val < (1024 * 1024)) {
        let tem = val / 1024
        size = tem.toFixed(2) + 'KB'
      } else if (val < (1024 * 1024 * 1024)) {
        let tem = val / (1024 * 1024)
        size = tem.toFixed(2) + 'MB'
      } else {
        let tem = val / (1024 * 1024 * 1024)
        size = tem.toFixed(2) + 'GB'
      }
      return size
    },
    //编辑
    async handleSubmit () {
      try {
        let strsp = this.editData.name.substring(this.editData.name.length - 4)
        if (strsp !== '.mp4') return this.$error('后缀名必须为.mp4')
        await VideoListApi.editVideo({ ...this.editData })
        this.getVideo()
        this.view = 'table'
        this.$info('修改成功')
      } catch (error) {
        this.$error(error)
      }
    },
    //编辑
    editCick (val) {
      this.view = 'form'
      this.editData = this.tableList.filter(item => item.id == val)[0]

    },
    //上传视频按钮
    updteVideo () {
      // this.$refs.videoInt.click()
      // this.$refs.update.clickupdate()
      this.view = 'update'
      this.$refs.videoInt
    },
    //获取全部数据视频
    async getVideo () {
      try {
        const data = await VideoListApi.getVideo()
        this.tableList = data.list
        this.tableList.forEach(it => {
          // it.duration = this.formatTime(it.duration)
          // it.uploadTime = parseDate2Str(new Date(it.uploadTime), 'YYYY-MM-DD HH:mm:ss')
        })
      } catch (error) {

      }
    },
    formatTime (val) {
      if (val > 0) {
        let hour = Math.floor(val / 3600)
        let minute = Math.floor(val % 3600 / 60)
        let second = Math.floor((val - 60 * minute) % 60)
        if (hour < 10) {
          hour = '0' + hour
        }
        if (minute < 10) {
          minute = "0" + minute
        }
        if (second < 10) {
          second = "0" + second
        }
        return hour + ':' + minute + ':' + second
      }
    },
    // close () {
    //   this.$emit('close')
    // }
  },
  computed: {
    // updateExcel () {
    //   return env.taikang + '/taikang/api/lecture/video/distribution/export?token=' + env.token
    // },
    size () {
      if (this.editData.size < 1024) {
        return this.editData.size
      } else if (this.editData.size < (1024 * 1024)) {
        let tem = this.editData.size / 1024
        return tem.toFixed(2) + 'KB'
      } else if (this.editData.size < (1024 * 1024 * 1024)) {
        let tem = this.editData.size / (1024 * 1024)
        return tem.toFixed(2) + 'MB'
      } else {
        let tem = this.editData.size / (1024 * 1024 * 1024)
        return tem.toFixed(2) + 'GB'
      }
    },
    duration () {
      return this.formatTime(this.editData.duration)
    },
    uploadTime () {
      return parseDate2Str(new Date(this.editData.uploadTime), 'YYYY-MM-DD HH:mm:ss')
    }
  },
}
</script>

<style lang="scss" scoped>
/deep/ td {
  // position: relative;
  // text-align: center;
  max-width: 300px;
}
/deep/.tabsty {
  display: inline-block;
  word-wrap: break-word;
  word-break: normal;
  width: 100%;
}
/deep/.datasty {
  width: 100%;
}
</style>