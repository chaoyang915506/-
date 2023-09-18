<template>
  <div>
    <div class="d-flex mb-2">
      <h3>{{ $t("Lms.statusmessages") }}</h3>
      <button class="btn btn-primary ml-3" :class="{ disabled: quering }" @click="initInfo">
        {{ $t("confirm.refresh") }}
      </button>
    </div>
    <table class="table table-bordered table-hover">
      <thead>
        <th width="40%">{{ $t("Lms.nape") }}</th>
        <th width="20%">{{ $t("Lms.price") }}</th>
        <th width="40%">{{ $t("Lms.explain") }}</th>
      </thead>
      <tbody>
        <tr>
          <td>{{ $t("Lms.NameofParty") }}</td>
          <td>
            {{ info.protocol.name }}
          </td>
          <td>
            <span v-if="quering">读取中...</span>
          </td>
        </tr>
        <tr>
          <td>{{ $t("Lms.connectionstatus") }}</td>
          <td>
            <i
              class="bi bi-circle-fill"
              :class="info.ping.error ? 'text-danger' : 'text-success'"
            ></i>
          </td>
          <td>
            <div v-if="quering">读取中...</div>
            <div v-else>
              <div v-if="info.ping.error">
                {{ info.ping.error }}
              </div>
              <div v-else>连接正常</div>
            </div>
          </td>
        </tr>
        <tr>
          <td>{{ $t("Lms.DataSynchronism") }}</td>
          <td>
            <button
              class="btn btn-primary btn-sm"
              :class="{ disabled: quering || info.ping.error }"
              @click="sync"
            >
              {{ $t("confirm.Sync") }}
            </button>
          </td>
          <td>
            <span v-if="syncing"> 请求同步中... </span>
            <div v-else>
              <span v-if="syncError !== ''">
                {{ syncError }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { LmsApi } from "./LmsApi";
export default {
  name: "PmsStatus",
  data() {
    return {
      quering: true,
      syncing: false,
      syncError: "",
      info: {
        ping: {
          ping: ""
        },
        protocol: {
          name: ""
        }
      }
    };
  },
  methods: {
    async sync() {
      this.syncing = true;

      try {
        const data = await LmsApi.sync();
        this.syncError = "";

        let worker = new Worker();
      } catch (err) {
        if (err === "sync too often") {
          this.syncError = "同步太频繁";
        } else {
          this.syncError = "同步出错：" + err;
        }
      } finally {
        this.syncing = false;
      }
    },
    initInfo() {
      this.quering = true;

      LmsApi.info()
        .then(data => {
          this.quering = false;
          this.info = data;
        })
        .catch(err => {
          this.quering = false;

          this.info.ping.error = "读取失败";
        });
    }
  },
  created() {
    this.initInfo();
  }
};
</script>

<style></style>
