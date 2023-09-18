<template>
  <div>
    <div v-if="view == 'table'">
      <el-card shadow="always" :body-style="{ padding: '20px' }" style="margin-bottom: 1%">
        <div slot="header">
          <span>{{ $t("confirm.screeningCondition") }}</span>
        </div>
        <el-form ref="form" :model="pageModel" label-width="40%">
          <el-row :gutter="24">
            <el-col :span="7">
              <el-form-item :label="$t('QueryTemplates.templateid')">
                <el-input
                  v-model="pageModel.templateId"
                  placeholder="templateIdSearch"
                  size="normal"
                  clearable
                  type="number"
                  @change="getAlltemplate"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('QueryTemplates.templatename')">
                <el-input
                  v-model="pageModel.templateName"
                  placeholder="templateNameSearch"
                  clearable
                  @change="getAlltemplate"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-button type="primary" size="default" @click="getAlltemplate">{{
                $t("confirm.inquire")
              }}</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <el-button type="primary" size="medium" @click="add">{{ $t("confirm.add") }}</el-button>
        <!-- <el-button type="primary" size="medium" @click="deleteAll">{{ -->
        <!-- $t("confirm.delete")
        }}</el-button> -->
        <el-button
          type="primary"
          size="medium"
          @click="
            () => {
              tableList = [];
              getAlltemplate();
            }
          "
          >{{ $t("confirm.refresh") }}</el-button
        >
        <cool-element-table
          :pageSize="pageModel.limit"
          :tableData="tableData"
          :total="pageModel.total"
          :tableColumns="tableColumns"
          :pageIndex="pageModel.index"
          :operations="operations"
          :objcontent="objcontent"
          :pageSizes="pageSizes"
          @handleCurrentChange="(val) => (pageModel.index = val)"
          @handleSelectionChange="(val) => (select = val)"
          @handleSizeChange="(val) => (pageModel.limit = val)"
        ></cool-element-table>
      </el-card>
    </div>
    <query-templates-from
      v-if="view == 'form'"
      @close="close"
      :editData="editData"
      style="margin-top: 4%"
    ></query-templates-from>
  </div>
</template>

<script>
import CoolElementTable from "@/components/CoolElementTable.vue";
import QueryTemplatesApi from "@/api/QueryTemplatesApi";
import QueryTemplatesFrom from "./QueryTemplatesFrom.vue";
class from {
  constructor() {
    this.templateDesc = "";
    this.templateName = "";
    this.configFile = "";
    this.updateId = "-100";
  }
}
export default {
  components: { CoolElementTable, QueryTemplatesFrom },
  data() {
    return {
      view: "table",
      objcontent:{
        border: true,
        stripe: false,
        loading: false,
        changeselect: false,
        number: false,
        size: "mini",
        changeselect: false,
      },
      pageModel: {
        templateId: "",
        templateName: "",
        limit: 10,
        total: 0,
        offset: 0,
        index: 1,
      },
      pageSizes: [10, 20, 30],
      tableList: [],
      select: [],
      tableColumns: [
        {
          prop: "templateId",
          align: "center",
          label: this.$t("QueryTemplates.templateid"),
          slot: true,
          width: 100,
        },
        {
          prop: "templateName",
          align: "center",
          label: this.$t("QueryTemplates.templatename"),
        },
        {
          prop: "templateDesc",
          align: "center",
          label: this.$t("QueryTemplates.templatedesc"),
          width: 300,
          formatter: (row, column) => {
            return `<div class="tdstyle">${row.templateDesc}</div>`;
          },
        },
        {
          prop: "configFile",
          align: "center",
          label: this.$t("QueryTemplates.templatedescdfile"),
          width: 300,
          formatter: (row, column) => {
            return `<div class="tdstyle">${row.configFile}</div>`;
          },
        },
      ],
      editData: new from(),
      operations: {
        width: 100,
        fixed: "right",
        label: this.$t("confirm.operate"),
        align: "center",
        list: [
          {
            label: this.$t("confirm.edit"),
            type: "text",
            disabled: false,
            method: (index, row) => {
              this.editEvery(index, row);
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
        ],
      }, //操作按钮
    };
  },
  computed: {
    tableData() {
      return this.tableList.slice(
        (this.pageModel.index - 1) * this.pageModel.limit,
        this.pageModel.index * this.pageModel.limit
      );
    },
  },
  created() {
    this.getAlltemplate();
  },
  methods: {
    add() {
      this.editData = new from();
      this.view = "form";
    },
    editEvery(i, row) {
      this.view = "form";
      this.editData = row;
    },
    // async deleteAll() {
    //   if (this.select.length == 0) return this.$message.error(this.$t("confirm.delselectdata"));
    //   let res = await this.$confirm(this.$t("confirm.delSelect"), this.$t("confirm.hint"), {
    //     type: "warning",
    //   });
    //   if (!res) return;
    //   await QueryTemplatesApi.deleteTemplate(this.select.map((i) => i.templateId));
    //   this.$message.success(this.$t("confirm.delSuccess"));
    //   await this.getAlltemplate();
    // },
    async delete(index, row) {
      let res = await this.$confirm(this.$t("confirm.delTitle"), this.$t("confirm.hint"), {
        type: "warning",
      });
      if (!res) return;
      try {
        await QueryTemplatesApi.deleteTemplate({ editId: row.templateId });
        this.$message.success(this.$t("confirm.delSuccess"));
        if (this.tableData.length - 1 == 0) {
          this.pageModel.index = this.pageModel.index - 1;
        }
        await this.getAlltemplate();
      } catch (error) {
        this.$message.error(error);
      }
    },
    close(val) {
      this.view = "table";
      if (val == "form") {
        this.getAlltemplate();
      }
    },
    async getAlltemplate() {
      this.pageModel.index = 1;
      let data = JSON.parse(JSON.stringify(this.pageModel));
      // delete data.limit;
      delete data.total;
      await QueryTemplatesApi.getAllTemplate(data)
        .then((res) => {
          if (res.length - this.pageModel.limit == 0) {
            this.pageModel.offset = this.pageModel.offset - this.pageModel.limit;
          }
          this.pageModel.total = res.length;
          this.tableList = res;
        })
        .catch((err) => {
          this.tableList = [];
          this.$message.error(err);
        });
    },
  },
};
</script>

<style lang="postcss" scoped>
::v-deep .tdstyle {
  width: 100%;
  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;
}
</style>
