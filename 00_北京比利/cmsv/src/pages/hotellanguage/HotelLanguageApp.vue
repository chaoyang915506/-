<template>
  <div style="padding:1%">
    <div v-if="view == 'table'">
      <!-- <h1>酒店语言管理</h1> -->
      <el-card shadow="always" :body-style="{ padding: '20px' }" style="margin-bottom:1%">
        <div slot="header">
          <span>{{ $t("confirm.screeningCondition") }}</span>
        </div>
        <el-form ref="form" :model="screen" label-width="40%">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item :label="vendor + $t('confirm.name')">
                <el-select
                  v-model="screen.name"
                  :placeholder="$t('confirm.pleasechoose')"
                  @change="pageData"
                >
                  <el-option value="">全部</el-option>
                  <el-option
                    v-for="item in hotelList"
                    :key="item.hotelId"
                    :label="item.hotelName"
                    :value="item.hotelId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('hotellanguage.language')">
                <el-select
                  v-model="screen.language"
                  :placeholder="$t('confirm.pleasechoose')"
                  @change="pageData"
                >
                  <el-option value="">全部</el-option>
                  <el-option
                    v-for="item in languageList"
                    :key="item.langId"
                    :label="item.langLabel"
                    :value="item.langId"
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
      <el-button class="reset" size="medium" @click="close('reset')">{{
        $t("confirm.reset")
      }}</el-button>
      <el-button class="del" size="medium" @click="delAll">{{ $t("confirm.delete") }}</el-button>

      <cool-em-table
        style="margin-top:1%"
        @SelectionChange="value => (selected = value)"
        :tableList="tableList"
        :opt="opt"
        :columns="columns"
        :pageModel="pageModel"
        :totalLength="totalLength"
        @pageData="pageData"
      >
        <el-table-column slot="btn" align="center" :label="$t('confirm.operate')" prop="id">
          <template #default="{row}">
            <el-button type="text" @click="edit(row.id)">{{ $t("confirm.edit") }}</el-button>
          </template>
        </el-table-column>
      </cool-em-table>
    </div>
    <div v-if="view == 'form'">
      <el-row :gutter="20" style="margin-top:4%;">
        <el-col :span="12" :offset="6"
          ><h3>{{ formData.hotelId ? $t("confirm.edit") : $t("confirm.add") }}</h3></el-col
        >

        <el-col :span="12" :offset="6">
          <hotel-language-from
            :formData="formData"
            @close="close"
            :languageList="languageList"
            :hotelList="hotelList"
          ></hotel-language-from
        ></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
class from {
  constructor() {
    this.langId = "";
    this.label = "";
    this.sort = "";
    this.hotelId = "";
    this.id = "";
  }
}
import env from "@/env";
import Axios from "axios";
import CoolEmTable from "@/components/CoolEmTable.vue";
import HotelLanguageApi from "../../api/HotelLanguageApi.js";
import HotelLanguageFrom from "./HotelLanguageFrom.vue";
export default {
  data() {
    return {
      selected: [],
      screen: {
        language: "",
        name: ""
      },
      vendor: env.vendor,
      view: "table",
      formData: new from(),
      columns: [
        {
          prop: "id",
          label: "ID",
          align: "center"
        },
        {
          prop: "hotelName",
          label: env.vendor + this.$t("confirm.name"),
          align: "center"
        },
        {
          prop: "langName",
          label: this.$t("hotellanguage.language") + this.$t("confirm.name"),
          align: "center"
        },
        {
          prop: "label",
          label: this.$t("hotellanguage.label"),
          align: "center"
        }
      ],
      tableList: [],
      totalLength: 0,
      opt: { sidePagination: "server", url: env.cms + "/cms/hotelLang/getHotelLangList?" },
      languageList: [],
      hotelList: [],
      sonData: null, //存数据
      pageModel: {
        limit: 15, //每页的数据
        offset: 0,
        currentPage: 1 //当前页
      }
    };
  },
  created() {
    this.getTable();
  },
  components: {
    CoolEmTable,
    HotelLanguageFrom
  },
  computed: {
    tableData() {
      return this.tableList;
    }
  },
  methods: {
    SelectionChange(val) {
      console.log(val);
    },
    close(val) {
      if (val == "add" || val == "reset") {
        this.pageData({
          offset: 0,
          limit: this.pageModel.limit,
          currentPage: 1
        });
      }
      if (val == "reset") this.$info(this.$t("confirm.resetSuccess"));

      this.formData = new from();
      this.view = "table";
    },
    delAll() {
      if (this.selected.length == 0) return;
      this.$confirm("您确定要删除这条数据吗？", "删除后将无法恢复，请谨慎操作！").then(res => {
        console.log(res, "all");
        if (res) {
          console.log("成功");
          HotelLanguageApi.delAllhoelLang({ idList: this.selected.map(i => i.id) }).then(d => {
            this.pageData();
            this.$info("删除成功");
          });
        }
      });
    },
    edit(id) {
      this.info = this.$t("confirm.edit");
      this.formData = this.tableData.find(idx => idx.id == id);
      this.view = "form";
    },
    //数据发生变化
    pageData(val) {
      if (typeof val == "object") {
        this.pageModel = val;
      }
      let data = {
        offset: this.pageModel.offset,
        limit: this.pageModel.limit,
        hotelId: this.screen.name,
        langId: this.screen.language
      };
      if (!this.screen.name) delete data.hotelId;
      if (typeof this.screen.language !== "number") delete data.langId;
      HotelLanguageApi.getAllTable(data).then(data => {
        this.tableList = this.formatTable(data.rows);
        this.totalLength = data.total;
      });
    },
    //获取全部的数据
    getTable() {
      Axios.all([
        HotelLanguageApi.getLanuage(),
        HotelLanguageApi.getHotel(),
        HotelLanguageApi.getAllTable({
          offset: this.pageModel.offset,
          limit: this.pageModel.limit
        })
      ]).then(
        Axios.spread((language, hotel, data) => {
          this.languageList = language;
          this.hotelList = hotel;
          this.tableList = this.formatTable(data.rows);
          this.totalLength = data.total;
        })
      );
    },
    //处理arr数据
    formatTable(arr) {
      let obj, obj1;
      return arr
        .map(i => {
          obj = this.hotelList.find(idx => i.hotelId == idx.hotelId);
          if (obj) {
            return { ...i, hotelName: obj.hotelName };
          }
          return i;
        })
        .map(i => {
          obj1 = this.languageList.find(idx => i.langId == idx.langId);
          if (obj1) {
            return { ...i, langName: obj1.langDesc };
          }
          return i;
        });
    }
  }
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
.reset:hover {
  color: #fff;
  background-color: #85ce61;
}
</style>
