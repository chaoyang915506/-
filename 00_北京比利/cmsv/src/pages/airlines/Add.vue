<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-2"></div>
      <div class="col-md-8">
        <div class="form-group row">
          <div class="col-sm-6">
            <h3>添加航空公司</h3>
          </div>
        </div>

        <div v-if="id" class="form-group row">
          <label for="inputEmail3" class="col-sm-4 col-form-label text-right"
            >ID</label
          >
          <div class="col-sm-6">
            <input disabled type="text" class="form-control" v-model="id" />
          </div>
        </div>

        <div class="form-group row">
          <label for="inputEmail3" class="col-sm-4 col-form-label text-right"
            >ICAO code</label
          >
          <div class="col-sm-6">
            <input type="text" class="form-control" v-model="icao_code" />
          </div>
        </div>

        <div class="form-group row">
          <label for="inputEmail3" class="col-sm-4 col-form-label text-right"
            >IATA code</label
          >
          <div class="col-sm-6">
            <input type="text" class="form-control" v-model="iata_code" />
          </div>
        </div>

        <div class="form-group row">
          <label for="inputEmail3" class="col-sm-4 col-form-label text-right"
            >来源</label
          >
          <div class="col-sm-6">
            <validation-provider rules="required" v-slot="{ errors }">
              <select id="sourceSelect" class="form-control" v-model="source">
                <option value="-1">请选择</option>
                <option value="0">香港国际机场</option>
                <option value="1">新加坡国际机场</option>
              </select>
              <span id="error">{{ errors[0] }}</span>
            </validation-provider>
            <span id="selectError">请选择源</span>
          </div>
        </div>

        <div class="form-group row">
          <label
            class="col-sm-4 col-form-label text-right"
            for="exampleFormControlFile1"
            >图标</label
          >
          <div class="col-sm-6">
            <cool-file-input
              v-if="showUpComponents"
              v-model="pic"
              :uploadUrl="Imgurl"
              fileType="image"
              :extensions="extensions"
            ></cool-file-input>
          </div>
        </div>

        <div class="form-group row">
          <label for="inputEmail3" class="col-sm-4 col-form-label text-right"
            >航空公司名称（多语言）</label
          >
          <div class="col-sm-6">
            <input
              id="multipleLanguage"
              @click="handleMultipleLanguage"
              type="text"
              class="form-control"
              v-model="languages"
            />
            <span id="nameError">名称不能为空！</span>
          </div>
        </div>

        <div class="form-group row">
          <div class="col-sm-4"></div>
          <div class="col-sm-6">
            <button
              v-show="isUpdate"
              @click="handleUpdate"
              class="btn btn-primary"
            >
              更新
            </button>
            <button
              v-show="!isUpdate"
              @click="handleCreate"
              class="btn btn-primary"
            >
              添加
            </button>
            &nbsp;&nbsp;
            <button @click="goback" class="btn btn-secondary">返回</button>
          </div>
        </div>
      </div>
      <div class="col-md-2"></div>
    </div>

    <CoolModal
      title="添加航空公司名称"
      :visible="visible"
      @hidden="visible = false"
      :footer="{ visible: false }"
    >
      <div class="row">
        <div class="col-md-12">
          <div
            v-for="item in languageList"
            :key="item.langId"
            class="form-group row"
          >
            <label
              for="inputEmail3"
              class="col-sm-4 col-form-label text-right"
              >{{ item.langDesc }}</label
            >
            <div class="col-sm-6">
              <input
                @keyup.enter="handleFormData"
                type="text"
                class="form-control"
                v-model="item.values"
              />
            </div>
          </div>

          <div class="form-group row">
            <div class="col-md-12">
              <div class="row">
                <div class="col-md-6"></div>
                <div class="col-md-6">
                  <button @click="handleFormData" class="btn btn-primary">
                    确定
                  </button>
                  &nbsp;&nbsp;
                  <button
                    @click="handleMultipleLanguage"
                    class="btn btn-secondary"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CoolModal>
    <CoolLoading :loading="loading" />
  </div>
</template>

<script>
import CoolModal from "@/components/CoolModal.vue";
import AirlinesApi from "@/api/Airlines";
import env from "@/env";
import CoolFileInput from "@/components/CoolFileInput.vue";
import UploadApi from "@/api/UploadApi";
import CoolLoading from "@/components/CoolLoading.vue";
import swal from "@/plugins/sweetalert";
import common from "@/common";
import { ValidationProvider, extend } from "vee-validate";
import * as rules from "vee-validate/dist/rules";
import $ from "jquery";

