<template>
  <div
    style="width: 80%;
    margin: auto;"
  >
    <h2>{{ this.model_Tr[0].groupGuestId == "" ? "新增" : "编辑" }}</h2>
    <hr />
    <div class="card-header" style="background-color: #f8f9fa;">
      <ul class="nav nav-tabs card-header-tabs">
        <li class="nav-item" v-for="(item, index) in languagelist" :key="item.langId">
          <a
            class="nav-link"
            @click="tabview = item.langId"
            :class="{ 'active fontColor': tabview === item.langId }"
            >{{ item.label }}</a
          >
        </li>
      </ul>
    </div>
    <div class="card-body">
      <el-form ref="form" size="normal" :model="model">
        <div v-for="(item, index) in model.list" :key="index" v-show="item.langId == tabview">
          <el-form-item
            label="团客分组"
            label-width="80px"
            prop="list[0].groupGuestId"
            :rules="[{ required: true, trigger: 'blur', message: '分组不能为空' }]"
          >
            <el-select
              placeholder="团客分组"
              @change="selectChange"
              :disabled="model_Tr[0].groupGuestId == '' ? false : true"
              v-model="model.list[0].groupGuestId"
            >
              <!-- <el-option>全部房间</el-option> -->
              <el-option
                v-for="guest in guestData"
                :key="guest.groupGuestId"
                :value="guest.groupGuestId"
                :label="guest.groupGuestId == '-1' ? '全部房间' : guest.groupGuestName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="公告标题"
            label-width="80px"
            :prop="`list[${index}].title`"
            :rules="[
              { required: true, trigger: 'blur', message: '公告标题不能为空' },
              { max: 5, trigger: 'blur', message: '公告标题最大长度为5' }
            ]"
          >
            <el-input v-model="item.title" show-word-limit maxlength="5"></el-input>
          </el-form-item>

          <el-form-item
            label="公告内容"
            :prop="'list.' + index + '.text'"
            :rules="[
              { required: true, trigger: 'blur', message: '公告内容不能为空' },
              { max: 200, trigger: 'blur', message: '最多长度只能输入200字' }
            ]"
            label-width="80px"
            class="layout"
          >
            <el-input
              type="textarea"
              resize="none"
              v-model="item.text"
              show-word-limit
              :rows="6"
              maxlength="200"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="显示状态" label-width="80px" :prop="`list[0].isEnable`">
            <el-switch
              v-model="model.list[0].isEnable"
              :active-value="1"
              off-color="#F04134"
              :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
        </div>
        <el-form-item align="center">
          <el-button @click="back">返回</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import NoticeApi from "@/api/NoticeApi";
export default {
  props: {
    languagelist: {
      type: Array,
      default: () => []
    },
    //分组接收
    guestList: {
      type: Array,
      default: () => []
    },
    model_Tr: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tabview: "",
      guestData: JSON.parse(JSON.stringify(this.guestList)),
      model: {
        list: JSON.parse(JSON.stringify(this.model_Tr))
      },
      formRules: {
        room: [{ required: true, trigger: "blur", message: "分组不能为空" }]
      }
    };
  },
  created() {
    this.tabview = this.languagelist[0].langId;
  },
  methods: {
    selectChange(e) {
      if (e == -1) {
        this.$nextTick(() => {
          this.$parent.edit({ row: { groupGuestId: -1 } });
        });
      }
    },
    back() {
      this.$emit("back");
    },
    onSubmit() {
      this.$refs.form.validate(async valid => {
        for (let index = 0; index < this.model.list.length; index++) {
          if (this.model.list[index].text == "") {
            return (this.tabview = this.model.list[index].langId);
          } else if (this.model.list[index].title == "") {
            return (this.tabview = this.model.list[index].langId);
          }
        }
        if (valid) {
          this.model.list.forEach(i=>{
            i['groupGuestId']=this.model.list[0].groupGuestId
          })
          let modelCopy = this.model.list.map((item, idx) => {
            let data = {
              hotelId: item.hotelId,
              langId: item.langId,
              text: item.text,
              title: item.title,
              relType: item.groupGuestId == -1 ? 0 : 2,
              id: item.id,
              isEnable: parseInt(this.model.list[0].isEnable)
            };
            return data;
          });
          if (this.model_Tr[0].groupGuestId == "") {
            await NoticeApi.addFormData({
              group: this.model.list[0].groupGuestId,
              list: modelCopy
            });
            await this.$info("新增公告成功");
          } else {
            await NoticeApi.updateFormData(modelCopy);
            await this.$info("修改公告成功");
          }

          await this.$parent.getallData();
          await this.back();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/public.scss";
::v-deep .el-select {
  width: 50%;
}
::v-deep .el-input {
  width: 70%;
}
::v-deep .el-textarea {
  width: 70%;
}
</style>
