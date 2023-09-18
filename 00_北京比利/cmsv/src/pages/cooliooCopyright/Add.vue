<template>
  <container>
    <template v-slot:area>
      <el-page-header @back="goback" :content="$t('coolioo.cp.bjbq')"> </el-page-header>
      <el-card>
        <div class="headline">
          <span class="title">{{ $t("coolioo.cp.jbxx") }}</span>
        </div>
        <multiple-lang v-on:hookRefreshLang="refreshLang" :lists="langlists" />
        <el-row>
          <el-col :span="2">
            <div class="c1">{{ $t("coolioo.cp.logo") }}</div>
          </el-col>
          <el-col :span="4">
            <el-upload
              :data="{
                type: 'image',
                fileIdAttributeName: 'file',
                file_id: '1',
              }"
              :action="url"
              :on-success="logouploadsuccess"
              list-type="picture"
              :file-list="fileList"
              class="upload-demo"
              :accept="exts"
              :on-preview="previews"
            >
              <el-button type="primary">{{ $t("coolioo.cp.djsc") }}</el-button>
            </el-upload>
          </el-col>
        </el-row>
        <br />
        <el-row>
          <el-col :offset="1" :span="20">
            <cool-scroll :len="len" :width="1000" :distance="400" :height="250">
              <Descs
                :info="item"
                v-show="item.status"
                v-for="item in langlists"
                :key="item.langId"
              />
            </cool-scroll>
          </el-col>
        </el-row>
      </el-card>

      <!-- <cool-scroll :width="1000" :distance="400" :height="250">
        <Descs :info="item" v-show="item.status" v-for="item in langlists" :key="item.langId" />
      </cool-scroll> -->

      <el-card>
        <div class="headline">
          <span class="title">{{ $t("coolioo.cp.fzgl") }}</span>
          &nbsp;&nbsp;
          <el-button @click="dialogVisible = true" size="mini" type="primary"
            >+{{ $t("coolioo.cp.tjfz") }}</el-button
          >
          <span class="tips">*每个栏目最少需要2个分组，否则CooliooTV端会很丑哦~</span>
        </div>
        <el-row>
          <el-col :span="24">
            {{ $t("coolioo.cp.qbfz") }}：
            <el-tag
              v-show="item.cmsMediaTypeLangList.length"
              @click="choosegroup(item)"
              v-for="item in grouplists"
              :key="item.id"
            >
              {{ showTag(item) }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            {{ $t("coolioo.cp.xzfz") }}：
            <el-tag
              @close="deletegroup(item)"
              closable
              v-for="item in bechoosegroup"
              :key="item.id"
            >
              {{ item.name }}
            </el-tag>
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <div class="headline">
          <span class="title">{{ $t("coolioo.cp.sqxx") }}</span>
        </div>
        <el-row>
          <el-col :span="2">
            <div class="c1">*{{ $t("coolioo.cp.gsmc") }}</div>
          </el-col>
          <el-col :span="10">
            <el-input style="width: 350px" v-model="company"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="c1">{{ $t("coolioo.cp.lxfs") }}</div>
          </el-col>
          <el-col :span="10">
            <el-input style="width: 350px" v-model="contact"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="c1">*{{ $t("coolioo.cp.yxq") }}</div>
          </el-col>
          <el-col :span="16">
            <el-date-picker
              v-model="dates"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd 00:00:00"
            >
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2"> *{{ $t("coolioo.cp.qy") }} </el-col>
          <el-col :span="18">
            <el-radio v-for="item in arealists" :key="item.id" v-model="areaId" :label="item.id">{{
              item.name
            }}</el-radio>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2">
            <div class="c1">授权书</div>
          </el-col>
          <el-col :span="4">
            <el-upload
              list-type="picture"
              :file-list="authList"
              class="upload-demo"
              :data="{
                type: 'image',
                fileIdAttributeName: 'file',
                file_id: '1',
              }"
              :action="url"
              :on-success="authuploadsuccess"
              :on-preview="previews"
            >
              <el-button type="primary">{{ $t("coolioo.cp.djsc") }}</el-button>
            </el-upload>
          </el-col>
          <el-col :span="16">
            <div class="c1">
              *多个授权链时，请上传全部授权链路。（PNG、JPG、JPEG、PDF格式，不超过1M）
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2">
            <div class="c1">合同文件</div>
          </el-col>
          <el-col :span="4">
            <el-upload
              :limit="1"
              :file-list="contractList"
              class="upload-demo"
              :data="{
                type: 'doc',
                fileIdAttributeName: 'file',
                file_id: '1',
              }"
              :action="furl"
              :on-success="contractuploadsuccess"
              :on-preview="previews"
            >
              <el-button type="primary">点击上传</el-button>
            </el-upload>
          </el-col>
          <el-col :span="16">
            <!-- <div class="c1">*多个授权链时，请上传全部授权链路。（PNG、JPG、JPEG、PDF格式，不超过1M）</div> -->
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2">
            <div class="c1">备注</div>
          </el-col>
          <el-col :span="4">
            <el-input v-model="desc1" type="textarea" :rows="4"></el-input>
          </el-col>
        </el-row>
      </el-card>

      <el-row>
        <el-col :span="4">
          <el-button @click="create" type="primary">{{ $t("coolioo.common.cj") }}</el-button>
        </el-col>
        <el-col :span="4">
          <el-button @click="goback">{{ $t("coolioo.common.qx") }}</el-button>
        </el-col>
      </el-row>

      <!-- 添加开始 -->
      <el-dialog title="添加分组" :visible.sync="dialogVisible">
        <el-form>
          <el-form-item label="" :label-width="formLabelWidth">
            <multiple-lang :lists="langlists"></multiple-lang>
          </el-form-item>

          <el-form-item
            v-show="item.status"
            v-for="(item, idx) in langlists4group"
            :key="idx"
            :label="item.langDesc"
            :label-width="formLabelWidth"
          >
            <el-input v-model="item.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t("coolioo.common.qx") }}</el-button>
          <el-button type="primary" @click="creategroup">{{ $t("coolioo.common.qd") }}</el-button>
        </div>
      </el-dialog>
      <!-- 添加结束 -->
    </template>
  </container>
