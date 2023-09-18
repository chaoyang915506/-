<template>
  <div>
    <div class="mt-2">
      <button
        style=" border: 0;background: 0;"
        @click="$emit('close', 'group')"
      >
        返回</button
      >&nbsp;|&nbsp;<span style="font-weight: 600;"
        >直播回放管理-{{ statusOnup }}</span
      >
    </div>
    <cool-table :columns="columns" :data="gardens" ref="table">
      <button class="btn btn-primary mr-1" @click="pushData">
        确定{{ statusOnup }}
      </button>
    </cool-table>
  </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import PlayBackGroupApi from '@/api/PlayBackGroupApi'
export default {
  props: {
    gardenlist: {
      type: Array,
      default: [],
    },
    gardens: {
      type: Array,
      default: [],
    },
    ids: {
      type: Array,
      default: [],
    },
    limits: {
      type: Array,
      default: [],
    },
    statusOnup: {
      type: String,
      default: '',
    },
  },
  components: {
    CoolTable,
  },
  data() {
    return {
      columns: [
        {
          checkbox: true,
        },
        {
          field: '',
          title: '序号',
          align: 'center',
          formatter: (val, row, idx) => {
            return idx + 1
          },
        },
        {
          field: 'hotelName',
          title: '园区名称',
          align: 'center',
        },
      ],
    }
  },
  methods: {
    pushData() {
      //园区
      let len = this.$refs.table.getSelections()
      if (len.length == 0) return this.$error('请选择园区')
      let arr = []
      len
        .map((i) => i.hotelId)
        .forEach((hotelId) => {
          this.ids.forEach((i, j) => {
            arr.push({
              webcastId: i,
              areaLimit: hotelId,
            })
          })
        })
      if (this.statusOnup == '上线') {
        PlayBackGroupApi.pushData(arr).then((res) => {
          this.$parent.getAllData()
          this.$parent.close()
          this.$emit('close', 'form')
          this.$info('上线成功')
        })
      } else {
        let data
        let dataAll = arr
          .map((idx) => {
            data = this.limits.find((dd) => {
              return (
                dd.webcastId == idx.webcastId && dd.areaLimit == idx.areaLimit
              )
            })
            if (data) {
              return data.id
            }
          })
          .filter((i) => i)
        PlayBackGroupApi.canelpush(dataAll).then((res) => {
          this.$parent.getAllData()
          this.$parent.close()
          this.$emit('close', 'form')
          this.$info('下线成功')
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
