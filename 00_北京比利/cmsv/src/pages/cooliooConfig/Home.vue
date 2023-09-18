<template>
  <container>
    <template v-slot:area>
      <!-- <el-page-header content="Coolioo 配置"> </el-page-header> -->
      <el-card>
        <el-form :inline="true" @submit.native.prevent>
          <el-form-item :label="$t('coolioo.config.jdmc')">
            <el-input @keyup.enter.native="returnfalse" v-model="hotelname" placeholder="酒店名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="search" type="primary">{{$t('coolioo.common.cx')}}</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card>
        <el-table
          v-loading="loading"
          :header-cell-style="{ background: '#F7F9FC' }"
          :row-style="{ height: '60px' }"
          :data="tabledata"
          border
          style="width: 100%"
        >
        <el-table-column
            align="center"
            type="index"
            :index="(val)=>{return (current - 1) * pageSize + val + 1;}"
            :label="$t('coolioo.common.xh')"
            width="80"
          ></el-table-column>
          <!-- <el-table-column align="center" prop="id" :label="$t('coolioo.config.xh')" width="180"> </el-table-column> -->
          <el-table-column align="center" prop="name" :label="$t('coolioo.config.jdmc')"> </el-table-column>
          <el-table-column align="center" prop="vendorSize" :label="$t('coolioo.config.bqsl')"> </el-table-column>
          <el-table-column align="center" prop="mediaSize" :label="$t('coolioo.config.spsl')"> </el-table-column>
          <el-table-column align="center" prop="name" :label="$t('coolioo.config.cz')">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" type="primary">{{$t('coolioo.common.bj')}}</el-button>
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
      loading: false,
      total: 10,
      pageSize: 10,
      current: 1,
      hotelname: "",
      tabledata: [],
    };
  },
  methods: {
    returnfalse(){
      return false
    },
    currentChanges(val) {
      this.current = val;
      this.inittable();
    },
    sizeChanges(val) {
      this.pageSize = val;
      this.inittable();
    },
    search() {
      this.inittable();
    },
    async inittable() {
      this.loading = true;
      let data = await Coolioo.getConfiglists(
        env.token,
        (this.current - 1) * this.pageSize,
        this.pageSize,
        this.hotelname
      );
      this.tabledata = data.rows;
      this.total = data.total;
      this.loading = false;
    },
    edit(data) {
      this.$router.push({
        path: "/cmsv/cooliooConfig/edit.html",
        query: {
          id: data.id,
          token: env.token,
          name: data.name,
        },
      });
    },
  },
  mounted() {
    this.inittable();
  },
};
</script>

<style scoped lang="scss">
.el-col {
  min-height: 40px;
  line-height: 40px;
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
