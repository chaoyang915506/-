<template>
  <div>
    <el-tabs
      v-model="activeName"
      tab-position="top"
      class="tabs_class"
      @tab-click="handleClick"
    >
      <el-tab-pane label="组织机构" name="texture" style="height: 100%">
        <div class="leftbox">
          <div class="title_info">
            <span>组织机构</span>
            <div></div>
          </div>
          <div class="content">
            <el-input
              style="margin-bottom: 20px"
              v-model="serchinfo"
              placeholder="请输入查询内容"
              size="small"
            >
              <template #suffix>
                <div class="icon-item">
                  <svg-icon class-name="search-icon" icon-class="search" />
                </div>
              </template>
            </el-input>

            <el-tree
              ref="tree"
              :default-expand-all="true"
              :data="treeDataCopy"
              :props="treeProps"
              @node-click="treeClick"
            ></el-tree>
          </div>
          <!-- </div> -->
        </div>
      </el-tab-pane>
      <el-tab-pane label="人员列表" name="personnel"> </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  查询组织机构,
  态势模块状态信息根据弦号列表查询V3,
  通用查询舷号,
} from "@/api/analyse/analyse.js";
import { 查询图片服务器地址 } from "@/api/situation/situation";
import { 组织机构模块所属舰艇查询 } from "@/api/institutional/institutional.js";
export default {
  name: "left",
  props: {
    // mugangdata: {
    //   type: Array,
    //   default: () => [],
    // },
  },
  data() {
    return {
      //树形取值
      treeProps: {
        children: "children",
        label: "name",
      },
      activeName: "texture",
      treeData: [],
      datalist: [],
      serchinfo: "",
      zjinfodata: {}, //舰艇信息
      lonlatlist: [], //全部的艇信息
    };
  },
  created() {
    this.getLongItude();
    this.gettree();
  },
  methods: {
    //查艇下的经纬度
    async getLongItude() {
      let res = await 态势模块状态信息根据弦号列表查询V3({
        startDate: "2022-08-18",
      });
      // console.log(res, "red");
      this.lonlatlist = res.rows;
    },
    //h获取艇的艇号
    async getSubMaineData(data) {
      let submaine;
      if (Array.isArray(data)) {
        submaine = data;
      } else {
        let res = await 通用查询舷号(data);
        submaine = res.rows;
      }
      // console.log(submaine, "log1");
      // console.log(res.rows, "row");
      let lastdata = submaine
        .map((item) => {
          let results = this.lonlatlist.find((i) => i.name == item.sideNum);
          console.log(results, "results");
          return results ? results : null;
        })
        .filter((i) => i);
      console.log(lastdata, "lastdata", this.lonlatlist);
      // this.$refs.middle.findSubMaine(lastdata);
      this.$emit("saveLonlat", lastdata);
    },
    handleClick(e) {
      if (e.paneName == "personnel") {
        // this.$router.push("/inofrlistdata");
        this.$parent.$data.tags = true;
        this.$parent.$data.page = "infrlistdata";
      }
      // console.log(e);
    },
    async gettree() {
      this.treeData = [];
      const res = await 查询组织机构({ name: this.serchinfo });
      this.treeData = res.rows;
    },
    //树形点击
    treeClick(e) {
      this.$parent.$data.iconshow = true;
      this.$parent.personage(false);
      this.$parent.cleardata();
      this.right_info == "gl";

      this.right_box = true;
      if (e.dataType != 2) {
        this.nextinfo = e.children;
      }
      if (new RegExp("司令").test(e.name)) {
        this.$emit("getjianting", e.id);
        this.$parent.getzldata(e.id);
        this.$parent.getzzjg(e.id);
        this.$parent.getzhgdata(e.id);
        this.getSubMaineData({ queryType: 1, id: e.id });
        this.device = "commander";
      } else if (new RegExp("大队").test(e.name)) {
        this.$parent.getzldata(e.id);
        this.$emit("getjianting", e.id);
        this.$parent.getzzjg(e.id);
        this.$parent.getzhgdata(e.id);
        this.getSubMaineData({ queryType: 1, id: e.id });
        this.device = "brigade";
      } else if (new RegExp("中队").test(e.name)) {
        // console.log(e, "id");
        this.getSubMaineData({ queryType: 1, id: e.id });
        this.$emit("getjianting", e.id);
        this.$parent.getzldata(e.id);
        this.$parent.getzzjg(e.id);
        this.$parent.getzhgdata(e.id);
        this.device = "detachment";
      } else if (e.dataType == 2) {
        // console.log(e, "dianji");
        this.$parent.dttitle = e.name;
        this.$parent.personage(true);
        this.$parent.getdantingzhg(e.name);
        this.getSubMaineData([{ sideNum: e.name }]);
        this.device = "standalone";
      } else if (new RegExp("潜艇部队").test(e.name)) {
        this.$emit("getjianting");
        this.$parent.getzldata(e.id);
        this.$parent.getzzjg(e.id);
        this.$parent.getzhgdata();
        this.getSubMaineData({ queryType: 1, id: "" });
      }
    },
  },
  computed: {
    treeDataCopy() {
      const endValue = (value, arr) => {
        if (!arr) {
          return [];
        }
        let newarr = [];
        arr.forEach((elemnt) => {
          if (elemnt.name.indexOf(value) > -1) {
            const ab = endValue(value, elemnt.children);
            const obj = {
              ...elemnt,
              children: ab,
            };
            newarr.push(obj);
          } else {
            if (elemnt.children && elemnt.children.length > 0) {
              const ab = endValue(value, elemnt.children);
              const obj = {
                ...elemnt,
                children: ab,
              };
              if (ab && ab.length > 0) {
                newarr.push(obj);
              }
            }
          }
        });
        return newarr;
      };
      return this.serchinfo
        ? endValue(this.serchinfo, this.treeData)
        : this.treeData;
    },
  },
};
</script>

