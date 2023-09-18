<template>
  <div style="padding: 8% 1% 1% 1%; height: 100%">
    <div style="text-align: center">
      <el-transfer
        style="
          text-align: left;
          display: flex;
          width: 100%;
          justify-content: center;
          align-items: center;
        "
        v-model="value4"
        filterable
        :titles="[$t('toAirport.unaddedAirlines') + ':', $t('toAirport.airlinesAdded') + ':']"
        :button-texts="[$t('toAirport.Toleft'), $t('toAirport.Toright')]"
        :data="dataevery"
      >
        <span slot-scope="{ option }">{{ option.id }} {{ option.label }}</span>
      </el-transfer>
      <!-- @change="handleChange" -->
    </div>
    <div style="margin-top: 4%; text-align: right; margin-right: 7%">
      <el-button type="primary" size="default" @click="sure">{{ $t("confirm.ok") }}</el-button>
      <el-button type="primary" size="default" @click="$emit('close','airport')">{{
        $t("confirm.return")
      }}</el-button>
    </div>
  </div>
</template>

<script>
import env from "@/env";
import toAirportListApi from "@/api/toAirportListApi";
export default {
  props: {
    aviationAll: {
      type: Array,
      default: [],
    },
    residuceList: {
      type: Array,
      default: [],
    },
    avatitonson: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      value: this.aviationAll.map((i) => i.id),
      value4: this.residuceList.length > 0 ? this.residuceList.map((i) => i.id) : [],
    };
  },
  computed: {
    dataevery() {
      return [...this.aviationAll, ...this.residuceList].map((i) => {
        return {
          key: i.id,
          label: i.name + "|" + i.nameEn,
          disabled: false,
        };
      });
    },
  },
  methods: {
    // handleChange(value, direction, movedKeys) {
    //   console.log(value, direction, movedKeys);
    // },
    sure() {
      let list = this.value4.map((i, j) => {
        if (this.avatitonson !== null) {
          return {
            sort: j + 1,
            airlineId: i,
            hotelId: this.avatitonson.hotelId,
            langId: this.avatitonson.langId,
            airportId: this.avatitonson.airportId,
          };
        } else {
          return {
            sort: j + 1,
            hotelId: env.hotelId,
            airportId: i,
          };
        }
      });
      if (this.avatitonson !== null) {
        toAirportListApi
          .addOrEditAirline({ hotelId: this.avatitonson.hotelId, list: list }, this.avatitonson)
          .then((res) => {
            this.$emit("close", "refresh");
            this.$message.success(this.$t("confirm.success"))
          });
      } else {
        toAirportListApi
          .delAndSave({
            hotelId: env.hotelId,
            list: list,
            oriList: this.residuceList.map((i) => i.id),
          })
          .then((res) => {
            this.$emit("close");
            this.$message.success(this.$t("confirm.success"))
          });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}
::v-deep .el-transfer-panel {
  width: 30%;
}
::v-deep .el-transfer-panel__item.el-checkbox .el-checkbox__label {
  // display: inline-block;
}
::v-deep .el-transfer-panel__body {
  height: 500px;
}
::v-deep .el-transfer-panel__list.is-filterable {
  height: 90%;
}
</style>
