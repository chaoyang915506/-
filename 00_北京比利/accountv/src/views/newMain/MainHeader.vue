<template>
  <div>
    <div class="header">
      <div class="left">
        <!-- <img class="logo" src="@/assets/images/logo2.png" alt="" /> -->
        <div class="tabs">
          <el-tabs
            v-model="activeName"
            @tab-click="handleClick()"
            style="display: inline-block; width: 100%; height: 100%"
          >
            <el-tab-pane class="tab" name="first">
              <span slot="label"
                ><i
                  class="iconfont icon-home"
                  style="font-size: 18px; margin-right: 5px"
                ></i>
                {{ $t("mainHeader.homePage") }}</span
              >
              <span class="title">{{ $t("mainHeader.homePage") }}</span>
            </el-tab-pane>
            <el-tab-pane class="tab" name="second">
              <span slot="label" @click="toHotel"
                ><i
                  class="iconfont icon-guanli"
                  style="font-size: 18px; margin-right: 5px"
                ></i>
                {{hotelName}}</span
              >
              <span class="title"
                >{{ $t("mainHeader.homePage") }} {{ title }}</span
              >
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="right">
        <span style="margin-right: 15px;">
          <i class="iconfont icon-yonghushezhi" @click="toUser"></i>
          {{ user.managerName }}，{{ $t("mainHeader.welcomeUser") }}</span
        >
        <!-- 切换版本按钮 -->
        <el-button style="margin-right: 10px" @click="changeVersion">{{
          $t("mainHeader.changeOld")
        }}</el-button>
        <el-select v-model="locale" @change="changeLocale($event)">
          <!-- <i class="el-icon-d-caret"></i> -->
          <el-option label="简体中文" value="0"></el-option>
          <el-option label="English" value="1"> </el-option>
        </el-select>
        <span class="exitIcon" style="margin-left: 22px" @click="exit">
          <i class="iconfont icon-tuichu1" style="font-size: 20px;"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import "@/icons/iconfont.css";
import MainBody from "./MainBody.vue";
import bus from "@/bus";
import { mapMutations, mapState } from "vuex";
import { authWorker, idleWorker } from "@/Worker";
import AccountApi from "@/api/AccountApi";
export default {
  name: "MainHeader",
  components: {
    MainBody,
  },
  data() {
    return {
      activeName: "first",
      // locale: '0',
      user: {},
      title: "",
    };
  },
  computed: {
    ...mapState({
      chosenHotel: (state) => state.chosenHotel,
    }),
    isHotelOpManager() {
      return this.user.hotelId > 0;
    },
    hotelName() {
      if (this.chosenHotel.hotelId === 0) {
        return this.$t("mainHeader.chooseHotel");
      }

      if (this.locale === "1") {
        return this.chosenHotel.hotelEnName;
      } else {
        return this.chosenHotel.hotelName;
      }
    },
    locale() {
      return this.$i18n.locale;
    },
  },
  methods: {
    toHotel() {
      this.jumpTo("hotelList");
      this.title = ` - ${this.$t("mainHeader.chooseHotel")}`;
    },
    toUser() {
      this.jumpTo("myAccount");
      this.activeName = "second";
      bus.$emit("sendTab", this.activeName);
      this.title = ` - ${this.$t("mainHeader.myAccount")}`;
    },
    // 切换到旧版
    changeVersion() {
      this.$router.replace(`/main`);
      this.$store.commit("jumpTo", 'HotelList');
    },
    // 点击tabs
    handleClick(tab, event) {
      bus.$emit("sendTab", this.activeName);
    },
    // 切换语言
    changeLocale(e) {
      // console.log(e);
      sessionStorage.setItem("locale", e);
      this.$root.$i18n.locale = e;
    },
    ...mapMutations(["jumpTo"]),
    async exit() {
      authWorker.stop();
      idleWorker.stop();
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("tokenExpire");
      this.$router.replace("/accountv");
      AccountApi.logout();
    },
  },
  created() {
    this.user = JSON.parse(sessionStorage.getItem("user"));
    this.$store.commit("choose", { hotelId: this.user.hotelId });
    // console.log("用户", this.user);
    // 接收菜单名
    bus.$on("menuTitle", (data) => {
      // console.log(data);
      this.title = `- ${data[0]} - ${data[1]}`;
      // console.log(this.title);
    });
    bus.$on("sendTab", (data) => {
      this.activeName = data;
    });
  },
};
</script>

<style lang="scss" scoped>
body {
  width: 100%;
  height: 100%;
}
.header {
  position: relative;
  vertical-align: middle;
  height: 100%;
}
.header .left {
  position: absolute;
  left: 0px;
  top: 24%;
  width: 100%;
  height: 100%;
}
.icon-tuichu1:hover {
  cursor: pointer;
}
.header .left .tabs {
  display: inline;
}
.title {
  font-size: 14px;
  color: #3d4966;
  position: fixed;
  top: 9.5%;
  left: 16.3%;
}
// .tabs .tab {
// margin-top: 0.5%;
// }
.header .right {
  position: absolute;
  right: 50px;
  top: 25%;
}
// 用户设置图标
.icon-yonghushezhi:before {
  content: "\e667";
  vertical-align: middle;
  font-size: 30px;
  cursor: pointer;
}
// 退出按钮
.exitIcon:hover {
  color: #f05656;
}
/deep/.el-tabs__nav-wrap::after {
  content: "";
  background-color: #fff;
  z-index: 1;
}
/deep/.el-input--suffix .el-input__inner {
  width: 93px;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #d3dbeb;
  padding-left: 10px;
  padding-right: 5px;
}
/deep/ .el-button {
  font-size: 14px;
}
/deep/ .el-button:hover {
  // color: #fff;
  background-color: #fff;
}
/deep/ .el-tabs__item {
  font-size: 18.61px;
  margin-bottom: 10px;
}
</style>
