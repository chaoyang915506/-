<template>
  <Transfer
    :data="transferData"
    :filterable="true"
    :titles="['待选择', '已选择']"
    filter-placeholder="请输入房间号"
    :value="value"
    @change="onchange"
  />
</template>

<script>
import { Transfer } from 'element-ui'
import { mapState } from 'vuex'
import 'element-ui/lib/theme-chalk/index.css';
export default {
  name: 'PickRooms',
  components: { Transfer },
  props: {
    value: Array,
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(['rooms']),
    transferData() {
      return this.rooms.map((room) => {
        return { key: room.roomId, label: room.roomNumber, disabled: false }
      })
    },
  },
  methods: {
    onchange(value) {
      this.$emit('input', value)
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .el-transfer-panel {
  width: 38%;
}
::v-deep .el-checkbox__inner {
  visibility: hidden;
}
::v-deep .el-checkbox__original {
  opacity: 1;
  outline: 0;
  position: absolute;
  margin: 0;
  width: 100%;
  left: 0;
  height: 100%;
  z-index: 1;
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #616367;
}
::v-deep .el-transfer-panel__item:hover {
  color: #616367;
}
::v-deep .el-transfer-panel__filter .el-input__inner {
  border-radius: 6px;
}
::v-deep  .el-input__inner:focus {
  border-color: #80bdff;
  outline: 0;
//   box-shadow: 0 0 0 0.2rem rgb(0 123 255/25%);
// box-shadow: 0 0 0 0.2rem ;
}
::v-deep td{
    min-width: 300px;
}
</style>
