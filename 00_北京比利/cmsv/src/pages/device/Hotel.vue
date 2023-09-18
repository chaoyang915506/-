<template>
  <div class="container">
    <div class="row header">
      <div class="col-sm-6">
        <h3 @click="goChoose">{{ $t("device.title") }}</h3>
      </div>
      <div class="col-sm-3">
        <input @change="keywordChange" v-model="key" class="form-control" type="text" />
      </div>
      <div class="col-sm-3">
        <button @click="goAdd" class="btn btn-primary">{{ $t("device.add") }}</button>
        &nbsp;
        <button @click="handleExport" class="btn btn-primary">{{ $t("device.export") }}</button>
      </div>
    </div>

    <div class="row total">
      <div class="col-sm-4">
        <div class="row">
          <div class="col-sm-4">
            {{ $t("device.total") }}
          </div>
          <div class="col-sm-3">
            {{ renderDevicelists.length }}
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div v-for="(item, idx) in renderDevicelists" :key="idx" class="col-sm-3 nodes">
        <div class="row">
          <div class="col-sm-8"></div>
          <div @click="handleEdit(item.deviceId)" class="col-sm-2">
            <i class="bi bi-pencil-square"></i>
          </div>
          <div @click="handleDelete(item.deviceId)" class="col-sm-2">
            <i class="bi bi-trash"></i>
          </div>
        </div>
        <div class="row">
          <div class="col-12 text-center truncate">
            <b>SN: {{ item.deviceSerial }}</b>
          </div>
        </div>
        <div class="row text-center">
          <div class="col-12 text-center">
            <b>IP: {{ item.IPAddress }}</b>
          </div>
        </div>
        <div class="row text-center">
          <div class="col-12 text-center">
            <b>MAC: {{ item.mac }}</b>
          </div>
        </div>
        <div class="row text-center">
          <div class="col-12 text-center">
            <b>RN: {{ item.roomNumber }}</b>
          </div>
        </div>
        <div class="row text-center">
          <div class="col-12 text-center">
            <b>设备位置: {{ item.devLocation }}</b>
          </div>
        </div>
        <div class="row text-center">
          <div class="col-12 text-center">
            <b>Type: {{ item.deviceType }}</b>
          </div>
        </div>

        <div class="row text-center">
          <div class="col-12 text-center">
            <b>Serial: {{ item.serialProtocol }}</b>
          </div>
        </div>

        <div class="row text-center">
          <div class="col-12 text-center">
            <b>create: {{ item.createTimeStr }}</b>
          </div>
        </div>

        <div class="row text-center">
          <div class="col-12 text-center">
            <b>last edit: {{ item.editTimeStr }}</b>
          </div>
        </div>
        <br />
      </div>
    </div>
    <cool-loading :loading="loading" />
  </div>
</template>

<script>
import Device from "@/api/Device";
import env from "@/env";
import swal from "@/plugins/sweetalert";
import CoolLoading from "@/components/CoolLoading.vue";
import { export_json_to_excel } from "@/utils/Export2Excel";

export default {
  components: { CoolLoading },
  name: "Hotel",
  data() {
    return {
      loading: false,
      // devicelists: [],
      key: "",
      renderDevicelists: [],
      transformdata: [],
      typelists: []
    };
  },
  methods: {
    goAdd: function() {
      this.$router.push({
        path: "/cmsv/device/add.html",
        query: {
          hotelId: env.hotelId,
          token: env.token,
          locale: 1
        }
      });
    },
    init: async function() {
      try {
        this.typelists = await Device.getTypelist(env.token, env.hotelId);
        let data = await Device.getDeviceList(
          env.token,
          env.hotelId
        );
        this.transform(data);
      } catch (e) {
        swal.error(e);
      }
    },
    goChoose: function() {
      // this.$router.push({
      //   path: "/cmsv/device/choose.html",
      //   query: {
      //     token: env.token
      //   }
      // });
    },
    handleDelete: function(id) {
      swal.confirm("删除设备", "确认删除设备？").then(async state => {
        if (state) {
          this.loading = true;
          try {
            await Device.deleteDevice(env.token, env.hotelId, id);
            this.loading = false;
            swal.info("删除成功");
            this.init(); // fix 118
          } catch (e) {
            this.loading = false;
            swal.error(e);
          }
        }
      });
    },
    handleEdit: function(id) {
      this.$router.push({
        path: "/cmsv/device/edit.html",
        query: {
          id: id,
          hotelId: env.hotelId,
          token: env.token
        }
      });
    },
    handleExport: function() {
      let header = [
        "SN",
        "IP",
        "MAC",
        "RoomNumber",
        "设备位置",
        "Type",
        "Serial Protocol",
        "Create",
        "Last Edit"
      ];
      let data = [];
      let _this = this;
      this.renderDevicelists.map(function(item) {
        let node = [
          item.deviceSerial,
          item.IPAddress,
          item.mac,
          item.roomNumber,
          item.devLocation,
          item.deviceType,
          item.serialProtocol,
          item.createTimeStr,
          item.editTimeStr
        ];
        data.push(node);
      });
      export_json_to_excel({
        header,
        data,
        filename: "酒店设备列表",
        autoWidth: true,
        bookType: "xlsx"
      });
    },
    transform: function(datas) {
      let data = [];
      let _this = this;
      datas.map(function(item) {
        let node = {
          deviceId: item.deviceId,
          deviceSerial: item.deviceSerial,
          IPAddress: item.IPAddress,
          mac: item.mac,
          roomNumber: item.roomNumber,
          devLocation: item.devLocation,
          deviceType: _this.getType(item.deviceType),
          serialProtocol: item.serialProtocol,
          createTimeStr: item.createTimeStr,
          editTimeStr: item.editTimeStr
        };
        data.push(node);
      });
      this.renderDevicelists = this.transformdata = data;
    },
    keywordChange: function() {
      this.renderDevicelists = this.transformdata.filter(item => {
        let json = JSON.stringify(item);
        console.log(json);
        if (json.includes(this.key)) {
          return item;
        }
      });
    },
    getType: function(key) {
      let r = this.typelists.filter(item => item.id === key);
      return r[0].name;
    }
  },
  mounted() {
    if (env.hotelId === null) {
      // this.$router.push({
      //   path: "/cmsv/device/choose.html",
      //   query: {
      //     token: env.token
      //   }
      // });
    } else {
      // fix 115
      this.init();
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  margin-top: 20px;
}

.total {
  border-top: solid 1px #ebe7e7;
  border-bottom: solid 1px #ebe7e7;
  padding: 10px 0 10px 0;
}

.nodes {
  margin-top: 5px;
  padding-top: 10px;
  background-color: #f0eaea;
  border: solid 5px #ffffff;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row p {
  text-align: center;
}
</style>
