<template>
  <div class="container-fluid">
    <div
      class="row"
      style="justify-content: center,
            margin-top: 3%"
    >
      <div class="col-12" v-if="view == 'table'">
        <h2>酒店管理</h2>
        <div class="card">
          <div class="card-header" style="background-color: #fff;">
            查询条件
          </div>
          <div class="card-body row">
            <div class="col-5 mb-3">
              <label class="col-4"> 城市名称搜索 </label>
              <div class="col-8" style="display: inline-block">
                <input
                  type="text"
                  @keyup.enter="getHotel"
                  class="form-control"
                  v-model="cityname"
                />
              </div>
            </div>
            <div class="col-5">
              <label class="col-4"> {{ vendor }}名称搜索 </label>
              <div class="col-8" style="display: inline-block">
                <input
                  type="text"
                  @keyup.enter="getHotel"
                  class="form-control"
                  v-model="hotelname"
                />
              </div>
            </div>
          </div>
        </div>
        <cool-table :data="hotels" :columns="columns" @update-row="updateTable">
          <div class="btn btn-primary" @click="addForm">添加</div>
        </cool-table>
      </div>
    </div>
    <div v-if="view == 'form'" class="row mt-4" style="justify-content: center">
      <hotel-form
        class="col-11"
        @close="close"
        :editData="editData"
      ></hotel-form>
    </div>
  </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
// import { mapState } from 'vuex'
import HotelForm from './HotelForm.vue'
import { editData } from './Hotel.js'
import HotelApi from '@/api/HotelApi'
import env from '@/env'
import Axios from 'axios'
export default {
  name: 'HotelApp',
  components: { CoolTable, HotelForm },
  data() {
    return {
      view: 'table',
      editData: {},
      cityname: '',
      hotelname: '',
      vendor: env.vendor,
      columns: [
        {
          checkbox: true,
        },
        {
          field: 'hotelId',
          title: '酒店ID',
          align: 'center',
        },
        {
          field: 'hotelName',
          title: '酒店名称',
          align: 'center',
        },
        {
          field: 'city',
          title: '城市',
          align: 'center',
        },
        {
          field: 'hotelId',
          title: '操作',
          align: 'center',
          formatter: (val, row, idx) => {
            return `<button class="btn btn-sm btn-primary" data-val=${val} data-emit=update-row  >修改</button>`
          },
        },
      ],
      hotels: [],
    }
  },
  created() {
    this.getHotel()
  },
  methods: {
    async getHotel() {
      let Hoteldata = {
        hotelName: this.hotelname,
        cityName: this.cityname,
      }
      try {
        const data = await HotelApi.list(Hoteldata)
        this.hotels = data
      } catch (error) {
        this.hotels = []
        console.log(error)
        // this.$error(error)
        // this.$error(`读取${this.vendor}数据失败`)
      }
    },
    //关闭form
    close() {
      this.view = 'table'
    },
    addForm() {
      this.view = 'form'
      this.editData = new editData()
    },
    //编辑
    async updateTable(val) {
      let hotelbgc = await HotelApi.checkBackgroundImg(val)
      let hoteldata = null
      if (hotelbgc) {
        hoteldata = {
          sketch: hotelbgc.sketch,
          sketchId: hotelbgc.id,
        }
      } else {
        hoteldata = {
          sketch: '',
          sketchId: '',
        }
      }
      // hotelbgc ? hotelbgc.sketch : ''

      try {
        // const grpId = await HotelApi.getGropName({ grpId: val })
        // console.log(grpId, 'groupId')

        const tempalte = await HotelApi.getfindTmeplHotel(val)
        // console.log(tempalte, 'tem')
        const formD = await HotelApi.getFindHotel(val)
        // console.log(formD, 'data')

        const grpId = await HotelApi.findGrp({ grpId: formD.grpId })

        this.editData = {
          ...formD,
          hotelLeve: formD.hotelLevel,
          hotelImg: formD.hotelImage,
          groupId: grpId[0].grpId,
          templateId: tempalte,
          // sketch: hotelbgcnow,
          ...hoteldata,
          // sketchid: hotelbgc.id,
        }
        // console.log(this.editData, '編輯888')
        this.view = 'form'
      } catch (error) {
        console.log(error)
      }
    },
  },
  computed: {
    // ...mapState(['hotels']),
    hotelUrl() {
      //?hotelName=${Hoteldata.hotelName}&cityName=${Hoteldata.cityName}
      return `${env.cms}/cms/cmsHotelController/getHotelList`
    },
    hotelArr() {
      let cityname = RegExp(this.cityname, 'ig')
      let hotelname = RegExp(this.hotelname, 'ig')
      return this.hotels
        .filter((i) => {
          return this.cityname == '' ? true : cityname.test(i.city)
        })
        .filter((t) => {
          return this.hotelname == '' ? true : hotelname.test(t.hotelName)
        })
    },
  },
}
</script>
