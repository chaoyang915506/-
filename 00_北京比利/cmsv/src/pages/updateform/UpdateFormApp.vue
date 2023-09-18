<template>
  <div
    class="container-fluid mt-3 boxt"
    style=" overflow:auto; width:100%; height:100%;"
  >
    <div>
      <h3>版本上传</h3>
    </div>
    <!-- <div class="card"> -->
    <!-- <div class="card-header">
        版本上传
      </div> -->
    <!-- <div class="card-body"> -->
    <vo v-slot="{ handleSubmit }">
      <form
        class="formsty"
        novalidate
        @submit.prevent="handleSubmit(submit)"
      >
        <!--   @submit.prevent -->
        <div class="row">
          <div class="left col-6">
            <div class="form-group row mt-5">
              <label class="col-form-label col-lg-5 col-sm-5"></label>
              <div class=" col-lg-7 col-lg-7">
                <h4>新版本上传</h4>
              </div>
            </div>
            <!-- 应用名称 -->
            <div class="form-group row mt-5">
              <label class="col-form-label col-lg-5 col-sm-5">应用名称</label>
              <div class=" col-lg-7 col-lg-7">
                <input
                  v-model="appName"
                  class="form-control"
                />
              </div>
            </div>
            <!-- 应用版本号 -->
            <div class="form-group row mt-4">
              <label class="col-form-label col-lg-5 col-sm-5">应用版本号</label>
              <div class=" col-lg-7 col-lg-7 appseeting">
                <input
                  v-model="appVersion"
                  class="form-control"
                />
                <div class="appinfo"> *请务必输入正确的版本号，否则将导致设备循环重启!!!</div>
              </div>
            </div>
            <!-- 上传应用 -->
            <div
              class="form-group row mt-4 "
             
            >
              <label class="col-form-label col-lg-5 col-sm-5">上传应用</label>
              <div class=" col-lg-7 col-lg-7">
                <div class="form-inline">
                  <input
                    type="file"
                    accept=".ipa,.apk"
                    style="display:none"
                    ref="files"
                    @change="file1"
                  >
                  <input
                    disabled
                    v-model="fileName1"
                    id='location'
                    class="form-control "
                    style="width:50%"
                  >
                  <label class="input-group-btn">
                    <input
                      type="button"
                      id="i-check"
                      value="选择文件"
                      class="btn btn-primary btnsty"
                      @click="clickflie1"
                    >
                  </label>
                </div>
              </div>
            </div>
            <!-- 固件升级包名称 -->
            <div class="form-group row mt-5">
              <label class="col-form-label col-lg-5 col-sm-5">固件升级包名称</label>
              <div class=" col-lg-7 col-lg-7">
                <input
                  v-model="upgradeName"
                  class="form-control"
                />
              </div>
            </div>
            <!-- 升级固件APK版本号 -->
            <div class="form-group row mt-4">
              <label class="col-form-label col-lg-5 col-sm-5">升级固件APK版本号</label>
              <div class=" col-lg-7 col-lg-7">
                <input
                  v-model="upgradeVersion"
                  class="form-control"
                />
              </div>
            </div>
            <!-- 升级固件APK -->
            <div
              class="form-group row mt-4"
             
            >
              <label class="col-form-label col-lg-5 col-sm-5">升级固件APK</label>
              <!--    class="form-control" -->
              <div class=" col-lg-7 col-lg-7">
                <div class="form-inline">
                  <input
                    type="file"
                    accept=".ipa,.apk"
                    style="display:none"
                    ref="files2"
                    @change="file2"
                  >
                  <input
                    disabled
                    v-model="fileName2"
                    id='location'
                    style="width:50%"
                    class="form-control"
                  >
                  <label class="input-group-btn">
                    <input
                      type="button"
                      id="i-check"
                      value="选择文件"
                      class="btn btn-primary btnsty"
                      @click="clickflie2"
                    >
                  </label>
                </div>
              </div>
            </div>
            <!-- 固件名称 -->
            <div class="form-group row mt-5">
              <label class="col-form-label col-lg-5 col-sm-5">固件名称</label>
              <div class=" col-lg-7 col-lg-7">
                <input
                  v-model="firmwareName"
                  class="form-control"
                />
              </div>
            </div>
            <!-- 固件版本号 -->
            <div class="form-group row mt-4">
              <label class="col-form-label col-lg-5 col-sm-5">固件版本号</label>
              <div class=" col-lg-7 col-lg-7">
                <input
                  v-model="firmwareVersion"
                  class="form-control"
                />
              </div>
            </div>
            <!-- 上传固件 -->
            <div
              class="form-group row mt-4"
             
            >
              <label class="col-form-label col-lg-5 col-sm-5">上传固件</label>
              <!--    class="form-control" -->
              <div class=" col-lg-7 col-lg-7">
                <div class="form-inline">
                  <input
                    type="file"
                    accept=".ipa,.apk"
                    style="display:none"
                    ref="files3"
                    @change="file3"
                  >
                  <input
                    disabled
                    v-model="fileName3"
                    id='location'
                    class="form-control"
                    style="width:50%"
                  >
                  <label class="input-group-btn" >
                    <input
                      type="button"
                      id="i-check"
                      value="选择文件"
                      class="btn btn-primary btnsty"
                      @click="clickflie3"
                    >
                  </label>
                </div>
              </div>
            </div>
            <!-- 提交 -->
            <div class="form-group row mt-5">
              <label class="col-form-label  col-lg-5 col-sm-5"></label>
              <div class="col-lg-7 col-lg-7"><button
                  type="submit"
                  class="btn btn-primary"
                >提交版本</button></div>

            </div>
          </div>
          <!-- right -->
          <div class="rigth col-6">
            <div class="form-group row mt-5">
              <label class="col-form-label col-lg-5 col-sm-5"></label>
              <div class=" col-lg-7 col-lg-7">
                <h4>当前版本信息</h4>
              </div>
            </div>
            <!-- md5(旧) -->
            <div class="form-group row mt-5">
              <label class="col-form-label col-lg-5 col-sm-5"> md5(旧)</label>
              <div class=" col-lg-7 col-lg-7">
                <input
                  disabled
                  v-model="appdata.md5"
                  class="form-control"
                />
              </div>
            </div>
            <!-- version旧 -->
            <div class="form-group row mt-4">
              <label class="col-form-label col-lg-5 col-sm-5">version(旧)</label>
              <div class=" col-lg-7 col-lg-7">
                <input
                  disabled
                  v-model="appdata.version"
                  class="form-control"
                />
              </div>
            </div>
            <!-- url(旧) -->
            <div class="form-group row mt-4">
              <label class="col-form-label col-lg-5 col-sm-5"> url(旧)</label>
              <div class=" col-lg-7 col-lg-7">
                <input
                  disabled
                  v-model="appdata.url"
                  class="form-control"
                />
              </div>
            </div>
            <!-- md5(旧) -->
            <div class="form-group row mt-5">
              <label class="col-form-label col-lg-5 col-sm-5"> md5(旧)</label>
              <div class=" col-lg-7 col-lg-7">
                <input
                  disabled
                  v-model="upgradedata.md5"
                  class="form-control"
                />
              </div>
            </div>
            <!-- version(旧) -->
            <div class="form-group row mt-4">
              <label class="col-form-label col-lg-5 col-sm-5"> version(旧)</label>
              <div class=" col-lg-7 col-lg-7">
                <input
                  disabled
                  v-model="upgradedata.version"
                  class="form-control"
                />
              </div>
            </div>
            <!-- url(旧) -->
            <div class="form-group row mt-4">
              <label class="col-form-label col-lg-5 col-sm-5"> url(旧)</label>
              <div class=" col-lg-7 col-lg-7">
                <input
                  disabled
                  v-model="upgradedata.url"
                  class="form-control"
                />
              </div>
            </div>
            <!-- md5(旧) -->
            <div class="form-group row mt-5">
              <label class="col-form-label col-lg-5 col-sm-5"> md5(旧)</label>
              <div class=" col-lg-7 col-lg-7">
                <input
                  disabled
                  v-model="firmwaredata.md5"
                  class="form-control"
                />
              </div>
            </div>
            <!-- version(旧) -->
            <div class="form-group row mt-4">
              <label class="col-form-label col-lg-5 col-sm-5"> version(旧)</label>
              <div class=" col-lg-7 col-lg-7">
                <input
                  disabled
                  v-model="firmwaredata.version"
                  class="form-control"
                />
              </div>
            </div>
            <!-- url(旧) -->
            <div class="form-group row mt-4">
              <label class="col-form-label col-lg-5 col-sm-5"> url(旧)</label>
              <div class=" col-lg-7 col-lg-7">
                <input
                  disabled
                  v-model="firmwaredata.url"
                  class="form-control"
                />
              </div>
            </div>

          </div>
        </div>

      </form>
    </vo>
    <!-- </div> -->
    <!-- </div> -->
    <div>
      <UpdateLading :loading="loading"></UpdateLading>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import env from '@/env'
