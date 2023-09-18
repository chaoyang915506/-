<template>
  <div>
    <div class="container-fluid" v-if="isShow">
      <div class="row">
        <div class="col-md-10 col-md-offset-1">
          <div class="title">
            <span>{{ $t("guestName.title") }}</span>
          </div>
          <div class="btn-group fixed-table-toolbar">
            <button class="btn btn-default" type="button" @click="changeShowNames('关闭')">
              {{ $t("guestName.closeName") }}
            </button>
            <button class="btn btn-default" type="button" @click="changeShowNames('开启')">
              {{ $t("guestName.openName") }}
            </button>
            <button class="btn btn-default" type="button" @click="changeNamesSource('MyCoolTV')">
              {{ $t("guestName.mycool") }}
            </button>
            <button class="btn btn-default" type="button" @click="changeNamesSource('PMS')">
              {{ $t("guestName.PMS") }}
            </button>
            <button class="btn btn-default" type="button" @click="isShow = false">
              {{ $t("guestName.guest") }}
            </button>
            <!-- <button class="btn btn-default" @click="getGuestList"><i class="el-icon-refresh" style="font-weight: 700"></i></button> -->
          </div>
          <div>
            <!-- :options="{ showRefresh: true }" -->
            <cool-table
              :options="options"
              :data="guestList"
              :columns="columns"
              ref="guestNameTable"
              @show-row="changeShowName"
              @change-row="changeNameSource"
            />
          </div>
        </div>
      </div>
    </div>
    <GuestInfo v-else :isShow.sync="isShow" />
  </div>
</template>

