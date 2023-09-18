<template>
  <div class="container-fluid bg-light h-100">
    <div class="row" style="padding-top: 15%">
      <div class="offset-4 col-4" style="min-width: 600px">
        <div class="row align-items-center">
          <div class="col">
            <img src="@/assets/images/logo_new.png" width="171" height="110" />
          </div>
          <div class="col">
            <div class="form-group">
              <select
                class="custom-select"
                v-model="locale"
                @change="modLocale"
              >
                <option value="0">简体中文</option>
                <option value="1">English</option>
              </select>
            </div>
            <username-password-form
              v-if="loginTab === 0"
              @logged-in="loggedIn"
              @next="next"
              @error="error"
            />
            <phone-verification-form
              v-if="loginTab === 1"
              :phoneNumber="phoneNumber"
              @logged-in="loggedIn"
              @error="error"
            />
            <strong
              v-show="errMsg !== ''"
              class="form-text position-absolute text-danger"
            >
              {{ errMsg }}
            </strong>
          </div>
        </div>
      </div>
    </div>
    <footer class="company">
      <p>北京比利信息技术有限公司</p>
      <p>Beijing Bili Information & Technology Co., Ltd</p>
    </footer>
  </div>
</template>

<script>
import UsernamePasswordForm from "./login/UsernamePasswordForm.vue";
import PhoneVerificationForm from "./login/PhoneVerificationForm.vue";
export default {
  name: "Login",
  components: { UsernamePasswordForm, PhoneVerificationForm },
  data() {
    return {
      locale: this.$i18n.locale,
      loginTab: 0,
      phoneNumber: "",
      errMsg: "",
      version: "",
    };
  },
  methods: {
    modLocale() {
      this.$root.$i18n.locale = this.locale;
    },
    async loggedIn(data) {
      // 清除密码
      this.$store.commit('setPassword', '')

      sessionStorage.setItem("hotelId", data.manager.hotelId);
      sessionStorage.setItem("user", JSON.stringify(data.manager));
      sessionStorage.setItem("userId", data.manager.id);

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("tokenExpire", data.expire * 1000);
    
      this.$router.replace("/main");

      this.$store.commit("jumpTo", "mainWelcome");
    },
    async next(user) {
      this.loginTab = 1;
      this.phoneNumber = user.phoneNumber
    },
    error(errMsg) {
      this.errMsg = errMsg;
    },
  },
};
</script>

<style scoped lang="scss">
.company {
  position: fixed;
  bottom: 40px;
  right: 60px;
  text-align: center;
  font-weight: bold;
}
</style>