<style lang="scss" scoped>
.leftbox {
  // height: calc(100vh - 20px);
  height: 97%;
  border: 1px solid #421b96;
  padding: 10px;
}
.box_top {
  // height: 80vh;
  // height: 100%;
  overflow: auto;
  // border: 1px solid #241866;
  overflow-x: hidden;
}
.box_bottom {
  height: 58%;
  position: relative;
  margin-top: 2%;
  border: 1px solid #241866;
}

.title_info {
  position: relative;
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 17px;
  color: #fff;
  padding: 1px 10px;
  font-weight: 500;
  span {
    width: 30%;
  }
  div {
    background-image: url("/img/ui/bias.svg");
    position: absolute;
    display: inline-block;
    top: 4px;
    width: 70%;
    height: 25px;
    background-size: inherit;
    background-position: 25px 2px;
    -webkit-transform: scale(0.7);
    transform: scale(0.7);
  }
}
.content {
  height: 97%;
  overflow: auto;
}

//复选框的样式
.checkbox_css {
  width: 100%;
  color: #fff;

  margin-top: 15px;
}

::v-deep .checkbox_css .el-checkbox__input {
  float: right;
  margin-right: 1%;
}
.icon-item {
  line-height: 34px;
  width: 22px;
  color: #24292e;
  cursor: pointer;
}
.account {
  color: #fff;
  margin-top: 10px;
}
.account:hover {
  background-color: #0f1c40;
}
.clear_account {
  float: right;
  font-size: 14px;
  opacity: 0;
}
.account:hover .clear_account {
  opacity: 1;
}
.account:active .clear_account {
  opacity: 1;
  color: blue;
}

::v-deep .el-tree-node__content:hover {
  background-color: #0f1c40;
}
::v-deep .el-tree-node:focus > .el-tree-node__conten {
  background-color: null;
}
::v-deep .el-tree-node:focus > .el-tree-node__content {
  background-color: #0f1c40;
}

::v-deep .tabs_class .el-tabs__content {
  height: calc(100vh - 116px) !important;
}
// ::v-deep .tabs_class .el-tabs__header .is-top {
//   height: 30px;
// }
::v-deep .el-tabs__item {
  color: #fff;
}
::v-deep .el-tabs__active-bar {
  background-color: #223cb9;
}
</style>