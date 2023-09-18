<template>
  <div class="padding">
    <h3 style="margin-bottom: 10px; margin-top: 0;">
      {{ $t("menu.title") }}
    </h3>
    <el-tabs type="card" ref="tab" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="sys in menus" :key="sys.menu.id" :name="String(sys.menu.id)">
        <span slot="label"
          ><i class="el-icon-rank" style="margin-right: 5px;"></i>{{ sys.menu.name }}</span
        >
      </el-tab-pane>
      <!-- <template> <el-tab-pane :label="$t('menu.addSys')" name="last"></el-tab-pane></template> -->
    </el-tabs>
    <el-button
      type="primary"
      plain
      @click="
        activeName = 'last';
        activeSysIdx = 0;
      "
      >{{ $t("menu.addSys") }}</el-button
    >
    <MenuSysForm
      v-if="activeSys.menu"
      :key="activeSys.menu.id"
      :value="sysForm"
      @change="refresh"
    />
    <div style="margin-bottom: 12px;display: flex; justify-content: space-between;">
      <div>
        <el-button class="add" @click="addSys">{{ $t("common.Added") }}</el-button>
        <el-button class="del" @click="delAll">{{ $t("common.delete") }}</el-button>
      </div>
      <el-input
        :clearable="true"
        :autofocus="true"
        :placeholder="$t('common.search')"
        prefix-icon="el-icon-search"
        v-model="searchKey"
      >
      </el-input>
    </div>
    <CoolEleTable
      :tableList="sysMenu"
      :columns="columns"
      :currentPage="currentPage"
      @SelectionChange="value => (selected = value)"
    >
      <el-table-column slot="sort" align="center" width="130" :label="$t('menu.sort')" prop="sort">
        <i class="el-icon-rank"></i>
      </el-table-column>
      <el-table-column slot="btn" align="center" :label="$t('common.operate')" prop="id">
        <template #default="{row}">
          <el-button type="text" @click="edit(row.id)">
            {{ $t("common.modification") }}
          </el-button>
          <el-button type="text" @click="delMenu(row.id)">
            {{ $t("common.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </CoolEleTable>

    <MenuForm
      :showMenuForm.sync="showMenuForm"
      :value="activeMenu"
      :parentId="activeSysIdx"
      @change="refresh"
    />
  </div>
</template>

<script>
import MenuApi from "@/api/MenuApi";
import MenuSysForm from "./MenuSysForm.vue";
import { mapState } from "vuex";
import { Menu, Sys } from "./menu";
import MenuForm from "./MenuForm.vue";
import Sortable from "sortablejs";
// import  VueI18n  from "@/i18n/index";
import CoolEleTable from "@/components/CoolEmTable.vue";
export default {
  components: { MenuSysForm, MenuForm, CoolEleTable },
  name: "MenuApp",
  data() {
    return {
      activeName: "1", // 当前点击的tabs
      menuName: "",
      currentPage: 1, // 当前页
      columns: [

        {
          prop: "name",
          label: this.$t("menu.name"),
          align: "center"
        },
        {
          prop: "lang",
          label: this.$t("menu.lang"),
          align: "center"
        },
        {
          prop: "url",
          label: "URL",
          align: "center"
        }
      ],
      activeSysIdx: 1, // 当前显示的tab标签的id值
      menuList: [], // 所有父菜单数据
      allList: [], // 全部数据
      searchKey: "", // 搜索关键字
      showMenuForm: false, // 控制MenuForm组件显示隐藏
      selected: [], // 被选中的数据
      activeMenu: new Menu() // 当前选中的子菜单数据
    };
  },
  computed: {
    ...mapState({
      menus: state => JSON.parse(JSON.stringify(state.menus))
    }),
    // 表格绑定的数据，切换tab时，对应的子菜单数据
    sysMenu() {
      let reg = RegExp(this.searchKey, "i");
      return this.menus
        .map(i => {
          return i["menu"].id == this.activeSysIdx ? i["children"] : [];
        })
        .flat()
        .map(item => {
          let curr = {};
          curr.name = item.name;
          curr.id = item.id;
          curr.url = item.url;
          curr.seq = item.seq;
          let str = item.langs.find(lang => lang.langId == 1);
          curr.lang = str ? str.name : "";
          return curr;
        })
        .filter(s => {
          if (reg.test(s.name) || reg.test(s.lang) || reg.test(s.url)) {
            return s;
          }
        });
    },
    // 当前展示的所有数据
    activeSys() {
      let obj;
      if (this.activeName == "last") {
        obj = new Sys();
      } else {
        let arr = this.allList.filter(i => (i["menu"].id == this.activeSysIdx ? i : i[0]));
        obj = { ...arr[0] };
      }
      return obj;
      // return {...this.allList.filter(i => i["menu"].id == this.activeSysIdx ? i : i[0])}
      // return Object.assign({},{...this.allList.filter(i => i["menu"].id == this.activeSysIdx ? i : i[0])})
    },
    // 当前展示的父菜单的英文名
    sysName() {
      let res = "";
      this.menuList.filter(i => {
        if (i.id == this.activeSysIdx) {
          res = i.langs.find((lang) => lang.langId == 1)?.name;
        }
      });
      // console.log(res, 11);
      return res;
    },
    sysForm() {
      return { ...this.activeSys.menu, lang: this.sysName };
    }
  },
  mounted() {
    this.getAllList();
    this.sortRow();
    this.sortMenu();
    // console.log("表单数据mounted", this.sysMenu);
  },
  methods: {
    //获取页面的全部数据
    async getAllList() {
      await MenuApi.list()
        .then(data => {
          this.$store.commit("setMenus", data.list);
          this.allList = data.list;
          this.menuList = [];
          data.list.forEach(i => {
            this.menuList.push(i.menu);
          });
          // console.log("父菜单数据", this.menuList);
          // this.activeSys = data.list[0];
          // console.log('当前活动的页面',this.activeSys);
          // console.log("总数据", data.list);
        })
        .catch(err => this.$error(this.$t("menu.confirm.getMenuF")));
    },
    handleClick(tab) {
      // console.log(tab);
      this.activeSysIdx = Number(tab.name);
    },
    addSys() {
      this.showMenuForm = true;
      this.menuName = "";
      this.activeMenu = { ...new Menu(), lang: this.menuName };
      // console.log(this.activeMenu);
    },
    edit(_id) {
      this.showMenuForm = true;
      let currData = this.activeSys.children.find(i => i.id === _id);
      let str = currData.langs.find(lang => lang.langId == 1);
      this.menuName = str ? str.name : "";
      this.activeMenu = { ...currData, lang: this.menuName };
      // console.log("当前数据", this.activeMenu);
    },
    async refresh(sysId) {
      try {
        this.activeSysIdx = sysId;
        this.activeName = String(sysId);
        await this.getAllList();
      } catch (error) {
        // console.log(error);
        this.$error(this.$t("menu.confirm.updateMenuF"));
      }
    },
    // 子菜单拖拽排序
    sortRow() {
      const Rbody = document.querySelector(".el-table tbody");
      // console.log(Rbody);
      // console.log('指向vue', this);
      const _this = this;
      Sortable.create(Rbody, {
        draggable: "tr", // 允许拖拽的项目类名
        handle: "td",
        async onEnd({ newIndex, oldIndex }) {
          // console.log(_this.sysMenu[oldIndex]);
          // console.log(_this.sysMenu[newIndex]);
          let data, ids, first;
        if (oldIndex < newIndex) {
          //自下而上
          data = _this.sysMenu.slice(oldIndex, newIndex + 1);
          ids = data.map((i) => i.id);
          first = ids.splice(0, 1)[0];
          ids.push(first);
        } else {
          //自上而下
          data = _this.sysMenu.slice(newIndex, oldIndex + 1);
          ids = data.map((i) => i.id);
          first = ids.splice(data.length - 1, 1)[0];
          ids.unshift(first);
        }
          let sortArr = data.map((i, j) => {
            return {
              id: ids[j],
              seq: i.seq
            };
          });
          // console.log('拖拽数据',sortArr);
          await MenuApi.sortApi(sortArr);
          await _this.getAllList();
          _this.$message({
            message: _this.$t("menu.confirm.sortS"),
            type: "success",
            duration: 2000
          });
          _this.sortRow();
          parent.postMessage(
            {
              type: "menu",
              menuMsg: Math.random()
            },
            parent.origin
          );
        }
      });
    },
    sortMenu() {
      // 要找拖拽的父元素！！！
      const Rbody = document.querySelector(".el-tabs__nav-scroll .el-tabs__nav");
      // console.log(Rbody);
      const _this = this;
      Sortable.create(Rbody, {
        // ghostClass: "blue-background-class", // drop placeholder的css类名
        handle: ".el-tabs__item",
        async onEnd({ newIndex, oldIndex }) {
          // console.log(newIndex, oldIndex);
          let data, ids, first;
          if (oldIndex < newIndex) {
            //自上而下
            // console.log(
            //   "排序前id",
            //   _this.menuList.map(i => i.id)
            // );
            // console.log(
            //   "seq",
            //   _this.menuList.map(i => i.seq)
            // );
            data = _this.menuList.slice(oldIndex, newIndex + 1);
            ids = data.map(i => i.id);
            // console.log(ids, data.map(i => i.seq), '排序前');
            first = ids.splice(0, 1)[0];
            ids.push(first);
          } else {
            //自下而上
            // console.log(
            //   "排序前id",
            //   _this.menuList.map(i => i.id)
            // );
            // console.log(
            //   "seq",
            //   _this.menuList.map(i => i.seq)
            // );
            data = _this.menuList.slice(newIndex, oldIndex + 1);
            ids = data.map(i => i.id);
            // console.log(ids, data.map(i => i.seq), '排序前');
            first = ids.splice(data.length - 1, 1)[0];
            ids.unshift(first);
          }
          let sortArr = data.map((i, j) => {
            return {
              id: ids[j],
              seq: i.seq
            };
          });
          // console.log("排序后", sortArr);
          // console.log('tabs拖拽数据',sortArr);
          await MenuApi.sortApi(sortArr).then(_this.getAllList());
          _this.$message({
            message: "排序成功",
            type: "success",
            duration: 1000
          });
          parent.postMessage(
            {
              type: "menu",
              menuMsg: Math.random()
            },
            parent.origin
          );
          _this.sortMenu();
        }
      });
    },
    delMenu(_id) {
      this.$confirm(this.$t("common.delTitle"), this.$t("common.prompt"), {
        type: "warning"
      })
        .then(async () => {
          try {
            await MenuApi.delById(_id);
            this.$info(this.$t("common.delSuccess")).then(() => this.getAllList());
            parent.postMessage(
              {
                type: "menu",
                menuMsg: Math.random()
              },
              parent.origin
            );
          } catch (error) {
            this.$error(this.$t("common.delFail"));
          }
        })
        .catch(e => e);
    },
    delAll() {
      // console.log(this.selected);
      if (this.selected.length == 0) return;
      this.$confirm(this.$t("common.delTitle"), this.$t("common.prompt"), {
        type: "warning"
      })
        .then(async () => {
          try {
            await MenuApi.delete(this.selected.map(sel => sel.id));
            this.$info(this.$t("common.delSuccess")).then(() => this.getAllList());
            parent.postMessage(
              {
                type: "menu",
                menuMsg: Math.random()
              },
              parent.origin
            );
          } catch (error) {
            this.$error(this.$t("common.delFail"));
          }
        })
        .catch(e => e);
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-input {
  width: 250px;
}
::v-deep .el-tabs__nav {
  white-space: normal !important;
}
/deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: none;
}
/deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
  border: 1px solid #e6e9f0;
  margin-right: -1px;
}
/deep/ .el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
  border-left: 1px solid #e6e9f0;
}
/deep/ .el-tabs--card > .el-tabs__header .el-tabs__item:last-child {
  border-right: 1px solid #e6e9f0;
}
/deep/ .el-tabs--card > .el-tabs__header {
  border-bottom: none;
}
/deep/ .el-tabs__item {
  font-size: 16px;
  padding: 0 13px;
  margin-bottom: 10px;
}
/deep/ .el-form--label-top .el-form-item__label {
  padding: 0;
}
/deep/ .el-tabs__nav-next {
  font-size: 18px;
  color: #000;
}
/deep/ .el-tabs__nav-prev {
  font-size: 18px;
  color: #000;
}
</style>
