<template>
  <div class="container-fluid" style="overflow: auto; width: 100%; height: 100%">
    <div>
      <div class="row">
        <div class="col-12" v-if="view === 'table'">
          <h2>{{ $t("Imstriggertype.title") }}</h2>
          <cool-table
            @edit-row="editTable"
            :columns="columns"
            :data="tableData"
            :options="options"
            :pageSize="10"
            @del-row="delMessage"
            ref="messageTable"
          >
            <button class="btn btn-primary" @click="addfile">
              {{ $t("confirm.add") }}
            </button>
            <button class="btn btn-danger ml-1" @click="delMessages">
              {{ $t("confirm.delete") }}
            </button>
          </cool-table>
        </div>
      </div>
    </div>
    <div v-if="view === 'form'" class="centerbox mt-4">
      <!-- TriggerType -->
      <div class="col-sm-6">
        <vo v-slot="{ handleSubmit }">
          <form novalidate @submit.prevent="handleSubmit(submit)">
            <!-- Id -->
            <!-- <vp class="form-group" tag="div" v-slot="v" v-if="model.id">
              <label>ID</label>
              <input
                type="text"
                v-model="model.id"
                class="form-control"
                v-validate="v"
                required
                disabled
              />
            </vp> -->
            <!-- 触发点名称 -->
            <vp class="form-group" tag="div" v-slot="v">
              <label> {{ $t("Imstriggertype.triggername") }}</label>
              <input
                type="text"
                v-model="model.name"
                class="form-control"
                v-validate="v"
                required
              />
            </vp>

            <!-- 触发点类型 -->
            <vp class="form-group" tag="div" v-slot="v">
              <label>{{ $t("Imstriggertype.triggertype") }} </label>
              <select v-model="model.type" v-validate="v" required class="form-control">
                <option value="0" selected>立即执行</option>
                <option value="1">延期执行</option>
                <option value="2">周期执行</option>
              </select>
            </vp>

            <!-- 开始时间 -->
            <vp class="form-group" tag="div" v-slot="v" vid="startTime" rules="required">
              <label> {{ $t("Imstriggertype.starttime") }}</label>
              <div>
                <input
                  name="startTime"
                  type="datetime-local"
                  class="form-control"
                  v-model="model.startTime"
                  v-validate="v"
                  required
                />
              </div>
            </vp>

            <!-- interval -->
            <vp class="form-group" tag="div" v-slot="v">
              <label>{{ $t("Imstriggertype.interval") }}</label>
              <input
                type="number"
                v-model="model.interval"
                class="form-control"
                v-validate="v"
                required
              />
            </vp>

            <!-- 结束时间 -->
            <vp class="form-group" tag="div" v-slot="v" vid="endtTime" rules="required">
              <label>{{ $t("Imstriggertype.endtime") }}</label>
              <div>
                <input
                  name="endTime"
                  type="datetime-local"
                  class="form-control"
                  v-model="model.endTime"
                  v-validate="v"
                />
              </div>
            </vp>

            <!-- 操作 -->
            <div class="form-group">
              <button type="submit" class="btn btn-primary">
                {{ keyCount }}
              </button>
              <button class="btn btn-secondary ml-1" @click="close">
                {{ $t("confirm.return") }}
              </button>
            </div>
          </form>
        </vo>
      </div>
    </div>
  </div>
</template>

