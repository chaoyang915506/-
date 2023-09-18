<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <h2>安全通知</h2>
      </div>
      <div class="col-12">
        <cool-table
          :options="options"
          ref="noticeTable"
          :data="tableData"
          :columns="columns"
          @reset-row="resetOne"
        >
          <button class="btn btn-danger" @click="reset">重置选中房间</button>
          <button class="btn btn-danger ml-1" @click="resetAll">
            全部重置
          </button>
          <a :href="newhref" class="btn btn-danger ml-1" target="_black"
            >导出excel</a
          >
          <!-- <iframe name="expceli" style="display:none"></iframe> -->
        </cool-table>
      </div>
    </div>
  </div>
</template>

<script>
import NoticeApi from '@/api/NoticeApi'
import CoolTable from '@/components/CoolTable.vue'
import RoomApi from '@/api/RoomApi'
import env from '@/env/index'
export default {
  name: 'NoticeApp',
  components: { CoolTable },
  data() {
    return {
      notices: [],
      namelist: [], //name
      columns: [
        {
          checkbox: true,
        },
        {
          field: 'roomNumber',
          title: '房间号',
        },
        {
          field: 'roomNumber',
          title: '姓名',
          formatter: (val) => {
            let newname = this.namelist.filter(
              (item) => item.guest_booking[0].room_no == val
            )
            let name
            return newname.map((item) => {
              if (item.first_name_unicode !== null) {
                name = item.first_name_unicode + item.last_name_unicode
              } else {
                name = item.last_name_unicode
              }
              return  name
              
            })
          },
        },
        {
          field: 'roomNumber',
          title: '性别',
          formatter: (val) => {
            let sexArr = []
            this.namelist.forEach((item) => {
              if (item.guest_booking[0].room_no == val) {
                sexArr.push(item.gender == 'F' ? '女' : '男')
              }
            })
            return sexArr
          },
        },
        {
          field: 'notice',
          title: '是否已观看',
          formatter: (val) => (val.hasData ? '是' : '否'),
        },
        {
          field: 'notice',
          title: '是否理解安全通知内容',
          formatter: (val) => {
            if (!val.hasData) {
              return '-'
            }

            return val.feedback === 1 ? '是' : '否'
          },
        },
        {
          field: 'notice',
          title: '操作',
          formatter: (val) => {
            if (!val.hasData) {
              return '-'
            }
            return `<button class='btn btn-danger btn-sm' data-val=${val.id} data-emit=reset-row>重置</button>`
          },
        },
      ],
      rooms: [],
      options: {
        pageList: [5, 10, 20, 50, 100],
      },
    }
  },
  computed: {
    newhref() {
      return (
        process.env.VUE_APP_VIKING +
        '/viking/notices/unconfirmed/export?token=' +
        env.token
      )
    },
    tableData() {
      this.rooms.forEach((room) => {
        room.notice = this.notices.find(
          (notice) => notice.roomNumber === room.roomNumber
        )
        if (!room.notice) {
          room.notice = { hasData: false }
        } else {
          room.notice.hasData = true
        }
      })

      return this.rooms.sort((a, b) => {
        const va =
          10 * (a.notice.hasData ? 1 : -1) + (a.notice.feedback === 1 ? -1 : 1)
        const vb =
          10 * (b.notice.hasData ? 1 : -1) + (b.notice.feedback === 1 ? -1 : 1)
        return vb - va
      })
    },
  },
  methods: {
    async resetOne(id) {
      try {
        const ok = await this.$confirm('是否重置')
        if (!ok) {
          return
        }

        await NoticeApi.delete([id])
        await this.$info('重置成功')
        this.refresh()
      } catch (error) {
        console.error(error)

        this.$error('重置失败')
      }
    },
    async reset() {
      try {
        const selections = this.$refs.noticeTable
          .getSelections()
          .filter((sel) => sel.notice.hasData)
        if (selections.length === 0) {
          return
        }

        const ok = await this.$confirm('是否重置')
        if (!ok) {
          return
        }

        await NoticeApi.delete(selections.map((sel) => sel.notice.id))
        await this.$info('重置成功')
        this.refresh()
      } catch (err) {
        console.error(err)

        this.$error('重置失败')
      }
    },
    async resetAll() {
      try {
        if (this.notices.length === 0) {
          return
        }

        await NoticeApi.delete(this.notices.map((notice) => notice.id))
        await this.$info('重置成功')
        this.refresh()
      } catch (err) {
        console.error(err)

        this.$error('重置失败')
      }
    },
    refresh() {
      NoticeApi.list()
        .then((data) => {
          this.notices = data.list
        })
        .catch((err) => {
          console.error(err)

          this.$error('获取安全通知数据失败')
        })
    },
    async getAlldata() {
      try {
        const NameList = await NoticeApi.getGuestName()
        // console.log(NameList, 'list')
        this.namelist = NameList.list
        const data = await RoomApi.list()
        this.rooms = data.list
        this.refresh()
      } catch (error) {}
    },
  },
  created() {
    this.getAlldata()
  },
}
</script>
