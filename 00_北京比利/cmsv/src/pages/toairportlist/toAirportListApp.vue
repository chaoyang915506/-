<template>
  <div style="padding: 1%">
    <div v-show="view == 'table'">
      <el-card shadow="always" :body-style="{ padding: '20px' }" style="margin-bottom: 1%">
        <div slot="header">
          <span>{{ $t("confirm.screeningCondition") }}</span>
        </div>
        <el-form ref="form" :model="pageModel" label-width="40%">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item :label="$t('toAirport.language')">
                <el-select v-model="pageModel.langId" clearable filterable @change="getpage">
                  <el-option value="" label="全部"></el-option>
                  <el-option
                    v-for="(item, idx) in langList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('toAirport.airport')">
                <el-select v-model="pageModel.airportId" clearable filterable @change="getpage">
                  <el-option value="" label="全部"></el-option>
                  <el-option
                    v-for="(item, idx) in includelist"
                    :key="idx"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('toAirport.airline')">
                <el-select v-model="pageModel.airlineId" @change="getpage" filterable clearable>
                  <el-option value="" label="全部"></el-option>
                  <el-option
                    v-for="(item, idx) in airlineList"
                    :key="idx"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-button class="del" size="medium" @click="delAll">{{ $t("confirm.delete") }}</el-button>
      <el-button class="add" size="medium" @click="openFileReader"
        >{{ $t("toAirport.import") }}
        <toImport ref="file" @close="close" :includelist="includelist" :airlineList="airlineList" />
      </el-button>
      <el-button class="add" size="medium" @click="exportxsl">{{
        $t("toAirport.export")
      }}</el-button>
      <el-button class="add" size="medium" @click="view = 'garden'"
        >{{ vendor + $t("toAirport.airportManagement") }}
      </el-button>
      <el-button
        class="add"
        size="medium"
        v-loading.fullscreen.lock="fullscreenLoading"
        @click="addaviation"
      >
        {{ $t("confirm.add") + $t("toAirport.airline") }}
      </el-button>
      <el-button class="add" size="medium" @click="openIcon"> {{ icontitle }} </el-button>
      <CoolElementTable
        id="table"
        :pageSize="pageModel.limit"
        :tableData="tableData"
        :total="total"
        :tableColumns="tableColumns"
        :pageIndex="pageModel.index"
        :operations="operations"
        :pageSizes="pageSizes"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        @handleSelectionChange="(val) => (select = val)"
      />
    </div>
    <div v-if="view == 'form'">
      <el-row :gutter="20" style="margin-top: 4%">
        <el-col :span="12" :offset="6">
          <toAirportFrom
            :formData="formData"
            :includelist="includelist"
            :airlineList="airlineList"
            :langList="langList"
            @close="close"
          />
        </el-col>
      </el-row>
    </div>
    <div v-if="view == 'list'">
      <toAirportList
        @close="close"
        :avatitonson="avatitonson"
        :aviationAll="aviationAll"
        :residuceList="residuceList"
      />
    </div>
    <div v-if="view == 'garden'"><AirPortList @close="close" /></div>
  </div>
