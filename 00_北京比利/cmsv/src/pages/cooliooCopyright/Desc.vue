<template>
  <div class="desc">
    <el-row>
      <el-col :span="6">
        <div style="height: 40px; line-height: 40px">{{ info.langLabel }}名称</div>
      </el-col>
      <el-col :span="14">
        <el-input v-model="info.name"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <div style="height: 40px; line-height: 40px">{{ info.langLabel }}介绍</div>
      </el-col>
      <el-col :span="14">
        <el-input v-model="info.desc" type="textarea" :rows="4"></el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Descs",
  props: {
    info: {},
  },
};
</script>

<style scoped>
.desc {
  width: 400px;
  height: 200px;
  background-color: #EBEEF5;
  padding: 20px 0 0 20px;
  margin-left: 20px;
}
.el-row {
  margin-top: 20px;
}
</style>