<script>
import CoolTable from "@/components/CoolTable.vue";
import { mapState } from "vuex";
import { TriggerTypeApi } from "../LmsApi";
import env from '@/env'
import { optionsUS } from "@/utils/bootstrapTable-i18n";
export default {
  data() {
    return {
      view: "table",
      keyCount: this.$t("confirm.add"),
      options: {},
      columns: [
        {
          checkbox: true
        },
        {
          field: "name",
          title: this.$t("confirm.name"),
          align: "center"
        },
        {
          field: "type",
          title: this.$t("confirm.type"),
          align: "center",
          formatter: val => {
            if (val == 0) {
              return "立即执行";
            } else if (val == 1) {
              return "延期执行";
            } else if (val == 2) {
              return "周期执行";
            } else {
              return "-";
            }
          }
        },
        {
          field: "startTime",
          title: this.$t("Imstriggertype.starttime"),
          align: "center",
          formatter: val => {
            return new Date(val).format("yyyy-MM-dd hh:mm:ss");
          }
        },
        {
          field: "interval",
          title: this.$t("Imstriggertype.interval"),
          align: "center"
        },
        {
          field: "endTime",
          title: this.$t("Imstriggertype.endtime"),
          align: "center",
          formatter: val => {
            return new Date(val).format("yyyy-MM-dd hh:mm:ss");
          }
        },
        {
          field: "id",
          title: this.$t("confirm.operate"),
          align: "center",
          width: 300,
          formatter: (val, row, idx) => {
            return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">${this.$t(
              "confirm.edit"
            )}</button>
                            <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row" >${this.$t(
              "confirm.delete"
            )}</button>`;
          }
        }
      ],
      tableList: [],
      allid: [],
      model: {}
    };
  },
  created() {
    this.getallData();
      if (env.locale == 0) {
      this.options = {};
    } else {
      this.options = optionsUS;
    }
  },
  computed: {
    ...mapState(["garden", "keylist"]),
    tableData() {
      let bd = this.tableList;
      return bd;
    }
  },
  methods: {
    addfile() {
      this.keyCount = this.$t("confirm.add");
      this.model = {
        type: 0
      };
      this.view = "form";
    },
    //获取全部数据
    async getallData() {
      try {
        const data = await TriggerTypeApi.list();
        this.tableList = data.list;
      } catch (error) {
        this.$error(this.$t("confirm.failedData"));
      }
    },
    async submit() {
      try {
        await TriggerTypeApi.create(
          JSON.stringify({
            ...this.model,
            startTime: Date.parse(this.model.startTime),
            endTime: Date.parse(this.model.endTime)
          })
        );
        await this.$info(this.$t("confirm.success"));
        this.close();
      } catch (error) {
        console.log(error);
        this.$error(this.$t("confirm.fail"));
      }
    },
    //头层表格返回
    close() {
      this.view = "table";
      this.model = {};
      this.getallData();
    },
    //修改按钮
    editTable(val) {
      this.keyCount = this.$t("confirm.update");
      let data = this.tableData.find(item => item.id == val);
      data.endTime = new Date(data.endTime).format("yyyy-MM-ddThh:mm:ss");
      data.startTime = new Date(data.startTime).format("yyyy-MM-ddThh:mm:ss");
      this.model = data;
      this.view = "form";
    },
    // 删除单个
    async delMessage(id) {
      try {
        const ok = await this.$confirm(this.$t("confirm.AreyousureDeletIDkey").replace("*", id));
        if (!ok) {
          return;
        }
        // 调用接口
        await TriggerTypeApi.delete([id]);
        await this.$info(this.$t("confirm.success"));
        this.getallData();
      } catch (error) {
        console.error(error);
        this.$error(this.$t("confirm.fail"));
      }
    },
    // 删除多个
    async delMessages() {
      const selections = this.$refs.messageTable.getSelections();
      if (selections.length === 0) return;
      try {
        const ok = await this.$confirm(
          this.$t("confirm.AreyousureDelet").replace("*", selections.length)
        );
        if (!ok) return;
        await TriggerTypeApi.delete(selections.map(v => v.id));
        await this.$info(this.$t("confirm.success"));
        this.getallData();
      } catch (error) {
        console.error(error);
        this.$error(this.$t("confirm.fail"));
      }
    }
  },
  components: {
    CoolTable
  }
};
</script>

<style lang="scss" scoped>
.centerbox {
  display: flex;
  // justify-items: center;
  justify-content: center;
}
</style>
