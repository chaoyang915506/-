<template>
  <div class="scroll">

    <div class="container">
      <div class="header">
        <h2>栏目管理</h2>
      </div>
      <hr />
      <!-- <el-divider></el-divider> -->
      <div class="card-body">
        <div>
          <form label-width="120px">
            <div class="form-group row">
              <label class="col-2 col-form-label">栏目名称：</label>
              <div class="col-10">
                <select
                  class="custom-select mb-3"
                  placeholder="请选择栏目"
                  v-model="itemId"
                >
                  <option
                    v-for="(itemHotel, i) in itemHotelList"
                    :key="i"
                    :value="itemHotel.itemId"
                    :label="itemHotel.itemMenuName"
                  />
                </select>
                <!-- <div>itemId: {{itemId}}</div>
                                <div>item: {{item}}</div>
                                <div>formData: {{formData}}</div>
                                <div>itemHotelParam: {{itemHotelParam}}</div>
                                <div>itemHotelParamsOfItem: {{itemHotelParamsOfItem}}</div>
                                <div>itemHotelParams: {{itemHotelParams}}</div> -->
              </div>
            </div>
            <div v-if="itemId">
              <div class="form-group row">
                <label class="col-2 col-form-label">参数类型：</label>
                <div class="col-10">
                  <select
                    class="custom-select mb-3"
                    placeholder="请选择参数类型"
                    v-model="paramType"
                  >
                    <option
                      value="rcmdContent"
                      label="rcmdContent"
                    />
                    <option
                      value="castPic"
                      label="castPic"
                    />
                    <option
                      value="intent"
                      label="intent"
                    />
                  </select>
                </div>
              </div>
              <div v-if="paramType">
                <nav class="nav nav-tabs">
                  <label class="col-form-label">
                    <i
                      class="bi bi-plus-circle col-1 logo changeColor"
                      @click="add"
                    >
                    </i>
                  </label>
                  <div
                    class="nav-item"
                    v-for="(item, i) in formData"
                    :key="i"
                    :label="paramType"
                    :name="'' + i"
                  >
                    <a
                      class="nav-link"
                      href="#content"
                      data-toggle="tab"
                      draggable="true"
                      :class="{ active: activeSysIdx === i }"
                      @click="
                                                getItemNow(i, item);
                                            "
                      @input="getItem(item)"
                    >
                      <span class="nav_title">{{ item.title }}</span>

                      <i
                        class="bi bi-x"
                        @click.stop="remove(i)"
                      ></i>
                    </a>
                    <!-- zclzcl -->

                    <!-- zclzcl -->
                  </div>
                </nav>

                <div class="tab-content">
                  <vo
                    ref="vo"
                    v-slot="{ handleSubmit }"
                  >
                    <form
                      novalidate
                      @submit.prevent="handleSubmit(submit)"
                    >
                      <div
                        style="margin: 20px"
                        class="tab-pane"
                        id="content"
                        :class="{ active: item && activeSysIdx != -1,}"
                      >
                        <div v-if="paramType === 'rcmdContent' && formData.length > 0">
                          <div
                            class="form-group row"
                            :item="item"
                          >
                            <label class="col-2 col-form-label">
                              类型：
                            </label>
                            <div class="col-10">
                              <select
                                class="custom-select"
                                placeholder="请选择类型"
                                v-model="item.type"
                                style="width: 100%"
                              >
                                <option
                                  label="图片"
                                  :value="0"
                                />
                                <option
                                  label="视频"
                                  :value="1"
                                />
                              </select>
                            </div>
                          </div>

                          <div
                            class="form-group row"
                            :item="item"
                          >
                            <label class="col-2 col-form-label">
                              名称：
                            </label>
                            <div class="col-10">
                              <vp
                                class="form-group"
                                v-slot="v"
                              >
                                <input
                             
                                  v-validate="v"
                                  class="form-control"
                                  v-model="item.title"
                                  placeholder="填写名称"
                                  name="title"
                                />
                                 
                                <div class="invalid-feedback">
                                  {{ v.errors[0] }}
                                </div>
                              </vp>
                            </div>
                          </div>
                          <div
                            class="form-group"
                            v-if="item.type === 0"
                            :item="item"
                          >
                            <div class="form-group row">
                              <label class="col-2 col-form-label">
                                图片：
                              </label>
                              <div class="col-10">

                                <cool-file-input
                                  :key="1 + itemId + paramType + fileType_image + activeSysIdx"
                                  :fileType="fileType_image"
                                  :uploadUrl="getUrlPic()"
                                  :extensions="
                                                                            fileType_image ===
                                                                            'object'
                                                                                ? [
                                                                                    'ppt',
                                                                                    'pptx',
                                                                                ]
                                                                                : undefined
                                                                        "
                                  v-model="item.image"
                                />
                              </div>
                            </div>
                          </div>
                          <div
                            v-else
                            class="form-group"
                            :item="item"
                          >
                            <div class="form-group row">
                              <label class="col-2 col-form-label">
                                视频：
                              </label>
                              <div class="col-10">
                                <cool-file-input
                                  :uploadUrl="getUrl()"
                                  :key="2 + itemId + paramType + fileType_video + activeSysIdx"
                                  :fileType="fileType_video"
                                  :extensions="
                                                                            fileType_video ===
                                                                            'object'
                                                                                ? [
                                                                                    'ppt',
                                                                                    'pptx',
                                                                                ]
                                                                                : undefined
                                                                        "
                                  v-model="item.video"
                                  type="video"
                                />
                              </div>
                            </div>
                            <div
                              class="form-group row"
                              :item="item"
                            >
                              <label class="col-2 col-form-label">
                                视频前置图：
                              </label>
                              <div class="col-10">
                                <cool-file-input
                                  :key="3 + itemId + paramType + fileType_image + activeSysIdx"
                                  :fileType="fileType_image"
                                  :extensions="
                                                                            fileType_image ===
                                                                            'object'
                                                                                ? [
                                                                                    'ppt',
                                                                                    'pptx',
                                                                                ]
                                                                                : undefined
                                                                        "
                                  :uploadUrl="getUrlPic()"
                                  v-model="item.videoLoadImg"
                                />
                              </div>
                            </div>
                          </div>
                          <div
                            class="form-group row"
                            :item="item"
                          >
                            <label class="col-2 col-form-label">
                              下方提示图：
                            </label>
                            <div class="col-10">

                              <cool-file-input
                                :uploadUrl="getUrlPic()"
                                :key="4 + itemId + paramType + fileType_image + activeSysIdx"
                                :fileType="
                                                                        fileType_image
                                                                    "
                                :extensions="
                                                                        fileType_image ===
                                                                        'object'
                                                                            ? [
                                                                                'ppt',
                                                                                'pptx',
                                                                            ]
                                                                            : undefined
                                                                    "
                                v-model="item.tipPic"
                              />
                            </div>
                          </div>
                          <div
                            class="form-group row"
                            :item="item"
                          >
                            <label class="col-2 col-form-label">
                              说明：
                            </label>
                            <div class="col-10">
                              <textarea
                                class="form-control"
                                type="textarea"
                                v-model="item.desc"
                                placeholder="填写详细说明"
                              >
                                                            </textarea>
                            </div>
                          </div>
                          <div class="form-group row">
                            <button
                              type="submit"
                              class="btn btn-primary"
                            >
                              确定
                            </button>
                          </div>
                        </div>
                        <div v-else-if="paramType === 'castPic' && formData.length > 0">
                          <div
                            class="form-group row"
                            :item="item"
                          >
                            <label class="col-2 col-form-label">
                              投屏等待图：
                            </label>
                            <div class="col-10">
                              <cool-file-input
                                :key="1 + itemId + paramType + fileType_image"
                                :fileType="fileType_image"
                                :uploadUrl="getUrlPic()"
                                :extensions="
                                                                    fileType_image ===
                                                                    'object'
                                                                        ? [
                                                                            'ppt',
                                                                            'pptx',
                                                                        ]
                                                                        : undefined
                                                                "
                                v-model="item.wait"
                              />
                            </div>
                          </div>
                          <div
                            class="form-group row"
                            :item="item"
                          >
                            <label class="col-2 col-form-label">
                              投屏失败图：
                            </label>
                            <div class="col-10">
                              <cool-file-input
                                :key="2 + itemId + paramType + fileType_image"
                                :fileType="fileType_image"
                                :uploadUrl="getUrlPic()"
                                :extensions="
                                                                    fileType_image ===
                                                                    'object'
                                                                        ? [
                                                                            'ppt',
                                                                            'pptx',
                                                                        ]
                                                                        : undefined
                                                                "
                                v-model="item.fail"
                              />
                            </div>
                          </div>
                          <div class="form-group row">
                            <button
                              type="submit"
                              class="btn btn-primary"
                            >
                              确定
                            </button>
                          </div>
                        </div>

                        <div v-else-if="paramType === 'indent' && formData.length > 0">
                          <div
                            class="form-group row"
                            :item="item"
                          >
                            <label class="col-2 col-form-label">
                              包名(packageName)：
                            </label>
                            <div class="col-10">
                              <vp
                                rules="required"
                                class="form-group"
                                v-slot="v"
                              >
                                <input
                                  v-validate="v"
                                  class="form-control"
                                  v-model="item.packageName"
                                  placeholder="填写包名"
                                  required
                                  name="packageName"
                                />
                                <div class="invalid-feedback">
                                  {{ v.errors[0] }}
                                </div>
                              </vp>
                            </div>
                          </div>
                          <div
                            class="form-group row"
                            :item="item"
                          >
                            <label class="col-2 col-form-label">
                              类名(className)：
                            </label>
                            <div class="col-10">
                              <vp
                                rules="required"
                                class="form-group"
                                v-slot="v"
                              >
                                <input
                                  v-validate="v"
                                  class="form-control"
                                  v-model="item.className"
                                  placeholder="填写类名"
                                  required
                                  name="className"
                                />
                                <div class="invalid-feedback">
                                  {{ v.errors[0] }}
                                </div>
                              </vp>
                            </div>
                          </div>
                          <div class="form-group row">
                            <button
                              type="submit"
                              class="btn btn-primary"
                            >
                              确定
                            </button>
                          </div>
                        </div>
                      </div>

                    </form>
                  </vo>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/api/Api"