extend("required", {
  ...rules,
  validate: function(value) {
    if (value == -1) {
      $("#sourceSelect").addClass("is-invalid");
      return "请选择源";
    }
    $("#sourceSelect").removeClass("is-invalid");
    $("#selectError").hide();
    return true;
  },
});

export default {
  name: "Add",
  data() {
    return {
      showUpComponents: false,
      loading: false,
      icao_code: "",
      iata_code: "",
      source: "",
      pic: "",
      multiple_language: "",
      visible: false,
      languageList: [],
      languages: "",
      // Imgurl: "",
      extensions: ["jpg", "png"],
      Imgurl: UploadApi.getUrl("image"), //上传a的文件
      paramsName: {},
      isUpdate: false,
      id: "",
    };
  },
  components: { CoolModal, CoolFileInput, CoolLoading, ValidationProvider },
  methods: {
    handleMultipleLanguage: function() {
      this.visible = this.visible ? false : true;
    },
    handleFormData: function() {
      let str = "";
      const _this = this;
      this.languageList.forEach(function(item, idx) {
        if (item.values) {
          str += item.values + "|";
        }
        let oKey = "l" + idx;
        _this.paramsName[oKey] = item.values;
      });
      this.languages = str.slice(0, str.length - 1);
      this.visible = this.visible ? false : true;
      if (this.languages.length > 0) {
        $("#multipleLanguage").removeClass("is-invalid");
        $("#nameError").hide();
      }
    },
    handleCreate: async function() {
      this.loading = true;
      try {
        let data = {
          airline: {
            code: this.icao_code,
            iataCode: this.iata_code,
            icon: this.pic,
            source: this.source,
          },
          name: this.paramsName,
        };
        this.validatePost();
        await AirlinesApi.create(env.token, data);
        common.info(
          "添加成功",
          function() {
            this.goback();
          }.bind(this)
        );
      } catch (e) {
        swal.error(e);
      }
      this.loading = false;
    },
    validatePost: function() {
      let flag = 0;
      if (this.source == -1 || this.source === "") {
        $("#sourceSelect").addClass("is-invalid");
        $("#selectError").show();
        flag += 1;
      }

      if (this.languages.length == 0) {
        $("#multipleLanguage").addClass("is-invalid");
        $("#nameError").show();
        flag += 2;
      }

      if (flag === 1) throw `请选择来源`;
      if (flag === 2) throw `航空公司名称不可为空`;
      if (flag === 3) throw `请完成必填数据`;
    },
    handleUpdate: async function() {
      this.loading = true;
      try {
        let data = {
          airline: {
            code: this.icao_code,
            iataCode: this.iata_code,
            icon: this.pic,
            source: this.source,
            id: this.id,
          },
          name: this.paramsName,
        };
        this.validatePost();
        await AirlinesApi.update(env.token, data);
        common.info(
          "更新成功",
          function() {
            this.goback();
          }.bind(this)
        );
      } catch (e) {
        swal.error(e);
      }
      this.loading = false;
    },
    goback() {
      let url = "/cmsv/airlines/index.html?token=" + env.token;
      this.$router.push(url);
    },
    async initInfo() {
      this.id = this.$route.query.id || "";
      if (this.id === "") {
        this.showUpComponents = true;
      }
      if (this.id > 0) {
        this.isUpdate = true;

        const r = await AirlinesApi.getInfo(env.token, this.id);
        this.icao_code = r.airline.code;
        this.iata_code = r.airline.iataCode;
        this.source = r.airline.source;
        this.pic = r.airline.icon;
        let iii = 0;
        for (let key in r.name) {
          if (iii == 0) {
            iii++;
            continue;
          }
          let langId = key.slice(1);
          this.languageList.map(function(item) {
            if (item.langId == langId) {
              item.values = r.name[key];
            }
          });
        }
        this.handleFormData();
        this.visible = false;
        this.showUpComponents = true;
      }
      // 初始化更新结束
    },

    async initLanguages() {
      const res = await AirlinesApi.getLanguageList(env.token);
      res.map(function(item) {
        item.values = "";
      });
      this.languageList = res;
    },
  },
  async created() {
    await this.initLanguages();
    await this.initInfo();
  },
};
</script>
<style scoped>
#error {
  color: red;
}

#nameError {
  color: red;
  display: none;
}

#selectError {
  color: red;
  display: none;
}
</style>
