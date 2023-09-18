<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-2"></div>
      <div class="col-md-8">
        <h3>缓存模块控制</h3>
        <br />
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <a
              class="nav-link active"
              id="nav-home-tab"
              data-toggle="tab"
              href="#nav-home"
              role="tab"
              aria-controls="nav-home"
              aria-selected="true"
              @click="reloadHotelPage"
              >按酒店</a
            >
            <a
              class="nav-link"
              id="nav-profile-tab"
              data-toggle="tab"
              href="#nav-profile"
              role="tab"
              aria-controls="nav-profile"
              aria-selected="false"
              @click="reloadModulePage"
              >按模块</a
            >
          </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
          <div
            class="tab-pane fade show active"
            id="nav-home"
            role="tabpanel"
            aria-labelledby="nav-home-tab"
          >
            <div class="row">
              <br />
            </div>

            <div class="form-group row">
              <label class="col-sm-2 col-form-label text-left">酒店名称</label>
              <div style="position: relative;" class="col-sm-4">
                <cool-slot-select
                  v-if="hotellists.length"
                  :defaultValue="defaultHotel"
                  v-model="defaultHotel"
                  :liveSearch="true"
                  :disabled="lock"
                >
                  <option v-for="(item, idx) in hotellists" :key="idx" :value="item.value">
                    {{ item.option }}
                  </option>
                </cool-slot-select>


              </div>
              <div class="col-sm-5">
                <button @click="handleOpen" class="btn btn-primary">全开</button>
                &nbsp;&nbsp;
                <button @click="handleClose" class="btn btn-danger">全关</button>
              </div>
            </div>

            <div class="form-group row">
              <label class="col-sm-2 col-form-label text-left">搜索缓存模块</label>
              <div class="col-sm-4">
                <input type="text" class="form-control" v-model="searchkey" />
              </div>
            </div>

            <div class="row flexbox">
              <div v-for="(item, idx) in statuslists" :key="idx" class="col-md-4">
                <div class="form-group row">
                  <label class="col-sm-6 col-form-label text-left">{{ item.desc }}</label>
                  <div class="col-sm-6">
                    <status-switch
                      @change="handleStatusUpdate"
                      :module="item.module"
                      :idx="idx"
                      :status="item.status"
                    ></status-switch>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="tab-pane fade"
            id="nav-profile"
            role="tabpanel"
            aria-labelledby="nav-profile-tab"
          >
            <div class="row">
              <br />
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label text-left">缓存模块名称</label>
              <div class="col-sm-4">
                <cool-slot-select
                  v-if="modulelists.length"
                  :defaultValue="defaultModule"
                  v-model="defaultModule"
                  :liveSearch="true"
                  :disabled="modulelock"
                >
                  <option v-for="(item, idx) in modulelists" :key="idx" :value="item.value">
                    {{ item.option }}
                  </option>
                </cool-slot-select>
              </div>
              <div class="col-sm-5">
                <button @click="handleModuleOpenall" class="btn btn-primary">全开</button>
                &nbsp;&nbsp;
                <button @click="handleModuleCloseall" class="btn btn-danger">全关</button>
              </div>
            </div>

            <div class="form-group row">
              <label class="col-sm-2 col-form-label text-left">搜索酒店</label>
              <div class="col-sm-4">
                <input type="text" class="form-control" v-model="searchkey2" />
              </div>
            </div>

            <div class="row flexbox">
              <div v-for="(item, idx) in module_statuslists" :key="idx" class="col-md-6">
                <div class="form-group row">
                  <label class="col-sm-8 col-form-label text-left">{{ item.desc }}</label>
                  <div class="col-sm-4">
                    <status-switch
                      @change="handleModuleUpdate"
                      module=""
                      :idx="item.hotelId"
                      :status="item.status"
                    ></status-switch>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row"></div>
    <br />
    <cool-loading :loading="loading" />
  </div>
</template>
<script>
import CoolSelect from "@/components/CoolSelect.vue";
import CoolSlotSelect from "@/components/CoolSlotSelect.vue";
import BasicSystem from "@/api/BasicSystem";
import env from "@/env";
import swal from "@/plugins/sweetalert";
import StatusSwitch from "./StatusSwitch.vue";
import CoolLoading from "@/components/CoolLoading.vue";