import ItemHotelApi from "@/api/ItemHotelApi"
import ItemHotelParamApi from "@/api/ItemHotelParamApi"
import UploadApi from "@/api/UploadApi"
// import MyUpload from "@/components/MyUpload.vue";
import CoolFileInput from "@/components/CoolFileInput.vue"
import { mapState, mapActions } from "vuex"
import env from "@/env"

class RcmdContent {
  constructor() {
    this.type = 0
    this.image = ""
    this.video = ""
    this.title = "rcmdContent"
    this.desc = ""
    this.videoLoadImg = ""
    this.tipPic = ""
    this.num = 1
  }
}

class CastPic {
  constructor() {
    this.title = "castPic"
    this.wait = ""
    this.fail = ""
    this.num = 1
  }
}
class Indent {
  constructor() {
    this.title = "indent"
    this.packageName = ""
    this.className = ""
    this.num = 1
  }
}
class ItemHotelParam {
  constructor() {
    this.id = 0
    this.hotelId = 0
    this.itemId = 0
    this.type = 0
    this.key = ""
    this.value = ""
  }
}

export default {
  name: "HotelItemApp",
  components: { CoolFileInput },
  data () {
    return {
      fileType_image: 'image',
      fileType_video: 'video',
      activeSysIdx: -1,
      item: new RcmdContent(),
      // formDataIndex: -1,
      tabIdx: '',
      formData: [new RcmdContent()],
      // formData: [new RcmdContent(), new CastPic()],
      itemId: undefined,
      paramType: undefined,
      itemHotelParam: new ItemHotelParam(),
      itemHotelParamsOfItem: [new ItemHotelParam()],
      submit_executing: false
    }
  },
  computed: {
    homePageItemIds () {
      return this.$store.state.itemHotelList
        .filter(v => v.itemBasicId === 2)
        .map(v => v.itemId)
    },
    itemHotelParams () {
      // return this.$store.state.itemHotelParams.filter(
      //     v => v.key === "rcmdContent"
      // );
      return this.$store.state.itemHotelParams
    },
    itemHotelList () {
      var list = this.$store.state.itemHotelList.filter(
        v => this.homePageItemIds.indexOf(v.parentItemId) !== -1
      )
      if (list.length > 0) {
        this.itemId = list[0].itemId
      }
      return list
    }
  },
  watch: {
    itemId (_new) {
      // let itemHotelParam = this.itemHotelParams.find(
      //        v => v.itemId === _new
      // );
      let itemHotelParamsOfItem = this.itemHotelParams.filter(
        v => v.itemId === _new
      )
      if (itemHotelParamsOfItem.length !== 0) {
        this.itemHotelParamsOfItem = itemHotelParamsOfItem
      } else {
        this.itemHotelParamsOfItem = [new ItemHotelParam()]
      }
      this.tabIdx = "0"
      if (this.paramType !== undefined) {
        let itemHotelParam = this.itemHotelParamsOfItem.find(
          v => v.key === this.paramType
        )
        this.initData(itemHotelParam, this.paramType)
      }
    },
    paramType (_new) {
      // this.item = this.getObject(_new);

      let itemHotelParam = this.itemHotelParamsOfItem.find(
        v => v.key === _new
      )
      // console.log(itemHotelParam)
      this.initData(itemHotelParam, _new)
    }
  },
  methods: {
    getUrlPic () {
      return UploadApi.getUrl('image')
    },
    getUrl () {
      return UploadApi.getUrl('video')
    },
    // 从数据库中取数据，初始化参数
    initData (itemHotelParam, newParamType) {
      // 设置this.formData
      if (itemHotelParam) {
        this.itemHotelParam = itemHotelParam
        this.formData = this.getFormData(itemHotelParam)
      } else {
        this.itemHotelParam = new ItemHotelParam()
        this.formData = []
      }
      // 设置this.item
      if (this.formData.length !== 0) {
        this.item = this.formData[0]
        this.activeSysIdx = 0
      } else {
        this.item = this.getObject()
        this.activeSysIdx = -1
      }
    },
    getFormData (itemHotelParam) {
      if (itemHotelParam.type === "jsonArray") {
        return JSON.parse(itemHotelParam.value)
      }
      else {
        return [JSON.parse(itemHotelParam.value)]
      }
    },
    // return JSON.stringify(this.formData)或者JSON.stringify(this.item)
    getValue () {
      if (this.itemHotelParam.type === "jsonArray") {
        return JSON.stringify(this.formData)
      }
      else {
        return JSON.stringify(this.formData[0])
      }
    },
    // return "jsonArray"或者"json"
    getType () {
      if (this.paramType === "rcmdContent") {
        return "jsonArray"
      }
      else {
        return "json"
      }
    },
    // 根据paramType取相应的新创建实例
    getObject (newParamType) {
      if (newParamType === undefined) {
        var type = this.paramType
      }
      else {
        var type = newParamType
      }

      if (type === "rcmdContent") {
        var rcmdContent = new RcmdContent()
        return rcmdContent
      }
      else if (type === "castPic") {
        var castPic = new CastPic()
        return castPic
      }
      else if (type === "indent") {
        var indent = new Indent()
        return indent
      }
    },
    getItem (item) {
      this.item = this.getObject()
      this.item = item
    },
    getItemNow (i, item) {
      this.getItem(item)
      this.activeSysIdx = i
      this.tabIdx = this.item.num
    },
    ...mapActions({
      refresh: "refreshItemHotelParams"
    }),
    add () {
      var type = this.getType()
      if (type === "json" && this.formData.length === 1) {
        swal({
          text: "该字段不支持多条记录",
          buttons: "确定"
        })
        return
      }
      var p = this.getObject()
      p.num = this.formData.length + 1
      this.formData.push(p)
      if (this.formData.length === 1) {
        this.item = this.formData[0]
      }
    },
    remove (number) {
      if (this.formData.length === 1 && this.itemHotelParam.id !== 0) {
        swal({
          title: "确认删除数据库字段" + this.item.title + "？",
          text: "这是最后一条喽，数据库中存在对应记录，直接删除记录吗？",
          icon: "warning",
          buttons: true,
          buttons: ["取消", "确定"],
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            this.delete(number)
            ItemHotelParamApi.delete([this.itemHotelParam.id])
              .then(data => swal("成功删除字段!", { icon: "success" }))
              .then(this.refresh)
              .then(data => {
                this.itemHotelParamsOfItem = this.itemHotelParams.filter(
                  v => v.itemId === this.itemId
                )
                this.itemHotelParam = this.itemHotelParamsOfItem.find(
                  v => v.key === this.paramType
                )
                if (!this.itemHotelParam) {
                  this.itemHotelParam = new ItemHotelParam()
                }
              })
          } else {
            swal("取消删除字段，返回！")
          }
        })
      }
      else {
        this.delete(number)
        // swal({
        //     title: "确认关闭" + this.item.title + "？",
        //     text: "一旦关闭，你将无法恢复！",
        //     icon: "warning",
        //     buttons: true,
        //     buttons: ['取消', '确定'],
        //     dangerMode: true,
        // })
        //     .then((willDelete) => {
        //         if (willDelete) {
        //             swal("成功关闭!", {
        //                 icon: "success",
        //             });
        //             this.delete(number);
        //         } else {
        //             swal("取消关闭!");
        //         }
        //     });
      }
    },

    delete (number) {
      this.formData.splice(number, 1)
      //删除最后面的
      if (number == this.formData.length && this.formData.length != 0) {
        this.item = this.formData[number - 1]
        this.activeSysIdx = number - 1
        return this.item
      }
      //只有一个的
      if (this.formData.length == 0) {
        this.item = new RcmdContent()
        this.activeSysIdx = -1
        return this.item
      }
      else {
        this.item = this.formData[number]
        return this.item
      }
      //下面那个能成，传进来的值是：前面那个是item.num，后面那个是number
      // for (var i = 0; i < this.formData.length; i++) {
      //     if (this.formData[i].num == number) {
      //         this.formData.splice(i, 1)
      //         
      //         if (i == this.formData.length && this.formData.length != 0) {
      //             alert('1')
      //             this.item=this.formData[i-1]
      //             return
      //         }
      //         
      //         if (this.formData.length == 0) {
      //             alert('2')
      //             this.item = ''
      //             return
      //         }
      //         else{
      //             this.item=this.formData[i]
      //             return
      //         }
      //     }
      // }
    },

    submit () {
      if (this.submit_executing){
          return 
      }else{
          this.submit_executing = true
      }

      if (this.itemHotelParam.id === 0) {
          
          this.itemHotelParam.hotelId = env.hotelId;
          // this.itemHotelParam.hotelId = 3;
          this.itemHotelParam.itemId = this.itemId;
          this.itemHotelParam.type = this.getType();
          this.itemHotelParam.key = this.paramType;
          this.itemHotelParam.value = this.getValue();

          // console.log(this.itemHotelParams)
          ItemHotelParamApi.create(this.itemHotelParam)
              .then(data => {
                  swal({
                      text: "添加成功",
                      icon: 'success',
                      buttons: '确定'
                  })
                  .then(this.refresh)
                  .then(data => {
                          this.itemHotelParamsOfItem = this.itemHotelParams.filter(
                              v => v.itemId === this.itemId
                          );
                          this.itemHotelParam = this.itemHotelParamsOfItem.find(
                              v => v.key === this.paramType
                          );
                          this.formData = this.getFormData(this.itemHotelParam);
                          this.item = this.formData[0];
                          this.activeSysIdx = 0;
                          this.submit_executing = false;
                  })
                  // this.$alert("添加成功", "").then(this.refresh);
              }); 
      } else {
          this.itemHotelParam.value = this.getValue();
          
          ItemHotelParamApi.update(this.itemHotelParam)
              .then(data => {
                  
                  swal({
                      text: "添加成功",
                      icon: 'success',
                      buttons: '确定'
                  }).then(this.refresh)
                  // this.$alert("添加成功", "").then(this.refresh);
                  .then(data => {
                          this.itemHotelParamsOfItem = this.itemHotelParams.filter(
                              v => v.itemId === this.itemId
                          );
                          this.itemHotelParam = this.itemHotelParamsOfItem.find(
                              v => v.key === this.paramType
                          );
                          this.formData = this.getFormData(this.itemHotelParam);
                          this.item = this.formData[0];
                          this.activeSysIdx = 0;
                          this.submit_executing = false;
                  })
              })
      }

    }
  },
  created () {
    this.paramType = "rcmdContent"
  }
};
</script>

<style lang="scss" scoped>
.el-tabs--border-card {
  padding: 5px;
  margin-bottom: 20px;
}
.logo {
  font-size: 15px;
}
.nav-tabs .nav-link {
  color: var(--dark);
  &.active {
    color: var(--blue);
  }
}
.changeColor:hover {
  color: var(--blue);
}
.bi-x {
  float: right;
}
.nav_title {
  margin-right: 20px;
}
button {
  margin-left: 19%;
}

.scroll {
  overflow: scroll;
  height: 100%;
}
</style>