<template>
  <div class="col-8">
    <h2>电影编辑</h2>
    <vo v-slot="{ handleSubmit }">
      <form novalidate @submit.prevent="handleSubmit(submit)">
        <vp class="form-group" tag="div" v-slot="v">
          <label>语言</label>
          <div class="clearfix">
            <span
              v-for="item in lanuagelist"
              :key="item.langId"
              style="display: block; float: left; padding: 5px"
            >
              <label>
                <input
                  type="checkbox"
                  style="vertical-align: -2px"
                  :value="item.langId"
                  @change="addmovice(item)"
                  v-validate="v"
                  :disabled="item.langId == 1 || item.langId == 0"
                  v-model="langIdlist"
                />&nbsp;&nbsp;{{ item.langDesc }}</label
              ></span
            >
          </div>
        </vp>
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item" v-for="(item, index) in editData.styleDescs" :key="item.langId">
              <a
                class="nav-link"
                @click="tabview = item.langId"
                :class="{ 'active fontColor': tabview === item.langId }"
                href="#"
                >{{ languageFn(item.langId) }}</a
              >
            </li>
          </ul>
        </div>
        <vo v-slot="{ submit }" v-for="item in editData.styleDescs" :key="item.id">
          <MoviceFrom
            :ref="'form' + item.id"
            class="card-body"
            :value="item"
            v-show="tabview == item.langId"
            style="background-color: #fff"
          ></MoviceFrom>
        </vo>
        <!-- 类型 -->
        <vp class="form-group" tag="div" v-slot="v" name="类型">
          <label class="control-label">类型</label>
          <div class="clearfix">
            <span
              v-for="(item, index) in classlist"
              style="display: block; float: left; padding: 5px"
            >
              <label>
                <input
                  style="vertical-align: -2px"
                  type="checkbox"
                  class="mr-1"
                  :value="item.id"
                  v-model="editData.typeIds"
                />{{ item.nameCn }}</label
              >
            </span>
          </div>
          <span class="err">{{ v.errors[0] }}</span>
        </vp>
        <!-- 电影图标 -->
        <vp class="form-group" name="电影图标" tag="div" v-slot="v" rules="required">
          <label class="control-label"
            >电影图标&nbsp;&nbsp;<i
              class="bi bi-exclamation-triangle ml-1"
              style="color: #dd8f42"
            ></i
            >&nbsp;<span style="color: #9f9e9d; font-size: 12px">图片为所有语言通用</span></label
          >
          <cool-file-input
            v-model="editData.styleDescs[0].icon"
            v-requiredSty="v"
            :opts="{ maxFileSize: 500 }"
            :uploadUrl="imageUpload"
            fileType="image"
          ></cool-file-input>
          <div class="mt-1" style="font-size: 12px">只能上传jpg/png文件,且不超过500kb</div>
          <span v-if="v.errors[0]" class="err">请上传jpg或png文件,且不超过500kb</span>
        </vp>
        <!-- 海报背景 -->
        <vp
          class="form-group"
          name="海报背景"
          :extensions="extensions"
          tag="div"
          v-slot="v"
          rules="required"
        >
          <label class="control-label"
            >海报背景&nbsp;&nbsp;<i
              class="bi bi-exclamation-triangle ml-1"
              style="color: #dd8f42"
            ></i
            >&nbsp;<span style="color: #9f9e9d; font-size: 12px">图片为所有语言通用</span></label
          >
          <cool-file-input
            v-model="editData.styleDescs[0].poster"
            v-requiredSty="v"
            :opts="{ maxFileSize: 500 }"
            :extensions="extensions"
            :uploadUrl="imageUpload"
            fileType="image"
          ></cool-file-input>
          <div class="mt-1" style="font-size: 12px">只能上传jpg/png文件,且不超过500kb</div>
          <span v-if="v.errors[0]" class="err">请上传jpg或png文件,且不超过500kb</span>
        </vp>
        <!-- 片花 -->
        <vp class="form-group" tag="div" v-slot="v" style="display: none">
          <label>片花</label>
          <cool-file-input
            v-model="editData.moviceclips"
            :uploadUrl="videoUpload"
            fileType="video"
          ></cool-file-input>
          <span class="err">{{ v.errors[0] }}</span>
        </vp>
        <!-- 电影 -->
        <vp class="form-group" name="电影" tag="div" v-slot="v" rules="required">
          <label class="control-label">电影</label>
          <cool-file-input
            :opts="{
              showClose: false,
              dropZoneEnabled: false,
              showBrowse: false,
            }"
            class="inputClassMovice"
            v-model="editData.url"
            v-requiredSty="v"
            :uploadUrl="videoUpload"
            fileType="video"
          ></cool-file-input>
          <span class="err">{{ v.errors[0] }}</span>
        </vp>
        <vp class="form-group" tag="div" name="版权分类" v-slot="v">
          <label>{{ vendor }}电影版权分组</label>
          <div>
            <input type="text" v-model="copyrightstring" disabled class="form-control" />
          </div>
          <span class="err">{{ v.errors[0] }}</span>
        </vp>
        <!-- 上映时间 -->
        <vp class="form-group" tag="div" v-slot="v" name="上映时间">
          <label>上映时间</label>
          <div>
            <input type="date" v-model="editData.releaseDate" class="form-control" v-validate="v" />
          </div>
          <span class="err">{{ v.errors[0] }}</span>
        </vp>
        <!-- 版权区域 -->
        <vp class="form-group" tag="div" v-slot="v" name="版权区域" rules="required">
          <label class="control-label">版权区域</label>
          <div class="clearfix">
            <span
              v-for="item in $store.state.locationlist"
              style="display: block; float: left; padding: 5px"
            >
              <label>
                <input
                  type="radio"
                  class="mr-1"
                  :value="item.id"
                  v-model="editData.copyrightArea"
                />{{ item.name }}
              </label>
            </span>
          </div>
          <div class="err">{{ v.errors[0] }}</div>
        </vp>
        <div class="form-group" style="float: right">
          <button class="btn btn-secondary" @click="$emit('closeForm')">返回</button>
          <button class="btn btn-primary ml-1" @click="verify">保存</button>
        </div>
      </form>
    </vo>
  </div>
