<template>
  <div>
    <form @submit.prevent="handsubmit">
      <!-- <div> -->

      <!-- 视频名 -->
      <vp class="form-group row" tag="div" v-slot="v">
        <label>视频名称(中文)</label>

        <input
          v-model="model.names[0].name"
          class="form-control"
          v-validate="v"
          required
          maxlength="36"
        />
      </vp>
      <vp class="form-group row" tag="div" v-slot="v">
        <label>视频名称(English)</label>
        <input
          v-model="model.names[1].name"
          class="form-control"
          v-validate="v"
          required
          maxlength="36"
        />
      </vp>
      <!-- 视频长度 -->
      <vp class="form-group row" tag="div" v-slot="v">
        <label>视频长度</label>

        <input
          v-model="model.length"
          class="form-control"
          v-validate="v"
          required
          type="time"
          step="1"
          min="00:00:01"
          max="05:00:00"
          maxlength="8"
        />
      </vp>
      <!-- 选择酒店 -->
      <!-- <vp class="form-group" tag="div" v-slot="v">
        <label>选择酒店</label>
        <select class="custom-select" v-model="model.hotelId" v-validate="v">
          <option
            :value="item.hotelId"
            v-for="item in hotel"
            :key="item.hotelId"
          >
            {{ item.hotelName }}
          </option>
        </select>
      </vp> -->
      <!-- 视频 -->
      <div class="form-group">
        <label>视频</label>

        <cool-file-input
          v-model="model.url"
          :uploadUrl="videoUrl"
          fileType="video"
        />
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-primary">确定</button>
        <button type="button" class="btn btn-secondary ml-1" @click="close">
          返回
        </button>
      </div>
      <!-- </div> -->
    </form>
  </div>
</template>

<script>
import store from '@/store'
import CoolFileInput from '@/components/CoolFileInput.vue'
import UploadApi from '@/api/UploadApi.js'
import env from '@/env/index'
import guiDanceApi from '@/api/guiDanceApi'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      model: {
        length: '',
        url: '',
        names: [
          {
            langId: 0,
            name: ""
          },
          {
            langId: 1,
            name: ""
          }
        ]
      },
      videoUrl: UploadApi.getUrl('video'),
      languageList: []
    }
  },
  methods: {
    //表单提交
    async handsubmit () {
      try {
        if (this.model.url == '') return this.$error('视频不能为空')
        const data = await guiDanceApi.addData({ ...this.model, hotelId: this.hotelId, length: this.fomatlength(this.model.length) })
        // console.log(data)
        this.close()
        this.$info('新增成功')
      } catch (error) {
        console.log(error)
        this.$error('操作失败')
      }
    },
    close () {
      this.$emit('close', 'table')
      this.model = {}
    },
    fomatlength (leng) {
      let arr = leng.split(':')
      if (arr.length == 2) {
        arr.push('00')
      }
      return Number(arr[0] * 60 * 60) + Number(arr[1] * 60) + Number(arr[2])
    },
  },
  created () {
    // this.getlanguage()
  },
  computed: {
    ...mapState(['hotel']),
    hotelId () {
      return env.hotelId
    },

  },
  components: {
    CoolFileInput,
  },
}
</script>
<style lang="scss" scoped>
.containterRL {
  padding: 1%;
}
// .form-control{
//   width: 70%;
// }
// ::v-deep  .file-drop-zone-title {
//   // padding: 0%;
//   // font-size: 0.8rem;
// }
::v-deep  .form-group {
  margin: 2% 0;
}
</style>