<script>
import CoolTable from "@/components/CoolTable.vue";
import GuestNameApi from "@/api/guestInfo/guestNameApi";
import GuestInfo from "../guestInfoApp.vue";
import Env from "@/env";
import { optionsUS } from "@/utils/bootstrapTable-i18n";
export default {
  data() {
    return {
      guestList: [], // 客人信息（带index字段）
      options: {},
      columns: [],
      isShow: true
    };
  },
  components: { CoolTable, GuestInfo },
  created() {
    this.getGuestList();
    this.columns = [
      {
        checkbox: true
      },
      {
        field: "roomNumber",
        title: `${this.$t("guestName.roomNum")}`,
        align: "center"
      },
      {
        field: "showGuestName",
        title: `${this.$t("guestName.isShow")}`,
        align: "center",
        formatter: (val, row, idx) => {
          return val === 1 ? `${this.$t("guestName.open")}` : `${this.$t("guestName.close")}`;
        },
        cellStyle: (val, row, idx) => {
          if (val == 0) {
            return { css: { color: "red" } };
          } else {
            return { css: { color: "lightgreen" } };
          }
        }
      },
      {
        field: "nameSource",
        title: `${this.$t("guestName.nameSo")}`,
        align: "center",
        formatter: (val, row, idx) => {
          return val === "1" ? "PMS" : "MyCoolTV";
        }
      },
      {
        field: "index",
        title: `${this.$t("guestName.operate")}`,
        align: "center",
        formatter: (val, row, idx) => {
          let res = "";
          let status = row["showGuestName"];
          if (status == 1) {
            res = `${this.$t("guestName.close")}`;
          } else {
            res = `${this.$t("guestName.open")}`;
          }
          return `<button class="btn btn-default btn-sm" data-val="${val}" data-emit="show-row">${res}</button>
                <button class="btn btn-default btn-sm" data-val="${val}" data-emit="change-row">${this.$t(
            "guestName.changeNS"
          )}</button>`;
        }
      }
    ];
    if (Env.locale == "1") {
      this.options = {
        showRefresh: true,
        search: true,
        strictSearch: true,
        // visibleSearch: true,
        icons: {
          refresh: "glyphicon glyphicon-refresh icon-refresh"
        },
        onRefresh: function(params) {
          // console.log(window);
          window.location.reload();
        },
        ...optionsUS
      };
    } else {
      this.options = {
        showRefresh: true,
        search: true,
        strictSearch: true,
        // visibleSearch: true,
        icons: {
          refresh: "glyphicon glyphicon-refresh icon-refresh"
        },
        onRefresh: function(params) {
          // console.log(window);
          window.location.reload();
        }
      };
    }
  },
  methods: {
    async getGuestList() {
      try {
        const list = await GuestNameApi.getGuestListApi();
        let i = 0;
        let arr = [];
        list.list.map(item => {
          arr.push(Object.assign({}, item, { index: i++ }));
        });
        this.guestList = arr;
        // console.log('客人列表', this.guestList);
      } catch (error) {
        console.log(error);
      }
    },
    async setGuestName(list) {
      try {
        await GuestNameApi.changeGuestApi(list);
        swal({
          title: `${this.$t("guestName.confirm.guestSS")}`,
          icon: "success",
          buttons: `${this.$t("confirm.ok")}`
        });
        this.getGuestList();
      } catch (error) {
        swal({
          title: `${this.$t("confirm.fail")}`,
          icon: "error",
          buttons: `${this.$t("confirm.ok")}`
        });
      }
    },
    // {"oList":[{"nameSource":"1","roomNumber":"1001123","showGuestName":1}]}
    // 开启或关闭单个姓名显示
    changeShowName(i) {
      // console.log(i);
      var currData = this.guestList.filter(item => item.index === i);
      // console.log('当前操作数据', currData)
      let list = {};
      list.oList = currData;
      currData[0].showGuestName === 0
        ? (list.oList[0].showGuestName = 1)
        : (list.oList[0].showGuestName = 0);
      // console.log('要传的数据', list);
      this.setGuestName(list);
    },
    // 切换单个姓名来源
    changeNameSource(i) {
      var currData = this.guestList.filter(item => item.index === i);
      let list = {};
      list.oList = currData;
      currData[0].nameSource === "0"
        ? (list.oList[0].nameSource = "1")
        : (list.oList[0].nameSource = "0");
      this.setGuestName(list);
    },
    // 开启/关闭多个姓名显示
    changeShowNames(type) {
      const selected = this.$refs.guestNameTable.getSelections();
      // console.log('选中的数据', selected);
      if (selected.length == 0) {
        return this.$message({ message: this.$t("guestName.confirm.noData"), type: "warning" });
      }
      let arr = [];
      if (type === "开启") {
        type = this.$t("guestName.open");
        selected.forEach(item => {
          if (item.showGuestName === 0) {
            item.showGuestName = 1;
            arr.push(item);
          }
        });
      }
      if (type === "关闭") {
        type = this.$t("guestName.close");
        selected.forEach(item => {
          if (item.showGuestName === 1) {
            item.showGuestName = 0;
            arr.push(item);
          }
        });
      }
      // console.log(arr);
      if (arr.length == 0) {
        return this.$message({
          message: this.$t("guestName.confirm.guestSN") + `${type},` + this.$t("guestName.confirm.guestMsg"),
          type: "warning"
        });
      }
      let list = {};
      list.oList = arr;
      this.setGuestName(list);
    },
    // 切换多个姓名来源
    changeNamesSource(type) {
      const selected = this.$refs.guestNameTable.getSelections();
      // console.log('选中的数据', selected);
      if (selected.length == 0) {
        return this.$message({ message: this.$t("guestName.confirm.noData"), type: "warning" });
      }
      let arr = [];
      if (type === "MyCoolTV") {
        selected.forEach(item => {
          if (item.nameSource === "1") {
            item.nameSource = "0";
            arr.push(item);
          }
        });
      }
      if (type === "PMS") {
        selected.forEach(item => {
          if (item.nameSource === "0") {
            item.nameSource = "1";
            arr.push(item);
          }
        });
      }
      // console.log(arr);
      if (arr.length == 0) {
        return this.$message({
          message: this.$t("guestName.confirm.guestNS") + `${type}, ` + this.$t("guestName.confirm.guestMsg"),
          type: "warning"
        });
      }
      let list = {};
      list.oList = arr;
      this.setGuestName(list);
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  color: red;
  margin-top: 8px;
}
.btn-group .btn {
  border: 1px solid #ccc;
  margin: 10px 5px;
}
.btn-group .btn:hover {
  background: #bbb;
}
::v-deep  .bootstrap-table .fixed-table-container {
  margin-bottom: 10px;
}
::v-deep td .btn {
  border: 1px solid #ccc;
}
::v-deep  td .btn:hover {
  background: #bbb;
}
::v-deep  .btn-secondary {
  background-color: #909399;
  border-color: #f5f7fa;
}
</style>
