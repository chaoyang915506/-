<template>
  <header class="navbar navbar-expand navbar-dark bg-dark">
    <a class="navbar-brand" href="#">
      <img src="@/assets/images/logo2.png" loading="lazy" alt />
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <div class="navbar-nav mr-auto">
        <div class="nav-item active">
          <a class="nav-link" href="#" @click.prevent="jumpTo('myAccount')">
            <i class="bi bi-person-fill" style="font-size: 20px"></i>
            <span class="ml-1 align-bottom">
              {{ user.managerName }}
            </span>
            <!-- <span class="ml-1 align-bottom">
                            {{ $t("mainHeader.myAccount") }}
                        </span> -->
          </a>
        </div>
        <div class="nav-item active">
          <a class="nav-link" href="#" @click.prevent="jumpTo('mainWelcome')">
            <i class="bi bi-house-fill" style="font-size: 20px"></i>
            <span class="ml-1 align-bottom">
              {{ $t("mainHeader.homePage") }}
            </span>
          </a>
        </div>
        <div v-if="!isHotelOpManager" class="nav-item active">
          <a class="nav-link" href="#" @click.prevent="jumpTo('hotelList')">
            <i class="bi bi-grid-fill" style="font-size: 20px"></i>
            <span class="ml-1 align-bottom">{{ hotelName }}</span>
          </a>
        </div>
      </div>
      <!-- 切换版本按钮 -->
      <el-button @click="changeVersion">{{$t("mainHeader.changeNew")}}</el-button>
      <div class="col-auto">
        <select
          class="custom-select"
          :value="locale"
          @change="changeLocale($event)"
        >
          <option value="0">简体中文</option>
          <option value="1">English</option>
        </select>
      </div>
      <div class="btn text-white" @click="exit">
        <i class="bi bi-power" style="font-size: 20px"></i>
        <span class="ml-1 align-bottom">{{ $t("mainHeader.logout") }}</span>
      </div>
    </div>
  </header>
</template>

<script>
import AccountApi from "@/api/AccountApi";
import { authWorker, idleWorker } from "@/Worker";
import { mapMutations, mapState } from "vuex";
export default {
  name: "MainHeader",
  data() {
    return {
      user: {},
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
  mounted() {},
  methods: {
    // 切换到新版
    changeVersion() {
      this.$router.replace(`/newMain`);  
      this.$store.commit("jumpTo", 'HotelList');
    },
    changeLocale(e) {
      // console.log(e, e.target);
      sessionStorage.setItem("locale", e.target.value);
      // localStorage.setItem('locale', e.target.value)
      this.$root.$i18n.locale = e.target.value;
    },
    ...mapMutations(["jumpTo"]),
    exit() {
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
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-button:hover {
  // color: #fff;
  background-color: #fff;
}
</style>