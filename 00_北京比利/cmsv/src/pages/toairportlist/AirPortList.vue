<template>
  <div>
    <h2>{{ $t("toAirport.listtheairport") }}</h2>
    <el-button class="del" size="medium" @click="deleteAll">{{ $t("confirm.delete") }}</el-button>
    <el-button
      class="add"
      size="medium"
      v-loading.fullscreen.lock="fullscreenLoading"
      @click="manage"
      >{{ $t("toAirport.manage") }}
    </el-button>
    <el-button class="add" size="medium" @click="$emit('close', 'airport')"
      >{{ $t("confirm.return") }}
    </el-button>
    <!-- <el-button class="add" size="medium" @click="$emit('close','refresh')">返回 </el-button> -->
    <CoolElementTable
      :pageSize="pageModel.limit"
      :tableData="tableData"
      :total="total"
      :tableColumns="tableColumns"
      :pageIndex="pageModel.index"
      :operations="operations"
      :pageSizes="pageSizes"
      :objcontent="objcontent"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @handleSelectionChange="(val) => (select = val)"
    />
    <el-dialog
      :title="$t('toAirport.addDelete')"
      :visible.sync="dialogTableVisible"
      :fullscreen="true"
      width="90%"
    >
      <toAirportList
        @close="close"
        :aviationAll="aviationAll"
        :residuceList="residuceList"
        :key="Math.round(Math.random())"
      />
    </el-dialog>
  </div>
</template>

<script>
import CoolElementTable from "@/components/CoolElementTable.vue";
import toAirportListApi from "@/api/toAirportListApi";
import toAirportList from "./toAirportList.vue";
import Axios from "axios";
export default {
  components: {
    CoolElementTable,
    toAirportList,
  },
  data() {
    return {
      fullscreenLoading: false,
      aviationAll: [],
      residuceList: [],
      dialogTableVisible: false,
      select: [],
      pageModel: {
        offset: 0,
        limit: 20,
      },
      objcontent: {
        border: true, //是否带有纵向边框
        stripe: false, // 是否为斑马纹 table
        loading: false, // 是否loading(在加载数据时记得判断是否开启)
        changeselect: true, //是否有前面的多选项
        // number: true, //是否有序号
        // alignindex: 'center',
        alignselect: "center",
      },
      pageSizes: [15, 30, 50, 70],
      total: 0,
      tableColumns: [
        {
          prop: "id",
          align: "center",
          label: "id",
          slot: true,
        },
        {
          prop: "code",
          align: "center",
          label: this.$t("toAirport.code"),
        },
        {
          prop: "name",
          align: "center",
          label: this.$t("toAirport.cnname"),
        },
        {
          prop: "traditionalName",
          align: "center",
          label: this.$t("toAirport.cnfanname"),
        },
        {
          prop: "nameEn",
          align: "center",
          label: this.$t("toAirport.enname"),
        },
        {
          prop: "country",
          align: "center",
          label: this.$t("toAirport.state"),
        },
      ],
      operations: {
        // width: 160,
        // fixed: "right",
        label: "操作",
        align: "center",
        list: [
          {
            label: this.$t("toAirport.del"),
            type: "text",
            // icon: "el-icon-edit",
            disabled: false,
            method: (index, row) => {
              this.delete(index, row);
            },
          },
        ],
      },
      tableData: [],
    };
  },
  created() {
    this.getpage();
  },
  methods: {
    close() {
      this.getpage();
      this.dialogTableVisible = false;
    },
    manage() {
      this.fullscreenLoading = true;
      Axios.all([toAirportListApi.getExclusive(), toAirportListApi.getInclude()])
        .then(
          Axios.spread((res, data) => {
            this.aviationAll = res && res.list ? res.list : res;
            this.residuceList = data && data.list ? data.list : data;
          })
        )
        .then((r) => {
          this.dialogTableVisible = true;
          this.fullscreenLoading = false;
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    delete(i, row) {
      this.$confirm(
        this.$t("toAirport.areyouokairtport").replace("x", row.id),
        this.$t("confirm.hint"),
        {
          type: "warning",
        }
      ).then((res) => {
        if (res) {
          toAirportListApi.dellist(row.id).then((d) => {
            this.getpage();
            this.$message.success(this.$t("confirm.delSuccess"));
          });
        }
      });
    },
    deleteAll() {
      if (this.select.length == 0) return this.$error(this.$t("confirm.deleteData"));
      this.$confirm(this.$t("confirm.hint"), this.$t("toAirport.Areselecteddata")).then((res) => {
        if (res) {
          toAirportListApi.dellistAll(this.select.map((i) => i.id)).then((res) => {
            this.getpage();
            this.$message.success(this.$t("confirm.delSuccess"));
          });
        }
      });
    },
    getpage() {
      toAirportListApi
        .getByPageAirport(this.pageModel)
        .then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
        })
        .catch((err) => {
          console.log(err);
        });
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
  },
};
</script>

<style lang="scss" scoped>
.del:hover {
  color: #fff;
  background-color: #f05656;
}
</style>
