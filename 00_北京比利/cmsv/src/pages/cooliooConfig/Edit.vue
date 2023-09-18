<template>
  <container>
    <template v-slot:area>
      <el-page-header @back="goBack" :content="name + $t('coolioo.config.bj')"></el-page-header>
      <el-card>
        <el-row>
          <el-col :span="2">
            <div class="l">{{ $t("coolioo.config.pz") }}</div>
          </el-col>
          <el-col :span="4">
            <el-button @click="videoVisible = true" type="primary">{{
              $t("coolioo.config.tj")
            }}</el-button>
          </el-col>
        </el-row>

        <el-row v-if="info" :gutter="10">
          <el-col :span="2">
            {{ $t("coolioo.config.mr") }} <br />
            <span class="sp">*推荐人图片未上传，TV端页面会大片留白</span>
          </el-col>
          <el-col v-for="item in info.defaultCooliooRecommedLangs" :key="item.id" :span="6">
            <card :fs="item" />
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="2">
            {{ $t("coolioo.config.zd") }} <br />
            <span class="sp">*选择后版权将在Coolioo首页置顶，首位默认电影栏目</span>
          </el-col>
          <el-col v-if="info" :span="18">
            <el-checkbox-group v-model="tops">
              <el-checkbox :key="item" v-for="item in vals" :label="item">{{
                showCopyright(item)
              }}</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>

        <!-- <el-row>
        <el-col :span="2"> 使用默认推荐配置 </el-col>
        <el-col :span="4">
          <el-switch active-text="是" inactive-text="否" v-model="usedefault"></el-switch>
        </el-col>
      </el-row> -->

        <el-row v-for="item in info.cooliooRecommendVos" :key="item.id" :gutter="10">
          <el-col class="h" :span="24">
            <span class="recommend">{{ showCopyright(item.mediaVendorId) }}</span>
            <el-checkbox :true-label="0" :false-label="1" v-model="item.isDef">{{
              $t("coolioo.config.use")
            }}</el-checkbox>
            <!-- <span class="sp">*推荐人图片未上传，TV端页面会大片留白</span> -->
            &nbsp;&nbsp;
            <i @click="del(item)" class="el-icon-delete"></i>
          </el-col>
          <el-col
            v-show="item.isDef == '1'"
            v-for="item2 in item.cooliooRecommedLangList"
            :key="item2.id"
            :span="6"
          >
            <card :fs="item2" />
          </el-col>
        </el-row>
      </el-card>

      <el-row class="foot" :gutter="100">
        <el-col :span="2">
          <el-button @click="save" type="primary">{{ $t("coolioo.common.bc") }}</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="goBack">{{ $t("coolioo.common.qx") }}</el-button>
        </el-col>
      </el-row>
      <el-dialog :title="$t('coolioo.config.tj')" :visible.sync="videoVisible">
        <el-transfer
          :titles="[$t('coolioo.config.l1'), $t('coolioo.config.l2')]"
          :props="{
            key: 'id',
            label: 'name',
          }"
          v-model="valss"
          :data="copyrights"
        ></el-transfer>
        <span slot="footer" class="dialog-footer">
          <el-button @click="videoVisible = false">{{ $t("coolioo.common.qx") }}</el-button>
          <el-button type="primary" @click="ok">{{ $t("coolioo.common.qd") }}</el-button>
        </span>
      </el-dialog>
    </template>
  </container>
</template>

<script>
import Container from "@/components/coolioo/Container.vue";
import Card from "./Card.vue";
import Coolioo from "@/api/Coolioo";
import env from "@/env";

