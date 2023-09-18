<template>
  <div>
    <!-- :default-sort="defaultsort" -->
    <el-table @sort-change="handleSortChange" :data="tableData" style="width: 100%" stripe>
      <el-table-column sortable='custom' prop="id" label="ID" width="180">
      </el-table-column>
      <el-table-column sortable prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
    </el-table>
    <br />
    <el-pagination
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      background
      layout="prev, pager, next"
      :total="12"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "CoolEleTable",
  props: {
    datas: {
      type: Array,
      required: true
    },
    pageSize: {
      type: Number,
      required: false,
      default: 5
    },
    total: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      defaultsort: {
        prop: "id",
        order: "descending"
      },
      sortData: []
    };
  },
  methods: {
    handleCurrentChange: function(currentPage) {
      this.tableData = this.sortData.slice(
        (currentPage - 1) * this.pageSize,
        currentPage * this.pageSize
      );
      this.currentPage = currentPage;
    },
    handleSortChange: function(obj) {
      if (obj.order === "ascending") this.ascSort(obj.prop);
      if (obj.order === "descending") this.descSort(obj.prop);
      if (obj.order === null) this.noSort();
    },
    ascSort: function(key) {
      this.sortData = this.datas.sort((a, b) => {
        return a.id - b.id;
      });
      this.handleCurrentChange(1);
    },
    descSort: function(key) {
      this.sortData = this.datas.sort((a, b) => {
        return b.id - a.id;
      });
      this.handleCurrentChange(1);
    },
    noSort: function() {
      this.sortData = this.datas;
      this.handleCurrentChange(1);
    },
    handleSortMethod: function() {
      // return false;
    }
  },
  mounted() {
    this.sortData = this.datas;
    this.handleCurrentChange(1);
  }
};
</script>
