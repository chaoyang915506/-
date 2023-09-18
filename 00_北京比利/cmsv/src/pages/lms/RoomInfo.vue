<template>
  <div>
    <h3>{{ $t("Lms.Checkroom") }}</h3>
    <form class="form-inline" @submit.prevent>
      <label>{{ $t("confirm.roomnumber") }}:</label>
      <div class="input-group">
        <input class="form-control" v-model="roomNumberFilter" />
        <div class="input-group-append">
          <button class="btn btn-primary" :class="{ disabled: quering }" @click="checkRoomInfo">
            {{ $t("confirm.ok") }}
          </button>
          <button
            class="btn btn-danger"
            title="仅清空客人信息，PMS改动会影响清空结果"
            :class="{ disabled: quering }"
            @click="clearGuests"
          >
            {{ $t("Lms.Emptyguest") }}
          </button>
        </div>
      </div>
      <small v-show="quering" class="form-text col-auto">读取中...</small>
    </form>
    <table class="table table-bordered table-hover mt-3">
      <tbody>
        <tr>
          <td width="20%">{{ $t("Lms.Containsdevice") }}</td>
          <td width="30%">
            <div v-if="quering || roomInfo.deviceList">
              <ul class="list-unstyled">
                <li v-for="device in roomInfo.deviceList" :key="device.deviceId">
                  <i>{{ device.ipaddress }}</i>
                </li>
              </ul>
            </div>
            <div v-else>未知</div>
          </td>
          <td width="50%">
            <b>{{ $t("Lms.suredesc") }}</b>
          </td>
        </tr>
        <tr>
          <td>{{ $t("Lms.numberguest") }}</td>
          <td>
            <div v-if="!quering">
              {{ data.guest.count }}
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>{{ $t("Lms.guest") }}</td>
          <td>
            <div class="input-group">
              <input class="form-control" v-model="names.value" :placeholder="guestinfo" />
              <div class="input-group-append">
                <button class="btn btn-primary" :class="{ disabled: names.quering }" @click="check">
                  {{ $t("Lms.inquire") }}
                </button>
              </div>
            </div>
          </td>
          <td>
            <span v-for="(r, name) in names.ret" :key="name">
              {{ name }}: {{ r.exist ? "存在" : "不存在" }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Api from "@/api/Api";
import { LmsApi } from "./LmsApi";

export default {
  name: "RoomInfo",
  data() {
    return {
      guestinfo: this.$t("Lms.inputplace"),
      quering: false,
      roomNumberFilter: "",
      names: {
        quering: false,
        value: "",
        ret: {}
      },
      data: {
        guest: {
          count: "未知"
        }
      },
      roomInfo: {}
    };
  },
  methods: {
    checkRoomInfo() {
      if (!this.roomNumberFilter || this.roomNumberFilter === "") {
        return;
      }

      if (this.quering) {
        return;
      }

      this.quering = true;

      Api.all(
        [LmsApi.checkRoom(this.roomNumberFilter), LmsApi.roomsInfo(this.roomNumberFilter)],
        (checkRoomData, roomsInfoData) => {
          this.quering = false;
          this.data = checkRoomData;

          if (roomsInfoData.list.length !== 0) {
            this.roomInfo = roomsInfoData.list[0];
          } else {
            this.roomInfo = {};
          }
        }
      ).catch(err => {
        this.quering = false;
        this.data.guest.count = "未知";
      });
    },
    check() {
      if (!this.roomNumberFilter || this.roomNumberFilter === "") {
        return;
      }

      if (!this.names.value || this.names.value === "") {
        return;
      }

      this.names.quering = true;
      LmsApi.check(this.roomNumberFilter, this.names.value).then(data => {
        this.names.ret = data;
        this.names.quering = false;
      });
    },
    // 清空房间客人信息
    clearGuests() {
      if (!this.roomNumberFilter || this.roomNumberFilter === "") {
        return;
      }

      LmsApi.clearGuests(this.roomNumberFilter).then(data => {
        this.$info("已清空");
      });
    }
  }
};
</script>

<style></style>
