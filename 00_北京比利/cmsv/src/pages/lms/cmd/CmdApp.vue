<template>
  <div class="container-fluid" style="overflow: auto; width: 100%; height: 100%">
    <div>
      <div class="row">
        <div class="col-12" v-if="view === 'table'">
          <h2>{{ $t("Imscmd.title") }}</h2>
          <cool-table
            @edit-row="editTable"
            :columns="columns"
            :options="options"
            :data="tableList"
            :pageSize="10"
            @del-row="delMessage"
            ref="messageTable"
          >
            <button class="btn btn-primary" @click="add">
              {{ $t("confirm.Added") }}
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
            <vp class="form-group" tag="div" v-slot="v">
              <label>ID</label>
              <input
                type="text"
                v-model="model.id"
                class="form-control"
                v-validate="v"
                :disabled="keyCount == 2"
                required
              />
            </vp>
            <!-- 控制命令名称 -->
            <vp class="form-group" tag="div" v-slot="v">
              <label>{{ $t("Imscmd.controlCcommandName") }}</label>
              <input
                type="text"
                v-model="model.name"
                class="form-control"
                v-validate="v"
                required
              />
            </vp>

            <!-- 描述 -->
            <vp class="form-group" tag="div" v-slot="v">
              <label>{{ $t("Imscmd.Triggerpointdescription") }}</label>
              <input
                type="text"
                v-model="model.desc"
                class="form-control"
                v-validate="v"
                required
              />
            </vp>
            <!-- 操作 -->
            <div class="form-group">
              <button type="submit" class="btn btn-primary">
                {{ keyCount == 1 ? `${$t("confirm.Added")}` : `${$t("confirm.update")}` }}
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
import { CmdApi } from "../LmsApi";
import { mapState } from "vuex";
import { optionsUS } from "@/utils/bootstrapTable-i18n";
import env from "@/env";
class formDa {
  constructor() {
    this.id = "";
    this.desc = "";
    this.name = "";
  }
}
export default {
  data() {
    return {
      options: {},
      view: "table",
      keyCount: "0",
      columns: [
        {
          checkbox: true
        },
        {
          field: "id",
          title: "ID",
          align: "center"
        },
        {
          field: "name",
          title: `${this.$t("Imscmd.name")}`,
          align: "center"
        },
        {
          field: "desc",
          title: `${this.$t("Imscmd.desc")}`,
          align: "center"
        },
        {
          field: "id",
          title: `${this.$t("confirm.operate")}`,
          align: "center",
          width: 300,
          formatter: (val, row, idx) => {
            return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row"> ${this.$t(
              "confirm.edit"
            )}</button>
                            <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row" > ${this.$t(
              "confirm.delete"
            )}</button>`;
          }
        }
      ],
      tableList: [],
      allid: [],
      model: new formDa()
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
  methods: {
    add() {
      this.keyCount = 1;
      this.model = new formDa();
      this.view = "form";
    },
    //获取全部数据
    async getallData() {
      try {
        const data = await CmdApi.list();
        this.tableList = data.list;
      } catch (error) {
        this.$error(`${this.$t("confirm.failedData")}`);
      }
    },
    async submit() {
      try {
        if (this.keyCount == 1) {
          if (this.tableList.filter(i => i.id == this.model.id).length == 0) {
            await CmdApi.create(this.model);
            await this.$info(`${this.$t("confirm.success")}`);
            this.close();
          } else {
            this.$error(`id is ${this.$t("confirm.unrepeatable")}`);
          }
        } else {
          await CmdApi.create(this.model);
          this.$info(`${this.$t("confirm.success")}`);
          this.close();
        }
      } catch (error) {
        console.log(error);
        this.$error(`${this.$t("confirm.fail")}`);
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
      this.keyCount = "2";
      this.model = this.tableList.find(item => item.id == val);
      this.view = "form";
    },
    // 删除单个
    async delMessage(id) {
      try {
        const ok = await this.$confirm(
          `${this.$t("confirm.AreyousureDeletIDkey").replace("*", id)}`
        );
        if (!ok) {
          return;
        }
        // 调用接口
        await CmdApi.delete([id]);
        await this.$info(`${this.$t("confirm.success")}`);
        this.getallData();
      } catch (error) {
        this.$error(`${this.$t("confirm.fail")}`);
      }
    },
    // 删除多个
    async delMessages() {
      const selections = this.$refs.messageTable.getSelections();
      if (selections.length === 0) return;
      try {
        // ${selections.length
        const ok = await this.$confirm(
          `${this.$t("confirm.AreyousureDelet").replace("*", selections.length)}`
        );
        if (!ok) return;
        await CmdApi.delete(selections.map(v => v.id));
        await this.$info(`${this.$t("confirm.success")}`);
        this.getallData();
      } catch (error) {
        console.error(error);
        this.$error(`${this.$t("confirm.fail")}`);
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
  justify-content: center;
}
</style>
