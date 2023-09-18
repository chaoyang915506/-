<template>
  <vo v-slot="{ handleSubmit }">
    <form
      novalidate
      @submit.prevent="handleSubmit(submit)"
      class="row"
      style="flex-direction: column;align-items: center;"
    >
      <div class="col-12">
        <h2 style="margin-left: 13%">客信管理</h2>
      </div>
      <fieldset :disabled="model.id" class="col-6">
        <vp tag="div" v-slot="v" class="form-group" rules="min_value:1">
          <label>绑定关系</label>
          <select
            class="custom-select"
            v-model="model.relType"
            v-validate="v"
            required
          >
            <option :value="1">房间</option>
            <option :value="2">团客</option>
          </select>
        </vp>
      </fieldset>
      <vp class="form-group col-6" tag="div" v-slot="v">
        <label>类型</label>
        <select
          class="custom-select"
          v-model="model.msgList[0].contentType"
          v-validate="v"
          required
        >
          <option :value="0">文字</option>
          <option :value="3">图片</option>
          <option :value="1">文字及图片</option>
          <option :value="2">文字及视频</option>
        </select>
      </vp>

      <div class="card-header col-12" style="background-color: transparent;">
        <ul
          class="nav nav-tabs card-header-tabs"
          style="justify-content: center;"
        >
          <li
            class="nav-item mr-1"
            v-for="idx in model.msgList"
            :key="idx.langId"
          >
            <a
              class="nav-link"
              @click="tabview = idx.langId"
              :class="[
                { 'active fontColor': tabview === idx.langId },
                {
                  colorError: errorInfo === idx.langId,
                },
              ]"
              href="#"
              >{{ getLangLable(idx.langId) }}</a
            >
          </li>
        </ul>
      </div>
      <div class="card-body col-6">
        <template v-for="itx in model.msgList" v-if="tabview == itx.langId">
          <fieldset v-if="!model.id">
            <vp v-if="model.relType === 1" class="form-group" tag="div">
              <label>选择房间</label>
              <div class="input-group">
                <input
                  class="form-control"
                  disabled
                  :value="modelRoomNumbers"
                />
                <div class="input-group-append">
                  <div class="btn btn-primary" @click="pickRooms">
                    <i class="bi bi-folder"></i>
                  </div>
                </div>
              </div>
              <cool-modal
                :visible="modalVisible"
                @hidden="modalVisible = false"
              >
                <div slot="header">选择房间</div>
                <pick-rooms v-model="roomIdList" />
                <div slot="footer">
                  <div class="btn btn-primary" @click="picked">
                    确定
                  </div>
                  <div
                    class="btn btn-secondary ml-1"
                    @click="modalVisible = false"
                  >
                    关闭
                  </div>
                </div>
              </cool-modal>
            </vp>
            <vp
              v-if="model.relType === 2"
              class="form-group"
              tag="div"
              v-slot="v"
              rules="min_value:1"
            >
              <label>团客</label>
              <select
                class="custom-select"
                v-model="groupGuestId"
                v-validate="v"
              >
                <option :value="0" disabled>请选择</option>
                <option
                  v-for="gg in guestGroups"
                  :key="gg.groupGuestId"
                  :value="gg.groupGuestId"
                >
                  {{ gg.groupGuestName }}
                </option>
              </select>
            </vp>
          </fieldset>
          <vp class="form-group" tag="div" v-slot="v">
            <label>是否启用</label>
            <!-- <select class="custom-select" v-model="itx.isEnable" v-validate="v">
              <option :value="1">是</option>
              <option :value="0">否</option>
            </select> -->
            <div>
              <label class="mr-3">
                <input
                  type="radio"
                  name="01"
                  v-model="itx.isEnable"
                  value="1"
                />&nbsp;&nbsp;是</label
              >
              <label>
                <input
                  type="radio"
                  name="01"
                  v-model="itx.isEnable"
                  value="2"
                />&nbsp;&nbsp;否</label
              >
            </div>
          </vp>
          <vp
            class="form-group"
            tag="div"
            v-slot="v"
            name="标题"
            rules="required"
          >
            <label>标题</label>
            <input
              class="form-control"
              v-model="itx.title"
              v-validate="v"
              maxlength="32"
            />
            <span class="err">{{ v.errors[0] }}</span>
          </vp>
          <vp
            v-if="model.msgList[0].contentType !== 3"
            class="form-group"
            tag="div"
            v-slot="v"
            name="内容"
            rules="required"
          >
            <label>内容</label>
            <textarea
              class="form-control"
              v-model="itx.text"
              v-validate="v"
              maxlength="1024"
            >
            </textarea>
            <span class="err">{{ v.errors[0] }}</span>
          </vp>
          <vp
            v-if="
              model.msgList[0].contentType === 1 ||
                model.msgList[0].contentType === 3
            "
            class="form-group"
            tag="div"
            rules="required"
            v-slot="v"
          >
            <label>图片</label>
            <cool-file-input
              fileType="image"
              v-requiredSty="v"
              :uploadUrl="imgUploadUrl"
              v-model="itx.pic"
            />
            <span class="err">{{ v.errors[0] }}</span>
          </vp>
          <vp
            v-if="model.msgList[0].contentType === 2"
            class="form-group"
            tag="div"
            rules="required"
            v-slot="v"
            name="视频"
          >
            <label>视频</label>
            <cool-file-input
              fileType="video"
              v-requiredSty="v"
              :opts="opt"
              :uploadUrl="videoUploadUrl"
              v-model="itx.video"
            />
            <span class="err">{{ v.errors[0] }}</span>
          </vp>
        </template>
      </div>

      <div class="form-group col-6">
        <button type="submit" class="btn btn-primary">确定</button>
        <button type="button" class="btn btn-secondary ml-1" @click="close">
          返回
        </button>
      </div>
    </form>
  </vo>
