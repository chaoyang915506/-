<template>
  <div class="container">
    <div class="row">
      <h3>{{ $t("device.create.title") }}</h3>
    </div>
    <form @submit.prevent="send">
      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-left">{{ $t("device.create.id") }}</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" :value="info.deviceId" disabled />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-left">{{ $t("device.create.serial") }}</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" :value="info.deviceSerial" disabled />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-left">{{ $t("device.create.room") }}</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" :value="info.roomId" disabled />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-left">{{ $t("device.create.version") }}</label>
        <div class="col-sm-8">
          <cool-input
            ref="i1"
            v-if="info"
            v-model="info.devVerNum"
            :required="true"
            :tips="$t('device.create.emptytips')"
            :placeholder="$t('device.create.placeholder')"
          ></cool-input>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-left">{{ $t("device.create.info") }}</label>
        <div class="col-sm-8">
          <cool-input
            ref="i2"
            v-model="info.devLocation"
            :required="true"
            :tips="$t('device.create.limitNumber')"
            :placeholder="$t('device.create.placeholder')"
            rules="limitNumber"
          ></cool-input>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-left">{{ $t("device.create.ip") }}</label>
        <div class="col-sm-8">
          <cool-input
            ref="i3"
            v-model="info.ipaddress"
            :required="true"
            rules="ip"
            :tips="$t('device.create.illegaltips')"
            :placeholder="$t('device.create.placeholder')"
          ></cool-input>
          <!-- <input placeholder="必填" type="text" class="form-control" v-model="ipaddress" /> -->
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-left">{{ $t("device.create.mask") }}</label>
        <div class="col-sm-8">
          <cool-input
            ref="i4"
            v-model="info.netMask"
            :required="true"
            rules="ip"
            :tips="$t('device.create.illegaltips')"
            :placeholder="$t('device.create.placeholder')"
          ></cool-input>
          <!-- <input placeholder="必填" type="text" class="form-control" v-model="netMask" /> -->
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-left">{{ $t("device.create.gateway") }}</label>
        <div class="col-sm-8">
          <cool-input
            ref="i5"
            v-model="info.gateWay"
            :required="true"
            rules="ip"
            :tips="$t('device.create.illegaltips')"
            :placeholder="$t('device.create.placeholder')"
          ></cool-input>
          <!-- <input placeholder="必填" type="text" class="form-control" v-model="gateWay" /> -->
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-left">{{ $t("device.create.dns") }}</label>
        <div class="col-sm-8">
          <cool-input
            ref="i6"
            v-model="info.dns1"
            :required="true"
            rules="ip"
            :tips="$t('device.create.illegaltips')"
            :placeholder="$t('device.create.placeholder')"
          ></cool-input>
          <!-- <input placeholder="必填" type="text" class="form-control" v-model="dns1" /> -->
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-left">{{ $t("device.create.mac") }}</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" v-model="info.mac" />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-left">{{ $t("device.create.type") }}</label>
        <div class="col-sm-8">
          <cool-slot-select
            ref="s2"
            v-if="info.deviceId"
            :defaultValue="info.deviceType"
            v-model="info.deviceType"
            :liveSearch="true"
            btnStyle="btn btn-secondary"
          >
            <option v-for="(item, idx) in typelists" :key="idx" :value="item.id">
              {{ item.name }}
            </option>
          </cool-slot-select>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-left">{{ $t("device.create.protocol") }}</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" v-model="info.serialProtocol" />
        </div>
      </div>

      <div class="form-group row">
        <div class="col-sm-8"></div>
        <div class="col-sm-4">
          <button type="submit" class="btn btn-primary">{{ $t("device.create.btn3") }}</button>
          &nbsp;&nbsp;
          <button @click="goback" class="btn btn-secondary">{{ $t("device.create.btn2") }}</button>
        </div>
      </div>
    </form>
    <cool-loading :loading="loading" />
  </div>
</template>

<script>
import CoolSlotSelect from "@/components/CoolSlotSelect.vue";
import CoolInput from "@/components/CoolInput.vue";
import Device from "@/api/Device";
import env from "@/env";
import swal from "@/plugins/sweetalert";
import CoolLoading from "@/components/CoolLoading.vue";

export default {
  components: { CoolSlotSelect, CoolInput, CoolLoading },
  name: "Add",
  data() {
    return {
      loading: false,
      roomlists: [],
      typelists: [],
      disabled: true,
      info: {}
    };
  },
  methods: {
    init: async function() {
      try {
        this.roomlists = await Device.getRoomlist(env.token, env.hotelId);
        this.typelists = await Device.getTypelist(env.token, env.hotelId);
        this.info = await Device.getDeviceInfo(env.token, env.hotelId, this.$route.query.id);
      } catch (e) {
        swal.error(e);
      }
    },
    goback: function() {
      this.$router.push({
        path: "/cmsv/device/index.html",
        query: {
          token: env.token,
          hotelId: env.hotelId,
          locale: env.locale
        }
      });
    },

    handleAfterValid: function(val) {
      swal.error(val);
    },
    send: async function() {
      let params = {
        hotelId: env.hotelId,
        deviceId: this.info.deviceId,
        deviceSerial: this.info.deviceSerial, // 设备序列号 必填
        devLocation: this.info.devLocation, // 设备相关信息 必填
        roomId: this.info.roomId, // 房间号 必填
        devVerNum: this.info.devVerNum, // 当前版本 必填
        ipaddress: this.info.ipaddress, // 必填
        netMask: this.info.netMask, // 必填
        gateWay: this.info.gateWay, // 必填
        dns1: this.info.dns1, // 必填
        mac: this.info.mac,
        deviceType: this.info.deviceType, // 必填
        serialProtocol: this.info.serialProtocol
      };
      let flag = false;
      if (this.info.devVerNum === "") {
        this.$refs.i1.handleChange();
        flag = true;
      }
      if (this.info.devLocation === "") {
        this.$refs.i2.handleChange();
        flag = true;
      }

      if (this.info.ipaddress === "") {
        this.$refs.i3.handleChange();
        flag = true;
      }
      if (this.info.netMask === "") {
        this.$refs.i4.handleChange();
        flag = true;
      }
      if (this.info.gateWay === "") {
        this.$refs.i5.handleChange();
        flag = true;
      }
      if (this.info.dns1 === "") {
        this.$refs.i6.handleChange();
        flag = true;
      }
      // if (this.info.deviceType === "") {
      //   this.$refs.s2.handleValid();
      //   flag = true;
      // }

      if (flag) return false;
      try {
        this.loading = true;
        await Device.updateDevice(env.token, env.hotelId, params);
        let _this = this;
        swal.info(this.$t("device.create.editaction")).then(function() {
          _this.goback(); // fix 118
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
        swal.error(e);
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped>
.row {
  margin-top: 15px;
}
</style>