</template>

<script>
//分组
class group {
  constructor() {
    this.id = 0;
    this.mediaId = "";
    this.styleId = 1;
    this.langId = 0;
    this.name = "";
    this.metaType = 14;
    this.desc = "";
    this.icon = null;
    this.logo = null;
    this.poster = "";
    this.author = "";
    this.starring = "";
    this.ext1 = null;
    this.ext2 = null;
    this.ext3 = null;
    this.ext4 = null;
    this.ext5 = null;
    this.ext6 = null;
    this.ext7 = null;
    this.ext8 = null;
    this.ext9 = null;
    this.ext10 = null;
  }
}
import MoviceFrom from "./MoviceFrom.vue";
import MoviceListApi from "@/api/MoviceListApi";
import CoolFileInput from "@/components/CoolFileInput.vue";
import UploadApi from "@/api/UploadApi";
import env from "@/env";
export default {
  data() {
    return {
      tabview: 0,
      imageUpload: UploadApi.getUrl("image"),
      videoUpload: UploadApi.getUrl("video"),
      extensions: ["png", "jpg"],
      lanuagelist: [], //语言保存的全部的数据
      classlist: [], //保存全部分类的数据
      editData: JSON.parse(JSON.stringify(this.editDataed)),
      vendor: env.vendor,
      formData: [], //测试
      langIdlist: this.editDataed.styleDescs.map((i) => i.langId),
      falstate: false,
    };
  },
  props: {
    editDataed: {
      type: Object,
      default: () => {},
    },
    //版权分类的数据
    copyrightstring: {
      type: String,
      default: "",
    },
  },
  async created() {
    let data = await MoviceListApi.getlanguage();
    this.lanuagelist = data;
    //获取分类
    MoviceListApi.getMoviceClass().then((classify) => {
      this.classlist = classify.rows;
    });
    this.fomatter();
  },
  methods: {
    //处理编辑数据
    fomatter() {
      let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
      let obj = {};
      this.editData.styleDescs = this.editDataed.styleDescs.reduce((cur, next) => {
        obj[next.langId] ? "" : (obj[next.langId] = true && cur.push(next));
        return cur;
      }, []);
      if (this.editDataed.styleDescs.length == 0) {
        this.editData.styleDescs = [
          { ...new group(), langId: 0 },
          { ...new group(), langId: 1 },
        ];
        this.langIdlist = [0, 1];
      } else if (this.editDataed.styleDescs.length == 1) {
        if (this.editDataed.styleDescs.map((i) => i.langId)[0] == 0) {
          this.editData.styleDescs.push({ ...new group(), langId: 1 });
          this.langIdlist.push(1);
        } else {
          this.langIdlist.unshift(0);
          this.editData.styleDescs.push({ ...new group(), langId: 0 });
        }
      }
    },
    //判断点击后有没有这个语言有就删没有就加
    addmovice(idx) {
      let have = this.editData.styleDescs.find((item) => item.langId == idx.langId);
      if (have == undefined) {
        this.editData.styleDescs.push({
          ...new group(),
          langId: idx.langId,
        });
        this.tabview = idx.langId;
      } else {
        this.editData.styleDescs = this.editData.styleDescs.filter(
          (item) => item.langId !== idx.langId
        );
        if (this.tabview == idx.langId) {
          this.tabview = this.editData.styleDescs.map((i) => i.langId)[0];
        }
      }
    },
    //行内获取数据
    languageFn(langId) {
      let data = this.lanuagelist.find((item) => item.langId == langId);
      if (data) {
        return data.langDesc;
      } else {
        return "-";
      }
    },
    verify() {
      this.falstate = true;
      for (let i = 0; i < this.editData.styleDescs.length; i++) {
        if (
          this.editData.styleDescs[i].desc == "" ||
          this.editData.styleDescs[i].author == "" ||
          this.editData.styleDescs[i].icon == "" ||
          this.editData.styleDescs[i].name == "" ||
          this.editData.styleDescs[i].poster == "" ||
          this.editData.styleDescs[i].starring == ""
        ) {
          this.editData.styleDescs[i].icon = this.editData.styleDescs[0].icon;
          this.editData.styleDescs[i].poster = this.editData.styleDescs[0].poster;
          this.tabview = this.editData.styleDescs[i].langId;
          this.falstate = false;
          break;
        }
      }
      //判断类型被删除后删除之前选中的类型
      this.editData.typeIds = this.editData.typeIds.filter((i) => {
        let data = this.classlist.find((idx) => idx.id == i);
        return data !== undefined;
      });
      if (this.editData.typeIds.length == 0) {
        this.$error("类型至少选一个");
        return (this.falstate = false);
      }
      if (this.falstate == false) return this.$error("请输入完整参数");
    },
    //保存编辑
    async submit() {
      this.verify();
      if (this.falstate == false) return;
      try {
        this.editData.styleDescs = this.editData.styleDescs.map((i) => {
          return {
            ...this.$refs["form" + i.id][0].model,
            icon: this.editData.styleDescs[0].icon,
            poster: this.editData.styleDescs[0].poster,
            mediaId: this.editData.id,
          };
        });
        delete this.editData.language;
        delete this.editData.stateing;
        await MoviceListApi.updateMedias(this.editData);
        await this.$emit("closeForm");
        await this.$info("编辑成功");
      } catch (error) {
        console.log(error);
      }
    },
  },
  components: {
    CoolFileInput,
    MoviceFrom,
  },
};
</script>

