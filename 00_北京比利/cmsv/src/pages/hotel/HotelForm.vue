<template>
  <vo v-slot="{ handleSubmit }">
    <form novalidate @submit.prevent="handleSubmit(submit)" class="row" style="min-width:1000px;">
      <!-- 酒店id -->
      <vp tag="div" v-slot="v" class="form-group col-4" v-if="model.hotelId">
        <label>{{ vendor }}ID</label>
        <input
          disabled
          style="cursor: not-allowed"
          class="form-control"
          v-model="model.hotelId"
          v-validate="v"
          required
        />
      </vp>
      <!-- 名称 -->
      <vp
        tag="div"
        v-slot="v"
        class="form-group col-4"
        :name="vendor + '名称'"
        rules="equals_norequired:1,64"
      >
        <label>{{ vendor }}名称</label>
        <input
          class="form-control"
          :placeholder="'请输入' + vendor + '名称(必填)'"
          v-model="model.hotelName"
          v-validate="v"
          required
        />
        <span class="err">{{ v.errors[0] }}</span>
      </vp>
      <!-- 英文名称 -->
      <vp tag="div" v-slot="v" class="form-group col-4">
        <label>{{ vendor }}英文名称</label>
        <input
          class="form-control"
          :placeholder="'请输入' + vendor + '英文名称'"
          v-model="model.hotelEnName"
          v-validate="v"
        />
      </vp>

      <!-- 是否属于集团酒店 -->
      <vp tag="div" v-slot="v" class="form-group col-4">
        <label>是否属于集团{{ vendor }}</label>
        <div class="row" style="margin-left: 2%;">
          <div class="form-check mb-1 col-6">
            <label class="form-check-label">
              <input
                class="form-check-input"
                type="radio"
                v-model="model.isGrp"
                value="1"
                name="exampleRadios"
                checked
              />
              集团{{ vendor }}
            </label>
          </div>
          <div class="form-check col-6">
            <label class="form-check-label">
              <input
                v-model="model.isGrp"
                class="form-check-input"
                type="radio"
                value="0"
                name="exampleRadios"
              />
              非集团{{ vendor }}
            </label>
          </div>
        </div>
      </vp>
      <!-- 酒店所属集团 -->
      <vp tag="div" v-slot="v" class="form-group col-4" name="集团">
        <label>{{ vendor }}所属集团</label>
        <select
          class="form-control"
          v-model="model.groupId"
          v-validate="v"
          :disabled="model.isGrp == 0 ? true : false"
          :required="model.isGrp == 0 ? false : true"
        >
          <option value="" checked disabled>请添加集团(必选)</option>
          <option :value="it.grpId" v-for="it in groupList" :key="it.grpId">{{
            it.grpName
          }}</option>
        </select>
        <span style="display:block" class="err">{{ v.errors[0] }}</span>
      </vp>
      <!-- 语言 -->
      <vp tag="div" v-slot="v" class="form-group col-4" v-if="!model.hotelId">
        <label>{{ vendor }}语言</label>
        <!--  -->
        <div class="clearfix">
          <span
            v-for="(item, index) in languageList"
            :key="index"
            style="display: block; float: left; padding: 5px"
          >
            <input
              style="vertical-align: -2px"
              type="checkbox"
              class="mr-1"
              v-model="langIds"
              :value="item.langId"
            />{{ item.langLabel }}
          </span>
        </div>
      </vp>
      <!-- 所在城市 -->
      <vp tag="div" v-slot="v" class="form-group col-4" name="城市">
        <label>{{ vendor }}所在城市</label>
        <select class="form-control" required v-model="model.cityId" v-validate="v">
          <option value="" checked>请选择城市(必选)</option>
          <option :value="it.cityId" v-for="it in areaList" :key="it.cityId">{{
            it.cityName
          }}</option>
        </select>
        <span style="display:block" class="err">{{ v.errors[0] }}</span>
      </vp>
      <!-- 酒店级别 -->
      <vp tag="div" v-slot="v" class="form-group col-4" :name="vendor + '级别'">
        <label>{{ vendor }}级别</label>
        <select class="form-control" required v-model="model.hotelLeve" v-validate="v">
          <option value="" selected>请选择{{ vendor }}级别(必选)</option>
          <option value="0">国际五星及以上</option>
          <option value="1">国际四星</option>
          <option value="2">国际四星以下</option>
          <option value="3">内资五星及以上</option>
          <option value="4">内资四星</option>
          <option value="5">内资四星以下</option>
          <option value="6">经济连锁</option>
        </select>
        <span style="display:block" class="err">{{ v.errors[0] }}</span>
      </vp>
      <!-- 酒店状态 -->
      <vp tag="div" v-slot="v" class="form-group col-4" :name="vendor + '状态'">
        <label>{{ vendor }}状态</label>
        <select class="form-control" required v-model="model.hotelStatus" v-validate="v">
          <option value="" selected>请选择{{ vendor }}状态(必选)</option>
          <option value="0">未运营</option>
          <option value="1">运营中</option>
          <option value="2">暂停服务</option>
          <option value="3">未上线</option>
          <option value="4">上线中</option>
          <option value="5">上线完成</option>
        </select>
        <span style="display:block" class="err">{{ v.errors[0] }}</span>
      </vp>
      <!-- 酒店模板 -->
      <vp tag="div" v-slot="v" class="form-group col-4" :name="vendor + '模板'">
        <label>{{ vendor }}模板</label>
        <select class="custom-select" required v-model="model.templateId" v-validate="v">
          <option value="" selected>请选择{{ vendor }}模板 (必选)</option>
          <option v-for="it in templateList" :key="it.templateId" :value="it.templateId">{{
            it.templateName
          }}</option>
        </select>
        <span style="display:block" class="err">{{ v.errors[0] }}</span>
      </vp>
      <!-- 酒店栏目架构 -->
      <vp tag="div" v-slot="v" class="form-group col-4" v-if="!model.hotelId">
        <label>{{ vendor }}栏目架构</label>
        <select class="custom-select" v-model="model.existentHotelId" v-validate="v">
          <option value="" selected>请选择{{ vendor }}栏目架构 (可选)</option>
          <option v-for="it in HotelNameList" :key="it.hotelId" :value="it.hotelId">{{
            it.hotelName
          }}</option>
        </select>
      </vp>
      <!-- 酒店端服务器IP -->
      <vp tag="div" v-slot="v" class="form-group col-4" name="IP">
        <label>{{ vendor }}端服务器IP</label>
        <input
          :placeholder="'请输入' + vendor + '端服务器IP'"
          class="form-control"
          v-validate="v"
          v-model="model.ipAddr"
          :pattern="pattern.IP"
        />
        <span style="display:block" class="err">{{ v.errors[0] }}</span>
      </vp>
      <!-- HTTP端口 -->
      <vp
        tag="div"
        v-slot="v"
        name="HTTP端口号"
        class="form-group col-4"
        rules="equals_norequired:2,8|required"
      >
        <label>HTTP端口</label>
        <input
          :placeholder="'请输入' + vendor + 'HTTP端口'"
          type="text"
          v-model="model.hotelPort"
          :pattern="pattern.HTTP"
          class="form-control"
          v-validate="v"
        />
        <span style="display:block" class="err">{{ v.errors[0] }}</span>
      </vp>
      <!-- 内容上传端口 -->
      <vp tag="div" v-slot="v" class="form-group col-4" name="端口值" rules="equals_norequired:2,8">
        <label>内容上传端口</label>
        <input
          type="text"
          v-model="model.uploadPort"
          :placeholder="'请输入' + vendor + '端内容上传端口'"
          class="form-control"
          v-validate="v"
        />
        <span style="display:block" class="err">{{ v.errors[0] }}</span>
      </vp>
      <!-- 经度 -->
      <vp tag="div" v-slot="v" class="form-group col-4" name="经度">
        <label>经度</label>
        <input
          type="text"
          required
          v-model="model.longitude"
          placeholder="经度数值(如116.23128)"
          class="form-control"
          v-validate="v"
        />
        <span style="display:block" class="err">{{ v.errors[0] }}</span>
      </vp>
      <!-- 纬度 -->
      <vp tag="div" v-slot="v" class="form-group col-4" name="纬度">
        <label>纬度</label>
        <input
          type="text"
          required
          v-model="model.latitude"
          placeholder="纬度数值(如40.22077)"
          class="form-control"
          v-validate="v"
        />
        <span style="display:block" class="err">{{ v.errors[0] }}</span>
      </vp>
      <!-- 联系人姓名 -->
      <vp tag="div" v-slot="v" class="form-group col-4" name="联系人姓名">
        <label>联系人</label>
        <input
          type="text"
          placeholder="请输入联系人(必填)"
          required
          v-model="model.contactor"
          class="form-control"
          v-validate="v"
        />
        <span style="display:block" class="err">{{ v.errors[0] }}</span>
      </vp>
      <!-- 联系电话 -->
      <vp
        tag="div"
        v-slot="v"
        class="form-group col-4"
        name="联系电话"
        rules="numeric|equals_norequired:1,20"
      >
        <label>联系电话</label>
        <input
          type="text"
          placeholder="请输入联系电话(必填)"
          required
          v-model="model.phone"
          class="form-control"
          v-validate="v"
        />
        <span style="display:block" class="err">{{ v.errors[0] }}</span>
      </vp>
      <!-- 联系地址 -->
      <vp tag="div" v-slot="v" class="form-group col-4">
        <label>联系地址</label>
        <input
          type="text"
          v-model="model.addr"
          placeholder="请输入联系地址"
          class="form-control"
          v-validate="v"
        />
      </vp>
      <!-- 邮件地址 -->
      <vp
        tag="div"
        v-slot="v"
        class="form-group col-4"
        rules="email|equals_norequired:1,64"
        name="邮件地址"
      >
        <label>邮件地址</label>
        <input
          type="text"
          placeholder="请输入邮件地址(必填)"
          required
          v-model="model.email"
          class="form-control"
          v-validate="v"
        />
        <span style="display:block" class="err">{{ v.errors[0] }}</span>
      </vp>
      <!-- 传真号 -->
      <vp
        tag="div"
        v-slot="v"
        class="form-group col-4"
        name="传真号"
        rules="equals_norequired:0,20"
      >
        <label>传真号</label>
        <input
          type="text"
          v-model="model.fax"
          placeholder="请输入传真号"
          class="form-control"
          v-validate="v"
        />
        <span style="display:block" class="err">{{ v.errors[0] }}</span>
      </vp>
      <!-- 酒店客房数 -->
      <vp
        tag="div"
        v-slot="v"
        class="form-group col-4"
        rules="numeric|equals_norequired:0,10"
        :name="vendor + '客房数'"
      >
        <label>{{ vendor }}客房数</label>
        <input
          type="text"
          v-model="model.roomNum"
          :placeholder="'请输入' + vendor + '客房数'"
          class="form-control"
          v-validate="v"
        />
        <span style="display:block" class="err">{{ v.errors[0] }}</span>
      </vp>
      <!-- 终端安装数 -->
      <vp
        tag="div"
        v-slot="v"
        class="form-group col-4"
        name="终端安装数"
        rules="numeric|equals_norequired:1,10"
      >
        <label>终端安装数</label>
        <input
          type="text"
          required
          v-model="model.terminalNum"
          placeholder="请输入终端安装数(必填)"
          class="form-control"
          v-validate="v"
        />
        <span style="display:block" class="err">{{ v.errors[0] }}</span>
      </vp>

      <!-- 加密秘钥 -->
      <vp tag="div" v-slot="v" class="form-group col-4">
        <label>加密秘钥</label>
        <input
          type="text"
          v-model="model.secureKey"
          placeholder="请输入加密秘钥"
          class="form-control"
          v-validate="v"
        />
      </vp>
      <!-- 1号终端设备类型 -->
      <vp tag="div" v-slot="v" class="form-group col-4">
        <label>1号终端设备类型</label>
        <select class="form-control" v-validate="v" v-model="model.devType">
          <option value="" checked>请选终端设备类型</option>
          <option v-for="it in deviceList" :key="it.id" :value="it.id">{{ it.name }}</option>
        </select>
      </vp>
      <!-- 2号终端设备类型 -->
      <vp tag="div" v-slot="v" class="form-group col-4">
        <label>2号终端设备类型</label>
        <select class="form-control" v-validate="v" v-model="model.devType1">
          <option value="" checked>请选终端设备类型</option>
          <option v-for="it in deviceList" :key="it.id" :value="it.id">{{ it.name }}</option>
        </select>
      </vp>
      <!-- 3号终端设备类型 -->
      <vp tag="div" v-slot="v" class="form-group col-4">
        <label>3号终端设备类型</label>
        <select class="form-control" v-validate="v" v-model="model.devType2">
          <option value="" checked>请选终端设备类型</option>
          <option v-for="it in deviceList" :key="it.id" :value="it.id">{{ it.name }}</option>
        </select>
      </vp>
      <!-- 描述 -->
      <vp tag="div" v-slot="v" class="form-group col-4" rules="max:400" :name="vendor + '描述'">
        <label>{{ vendor }}描述</label>
        <textarea cols="30" v-model="model.hotelDesc" class="form-control" rows="5"></textarea>
        <span style="display:block" class="err">{{ v.errors[0] }}</span>
      </vp>

      <!-- j酒店logo -->
      <vp class="form-group col-4" tag="div" v-slot="v" :name="vendor + 'logo'" rules="required">
        <label>{{ vendor }}logo</label>
        <cool-file-input
          fileType="image"
          v-requiredSty="v"
          v-model="model.hotelImg"
          :uploadUrl="imageUploadUrl"
        />
        <span class="err">{{ v.errors[0] }}</span>
      </vp>
      <!-- 配置文件 -->

      <vp class="form-group col-4" tag="div" v-slot="v">
        <label>{{ vendor }}配置文件</label>
        <cool-file-input
          fileType="image"
          v-model="model.configFile"
          :uploadUrl="textUploadUrl"
          v-validate="v"
        />
      </vp>
      <!-- 操作指南指示图 -->
      <vp class="form-group col-4" tag="div" v-slot="v">
        <label>{{ vendor }}操作指南指示图</label>
        <cool-file-input
          fileType="image"
          v-model="model.sketch"
          :uploadUrl="imageUploadUrl"
          v-validate="v"
        />
      </vp>

      <div
        class="form-group col-12"
        style="
    text-align: right;"
      >
        <button class="btn btn-secondary mr-2" @click="backTable">返回</button>
        <button class="btn btn-primary mr-1">确认</button>
      </div>
    </form>
    <cool-loading :loading="loading"></cool-loading>
  </vo>
