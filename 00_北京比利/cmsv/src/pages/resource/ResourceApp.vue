<template>
  <div style="padding: 1%">
    <div v-if="view == 'table'">
      <h2>资源管理</h2>
      <hr />
      <!-- <h1>酒店语言管理</h1> -->
      <el-card shadow="always" :body-style="{ padding: '20px' }" style="margin-bottom: 1%">
        <div slot="header">
          <!-- <span>{{ $t("confirm.screeningCondition") }}</span> -->
        </div>
        <el-form ref="form" :model="screen" label-width="40%">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="$t('chargingStrategy.money')">
                <el-input @change="pageData" v-model="screen.amount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="$t('chargingStrategy.money')">
                <el-input @change="pageData" v-model="screen.amount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="$t('chargingStrategy.currencytype')">
                <el-select v-model="screen.currencyId" @change="pageData" filterable clearable>
                  <el-option value="" label="全部"></el-option>
                  <el-option
                    v-for="item in moneylist"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-button class="add" size="medium" @click="view = 'form'">{{
        $t("confirm.Added")
      }}</el-button>
      <el-button class="del" size="medium" @click="delAll">{{ $t("confirm.delete") }}</el-button>
      <el-button class="add" size="medium" @click="view = 'current'">{{
        $t("chargingStrategy.currencymanagement")
      }}</el-button>
      <el-button class="add" size="medium" @click="view = 'money'">{{
        $t("chargingStrategy.moneymanage")
      }}</el-button>

      <cool-em-table
        style="margin-top: 1%"
        @SelectionChange="(value) => (selected = value)"
        :tableList="tableList"
        :opt="opt"
        :columns="columns"
        :pageModel.sync="pageModel"
        :totalLength="totalLength"
        @pageData="pageData"
      >
        <el-table-column slot="btn" align="center" :label="$t('confirm.operate')" prop="id">
          <template #default="{ row }">
            <el-button type="text" @click="edit(row.id)">{{ $t("confirm.edit") }}</el-button>
            <el-button type="text" @click="del(row.id)">{{ $t("confirm.delete") }}</el-button>
          </template>
        </el-table-column>
      </cool-em-table>
    </div>
    <div v-if="view == 'form'">
      <!-- <el-row :gutter="20" style="margin-top: 4%">
        <el-col :span="12" :offset="6">
          <charging-strategy-from
            :formData="formData"
            :moneylist="moneylist"
            :allfeelist="allfeelist"
            @close="close"
            :langData="langData"
            test="hello"
          ></charging-strategy-from>
        </el-col>
      </el-row> -->
    </div>
    <div v-if="view == 'ddd'">
      <CoolElementTable />
    </div>
  </div>
</template>

