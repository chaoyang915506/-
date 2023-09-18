<template>
  <container>
    <template v-slot:area>
      <!-- <el-page-header
        @back="goback"
        title="首页"
        :content="$t('coolioo.video.bt')"
      ></el-page-header> -->
      <el-card>
        <!-- <el-row>
          <el-page-header @back="goback" title="首页" content="特色视频列表"></el-page-header>
        </el-row> -->
        <div class="h20"></div>
        <el-form :inline="true" :model="form">
          <el-form-item :label="$t('coolioo.group.spmc')">
            <el-input @change="conditionSearch" v-model="videoname"></el-input>
          </el-form-item>
          <el-form-item :label="$t('coolioo.video.spbq')">
            <el-select
              filterable
              @change="conditionSearch"
              v-model="videoCopyright"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option value="">请选择</el-option>
              <el-option
                v-for="item in copyrightlists"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="form">
          <el-form-item :label="$t('coolioo.video.spzt')">
            <el-select
              filterable
              @change="conditionSearch"
              v-model="videoState"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option value="">请选择</el-option>
              <el-option
                v-for="item in videoStatelists"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('coolioo.video.scbs') + '  '">
            <el-select
              filterable
              @change="conditionSearch"
              v-model="videoStyle"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option value="">请选择</el-option>
              <el-option
                v-for="item in stylelists"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card>
        <el-row>
          <el-col :span="20">
            <el-button @click="sendmedia">{{ $t("coolioo.video.xfjz") }}</el-button>
            <el-button @click="online">{{ $t("coolioo.video.sx") }}</el-button>
            <el-button @click="offline">{{ $t("coolioo.video.xx") }}</el-button>
            <el-button @click="deletemedia">{{ $t("coolioo.video.scjdbdjz") }}</el-button>
            <el-button @click="synchronizationprogress">{{ $t("coolioo.video.tbjdck") }}</el-button>
            <el-button @click="mediastatus">{{ $t("coolioo.video.sczt") }}</el-button>
          </el-col>
          <el-col :span="4" class="export">
            <!-- <el-button type="primary">导出</el-button> -->
          </el-col>
        </el-row>
        <div class="h20"></div>
        <el-table
          v-loading="loading"
          :header-cell-style="{ background: '#F7F9FC' }"
          :row-style="{ height: '60px' }"
          border
          :data="tabledata"
          style="width: 100%"
          @selection-change="handleSelection"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column
            align="center"
            type="index"
            :index="
              (val) => {
                return (curr - 1) * pageSize + val + 1;
              }
            "
            :label="$t('coolioo.common.xh')"
            width="80"
          ></el-table-column>
          <!-- <el-table-column align="center" prop="id" :label="$t('coolioo.common.xh')" width="180"> </el-table-column> -->
          <el-table-column width="500" align="center" prop="name" :label="$t('coolioo.group.spmc')">
          </el-table-column>
          <el-table-column align="center" prop="name" :label="$t('coolioo.video.scbs')" width="180">
            <template slot-scope="scope">
              {{ showStyle2(scope.row.cmsMediaStyleDescList) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="id" :label="$t('coolioo.video.spbq')">
            <template slot-scope="scope">
              {{ showCopyright(scope.row.vendorId) }}
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            align="center"
            prop="syncSucc"
            :label="$t('coolioo.video.xfjzcgjdsl')"
          >
            <template slot-scope="scope">
              <span style="cursor: pointer" @click="showCount(scope.row.id)">{{
                scope.row.syncSucc
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            align="center"
            prop="typeId"
            :label="$t('coolioo.video.spzt')"
          >
            <template slot-scope="scope">
              {{ scope.row.status | showState }}
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" prop="id" label="时间">
          <template slot-scope="scope">
            {{ showTime(scope.row.cmsMediaVendor) }}
          </template>
        </el-table-column> -->
          <el-table-column align="center" width="100" :label="$t('coolioo.common.cz')">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">
                {{ $t("coolioo.common.bj") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="h20"></div>
        <div class="blocks">
          <el-pagination
            @current-change="pageChange"
            @size-change="sizeChange"
            :page-size="pageSize"
            background
            layout="total, sizes, prev, pager, next"
            :total="total"
          >
          </el-pagination>
        </div>
      </el-card>

      <!-- 下发介质 -->
      <el-dialog title="选择下发酒店" :visible.sync="sendvisible">
        <el-transfer
          filterable
          :titles="[$t('coolioo.video.l1'), $t('coolioo.video.l2')]"
          :props="{ key: 'hotelId', label: 'hotelName' }"
          v-model="hotels"
          :data="hotellists"
        ></el-transfer>
        <div slot="footer" class="dialog-footer">
          <el-button @click="sendvisible = false">取 消</el-button>
          <el-button type="primary" @click="sendmediaAction">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 删除介质 -->
      <el-dialog title="选择酒店" :visible.sync="deletevisible">
        <el-transfer
          filterable
          :titles="['酒店列表', '选中酒店']"
          :props="{ key: 'hotelId', label: 'hotelName' }"
          v-model="hotels4del"
          :data="hotellists"
        ></el-transfer>
        <div slot="footer" class="dialog-footer">
          <el-button @click="deletevisible = false">取 消</el-button>
          <el-button type="primary" @click="delmediaAction">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 查看同步 -->
      <el-dialog title="选择酒店" :visible.sync="syncvisible">
        <el-transfer
          filterable
          :titles="['酒店列表', '选中酒店']"
          :props="{ key: 'hotelId', label: 'hotelName' }"
          v-model="hotels4sync"
          :data="hotellists"
        ></el-transfer>
        <div slot="footer" class="dialog-footer">
          <el-button @click="syncvisible = false">取 消</el-button>
          <el-button type="primary" @click="showSyncTable">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 同步数据表 -->
      <el-dialog width="80%" title="查看状态" :visible.sync="synctablevisible">
        <div class="mcontainer">
          <div class="mrow">
            <div class="mcol">视频名称</div>
            <div class="mcol" v-for="item in hotels4sync" :key="item">
              {{ showHotelName(item) }}
            </div>
          </div>
          <div class="mrow" v-for="(item, index) in tabledata4state" :key="index">
            <div class="mcol" v-for="item2,idx in item" :key="idx">
              <span style="color: red" v-if="item2 == 0">
                {{ showVideoState(item2) }}
              </span>
              <span style="color: green" v-if="item2 == 1">
                {{ showVideoState(item2) }}
              </span>
              <span style="color: oringe" v-if="item2 == -1">
                {{ showVideoState(item2) }}
              </span>
              <!-- 视频名称 -->
              <span v-else>{{ item2 }}</span>
            </div>
          </div>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="synctablevisible = false">取 消</el-button>
          <el-button type="primary" @click="synctablevisible = false">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 素材状态 -->
      <el-dialog title="素材状态" :visible.sync="statevisible">
        <div class="mcontainer">
          <div class="mrow">
            <div class="mcol">电影名称</div>
            <div class="mcol" v-for="item in materialHeader" :key="item">
              {{ showStyle(item) }}
            </div>
          </div>
          <div class="mrow" v-for="(item, key) in data4material" :key="key">
            <el-tooltip class="item" effect="dark" :content="showVideoName(key)" placement="top">
              <div class="mcol mcolname">
                {{ showVideoName(key) }}
              </div>
            </el-tooltip>
            <div class="mcol" v-for="style in materialHeader" :key="style">
              <el-tag v-for="(tag, idx) in item[style]" :key="idx">
                {{ showLanguage(tag.langId) }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- <el-row>
          <el-col :span="6">电影名称</el-col>
          <el-col :span="3" v-for="item in materialHeader" :key="item">{{
            showStyle(item)
          }}</el-col>
        </el-row>
        <el-row v-for="(item, key) in data4material" :key="key">
          <el-col :span="6">{{ showVideoName(key) }}</el-col>
          <el-col :span="3" v-for="style in materialHeader" :key="style">
            <el-tag v-for="(tag, idx) in item[style]" :key="idx">
              {{ showLanguage(tag.langId) }}
            </el-tag>
          </el-col>
        </el-row> -->
      </el-dialog>

      <!-- 下发介质成功酒店数量 -->
      <el-dialog title="下发介质成功酒店数量" :visible.sync="sendokvisible">
        <el-table :data="table4sendok">
          <el-table-column prop="id" label="序号"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="status" label="名称">
            <template v-slot="scope">
              {{ showVideoState2(scope.row.status) }}
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </template>
  </container>
</template>

<script>
import Container from "@/components/coolioo/Container.vue";
import env from "@/env";
import Coolioo from "@/api/Coolioo";
// import BasicSystem from "@/api/BasicSystem";
import Airlines from "@/api/Airlines";

const STATELIST = [
  { value: 0, label: "下线" },
  { value: 1, label: "上线" },
  { value: 2, label: "待审核" },
  { value: 3, label: "审核通过" },
  { value: 4, label: "审核未通过" },
  { value: 5, label: "已删除" },
];

export default {
  name: "VideoList",
  components: {
    Container,
  },
  data() {
    return {
      form: {},
      sendokvisible: false,
      languagelists: [],
      materialHeader: [],
      data4material: [],
      statevisible: false,
      synctablevisible: false,
      syncvisible: false,
      deletevisible: false,
      hotels4del: [],
      hotels4sync: [],
      hotels: [],
      hotellists: [],
      sendvisible: false,
      selections: [],
      videoname: "",
      // videoState: "",
      videoStyle: "",
      videoCopyright: "",
      copyrightlists: [],
      stylelists: [],
      videoStatelists: [],
      videoState: "",
      loading: false,
      total: 0,
      curr: 1,
      pageSize: 10,
      tabledata: [],
      tabledata4state: [],
      table4sendok: [],
    };
  },
  methods: {
    builddata(data) {
      let obj = {};
      data.map((item) => {
        if (obj.hasOwnProperty(item.oriId)) {
          obj[item.oriId].push(item.status);
        } else {
          obj[item.oriId] = [item.name, item.status];
        }
      });
      return obj;
    },
    goback() {
      this.$router.push({
        path: "/",
        query: {
          token: env.token,
        },
      });
    },
    async showCount(val) {
      this.sendokvisible = true;
      let hotels = this.hotellists.map((item) => item.hotelId);
      let data = {
        hotelIds: hotels,
        resIds: [val],
      };
      let res = await Coolioo.syncState(data);
      this.table4sendok = res.list;
    },
    showVideoName(val) {
      let o = this.tabledata.find((item) => item.id == val) || {};
      return o.name;
    },
    showLanguage(val) {
      let o = this.languagelists.find((item) => item.langId === val) || {};
      return o.langDesc;
    },
    async initLanguagelists() {
      this.languagelists = await Airlines.getLanguageList(env.token);
    },
    async initHotellists() {
      // this.hotellists = await BasicSystem.getHotels(env.token);
      this.hotellists = await Coolioo.getHotellists2549();
    },
    handleEdit(idx, data) {
      let json = JSON.stringify(data);
      localStorage.setItem("cooliooVideoData", json);
      this.$router.push({
        path: "/cmsv/cooliooSpecialVideo/edit.html",
        query: {
          token: env.token,
        },
      });
    },
    async initTable() {
      this.loading = true;
      const res = await Coolioo.specialvideolists((this.curr - 1) * this.pageSize, this.pageSize);
      this.tabledata = res.rows;
      this.total = res.total;
      this.loading = false;
    },
    async initCopyrights() {
      let data1 = await Coolioo.getCopyright(env.token);
      this.copyrightlists = data1.list;
    },
    async initStyle() {
      let data2 = await Coolioo.getStylelists(env.token);
      this.stylelists = data2.list;
    },
    init() {
      this.initTable();
      this.initCopyrights();
      this.initStyle();
      this.videoStatelists = STATELIST;
      this.initHotellists();
      this.initLanguagelists();
    },
    sizeChange(size) {
      this.pageSize = size;
      this.initTable();
    },
    pageChange(curr) {
      this.curr = curr;
      this.initTable();
    },
    showCopyright(val) {
      if (val === null) return "-";
      let r = this.copyrightlists.filter((item) => item.id === val);
      if (r.length === 0) return "-";
      return r[0].name;
    },
    showStyle(val) {
      if (val === null) return "-";
      let r = this.stylelists.filter((item) => item.id == val);
      if (r.length === 0) return "-";
      return r[0].name;
    },
    showStyle2(val) {
      if (val.length === 0) return "-";
      let s = "";
      val.map((item) => {
        s += this.showStyle(item.styleId) + ",";
      });
      return s.substring(0, s.length - 1);
      // return s.trim(",")
    },
    async conditionSearch() {
      this.loading = true;
      let res = await Coolioo.specialvideolists(
        0,
        this.pageSize,
        this.videoname,
        this.videoState,
        this.videoStyle,
        this.videoCopyright
      );
      this.tabledata = res.rows;
      this.total = res.total;
      this.loading = false;
    },
    showTime(val) {
      if (val === null || typeof val === "undefined") return "-";
      return val.startTime;
    },
    handleSelection(val) {
      let data = val.map((item) => {
        return item.id;
      });
      this.selections = data;
    },
    checkstatus(state) {
      let o = this.tabledata.find((item) => {
        if (this.selections.includes(item.id) && item.status === state) {
          return item;
        }
      });
      console.log(o);
      return o;
      // return false;
    },
    async online() {
      if (this.checkstatus(1)) {
        this.$notify.error({
          message: `请勿重复上线视频`,
          title: "错误提示",
        });
        return false;
      }
      if (this.selections.length === 0) {
        this.$notify.error({
          message: `未选择视频`,
          title: "错误提示",
        });
        return false;
      }
      try {
        this.loading = true;
        await Coolioo.online(this.selections);
        this.initTable();
      } catch (e) {
        this.loading = false;
        this.$notify.error({
          message: `${e}`,
          title: "错误提示",
        });
      }
    },
    async offline() {
      if (this.checkstatus(0)) {
        this.$notify.error({
          message: `请勿重复下线线视频`,
          title: "错误提示",
        });
        return false;
      }
      if (this.selections.length === 0) {
        this.$notify.error({
          message: `未选择视频`,
          title: "错误提示",
        });
        return false;
      }
      try {
        this.loading = true;
        await Coolioo.offline(this.selections);
        this.initTable();
      } catch (e) {
        this.loading = false;
        this.$notify.error({
          message: `${e}`,
          title: "错误提示",
        });
      }
    },
    sendmedia() {
      if (this.selections.length === 0) {
        this.$notify.error({
          message: `未选择视频`,
          title: "错误提示",
        });
        return false;
      }
      this.sendvisible = true;
    },
    async sendmediaAction() {
      this.sendvisible = false;
      let data = {
        resIds: this.selections,
        hotelIds: this.hotels,
      };

      try {
        this.loading = true;
        await Coolioo.sendmedia(data);
        this.$notify({
          title: `系统提示`,
          message: `下发成功`,
        });
        this.initTable();
      } catch (e) {
        this.loading = false;
        // console.log(e);
        this.$notify.error({
          message: `${e}`,
          title: "错误提示",
        });
      }
    },
    deletemedia() {
      if (this.selections.length === 0) {
        this.$notify.error({
          message: `未选择视频`,
          title: "错误提示",
        });
        return false;
      }
      this.deletevisible = true;
    },
    async delmediaAction() {
      this.deletevisible = false;
      let data = {
        resIds: this.selections,
        hotelIds: this.hotels,
      };
      try {
        this.loading = true;
        await Coolioo.deletemedia(data);
        this.$notify({
          title: `系统提示`,
          message: `删除成功`,
        });
        this.initTable();
      } catch (e) {
        // console.log(e);
        this.loading = false;
        this.$notify.error({
          message: `${e}`,
          title: "错误提示",
        });
      }
    },
    async mediastatus() {
      if (this.selections.length === 0) {
        this.$notify.error({
          message: `请先选择视频`,
          title: "错误提示",
        });
        return false;
      }
      this.statevisible = true;

      let data = await Coolioo.getMaterialState(this.selections);
      // name style lang[]
      for (let key in data) {
        for (let key2 in data[key]) {
          this.pushHeader(key2);
        }
      }
      this.data4material = data;
    },
    synchronizationprogress() {
      if (this.selections.length === 0) {
        this.$notify.error({
          message: `请先选择视频`,
          title: "错误提示",
        });
        return false;
      }
      this.syncvisible = true;
    },
    async showSyncTable() {
      this.syncvisible = false;
      if (this.hotels4sync.length === 0) {
        this.$notify.error({
          message: `请先选择酒店`,
          title: "错误提示",
        });
        return false;
      }
      this.synctablevisible = true;
      let data = {
        resIds: this.selections,
        hotelIds: this.hotels4sync,
      };
      let data1 = await Coolioo.syncState(data);
      this.tabledata4state = this.builddata(data1.list);
    },
    showHotelName(id) {
      let obj = this.hotellists.find((item) => item.hotelId === id) || {};
      return obj.hotelName;
    },
    showVideoState(status) {
      // console.log(status);
      if (status === -1) return "未开始";
      return "成功";
    },
    showVideoState2(status) {
      if (status === -1) return "未开始";
      if (status === 0) return "成功";
      return "-";
    },
    pushHeader(val) {
      this.materialHeader.push(val);
      this.materialHeader = [...new Set(this.materialHeader)];
    },
  },
  filters: {
    showState(val) {
      let r = STATELIST.filter((item) => item.value === val);
      return r[0].label;
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 96%;
  margin: 0 auto;
}

.title {
  min-height: 40px;
  line-height: 40px;
}
.el-row {
  margin-top: 20px;
}
.h20 {
  width: 100%;
  height: 20px;
}
.pages {
  width: 100%;
  margin-bottom: 50px;
}

// .el-pagination {
//   // text-align: right;
// }
.export {
  text-align: right;
}
.el-tag {
  margin-left: 5px;
}
.el-input {
  width: 217px;
}
.el-card {
  margin-bottom: 20px;
}
.el-page-header {
  margin-bottom: 20px;
}
.underline {
  border-bottom: solid 1px #dcdfe6;
  text-align: center;
  overflow-x: scroll;
}
.mcontainer {
  max-height: 1000px;
  width: 100%;
  overflow: scroll;
}
.mrow {
  width: 100%;
  // height: 60px;
  // line-height: 40px;
  display: flex;
  flex-direction: row;
}
.mcol {
  min-width: 180px;
  height: 60px;
  line-height: 60px;
  overflow: hidden;
}
.mcolname {
  width: 100px;
  overflow: hidden;
}
</style>