</template>

<script>
import { Pattern } from "@/validation";
import env from "@/env";
import HotelApi from "@/api/HotelApi";
import CoolFileInput from "@/components/CoolFileInput.vue";
import UploadApi from "@/api/UploadApi";
import CoolLoading from "@/components/CoolLoading.vue";
export default {
  name: "HotelForm",
  data() {
    return {
      pattern: Pattern,
      test: "",
      imageUploadUrl: UploadApi.getUrl("image"),
      textUploadUrl: UploadApi.getUrl("text"),
      //   videoUploadUrl: UploadApi.getUrl('video'),
      model: JSON.parse(JSON.stringify(this.editData)),
      vendor: env.vendor,
      areaList: [], //地区的数据
      groupList: [], //集团的数据
      languageList: [], //语言列表
      templateList: [], //模板列表
      HotelNameList: [], //酒店名称列表
      deviceList: [], //设备列表
      loading: false,
      langIds: [], //双向绑定的语言
      cityData: null //{ cityId: '', cityName: '' }
    };
  },
  props: {
    editData: {
      type: Object,
      default: () => ({})
    }
  },
  created() {
    this.getAllData();
  },
  components: { CoolFileInput, CoolLoading },
  computed: {
    cityNameM() {
      let data = this.areaList.find(i => i.cityId == this.model.cityId);
      if (data) {
        return data.cityName;
      } else {
        return "";
      }
    }
  },
  methods: {
    async getAllData() {
      try {
        const area = await HotelApi.getArea();
        // console.log(area, '地区')
        this.areaList = area;

        const group = await HotelApi.getGroup();
        // console.log(group, '集团')
        this.groupList = group;

        const language = await HotelApi.getLanguage();
        // console.log(language, '语言')
        this.languageList = language;

        const template = await HotelApi.getTemplate();
        // console.log(template, '模板')
        this.templateList = template;

        const HotelName = await HotelApi.getHotelName();
        // console.log(HotelName, '酒店名称')
        this.HotelNameList = HotelName;

        const AllDevice = await HotelApi.getAllDevice();
        // console.log(AllDevice, '设备')
        this.deviceList = AllDevice;
      } catch (error) {}
    },
    backTable() {
      this.$emit("close");
    },
    async submit() {
      try {
        if (this.model.hotelId) {
          this.loading = true;
          let editD = {
            ...this.model,
            langIds: this.langIds.join(","),
            code: "edit",
            cityName: this.cityNameM,
            updateId: this.model.hotelId
          };
          // delete editD.hotelId
          delete editD.city;
          delete editD.grpId;
          delete editD.grpId1;
          delete editD.hotelLevel;
          delete editD.hotelImage;
          await HotelApi.saveAddHotel(editD);
          await this.$parent.getHotel();
          this.loading = false;
          await this.$emit("close");
          await this.$info(`编辑${this.vendor}成功`);
        } else {
          if (this.langIds.join(",") == "") return this.$error(`请选择${this.vendor}语言`);
          this.loading = true;
          await HotelApi.saveAddHotel({
            ...this.model,
            langIds: this.langIds.join(","),
            code: "add",
            cityName: this.cityNameM
          });

          await this.$parent.getHotel();
          this.loading = false;
          await this.$emit("close");
          await this.$info(`添加成功`);
        }
      } catch (error) {
        console.log(error);
        this.loading = false;
        this.$error(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.clearfix:after {
  /*伪元素是行内元素 正常浏览器清除浮动方法*/
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.clearfix {
  *zoom: 1; /*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
}
//错误样式
.err {
  font-size: 12px;
  position: absolute;
  width: 100%;
  font-size: 80%;
  color: #dc3545;
}
::v-deep .form-group {
  // margin-bottom: 1.5rem;
}
// 文件的样式
.is-block {
  border: 1px solid red;
  border-radius: 5px;
}
.is-none {
  border: 1px solid #28a745;
  border-radius: 5px;
  // border-color: #28a745;
}
// ::v-deep  .file-preview {
//   padding: 10px 0;
// }
// ::v-deep  .file-drop-zone-title {
//   padding: 0;
//   font-size: 1.1rem;
// }
// ::v-deep .file-drop-zone {
//   border: 0;
// }
// ::v-deep .file-drop-zone.clickable:hover {
//   border: 0;
// }
// .glyphicon-folder-open:before {
//   content: '\e118';
// }
// ::v-deep .krajee-default,
// .file-preview-frame {
//   margin: 0;
//   padding: 0;
//   float: none;
// }
// ::v-deep .file-preview-frame,
// .krajee-default,
// .kv-preview-thumb,
// .file-preview-error {
//   // margin-left: 1%;
//   display: flex;
//   justify-content: center;
//   align-content: center;
// }
// //视频的样式
// ::v-deep .kv-preview-data .file-preview-video {
//   margin-left: 25px;
// }
// ::v-deep video {
//   // max-width: 175px;
//   width: 100%;
//   min-width: 140px;
// }
</style>
