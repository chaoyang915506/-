<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <h2 v-show="view === 'table'">客信管理</h2>
        <div class="card" v-show="view === 'table'">
          <div class="card-header">查询条件</div>
          <div class="card-body row">
            <div
              class="col-4 row "
              style=" display: flex;
  align-items: center;"
            >
              <label
                class="col-5"
                style="vertical-align: text-bottom;
  margin-bottom: 2px;text-align: center;"
              >
                标题
              </label>
              <div class="col-7" style="display: inline-block">
                <input
                  type="text"
                  class="form-control"
                  v-model="title"
                  @keyup.enter="searchKey"
                />
              </div>
            </div>
            <div
              class="col-4  row"
              style=" display: flex;
  align-items: center;"
            >
              <label
                class="col-5"
                style="vertical-align: text-bottom;
  margin-bottom: 2px;text-align: center;"
              >
                是否启用
              </label>
              <div class="col-7" style="display: inline-block">
                <select
                  class="form-control"
                  v-model="isEnable"
                  @change="refresh"
                >
                  <option value="">全部</option>
                  <option value="1">启用</option>
                  <option value="0">未启用</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <cool-table
          ref="messageTable"
          v-show="view === 'table'"
          :columns="columns"
          :options="opts"
          @update-row="updateMessage"
          @pick-rooms="pickRooms"
          @del-row="delMessage"
        >
          <button class="btn btn-primary" @click="addMessage">
            添加
          </button>
          <button class="btn btn-danger ml-1" @click="delMessages">
            删除
          </button>
          <cool-modal :visible="modalVisible" @hidden="modalVisible = false">
            <div slot="header">选择房间</div>
            <pick-rooms v-model="roomIdList" />
            <div slot="footer">
              <div class="btn btn-primary" @click="picked">
                确定
              </div>
              <div class="btn btn-secondary ml-1" @click="modalVisible = false">
                关闭
              </div>
            </div>
          </cool-modal>
        </cool-table>
        <div v-if="view === 'form'">
          <div class="col-12">
            <message-form
              :hotelIdlangList="hotelIdlangList"
              :value="messageModel"
              @change="refresh"
              @close="view = 'table'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import CoolModal from '@/components/CoolModal.vue'
import MessageForm from './MessageForm.vue'
import MessageApi from '@/api/MessageApi'
import env from '@/env'
import { GuestMessage, MsgType, AddGuestMessage, msgList } from './GuestMessage'
import { mapState } from 'vuex'
import PickRooms from './PickRooms.vue'

