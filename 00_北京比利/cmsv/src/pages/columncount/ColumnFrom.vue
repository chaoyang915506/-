<template>
  <vo v-slot="{ handleSubmit }">
    <form novalidate @submit.prevent="handleSubmit(submit)">
      <!-- 语言 -->
      <vp class="form-group row " tag="div" v-slot="v" name="语言">
        <label class="col-4  control-label">语言</label>
        <div class="col-8 ">
          <select v-model="item.langId" class="form-control forbid" disabled>
            <option v-for="i in languageList" :key="i.langId" :value="i.langId">{{
              i.label
            }}</option>
          </select>
          <div class="error">{{ v.errors[0] }}</div>
        </div>
      </vp>
      <!-- 栏目ID -->
      <div class="form-group row">
        <label class=" col-4  center control-label ">栏目ID</label>
        <div class="col-8 ">
          <input v-model="item.itemId" disabled class="form-control forbid" type="text" />
        </div>
      </div>
      <!-- 内容id -->
      <div class="form-group row" v-if="item.miId !== ''">
        <label class="col-4  center control-label">内容ID</label>
        <div class="col-8 ">
          <input v-model="item.miId" disabled class="form-control forbid" type="text" />
        </div>
      </div>
      <!-- 内容名称 -->
      <vp class="form-group row " tag="div" v-slot="v" name="内容名称" rules="required">
        <label class="col-4  control-label">内容名称</label>
        <div class="col-8 ">
          <input
            v-model="item.miName"
            class="form-control"
            type="text"
            placeholder="请输入内容名称(必填)"
          />
          <div class="error">{{ v.errors[0] }}</div>
        </div>
      </vp>

      <!-- 媒咨内容类型 -->
      <vp class="form-group row" tag="div" v-slot="v" name="媒咨内容类型" rules="required">
        <label class="col-4  control-label">媒咨内容类型</label>
        <div class="col-8 ">
          <select class="form-control" v-model="item.miType">
            <option selected value="">
              请选媒咨内容类型(必选)
            </option>
            <option value="0">图片</option>
            <option value="1">视频</option>
            <option value="2">图片+视频</option>
          </select>

          <div class="error">{{ v.errors[0] }}</div>
        </div>
      </vp>
      <!--内容排序  -->
      <vp class="form-group row" tag="div" v-slot="v" name="内容排序" rules="required|numeric">
        <label class="col-4  control-label">内容排序</label>
        <div class="col-8 ">
          <input class="form-control" type="text" v-model="item.sort" placeholder="请输入排序值" />
          <div class="error">{{ v.errors[0] }}</div>
        </div>
      </vp>
      <!-- 视频文件类型 -->
      <div class="form-group row" v-show="item.miType !== '0'">
        <label class="col-4  control-label">视频文件类型</label>
        <div class="col-8 ">
          <select class="form-control" v-model="item.miVideoType">
            <option disabled selected value="">
              请选择视频文件类型
            </option>
            <option value="0">电影</option>
            <option value="1">电视剧</option>
            <option value="2">短视频</option>
            <option value="3">预告片</option>
            <option value="4">花絮</option>
            <option value="5">其他</option>
          </select>
        </div>
      </div>
      <!-- 影片分类 -->
      <div class="form-group row" v-show="item.miType !== '0'">
        <label class="col-4  control-label">影片分类</label>
        <div class="col-8 ">
          <select class="form-control" v-model="item.miMovieType">
            <option disabled selected value="">
              请选择影片分类
            </option>
            <option value="00">爱情</option>
            <option value="01">动作</option>
            <option value="02">犯罪</option>
            <option value="03">剧情</option>
            <option value="04">记录</option>
            <option value="05">其他</option>
          </select>
        </div>
      </div>
      <!-- 是否缺省数据 -->
      <div class="form-group row">
        <label class="col-4  control-label">是否缺省数据</label>
        <div class="col-8 ">
          <select class="form-control" v-model="item.miDefault">
            <option value="0" selected>否</option>
            <option value="1">是</option>
          </select>
        </div>
      </div>
      <!-- 状态 -->
      <div class="form-group row">
        <label class="col-4  control-label">状态</label>
        <div class="col-8 ">
          <select class="form-control" v-model="item.miStatus">
            <option value="0" selected>
              待审核
            </option>
            <option value="1">上线</option>
            <option value="2">下线</option>
          </select>
        </div>
      </div>
      <!-- 国家地区 -->
      <div class="form-group row">
        <label class="col-4  control-label">国家地区</label>
        <div class="col-8 ">
          <input
            class="form-control"
            type="text"
            v-model="item.miArea"
            placeholder="输入国家地区"
          />
        </div>
      </div>
      <!-- 出票机构 -->
      <div class="form-group row">
        <label class="col-4  control-label">出票机构</label>
        <div class="col-8 ">
          <input
            v-model="item.miCompany"
            class="form-control"
            type="text"
            placeholder="请输入出票机构"
          />
        </div>
      </div>
      <!-- 出品年代 -->
      <div class="form-group row">
        <label class="col-4  control-label">出品年代</label>
        <div class="col-8 ">
          <input
            v-model="item.miYear"
            class="form-control"
            type="text"
            placeholder="请输入出品年代"
          />
        </div>
      </div>
      <!-- 栏目内容图片A -->
      <div class="form-group row">
        <label class="col-4 ">栏目内容图片A</label>
        <div class="col-8 ">
          <cool-file-input
            style="width: 75%"
            v-model="item.miImage"
            :uploadUrl="miImage"
            fileType="image"
            :extensions="extensions"
          ></cool-file-input>
        </div>
      </div>
      <!-- 栏目内容图片B -->
      <div class="form-group row">
        <label class="col-4 ">栏目内容图片B</label>
        <div class="col-8 ">
          <cool-file-input
            style="width: 75%"
            v-model="item.miImage1"
            :uploadUrl="miImage"
            fileType="image"
            :extensions="extensions"
          ></cool-file-input>
        </div>
      </div>
      <!-- 栏目内容图片C -->
      <div class="form-group row">
        <label class="col-4 ">栏目内容图片C</label>
        <div class="col-8 ">
          <cool-file-input
            style="width: 75%"
            v-model="item.miImage2"
            :uploadUrl="miImage"
            fileType="image"
            :extensions="extensions"
          ></cool-file-input>
        </div>
      </div>
      <!-- 栏目内容图片D -->
      <div class="form-group row">
        <label class="col-4 ">栏目内容图片D</label>
        <div class="col-8 ">
          <cool-file-input
            style="width: 75%"
            v-model="item.miImage3"
            :uploadUrl="miImage"
            :extensions="extensions"
            fileType="image"
          ></cool-file-input>
        </div>
      </div>
      <!-- 栏目内容图片E -->
      <div class="form-group row">
        <label class="col-4 ">栏目内容图片E</label>
        <div class="col-8 ">
          <cool-file-input
            style="width: 75%"
            v-model="item.miImage4"
            :uploadUrl="miImage"
            :extensions="extensions"
            fileType="image"
          ></cool-file-input>
        </div>
      </div>
      <!-- 栏目内容视频 -->
      <div class="form-group row">
        <label class="col-4 ">栏目内容视频</label>
        <div class="col-8 ">
          <cool-file-input
            style="width: 75%"
            v-model="item.videoPlayUrl"
            :uploadUrl="videoUrl"
            fileType="video"
          ></cool-file-input>
        </div>
      </div>
    </form>
  </vo>
