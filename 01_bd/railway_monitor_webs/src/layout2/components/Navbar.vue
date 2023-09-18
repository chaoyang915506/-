<template>
  <div class="navbar">
    <Logo class="logo_css"></Logo>
    <!-- <hamburger id="hamburger-container" :is-active="getters.sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
      v-if="!$store.state.settings.topNav"
    />
    <top-nav
      id="topmenu-container"
      class="topmenu-container"
      v-if="$store.state.settings.topNav"
    />

    <div class="right-menu">
      <!-- <template v-if="getters.device !== 'mobile'">
        <header-search id="header-search" class="right-menu-item" />
        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template> -->
      <router-link v-if="store.getters.roles[0] === 'admin'" to="/index">
        <div
          @mouseenter="mouseEnter()"
          @mouseleave="mouseLeave()"
          class="system-back-title"
        >
          <span>{{ text }}</span>
        </div>
      </router-link>
      <div class="avatar-container">
        <el-dropdown class="right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <!-- <img :src="getters.avatar" class="user-avatar" /> -->
            <div class="user-avatar"></div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <!-- <el-dropdown-item @click="setLayout">
                <span>布局设置</span>
              </el-dropdown-item> -->
              <el-dropdown-item divided @click="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from "element-plus";
import Breadcrumb from "@/components/Breadcrumb";
// import TopNav from "@/components/TopNav";
import TopNav from "@/components/TopNav/index2.vue";
import Logo from "./Sidebar/Logo.vue";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import HeaderSearch from "@/components/HeaderSearch";
const store = useStore();
const getters = computed(() => store.getters);
let text = ref("仿真推演");
function toggleSideBar() {
  store.dispatch("app/toggleSideBar");
}

function logout() {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      store.dispatch("LogOut").then(() => {
        location.href = "/index";
      });
    })
    .catch(() => {});
}

function mouseEnter() {
  text.value = "数字孪生";
}

function mouseLeave() {
  text.value = "仿真推演";
}

const emits = defineEmits(["setLayout"]);
function setLayout() {
  emits("setLayout");
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 80px;
  overflow: hidden;
  justify-content: space-between;
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  background: #3c3d3f;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    // position: absolute;
    border-bottom: none;
    height: 100%;
    background: none;
    // left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    // float: right;
    height: 80px;
    // line-height: 80px;
    display: flex;
    align-items: center;

    &:focus {
      outline: none;
    }
    .system-back-title {
      background-image: url("./../../assets/images/home/system-back-title.png");
      background-size: 100% 100%;
      margin-right: 35px;
      width: 80px;
      height: 40px;
      line-height: 40px;
      position: relative;
      cursor: pointer;
      // text-align: center;
      span {
        color: #00edff;
        font-family: "黑体 Bold", "黑体 Regular", "黑体", sans-serif;
        font-weight: 700;
        font-size: 25px;
        transition: all 0.3s ease-in 0s;
        white-space: nowrap;
        position: absolute;
        left: -9px;
      }
      span:hover {
        transform: scale(1.3);
        transition: all 0.3s ease-in;
      }
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 10px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background-image: url("./../../assets/images/home/avatar.svg");
          background-size: 100% 100%;
        }
        .user-avatar:hover {
          background-image: url("./../../assets/images/home/avatar_mouseOver.svg");
          background-size: 100% 100%;
        }

        i {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.logo_css {
  margin-left: 10px;
}
</style>
