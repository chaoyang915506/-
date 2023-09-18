<template>
  <div
    class="container-fluid row"
    style="overflow: auto; width: 100%; height: 100%;display: flex;
    justify-content: center;"
  >
    <!-- 表单区域 v-if="form.itemId !== ''"-->
    <div class="col-8">
      <h2>添加/修改栏目</h2>
      <vo v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(submit)">
          <vp
            class="form-group row"
            style="align-items: center;"
            tag="div"
            v-slot="v"
            name="基础栏目"
            rules="required"
          >
            <label class="col-4 mt-3">选择基础栏目</label>
            <div class="col-8">
              <el-select
                v-model="itemObject.itemBasicId"
                filterable
                v-requiredSty="v"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in basicItemList"
                  :key="item.itemBasicId"
                  :value="item.itemBasicId"
                  :label="item.itemBasicDesc"
                >
                </el-option>
              </el-select>

              <div class="error">{{ v.errors[0] }}</div>
            </div>
          </vp>
          <vp
            class="form-group row"
            style="align-items: center;"
            tag="div"
            v-slot="v"
            name="配置类型"
            rules="required|min:5|max:5"
          >
            <label class="col-4 mt-3">配置类型</label>
            <div class="col-8">
              <input type="text" v-model="itemObject.configType" class="form-control" />
              <div class="error">{{ v.errors[0] }}</div>
            </div>
          </vp>
          <!-- 语言 -->
          <!-- <div class="form-group row">
            <label class="col-4">语言</label>
            <div class="col-8">
              <template
                v-for="item in languageList"
                style="display: block; float: left; padding: 5px"
              >
                <label class="mr-1">
                  <input
                    type="checkbox"
                    style="vertical-align: -2px"
                    :value="item"
                    @change="languageChange(item)"
                    :disabled="
                      userLanguage.length == 1 &&
                      item.langId == userLanguage[0].langId
                        ? true
                        : false
                    "
                    v-model="userLanguage"
                  />
                  {{ item.label }}</label
                >
              </template>
            </div>
          </div> -->
          <div class="card text-center" style="padding:0">
            <div class="card-header">
              <ul class="nav nav-tabs card-header-tabs">
                <li class="nav-item" v-for="item in userLanguage" :key="item.id">
                  <a
                    class="nav-link"
                    :class="[{ 'active fontColor': langindex == item.langId }]"
                    href="#"
                    @click="langindex = item.langId"
                    >{{ item.label }}</a
                  >
                </li>
              </ul>
            </div>
            <div class="card-body">
              <div v-for="item in formDataA" :key="item.langId" v-show="item.langId == langindex">
                <!-- 父栏目 -->
                <div class="form-group row" v-if="item.parentItemId">
                  <label class=" col-4  center control-label ">父栏目</label>
                  <div class="col-8 ">
                    <select class="form-control forbid" v-model="item.parentItemId" disabled>
                      <option value="-1">无</option>
                      <option :value="idx.itemId" v-for="idx in columnListName">{{
                        idx.itemMenuName
                      }}</option>
                    </select>
                  </div>
                </div>
                <!-- 栏目ID -->
                <div class="form-group row" v-if="item.itemId">
                  <label class="col-4  center control-label">栏目ID</label>
                  <div class="col-8 ">
                    <input disabled class="form-control forbid" v-model="item.itemId" type="text" />
                  </div>
                </div>
                <!-- 启用状态 -->
                <div class="form-group row">
                  <label class="col-4  center control-label">启用状态</label>
                  <div class="col-8 " style="text-align: left;">
                    <!-- <label> -->
                    <!-- <input type="hidden" v-model="item.isEnable" name="status" value="0" /> -->
                    <!-- <input
                        type="checkbox"
                        name="status"
                        value="1"
                        v-model="item.isEnable"
                      />&nbsp;&nbsp;勾选启用</label
                    > -->
                    <el-checkbox true-label="1" false-label="0" v-model="item.isEnable"
                      >勾选启用</el-checkbox
                    >
                  </div>
                </div>
                <!-- 栏目名称 -->
                <vp class="form-group row " tag="div" v-slot="v">
                  <label class="col-4  control-label">栏目名称</label>
                  <div class="col-8 ">
                    <input
                      v-model="item.itemMenuName"
                      class="form-control"
                      type="text"
                      placeholder="必填"
                    />
                    <div class="error">{{ v.errors[0] }}</div>
                  </div>
                </vp>
                <!-- 栏目描述 -->
                <vp class="form-group row" tag="div" v-slot="v" name="栏目描述">
                  <label class="col-4  control-label">栏目描述</label>
                  <div class="col-8 ">
                    <textarea class="form-control" v-model="item.itemDesc1" rows="3"></textarea>
                    <div class="error">{{ v.errors[0] }}</div>
                  </div>
                </vp>

                <!-- 栏目图标 -->
                <div class="form-group row">
                  <label class="col-4 ">栏目图标</label>
                  <div class="col-8 ">
                    <cool-file-input
                      style="width: 75%"
                      v-model="item.iconUrl"
                      :uploadUrl="miImage"
                      fileType="image"
                      :extensions="extensions"
                    ></cool-file-input>
                  </div>
                </div>
                <!-- 选中时图标 -->
                <div class="form-group row">
                  <label class="col-4 ">选中时图标</label>
                  <div class="col-8 ">
                    <cool-file-input
                      style="width: 75%"
                      v-model="item.focusedIconUrl"
                      :uploadUrl="miImage"
                      fileType="image"
                      :extensions="extensions"
                    ></cool-file-input>
                  </div>
                </div>
                <!-- 背景图片 -->
                <div class="form-group row">
                  <label class="col-4 ">背景图片</label>
                  <div class="col-8 ">
                    <cool-file-input
                      style="width: 75%"
                      v-model="item.bgPicUrl"
                      :uploadUrl="miImage"
                      fileType="image"
                      :extensions="extensions"
                    ></cool-file-input>
                  </div>
                </div>
                <!-- 弹出框背景 -->
                <div class="form-group row">
                  <label class="col-4 ">弹出框背景</label>
                  <div class="col-8 ">
                    <cool-file-input
                      v-model="item.picUrl3"
                      style="width: 75%"
                      :uploadUrl="miImage"
                      :extensions="extensions"
                      fileType="image"
                    ></cool-file-input>
                  </div>
                </div>

                <div>
                  <!-- 勾选使以下素材应用于所有语言 -->
                  <!-- <div class="form-group row">
                    <label class="col-4 "></label>
                    <div class="col-8 " style="text-align: left;">
                      <label
                        ><input
                          type="checkbox"
                        />&nbsp;&nbsp;勾选使以下素材应用于所有语言</label
                      >
                    </div>
                  </div> -->
                  <!-- 栏目LOGO -->
                  <div class="form-group row">
                    <label class="col-4 ">栏目LOGO</label>
                    <div class="col-8 ">
                      <cool-file-input
                        v-model="item.picUrl2"
                        style="width: 75%"
                        :uploadUrl="miImage"
                        :extensions="extensions"
                        fileType="image"
                      ></cool-file-input>
                    </div>
                  </div>
                  <!-- 背景音乐 -->
                  <div class="form-group row">
                    <label class="col-4 ">背景音乐</label>
                    <div class="col-8 ">
                      <cool-file-input
                        v-model="item.bgMusic"
                        style="width: 75%"
                        :uploadUrl="audioUrl"
                        fileType="audio"
                      ></cool-file-input>
                    </div>
                  </div>
                  <!-- 背景视频 -->
                  <div class="form-group row">
                    <label class="col-4 ">背景视频</label>
                    <div class="col-8 ">
                      <cool-file-input
                        v-model="item.bgVideo"
                        style="width: 75%"
                        :uploadUrl="videoUrl"
                        fileType="video"
                      ></cool-file-input>
                    </div>
                  </div>
                  <!-- 二维码/版权LOGO -->
                  <div class="form-group row">
                    <label class="col-4 ">二维码/版权LOGO</label>
                    <div class="col-8 ">
                      <cool-file-input
                        v-model="item.picUrl1"
                        style="width: 75%"
                        ref="qrcode"
                        :uploadUrl="miImage"
                        :extensions="extensions"
                        fileType="image"
                      ></cool-file-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 提交 -->
            <div class="form-group row">
              <label class="col-4 "></label>
              <div class="col-8">
                <div style="display: flex;width: 75%;justify-content: left;">
                  <button type="button" class="btn btn-secondary mr-1" @click="back">
                    返回
                  </button>
                  <button type="submit" class="btn btn-primary mr-1">
                    确定
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </vo>
    </div>

    <cool-loading :loading="loading"></cool-loading>
  </div>
