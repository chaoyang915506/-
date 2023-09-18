<template>
  <container>
    <template v-slot:area>
      <!-- <el-page-header :content="$t('coolioo.cp.title')"> </el-page-header> -->
      <!-- <el-row>
          <el-page-header content="视频版权管理"> </el-page-header>
        </el-row> -->
      <el-card>
        <el-form inline @submit.native.prevent>
          <el-form-item :label="$t('coolioo.cp.bqmc')">
            <el-input v-model="copyright"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">
              {{ $t("coolioo.common.cx") }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card>
        <el-row>
          <el-col :span="4">
            <el-button @click="create" type="primary">
              {{ $t("coolioo.cp.cjbq") }}
            </el-button>
          </el-col>
          <el-col class="btns" :span="20">
            <el-button @click="dels">
              {{ $t("coolioo.common.plsc") }}
            </el-button>
            <!-- <el-button @click="online">
              {{ $t("coolioo.cp.plsx") }}
            </el-button>
            <el-button @click="offline">
              {{ $t("coolioo.cp.plxx") }}
            </el-button> -->
            <el-button @click="exports">
              {{ $t("coolioo.common.dc") }}
            </el-button>
          </el-col>
        </el-row>
        <el-table
          v-loading="loading"
          :header-cell-style="{ background: '#F7F9FC' }"
          :row-style="{ height: '60px' }"
          border
          :data="tabledata"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            align="center"
            type="index"
            :index="
              (val) => {
                return (current - 1) * pageSize + val + 1;
              }
            "
            :label="$t('coolioo.common.xh')"
            width="80"
          ></el-table-column>
          <el-table-column align="center" prop="id" :label="$t('coolioo.cp.bqmc')" width="120">
            <template slot-scope="scope">
              {{ showCopyright(scope.row.id) }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="hotelSize"
            :label="$t('coolioo.cp.dlpdjdsl')"
            width="140"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="mediaSize"
            :label="$t('coolioo.cp.spsl')"
            width="80"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="company"
            :label="$t('coolioo.cp.sqgsmc')"
            width="120"
          ></el-table-column>
          <el-table-column min-width="300" align="center" prop="expireTime" :label="$t('coolioo.cp.sqyxq')">
            <template slot-scope="scope">
              {{ showDate(scope.row.startTime) }}至{{ showDate(scope.row.expireTime) }}
              <el-tag v-if="scope.row.expireTime > scope.row.startTime" effect="dark">{{
                showTag(scope.row)
              }}</el-tag>
              <el-tag v-else type="danger" effect="dark">{{ showTag(scope.row) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="areaId" :label="$t('coolioo.cp.sqqy')" width="120">
            <template slot-scope="scope">
              {{ showArea(scope.row.areaId) }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="status"
            :label="$t('coolioo.common.zt')"
            width="120"
          >
            <template slot-scope="scope">
              <el-switch
                @change="switchChange(scope.row)"
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#E4E7ED"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column min-width="300" align="center" prop="id" :label="$t('coolioo.common.cz')">
            <template slot-scope="scope">
              <el-button type="primary" @click="edit(scope.row)">{{
                $t("coolioo.common.bj")
              }}</el-button>
              <el-button @click="group(scope.row.id)">{{ $t("coolioo.cp.fzgl") }}</el-button>
              <el-button type="danger" @click="del(scope.row.id)">{{
                $t("coolioo.common.sc")
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @current-change="currentChanges"
          @size-change="sizeChanges"
          :page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </el-card>

      <el-dialog title="选择酒店" :visible.sync="hotelvisible">
        <el-transfer
          filterable
          :titles="['酒店列表', '选中酒店']"
          :props="{ key: 'hotelId', label: 'hotelName' }"
          v-model="hotels4sync"
          :data="hotellists"
        ></el-transfer>
        <span slot="footer" class="dialog-footer">
          <el-button @click="hotelvisible = false">{{ $t("coolioo.common.qx") }}</el-button>
          <el-button type="primary" @click="onlineAction">{{ $t("coolioo.common.qd") }}</el-button>
        </span>
      </el-dialog>
      <!-- <el-dialog title="选择酒店" :visible.sync="hotelvisible2">
        <el-transfer
          filterable
          :titles="['酒店列表', '选中酒店']"
          :props="{ key: 'hotelId', label: 'hotelName' }"
          v-model="hotels4sync2"
          :data="hotellists"
        ></el-transfer>
        <span slot="footer" class="dialog-footer">
          <el-button @click="hotelvisible2 = false">取 消</el-button>
          <el-button type="primary" @click="offlineAction">确 定</el-button>
        </span>
      </el-dialog> -->
    </template>
  </container>
</template>

<script>
import Container from "@/components/coolioo/Container.vue";
import Coolioo from "@/api/Coolioo";
import env from "@/env";
import moment from "moment";
// import BasicSystem from "@/api/BasicSystem";

export default {
  name: "App",
  components: {
    Container,
  },
  data() {
    return {
      hotellists: [],
      hotels4sync: [],
      // hotels4sync2: [],
      hotelvisible: false,
      // hotelvisible2: false,
      selections: [],
      loading: false,
      copyright: "",
      tabledata: [],
      areas: [],
      copyrightlists: [],
      pageSize: 10,
      total: 0,
      current: 1,
    };
  },
  methods: {
    async del(id) {
      this.$confirm("确定删除？").then(async () => {
        this.loading = true;
        try {
          await Coolioo.delCopyright(`id[]=${id}`);
          this.$notify({
            title: "删除成功",
          });
          this.init();
        } catch {
          this.loading = false;
          this.$notify.error({
            title: `数据服务异常`,
          });
        }
      });
    },
    async dels() {
      this.loading = true;
      let params = "";
      this.selections.map((item) => {
        params += `id[]=${item}&`;
      });

      try {
        await Coolioo.delCopyright(params.substring(0, params.length - 1));
        this.$notify({
          title: "删除成功",
        });
        this.init();
      } catch {
        this.loading = false;
        this.$notify.error({
          title: `数据服务异常`,
        });
      }
    },
    indexMethod(val) {
      return (this.current - 1) * this.pageSize + val + 1;
    },
    online() {
      if (this.selections.length === 0) {
        this.$notify.error({
          title: "系统提示",
          message: "请选择版权",
        });
        return false;
      }
      this.hotelvisible = true;

      // try{
      //   await Coolioo.batchOnline();
      // }catch(e){

      // }
    },
    async onlineAction() {
      this.hotelvisible = false;
      let data = {
        venIds: this.selections,
        hotelIds: this.hotels4sync,
      };
      try {
        await Coolioo.batchOnlineCp(data);
        this.$notify({
          type: "success",
          title: "系统提示",
          message: "批量上线线成功",
        });
        this.init();
      } catch (e) {
        this.$notify.error({
          title: "错误提示",
          message: `${e}`,
        });
      }
    },
    async offline() {
      if (this.selections.length === 0) {
        this.$notify.error({
          title: "系统提示",
          message: "请选择版权",
        });
        return false;
      }
      // this.hotelvisible2 = true;
      try {
        await Coolioo.batchOfflineCp(this.selections);
        this.$notify({
          type: "success",
          title: "系统提示",
          message: "批量下线成功",
        });
        this.init();
      } catch (e) {
        this.$notify.error({
          title: "错误提示",
          message: `${e}`,
        });
      }
    },
    async exports() {
      let url = env.cms + `/cms/vendors/export?token=${env.token}`;
      window.open(url, "_self");
    },
    async switchChange(val) {
      await Coolioo.updateCopyrightState({
        id: val.id,
        status: val.status,
      });
      this.init();
    },
    sizeChanges(val) {
      this.pageSize = val;
      this.init();
    },
    currentChanges(val) {
      this.current = val;
      this.init();
    },
    search() {
      this.init();
    },
    create() {
      this.$router.push({
        path: "/cmsv/cooliooCopyright/add.html",
        query: {
          token: env.token,
          locale: env.locale,
        },
      });
    },
    edit(data) {
      let json = JSON.stringify(data);
      localStorage.setItem("cooliooCopyrightCache", json);
      this.$router.push({
        path: "/cmsv/cooliooCopyright/edit.html",
        query: {
          token: env.token,
          locale: env.locale,
        },
      });
    },
    group(id) {
      window.location.href = `/cmsv/cooliooGroup/index.html?locale=${env.locale}&metaType=${id}&token=${env.token}`;
    },
    handleSelectionChange(val) {
      this.selections = val.map((item) => item.id);
    },
    async initHotels() {
      // this.hotellists = await BasicSystem.getHotels(env.token);
      this.hotellists = await Coolioo.getHotellists49();
    },
    async init() {
      this.loading = true;
      try {
        let data = await Coolioo.getCopyrightlists(
          env.token,
          (this.current - 1) * this.pageSize,
          this.pageSize,
          this.copyright
        );
        this.tabledata = data.rows;
        this.total = data.total;

        this.areas = await Coolioo.getAreas(env.token);

        let data1 = await Coolioo.getCopyright(env.token);
        this.copyrightlists = data1.list;
        this.loading = false;
      } catch {
        this.loading = false;
        this.$notify.error({
          title: "服务数据异常",
          // message: "数据异常",
        });
      }
    },
    showDate(val) {
      return moment(val).format("YYYY-MM-DD");
    },
    showTag(data) {
      let now = Date.parse(new Date());
      let t = data.expireTime - now;
      let day = t / 86400000;
      if (day > 0) return Math.floor(day) + `天后到期`;
      return `超过授权` + Math.floor(day) * -1 + `天`;
    },
    showArea(val) {
      let d = this.areas.filter((item) => item.id === val);
      if (d.length === 0) return "";
      return d[0].name;
    },
    showCopyright(val) {
      let d = this.copyrightlists.filter((item) => item.id === val);
      if (d.length === 0) return "";
      return d[0].name;
    },
  },
  mounted() {
    this.init();

    this.initHotels();
  },
};
</script>

<style scoped lang="scss">
.el-col {
  height: 40px;
  line-height: 40px;
}

.el-row {
  margin-top: 40px;
}
.btns {
  text-align: right;
}
.el-table {
  margin-top: 40px;
}
.el-pagination {
  margin-top: 20px;
}
.el-card {
  margin-bottom: 20px;
}
.el-page-header {
  margin-bottom: 20px;
}
</style>