export default {
  name: 'MessageApp',
  components: { CoolTable, CoolModal, MessageForm, PickRooms },
  data() {
    return {
      view: 'table',
      columns: [
        {
          checkbox: true,
        },
        {
          field: 'contentType',
          title: '客信类型',
          align: 'center',
          formatter: (val, row, idx) => {
            switch (val) {
              case 0:
                return '文字'
              case 1:
                return '文字及图片'
              case 2:
                return '文字及视频'
              case 3:
                return '图片'
            }
          },
        },
        {
          field: 'relType',
          title: '绑定关系',
          align: 'center',
          formatter: (val) => {
            switch (val) {
              case 0:
                return '全局'
              case 1:
                return '房间'
              case 2:
                return '团客'
            }
          },
        },
        {
          field: 'groupGuestId',
          title: '团客名称',
          align: 'center',
          formatter: (val, row) => {
            if (row.relType !== 2) {
              return '-'
            }

            const gg = this.guestGroups.find((gg) => gg.guestGroupId === val)
            if (!gg) {
              return '-'
            }
            return gg.guestGroupName
          },
        },
        {
          field: 'langId',
          title: '语言',
          align: 'center',
          formatter: (val) => {
            const lang = this.langs.find((lang) => lang.langId === val)
            if (!lang) {
              return '-'
            }
            return lang.label
          },
        },
        {
          field: 'title',
          title: '标题',
          align: 'center',
        },
        {
          field: 'text',
          title: '内容',
          align: 'center',
          formatter: (val) => {
            return `<p style="overflow-wrap: break-word;">${val}</p>`
          },
        },
        {
          field: 'createTime',
          title: '创建时间',
          align: 'center',
          formatter: (val) => new Date(val).format('yyyy-MM-dd hh:mm:ss'),
        },
        {
          field: 'id',
          title: '操作',
          align: 'center',
          formatter: (val, row) => {
            let btns = `<button class="btn btn-primary btn-sm mr-1" data-val=${val} data-emit=update-row>修改</button>
                        <button class="btn btn-danger btn-sm mr-1" data-val=${val} data-emit=del-row>删除</button>`
            if (row.relType === 1) {
              btns =
                `<button class="btn btn-primary btn-sm mr-2" data-val=${val} data-emit=pick-rooms>选择房间</button>` +
                btns
            }
            return btns
          },
        },
      ],
      title: '',
      isEnable: '',
      opts: {
        url: MessageApi.selectAllUrl,
        sidePagination: 'server',
        queryParams: (params) => {
          let data = {
            ...params,
            title: this.title,
            isEnable: this.isEnable,
            msgType: MsgType.PRIVATE,
            hotelId: env.hotelId,
            groupGuestId: 0,
            token: env.token,
          }
          if (this.title == '') delete data.title
          if (this.isEnable == '') delete data.isEnable
          return data
        },
        responseHandler: (msg) => {
          if (msg.code != '0x0000') {
            this.messages = []

            return { total: 0 }
          }
          this.messages = msg.data.rows

          return msg.data
        },
      },
      messages: [],
      messageModel: new GuestMessage(),
      modalVisible: false,
      roomIdList: [],
      hotelIdlangList: [], //酒店的语言
    }
  },
  computed: {
    ...mapState(['langs', 'guestGroups']),
  },
  methods: {
    searchKey() {
      this.$refs.messageTable.refresh()
    },
    async addMessage() {
      try {
        const hotellang = await MessageApi.getHotelLang()
        this.hotelIdlangList = hotellang
        let data = hotellang.map((i) => {
          return {
            ...new msgList(),
            hotelId: i.hotelId,
            langId: i.langId,
          }
        })
        this.messageModel = { ...new AddGuestMessage(), msgList: data }

        this.view = 'form'
      } catch (error) {
        console.log(error)
        // this.$error('')
      }
    },
    updateMessage(id) {
      this.messageModel = this.messages.find((message) => message.id === id)

      this.view = 'form'
    },
    pickRooms(id) {
      this.messageModel = this.messages.find((message) => message.id === id)
      this.roomIdList = this.messageModel.roomIdList

      this.modalVisible = true
    },
    async picked() {
      this.modalVisible = false

      this.messageModel.roomIdList = this.roomIdList
      this.roomIdList = []

      // update rooms
      try {
        await MessageApi.updateMessageRoom(
          this.messageModel.id,
          this.messageModel.roomIdList
        )
        await this.$info('修改成功')
        this.refresh()
      } catch (error) {
        console.error(error)

        this.$error('修改失败')
      }
    },
    async delMessages() {
      const selections = this.$refs.messageTable.getSelections()
      if (selections.length === 0) {
        return
      }

      try {
        const ok = await this.$confirm('删除')
        if (!ok) {
          return
        }

        await MessageApi.delete(selections.map((v) => v.id))
        await this.$info('删除成功')
        this.refresh()
      } catch (error) {
        console.error(error)

        this.$error('删除失败')
      }
    },
    async delMessage(id) {
      try {
        const ok = await this.$confirm('删除')
        if (!ok) {
          return
        }

        await MessageApi.delete([id])
        await this.$info('删除成功')
        this.refresh()
      } catch (error) {
        console.error(error)

        this.$error('删除失败')
      }
    },
    refresh() {
      this.$refs.messageTable.refresh()
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep td {
  max-width: 300px;
}
</style>
