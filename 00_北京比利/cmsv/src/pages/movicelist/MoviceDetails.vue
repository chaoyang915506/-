<template>
  <cool-modal
    :visible="issueNow"
    title="下发状态查看"
    @hidden="closeIsuNow"
    class="uplookstate"
    style="heigth:100%"
  >
    <div class="table-responsive" style="height:100%">
      <table class="table table-bordered table-style " style="width:100%">
        <tbody>
          <tr>
            <!-- <td class="tdStyle"></td> -->
            <th id="lineTd" style="width:20%;">
              <span style="float:left;margin-top:20px;">电影名称</span>
              <span style="float:right;margin-top:-10px;"
                >{{ vendor }}名称</span
              >
            </th>
            <th v-for="(item, index) in hotelAray" :key="index" class="tdStyle">
              {{ getHotel(item) }}
            </th>
          </tr>

          <tr v-for="(item, index) in seledlenth" :key="item.hotelId">
            <th style="width:20%;">
              {{
                item.styleDescs.length > 0 ? item.styleDescs[0].name : item.name
              }}
            </th>
            <template v-for="(idx, j) in hotelAray">
              <td v-if="getState(j, item.id) == -1" class="tdStyle">
                <button class="btn">
                  {{ getState(j, item.id) == -1 ? '下发中' : '' }}
                </button>
              </td>
              <td v-if="getState(j, item.id) == 0" class="tdStyle">
                <button class="btn" style="color:green">
                  {{ getState(j, item.id) == 0 ? '已完成' : '' }}
                </button>
              </td>
              <td v-if="getState(j, item.id) == 99" class="tdStyle">
                <button class="btn">
                  {{ getState(j, item.id) == 99 ? '未下发' : '' }}
                </button>
              </td>
              <td
                class="tdStyle"
                v-if="
                  getState(j, item.id) !== '99' &&
                    getState(j, item.id) !== 0 &&
                    getState(j, item.id) !== -1
                "
              >
                <button
                  class="btn"
                  style="color:red"
                  @click="delHotel(j, item)"
                >
                  删除酒店
                </button>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
    <template #footer>
      <button class="btn btn-dark" @click="closeIsuNow">确定</button>
    </template>
  </cool-modal>
</template>

<script>
import CoolModal from '@/components/CoolModal.vue'
import MoviceListApi from '@/api/MoviceListApi'
import env from '@/env'
export default {
  props: {
    //酒店电影版权分组
    hotelAray: {
      type: Array,
      default: () => [],
    },
    issueNow: {
      type: Boolean,
      default: false,
    },
    //全部的酒店
    AllhotelList: {
      type: Array,
      default: () => [],
    },
    //查看下发状态的影片
    moviceListState: {
      type: Array,
      default: () => [],
    },
    seledlenth: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      vendor: env.vendor,
      data: [],
    }
  },
  computed: {
    getHotel() {
      return function(val) {
        let data = this.AllhotelList.find((item) => item.hotelId == val)
        // console.log(data, 'data')
        if (data) {
          return data.hotelName
        } else {
          return '-'
        }
      }
    },
  },
  methods: {
    getState(index, mediaId) {
      let red = this.moviceListState.find(
        (item) => item.oriId == mediaId && this.hotelAray[index] == item.hotelId
      )
      if (red) {
        // console.log(red.status, ':找到了')
        return red.status
      } else {
        return '99'
      }
    },
    // 上传失败后出现删除酒店
    async delHotel(index, item) {
      // console.log(id,'item');
      let data = this.moviceListState.find(
        (i) => i.oriId == item.id && i.hotelId == this.hotelAray[index]
      )
      // console.log(data,'data');
      // return
      try {
        const res = await this.$confirm('提示', `确定删除此${env.vendor}?`)
        if (!res) return
        await MoviceListApi.deleteHotelasyc(data.id)
        await this.$emit('closeIsuNow')
        await this.$emit('getiusee')
        await this.$info('删除成功')
        await this.$emit('refresh')
      } catch (error) {
        this.$error(error)
      }
    },
    closeIsuNow() {
      this.$emit('closeIsuNow', false)
    },
  },
  components: {
    CoolModal,
  },
}
</script>

<style lang="scss" scoped>
::v-deep .table {
  text-align: center;
}
::v-deep .modal-dialog .modal-xl {
  height: 100%;
}
::v-deep .modal.show .modal-dialog {
  height: 100%;
}
::v-deep .modal-content {
  // height: 80%;
  // min-width: 1%;
  min-height: 10%;
  max-height: 90%;
}
::v-deep  .modal-body {
  height: 100%;
  overflow: auto;
}
::v-deep .tdStyle {
  min-width: 200px;
}
#lineTd {
  background: #fff
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxsaW5lIHgxPSIwIiB5MT0iMCIgeDI9IjEwMCUiIHkyPSIxMDAlIiBzdHJva2U9IiNkZWUyZTYiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==)
    no-repeat 100% center;
}
</style>
