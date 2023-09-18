<template>
  <div class="box">
    <div class="current" @click="current = !current">
      {{ current ? "切换编辑模式" : "切换视图模式" }}
    </div>
    <div v-if="current" class="box_content">
      <div class="leftbox">
        <div class="title_info">
          <span>资料</span>
          <div></div>
        </div>
        <div class="content">
          <div v-for="(item, j) in datalist" :key="j" class="every_box">
            <div class="title1">{{ item.name }}</div>
            <div
              :class="[
                getblock(item.materialId) ? 'show_content' : 'content_info',
              ]"
            >
              <div
                class="second_level"
                v-for="i in item.materialDetails"
                :key="i.detailId"
                @click="lookPdf(i, item.name)"
              >
                {{ i.onlineName }}
              </div>
              <div
                class="upfold"
                v-if="item.materialDetails && item.materialDetails.length > 1"
                @click="upfold(item.materialId)"
              >
                <img
                  :class="[getblock(item.materialId) ? 'imgclose' : 'imgopen']"
                  src="/img/ui/arrows.svg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <middle class="middle" />
    </div>
    <div v-else class="table_class">
      <div class="btns_style">
        <el-button
          type="primary"
          class="btn_custom"
          size="small"
          @click="exportAll"
          >批量导出</el-button
        >
        <el-button
          type="primary"
          class="btn_custom"
          size="small"
          @click="opendog"
          >新增专题</el-button
        >
      </div>

      <!-- default-expand-all -->
      <el-table
        :data="datalist"
        border
        :tree-props="{
          children: 'materialDetails',
          hasChildren: 'hasChildren',
        }"
        @selection-change="handleSelectionChange"
        class="table_son"
        :hearder-cell-style="getHearderStyle"
      >
        <el-table-column width="55" type="expand" align="center">
          <template #default="{ row }">
            <el-table
              :data="row.materialDetails"
              border
              default-expand-all
              :show-header="true"
              class="table_son_css"
              :cell-style="cellStyle"
            >
              <!-- <el-table-column type="selection" width="55"></el-table-column> -->
              <!-- <el-table-column prop="content" align="center"> </el-table-column> -->
              <el-table-column
                prop="onlineName"
                label="在线文本名称"
                align="center"
              />
              <el-table-column prop="des" label="说明" align="center" />
              <el-table-column
                prop="createTime"
                label="创建时间"
                align="center"
              />
              <!-- <el-table-column prop="title" label="最新编辑时间" align="center" /> -->
              <el-table-column prop="name" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="mini"
                    @click="dataEdit(scope.row, row)"
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    size="mini"
                    @click="exportcart(scope.row, '资料')"
                    >导出</el-button
                  >
                  <el-button
                    type="text"
                    size="mini"
                    @click="deletecart(scope.row, '资料')"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column prop="name" label="专题名称" align="center" />
        <el-table-column prop="des" label="说明" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <!-- <el-table-column prop="title" label="最新编辑时间" align="center" /> -->
        <el-table-column prop="name" label="操作" align="center">
          <template #default="{ row }">
            <el-button type="text" size="mini" @click="addDoCart(row)"
              >新增</el-button
            >

            <el-button type="text" size="mini" @click="editcart(row)"
              >编辑</el-button
            >
            <el-button type="text" size="mini" @click="exportcart(row, '专题')"
              >导出</el-button
            >
            <el-button type="text" size="mini" @click="deletecart(row, '专题')"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <diolog v-model="show" width="70%" :title="title" v-if="show">
        <el-form
          :model="form"
          ref="form"
          :rules="rules"
          label-width="150px"
          :inline="false"
          size="normal"
        >
          <el-form-item label="专题名称" prop="name">
            <el-input
              :disabled="formState == '资料' ? true : false"
              v-model="form.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否个人可见" v-if="formState != '资料'">
            <el-radio v-model="form.matDataScope" label="1">个人</el-radio>
            <el-radio v-model="form.matDataScope" label="2">公开</el-radio>
          </el-form-item>
          <el-form-item label="专题说明">
            <el-input
              :disabled="formState == '资料' ? true : false"
              type="textarea"
              v-model="form.des"
            ></el-input>
          </el-form-item>
          <el-form-item label="上传附件" v-if="formState != '专题'">
            <!-- :show-file-list="true" -->
            <!-- :before-upload="befroeUpdate" -->
            <!-- :on-remove="handleRemove" -->
            <el-upload
              action="#"
              :class="['upload-demo', files.length == 0 ? '' : 'test_update']"
              :on-change="handleChange"
              multiple
              :on-remove="handleRemove"
              ref="upload"
              :file-list="fileList"
              :auto-upload="false"
            >
              <el-button type="primary" size="default">上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item
            prop="onlineName"
            label="在线文本名称"
            v-if="formState != '专题'"
          >
            <el-input v-model="form.materialDetails.onlineName"></el-input>
          </el-form-item>

          <el-form-item
            label="文本内容"
            prop="content"
            v-if="form.materialDetails.onlineName && formState != '专题'"
          >
            <tinymce v-model="form.materialDetails.content" ref="editor" />
            <!-- {{ form.content }} -->
          </el-form-item>

          <el-form-item label="备注" prop="des" v-if="formState != '专题'">
            <el-input
              type="textarea"
              v-model="form.materialDetails.des"
            ></el-input>
          </el-form-item>
          <el-form-item style="text-align: right">
            <el-button type="primary" size="small" @click="show = false"
              >取消</el-button
            >
            <el-button type="primary" size="small" @click="onSubmit"
              >确定</el-button
            >
          </el-form-item>
        </el-form>
      </diolog>
    </div>
    <diolog
      v-model="pdfmodel"
      :title="pdftitle"
      width="70%"
      v-if="pdfmodel"
      @close="closePdf"
    >
      <div class="dia_log_content">
        <!-- {{ lookdata }} -->
        <div class="title">
          {{ lookdata.onlineName }}
          <div
            class="document_down"
            @click="
              exportcart(
                {
                  detailId: lookdata.detailId,
                  onlineName: lookdata.onlineName,
                },
                '资料'
              )
            "
          >
            下载全部
            <!-- <i class="el-icon-download"></i> -->
          </div>
        </div>
        <div class="time_css">{{ lookdata.createTime }}</div>
        <div class="html_content" v-html="lookdata.content"></div>
      </div>

      <div v-for="(item, index) in lookListData" :key="index">
        <div
          v-if="item.type != 'zip'"
          class="download_css"
          @click="
            exportEveryOne(item.blob, 'application/zip', item.fileName, '.zip')
          "
        >
          <i class="el-icon-download"></i>
        </div>

        <div v-if="item.type == 'png'">
          <img :src="item.url" style="width: 100%; height: 100%" alt="" />
        </div>
        <div v-else-if="item.type == 'pdf'">
          <iframe
            :src="item.url"
            frameborder="0"
            style="width: 100%; height: 75vh"
          ></iframe>
        </div>
        <div v-else-if="item.type == 'mp4'">
          <video style="width: 100%" controls>
            <source :src="item.url" type="video/mp4" />
          </video>
        </div>
        <div v-else style="text-align: center">
          <div class="content_info_css">
            该格式文档暂不支持在线预览功能请下载到本地后进行查看！
          </div>
          <div
            class="content_infobtn_css"
            @click="
              exportEveryOne(
                item.blob,
                'application/zip',
                item.fileName,
                '.zip'
              )
            "
          >
            立即下载
          </div>
        </div>
      </div>
    </diolog>
  </div>
