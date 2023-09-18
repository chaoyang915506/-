<template>
  <div class="container-fluid" style="overflow: auto; width: 100%; height: 100%">
    <div>
      <div class="row">
        <div class="col-12" v-if="view === 'table'">
          <h2>{{ $t("Imstrigger.title") }}</h2>
          <cool-table
            @edit-row="editTable"
            :columns="columns"
            :options="options"
            :data="tableData"
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
      <!-- Trigger -->
      <div class="col-sm-6">
        <vo v-slot="{ handleSubmit }">
          <form novalidate @submit.prevent="handleSubmit(submit)">
            <!-- Id -->
            <vp class="form-group" tag="div" v-slot="v">
              <label>ID</label>
              <input
                type="text"
                :disabled="state"
                :placeholder="'ID ' + statetest"
                v-model="model.id"
                class="form-control"
                v-validate="v"
                required
              />
            </vp>
            <!-- 触发点名称 -->
            <vp class="form-group" tag="div" v-slot="v">
              <label>{{ $t("Imstrigger.triggername") }}</label>
              <input
                type="text"
                v-model="model.name"
                class="form-control"
                v-validate="v"
                required
              />
            </vp>

            <!-- 触发点描述 -->
            <vp class="form-group" tag="div" v-slot="v">
              <label>{{ $t("Imstrigger.triggerdesc") }}</label>
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
import { TriggerApi } from "../LmsApi";
import { mapState } from "vuex";
import { optionsUS } from "@/utils/bootstrapTable-i18n";
import env from "@/env";
export default {
  data() {
    return {
      view: "table",
      options: {},
      keyCount: this.$t("confirm.add"),
      state: false,
      statetest: this.$t("confirm.unrepeatable"),
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
          title: this.$t("Imstrigger.name"),
          align: "center"
        },
        {
          field: "desc",
          title: this.$t("Imstrigger.desc"),
          align: "center"
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
      model: {},
      addtag: ""
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
      this.addtag = 1;
      this.view = "form";
    },
    //获取全部数据
    async getallData() {
      try {
        const data = await TriggerApi.list();
        this.tableList = data.list;
      } catch (error) {
        this.$error(this.$t("confirm.fail"));
      }
    },
    async submit() {
      try {
        let data = {
          id: this.model.id,
          name: this.model.name,
          desc: this.model.desc
        };
        if (this.addtag == 1 && this.tableList.filter(i => i.id == data.id).length !== 0) {
          return this.$error(this.$t("confirm.errorId"));
        }
        await TriggerApi.create(data);
        await this.$info(this.$t("confirm.success"));
        this.addtag = "";
        this.view = "table";
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
      this.state = false;
      this.getallData();
    },
    //修改按钮
    editTable(val) {
      this.keyCount = this.$t("confirm.update");
      this.state = true;
      let editdata = this.tableData.filter(item => item.id == val)[0];
      this.model = JSON.parse(JSON.stringify(editdata));
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
        await TriggerApi.delete([id]);
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
        await TriggerApi.delete(selections.map(v => v.id));
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
