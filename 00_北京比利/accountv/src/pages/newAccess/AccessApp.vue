<template>
  <div class="padding">
    <el-table
      ref="table"
      :data="accessList"
      border
      style="width: 100%; margin-bottom: 10px"
    >
      <el-table-column
        prop="managerName"
        :label="$t('access.managerName')"
        width="200"
      >
      </el-table-column>
      <el-table-column prop="accessUrl" :label="$t('access.accessUrl')">
      </el-table-column>
      <el-table-column
        prop="accessTime"
        :label="$t('access.accessTime')"
        width="300"
      >
        <template #default="{row}">
          {{ row.accessTime | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column
        prop="isPassed"
        :label="$t('access.isPassed')"
        width="200"
      >
        <template #default="{row}">
          {{ row.isPassed === 1 ? $t("access.yes") : $t("access.no") }}
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <div>
        {{ $t("common.footMsg") }}{{ currentPage * pageSize - pageSize + 1
        }}{{ $t("common.footMsg0")
        }}{{ total &lt; currentPage * pageSize ? total : currentPage * pageSize

        }}{{ $t("common.footMsg1") }}，{{ $t("common.footTotal") }}{{ total
        }}{{ $t("common.footMsg1") }}
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import AccessApi from "@/api/AccessApi";
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      pageSizes: [5, 10, 20, 30],
      total: 0,
      maxPage: 1,
      accessList: [],
    };
  },
  created() {
    this.getAccess();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAccess();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAccess();
    },
    getAccess() {
      AccessApi.accessByPage(this.currentPage, this.pageSize).then((data) => {
        if (data == null) {
          this.accessList = [];
          return;
        }
        this.total = data.total;
        this.accessList = data.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-table .el-table__cell {
  text-align: center;
}
.block {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  width: 100%;
}
</style>
