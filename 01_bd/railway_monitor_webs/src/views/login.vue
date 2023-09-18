<template>
  <div class="login">
    <div class="login-back-one login-back-left-one">
      <div class="login-back-two login-back-left-two"></div>
    </div>
    <div class="content-login">
      <div class="left-title-login wrap-title-login">数字孪生</div>
      <div class="logo-login"></div>
      <el-form
        ref="loginRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <h3 class="title">铁路自然灾害及异物侵限孪生仿真监测系统</h3>
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            type="text"
            auto-complete="off"
            placeholder="请输入您的账号"
          >
            <!-- <template #prefix
              ><svg-icon icon-class="user" class="el-input__icon input-icon"
            /></template> -->
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            autocomplete="new-password"
            placeholder="请输入登录密码"
            @keyup.enter="handleLogin"
          >
            <!-- <template #prefix
              ><svg-icon
                icon-class="password"
                class="el-input__icon input-icon"
            /></template> -->
          </el-input>
        </el-form-item>
        <el-form-item prop="code" v-if="captchaOnOff">
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            @keyup.enter="handleLogin"
          >
            <template #prefix
              ><svg-icon
                icon-class="validCode"
                class="el-input__icon input-icon"
            /></template>
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img" />
          </div>
        </el-form-item>
        <el-form-item style="width: 100%">
          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%"
            @click.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
          <div style="float: right" v-if="register">
            <router-link class="link-type" :to="'/register'"
              >立即注册</router-link
            >
          </div>
        </el-form-item>
        <div class="password-login-class">
          <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
          <span class="forget-class">忘记密码？</span>
        </div>
        <!-- 版本号 -->
        <span
          style="
            display: inline-block;
            width: 100%;
            text-align: right;
            margin-top: 5px;
            color: #409eff;
          "
          >{{ version }}</span
        >
      </el-form>
    </div>
    <div class="login-back-right-one login-back-one">
      <div class="login-back-right-two login-back-two"></div>
    </div>
    <div class="right-title-login wrap-title-login">仿真推演</div>
    <!--  底部  -->
    <!-- <div class="el-login-footer">
      <span>Copyright © 2018-2021 currency.vip All Rights Reserved.</span>
    </div> -->
  </div>
</template>

<script setup>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";

const store = useStore();
const router = useRouter();
const { proxy } = getCurrentInstance();
const version = ref(import.meta.env.VITE_APP_VERSION);
const loginForm = ref({
  // username: 'admin',
  // password: 'admin123',
  username: "",
  password: "",
  rememberMe: false,
  code: "",
  uuid: "",
});

const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }],
};

const codeUrl = ref("");
const loading = ref(false);
// 验证码开关
const captchaOnOff = ref(true);
// 注册开关
const register = ref(false);
const redirect = ref(undefined);

function matchingRoute(type) {
  let route = "";
  if (type === "1") {
    route = "/simLayout";
  } else if (type === "2") {
    route = "/";
  }
  return route;
}

function handleLogin() {
  proxy.$refs.loginRef.validate((valid) => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在cookie中设置记住用户明和名命
      if (loginForm.value.rememberMe) {
        Cookies.set("username", loginForm.value.username, { expires: 30 });
        Cookies.set("password", encrypt(loginForm.value.password), {
          expires: 30,
        });
        Cookies.set("rememberMe", loginForm.value.rememberMe, { expires: 30 });
      } else {
        // 否则移除
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      // 调用action的登录方法
      store
        .dispatch("Login", loginForm.value)
        .then(() => {
          // router.push({ path: redirect.value || '/' })
          // 管理员根据用户偏好登录不同系统
          // 数字用户登录数字系统
          // 仿真用户登仿真系统
          // 如果defaultSystem = 0 就是没配置用户偏好，
          // debugger
          if (store.state.user.defaultSystem === "0") {
            if (store.state.user.systemTypes.length > 1) {
              router.push({ path: "/" });
            } else {
              let __path = matchingRoute(store.state.user.systemTypes[0]);
              router.push({ path: __path || "/" });
            }
          } else {
            let _path = matchingRoute(store.state.user.defaultSystem);
            router.push({ path: _path || "/" });
          }
        })
        .catch(() => {
          loading.value = false;
          // 重新获取验证码
          if (captchaOnOff.value) {
            getCode();
          }
        });
    }
  });
}

function getCode() {
  getCodeImg().then((res) => {
    captchaOnOff.value =
      res.captchaOnOff === undefined ? true : res.captchaOnOff;
    if (captchaOnOff.value) {
      codeUrl.value = "data:image/gif;base64," + res.img;
      loginForm.value.uuid = res.uuid;
    }
  });
}

function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password:
      password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
  };
}

getCode();
getCookie();
</script>

<style lang="scss" scoped>
.login {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  height: 100%;
  position: relative;
  background-image: url("../assets/images/login/login-background.svg");
  background-size: 100% 100%;
}
.login-back-one {
  position: absolute;
  z-index: 10;
  height: 55%;
  width: 26%;
  background-image: url("../assets/images/login/login-background1.png");
  background-size: 100% 100%;
}
.login-back-two {
  position: absolute;
  z-index: 10;
  height: 100%;
  width: 100%;
  background-image: url("../assets/images/login/login-background2.png");
  background-size: 100% 100%;
}
.login-back-left-one {
  left: 10%;
  top: -4%;
}
.login-back-left-two {
  top: -1%;
  left: -16%;
}
.login-back-right-one {
  right: 0%;
  bottom: 5%;
}
.login-back-right-two {
  bottom: 0%;
  right: 15%;
}
.content-login {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  box-sizing: border-box;
}
.wrap-title-login {
  position: absolute;
  z-index: 11;
  color: #00edff;
  font-family: "黑体 Bold", "黑体 Regular", "黑体", sans-serif;
  font-weight: 700;
  font-size: 45px;
  transition: all 0.3s ease-in 0s;
}
.left-title-login {
  left: 16%;
  top: 24%;
}
.right-title-login {
  right: 11%;
  bottom: 25%;
}
.left-title-login:hover,
.right-title-login:hover {
  transform: scale(1.4);
  transition: all 0.3s ease-in;
}
.logo-login {
  position: absolute;
  z-index: 10;
  height: 8%;
  width: 4%;
  right: 48%;
  top: 15%;
  background-image: url("../assets/images/login/logo-login.svg");
  background-size: 100% 100%;
}
.title {
  margin: 0px auto 100px auto;
  text-align: center;
  color: #fff;
  font-size: 40px;
}
.password-login-class {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.forget-class {
  color: #43f4ff;
  font-size: 14px;
}
.forget-class:hover {
  opacity: 0.8;
}
.login-form {
  position: absolute;
  width: 34%;
  z-index: 10;
  right: 35%;
  top: 26%;
  cursor: pointer;
  border-radius: 6px;
  // background: #ffffff;
  // width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 58px;
    input {
      height: 58px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