export default {
  name: "Edit",
  components: {
    Container,
    Card,
  },
  data() {
    return {
      name: "",
      videoVisible: false,
      checklists: [],
      usedefault: true,
      id: "",
      info: false,
      copyrights: [],
      vals: [],
      valss: [],
      datas: [],
      // fullscreenLoading: false,
      loading: {},
      tops: [],
    };
  },
  methods: {
    del(val) {
      this.$confirm("确定删除？").then(() => {
        this.info.cooliooRecommendVos = this.info.cooliooRecommendVos.filter(
          (item) => item.mediaVendorId !== val.mediaVendorId
        );
        this.vals = this.vals.filter((item) => item !== val.mediaVendorId);
      });
    },
    openscreenloading() {
      // this.fullscreenLoading = true;
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
    ok() {
      this.videoVisible = false;
      // this.vals = [...this.vals, ...this.valss];
      this.valss.map((item) => {
        if (!this.vals.includes(item)) {
          this.vals.push(item);
        }
      });
      this.vals.map((item) => {
        let data = this.info.cooliooRecommendVos.find((item2) => item2.mediaVendorId === item) || 0;
        if (data === 0) {
          let obj = {
            mediaVendorId: item,
            isDef: 1,
            cooliooRecommedLangList: [
              { horPic: "", verPic: "", langId: 0 },
              { horPic: "", verPic: "", langId: 1 },
            ],
          };
          this.info.cooliooRecommendVos.push(obj);
        }
      });
      // 清理节点
      // this.info.cooliooRecommendVos = this.info.cooliooRecommendVos.filter((item) =>
      //   val.includes(item.mediaVendorId)
      // );
    },
    goBack() {
      this.$router.push({
        path: "/cmsv/cooliooConfig/index.html",
        query: {
          token: env.token,
        },
      });
    },
    async initData() {
      this.info = await Coolioo.getConfigInfo(env.token, this.id);

      if (this.info.cooliooRecommendVos) {
        this.vals = this.info.cooliooRecommendVos.map((item) => {
          return item.mediaVendorId;
        });
      } else {
        this.info.cooliooRecommendVos = [];
      }

      if (this.info.defaultCooliooRecommedLangs.length === 0) {
        this.info.defaultCooliooRecommedLangs = [
          {
            horPic: "",
            verPic: "",
            langId: 0,
          },
          {
            horPic: "",
            verPic: "",
            langId: 1,
          },
        ];
      }
      this.tops = this.info.topMediaVendors || [];
    },
    async initCopyrights() {
      let data = await Coolioo.getCopyright(env.token);
      this.copyrights = data.list;
    },
    showCopyright(id) {
      let o = this.copyrights.find((item) => item.id === id) || { name: `${id}` };
      return o.name;
    },
    async save() {
      // console.log(this.info);
      if (this.info.topMediaVendors === null) {
        this.$notify.error({
          title: "错误提示",
          message: "未选择置顶版权",
        });
        return false;
      }
      this.openscreenloading();
      try {
        this.info.topMediaVendors = this.tops;
        await Coolioo.updateConfigInfo(env.token, this.info);
        this.loading.close();
        this.$notify({
          type: "success",
          title: "系统提示",
          message: "数据更新成功",
        });
      } catch {
        this.loading.close();
        this.$notify.error({
          title: "错误提示",
          message: "数据更新失败",
        });
      }
    },
  },
  watch: {
    // vals(val) {
    //   // if (val.length === 0) return false;
    //   // 增加节点
    //   val.map((item) => {
    //     let data = this.info.cooliooRecommendVos.find((item2) => item2.mediaVendorId === item) || 0;
    //     if (data === 0) {
    //       let obj = {
    //         mediaVendorId: item,
    //         isDef: 1,
    //         cooliooRecommedLangList: [
    //           { horPic: "", verPic: "", langId: 0 },
    //           { horPic: "", verPic: "", langId: 1 },
    //         ],
    //       };
    //       this.info.cooliooRecommendVos.push(obj);
    //     }
    //   });
    //   // 清理节点
    //   this.info.cooliooRecommendVos = this.info.cooliooRecommendVos.filter((item) =>
    //     val.includes(item.mediaVendorId)
    //   );
    // },
  },
  mounted() {
    this.id = this.$route.query.id;
    this.name = this.$route.query.name;
    this.initCopyrights();
    this.initData();
  },
};
</script>
<style scoped>
.el-row {
  margin-top: 40px;
}
.l {
  height: 40px;
  line-height: 40px;
}
.sp {
  font-size: 12px;
  color: #c0c4cc;
}
.h {
  padding-bottom: 20px;
  border-bottom: solid 1px #e4e7ed;
  margin-bottom: 20px;
}
.recommend {
  font-weight: bold;
  padding-right: 10px;
  font-size: 20px;
}
.foot {
  margin-top: 100px;
}
::v-deep .el-upload {
  text-align: left !important;
}
.el-card {
  margin-top: 20px;
}
</style>
