<template>
  <container>
    <template v-slot:area>
      <!-- <el-page-header :content="$t('coolioo.lm.title')"> </el-page-header> -->
      <el-card>
        <el-form inline>
          <el-form-item :label="$t('coolioo.lm.jd')">
            <el-select filterable @change="inittable" v-model="hotel2">
              <el-option value="">全部</el-option>
              <el-option
                v-for="item in hotellists"
                :key="item.hotelId"
                :value="item.hotelId"
                :label="item.hotelName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="currentChanges(1)" type="primary">{{
              $t("coolioo.common.cx")
            }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card>
        <el-row>
          <el-col :span="2">
            <el-button @click="create" type="primary">{{ $t("coolioo.lm.cjlm") }}</el-button>
          </el-col>
        </el-row>
        <el-table
          v-loading="loading"
          :data="tabledata"
          border
          :header-cell-style="{ background: '#F7F9FC' }"
          :row-style="{ height: '60px' }"
        >
          <el-table-column
            align="center"
            prop="id"
            :label="$t('coolioo.common.xh')"
          ></el-table-column>
          <el-table-column align="center" prop="hotelId" :label="$t('coolioo.lm.jd')">
            <template slot-scope="scope">
              {{ showHotel(scope.row.hotelId) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="itemName" :label="$t('coolioo.lm.jclm')">
            <!-- <template slot-scope="scope">
              {{ showItem(scope.row.itemBasicId) }}
            </template> -->
          </el-table-column>
          <el-table-column align="center" prop="mediaVendorId" :label="$t('coolioo.lm.bq')">
            <template slot-scope="scope">
              {{ showCp(scope.row.mediaVendorId) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="mediaVendorId" :label="$t('coolioo.common.cz')">
            <template slot-scope="scope">
              <el-button @click="del(scope.row.id)" type="danger">{{
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
        ></el-pagination>
      </el-card>
      <!-- <el-card>
        <el-tabs ref="xx" type="border-card">
          <el-tab-pane label="用户管理">用户管理</el-tab-pane>
          <el-tab-pane label="配置管理">配置管理</el-tab-pane>
          <el-tab-pane label="角色管理">角色管理</el-tab-pane>
          <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
        </el-tabs>
      </el-card> -->
      <el-dialog :title="$t('coolioo.lm.cjlm')" :visible.sync="createvisible">
        <el-form ref="form" label-width="80px">
          <!-- 酒店 -->
          <el-form-item label="酒店">
            <el-select filterable @change="initCategories" v-model="hotel" placeholder="请选择酒店">
              <el-option
                v-for="item in hotellists"
                :key="item.hotelId"
                :label="item.hotelName"
                :value="item.hotelId"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 栏目 49 -->
          <el-form-item label="栏目">
            <el-select filterable @change="initCps" v-model="cat" placeholder="请选择栏目">
              <el-option
                v-for="item in categories"
                :key="item.itemId"
                :label="item.itemMenuName"
                :value="item.itemBasicId"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 版权 -->
          <el-form-item label="版权">
            <el-select filterable v-model="cp" placeholder="请选择版权">
              <el-option
                v-for="item in cps"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="createvisible = false">取 消</el-button>
          <el-button type="primary" @click="ok">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </container>
</template>

<script>
import Container from "@/components/coolioo/Container.vue";
import Coolioo from "@/api/Coolioo";
import env from "@/env";

export default {
  name: "App",
  components: {
    Container,
  },
  data() {
    return {
      cps: [],
      cp: "",
      categories: [],
      categories2: [],
      cat: "",
      hotellists: [],
      hotel: "",
      hotel2: "",
      createvisible: false,
      copyright: "",
      tabledata: [],
      loading: false,
      total: 0,
      pageSize: 10,
      curr: 1,
      cpnames: [],
    };
  },
  methods: {
    async del(id) {
      try {
        this.$confirm("确定删除？").then(async () => {
          await Coolioo.delAssociated(id);
          this.inittable();
        });
      } catch {
        this.$notify.error({
          title: `数据服务异常`,
        });
      }
    },
    async initcpnames() {
      let data = await Coolioo.getCopyright();
      this.cpnames = data.list;
    },
    showHotel(id) {
      let o = this.hotellists.find((item) => item.hotelId === id) || {};
      return o.hotelName;
    },
    showItem(id) {
      let o = this.categories2.find((item) => item.itemId === id) || {};
      return o.itemMenuName;
    },
    showCp(id) {
      let o = this.cpnames.find((item) => item.id === id) || {};
      return o.name;
    },
    async ok() {
      this.createvisible = false;
      try {
        await Coolioo.createCpAssociated(this.hotel, this.cat, this.cp);
        this.inittable();
      } catch {
        this.$notify.error({
          title: `数据服务异常`,
        });
      }
    },
    async initCps() {
      if (this.hotelId === "" || this.cat === "") return false;

      // this.initCategories();

      try {
        let data = await Coolioo.getCps(this.hotel, this.cat, env.locale);
        // console.log(data);
        this.cps = data.list;
        this.cp = "";
      } catch {
        this.$notify.error({
          title: `数据服务异常`,
        });
      }
    },
    async initCategories() {
      try {
        this.categories = await Coolioo.getCat49(this.hotel);
        this.cat = "";
        this.cp = "";
      } catch {
        this.$notify.error({
          title: `数据服务异常`,
        });
      }
    },
    async initCategories2() {
      try {
        this.categories2 = await Coolioo.getCat49(this.hotel);

      } catch {
        this.$notify.error({
          title: `数据服务异常`,
        });
      }
    },
    async initHotels() {
      try {
        this.hotellists = await Coolioo.getAllHotels();
      } catch {
        this.$notify.error({
          title: `数据服务异常`,
        });
      }
    },
    create() {
      this.createvisible = true;
    },
    async inittable() {
      this.loading = true;
      try {
        let data = await Coolioo.getCpAssociated(
          (this.curr - 1) * this.pageSize,
          this.pageSize,
          this.hotel2,
          env.locale
        );
        this.tabledata = data.rows;
        this.total = data.total;
        this.loading = false;
      } catch {
        this.loading = false;
        this.$notify.error({
          title: "服务数据异常",
        });
      }
    },
    currentChanges(val) {
      this.curr = val;
      this.inittable();
    },
    sizeChanges(val) {
      this.pageSize = val;
      this.inittable();
    },
  },
  created() {
    this.inittable();
    this.initHotels();
    this.initCategories("");
    this.initCategories2()
    this.initcpnames();
  },
};
</script>

<style scoped>
.el-card {
  margin-bottom: 20px;
}
.el-pagination {
  margin-top: 20px;
}
.el-page-header {
  margin-bottom: 20px;
}
.el-table {
  margin-top: 20px;
}
</style>