</template>
<script>
import { excelData, pageModel } from "./airportlist.js";
import env from "@/env";
import Axios from "axios";
import AirPortList from "./AirPortList.vue";
import CoolElementTable from "@/components/CoolElementTable.vue";
import toAirportListApi from "@/api/toAirportListApi";
import toAirportFrom from "./toAirportFrom.vue";
import toImport from "./toimport.vue";
import toAirportList from "./toAirportList.vue";
import xlsx from "xlsx";
export default {
  components: { CoolElementTable, toAirportFrom, toAirportList, AirPortList, toImport },
  data() {
    return {
      vendor: env.vendor,
      icontitle: this.$t("toAirport.open") + "  " + this.$t("toAirport.Iconimage"),
      fullscreenLoading: false,
      view: "table",
      tableData: [],
      hotelList: [],
      pageModel: new pageModel(),
      pageSizes: [10],
      total: 0,
      tableColumns: [
        {
          prop: "id",
          align: "center",
          label: "id",
          slot: true,
        },
        {
          prop: "airportId",
          align: "center",
          label: this.$t("toAirport.airport") + this.$t("toAirport.name"),
          formatter: (row, column, cellValue) => {
            let data = this.includelist.find((i) => i.id == row.airportId);
            if (data) {
              return data.name;
            } else {
              return "-";
            }
          },
        },
        {
          prop: "airlineId",
          align: "center",
          label:
            this.$t("toAirport.airline") +
            this.$t("toAirport.name") +
            "(" +
            this.$t("toAirport.Chinese") +
            ")",
          formatter: (row, column) => {
            let data = this.airlineList.find((i) => i.id == row.airlineId);
            if (data) {
              return data.name;
            } else {
              return "未知的公司";
            }
          },
        },
        {
          prop: "airlineId",
          align: "center",
          label:
            this.$t("toAirport.airline") +
            this.$t("toAirport.name") +
            "(" +
            this.$t("toAirport.English") +
            ")",
          minWidth: 80,
          formatter: (row, column) => {
            let data = this.airlineList.find((i) => i.id == row.airlineId);
            if (data) {
              return data.nameEn;
            } else {
              return "未知的公司";
            }
          },
        },
        {
          prop: "langId",
          align: "center",
          label: this.$t("toAirport.language"),
          minWidth: 80,
          formatter: (row, column, cellValue) => {
            let data = this.langList.find((i) => i.langId == row.langId);

            if (data) {
              return data.label;
            } else {
              return "-";
            }
          },
        },
        {
          prop: "icon",
          align: "center",
          label: this.$t("toAirport.icon"),
          minWidth: 300,
          formatter: (row, column, cellValue) => {
            return row.icon && row.icon !== null ? row.icon : "-";
          },
        },
      ],
      operations: {
        width: 160,
        fixed: "right",
        label: this.$t("confirm.operate"),
        align: "center",
        list: [
          {
            label: this.$t("toAirport.airline") + this.$t("confirm.edit"),
            type: "text",
            disabled: false,
            method: (index, row) => {
              this.getexcairline(index, row);
            },
          },
          {
            label: this.$t("confirm.delete"),
            type: "text",
            disabled: false,
            method: (index, row) => {
              this.delete(index, row);
            },
          },
          {
            label: this.$t("confirm.edit"),
            type: "text",
            disabled: false,
            method: (index, row) => {
              this.editEvery(index, row);
            },
          },
        ],
      }, //操作按钮
      langList: [], //语言的list
      includelist: [], //机场的list
      airlineList: [], //航空公司的list
      select: [], //选中的数据
      formData: null, //form 的数据
      aviationAll: [], //同下
      residuceList: [], //同下
      avatitonson: null, //航空公司的编辑表或者添加航空公司的表
    };
  },
  created() {
    this.getAllassit();
    this.getpage();
  },
  methods: {
    openIcon() {
      let icon = this.tableColumns.find((i) => i.tag == "icon");
      if (icon) {
        this.icontitle = this.$t("toAirport.open") + "  " + this.$t("toAirport.Iconimage");
        this.tableColumns = this.tableColumns.filter((i) => !i.tag);
      } else {
        this.icontitle = this.$t("toAirport.close") + "  " + this.$t("toAirport.Iconimage");

        this.tableColumns.push({
          prop: "icon",
          align: "center",
          label: this.$t("toAirport.Iconimage"),
          tag: "icon",
          minWidth: 300,
          formatter: (row, column, cellValue) => {
            return row.icon && row.icon !== null
              ? `<img style="width:100%;height:100%;" src="${row.icon}" alt="">`
              : "-";
          },
        });
      }
    },
    //导入
    async openFileReader() {
      let res = await this.$confirm(this.$t("toAirport.importinfo"), this.$t("confirm.hint"), {
        type: "warning",
      });
      if (!res) return;
      await this.$refs.file.importd();
    },
    //导出
    exportxsl() {
      let aoa = [
        ["hotelId", "airportId", "(机场名称)", "airlineId", "航空公司名称", "语言", "图标", "sort"],
      ];
      for (let i = 0; i < this.tableData.length; i++) {
        let aviat = this.tableData[i];
        let aviation = this.airlineList.find((idx) => idx.id == aviat.airlineId);
        let airport = this.includelist.find((idx) => idx.id == aviat.airportId);
        aoa.push([
          env.hotelId,
          aviat.airportId,
          airport ? airport.name : "暂无名称",
          aviat.airlineId,
          aviation ? aviation.name : "暂无名称",
          aviat.langId,
          aviat.icon,
          aviat.sort,
        ]);
      }
      const sheet = xlsx.utils.aoa_to_sheet(aoa);
      const wb = {
        SheetNames: ["sheet1"],
        Sheets: {
          sheet1: sheet,
        },
      };
      xlsx.writeFile(wb, "航空关联列表.xlsx", {
        bookType: "xlsx",
        bookSST: false,
        type: "file",
      });
    },
    close(val) {
      this.view = "table";
      this.pageModel.index = 1;
      if (val == "refresh") {
        this.pageModel.langId = "";
        this.pageModel.airportId = "";
        this.pageModel.airlineId = "";
        this.getpage();
      } else if (val == "airport") {
        this.getAllassit();
      }
    },
    //添加航空公司
    addaviation() {
      if (this.pageModel.langId == "") return this.$error(this.$t("toAirport.selectlanguae"));
      if (this.pageModel.airportId == "") return this.$error(this.$t("toAirport.selectairline"));
      this.fullscreenLoading = true;
      let lang = this.langList.find((i) => i.id == this.pageModel.langId);
      this.getexcairline(1, {
        airportId: this.pageModel.airportId,
        langId: lang.langId,
        hotelId: env.hotelId,
      });
    },
    //航空公司编辑
    async getexcairline(idx, row) {
      // return;
      Axios.all([
        toAirportListApi.getExcAirline({
          airportId: row.airportId,
          langId: row.langId,
        }),
        toAirportListApi.getIncAirline({
          airportId: row.airportId,
          langId: row.langId,
        }),
      ])
        .then(
          Axios.spread((all, residuce) => {
            this.aviationAll = all;
            this.residuceList = residuce.filter((i) => i !== null);
            this.avatitonson = {
              hotelId: row.hotelId,
              airportId: row.airportId,
              langId: row.langId,
            };
            this.fullscreenLoading = false;
            this.view = "list";
          })
        )
        .catch((err) => {
          this.$message.error(this.$t("confirm.filed"));
        });
    },
    // 编辑页面
    editEvery(idx, row) {
      let arr = [];
      if (row.icon !== "") {
        arr.push({
          name: "icon",
          url: row.icon,
        });
      }
      this.formData = { ...row, fileList: arr };
      this.view = "form";
    },
    handleCurrentChange(val) {
      this.pageModel.index = val;
      this.pageModel.offset = (this.pageModel.index - 1) * this.pageModel.limit;
      this.getpage();
    },
    handleSizeChange(val) {
      this.pageModel.limit = val;
      this.getpage();
    },
    //获取table的数据
    getpage() {
      this.pageModel.index = 1;
      let data = JSON.parse(JSON.stringify(this.pageModel));
      delete data.index;
      if (data.langId == "") {
        delete data.langId;
      } else {
        let lang = this.langList.find((i) => i.id == this.pageModel.langId);
        data.langId = lang.langId.toString();
      }
      if (data.langId == "") delete data.langId;
      if (data.airportId == "") delete data.airportId;
      if (data.airlineId == "") delete data.airlineId;
      toAirportListApi
        .getByPage(data)
        .then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
          let num = Number(Math.ceil(res.total / 10) + "0");
          if (this.pageSizes.findIndex((i) => i == num) == -1 && num != 0) {
            this.pageSizes.push(num);
          }
        })
        .catch((err) => {
          this.tableData = [];
          this.$message.error(this.$t("confirm.filed"));
        });
    },
    getAllassit() {
      Axios.all([
        toAirportListApi.hotelLang(),
        toAirportListApi.getInclude(),
        toAirportListApi.airline(),
      ])
        .then(
          Axios.spread((lang, include, airline) => {
            this.langList = lang.map((i) => {
              return { ...i, langId: i.langId };
            });
            this.includelist = include !== null ? include.list : [];
            this.airlineList = airline.map((i) => i.airline);
          })
        )
        .catch((err) => {
          this.$message.error(this.$t("confirm.filed"));
        });
    },
    delAll() {
      if (this.select.length == 0) return this.$error(this.$t("toAirport.selectlanguae"));
      this.$confirm(this.$t("confirm.hint"), this.$t("toAirport.Areselecteddata")).then((res) => {
        if (res) {
          toAirportListApi
            .batchDel(this.select.map((i) => i.id))
            .then(() => {
              this.getpage();
              this.$message.success(this.$t("confirm.delSuccess"));
            })
            .catch((err) => {
              this.$message.error(err);
            });
        }
      });
    },
    delete(idx, row) {
      this.$confirm(
        this.$t("toAirport.conifirmdel").replace("x", row.id),
        this.$t("confirm.hint"),
        { type: "warning" }
      ).then((res) => {
        if (res) {
          toAirportListApi
            .deleteById(row.id)
            .then((d) => {
              if (this.tableData.length - 1 == 0) {
                this.pageModel.offset = this.pageModel.offset - this.pageModel.limit;
              }

              this.getpage();
              this.$message.success(this.$t("confirm.delSuccess"));
            })
            .catch((err) => {
              this.$message.error(this.$t("confirm.filed"));
            });
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
