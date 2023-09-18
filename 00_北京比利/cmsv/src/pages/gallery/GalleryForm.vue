<template>
  <vo v-slot="{ handleSubmit }" v-if="gardenList.length > 0">
    <form novalidate @submit.prevent="handleSubmit(submit)">
      <vp class="form-group" tag="div" v-slot="v">
        <label>内容标题</label>
        <input
          v-model="model.title"
          class="form-control"
          v-validate="v"
          required
          maxlength="9"
        />
      </vp>
      <!-- <vp class="form-group" tag="div" v-slot="v">
        <label>内容标题</label>
        <input
          v-model="model.couentTitle"
          class="form-control"
          v-validate="v"
          required
          maxlength="34"
        />
      </vp> -->
      <!-- <vp class="form-group" tag="div" v-slot="v">
        <label>制作园区</label>
        <input
          v-model="model.authorOrg"
          class="form-control"
          v-validate="v"
          required
          maxlength="32"
        />
      </vp> -->
      <vp class="form-group" tag="div" v-slot="v">
        <label>制作园区</label>
        <select
          placeholder="请选择园区"
          class="custom-select"
          v-model="model.authorOrg"
          v-validate="v"
          required
        >
          <!-- <option disabled selected value="请选择园区">请选择园区</option> -->
          <option
            :value="item.hotelId"
            v-for="item in gardenList"
            :key="item.hotelId"
          >
            {{ item.hotelName }}
          </option>
        </select>
      </vp>
      <vp class="form-group" tag="div" v-slot="v">
        <label>作者</label>
        <input
          v-model="model.author"
          class="form-control"
          v-validate="v"
          required
          maxlength="6"
        />
      </vp>
      <vp class="form-group" tag="div" v-slot="v">
        <label>类型</label>
        <select
          class="custom-select"
          v-model="model.type"
          v-validate="v"
          required
        >
          <option :value="0">图片</option>
          <option :value="1">视频</option>
        </select>
      </vp>
      <vp class="form-group parents" tag="div" v-slot="v">
        <label>内容描述</label>
        <textarea
          class="form-control"
          v-model="model.text"
          v-validate="v"
          required
          maxlength="34"
          rows="2"
        >
        </textarea>
        <span class="tips"
          >可输入<i :class="[reduceNum < 10 ? 'now' : 'black']">{{
            reduceNum
          }}</i
          >个字</span
        >
      </vp>
      <div class="form-group" v-if="model.type === 0">
        <label>图片</label>
        <cool-file-input
          v-model="model.url"
          :uploadUrl="backgroundImgUrl"
          fileType="image"
          :extensions="formatposter"
          @file-uploaded="fileupdate"
        />
      </div>
      <div v-if="model.type === 1" class="form-group">
        <label>启播图</label>
        <cool-file-input
          v-model="model.poster"
          :uploadUrl="backgroundImgUrl"
          fileType="image"
          :extensions="formatposter"
        />
      </div>
      <div v-if="model.type === 1" class="form-group">
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
    </form>
  </vo>
</template>

<script>
import CoolFileInput from '@/components/CoolFileInput.vue'
import UploadApi from '@/api/UploadApi'
import GalleryApi from '@/api/GalleryApi'
export default {
  name: 'GalleryForm',
  props: {
    editData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      formatposter: ["jpg", "png"],
      maxlength: 34,//字数限制同时改行内
      //视频封面url
      videoimgUrl: UploadApi.getUrl('image'),
      // 背景图URL
      backgroundImgUrl: UploadApi.getUrl('image'),
      //视频url
      videoUrl: UploadApi.getUrl('video'),
      //双向绑定的数据
      //   model: {
      //     id: 1,
      //     // 内容类型：0 - 图片；1 - 视频
      //     type: 0,
      //     // 内容作者
      //     author: "",
      //     // 内容所属组织
      //     authorOrg: 1,
      //     // 内容标题
      //     title: "",
      //     // 内容描述
      //     text: "",
      //     // 视频内容起播图URL
      //     poster: "",
      //     // 内容URL
      //     url: ""
      //   },
      model: JSON.parse(JSON.stringify(this.editData)),
      gardenList: []//option园区数据
    }
  },
  components: {
    CoolFileInput,
  },
  created () {
    this.getgarden()
  },
  methods: {
    //获取园区数据
    getgarden () {
      GalleryApi.getdata().then(data => {
        this.gardenList = data.list
      }).catch((error) => {
        // this.$error('获取数据失败')
      })
    },
    // 关闭当前页面
    close () {
      this.model = {}
      this.$emit('close', 'table')
      // this.$refs.url1.close()
      // this.$refs.url.close()
      // this.$refs.poster()
    },
    async submit () {
      try {
        delete (this.model['hotelIdName'])
        if (this.editData.id) {
          //修改

          await GalleryApi.changedData(this.model)
          await this.$info('修改成功')

        } else {
          // console.log('新增')
          await GalleryApi.addShowCount(this.model)
          await this.$info('新增成功')
        }
        // window.location.reload()
        this.$emit('close', 'table')

      } catch (error) {

        this.$error('操作失败')
      }

    },
    fileupdate (file) {
      // console.log(file)
    }
  },
  computed: {
    //用户输入的字数
    lenghtsize () {
      let index = this.model.text ? this.model.text.length : '0'
      return index
    },
    //用户剩余输入的字数
    reduceNum () {
      let index = this.maxlength - this.lenghtsize
      return index
    }
  },
}
</script>

<style scoped lang="scss">
.parents {
  position: relative;
  // width: 100%;
  // height: 100px;
}
textarea {
  resize: none;
  // width: 100%;
  // position: absolute;
  // bottom: 0;
  // right: 0;
  // left: 0;
}
.tips {
  position: absolute;
  right: 2%;
  bottom: 7%;
}
.now {
  color: red;
}
.black {
  color: #0069d9;
}
</style>