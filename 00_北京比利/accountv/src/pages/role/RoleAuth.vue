<template>
  <div>
    <h2>{{ auth.roleName }}权限</h2>
    <div
      v-for="sys in auth.parentMenuMap"
      :key="sys.menuId"
      style="margin-bottom: 10px"
    >
      <p style="margin-bottom: 0.5rem; font-weight: 700;">
        {{ sys.menuName }}
        <!-- <button class="btn btn-primary btn-sm">全选</button>
                    <button class="btn btn-primary btn-sm ml-1">全不选</button>
                    <button class="btn btn-primary btn-sm ml-1">反选</button> -->
      </p>
      <hr style="margin-bottom: 0.5rem;margin-top: 0rem;" />
      <el-checkbox-group v-model="arr">
        <el-checkbox
          v-for="menu in auth.subMenuMap[sys.menuId]"
          :key="menu.menuId"
          :label="menu.menuId"
          :value="'menu_' + menu.menuId"
          :checked="menu.selected"
          >{{ menu.menuName }}</el-checkbox
        >
      </el-checkbox-group>
    </div>
    <div>
      <el-button type="primary" @click="update">{{
        $t("common.ok")
      }}</el-button>
      <el-button @click="close">{{ $t("common.return") }}</el-button>
    </div>
  </div>
</template>

<script>
import RoleApi from "@/api/RoleApi";

export default {
  name: "RoleAuth",
  data() {
    return {
      auth: {},
      arr: [],
    };
  },
  props: {
    role: Object,
  },
  methods: {
    async update() {
      if (this.arr.length === 0) return;
      let body = {
        count: this.arr.length,
        roleId: this.role.id,
        list: this.arr,
      };
      let father = [];
      for (let key in this.auth.subMenuMap) {
        let data = this.auth.subMenuMap[key];

        this.arr.forEach((idx) => {
          let state = data.find((id) => id.menuId == idx);
          if (state) {
            father.push(Number(key));
          }
        });
      }
      // console.log([...new Set([...body.list, ...father])],'all');
      body.list = [...new Set([...body.list, ...father])];
      body.count = body.list.length
      // console.log(father, "f");
      // console.log(body, "body");
      try {
        await RoleApi.updateAuth(body);
        await this.$info(this.$t("role.confirm.authS"));
        this.refresh();
        this.$emit("close");
      } catch (error) {
        this.$error(this.$t("role.confirm.authF"));
      }
    },
    close() {
      this.$emit("close");
    },
    refresh() {
      RoleApi.auth(this.role.id)
        .then((data) => {
          this.auth = data;
          // console.log(this.auth, '权限数据');
        })
        .catch((err) => this.$error(this.$t("role.confirm.getAuthF")));
    },
  },
  mounted() {
    this.refresh();
  },
};
</script>
