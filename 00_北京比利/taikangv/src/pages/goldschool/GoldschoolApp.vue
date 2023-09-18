<template>
  <div class="container-fluid">
    <h2>流光溢彩</h2>
    <!-- 学堂主体 -->
    <div v-if="view === 'table'">
      <form role="form" class="form-inline mt-3">
        <!-- 标题 -->
        <div class="form-group mb-2 mr-2">
          <label class="col-form-label mr-1">标题</label>
          <input type="text" v-model="title" class="form-control" />
          <!-- </div> -->
        </div>
        <!-- 播放日期 -->
        <div class="form-group mb-2">
          <label class="col-form-label mr-1">播放日期</label>
          <input class="form-control" type="date" v-model="selectData" />
        </div>
      </form>
      <!-- 表格 -->
      <CoolTable
        :data="tableData"
        :columns="columns"
        ref="messageTable"
        @del-row="delMeenter"
      >
        <!-- 按钮 -->
        <button
          type="button"
          class="btn btn-outline-primary btn-sm mr-1"
          @click="view = 'form'"
        >
          新增
        </button>
        <button
          type="button"
          class="btn btn-outline-primary btn-sm mr-1"
          @click="delAll"
        >
          删除
        </button>
        <a
          type="button"
          class="btn btn-outline-primary btn-sm mr-1"
          :href="exportExcel"
          target="updwn"
        >
          导出模板
        </a>
        <div style="display: none">
          <input
            type="file"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            ref="fileInt"
            @change="changeHandle"
          />
        </div>
        <button @click="btnsum" class="btn btn-outline-primary btn-sm mr-1">
          导入
        </button>
        <iframe name="updwn" style="display: none"></iframe>
        <!--  @click="view = 'videotable'" -->
        <button
          @click="govideo"
          class="btn btn-outline-primary btn-sm mr-1"
        >
          视频管理
        </button>
      </CoolTable>
    </div>
    <!-- 表单 -->
    <div v-if="view === 'form'" class="col-6 ml-4">
      <form @submit.prevent="submit">
        <div class="form-group">
          <label>ID</label>
          <input
            class="form-control"
            placeholder="ID必须为数字"
            v-model="form.id"
            required="true"
            type="text"
          />
        </div>
        <div class="form-group">
          <label>时长</label>
          <input class="form-control"
            v-model="form.length"
            value="00:00:00"
            step="1"
            required="true"
            type="time"
          />
        </div>
        <div class="form-group">
          <label>标题</label>
          <input class="form-control" v-model="form.title" required="true" type="text" />
        </div>
        <div class="form-group">
          <label>URL</label>
          <input class="form-control" v-model="form.url" type="url" required="true" />
        </div>
        <div class="form-group">
          <label>播放日期</label>
          <input class="form-control"
            v-model="form.date"
            required="true"
            type="date"
            :min="nowDate"
          />
        </div>

        <div class="form-group">
          <button type="submit" class="btn btn-primary">确定</button>
          <button class="btn btn-secondary ml-1" @click="close">
            返回
          </button>
        </div>
      </form>
    </div>

    <div v-if="view == 'videotable'"><GoldVideoList @close="close" /></div>
    <GoldLoading class="box" v-show="loading" />
  </div>