import UpdateFormApi from '@/api/UpdateFormApi'
import UpdateLading from './updateformloading.vue'
export default {
  data () {
    return {
      fileName1: '',
      fileName2: '',
      fileName3: '',
      fiel1: {},
      fiel2: {},
      fiel3: {},
      appName: '',
      appVersion: '',
      upgradeName: '',
      upgradeVersion: '',
      firmwareName: '',
      firmwareVersion: '',
      appdata: {},
      upgradedata: {},
      firmwaredata: {},
      loading: false
    }
  },
  methods: {
    //1
    clickflie1 () {
      this.$refs.files.click()
    },
    file1 (e) {
      // console.log(e.target.files[0], 1)
      this.fileName1 = e.target.files[0].name
      this.fiel1 = e.target.files[0]

      // this.fielArr.push({ file: e.target.files[0] })
    },
    //2
    clickflie2 () {
      this.$refs.files2.click()
    },
    file2 (e) {
      // console.log(e.target.files[0], 2)
      this.fileName2 = e.target.files[0].name
      this.fiel2 = e.target.files[0]

      // this.fielArr.push({ file: e.target.files[0] })
    },
    //3
    clickflie3 () {
      this.$refs.files3.click()
    },
    file3 (e) {
      // console.log(e.target.files[0], 3)
      this.fileName3 = e.target.files[0].name
      this.fiel3 = e.target.files[0]

      // this.fielArr.push({ file: e.target.files[0] })
    },
    // this.fileName1 == '' && this.fiel1 == '' && this.appdata == '' && this.appVersion == '' || this.fileName2 == '' && this.file2 == '' && this.upgradeName == '' && this.upgradeVersion == '' || this.fileName3 == '' && this.file3 == '' && this.firmwareName == '' && this.firmwareVersion == ''
    submit () {
      this.loading = true
      if (this.fileName1 !== '' && this.fiel1.value == null && this.appdata !== '' && this.appVersion !== '' || this.fileName2 !== '' && this.file2.value == null && this.upgradeName !== '' && this.upgradeVersion !== '' || this.fileName3 !== '' && this.file3.value == null && this.firmwareName !== '' && this.firmwareVersion !== '') {
        // e.preventDefault()
        // console.log(this.fiel1, 'fiel F')
        // console.log(this.$refs.files.files[0])
        let formData = new FormData()
        formData.append('appName', this.appName)
        formData.append('appVersion', this.appVersion)
        formData.append('app', this.fiel1)
        formData.append('upgradeName', this.upgradeName)
        formData.append('upgradeVersion', this.upgradeVersion)

        formData.append('upg', this.fiel2)
        formData.append('firmwareName', this.firmwareName)
        formData.append('firmwareVersion', this.firmwareVersion)
        formData.append('fmw', this.fiel3)
        //formData
        axios.post(this.newurl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).then(res => {
          // console.log(res)
          this.appName = '',
            this.appVersion = '',
            this.upgradeName = '',
            this.upgradeVersion = '',
            this.firmwareName = '',
            this.firmwareVersion = ''
          this.fiel1 = {},
            this.fiel2 = {},
            this.fiel3 = {}
          this.fileName1 = '',
            this.fileName2 = '',
            this.fileName3 = '',
            this.getoldappI()
          this.getoldupgradeI()
          this.getoldfirmwareI()
          this.loading = false
          this.$info('版本上传成功')
        }).catch(err => {
          console.log(err)
          this.$error('上传失败')
          this.loading = false
        })
      } else {
        this.loading = false
        this.$error('至少上传一个版本')

      }
    },
    async getoldappI () {
      try {
        const data = await UpdateFormApi.getoldApp()
        // console.log(data.data.data)
        this.appdata = data.data.data
      } catch (error) {

      }
    },
    async getoldupgradeI () {
      try {
        const data = await UpdateFormApi.getoldupgrade()
        this.upgradedata = data.data.data
      } catch (error) {

      }
    },
    async getoldfirmwareI () {
      try {
        const data = await UpdateFormApi.getoldfirmware()
        // console.log(data.data.data)

        this.firmwaredata = data.data.data
      } catch (error) {

      }
    },

  },
  created () {
    this.getoldappI()
    this.getoldupgradeI()
    this.getoldfirmwareI()
  },
  components: {
    UpdateLading,
  },
  computed: {
    newurl () {
      return process.env.VUE_APP_CMS + '/cms/device/upgrade/upload?token=' + env.token
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep  .form-control {
  // display: inline-block;
  width: 100%;
}
::v-deep .col-form-label {
  text-align: center;
  float: right;
}
.formsty {
  padding: 0 30px;
}
::v-deep .form-inline {
  // display: block;
  width: 145%;
  // height: 100%
}
.btnsty {
  border-radius: 0 0.25rem 0.25rem 0;
}
.left {
  float: left;
}
.right {
  float: right;
}
.boxt {
  min-width: 1000px;
}
.appseeting {
  position: relative;
}
.appinfo {
  position: absolute;
  color: red;
  font-size: 12px;
  // transform: scale(.8);
}
</style>