</template>

<script>
import CoolFileInput from "@/components/CoolFileInput.vue";
import UploadApi from "@/api/UploadApi";
import env from "@/env";
export default {
  data() {
    return {
      item: JSON.parse(JSON.stringify(this.value)),
      videolist: ["mp4"],
      extensions: ["jpg", "png", "jpeg"], //规定上传的格式+
      miImage: UploadApi.getUrl("image"), //上传图片
      videoUrl: UploadApi.getUrl("video") //上传视频
    };
  },
  props: {
    value: {
      type: Object
    },
    languageList: {
      type: Array
    }
  },
  components: {
    CoolFileInput
  }
};
</script>

<style lang="scss" scoped>
.error {
  font-size: 12px !important;
  position: absolute;
  font-size: 80%;
  color: #dc3545;
}

label {
  text-align: right;
}
//表头的表格
td {
  min-width: 150px;
}
// 每一个栏目内容的标题
.control-label {
  width: 20%;
  text-align: right;
}
//禁止符合
.forbid {
  cursor: no-drop;
  cursor: not-allowed;
  &:hover {
    cursor: no-drop;
  }
}
.table {
  width: 20%;
  // min-width: 500px;
}
.form-control {
  width: 75%;
}
// placeholder的样式
input::-webkit-input-placeholder {
  color: #999999;
  font-size: 0.8rem;
  font-style: italic;
}
::v-deep  .file-preview {
  padding: 10px 0;
}
::v-deep  .file-drop-zone-title {
  padding: 0;
  font-size: 1.1rem;
}
::v-deep .file-drop-zone {
  border: 0;
}
::v-deep .file-drop-zone.clickable:hover {
  border: 0;
}
.glyphicon-folder-open:before {
  content: "\e118";
}
::v-deep .krajee-default,
.file-preview-frame {
  margin: 0;
  padding: 0;
  float: none;
}
::v-deep .file-preview-frame,
.krajee-default,
.kv-preview-thumb,
.file-preview-error {
  margin-left: 1%;
  display: flex;
  justify-content: center;
  align-content: center;
}
//视频的样式
::v-deep .kv-preview-data .file-preview-video {
  margin-left: 25px;
}
::v-deep video {
  // max-width: 175px;
  width: 100%;
  min-width: 140px;
}
::v-deep .form-group {
  margin-bottom: 1.4rem;
}
::v-deep .nav-tabs .nav-item {
  min-width: 18%;
}
::v-deep .nav-tabs .nav-link {
  border-color: #e9ecef #e9ecef #dee2e6;
  padding-right: 0;
  height: 100%;
}
.borderStyle {
  border-bottom: 1px dashed black;
}
</style>
