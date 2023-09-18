<template>
  <div class="row" style="padding:30px 0">
    <vo v-slot="{ handleSubmit }" class="col-9">
      <form novalidate @submit.prevent="handleSubmit(submit)">
        <h3
          class="mt-3"
          style="text-align: center;
    transform: translate(-27%, -80%);"
        >
          {{ formData.id ? '编辑' : '新增' }}
        </h3>
        <vp
          class="form-group row"
          style="align-items: center;"
          tag="div"
          v-slot="v"
          name="标题"
          rules="required"
        >
          <label class="col-4 label_required label_right">标题</label>
          <div class="col-8">
            <input
              type="text"
              v-model="formData.title"
              class="form-control"
              v-validate="v"
            />
            <div class="error">{{ v.errors[0] }}</div>
          </div>
        </vp>

        <vp
          class="form-group row"
          style="align-items: center;"
          tag="div"
          rules="required"
          v-slot="v"
          name="状态"
        >
          <label class="col-4 label_required label_right">类型</label>
          <div class="col-8" style="align-items: center;">
            <label class="mr-3 ml-3">
              <input
                v-model="formData.status"
                type="radio"
                name="radiobutton"
                value="103"
                checked
              />
              直播
            </label>
            <label>
              <input
                v-model="formData.status"
                type="radio"
                value="105"
                name="radiobutton"
              />
              回放
            </label>

            <div class="error">{{ v.errors[0] }}</div>
          </div>
        </vp>

        <vp
          class="form-group row"
          style="align-items: center;"
          tag="div"
          rules="required"
          v-slot="v"
          name="分组"
        >
          <label class="col-4 label_required label_right">分组</label>
          <div class="col-8" style="align-items: center;">
            <select
              class="form-control"
              v-model="formData.categoryId"
              v-validate="v"
            >
              <option value="">选择</option>
              <option :value="i.id" v-for="i in groupList" :key="i.id">{{
                i.name
              }}</option>
            </select>
            <div class="error">{{ v.errors[0] }}</div>
          </div>
        </vp>

        <vp
          v-show="formData.status == 103"
          class="form-group row"
          style="align-items: center;"
          tag="div"
          v-slot="v"
          name="直播链接"
          :rules="{ required: formData.status == 103 ? true : false }"
        >
          <label
            :class="[
              'col-4',
              'label_right',
              formData.status == 103 ? 'label_required' : 'null',
            ]"
            >直播链接</label
          >
          <div class="col-8" style="align-items: center;">
            <input
              type="url"
              :pattern="pattern.URL"
              v-model="formData.liveWatchUrl"
              class="form-control"
              v-validate="v"
            />
            <div class="error">{{ v.errors[0] }}</div>
          </div>
        </vp>

        <vp
          v-show="formData.status == 103"
          class="form-group row"
          style="align-items: center;"
          tag="div"
          v-slot="v"
          :rules="{ required: formData.status == 103 ? true : false }"
          name="直播开始时间"
          vid="startTime"
        >
          <label
            :class="[
              'col-4',
              'label_right',
              formData.status == 103 ? 'label_required' : 'null',
            ]"
            >直播开始时间</label
          >
          <div class="col-8" style="align-items: center;">
            <input
              v-validate="v"
              name="startTime"
              type="datetime-local"
              step="1"
              v-model="formData.startTime"
              class="form-control"
            />
            <div class="error">{{ v.errors[0] }}</div>
          </div>
        </vp>

        <vp
          v-show="formData.status == 103"
          class="form-group row"
          style="align-items: center;"
          tag="div"
          v-slot="v"
          name="直播结束时间"
          rules="datediff_to:@startTime"
        >
          <label class="col-4 label_right">直播结束时间</label>
          <div class="col-8" style="align-items: center;">
            <input
              type="datetime-local"
              step="1"
              v-model="formData.endTime"
              class="form-control "
              v-validate="v"
            />
            <div class="error">{{ v.errors[0] }}</div>
          </div>
        </vp>

        <vp
          v-show="formData.status == 105"
          class="form-group row"
          style="align-items: center;"
          tag="div"
          v-slot="v"
          name="回放链接"
          :rules="{ required: formData.status == 105 ? true : false }"
        >
          <label
            :class="[
              'col-4',
              'label_right',
              formData.status == 105 ? 'label_required' : 'null',
            ]"
            >回放链接</label
          >
          <div class="col-8" style="align-items: center;">
            <input
              type="url"
              :pattern="pattern.URL"
              v-model="formData.playbackUrl"
              class="form-control"
              v-validate="v"
            />
            <div class="error">{{ v.errors[0] }}</div>
          </div>
        </vp>

        <vp
          class="form-group row"
          style="align-items: center;"
          tag="div"
          v-slot="v"
          name="回放图片"
          rules="required"
        >
          <label
            class="
              col-4 label_right label_required"
            >图片
          </label>
          <div class="col-8" style="align-items: center;">
            <cool-file-input
              v-model="formData.imgUrl"
              :uploadUrl="picuploadUrl"
              :extensions="extensions"
              fileType="image"
              v-requiredSty="v"
            ></cool-file-input>
            <span class="info"
              >(请上传1080*567,jpg/png文件，且不超过300kb)</span
            >
            <div class="error">{{ v.errors[0] }}</div>
          </div>
        </vp>

        <!-- 操作 -->
        <div class="form-group" style="margin-left:35%">
          <button
            type="button"
            class="btn-secondary btn mr-1"
            @click="$emit('close', 'add')"
          >
            返回
          </button>
          <button type="submit" class="btn btn-primary">
            确定
          </button>
        </div>
      </form>
    </vo>
  </div>
</template>
<script>
import CoolFileInput from '@/components/CoolFileInput.vue'
import UploadApi from '@/api/UploadApi'
import PlayBackGroupApi from '@/api/PlayBackGroupApi'
import { Pattern } from '@/validation'
export default {
  props: {
    groupList: {
      type: Array,
    },
    formd: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      pattern: Pattern,
      picuploadUrl: UploadApi.getUrl('image'),
      extensions: ['jpg', 'png'], //规定上传的格式+
      formData: JSON.parse(JSON.stringify(this.formd)),
    }
  },
  methods: {
    submit() {
      PlayBackGroupApi.addlive(this.formData).then((res) => {
        this.$emit('close', 'form')
        this.$info(this.formData.id ? '编辑成功' : '新增成功')
      })
    },
  },
  components: {
    CoolFileInput,
  },
}
</script>

<style lang="scss" scoped>
.label_right {
  text-align: right;
}
.label_required::before {
  content: '* ';
  color: red;
}
.info {
  font-size: 12px;
  color: black;
}
.error {
  position: absolute;
  font-size: 12px;
  color: red;
}
.is-block {
  border: 1px solid red;
  border-radius: 5px;
}
.is-none {
  border: 1px solid #28a745;
  border-radius: 5px;
  // border-color: #28a745;
}
.form-group {
  margin-bottom: 1.5rem;
}
</style>
