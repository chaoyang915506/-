<template>
  <div>
    <h2>{{ $t("toAirport.AirlineUpdates") }}</h2>
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      label-width="20%"
      :inline="false"
      size="normal"
    >
      <el-form-item label="ID">
        <el-input v-model="form.id" disabled></el-input>
      </el-form-item>
      <el-form-item :label="vendor + $t('confirm.name')">
        <el-select :placeholder="$t('confirm.pleasechoose')" v-model="form.hotelId" disabled>
          <el-option
            v-for="(item, idx) in hotelList"
            :key="idx"
            :label="item.hotelName"
            :value="item.hotelId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('toAirport.airport') + ' ' + $t('toAirport.name')">
        <el-select v-model="form.airportId" disabled>
          <el-option
            v-for="(item, idx) in includelist"
            :key="idx"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('toAirport.airline')">
        <el-select v-model="form.airlineId" disabled>
          <el-option
            v-for="(item, idx) in airlineList"
            :key="idx"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('hotellanguage.language')">
        <el-select v-model="form.langId" disabled>
          <el-option
            v-for="(item, idx) in langList"
            :key="idx"
            :label="item.label"
            :value="item.langId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('toAirport.airline') + 'icon'" prop="icon">
        <el-upload
          :action="url"
          list-type="picture-card"
          v-model="form.icon"
          :on-change="uploadPictureChange"
          :on-preview="handlePictureCardPreview"
          :file-list="fileList"
          :show-file-list="true"
          :before-upload="beforeUpload"
          :limit="1"
          :data="formupload"
          :on-remove="uploadPictureRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ $t("confirm.ok") }}</el-button>
        <el-button @click="$emit('close')">{{ $t("confirm.return") }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import env from "@/env";
import toAirportListApi from "@/api/toAirportListApi";
import UploadApi from "@/api/UploadApi";
export default {
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
    languageList: {
      type: Array,
      default: () => [],
    },
    includelist: {
      type: Array,
      default: [],
    },
    airlineList: {
      type: Array,
      default: [],
    },
    langList: {
      type: Array,
      default: [],
    },
  },
  data() {
    let validateMobile = (rule, value, callback) => {
      if (this.formData.fileList.length == 1) {
        // 放行
        callback();
      } else {
        //  提示错误
        callback(new Error(this.$t("toAirport.airline") + "icon" + this.$t("confirm.notempty")));
      }
    };
    return {
      formupload: {
        icon: "",
        file_id: 0,
        fileIdAttributeName: "icon",
      },
      dialogVisible: false,
      dialogImageUrl: "", //放大的图片
      url: UploadApi.getUrl("image"),
      fileList: JSON.parse(JSON.stringify(this.formData.fileList)),
      vendor: env.vendor,
      form: JSON.parse(JSON.stringify(this.formData)),
      hotelList: [],
      rules: {
        icon: [
          {
            trigger: "blur",
            validator: validateMobile,
          },
        ],
      },
    };
  },
  created() {
    this.gethotellist();
  },
  watch: {
    fileList: {
      handler(val) {
        this.$set(this.formData, "fileList", val);
        if (val.length >= 1) {
          // this.formData.fileList = val;
          this.$nextTick(() => {
            document.querySelector(".el-upload").style.display = "none";
          });
        } else {
          this.$nextTick(() => {
            document.querySelector(".el-upload").style.display = "inline-block";
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    beforeUpload(file, fileList) {
      this.formupload.icon = file;
      const isIMAGE =
        file.type === "image/jpg" || file.type === "image/jpeg" || file.type === "image/png";
      const isLt1M = file.size / 1024 / 500 < 1;
      if (!isIMAGE) {
        this.$message.error("上传文件只能是jpg或png图片格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 500kb!");
      }
      return isIMAGE && isLt1M;
    },
    //两个
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // uploadPictureSuccess(file, list) {
    //   console.log(file, list, "upload");
    // },
    uploadPictureRemove(file, list) {
      this.fileList = list;
    },
    uploadPictureChange(file, filelist) {
      // console.log(file, filelist, "changeg");
      this.fileList = filelist;
    },
    gethotellist() {
      toAirportListApi.getHotelList().then((res) => {
        this.hotelList = res;
      });
    },
    onSubmit() {
      this.$refs.form.validate((res) => {
        if (res) {
          let data = {
            ...this.form,
            icon:
              this.fileList.length !== 0 && this.fileList[0] ? this.fileList[0].response.data : "",
          };
          delete data.fileList;
          toAirportListApi.update(data).then((data) => {
            this.$emit("close", "refresh");
             this.$message.success(this.$t("confirm.editsuccess"))
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep.el-select {
  width: 100%;
}
::v-deep .el-upload {
  display: inline-block;
}
.el-form-item__label {
  line-height: 40px;
}
::v-deep .el-input.is-disabled .el-input__inner {
  color: #1f2e4d;
}
</style>