</template>

<script>
class fromDa {
  constructor() {
    // this.bgMusic = ''
    // this.bgPicUrl = ''
    this.bgVideo = "";
    // this.focusedIconUrl = ''
    this.hotelId = env.hotelId;
    // this.iconUrl = ''
    this.isEnable = "1";
    this.itemDesc1 = "";
    this.itemId = "";
    this.itemMenuName = "";
    this.itemNameSortId = "";
    this.langId = "";
    this.parentItemId = "-1"; //如果没有父级就是-1
    // this.picUrl1 = ''
    // this.picUrl2 = ''
    // this.picUrl3 = ''
    // this.itemBasicId = ''
    this.configType = "00000";
  }
}
import CoolLoading from "@/components/CoolLoading.vue";
import CoolFileInput from "@/components/CoolFileInput.vue";
import ColumnVideo from "../columncount/ColumnFrom.vue";
import CoolModal from "@/components/CoolModal.vue";
import ColumnCountApi from "@/api/ColumnCountApi.js";
import ColumnManageApi from "@/api/CoumnManageApi";
import UploadApi from "@/api/UploadApi";
import env from "@/env";
export default {
  data() {
    return {
      vendor: env.vendor,
      langindex: "",
      itemObject: {
        itemBasicId: "",
        configType: "00000"
      },
      videolist: ["mp4"],
      extensions: ["jpg", "png", "jpeg"], //规定上传的格式+
      miImage: UploadApi.getUrl("image"), //上传图片
      videoUrl: UploadApi.getUrl("video"), //上传视频
      audioUrl: UploadApi.getUrl("audio"), //上传音乐
      // basicItemList: [], //基础栏目数据
      // languageList: [], //语言/
      // userLanguage: [], //用户选择的语言
      formDataA: new fromDa(), //全部的数据表单
      loading: false,
      langColor: "" //表单验证
    };
  },
  components: {
    CoolFileInput,
    CoolModal,
    ColumnVideo,
    CoolLoading
  },
  created() {
    this.gethomepage();
  },
  props: {
    columnListName: {
      type: Array,
      default: () => []
    },
    tranfer: {
      type: Object,
      default: null
    },
    //编辑或者非顶级
    itemEdit: {
      type: Object,
      default: null
    },
    //判断是编辑的字段
    editData: {
      type: Number,
      default: 999
    },
    basicItemList: {
      type: Array,
      default: () => []
    },
    userLanguage: {
      type: Array,
      default: () => []
    },
    columnData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    languageChange(value) {
      //如果为true代表是有数据就给他添加一个状态，如果没有
      let GetitemIds;
      if (this.formDataA.map(item => item.langId).indexOf(value.langId) == -1) {
        this.langindex = value.langId;
        GetitemIds = this.userLanguage.find(i => i.langId == value.langId);
        this.formDataA.push({
          ...new fromDa(),
          langId: value.langId
        });
      } else {
        if (this.userLanguage.length > 1) {
          this.langindex = value.langId;
        } else {
          this.langindex = this.userLanguage[0].langId;
        }
      }
    },
    // 获取这个栏目的中英文数据
    async gethomepage() {
      try {
        this.langindex = this.userLanguage[0].langId; //默认进来页面显示数组中第一个语言
        //是编辑或添加子
        if (this.itemEdit.itemId !== -8888) {
          //添加子栏目
          if (this.editData == 999) {
            this.formDataA = this.columnData.map(item => {
              return {
                ...new fromDa(),
                langId: item.langId,
                parentItemId: item.itemId,
                itemNameSortId: this.itemEdit.itemNameSortId
              };
            });
          } else {
            //编辑的栏目数据
            let editColumn = await ColumnManageApi.itemBasicIdOne(this.columnData[0].itemBasicId);
            this.basicItemList.push(editColumn);
            this.itemObject.itemBasicId = this.columnData[0].itemBasicId;
            this.itemObject.configType = this.columnData[0].configType;
            this.formDataA = this.columnData;
          }
        } else {
          // 添加顶级
          this.formDataA = this.userLanguage.map(item => {
            return {
              ...new fromDa(),
              langId: item.langId,
              itemNameSortId: this.itemEdit.itemNameSortId
            };
          });
          //按需显示
          //   this.formDataA = [{ ...new fromDa(), langId: language[0].langId }]
        }
      } catch (error) {
        console.log(error);
      }
    },
    back() {
      this.$emit("backhome");
    },
    async submit() {
      this.loading = true;
      //新增有两种，新增顶级不需要调用查接口
      //如果是添加子需要查的接口 和编辑都需要查
      try {
        if (this.itemObject.itemBasicId == "") return this.$error("请选择基础栏目");
        let state = true;
        let lauage;
        for (let i = 0; i < this.formDataA.length; i++) {
          this.formDataA[i].itemBasicId = this.itemObject.itemBasicId;
          this.formDataA[i].configType = this.itemObject.configType;
          // this.formDataA[i].isEnable = this.formDataA[i].isEnable == false ? 0 : 1;
          if (this.formDataA[i].itemMenuName == "") {
            this.langColor = this.formDataA[i].langId;
            lauage = this.userLanguage.find(item => item.langId == this.formDataA[i].langId);
            this.$error(`${lauage.label}的栏目名称不能为空`);
            state = false;
            break;
          }
        }
        if (state == false) {
          this.loading = false;
          return;
        }
        if (!this.formDataA[0].itemId) {
          await ColumnManageApi.batchAddItems({ list: this.formDataA });
          await this.$emit("backhome");
          await this.$info("新增成功");
          this.loading = false;
        } else {
          await ColumnManageApi.batchUpdateItem({ list: this.formDataA });
          await this.$emit("backhome");
          await this.$info("编辑成功");
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
        this.$error(error);
        console.log(error);
      }
    }
  }
};
</script>
<style scoped lang="scss">
@import "../../assets/css/public.scss"; //上传文件的样式
.error {
  font-size: 12px !important;
  position: absolute;
  /* width: 100%; */
  font-size: 80%;
  color: #dc3545;
}
.row {
  align-items: center;
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
::v-deep .el-select {
  width: 75%;
}
// ::v-deep .redlang {
//   color: red !important;
//   font-weight: 700;
// }
</style>