</template>

<script>
import diolog from "@/components/Dialog/index.vue";
import tinymce from "@/components/Tinymce/index.vue";
import middle from "./compontents/middle.vue";
import {
  通用上传请求单个多媒体数据,
  查询图片服务器地址,
  资料管理列表,
  资料管理增加,
  资料管理删除,
  资料管理查询,
  资料管理编辑,
  资料管理导出,
  本地文件通用下载,
  资料在线文档增加,
  资料在线文档查询,
  资料在线文档编辑,
  资料在线文档删除,
  资料在线文档导出,
} from "@/api/knowledge/knowledge.js";
import { saveAs } from "file-saver";

class formContemt {
  constructor() {
    this.matDataScope = "2";
    this.materialDetails = {
      attachments: [],
      content: "",
      des: "",
      onlineName: "",
    };
    this.name = "";
    this.des = "";
  }
}
export default {
  components: {
    diolog,
    tinymce,
    middle,
  },
  data() {
    return {
      formatd: [
        "jpg",
        "png",
        "jpeg",
        "mp3",
        "wma",
        "rm",
        "wav",
        "mid",
        "flv",
        "avi",
        "mov",
        "mp4",
        "wmv",
        "pdf",
        "docx",
        "wmv",
      ],
      formState: "",
      piclist: ["jpg", "png", "jpeg"],
      audiolist: ["mp3"],
      videolist: ["mp4"],
      pdflist: ["pdf"],
      wordlist: ["rtf", "docx"],

      fileList: [],
      rules: {
        name: [
          {
            required: true,
            message: "请输入专题名称",
            trigger: "blur",
          },
        ],
      },
      current: false, //默认为视图
      show: false,
      title: "新增",
      form: new formContemt(),
      datalist: [
        {
          des: "测试",
          matDataScope: "1",
          materialId: "1",
          name: "测试",
          createTime: "2020",
          hasChildren: false,
          materialDetails: [
            {
              attachments: [],
              content: "测试",
              createBy: "",
              des: "ces ",
              materialId: 1,
              onlineName: "文档1 ",
            },
          ],
        },
      ], //列表数据
      upfoldlist: [],
      editor: null,
      multipleSelection: [], //选中的
      files: [],
      pdfmodel: false, //pdf查看弹框
      pdftitle: "pdf", //pdf标题
      pdfValue: "", //pdf文档
      file_format: "", //当前是什么格式
      fileContent: "", //流
      lookListData: [], //转后的全部文件
      lookdata: null, //接口取到的所有的数据
    };
  },
  created() {
    查询图片服务器地址().then((res) => {
      this.imgurl = res.data.imageServerUri;
    });
    this.getalldata();
  },
  methods: {
    //表头的颜色
    getHearderStyle() {
      return "background:#66371a";
    },
    // table每行的颜色
    cellStyle() {
      return "background:#122b54";
    },
    //资料的编辑
    async dataEdit(row, father) {
      this.title = "编辑";
      // console.log(row, scope, father, "red");
      this.formState = "资料";
      let res = await 资料在线文档查询(row.detailId);
      console.log(res.data, "结果");
      this.form = {
        name: father.name,
        materialDetails: res.data,
        des: father.des,
      };
      //赋值回显
      this.fileFn(res.data.attachments);
      this.show = true;
    },
    fileFn(files) {
      this.files = files.map((i) => {
        return { ...i, name: i.fileName };
      });
      this.fileList = files.map((i) => {
        return { ...i, name: i.fileName };
      });
    },
    //新增栏目下页面
    addDoCart(row) {
      this.title = "新增";
      this.files = [];
      this.fileList = [];
      this.formState = "资料";
      this.form = {
        ...this.form,
        materialDetails: {
          // ...this.form.materialDetails,
          materialId: row.materialId,
        },
        des: row.des,
        name: row.name,
      };
      this.show = true;
      console.log(row, "row");
    },
    closePdf() {
      this.pdfValue = "";
      this.fileContent = "";
      this.file_format = "";
    },
    //通用导出
    exportEveryOne(res, application, name, suffix) {
      const blob = new Blob([res], { type: application });
      saveAs(blob, `${name + new Date().getTime() + suffix}`);
    },
    // 新增打开弹框
    opendog() {
      this.formState = "";
      this.files = [];
      this.fileList = [];
      this.form = new formContemt();
      this.show = true;
    },
    //查看每个文档
    async lookPdf(i, name) {
      // console.log(i, "查看文档");
      let detailId = i.detailId;
      let res = await 资料在线文档查询(i.detailId);
      console.log(res.data, "res");
      this.lookdata = res.data;
      let results = res.data.attachments;
      let files,
        blob,
        suffix,
        arr = [];
      for (let i = 0; i < results.length; i++) {
        suffix = results[i].fileName.split(".").pop().toLowerCase();
        files = await 本地文件通用下载({ id: results[i].fileId });
        if (this.piclist.some((idx) => idx == suffix)) {
          blob = new Blob([files]);
          arr.push({
            url: URL.createObjectURL(blob),
            type: "png",
            id: detailId,
            blob,
            fileName: results[i].fileName.split(".")[0],
          });
        } else if (this.videolist.some((idx) => idx == suffix)) {
          blob = new Blob([files], { type: "video/x-msvideo" });
          arr.push({
            url: URL.createObjectURL(blob),
            type: "video",
            id: detailId,
            blob,
            fileName: results[i].fileName.split(".")[0],
          });
        } else if (this.pdflist.some((idx) => idx == suffix)) {
          blob = new Blob([files], { type: "application/pdf" });
          arr.push({
            url: URL.createObjectURL(blob),
            type: "pdf",
            id: detailId,
            blob,
            fileName: results[i].fileName.split(".")[0],
          });
        } else {
          blob = new Blob([files], { type: "application/zip" });
          arr.push({
            url: URL.createObjectURL(blob),
            type: "zip",
            id: detailId,
            blob,
            fileName: results[i].fileName.split(".")[0],
          });
        }
      }
      this.lookListData = arr;
      this.pdftitle = name;
      this.pdfmodel = true;
    },

    async getalldata() {
      let res = await 资料管理列表();
      console.log(res, "rd");
      this.datalist = res.rows;
    },
    //多选的文件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //删除上传文件
    handleRemove(file) {},
    async handleChange(e, filelist) {
      let suffix = e.name.split(".").pop().toLowerCase();
      if (this.formatd.findIndex((i) => i == suffix) == -1) {
        console.log(e, "错误的");
        // console.log(this.$refs.upload.uploadFiles, "res文件");
        this.$refs.upload.uploadFiles = this.$refs.upload.uploadFiles.filter(
          (i) => i.name != e.name
        );
        return this.$modal.msgError("格式错误");
      } else {
        console.log(
          e,
          "走这个",
          this.formatd.findIndex((i) => i == suffix),
          suffix
        );
        let res = await this.verify(e);
        console.log(res, "机构");
        this.files.push(res);
      }
      // }
      // }
    },
    lookcart(row, index, e) {
      console.log(row, index, e, "red");
    },
    //根据id显示
    upfold(e) {
      // console.log(e);
      let res = this.upfoldlist.findIndex((i) => i == e);
      if (res == -1) {
        this.upfoldlist.push(e);
      } else {
        this.upfoldlist = this.upfoldlist.filter((i) => i != e);
      }
    },
    //判断有没有打开
    getblock(id) {
      let res = this.upfoldlist.findIndex((i) => i == id);
      return res == -1 ? false : true;
    },
    //导出all
    async exportAll() {
      if (this.multipleSelection.length == 0)
        return this.$modal.msgError("请先选中");
      this.exportData(
        this.multipleSelection.map((i) => i.materialId),
        "选中专题"
      );
    },
    //导出
    async exportcart(row, data) {
      if (data == "资料") {
        this.exportEvery([row.detailId], row.onlineName);
      } else {
        this.exportData([row.materialId], row.name);
      }
    },
    //导出资料
    async exportEvery(arr, name) {
      let res = await 资料在线文档导出({ ids: arr });
      this.exportEveryOne(res, "application/zip", name, ".zip");
    },
    //导出专题
    async exportData(arr, name) {
      let res = await 资料管理导出({ ids: arr });
      this.exportEveryOne(res, "application/zip", name, ".zip");
    },

    //编辑查询
    async editcart(row) {
      this.title = "编辑";
      this.formState = "专题";
      let res = await 资料管理查询(row.materialId);
      this.form = res.data;
      this.show = true;
    },
    //删除
    async deletecart(row, data) {
      let res = await this.$modal.confirm("确实删除吗");
      if (res) {
        if (data == "资料") {
          await 资料在线文档删除(row.detailId);
        } else {
          await 资料管理删除(row.materialId);
        }
        this.getalldata();
        this.$modal.msgSuccess("删除成功");
      }
    },
    onSubmit() {
      this.$refs.form.validate(async (res) => {
        if (res) {
          if (this.formState == "资料") {
            if (this.form.materialDetails.detailId) {
              let obj = {
                ...this.form.materialDetails,
                attachments: this.files,
              };
              delete obj.remark;
              delete obj.updateBy;
              delete obj.updateTime;
              delete obj.createTime;
              delete obj.createBy;
              console.log(obj, "资料");
              await 资料在线文档编辑(obj);
              this.getalldata();
              this.show = false;
              this.$modal.msgSuccess("编辑成功");
            } else {
              await 资料在线文档增加({
                ...this.form.materialDetails,
                attachments: this.files,
              });
              this.getalldata();
              this.show = false;
              this.$modal.msgSuccess("新增成功");
            }
            this.formState = "";
          } else {
            if (this.form.materialId) {
              await 资料管理编辑(this.form);
              this.form = new formContemt();
              this.getalldata();
              this.show = false;
              this.$modal.msgSuccess("编辑成功");
              this.formState = "";
            } else {
              await 资料管理增加({
                ...this.form,
                materialDetails: [
                  { ...this.form.materialDetails, attachments: this.files },
                ],
              });
              this.getalldata();
              this.show = false;
              this.$modal.msgSuccess("新增成功");
            }
          }
        }
      });
    },
    //上传
    async verify(e) {
      console.log(e, "参数");
      let suffix = e.name.split(".").pop().toLowerCase();
      let piclist = ["jpg", "png", "jpeg"];
      let audiolist = ["mp3", "wma", "rm", "wav", "mid"];
      let videolist = ["flv", "avi", "mov", "mp4", "wmv"];
      let params = new FormData();
      params.append("file", e.raw);
      let type = 0,
        fileName,
        results;
      // 如果是图片
      fileName = e.name;
      if (e.name && piclist.some((i) => i == suffix)) {
        type = 1;
        params.append("fileType	", 1);
        //音频
      } else if (e.name && audiolist.some((i) => i == suffix)) {
        type = 3;
        params.append("fileType	", 3);
        //视频
      } else if (e.name && videolist.some((i) => i == suffix)) {
        type = 2;
        params.append("fileType	", 2);
      } else if (
        e.name &&
        [...this.pdflist, ...this.wordlist].some((i) => i == suffix)
      ) {
        type = 4;
        //word文档
        params.append("fileType	", 4);
      } else {
        this.$refs.upload.uploadFiles = this.$refs.upload.uploadFiles.filter(
          (i) => i.name != e.name
        );
        return this.$modal.msgError("格式错误");
      }
      try {
        results = await 通用上传请求单个多媒体数据(params);
      } catch (error) {
        console.log(error);
        console.log(this.$refs.upload.uploadFiles, "cuowu");
      }
      console.log(results, "red");
      return {
        fileId: results.data.id,
        fileName,
        fileType: type,
        // url: this.imgurl + results.data.fileUrl,
        url: results.data.fileUrl,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.download_css {
  text-align: right;
  width: 100%;
  color: #fff;
  font-size: 19px;
  cursor: pointer;
}
// ::v-deep
//上传的样式
::v-deep .el-upload-list__item:first-child {
  margin-top: 5px;
}
.test_update ::v-deep .el-upload-list {
  border: 1px solid #fff;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  border-radius: 4px;
  margin-top: 10px;
}
::v-deep .el-upload-list__item {
  width: auto;
  padding-bottom: 4px;
}
::v-deep .el-upload {
  // width: 100%;
}
.table_tilete {
  font-size: 20px;
  font-weight: 500;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.report_list {
  cursor: pointer;
  color: #3862ce;
  margin-top: 10px;
  font-size: 14px;
}
.btns_style {
  float: right;
  padding: 10px;
}
.current {
  position: absolute;
  top: -38px;
  right: 0;
  cursor: pointer;
  color: #fff;
}
.imgopen {
  width: 10px;
  transform: rotate(270deg);
}
.imgclose {
  transform: rotate(90deg);
}
.upfold {
  position: absolute;
  cursor: pointer;
  right: 1%;
  bottom: 0;
}
.content_info {
  position: relative;
  height: 20px;
  overflow: hidden;
  transition: height 4s;
}
.show_content {
  position: relative;
  min-height: 30px;
  overflow: hidden;
  -webkit-transition: height 4s;
  transition: height 4s;
  // max-height: 50px;
  // transition: height 5s;
}

.every_box {
  border-bottom: 1px solid #421b96;
  padding: 10px 0;
}
.second_level {
  color: #3157b9;
  font-size: 14px;
  margin-top: 5px;
  cursor: pointer;
}
.title1 {
  cursor: pointer;
  width: 100%;
  display: -webkit-box;
  overflow: hidden;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
}
.box {
  position: relative;
  height: calc(100vh - 120px);
  //   width: 100vw;
}
.leftbox {
  width: 20%;
  // height: calc(100vh - 20px);
  // height: 97%;
  // border: 1px solid #421b96;
  box-shadow: inset 3px 3px 3px #054588, inset -3px -3px 3px #054588;
  padding: 10px;
}
.middle {
  width: calc(80% - 10px);
  margin-left: 5px;
  height: 100%;
  // height: 97%;
  // background-color: red;
}
.box_content {
  height: 100%;
  display: flex;
}

.title_info {
  position: relative;
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 17px;
  color: #fff;
  padding: 1px 10px;
  font-weight: 500;
  span {
    width: 30%;
  }
  div {
    background-image: url("/img/ui/bias.svg");
    position: absolute;
    display: inline-block;
    top: 4px;
    width: 70%;
    height: 25px;
    background-size: inherit;
    background-position: 25px 2px;
    -webkit-transform: scale(0.7);
    transform: scale(0.7);
  }
}
.content {
  height: 97%;
  padding: 10px;
  overflow: auto;
  color: #fff;
}

.content_info_css {
  margin-top: 20px;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}
.content_infobtn_css {
  color: #3862ce;
  font-size: 14px;
  margin-top: 20px;
}
::v-deep .el-table--medium .el-table__cell {
  padding: 0;
  height: 50px;
}

//弹框的信息css
.dia_log_content {
  color: #fff;
  .title {
    position: relative;
    font-size: 18px;
  }
  .time_css {
    font-size: 12px;
    margin-top: 5px;
  }
  .html_content {
    font-size: 14px;
  }
}
.document_down {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 14px;
  cursor: pointer;
}

::v-deep .el-input.is-disabled .el-input__inner {
  color: black;
}
::v-deep .el-textarea.is-disabled .el-textarea__inner {
  color: black;
}
::v-deep .table_son_css {
  margin-left: 110px;
  width: calc(100% - 110px);
}
::v-deep .el-table__expanded-cell {
  background: #0f1c40;
}
::v-deep .btn_custom {
  font-size: 12px;
  border-radius: 3px;
  background: #122b54;
  border: 0;
  color: #1296db;
  box-shadow: inset 3px 3px 3px #054588, inset -3px -3px 3px #054588;
}
::v-deep .eltable >>> .warning-row th {
  background: red !important;
}
::v-deep .table_son td.el-table__cell div {
  color: #fff;
}
::v-deep .el-table th.el-table__cell.is-leaf,
.el-table td.el-table__cell {
  text-align: center;
}
</style>