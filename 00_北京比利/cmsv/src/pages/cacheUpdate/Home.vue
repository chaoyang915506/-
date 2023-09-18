<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-2"></div>
      <div class="col-md-6">
        <div class="form-group row">
          <h1>缓存更新工具</h1>
        </div>
        <hr />

        <div class="form-group row">
          <label for="inputEmail3" class="col-sm-4 col-form-label text-right"
            >缓存更新类型</label
          >
          <div class="col-sm-6">
            <cool-select
              v-model="type"
              :opts="typelists"
              :liveSearch="true"
              defaultValue="0"
            ></cool-select>
          </div>
        </div>

        <div class="form-group row">
          <label for="inputEmail3" class="col-sm-4 col-form-label text-right"
            >酒店名称</label
          >
          <div class="col-sm-6">
            <cool-select
              v-model="hotel"
              :opts="hotellists"
              :liveSearch="true"
              :disabled="hoteldisabled"
              :defaultValue="defaultHotel"
            ></cool-select>
          </div>
        </div>

        <div class="form-group row">
          <label for="inputEmail3" class="col-sm-4 col-form-label text-right"
            >模块名称</label
          >
          <div class="col-sm-6">
            <cool-select
              v-model="module"
              :opts="modulelists"
              :liveSearch="true"
              :disabled="moduledisabled"
              :defaultValue="defaultModule"
            ></cool-select>
          </div>
        </div>

        <div class="form-group row">
          <label for="inputEmail3" class="col-sm-4 col-form-label text-right"
            >更新结果</label
          >
          <div class="col-sm-6">
            <textarea
              v-model="info"
              disabled
              class="form-control"
              rows="8"
            ></textarea>
          </div>
        </div>

        <div class="row form-group">
          <div class="col-sm-8"></div>
          <div class="col-sm-3">
            <button
              :disabled="disabled"
              @click="updateCache"
              class="btn btn-primary"
            >
              更新缓存
            </button>
          </div>
        </div>
      </div>
    </div>
    <cool-loading :loading="loading"></cool-loading>
  </div>
</template>

<script>
import CoolSelect from "@/components/CoolSelect.vue";
import BasicSystem from "@/api/BasicSystem";
import env from "@/env";
import swal from "@/plugins/sweetalert";
import CoolLoading from "@/components/CoolLoading.vue";

export default {
  name: "Home",
  data() {
    return {
      typelists: [
        { value: 0, option: "更新指定酒店、模块缓存" },
        { value: 1, option: "更新所有酒店指定模块缓存" },
        { value: 2, option: "更新指定酒店所有模块缓存" },
      ],
      hotellists: [],
      modulelists: [],
      hotel: "",
      module: "",
      type: "0",
      info: "",
      loading: false,
      disabled: false,
      hoteldisabled: false,
      moduledisabled: false,
      defaultHotel: "5",
      defaultModule: "init",
    };
  },
  components: {
    CoolSelect,
    CoolLoading,
  },
  methods: {
    init: async function() {
      try {
        let hotels = [];
        let datas = await BasicSystem.getHotels(env.token);
        if (Array.isArray(datas)) {
          datas.forEach(function(item) {
            let node = {
              value: item.hotelId,
              option: item.hotelName,
            };
            hotels.push(node);
          });
        }
        this.hotellists = hotels;
        this.hotel = this.defaultHotel = hotels[0]["value"] + "";

        let modules = [];
        let apiModules = await BasicSystem.getModules(env.token);
        if (Array.isArray(apiModules.list)) {
          apiModules.list.forEach(function(item) {
            let node = {
              value: item.module,
              option: item.desc,
            };
            modules.push(node);
          });
        }
        this.modulelists = modules;
        this.module = this.defaultModule = modules[0]['value'];
      } catch (e) {
        swal.error(e);
      }
    },
    updateCache: async function() {
      this.loading = true;
      this.disabled = true;
      try {
        this.info = "正在更新缓存...\r\n";
        let res = "";
        console.log(this.type, typeof this.type)
        if (this.type === "0") {
          res = await BasicSystem.updateOne(env.token, this.module, this.hotel);
        }

        if (this.type === "1") {
          res = await BasicSystem.updateAll(env.token, this.module);
        }

        if (this.type === "2") {
          res = await BasicSystem.updateOneHotelAllModule(
            env.token,
            this.hotel
          );
        }

        this.info += res;
      } catch (e) {
        swal.error(e);
      }
      this.loading = false;
      this.disabled = false;
    },
  },
  watch: {
    type: function(val) {
      if (val === "0") {
        this.hoteldisabled = false;
        this.moduledisabled = false;
      }

      if (val === "1") {
        this.hoteldisabled = true;
        this.moduledisabled = false;
      }

      if (val === "2") {
        this.hoteldisabled = false;
        this.moduledisabled = true;
      }
    },
  },
  mounted() {
    this.init();
  },
};
</script>