<script>
class from {
  constructor() {
    this.feeId = "";
    this.timeStrategy = "0";
    this.timeAmount = "";
    this.desc = "";
    this.desclanguage = "";
  }
}
import env from "@/env";
import Axios from "axios";
import CoolEmTable from "@/components/CoolEmTable.vue";
import chargingStrategyApi from "@/api/ChargingStrategyApi";
// import CoolTable from "./ResourceFrom.vue";
import CoolElementTable from "@/components/CoolElementTable.vue";
// import ResourceApi from "@/api/ResourceApi";
export default {
  data() {
    return {
      selected: [],
      screen: {
        amount: "",
        currencyId: "",
      },
      vendor: env.vendor,
      view: "table",
      formData: new from(),
      langData: {},
      columns: [
        {
          prop: "id",
          label: "ID",
          align: "center",
        },
        {
          prop: "amount",
          label: "",
          align: "center",
        },
        {
          prop: "moneyName",
          label: "",
          align: "center",
        },
        {
          prop: "day",
          label: "",
          align: "center",
        },
        {
          prop: "timeAmount",
          label: "",
          align: "center",
        },
        {
          prop: "text",
          label: 'this.$t("chargingStrategy.clientChinese")',
          align: "center",
        },
        {
          prop: "textEn",
          label: 'this.$t("chargingStrategy.clientEnlish")',
          align: "center",
        },
        {
          prop: "desc",
          label: 'this.$t("chargingStrategy.explain")',
          align: "center",
        },
      ],
      tableList: [],
      totalLength: 0,
      opt: { sidePagination: "server" },
      hotelList: [],
      sonData: null, //存数据
      pageModel: {
        limit: 15, //每页的数据
        offset: 0,
        currentPage: 1, //当前页
      },

      moneylist: [], //钱
      allfeelisttest: [],
    };
  },
  created() {
    this.getpage();
  },
  components: {
    CoolEmTable,
    CoolElementTable,
  },
  computed: {
    tableData() {
      return this.tableList;
    },
    allfeelist() {
      let obj;
      return this.allfeelisttest.map((item) => {
        obj = this.moneylist.find((i) => i.id == item.currencyId);
        if (obj) {
          return { ...item, name: obj.name, desc: item.amount + " 分 " + obj.name };
        }
      });
    },
  },
  methods: {
    getpage() {
      let data = new FormData();
      data.append("curPage", "1");
      data.append("pageSize", "10");
      data.append("condition", JSON.stringify({ resource: {}, resourceTag: {} }));
      console.log(data, "all");
      // ResourceApi.getPage({
      //   curPage: 1,
      //   pageSize: 10,
      //   condition: { resource: {}, resourceTag: {} },
      // }).then((res) => {
      //   this.tableList = res.list;
      // });
    },
    SelectionChange(val) {
      console.log(val);
    },
    close(val) {
      if (val == "add") {
        this.pageData({
          ...this.pageModel,
          currentPage: 1,
        });
      }
      if (val == "form") {
        this.pageData({
          limit: this.pageModel.limit, //每页的数据
          offset: 0,
          currentPage: 1,
        });
      }
      this.formData = new from();
      this.view = "table";
    },
    delAll() {
      if (this.selected.length == 0) return;
      console.log(this.selected, "all");
      this.$confirm(
        this.$t("chargingStrategy.deleteinfo "),
        this.$t("chargingStrategy.deleteAll ")
      ).then((res) => {
        if (res) {
          ChargingStrategyApi.deleteAll({ idList: this.selected.map((i) => i.id) })
            .then((d) => {
              this.$info(this.$t("confirm.delSuccess"));
              this.close("add");
            })
            .catch((err) => {
              console.log(err, "all");
              this.$error(err);
            });
        }
      });
    },
    async edit(id) {
      this.info = this.$t("confirm.edit");
      await ChargingStrategyApi.getedit(id).then((data) => {
        let str = "";
        for (let k in data.text) {
          if (data.text[k] && str == "" && k !== "id") {
            str += data.text[k];
          } else if (data.text[k] && k !== "id") {
            str += "|" + data.text[k];
          }
        }
        this.formData = {
          ...data.chargeStrategy,
          desclanguage: str,
        };
        this.langData = data.text;
      });
      this.view = "form";
    },
    del(id) {
      this.$confirm(this.$t("chargingStrategy.deleteconfirm").replace("x", id)).then((res) => {
        if (!res) return;
        ChargingStrategyApi.delete(id).then((data) => {
          this.$info(this.$t("confirm.delSuccess"));
          this.close("add");
        });
      });
    },
    //数据发生变化
    pageData(val) {
      if (typeof val == "object") {
        this.pageModel = val;
      }
      let data = {
        offset: this.pageModel.offset,
        limit: this.pageModel.limit,
        currencyId: this.screen.currencyId,
        amount: this.screen.amount,
      };
      if (!this.screen.currencyId) delete data.currencyId;
      if (!this.screen.amount) delete data.amount;
      chargingStrategyApi.getTable(data).then((data) => {
        this.tableList = this.formatTable(data.rows);
        this.totalLength = data.total;
      });
    },
    //获取全部的数据
    getTable() {
      Axios.all([
        chargingStrategyApi.getAll(),
        chargingStrategyApi.getAllFee(),
        chargingStrategyApi.getTable({
          offset: this.pageModel.offset,
          limit: this.pageModel.limit,
        }),
      ]).then(
        Axios.spread((money, allfee, tabledata) => {
          this.moneylist = money.list;
          this.allfeelisttest = allfee.list;
          this.tableList = this.formatTable(tabledata.rows);
          this.totalLength = tabledata.total;
        })
      );
    },
    //处理arr数据
    formatTable(arr) {
      let obj, obj1;
      return arr.map((i) => {
        obj = this.allfeelist.find((idx) => idx.id == i.feeId);
        obj1 = this.moneylist.find((idx) => idx.id == obj.currencyId);
        if (obj && obj1) {
          return {
            ...i,
            moneyName: obj1.name,
            amount: obj.amount,
            day: i.timeStrategy == 1 ? "天" : "按check in周期",
            timeAmount: i.timeAmount ? i.timeAmount : "-",
          };
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.add:hover {
  color: #fff;
  background-color: #3090f0;
}
.del:hover {
  color: #fff;
  background-color: #f05656;
}
::v-deep .el-form-item__label {
  line-height: 150%;
}
</style>
