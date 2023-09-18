<template>
  <div>
    <main-header class="mainHeder" />
    <main-menu class="mainMenu" />
    <main-body class="mianBody" />
    <!-- <footer>Copyright @ 2015 - {{ new Date().getFullYear() }} MYCOOLTV管理系统</footer> -->
  </div>
</template>

<script>
import MainHeader from "./MainHeader.vue";
import MainMenu from "./MainMenu.vue";
import MainBody from './MainBody.vue'
export default {
  components: {
    MainHeader,
    MainMenu,
    MainBody
  },
};
</script>

<style lang="scss" scoped>
body, html {
  width: 100%;
  height: 100%;
}
.mainHeder {
  position: fixed;
  top: 0;
  left: 15%;
  width: 85%;
  height: 8.7%;
  background: #fff;
}
.mainMenu {
  width: 15%;
  height: 91%;
  position: fixed;
  top: 0;
  background: #fff;
}
.mianBody {
  position: fixed;
  top: 12.7%;
  left: 16%;
  width: 84%;
  height: 87.5%;
}
footer {
  position: fixed;
  bottom: 0;
  left: 15%;
  height: 3.5%;
  width: 85%;
  // line-height: 3.5%;
  padding-top: 0.5%;
  text-align: center;
}
</style>
