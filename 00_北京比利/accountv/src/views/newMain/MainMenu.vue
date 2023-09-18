<template>
  <div>
    <img class="logo" src="@/assets/images/logo.png" alt="" />
    <el-input
      :clearable="true"
      :autofocus="true"
      placeholder="搜索"
      prefix-icon="el-icon-search"
      v-model="searchKey"
    >
    </el-input>
    <el-scrollbar style="height: 100%">
      <el-row class="tac">
        <el-col :span="24">
          <el-menu
            class="el-menu-vertical-demo"
            active-text-color="#fff"
            unique-opened
            :default-openeds="currIndex"
          >
            <!-- :default-openeds="localeMenus" -->
            <el-submenu
              :key="menu.id"
              v-for="menu in localeMenus"
              :index="String(menu.id)"
            >
              <template slot="title">
                <i
                  class="iconfont icon-guanli"
                  style="margin-right: 10px; color: #3377FF; font-size: 14px"
                ></i>
                <span style="font-weight: 700;">{{ menu.name }}</span>
              </template>
              <el-menu-item
                v-for="item in menu.children"
                :key="item.id"
                :index="String(item.id)"
                @click="clickMenu(menu, item)"
                >{{ item.name }}</el-menu-item
              >
            </el-submenu>
          </el-menu>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script>
import MenuApi from "@/api/MenuApi";
import AccessApi from "@/api/AccessApi";
import { mapState, mapMutations } from "vuex";
import bus from "@/bus";
import Env from "@/env/index";
export default {
  data() {
    return {
      activefocus: "0",
      user: JSON.parse(sessionStorage.getItem("user")),
      goingTo: "",
      // 访问记录数据
      accessMenuData: {
        managerId: "",
        managerName: "",
        accessMenuId: "",
        accessUrl: "",
        isPassed: "1",
        token: "",
      },
      menuName: [], // 菜单标题：首页-父菜单-子菜单
      activeName: "",
      searchKey: "",
      resData: [],
      currIndex: [],
    };
  },
  created() {
    this.refresh();
    // console.log(this.menus);
  },
  computed: {
    ...mapState({
      menus: (state) => state.menus,
      chosenHotelId: (s) => s.chosenHotel.hotelId,
      href: (s) => s.href,
      menuMessage: (state) => state.menuMessage,
    }),
    localeMenus() {
      let value = RegExp(this.searchKey, "i");
      let data = this.menus.map((menu) => {
        const lang = menu.langs.find(
          (lang) => lang.langId == this.$root.$i18n.locale
        );
        menu.children.map((element) => {
          const child = element.langs.find(
            (value) => value.langId == this.$root.$i18n.locale
          );
          element.name = child && child.name ? child.name : element.name;
        });
        menu.name = lang && lang.name ? lang.name : menu.name;

        return menu;
      });
      this.resData = data;
      return data
        .map((i) => {
          let father = value.test(i.name);
          let son = i.children.filter((idx) => {
            return value.test(idx.name);
          });
          return this.searchKey == ""
            ? i
            : father
            ? i
            : son.length == 0
            ? { id: -1 }
            : { ...i, children: son };
        })
        .filter((i) => i.id !== -1);
    },
  },
  watch: {
    chosenHotelId(newVal) {
      if (newVal !== 0) {
        this.jumpTo(this.goingTo);
      }
    },
    menuMessage(newVal) {
      this.$store.commit("setMenus", []);
      this.refresh();
    },
    searchKey(newVal) {
      this.currIndex = [];
      if (this.localeMenus.length !== 0) {
        this.currIndex.push(
          String(this.resData.find((i) => i.id == this.localeMenus[0].id).id)
        );
      }
      // console.log(this.currIndex);
    },
  },
  methods: {
    ...mapMutations({
      jumpTo: "jumpTo",
    }),
    async clickMenu(sys, menu) {
      this.menuName = [];
      this.activeName = "";
      try {
        // console.log('当前子菜单的父菜单数据', sys)
        // console.log('当前点击的子菜单数据',menu)
        // 存储当前点击的父菜单下的子菜单，传给头部组件
        this.menuName.push(sys.name);
        this.menuName.push(menu.name);
        bus.$emit("menuTitle", this.menuName);
        this.activeName = "second";
        bus.$emit("sendTab", this.activeName);
        this.accessMenuData.managerId = this.user.id;
        this.accessMenuData.managerName = this.user.managerName;
        this.accessMenuData.accessMenuId = menu.id;
        this.accessMenuData.accessUrl = menu.url;
        this.accessMenuData.token = Env.token;
        // console.log('访问记录数据',this.accessMenuData)
        await AccessApi.accessMenu(this.accessMenuData);
      } catch (error) {
        console.log(error);
      }

      this.isActive = menu.id;
      const url = new URL(menu.url, sys.url);
      url.searchParams.set(Date.now(), "");
      if (url.searchParams.get("hotelId") && this.chosenHotelId === 0) {
        // need to choose hotel
        this.goingTo = url.toString();
        this.jumpTo("hotelList");
        return;
      }

      if (this.goingTo == url.toString()) {
        this.jumpTo(this.goingTo);
        return;
      }

      this.goingTo = url.toString();
      this.jumpTo(this.goingTo);
    },
    async refresh() {
      try {
        await MenuApi.listById(this.user.id).then((data) => {
          this.$store.commit("setMenus", data.list);
          // 需要记录一下管理员列表页面的url，以保证角色管理跳转的url和菜单中的url一致
          const sys = data.list.find((sys) => sys.system === "0");
          // console.log("sys", sys);
          if (sys) {
            const menu = sys.children.find(
              (menu) => menu.url.indexOf("newManager.html") !== -1
            );
            // console.log("menu", menu);
            this.$store.commit(
              "setManagerUrl",
              new URL(menu.url, sys.url).toString()
            );
          }
        });
      } catch (error) {
        console.log(error);
        this.$error("获取菜单数据失败");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.logo {
  width: 119px;
  height: 62px;
  display: inline;
  // cursor: pointer;
  border: none;
  margin-left: 15%;
  margin-top: 10px;
  margin-bottom: 10px;
  // margin: 15px, 15%, 5px, 0;
}
/deep/.el-scrollbar__wrap {
  overflow-x: hidden;
}
/deep/.el-col-12 {
  width: 100%;
}
/deep/.el-submenu__title,
.el-submenu__title,
.el-menu-item {
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  // font-weight: 700;
  // margin: 0, auto;
  padding: 0 16%;
}
/deep/.el-menu-item.is-active {
  background: #3377ff;
}
/deep/ .el-input {
  width: 92%;
  margin-left: 3%;
  margin-bottom: 3%;
  // font-weight: 700;
  color: #3d4966;
}
/deep/ .el-icon-search:before {
  content: "\e778";
  font-weight: 700;
  font-size: 14px;
  color: #3d4966;
}
</style>
