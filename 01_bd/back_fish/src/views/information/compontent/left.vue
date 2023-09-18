<template>
  <div class="leftbox">
    <div class="box_top">
      <div class="title_info">
        <!-- <p class="strip"></p> -->
        <span>数据源</span>
        <div></div>
      </div>
      <div class="content">
        <!-- <el-input
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
        </el-input> -->
        <!-- :max="2" -->
        <!-- <el-checkbox-group> -->
        <el-checkbox
          v-for="item in checkboxlistcopy"
          :key="item.dictValue"
          @change="getvideo(item)"
          class="checkbox_css"
          :value="item.dictValue"
          v-model="datalist"
          :label="item.dictLabel"
        >
        </el-checkbox>
        <!-- </el-checkbox-group> -->
      </div>
    </div>
    <div class="box_bottom">
      <div class="title_info">
        <span>重点账号</span>
        <div></div>
      </div>
      <div class="content">
        <el-input
          style="margin-bottom: 20px"
          v-model="searchaccount"
          placeholder="请输入查询内容"
          size="small"
        >
          <template #suffix>
            <div class="icon-item">
              <svg-icon class-name="search-icon" icon-class="search" />
            </div>
          </template>
        </el-input>
        <div>
          <div
            @click="selected(i)"
            v-for="i in accountlist"
            :key="i.recordId"
            :class="[seled == i.recordId ? 'acticeinfo' : '', 'account']"
            style="cursor: pointer"
          >
            {{ i.userName }}
            <div class="clear_account" @click="clearAccount(i)">移除账号</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 重点账号删除 } from "@/api/information/information.js";
export default {
  props: {
    generic_data_source: {
      type: Array,
      default: () => [],
    },
    accountlist: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      seled: "",
      datalist: [],
      account: [
        {
          name: "Aaron",
          value: "0",
        },
        {
          name: "Aaraon",
          value: "0",
        },
      ],
      serchinfo: "",
      searchaccount: "", //下
    };
  },
  computed: {
    checkboxlistcopy() {
      let reg = RegExp(this.serchinfo, "i");
      return this.generic_data_source.filter((i) => {
        return this.serchinfo ? reg.test(i.dictLabel) : i;
      });
    },
    acountlistcopy() {
      let reg = RegExp(this.searchaccount, "i");
      return this.account.filter((i) => {
        return this.searchaccount ? reg.test(i.name) : "i";
      });
    },
  },
  methods: {
    selected(i) {
      // debugger
      if (this.seled === i.recordId) {
        window.infoName = "";
        // this.$parent.$data.userName = "";
        this.seled = "";
      } else {
        window.infoName = i.userName;
        // this.$parent.$data.userName = i.userName;
        this.seled = i.recordId;
      }

      console.log(this.seled, "red,dd", i);
    },
    //获取数据源
    getvideo(i) {
      // this.$parent.getrefrsh();
      let sourtd = this.datalist.map((i) => {
        let re = this.generic_data_source.find((idx) => idx.dictLabel == i);
        // console.log(re, "rd");
        if (re) {
          return re.dictValue;
        }
      });
      // console.log(this.$parent, "red");
      this.$parent.$data.sourdata = sourtd;
      // this.$parent.getinfo({
      //   pageNum: 0,
      //   dataSources: sourtd,
      //   // endTime: new Date().getTime(),
      //   // startTime: new Date().setDate(new Date().getDate() - 7),
      //   pageSize: 10,
      // });
      // this.$parent.getpostion(); //调用获取地址的接口
      this.$parent.closewindow(true);
      // console.log(i, "数据源");
    },
    //删除账号
    async clearAccount(i) {
      let res = await this.$modal.confirm("确定删除此账号吗?");
      if (res) {
        try {
          console.log(i, "删除");
          await 重点账号删除(i.recordId);
          await this.$parent.getallaccount();
          await this.$modal.msgSuccess("删除成功");
        } catch (error) {
          await this.$modal.msgError("删除失败");
        }
        // window.alert(7);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.leftbox {
  height: 100%;
  padding: 1px;
}
.box_top {
  height: 40%;
  overflow: auto;
  // border: 1px solid #241866;
  // box-shadow: inset 5px 5px 5px #054588, inset -5px -5px 5px #054588;
  box-shadow: inset 3px 3px 3px #054588, inset -3px -3px 3px #054588;
  overflow-x: hidden;
}
.box_bottom {
  height: calc(60% - 10px);
  position: relative;
  margin-top: 10px;
  // border: 1px solid #241866;
  box-shadow: inset 3px 3px 3px #054588, inset -3px -3px 3px #054588;
}

.title_info {
  padding: 4px 10px 0;
  position: relative;
  width: 100%;
  height: 30px;
  line-height: 30px;
  // font-size: 17px;
  font-size: 14px;
  color: #fff;
  // padding: 1px 10px;
  font-weight: 500;
  span {
    border-left: 4px solid #1487c8;
    padding-left: 4px;
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
  width: 100%;
  height: calc(100% - 30%);
  padding: 10px;
}

//复选框的样式
.checkbox_css {
  width: 100%;
  color: #fff;

  margin-top: 10px;
}

::v-deep .checkbox_css .el-checkbox__input {
  float: right;
  margin-right: 1%;
}
.icon-item {
  line-height: 34px;
  width: 22px;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
}
.account {
  color: #fff;
  margin-top: 10px;
  font-size: 14px;
  padding-left: 10px;
}
.account:hover {
  background-color: #0f1c40;
}
.clear_account {
  cursor: pointer;
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
.acticeinfo {
  color: #0eaac0 !important;
}

::v-deep .el-input--small .el-input__inner {
  background: #0f1c40;
  height: 32px;
  line-height: 32px;
  border: 1px solid #122b54;
}
::v-deep .el-input--small .el-input__inner::placeholder {
  color: rgba(255, 255, 255, 0.3);
  font-size: 12px;
}
// .strip {
//   width: 2px;
//   height: 100%;
//   background-color: #1487c8;
//   display: inline-block;
// }
</style>
