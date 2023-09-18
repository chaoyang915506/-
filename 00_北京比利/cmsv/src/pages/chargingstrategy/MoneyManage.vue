<template>
  <div>
    <div v-if="view == 'table'">
      <!-- <h1>酒店语言管理</h1> -->
      <el-card shadow="always" :body-style="{ padding: '20px' }" style="margin-bottom: 1%">
        <div slot="header">
          <span>{{ $t("confirm.screeningCondition") }}</span>
        </div>
        <el-form ref="form" :model="screen" label-width="40%">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item :label="$t('chargingStrategy.money')">
                <el-input @change="pageData" v-model="screen.amount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('chargingStrategy.currencytype')">
                <el-select v-model="screen.currencyId" clearable filterable @change="pageData">
                  <el-option label="全部" value=""></el-option>
                  <el-option
                    v-for="item in moneylist"
                    :key="item.id"
                    :label="item.name + '|' + item.symbol"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-button class="add" size="medium" @click="add">{{ $t("confirm.Added") }}</el-button>
      <el-button size="medium" @click="$emit('close', 'add')">{{ $t("confirm.return") }}</el-button>
      <cool-em-table
        style="margin-top: 1%"
        :checkbox="false"
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
            <el-button type="text" @click="del(row.id)">{{ $t("confirm.delete") }}</el-button>
          </template>
        </el-table-column>
      </cool-em-table>
    </div>
    <el-dialog
      :title="$t('confirm.add') + $t('chargingStrategy.unitprice')"
      width="60%"
      :visible.sync="dialog"
      @close="dialog = false"
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="30%"
        :inline="false"
        size="normal"
      >
        <el-form-item label="ID" v-if="form.id">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('chargingStrategy.pontsMoney')" prop="amount">
          <el-input v-model="form.amount"></el-input>
        </el-form-item>
        <el-form-item :label="$t('chargingStrategy.currencytype')" prop="currencyId">
          <el-select v-model="form.currencyId" clearable filterable>
            <el-option :label="$t('confirm.pleasechoose')" value=""></el-option>
            <el-option
              v-for="item in moneylist"
              :key="item.id"
              :label="item.name + '|' + item.symbol"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click.prevent="onSubmit">{{ $t("confirm.add") }}</el-button>
        <el-button @click="dialog = false">{{ $t("confirm.return") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
class form {
  constructor() {
    this.amount = "";
    this.currencyId = "";
  }
}

import env from "@/env";
import CoolEmTable from "@/components/CoolEmTable.vue";
import HotelLanguageApi from "../../api/HotelLanguageApi.js";
import ChargingStrategyApi from "@/api/ChargingStrategyApi";
export default {
  props: {
    moneylist: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const validateMobile = (rule, value, callback) => {
      let num=2147483647
      if (/^[1-9]+[0-9]*]*$/.test(value) && value <=num ) {
        callback();
      } else {
        callback(new Error(this.$t('chargingStrategy.errornumber').replace('x',1).replace('y',num)));
      }
    };
    return {
      dialog: false,
      selected: [],
      form: new form(),
      screen: {
        amount: "",
        currencyId: "",
      },
      vendor: env.vendor,
      view: "table",
      view2: "form",
      columns: [
        {
          prop: "id",
          label: "ID",
          align: "center",
        },
        {
          prop: "amount",
          label: this.$t("chargingStrategy.money") + this.$t("chargingStrategy.points"),
          align: "center",
        },
        {
          prop: "money",
          label: this.$t("chargingStrategy.currencytype"),
          align: "center",
        },
      ],
      languageList: [], //语言
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

      allfeelisttest: [],
      text: JSON.parse(JSON.stringify({})),
      rules: {
        amount: [
          {
            required: true,
            message: this.$t("chargingStrategy.money") + this.$t("confirm.notempty"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: validateMobile,
          },
        ],
        currencyId: [
          {
            required: true,
            message: this.$t("chargingStrategy.currency") + this.$t("confirm.notempty"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getTable();
  },
  components: {
    CoolEmTable,
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
    add() {
      this.$refs.form.clearValidate();
      this.dialog = true;
    },
    onSubmit() {
      this.$refs.form.validate((res) => {
        if (res) {
          ChargingStrategyApi.addMoney(this.form).then((data) => {
            this.dialog = false;
            this.close("add");
            this.$info(this.$t("confirm.addSuccess"));
          });
        }
      });
    },
    close(val) {
      if (val == "add") {
        this.pageData({
          ...this.pageModel,
          currentPage: 1,
        });
      }
      this.form = new form();
      this.view = "table";
    },
    del(id) {
      this.$confirm(
        this.$t("confirm.hint"),
        this.$t("chargingStrategy.deletemoney").replace("x", id)
      ).then((res) => {
        if (!res) return;
        ChargingStrategyApi.deleteMoney(id)
          .then((data) => {
            this.$info(this.$t("confirm.delSuccess"));
            this.close("add");
          })
          .catch((err) => {
            this.$error(err);
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
        amount: this.screen.amount,
        currencyId: this.screen.currencyId,
      };
      if (!this.screen.amount) delete data.amount;
      if (!this.screen.currencyId) delete data.currencyId;
      ChargingStrategyApi.getMoneyAll(data).then((data) => {
        this.tableList = this.fartter(data.rows);
        this.totalLength = data.total;
      });
    },
    //获取全部的数据
    getTable() {
      let obj;
      ChargingStrategyApi.getMoneyAll({
        offset: this.pageModel.offset,
        limit: this.pageModel.limit,
      }).then((tabledata) => {
        this.tableList = this.fartter(tabledata.rows);
        this.totalLength = tabledata.total;
      });
    },
    fartter(arr) {
      let obj;
      return arr.map((i) => {
        obj = this.moneylist.find((idx) => idx.id == i.currencyId);
        return {
          ...i,
          money: obj.name ? obj.name : "",
        };
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
.el-select {
  width: 100%;
}
::v-deep .el-dialog__body {
  padding: 30px 10% 0px 10%;
}
.el-dialog__footer {
  padding: 0 20px 20px 20px;
  padding-top: 0px;
}
::v-deep .el-form-item__label {
  text-align: center;
  line-height: 150%;
}
</style>