</template>

<script>
import CoolFileInput from '@/components/CoolFileInput.vue'
import UploadApi from '@/api/UploadApi'
import { mapState } from 'vuex'
import MessageApi from '@/api/MessageApi'
import PickRooms from './PickRooms.vue'
import CoolModal from '@/components/CoolModal.vue'

export default {
  name: 'MessageForm',
  components: { CoolFileInput, PickRooms, CoolModal },
  props: {
    value: Object,
    hotelIdlangList: Array,
  },
  data() {
    return {
      tabview: 0, //当前语言
      model: JSON.parse(JSON.stringify(this.value)),
      groupGuestId: 0,
      imgUploadUrl: UploadApi.getUrl('image'),
      videoUploadUrl: UploadApi.getUrl('video'),
      modalVisible: false,
      roomIdList: [],
      status: true, //校验
      opt: {
        showClose: false,
        dropZoneEnabled: false,
      },
      errorInfo: '', //报错提示title
    }
  },
  computed: {
    ...mapState(['langs', 'guestGroups', 'rooms']),
    modelRoomNumbers() {
      return this.model.roomIdList.map((roomId) => {
        return this.rooms.find((room) => room.roomId === roomId).roomNumber
      })
    },
  },
  methods: {
    //   查语言
    getLangLable(langId) {
      let dat = this.hotelIdlangList.find((i) => i.langId == langId)
      if (dat) {
        return dat.label
      }
    },
    async submit() {
      if (!this.model.id) {
        for (let i = 0; i < this.model.msgList.length; i++) {
          //   if(this.model.msgList[i].)//文字
          if (this.model.msgList[0].contentType == 0) {
            if (
              this.model.msgList[i].test == '' ||
              this.model.msgList[i].title == ''
            ) {
              this.status = false
              //   console.log(1)
              this.errorInfo = this.model.msgList[i].langId
              break
            }else{
                this.status=true
            }
            //文字和图片
          } else if (this.model.msgList[0].contentType == 1) {
            if (
              this.model.msgList[i].test == '' ||
              this.model.msgList[i].pic == '' ||
              this.model.msgList[i].title == ''
            ) {
              this.errorInfo = this.model.msgList[i].langId
              this.status = false
              break
            }else{
                this.status=true
            }
          } else if (this.model.msgList[0].contentType == 2) {
            if (
              this.model.msgList[i].test == '' ||
              this.model.msgList[i].video == '' ||
              this.model.msgList[i].title == ''
            ) {
              this.errorInfo = this.model.msgList[i].langId
              this.status = false
              break
            }else{
                this.status=true
            }
          } else {
            if (
              this.model.msgList[i].pic == '' ||
              this.model.msgList[i].title == ''
            ) {
              this.errorInfo = this.model.msgList[i].langId
              this.status = false
              break
            }else{
                this.status=true
            }
          }
        }
        if (this.status == false) return this.$error('请输入完整参数')
        // create
        // const body = {
        //   relType: this.model.relType,
        //   groupGuestId: this.groupGuestId,
        //   msgList: [this.model],
        //   roomIdList: this.model.roomIdList,
        // }

        try {
          await MessageApi.create(this.model)
          await this.$info('添加成功')
          this.$emit('change')
          this.close()
        } catch (error) {
          console.error(error)

          this.$error('添加失败')
        }
      } else {
        console.log('编辑了')
        // update
        const body = { ...this.model }
        delete body.roomIdList

        try {
          await MessageApi.update(body)
          await this.$info('修改成功')
          this.$emit('change')
          this.close()
        } catch (error) {
          console.error(error)

          this.$error('修改失败')
        }
      }
    },
    pickRooms() {
      this.roomIdList = this.model.roomIdList

      this.modalVisible = true
    },
    picked() {
      this.modalVisible = false

      this.model.roomIdList = this.roomIdList
      this.roomIdList = []
    },
    close() {
      this.$emit('close')
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .colorError {
  color: #dc356d !important;
  font-weight: 700;
}
</style>
