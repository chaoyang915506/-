<template>
  <div class="checks">
    <div v-for="(item, idx) in lists" :key="idx">
      <el-checkbox @change="$emit('hookRefreshLang')" v-model="item.status">{{ item.langDesc }}</el-checkbox>
    </div>
  </div>
</template>
<script>
export default {
  name: "MultipleLang",
  props: {
    lists: {
      type: Array,
      required: true,
      default: [],
    },
  },
  methods: {
    changes(val) {
      console.log(val);
    },
  },
};
</script>

<style scoped lang="scss">
$bg: #f7f9fc;

.checks {
  width: 600px;
  height: 60px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  background: $bg;
  margin-top: 40px;
  padding-top: 5px;
  div {
    min-width: 60px;
    padding: 0 5px 0 5px;
    height: 30px;
  }
}
</style>