</template>
<script>
import CoolTable from '@/components/CoolTable.vue'
import axios from 'axios'
//引入格式化日期
import { parseDate2Str } from './common'
import GoldschoolApi from '@/api/GoldschoolApi'
import CoolSorter from '@/components/CoolSorter.vue'
import dayjs from 'dayjs'
import env from '@/env/index'
import GoldLoading from './GoldLoading.vue'
// import coolvideo from './coolvideo.vue'
// impor from '.vue'
export default {
  data () {
    return {
      timmer: '',
      view: 'table',
      title: '',
      selectData: '',
      //新增的弹框开关
      visible: false,
      //搜索search的数据项·
      columns: [{
        checkbox: true
      },
      {
        field: 'id', title: 'ID'
      },
      {
        field: 'playStartTime', title: '开始时间'
      },
      {
        field: 'playOverTime', title: '结束时间'
      },
      {
        field: 'length', title: '时长'
      }, {
        field: 'title', title: '标题'
      }, {
        field: 'URL', title: 'URL'
      },
      {
        field: 'date', title: '播放日期'
      }, {
        field: 'id', title: '操作', align: 'center',
        formatter: val => {
          return `<button class=" bi-trash" id="svvg" data-val=${val}   data-emit=del-row ></button>`
        }
        // class="btn btn-outline-primary btn-sm"
      }],
      tadata: [],//传给组件的数据
      nowDate: parseDate2Str(new Date()),
      // arrList: [],//日期数据
      //新增的双向绑定数据 
      secondsd: '',
      form: {
        id: '',
        length: '',
        title: '',
        url: '',
        date: ''
        // playStartTime: '',
        // playOverTime: ''
      },
      num1: {},
      num: '',
      subdata: { ...this.form, length: this.secondsd },
      loading: false,//动画效果
    }
  },
  components: { CoolTable, CoolSorter, GoldLoading },
  created () {
    this.getallget()
  },
  methods: {
    //导入
    changeHandle () {
      const file = this.$refs.fileInt.files[0]
      const data = new FormData()
      data.append('file', file)
      axios.post(this.actionurl, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      }).then(res => {
        // console.log(res)
        if (res.data.code === '0x0000') {
          this.$info('上传成功')
          this.getallget()
        }
        else if (res.data.msg === 'some videos added failed') {
          this.$error(`部分日期超出时长:${res.data.data}`)
        } else {
          this.$error(res.data.msg)
          this.getallget()
        }
        this.selectData = ''
        this.timmer = setTimeout(() => {
          this.$refs.fileInt.value = ""
        }, 1000)
      }).catch(err => {
        console.log(err)
      })
    },
    //获取全部数据、
    getallget () {
      try {
        GoldschoolApi.alldata().then(data => {
          //格式化播放日期
          this.tadata = data.list
          this.tadata.forEach(item => {
            item.playStartTime = parseDate2Str(new Date(item.playStartTime), 'YYYY-MM-DD HH:mm:ss')
            item.playOverTime = parseDate2Str(new Date(item.playOverTime), 'YYYY-MM-DD HH:mm:ss')
            item.length = this.formatTime(item.length)
          })
        })
      } catch (error) {
        this.$error('获取数据失败')
      }
    },
    //删除每一条的数据
    async delMeenter (id) {
      try {
        const ok = await this.$confirm('删除')
        if (!ok) {
          return
        }
        // 调用接口
        console.log(id)
        await GoldschoolApi.deldata([id])
        await this.$info('删除成功')
        this.getallget()
      } catch (error) {
        console.error(error)

        this.$error('删除失败')
      }
    },
    // 删除选中的每一项
    async delAll () {
      //获取到选中数据的详细信息
      const data = this.$refs.messageTable.getSelections()
      // console.log(data.map(v => v.id), '22')
      if (data.length === 0) {
        return
      } else {
        try {
          const ok = await this.$confirm('删除')
          if (!ok) {
            return
          }
          await GoldschoolApi.deldata(data.map(v => v.id))
          await this.$info('删除成功')
          this.getallget()
          // this.refresh()
        } catch (error) {
          this.$error('删除失败')
        }
      }
    },
    btnsum () {
      this.$refs.fileInt.click()
    },
    //格式化时间00:00:00的方法
    formatTime (times) {
      if (times > 0) {
        let hour = Math.floor(times / 3600)
        let minute = Math.floor(times % 3600 / 60)
        let second = Math.floor((times - 60 * minute) % 60)
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
    //处理成多少秒
    seconds (num) {
      let remd
      let indexj
      if (num.length === 5) {
        let yin = num + ':00'
        let str1 = yin.split(':')
        remd = 3600 * Number(str1[0]) + 60 * Number(str1[1]) + Number(str1[2])
        console.log(remd)
      } else {
        let str = num
        let temp = str.split(':')
        indexj = 3600 * Number(temp[0]) + 60 * Number(temp[1]) + Number(temp[2])
      }
      return num.length === 5 ? remd : indexj
    },
    // 提交
    submit () {
      if (this.secondsd === 0 || this.form.length === '00:00') {
        this.form.length = ''
        return this.$error('时长不能为空')
      }
      GoldschoolApi.handUpdate([{ ...this.form, length: this.secondsd }]).then((res) => {
        console.log(res)
        this.$info('新增成功')
        this.close()
      }).catch(error => {
        console.log(error)
        if (error === 'some videos added failed') {
          this.form.length = ''
          this.$error('视频时间太长请重新输入')
        } else if (error === '视频ID已存在：1') {
          this.$error('视频ID已存在')

        } else {
          this.$error(error)
        }
      })
    },
    govideo(){
     location.href = '/taikangv/videolist?token='+env.token
     // + common.getParameter('langId') + '&token=' + env.token
    },
    close () {
      this.view = 'table'
      this.form = {
        id: '',
        length: '',
        title: '',
        url: '',
        date: ''
      }
      this.getallget()
    }
  },
  beforeDestroy () {
    clearTimeout(this.timmer)
  },
  watch: {
    'form.length': {
      handler: function (newd) {
        this.secondsd = this.seconds(newd)
        // console.log(this.secondsd)
      },
      deep: true,
    },
  },
  computed: {
    // 导入地址
    actionurl () {
      return env.taikang + '/taikang/api/lecture/video/upload?token=' + env.token
    },
    //导出地址
    exportExcel () {
      return env.taikang + '/taikang/api/lecture/video/export?token=' + env.token
    },
    //上传视频的地址
    updateV () {
      return env.taikang + '/taikang/api/lecture/videoMedium/upload?token=' + env.token
    },
    // 搜索全部数据
    tableData () {
      const reg = new RegExp(this.title, 'ig')
      return this.tadata.filter(item => {
        return this.title === '' ? true : reg.test(item.title)
      }).filter(it => {
        return this.selectData == '' ? true : this.selectData == it.playStartTime.substr(0, 10)
      })
    },
    //处理播放日期时间
    // timeData: {
    //   get () {
    //     const arr = []//存日期的数据
    //     let data = null
    //     for (let i = 1; i < 7; i++) {
    //       data = dayjs().add(i, 'd')
    //       arr.push(dayjs(data).format('YYYY-MM-DD'))
    //     }
    //     const newarr = JSON.parse(JSON.stringify(arr))
    //     this.arrList = ['明天', ...newarr.splice(1)]
    //     return this.arrList
    //   }
    // }
  },

}
</script>
<style lang="scss">
//input select等宽
input,
select {
  box-sizing: border-box;
}
#inputPassword,
#inputState {
  display: inline-block;
  width: 200px;
}
// 新增弹出层的样式
.dailog {
  margin-top: 5%;
  text-align: center;
  span {
    display: inline-block;
    width: 10%;
    margin-right: 10px;
    font-weight: 700;
  }
  input {
    margin: 10px 0;
    width: 70%;
  }
}
// button样式
.btnsty {
  margin-top: 2%;
  color: white;
  background-color: #3e3e3e;
}
.bottom {
  margin-bottom: 5%;
}
.noone {
  margin-left: 20%;
  margin-right: 1%;
}
//删除的按钮
#svvg {
  background-color: transparent;
  border: 0px solid #fff;
  color: #dc3947;
}
.box {
  width: 100%;
  height: 100%;
}
</style>
