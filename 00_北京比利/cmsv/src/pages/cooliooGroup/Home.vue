<template>
  <container>
    <!-- <template v-slot:header>
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>视频版权管理</el-breadcrumb-item>
        <el-breadcrumb-item>分组管理</el-breadcrumb-item>
      </el-breadcrumb>
    </template> -->
    <template v-slot:area>
      <div class="areas">
        <el-page-header @back="goback" :content="$t('coolioo.group.title')"> </el-page-header>
        <!-- <el-row>
          <el-col :span="4">
            <el-button @click="dialogFormVisible = true" type="primary">添加分组</el-button>
          </el-col>
        </el-row> -->

        <el-card>
          <el-table
            v-loading="loading1"
            class="defaulttable"
            ref="t"
            :header-cell-style="{ background: '#F7F9FC' }"
            :row-style="{ height: '60px' }"
            :data="tabledata"
            border
            style="width: 100%"
            :row-key="randomKey"
          >
            <el-table-column
              class-name="dragItem"
              align="center"
              prop=""
              :label="$t('coolioo.group.px')"
              width="180"
            >
              <i class="el-icon-rank"></i>
            </el-table-column>
            <el-table-column
            align="center"
            type="index"
            :index="(val)=>{return (curr - 1) * pageSize + val + 1;}"
            :label="$t('coolioo.common.xh')"
            width="80"
          ></el-table-column>
            <!-- <el-table-column align="center" prop="id" :label="$t('coolioo.group.xh')" width="180"> -->
            <!-- </el-table-column> -->
            <el-table-column align="center" prop="id" :label="$t('coolioo.group.fzmc')">
              <template slot-scope="scope">
                {{ scope.row.cmsMediaTypeLangs | showLang }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="id" :label="$t('coolioo.group.spsl')">
              <template slot-scope="scope">
                {{ scope.row.metas.length }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="id" :label="$t('coolioo.group.cz')">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">{{
                  $t("coolioo.group.bj")
                }}</el-button>
                <el-button type="primary" size="mini" @click="showVideo(scope.$index, scope.row)">{{
                  $t("coolioo.group.cksp")
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
      </div>
      <!-- 添加开始 -->
      <el-dialog title="添加分组" :visible.sync="dialogFormVisible">
        <el-form>
          <el-form-item label="" :label-width="formLabelWidth">
            <multiple-lang :lists="langlists"></multiple-lang>
          </el-form-item>

          <el-form-item
            v-show="item.status"
            v-for="(item, idx) in langlists"
            :key="idx"
            :label="item.langDesc"
            :label-width="formLabelWidth"
          >
            <el-input v-model="item.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{ $t("coolioo.common.qx") }}</el-button>
          <el-button type="primary" @click="create">{{ $t("coolioo.common.qd") }}</el-button>
        </div>
      </el-dialog>
      <!-- 添加结束 -->

      <!-- 编辑开始 -->
      <el-dialog title="编辑分组" :visible.sync="editVisible">
        <el-form>
          <el-form-item label="" :label-width="formLabelWidth">
            <multiple-lang :lists="edit.lang"></multiple-lang>
          </el-form-item>

          <el-form-item
            v-show="item.status"
            v-for="(item, idx) in edit.lang"
            :key="idx"
            :label="item.langDesc"
            :label-width="formLabelWidth"
          >
            <el-input v-model="item.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">{{ $t("coolioo.common.qx") }}</el-button>
          <el-button type="primary" @click="update">{{ $t("coolioo.common.qd") }}</el-button>
        </div>
      </el-dialog>
      <!-- 编辑结束 -->

      <!-- 查看视频BEGIN -->
      <el-dialog :title="videoTitle + '视频分组'" :visible.sync="videoVisible">
        <el-table class="videotable" :data="videoData" height="250" border style="width: 100%">
          <el-table-column
            class-name="dragItem"
            prop="id"
            :label="$t('coolioo.group.xh')"
            width="180"
            :row-key="randomKey"
          >
            <i class="el-icon-rank"></i>
          </el-table-column>
          <el-table-column prop="id" :label="$t('coolioo.group.xh')" width="180"> </el-table-column>
          <el-table-column prop="name" :label="$t('coolioo.group.spmc')"> </el-table-column>
        </el-table>
      </el-dialog>
      <!-- 查看视频END -->
    </template>
  </container>
</template>
<script>
import Container from "@/components/coolioo/Container.vue";
import Sortable from "sortablejs";
import MultipleLang from "../cooliooSpecialVideo/MultipleLang.vue";
import Airlines from "@/api/Airlines";
import env from "@/env";
import Coolioo from "@/api/Coolioo";
import common from "@/common";

export default {
  components: {
    Container,
    MultipleLang,
  },
  name: "Home",
  data() {
    return {
      loading1: false,
      curr: 1,
      pageSize: 10,
      total: 1000,
      videoData: [],
      videoTitle: "",
      videoVisible: false,
      editVisible: false,
      langlists: [],
      originlanglists: [],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      bak: [],
      tabledata: [],
      video: {
        title: "xx分组",
      },
      edit: {
        lang: [],
        data: {},
      },
    };
  },
  methods: {
    goback() {
      window.history.back();
    },
    initDrag(classname) {
      let self = this;
      this.$nextTick(function () {
        let tableDom = document.querySelector(`${classname} .el-table__body-wrapper tbody`);
        new Sortable(tableDom, {
          animation: 150,
          ghostClass: "blue-background-class",
          handle: ".dragItem",
          invertSwap: true,
          onEnd: function (evt) {
            var item = evt.item;
            self.reSort(evt.oldIndex, evt.newIndex);
          },
        });
      });
    },
    initDrag2(classname) {
      let self = this;
      this.$nextTick(function () {
        let tableDom = document.querySelector(`${classname} .el-table__body-wrapper tbody`);
        new Sortable(tableDom, {
          animation: 150,
          ghostClass: "blue-background-class",
          handle: ".dragItem",
          invertSwap: true,
          onEnd: function (evt) {
            var item = evt.item;
            self.reSort2(evt.oldIndex, evt.newIndex);
          },
        });
      });
    },
    async reSort2(before, after) {
      let originData = JSON.parse(JSON.stringify(this.videoData));
      let pageData = originData.splice((this.curr - 1) * this.pageSize, this.pageSize);

      let weight = [];
      let copy = pageData.map((item) => {
        let sort = item.relSort || 0;
        weight.push(sort);
        return item;
      });
      let tmp = copy[before];
      // 删除 原数据
      copy.splice(before, 1);
      // 复制数据，到目标之后
      copy.splice(after, 0, tmp);
      copy.map((item, idx) => {
        item.sort = weight[idx];
        pageData[idx] = item;
      });

      let postData = pageData.map((item) => {
        let node = {
          id: item.id,
          sort: item.relSort,
        };
        return node;
      });

      await Coolioo.videoSort(postData);
      // this.videoVisible = false;
      // this.init();
    },
    openDrag() {
      this.initDrag(".defaulttable");
    },
    async reSort(before, after) {
      let originData = JSON.parse(JSON.stringify(this.tabledata));
      let pageData = originData.splice((this.curr - 1) * this.pageSize, this.pageSize);

      let weight = [];
      let copy = pageData.map((item) => {
        let sort = item.sort || item.relSort || 0;
        weight.push(sort);
        return item;
      });
      let tmp = copy[before];
      // 删除 原数据
      copy.splice(before, 1);
      // 复制数据，到目标之后
      copy.splice(after, 0, tmp);


      copy.map((item, idx) => {
        item.sort = weight[idx];
        pageData[idx] = item;
      });

      let postData = pageData.map((item) => {
        let node = {
          id: item.id,
          sort: item.sort,
        };
        return node;
      });

      await Coolioo.updateSort(env.token, postData);
      this.init();
    },
    randomKey() {
      return "rk" + Math.floor(Math.random(1000) * 1000000);
    },
    async init() {
      this.loading1 = true;
      const langdatas = await Airlines.getLanguageList(env.token);
      const datas = langdatas.map((item) => {
        item.status = item.langId === 0 || item.langId === 1 ? true : false;
        item.name = "";
        return item;
      });
      // this.langlists = [...datas];
      // this.originlanglists = [...datas];

      this.langlists = JSON.parse(JSON.stringify(datas));
      this.originlanglists = JSON.parse(JSON.stringify(datas));

      let metaType = common.getParameter("metaType");
      let group = await Coolioo.getGroup(
        env.token,
        25,
        (this.curr - 1) * this.pageSize,
        this.pageSize,
        metaType
      );
      this.total = group.total;
      this.tabledata = group.rows || [];
      this.loading1 = false;
    },
    async create() {
      this.dialogFormVisible = false;
      let data = {
        metaType: 25,
        status: 1,
        typeClass: 1,
        cmsMediaTypeLangs: [],
      };
      this.langlists.map((item) => {
        if (item.status === true) {
          let node = {
            langId: item.langId,
            name: item.name,
          };
          data.cmsMediaTypeLangs.push(node);
        }
      });
      await Coolioo.createGroup(env.token, data);

      this.init();
    },
    handleEdit(idx, data) {
      this.editVisible = true;
      let { cmsMediaTypeLangs } = data;
      this.edit.data = data;
      let langIds = [];
      cmsMediaTypeLangs.map((item) => {
        langIds.push(item.langId);
      });

      this.edit.lang = JSON.parse(JSON.stringify(this.originlanglists));
      this.edit.lang.map((item) => {
        if (langIds.includes(item.langId)) {
          item.status = true;
          let obj = cmsMediaTypeLangs.filter((items) => items.langId === item.langId);
          item.id = obj[0].id;
          item.name = obj[0].name;
        } else {
          item.id = "";
        }
      });
    },
    async update() {
      let self = this;
      let cmsMediaTypeLangs = [];
      this.edit.lang.map((item) => {
        if (item.status === true) {
          let node = {
            mediaTypeId: self.edit.data.id,
            langId: item.langId,
            name: item.name,
            id: item.id,
          };
          cmsMediaTypeLangs.push(node);
        }
      });

      this.edit.data.cmsMediaTypeLangs = cmsMediaTypeLangs;
      await Coolioo.updateGroup(env.token, this.edit.data);
      this.editVisible = false;
      this.init();
    },
    showVideo(id, rowdata) {
      this.videoVisible = true;
      let locale = env.locale || 0;
      this.videoTitle = rowdata.cmsMediaTypeLangs[locale].name;

      this.videoData = rowdata.metas;

      this.initDrag2(".videotable");
    },
    sizeChanges(size) {
      this.pageSize = size;
      this.init();
    },

    currentChanges(curr) {
      this.curr = curr;
      this.init();
    },
  },
  filters: {
    showLang: function (value) {
      let langId = +env.locale || 0;
      let r = value.filter((item) => {
        return item.langId === langId;
      });
      return r[0].name;
    },
  },
  mounted() {
    this.openDrag();
    this.init();
  },
};
</script>

<style scoped lang="scss">
.el-row {
  margin-top: 40px;
}

.el-table {
  margin-top: 20px;
}

.blue-background-class {
  background-color: blue;
}
.el-pagination {
  margin-top: 20px;
  // text-align: right;
}
.el-card {
  margin-top: 20px;
}
</style>