export default {
  components: { CoolSelect, StatusSwitch, CoolLoading, CoolSlotSelect },
  name: "Home",
  data() {
    return {
      loading: false,
      hotela: true,
      opts: [],
      hotellists: [],
      modulelists: [],
      statuslists: [],
      defaultHotel: "1",
      defaultModule: "init",
      module_statuslists: [],
      lock: false, // hotel lock
      modulelock: false, // module lock
      searchkey: "",
      searchkey2: "",
      statuslists_bak: [],
      modulelists_bak: [],
      checkDefaultHotel: "1",
      checkDefaultModule: "init"
    };
  },
  methods: {
    reloadHotelPage: async function() {
      this.searchkey = "";
      this.searchkey2 = "";
      this.defaultModule = this.checkDefaultModule;
      this.defaultHotel = this.checkDefaultHotel;
      this.loading = true;
      await this.handleHotelData();
      this.loading = false;
    },
    reloadModulePage: async function() {
      this.searchkey = "";
      this.searchkey2 = "";
      this.defaultModule = this.checkDefaultModule;
      this.defaultHotel = this.checkDefaultHotel;
      this.loading = true;
      await this.handleModuleData();
      this.loading = false;
    },
    init: async function() {
      try {
        let hotels = [];
        let datas = await BasicSystem.getHotels(env.token);
        if (Array.isArray(datas)) {
          datas.forEach(function(item) {
            let node = {
              value: item.hotelId,
              option: item.hotelName
            };
            hotels.push(node);
          });
        }
        this.hotellists = hotels;
        this.defaultHotel = hotels[0]["value"] + "";
        this.checkDefaultHotel = hotels[0]["value"] + "";

        let modules = [];
        let apiModules = await BasicSystem.getModules(env.token);
        // TODO 此处代码待优化
        if (Array.isArray(apiModules.list)) {
          apiModules.list.forEach(function(item) {
            let node = {
              value: item.module,
              option: item.desc
            };
            modules.push(node);
          });
        }
        this.modulelists = modules;

        this.handleHotelData();

        this.handleModuleData();
      } catch (e) {
        swal.error(e);
      }
    },
    handleStatusUpdate: async function(data) {
      // 数据初始化阶段，禁止频繁调用修改接口
      if (this.lock) return;
      await BasicSystem.updateRedisModule(env.token, this.defaultHotel, data.module, data.status);
      // 修改本地数据
      this.statuslists.map(function(item) {
        if (item.module === data.module) {
          item.status = data.status;
        }
      });
      this.statuslists_bak.map(function(item) {
        if (item.module === data.module) {
          item.status = data.status;
        }
      });
    },
    handleModuleUpdate: async function(data) {
      // 数据初始化阶段，禁止频繁调用修改接口
      if (this.modulelock) return;
      await BasicSystem.updateModuleWithHotel(env.token, data.idx, this.defaultModule, data.status);
      // 修改本地数据
      this.module_statuslists.map(function(item) {
        if (item.hotelId === data.idx) {
          item.status = data.status;
        }
      });
      this.module_statuslists_bak.map(function(item) {
        if (item.hotelId === data.idx) {
          item.status = data.status;
        }
      });
    },
    handleOpen: async function() {
      this.loading = true;
      try {
        await BasicSystem.openAll(env.token, this.defaultHotel);
        // this.statuslists = [];
        let apiStatus = await BasicSystem.getModulesStatus(env.token, this.defaultHotel);
        this.statuslists = apiStatus.list;
        swal.info("更新成功");
        this.loading = false;
      } catch (e) {
        this.loading = false;
        swal.error(e);
      }
    },
    handleClose: async function() {
      this.loading = true;
      try {
        await BasicSystem.closeAll(env.token, this.defaultHotel);
        // this.statuslists = [];
        let apiStatus = await BasicSystem.getModulesStatus(env.token, this.defaultHotel);
        this.statuslists = apiStatus.list;
        swal.info("更新成功");
        this.loading = false;
      } catch (e) {
        this.loading = false;
        swal.error(e);
      }
    },
    handleModuleData: async function() {
      let module_apiStatus = await BasicSystem.getHotelStatusByModule(
        env.token,
        this.defaultModule
      );
      let module_hotels = await BasicSystem.getAllHotel(env.token);
      let module_datas = [];
      for (let key in module_apiStatus) {
        let hotel = module_hotels.filter(function(item) {
          return item.hotelId == key;
        });
        if (hotel.length === 1) {
          let node = {
            hotelId: key,
            status: module_apiStatus[key],
            desc: hotel[0].hotelName
          };
          module_datas.push(node);
        }
      }
      this.module_statuslists_bak = this.module_statuslists = module_datas;
    },
    handleHotelData: async function() {
      let apiStatus = await BasicSystem.getModulesStatus(env.token, this.defaultHotel);
      this.statuslists_bak = this.statuslists = apiStatus.list;
    },
    handleModuleOpenall: async function() {
      try {
        this.loading = true;
        await BasicSystem.setAllHotel(env.token, this.defaultModule, true);
        swal.info("更新成功");
        this.handleModuleData();
        this.loading = false;
      } catch (e) {
        this.loading = false;
        swal.error(e);
      }
    },
    handleModuleCloseall: async function() {
      try {
        this.loading = true;
        await BasicSystem.setAllHotel(env.token, this.defaultModule, false);
        swal.info("更新成功");
        this.handleModuleData();
        this.loading = false;
      } catch (e) {
        this.loading = false;
        swal.error(e);
      }
    }
  },
  watch: {
    defaultHotel: async function(val) {
      this.loading = true;
      this.lock = true;
      await this.handleHotelData();
      this.loading = false;
      setTimeout(() => {
        this.lock = false;
      }, 1000);
    },
    defaultModule: async function(val) {
      this.loading = true;
      this.modulelock = true;
      await this.handleModuleData();
      this.loading = false;
      setTimeout(() => {
        this.modulelock = false;
      }, 1000);
    },
    searchkey: function(val) {
      this.statuslists = this.statuslists_bak.filter(function(item) {
        if (item.desc.includes(val)) {
          return item;
        }
      });
    },
    searchkey2: function(val) {
      this.module_statuslists = this.module_statuslists_bak.filter(function(item) {
        if (item.desc.includes(val)) {
          return item;
        }
      });
    }
  },
  computed: {},
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
// html,body {
//   background: none;
// }
.flexbox {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-height: 640px;
  overflow-y: scroll;
  background-color: #fafafa;
  padding: 20px;
  margin-bottom: 10px;
}
.nav .active {
  color: #007bff !important;
}

.nav a {
  color: #495057;
}
</style>
