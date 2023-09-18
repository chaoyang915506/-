<template>
  <container>
    <div class="areas">
      <el-page-header @back="goback" :content="$t('coolioo.video.bt2')"></el-page-header>

      <!-- <multiple-lang :lists="langlists" />

      <el-row v-for="(item, idx) in langlists" :key="idx" v-show="item.status">
        <el-col :span="2">*{{ item.langDesc }}</el-col>
        <el-col :span="4">
          <el-input v-model="item.name"></el-input>
        </el-col>
      </el-row> -->
      <el-card>
        <el-form ref="form">
          <el-form-item :label="$t('coolioo.video.mc1')">
            <el-input v-model="namecn"></el-input>
          </el-form-item>
          <el-form-item :label="$t('coolioo.video.mc2')">
            <el-input v-model="nameen"></el-input>
          </el-form-item>
          <el-form-item :label="$t('coolioo.video.link')">
            <el-input v-model="videolink"></el-input>
          </el-form-item>
          <el-form-item :label="$t('coolioo.video.spbq')">
            <el-select filterable @change="initGroups2(copyright)" v-model="copyright" placeholder="请选择">
              <el-option value="">请选择</el-option>
              <el-option
                v-for="item in copyrightlists"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('coolioo.video.fz')">
            <el-select filterable v-model="group" placeholder="请选择">
              <el-option value="">请选择</el-option>
              <el-option
                v-for="item in grouplists"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card>
        <el-row>
          <el-col :span="2">{{ $t("coolioo.video.bq") }}</el-col>
          <el-col :span="4">
            <el-select @change="handleTag" v-model="tag" filterable placeholder="请选择">
              <el-option
                v-for="item in taglists"
                :key="item.id"
                :label="item.nameCn"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <span class="createtag" @click="dialogFormVisible = true">{{
              $t("coolioo.video.create")
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="22" class="tags">
            <el-tag closable @close="handleClose(item)" v-for="(item, idx) in tags" :key="idx">{{
              item.nameCn
            }}</el-tag>
          </el-col>
        </el-row>
      </el-card>

      <!-- <div class="card-box">
        <cool-scroll :distance="600" :height="300">
          <language-card />
        </cool-scroll>
      </div> -->
      <el-card>
        <el-row class="jgghead">
          <span class="jggtitle">{{ $t("coolioo.video.special") }}</span>
          <el-button @click="addStyle" type="primary">{{ $t("coolioo.video.create2") }}</el-button>
        </el-row>

        <jgg-template
          v-for="item in stylelists"
          :key="item.styleId"
          :info="item"
          :lists="item.child[0]"
          :stylenames="stylenames"
          v-on:hookDeleteStyle="deleteStyle"
        />
      </el-card>
      <el-row>
        <el-col :span="2">{{ $t("coolioo.video.spzt") }}</el-col>
        <el-col :span="4">
          <el-select v-model="videoState">
            <el-option label="下线" :value="0"></el-option>
            <el-option label="上线" :value="1"></el-option>
            <el-option label="待审核" :value="2"></el-option>
            <el-option label="审核通过" :value="3"></el-option>
            <el-option label="审核未通过" :value="4"></el-option>
            <el-option label="已删除" :value="5"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="footer">
        <el-col :span="2">
          <el-button :loading="saveloading" @click="save" type="primary">{{
            $t("coolioo.common.bc")
          }}</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="goback">{{ $t("coolioo.common.qx") }}</el-button>
        </el-col>
      </el-row>
    </div>

    <el-dialog :title="$t('coolioo.video.create')" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item :label="$t('coolioo.video.mc1')" :label-width="formLabelWidth">
          <el-input v-model="newtag.nameCn" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('coolioo.video.mc2')" :label-width="formLabelWidth">
          <el-input v-model="newtag.nameEn" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t("coolioo.common.qx") }}</el-button>
        <el-button type="primary" @click="createTag">{{ $t("coolioo.common.qd") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('coolioo.video.create2')" :visible.sync="styleVisible">
      <el-form>
        <el-form-item label="版式">
          <el-select v-model="newstyle" placeholder="请选择">
            <el-option
              v-for="item in stylenames"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="styleVisible = false">{{ $t("coolioo.common.qx") }}</el-button>
        <el-button type="primary" @click="insertStyle">{{ $t("coolioo.common.qd") }}</el-button>
      </span>
    </el-dialog>
  </container>
</template>

<script>
import LanguageCard from "./LanguageCard.vue";
import MultipleLang from "./MultipleLang.vue";
import JggTemplate from "./JggTemplate.vue";
import Airlines from "@/api/Airlines";
import env from "@/env";
import CoolScroll from "./CoolScroll.vue";
import SpecialVideo from "@/api/SpecialVideo";
import { sleep } from "@/utils/Helper";
import Container from "./Container.vue";
import Coolioo from "@/api/Coolioo";

export default {
  name: "Edit",
  components: { LanguageCard, MultipleLang, JggTemplate, CoolScroll, Container },
  data() {
    return {
      saveloading: false,
      // fullscreenLoading: false,
      formLabelWidth: "120px",
      loading: {},
      langlists: [],
      inputVisible: false,
      inputValue: "",
      copyright: "",
      copyrightlists: "",
      group: "",
      grouplists: [],
      videolink: "",
      taglists: [],
      tag: "",
      tags: [],
      posttags: [],
      dialogFormVisible: false,
      newtag: {
        nameCn: "",
        nameEn: "",
      },
      fullscreenLoading: false,
      stylelists: [],
      stylenames: [],
      styleVisible: false,
      newstyle: "",
      videoState: "",
      id: "",
      namecn: "",
      nameen: "",
    };
  },
  methods: {
    goback() {
      this.$router.push({
        path: "/cmsv/cooliooSpecialVideo/index.html",
        query: {
          token: env.token,
        },
      });
    },
    initData() {
      let data = localStorage.getItem("cooliooVideoData");
      let obj = JSON.parse(data);
      this.id = obj.id;
      this.videoState = obj.status;
      this.namecn = obj.name;
      this.nameen = obj.nameEn;
      this.videolink = obj.url;
      this.copyright = obj.vendorId;
      this.initGroups(this.group);
      this.group = obj.typeId;
      this.tags = obj.tagList || [];
      this.tags.map((item) => {
        this.posttags.push(item.id);
      });

      // 聚合数据 - 同一个styleId的数据，放在同一个language下
      let styles = {};
      obj.cmsMediaStyleDescList.map((item) => {
        let langs = JSON.parse(JSON.stringify(this.langlists));
        langs.map((lang) => {
          // 根据 langId & styleId 查找
          let i =
            obj.cmsMediaStyleDescList.find(
              (m) => m.langId === lang.langId && m.styleId === item.styleId
            ) || 0;
          if (i) {
            lang.status = true;
            lang.name = i.name;
            lang.desc = i.desc;
            lang.icon = i.icon;
            lang.poster = i.poster;
          } else {
            lang.status = false;
            lang.name = "";
            lang.desc = "";
            lang.icon = "";
            lang.poster = "";
          }
          // 共用信息
          lang.mediaId = item.mediaId;
          lang.metaType = item.metaType;
          lang.styleId = item.styleId;
          lang.id = item.id;
        });
        styles[item.styleId] = { styleId: item.styleId, child: [langs] };
      });

      for (let key in styles) {
        this.stylelists.push(styles[key]);
      }
      if (this.copyright === "") {
        this.group = "";
      }
    },
    async initCopyrights() {
      try {
        let data = await Coolioo.getCopyright(env.token);
        this.copyrightlists = data.list;
      } catch {
        this.$notify.error({
          title: "版权数据服务异常",
        });
      }
    },
    async initGroups(cp) {
      try {
        this.grouplists = await Coolioo.getAllGroup3(cp, env.locale);
        // this.grouplists = data;
        // this.group = '';
      } catch {
        this.$notify.error({
          title: "分组数据服务异常",
        });
      }
    },
    async initGroups2(cp) {
      if(cp === "") {
        this.grouplists = [];
         this.group = "";
        return false
      }
      try {
        this.grouplists = await Coolioo.getAllGroup3(cp, env.locale);
        // this.grouplists = data;
        this.group = "";
      } catch {
        this.$notify.error({
          title: "分组数据服务异常",
        });
      }
    },
    async initStylenames() {
      try {
        let data = await Coolioo.getStylelists(env.token);
        this.stylenames = data.list;
      } catch {
        this.$notify.error({
          title: "版式数据服务异常",
        });
      }
    },
    async init() {
      let langdatas = await Airlines.getLanguageList(env.token);
      this.langlists = langdatas.map((item) => {
        item.status = item.langId === 0 ? true : false;
        item.name = "";
        item.desc = "";
        item.icon = "";
        item.poster = "";
        // item.mediaId = this.id;
        return item;
      });
      this.taglists = await SpecialVideo.taglists(env.token);
    },
    handleTag() {
      let target = this.tags.find((item) => item.id === this.tag);
      if (!target) {
        this.posttags.push(this.tag);
        let r = this.taglists.find((item) => item.id === this.tag);
        this.tags.push(r);
      }
    },
    handleClose(val) {
      console.log(val);
      this.tags = this.tags.filter((item) => item.id !== val.id);
      this.posttags = this.posttags.filter((item) => item !== val.id);
    },
    async createTag() {
      this.dialogFormVisible = false;
      try {
        this.openFullScreen();
        await SpecialVideo.addtag(env.token, this.newtag);
        this.taglists = await SpecialVideo.taglists(env.token);
        await sleep(3000);
        this.loading.close();

        this.$notify({
          title: "成功",
          message: "标签创建成功",
          type: "success",
        });
      } catch (e) {
        this.loading.close();
        this.$notify.error({
          title: "失败",
          message: "标签创建失败",
        });
      }
    },
    openFullScreen() {
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
    addStyle() {
      this.styleVisible = true;
    },
    insertStyle() {
      let f = this.stylelists.find((item) => item.styleId === this.newstyle);
      if (f) {
        this.$notify({
          type: "warning",
          title: "系统提示",
          message: "您选择的版权已存在",
        });
        return false;
      }

      this.styleVisible = false;

      let newnode = {
        styleId: this.newstyle,
        child: [JSON.parse(JSON.stringify(this.langlists))],
      };
      this.stylelists.push(newnode);
    },
    deleteStyle(val) {
      this.$confirm("确定删除吗？")
        .then(() => {
          this.stylelists = this.stylelists.filter((item) => item.styleId !== val);
        })
        .catch((_) => {});
    },
    async save() {
      this.saveloading = true;
      let self = this;
      let cmslists = [];
      this.stylelists.map((item1) => {
        item1.child.map((item2) => {
          item2.map((item3) => {
            // console.log(item3);
            if (item3.status === true) {
              let node = {
                // id: item3.id || null,
                mediaId: item3.mediaId || self.id,
                styleId: item3.styleId || item1.styleId,
                langId: item3.langId,
                name: item3.name,
                metaType: item3.metaType || "",
                desc: item3.desc,
                icon: item3.icon,
                poster: item3.poster,
              };
              cmslists.push(node);
            }
          });
        });
      });
      // console.log(this.copyrightlists);
      // console.log(this.grouplists);
      let vendor = this.copyrightlists.find((item) => item.id === this.copyright) || {};
      // console.log(vendor);
      let group = this.grouplists.find((item) => item.id === this.group);
      if (!this.copyright) {
        this.$notify.error({
          title: "错误提示",
          message: `请选择版权`,
        });
        this.saveloading = false;
        return false;
      }
      if (!group) {
        this.$notify.error({
          title: "错误提示",
          message: `请选择分组`,
        });
        this.saveloading = false;
        return false;
      }

      let post = {
        id: this.id,
        status: this.videoState,
        name: this.namecn,
        nameEn: this.nameen,
        url: this.videolink,
        vendorId: this.copyright,
        vendorName: vendor.name,
        typeId: this.group,
        // typeName: group.cmsMediaTypeLangList[0].name,
        typeName: (group && group.name) || "",
        tagIds: this.posttags,
        cmsMediaStyleDescList: cmslists,
      };
      // console.log(post);
      try {
        await Coolioo.updateSpecialVideo(env.token, post);
        this.saveloading = false;
        this.$notify({
          type: "success",
          title: "系统提示",
          message: "数据更新成功",
        });
      } catch (e) {
        this.saveloading = false;
        this.$notify.error({
          title: "错误提示",
          message: `${e}`,
        });
      }
    },
  },
  mounted() {
    let self = this;
    let promise = new Promise(async (resolve) => {
      await self.init();
      await self.initCopyrights();
      // await self.initGroups();
      await self.initStylenames();
      resolve();
    });
    promise.then(() => {
      self.initData();
    });
  },
};
</script>

<style scoped lang="scss">
$fullwidth: 90%;
$middle: 0 auto;
$bg: #f7f9fc;

.container {
  width: $fullwidth;
  margin: $middle;
  // background: $bg;
}

.h20 {
  width: $fullwidth;
  margin-top: 20px;
}

.areas {
  width: 100%;
  padding: 50px 0 100px 40px;
  // background: #f7f9fc;
}

.el-col {
  height: 36px;
  line-height: 36px;
}
.el-row {
  margin-top: 20px;
}
.el-select {
  width: 100%;
}

.card-box {
  width: 1200px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.createtag {
  color: #4fa1f3;
  padding-left: 20px;
  cursor: pointer;
}

.tags {
  height: auto;
}
.jggtitle {
  font-size: 16px;
  font-weight: bold;
  padding-right: 10px;
}
.jgghead {
  margin-top: 60px;
}
.footer {
  margin: 100px 0 100px 0;
}
.el-card {
  margin-top: 20px;
}
</style>
