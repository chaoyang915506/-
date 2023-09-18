<template>
  <div>
    <table>
      <tr>
        <th>型号</th>
        <th>返港预测</th>
        <th>部署预测</th>
        <th>维修预测</th>
      </tr>
      <tr v-for="(i, j) in table" :key="j">
        <td>{{ i.name ? i.name : "" }}</td>
        <td>{{ i.fangang ? i.fangang : "" }}</td>
        <td>{{ i.bushu ? i.bushu : "" }}</td>
        <td>{{ i.weixiu ? i.weixiu : "" }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    chartData: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    table() {
      // console.log(this.chartData, "red");
      return this.chartData.filter((i) => i);
    },
  },
};
</script>


<style lang="scss" scoped>
::v-deep .table_id {
  background-color: #2f3a59;
}
::v-deep tr,
td {
  background-color: #2f3a59;
  color: #fff;
}
::v-deep tr:hover,
td:hover {
  background-color: #2f3a59;
  color: #fff;
}
.el-table__body tr:hover > td {
  background-color: red !important;
}
.taldfsf {
  background-color: #2f3a59;
}
table {
  width: 100%;
  text-align: center;
}
td,
th {
  height: 50px;
}
th {
  font-weight: 700;
}
</style>