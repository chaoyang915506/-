<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>视频版权管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="cpbody">
      <el-row>
        <el-col :span="2">版权名称</el-col>
        <el-col :span="4">
          <el-input></el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          <el-button>创建版权</el-button>
        </el-col>
        <el-col :span="20" class="actions">
          <el-button type="primary">批量上线Coolioo</el-button>
          <el-button type="primary">批量下线Coolioo</el-button>
          <el-button type="primary">导出</el-button>
        </el-col>
      </el-row>
      <div class="h20"></div>
      <el-table
        :header-cell-style="{ background: '#F7F9FC' }"
        :row-style="{ height: '60px' }"
        :data="tabledata"
        border
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column align="center" prop="date" label="日期" width="180"> </el-table-column>
        <el-table-column align="center" prop="name" label="姓名" width="180"> </el-table-column>
        <el-table-column align="center" prop="address" label="地址"> </el-table-column>
      </el-table>

      <div class="blocks">
        <el-pagination background layout="total, sizes, prev, pager, next" :total="10">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Copyright",
  data() {
    return {
      tabledata: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ]
    };
  }
};
</script>

<style scoped lang="scss">
.cpbody {
  width: 100%;
  padding: 20px;
  background-color: #ffffff;
  margin-top: 40px;
}
.el-row {
  margin-top: 20px;
}
.actions {
  text-align: right;
}
.h20 {
  width: 100%;
  height: 20px;
}
.blocks {
  width: 100%;
  text-align: right;
  margin-top: 40px;
}
</style>
