<template>
  <vo v-slot="{ handleSubmit }">
    <form novalidate @submit.prevent="handleSubmit(submit)">
      <!-- <vp class="form-group" tag="div" v-slot="v">
                <label>旧密码</label>
                <input
                    class="form-control"
                    :value="value.managerAccount"
                    disabled
                />
            </vp> -->
      <vp class="form-group" tag="div" vid="password" v-slot="v">
        <label>新密码</label>
        <input
          type="password"
          class="form-control"
          v-model="newPwd"
          v-validate="v"
          required
          @input="onInput"
          pattern="^[a-zA-Z](?=.+\d)(?=.*\w).*$"
          minlength="10"
          maxlength="16"
        />
      </vp>
      <vp class="form-group" tag="div" v-slot="v" rules="equals_to:@password">
        <label>确认新密码</label>
        <input
          type="password"
          name="密码"
          class="form-control"
          v-model="confirmPwd"
          v-validate="v"
          required
          minlength="10"
          maxlength="16"
        />

        <div class="err">{{ newPassErr }}</div>
        <div class="invalid-feedback">
          {{ v.errors[0] }}
        </div>
      </vp>
      <button type="submit" class="btn btn-primary">确定</button>
      <button type="button" class="btn btn-secondary ml-1" @click="close">
        返回
      </button>
    </form>
  </vo>
</template>

<script>
import md5 from "md5";
export default {
  name: "ManagerPwd",
  props: {
    value: Object,
  },
  data() {
    return {
      oldPwd: "",
      newPwd: "",
      confirmPwd: "",
      newPassErr: "",
    };
  },
  methods: {
    submit() {
      var pass = md5(this.newPwd);
      this.$emit("updatePass", this.newPwd);
      this.close();
    },
    onInput() {
      if (this.newPwd) {
        this.newPassErr = " ";
      }
      var reg1 = new RegExp("^[a-zA-Z]");
      if (!reg1.test(this.newPwd)) {
        this.newPassErr = "必须要字母开头!";
      } else {
        if (this.newPwd.length < 10) {
          this.newPassErr = "密码长度至少为10!";
        } else {
          this.newPassErr = "";
        }
      }
      if (10 <= this.newPwd.length <= 16) {
        reg1 = /\d/;
        if (!reg1.test(this.newPwd)) {
          this.newPassErr = "必须要含有数字!";
        }
      }
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped>
.err {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545;
}
</style>