</template>

<script>
import Container from "@/components/coolioo/Container.vue";
import MultipleLang from "@/components/coolioo/MultipleLang.vue";
import env from "@/env";
import Airlines from "@/api/Airlines";
import CoolScroll from "@/components/coolioo/CoolScroll.vue";
import Descs from "./Desc.vue";
import Upload from "@/api/UploadApi";
import Coolioo from "@/api/Coolioo";

const METATYPE = 25;

export default {
  name: "Add",
  components: {
    Container,
    MultipleLang,
    CoolScroll,
    Descs,
  },
  data() {
    return {
      len: 0,
      exts: "image/png,image/jpg,image/jpeg",
      dialogVisible: false,
      formLabelWidth: "120px",
      contract: "",
      auth: [],
      logo: "",
      url: "",
      company: "",
      contact: "",
      areaId: "1",
      dates: "",
      langlists: [],
      fileList: [],
      authList: [],
      contractList: [],
      desc1: "",
      arealists: [],
      langlists4group: [],
      grouplists: [],
      bechoosegroup: [],
      fullscreenloading: false,
    };
  },
  methods: {
    previews(val) {
      window.open(val.url);
    },
    refreshLang() {
      let len = 0;
      this.langlists.map((item) => {
        if (item.status === true) {
          len += 1;
        }
      });
      this.len = len;
    },
    openfullscreenloading() {
      this.fullscreenloading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
    choosegroup(data) {
      let node = {
        id: data.id,
        name: data.cmsMediaTypeLangList[0].name, //env.locale === "0" ? data.cmsMediaTypeLangs[0].name : data.cmsMediaTypeLangs[1].name,
      };
      this.bechoosegroup.push(node);
    },
    deletegroup(data) {
      let arr = this.bechoosegroup.filter((item) => item.id !== data.id);
      this.bechoosegroup = arr;
    },
    showTag(data) {
      // TODO 支持多语言
      if (data.cmsMediaTypeLangList.length > 0) {
        return data.cmsMediaTypeLangList[0].name;
      }
      // if (env.locale === "0") {
      //   return data.cmsMediaTypeLangs[0].name;
      // } else {
      //   return data.cmsMediaTypeLangs[1].name;
      // }
    },
    async init() {
      let data = await Airlines.getLanguageList(env.token);
      let langdata = data.map((item) => {
        item.status = item.langId === 0 || item.langId === 1 ? true : false;
        item.name = "";
        item.desc = "";
        return item;
      });
      this.langlists = langdata;
      this.langlists4group = JSON.parse(JSON.stringify(langdata));

      let data1 = await Coolioo.getAreas(env.token);
      this.arealists = data1;

      let data2 = await Coolioo.getAllGroup(env.token, 25, 0, 1000000);
      // this.grouplists = data2.list;
      this.grouplists = data2;
    },
    goback() {
      this.$router.push({
        path: "/cmsv/cooliooCopyright/index.html",
        query: {
          token: env.token,
        },
      });
    },
    buildurls() {
      let urls = "";
      this.auth.map((item) => {
        urls += item.url + ";";
      });
      return urls.substring(0, urls.length - 1);
    },
    async create() {
      let cm = [];
      this.langlists.map((item) => {
        if (item.status) {
          let node = {
            langId: item.langId,
            name: item.name,
            description: item.desc,
          };
          cm.push(node);
        }
      });
      let mid = [];
      this.bechoosegroup.map((item) => {
        mid.push(item.id);
      });
      // status 0:禁用 1:启用
      let posturl = this.buildurls();
      let data = {
        logo: this.logo,
        status: "1",
        company: this.company,
        contact: this.contact,
        startTime: this.dates[0],
        expireTime: this.dates[1],
        areaId: this.areaId,
        // authorization: JSON.stringify(this.auth),
        authorization: posturl,
        contract: this.contract,
        description: this.desc1,
        mediaTypeId: mid,
        cmsMediaVendorLangList: cm,
      };
      try {
        this.openfullscreenloading();
        await Coolioo.createCopyright(env.token, data);
        this.fullscreenloading.close();
        this.$notify({
          title: "系统消息",
          message: "版权创建成功",
        });
      } catch (e) {
        this.fullscreenloading.close();
        this.$notify.error({
          title: "系统消息",
          message: "版权创建失败",
        });
      }
    },
    logouploadsuccess(res, file, fileList) {
      this.logo = res.data;
      this.fileList = [
        {
          name: "LOGO",
          url: res.data,
        },
      ];
    },

    authuploadsuccess(res, file, fileList) {
      let obj = {
        name: "授权书",
        url: res.data,
      };
      this.auth.push(obj);
      this.authList.push(obj);
    },
    contractuploadsuccess(res, file, fileList) {
      this.contract = res.data;
      this.contractList = [
        {
          name: "合同",
          url: res.data,
        },
      ];
    },
    uploaderror(err, file, fileList) {},
    addgroup() {
      this.groupvisible = true;
    },
    async creategroup() {
      let cm = [];
      this.langlists4group.map((item) => {
        if (item.status) {
          let node = {
            langId: item.langId,
            name: item.name,
          };
          cm.push(node);
        }
      });

      let data = {
        metaType: METATYPE,
        status: 1,
        typeClass: 2,
        cmsMediaTypeLangs: cm,
      };
      try {
        this.dialogVisible = false;
        this.openfullscreenloading();
        await Coolioo.createGroup(env.token, data);
        this.fullscreenloading.close();

        this.$notify({
          title: "系统消息",
          message: "创建分组成功",
        });
        // 重新获取分组
        let data2 = await Coolioo.getAllGroup(env.token, 25, 0, 1000000);
        this.grouplists = data2.list;
      } catch (e) {
        this.dialogVisible = false;
        this.fullscreenloading.close();
        this.$notify.error({
          title: "系统消息",
          message: "创建分组失败",
        });
      }
    },
  },
  mounted() {
    this.url = Upload.getUrl("image");
    this.furl = Upload.getUrl("text");
    this.init();
  },
};
</script>

<style scoped>
.headline {
  width: 100%;
  height: 40px;
  line-height: 40px;
  /* margin-top: 40px; */
  border-bottom: solid 1px #c0c4cc;
}

.headline .title {
  font-size: 20px;
}
.tips {
  padding-left: 20px;
  font-size: 12px;
}
.el-row {
  margin-top: 40px;
}
.c1 {
  width: 100%;
  height: 40px;
  line-height: 40px;
}
.el-tag {
  margin-right: 10px;
  margin-top: 10px;
}
::v-deep .el-upload {
  text-align: left !important;
}
.el-card {
  margin-top: 20px;
}

</style>
