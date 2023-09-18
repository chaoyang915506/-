<template>
  <div>
    <form @submit="handSubmit">
      <!-- id -->
      <vp class="form-group" tag="div" v-slot="v">
        <label>所属酒店</label>
        <select
          v-model="model.hotelId"
          class="form-control"
          v-validate="v"
          disabled
        >
          <option
            v-for="item in hotelList"
            :key="item.hotelId"
            :value="item.hotelId"
          >
            {{ item.hotelName }}
          </option>
        </select>
      </vp>
      <!-- 视频名 -->
      <vp class="form-group" tag="div" v-slot="v">
        <label>视频名称</label>
        <!-- v-model="model.multilingual.name" -->
        <input
          v-model="model.names[0].name"
          class="form-control"
          v-validate="v"
          required
          maxlength="18"
        />
      </vp>
      <!-- <vp
        class="form-group"
        tag="div"
        v-slot="v"
      >
        <label>视频名称(English)</label>
        <input
          v-model="model.names[1].name"
          class="form-control"
          v-validate="v"
          required
          maxlength="18"
        />
      </vp> -->
      <!-- 视频长度 -->
      <vp class="form-group" tag="div" v-slot="v">
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
      <!-- 上传时间 -->
      <vp class="form-group" tag="div" v-slot="v">
        <label>上传时间</label>
        <input
          v-model="model.uploadTime"
          class="form-control"
          v-validate="v"
          required
          disabled
          type="text"
          maxlength="18"
        />
      </vp>
      <!-- 选择语言 -->
      <vp class="form-group" tag="div" v-slot="v">
        <label>语言</label>
        <!-- v-model="model." -->
        <select
          v-model="model.names[0].langId"
          class="form-control"
          v-validate="v"
          required
          disabled
        >
          <option disabled selected value="">请选择语言</option>
          <option value="0">中文</option>
          <option value="1">英文</option>
        </select>
      </vp>
      <!-- 启用 -->
      <vp class="form-group" tag="div" v-slot="v" style="display: none">
        <label>状态</label>
        <!-- v-model="model." -->
        <select
          v-model="model.status"
          class="form-control"
          v-validate="v"
          required
          @change="changeState"
        >
          <option value="0">未启用</option>
          <option value="1">启用</option>
        </select>
      </vp>
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
          返回上一级
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import CoolFileInput from '@/components/CoolFileInput.vue'
import UploadApi from '@/api/UploadApi.js'
import env from '@/env/index'
import guiDanceApi from '@/api/guiDanceApi'
export default {
  data () {
    return {
      model: JSON.parse(JSON.stringify(this.editData)),
      videoUrl: UploadApi.getUrl('video')
    }
  },
  props: {
    editData: {
      type: Object,
      default: () => ({})
    },
    hotelList: {
      type: Array,
      default: () => ([])
    }
  },
  methods: {
    //修改
    async handSubmit (e) {
      e.preventDefault()
      try {
        const data = await guiDanceApi.addData({ ...this.model, length: this.fomatlength(this.model.length) })
        this.close()
        this.$info('修改成功')
      } catch (error) {

      }
    },
    async changeState (e) {
      try {
        const data = await guiDanceApi.guidanceStart({ hotelId: this.model.hotelId, videoId: this.model.id, status: e.target.value })
 
        this.$info('切换成功')
      } catch (error) {
        console.log(error)
      }
    },
    close () {
      // this.model = ''
      this.$emit('editClose', 'table')
      this.model = {
        hotelId: '',
        length: '',
        url: '',
        names: [{
          langId: '',
          name: ''
        }]
      }
    },
    fomatlength (leng) {
      let arr = leng.split(':')
      if (arr.length <= 2) {
        arr.push('00')
      }
      return Number(arr[0] * 60 * 60) + Number(arr[1] * 60) + Number(arr[2])
    },
  },
  components: {
    CoolFileInput
  },
}
</script>

<style lang="scss" scoped>
</style>