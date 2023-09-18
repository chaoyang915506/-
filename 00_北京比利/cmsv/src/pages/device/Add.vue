<template>
  <div class="container">
    <div class="row">
      <h3>{{ $t("device.create.title") }}</h3>
    </div>
    <form @submit.prevent="send">
      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-left">{{ $t("device.create.serial") }}</label>
        <div class="col-sm-8">
          <cool-input
            v-model="deviceSerial"
            :required="true"
            :tips="$t('device.create.emptytips')"
            :placeholder="$t('device.create.placeholder')"
          ></cool-input>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-left">{{ $t("device.create.room") }}</label>
        <div class="col-sm-8">
          <cool-slot-select
            ref="s1"
            v-if="roomlists.length"
            v-model="roomId"
            :liveSearch="true"
            btnStyle="btn btn-secondary"
            :title="$t('device.create.selecttips')"
          >
            <option v-for="(item, idx) in roomlists" :key="idx" :value="item.roomId">
              {{ item.roomNumber }}
            </option>
          </cool-slot-select>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-left">{{ $t("device.create.version") }}</label>
        <div class="col-sm-8">
          <cool-input
            ref="i1"
            v-model="devVerNum"
            :required="true"
            :tips="$t('device.create.emptytips')"
            :placeholder="$t('device.create.placeholder')"
          ></cool-input>
          <!-- <input placeholder="必填" type="text" class="form-control" v-model="devVerNum" /> -->
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-left">{{ $t("device.create.info") }}</label>
        <div class="col-sm-8">
          <cool-input
            ref="i2"
            v-model="devLocation"
            :required="true"
            :tips="$t('device.create.limitNumber')"
            :placeholder="$t('device.create.placeholder')"
            rules="limitNumber"
          ></cool-input>
          <!-- <input placeholder="必填" type="text" class="form-control" v-model="devLocation" /> -->
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-left">{{ $t("device.create.ip") }}</label>
        <div class="col-sm-8">
          <cool-input
            ref="i3"
            v-model="ipaddress"
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
            v-model="netMask"
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
            v-model="gateWay"
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
            v-model="dns1"
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
          <input type="text" class="form-control" v-model="mac" />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-left">{{ $t("device.create.type") }}</label>
        <div class="col-sm-8">
          <cool-slot-select
            ref="s2"
            v-if="typelists.length"
            v-model="deviceType"
            :liveSearch="true"
            btnStyle="btn btn-secondary"
            :title="$t('device.create.selecttips')"
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
          <input type="text" class="form-control" v-model="serialProtocol" />
        </div>
      </div>

      <div class="form-group row">
        <div class="col-sm-8"></div>
        <div class="col-sm-4">
          <button :disabled="disabled" type="submit" class="btn btn-primary">
            {{ $t("device.create.btn1") }}
          </button>
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
      deviceSerial: "", // 设备序列号
      devLocation: "", // 设备相关信息
      roomId: "", // 房间号
      devVerNum: "", // 当前版本
      ipaddress: "",
      netMask: "",
      gateWay: "",
      dns1: "",
      mac: "",
      deviceType: "",
      serialProtocol: "",
      isSubmit: 0,
      disabled: true
    };
  },
  methods: {
    init: async function() {
      try {
        this.roomlists = await Device.getRoomlist(env.token, env.hotelId);
        this.typelists = await Device.getTypelist(env.token, env.hotelId);
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
    send: async function() {
      let params = {
        hotelId: env.hotelId,
        deviceSerial: this.deviceSerial, // 设备序列号 必填
        devLocation: this.devLocation, // 设备相关信息 必填
        roomId: this.roomId, // 房间号 必填
        devVerNum: this.devVerNum, // 当前版本 必填
        ipaddress: this.ipaddress, // 必填
        netMask: this.netMask, // 必填
        gateWay: this.gateWay, // 必填
        dns1: this.dns1, // 必填
        mac: this.mac,
        deviceType: this.deviceType, // 必填
        serialProtocol: this.serialProtocol
      };
      let flag = false;
      if (this.roomId === "") {
        this.$refs.s1.handleValid();
        flag = true;
      }
      if (this.devVerNum === "") {
        this.$refs.i1.handleChange();
        flag = true;
      }
      if (this.devLocation === "") {
        this.$refs.i2.handleChange();
        flag = true;
      }
      if (this.ipaddress === "") {
        this.$refs.i3.handleChange();
        flag = true;
      }
      if (this.netMask === "") {
        this.$refs.i4.handleChange();
        flag = true;
      }
      if (this.gateWay === "") {
        this.$refs.i5.handleChange();
        flag = true;
      }
      if (this.dns1 === "") {
        this.$refs.i6.handleChange();
        flag = true;
      }
      if (this.deviceType === "") {
        this.$refs.s2.handleValid();
        flag = true;
      }
      if (flag) return false;
      try {
        this.loading = true;
        await Device.add(env.token, env.hotelId, params);
        let _this = this;
        swal.info(this.$t("device.create.addaction")).then(function() {
          _this.goback(); // fix 115
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
        swal.error(e);
      }
    },
    handleAfterValid: function(val) {
      swal.error(val);
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    deviceSerial: function() {
      if (this.deviceSerial.length > 0) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    roomId: function(val) {
      this.$refs.s1.refresh(val);
    },
    deviceType: function(val) {
      this.$refs.s2.refresh(val);
    }
  }
};
</script>

<style scoped>
.row {
  margin-top: 15px;
}
</style>
