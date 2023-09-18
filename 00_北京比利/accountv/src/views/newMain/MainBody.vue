<template>
  <div>
    <!-- 首页 -->
    <!-- <div> -->
      <el-card class="box-card" v-if="activeName == 'first'">
        <img
          src="@/assets/images/welcome_new.jpg"
          style="width: 100%; height: 100%; text-algin: center;"
        />
      </el-card>
    <!-- </div> -->
    <!-- 酒店管理 -->
    <!-- <div v-else> -->
    <!-- <el-scrollbar style="height: 100%"> -->
      <el-card class="box-card" v-else>
        <transition name="fade" mode="out-in">
          <component
            v-if="!href.startsWith('http')"
            :is="href"
            class="embed-responsive-item"
          ></component>
          <iframe
            v-else
            :src="href"
            class="embed-responsive-item"
            style="width: 100%; height: 100%; border: none"
          />
        </transition>
      </el-card>
    <!-- </el-scrollbar> -->
    <!-- </div> -->
  </div>
</template>

<script>
import bus from "@/bus";
import AccountApi from "@/api/AccountApi";
import MainWelcome from "@/views/MainWelcome.vue";
import HotelList from "@/views/HotelList.vue";
import MyAccount from "@/views/MyAccount.vue";

export default {
  name: "newMainBody",
  components: { MainWelcome, HotelList, MyAccount },
  data() {
    return {
      activeName: "first",
    };
  },
  computed: {
    chosenHotelId() {
      return this.$store.state.chosenHotel.hotelId;
    },
    href() {
      let href = this.$store.state.href;
      if (!href.startsWith("http")) {
        // console.log('路径',this.$store.state.href);
        return this.$store.state.href;
      } else {
        href = new URL(href);
        const params = href.searchParams;
        if (params.get("hotelId")) {
          params.set("hotelId", this.chosenHotelId);
        }
        params.set("locale", this.$root.$i18n.locale);
        params.set("token", sessionStorage.getItem("token"));
          // console.log('路径11',href);
        return href.toString();
      }
    },
  },
  created() {
    bus.$on("sendTab", (data) => {
      this.activeName = data;
    });
    AccountApi.hotels()
      .then((data) => this.$store.commit("setHotels", data.list))
      .catch((err) => this.$store.commit("setHotels", []));
  },
};
</script>

<style lang="scss" scoped>
div {
  width: 100%;
  height: 100%;
}
/deep/.el-card__body {
  width: 100%;
  height: 100%;
  padding: 0px;
}
/deep/.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