<style lang="scss" scoped>
// *号
.control-label:before {
  color: red;
  content: "*";
  position: absolute;
  margin-left: -10px;
}
.directSty {
  color: darkgray;
  font-size: 12px;
}
::v-deep .form-group {
  margin-bottom: 2rem;
}
//错误样式
.err {
  font-size: 12px;
  position: absolute;
  width: 100%;
  font-size: 80%;
  color: #dc3545;
}
// 文件的样式
.is-block {
  border: 1px solid red;
  border-radius: 5px;
}
.is-none {
  border: 1px solid #28a745;
  border-radius: 5px;
  // border-color: #28a745;
}
::v-deep .card-body {
  background-color: #fff;
  flex: 1 1 auto;
  min-height: 1 px;
  padding: 1.25 rem;
}
.clearfix:after {
  /*伪元素是行内元素 正常浏览器清除浮动方法*/
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.clearfix {
  *zoom: 1; /*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
}
::v-deep .inputClassMovice .file-drop-zone-title {
  // display: none!important;
  color: #aaa;
  font-size: 0;
  padding: 0;
  cursor: default;
}
::v-deep .inputClassMovice .fileinput-remove-button {
  display: none;
}
::v-deep .fontColor {
  color: #007bff !important;
}
a {
  color: black;
}
</style>
