<template>
  <div class="container-fluid" style="overflow: auto; width: 100%; height: 100%">
    <div class="card text-center" v-show="(view == 'high') | (view == 'movielist')">
      <!-- 头部 -->
      <div class="card-header outerStyle">
        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item navreative">
            <a
              class="nav-link"
              @click="view = 'high'"
              :class="{ 'active fontColor': view === 'high' }"
              href="#"
              >云端电影列表
            </a>
            <div class="info" v-show="notIssuelength !== 0 && notIssuelength !== '0'">
              {{ notIssuelength }}
            </div>
          </li>
          <li class="nav-item navreative ml-1">
            <a
              class="nav-link"
              @click="addup"
              :class="{ 'active fontColor': view === 'movielist' }"
              href="#"
              >已下发电影列表</a
            >
            <div class="info" v-if="processed !== 0">{{ processed }}</div>
          </li>
        </ul>
      </div>

      <div class="card-body row" style="justify-content: space-around">
        <!-- 查询条件 -->
        <div class="col-4 row floatCenter" v-show="view == 'high'">
          <label class="col-5 lable_Center"> 电影名称 </label>
          <div class="col-7">
            <input @keyup.enter="refresh" type="text" class="form-control" v-model="movicename" />
          </div>
        </div>
        <!-- xia -->
        <div class="col-3 row floatCenter" v-show="view == 'movielist'">
          <label class="col-5 lable_Center"> 电影名称 </label>
          <div class="col-7">
            <input type="text" class="form-control" v-model="movicename" />
          </div>
        </div>
        <!-- xia -->
        <div class="col-3 row floatCenter" v-if="view == 'movielist'">
          <label class="col-5 lable_Center"> 状态 </label>
          <div class="col-7">
            <select class="form-control" v-model="state">
              <option value="">全部</option>
              <option value="0">已下线</option>
              <option value="1">上线中</option>
            </select>
          </div>
        </div>
        <!-- yun -->
        <div class="col-4 row floatCenter" v-show="view == 'high'">
          <label class="col-5 lable_Center"> 片源下发状态 </label>
          <div class="col-7">
            <!-- 未开始-1 成功0 -->
            <select class="form-control" v-model="issuestate" @change="refresh">
              <option value="">全部</option>
              <option value="-1">下发中</option>
              <option value="0">已完成</option>
            </select>
          </div>
        </div>
        <!-- xia -->
        <div class="col-3 floatCenter row" v-show="view == 'movielist'">
          <label class="col-5 lable_Center"> 片源下发状态 </label>
          <div class="col-7">
            <!-- 未开始-1 成功0 -->
            <select class="form-control" v-model="states">
              <option value="">全部</option>
              <option value="-1">下发中</option>
              <option value="0">已完成</option>
              、
            </select>
          </div>
        </div>
        <!-- xia -->
        <div class="col-3 floatCenter row" v-show="view == 'movielist'">
          <label class="col-5 lable_Center"> {{ vendor }}电影版权分组</label>
          <div class="col-7">
            <select class="form-control" v-model="movicegrounp">
              <option value="">全部</option>
              <option
                :value="item.class.id"
                v-for="item in $store.state.copyrightlist"
                :key="item.class.id"
              >
                {{ item.class.name }}
              </option>
            </select>
          </div>
        </div>
        <!-- yun -->
        <div class="col-4 floatCenter row" v-show="view == 'high'">
          <label class="col-5 lable_Center"> {{ vendor }}电影版权分组</label>
          <div class="col-7">
            <select @change="refresh" class="form-control" v-model="movicegrounp">
              <option value="">全部</option>
              <option
                :value="item.class.id"
                v-for="item in $store.state.copyrightlist"
                :key="item.class.id"
              >
                {{ item.class.name }}
              </option>
            </select>
          </div>
        </div>
        <!-- 云端电影列表table -->
        <cool-table
          class="col-12"
          v-show="view == 'high'"
          :columns="columns"
          ref="table"
          :options="options"
          @look-detail="lookDetail"
          @issue-local="issueLocal"
        >
          <button class="btn btn-primary mr-2 mt-3" type="button" @click="sendfile">
            批量下发到{{ vendor }}本地
            <!-- <span class="hint" style="width: 500 px"
              ><i class="bi bi-exclamation-triangle"></i>请勾选未下发电影</span
            > -->
          </button>
          <button class="btn btn-info mt-3" type="button" @click="btachlook">
            批量查看下发状态
            <!-- <span class="hintstate" style="width: 500 px"
              ><i class="bi bi-exclamation-triangle"></i>请勾选【同一{{
                vendor
              }}电影版权分组】电影</span
            > -->
          </button>
        </cool-table>
        <!-- 已下发电影列表table -->
        <cool-table
          class="col-12"
          v-show="view == 'movielist'"
          :columns="moviecolumn"
          :data="asyncData"
          ref="sendtable"
          :options="{ search: false }"
          @issue-movice="issueMovice"
          @edit-row="editTable"
        >
          <button v-if="view == 'movielist'" class="btn btn-primary ml-1 mt-3" @click="online">
            上线
          </button>
          <button class="btn btn-dark ml-1 mt-3" @click="offline">下线</button>
          <button
            style="display: none"
            v-if="view == 'movielist'"
            @click="batchfodder"
            class="btn btn-info ml-1"
          >
            批量下发电影素材
          </button>
        </cool-table>
      </div>
    </div>

    <!-- 下发电影到酒店本地 -->
    <div v-if="view == 'batch' || view == 'single'">
      <h2>{{ view == "batch" ? "批量" : "" }}下发电影到{{ vendor }}本地</h2>
      <div class="form-group mt-4">
        <label class="mr-4" style="width: 12%">电影名称:</label>
        <div style="display: inline-block">
          <input v-if="view == 'single'" disabled class="form-control" v-model="singleData.name" />
        </div>
        <button v-if="view == 'batch'" class="btn btn-primary" @click="modelVisible = true">
          查看详情
        </button>
      </div>
      <div class="form-group">
        <label style="width: 12%" class="mr-4">{{ vendor }}电影版权分组:</label>

        <div style="display: inline-block">
          <template
            v-for="item in $store.state.copyrightlist"
            style="display: block; float: left; padding: 0.208rem"
          >
            <input
              style="vertical-align: -0.083rem,text-align: center"
              type="checkbox"
              class="mr-1"
              v-model="copyrightClassIds"
              :value="item.class.id"
            />{{ item.class.name }}
          </template>
        </div>
      </div>
      <cool-table
        :columns="columnsHotel"
        :options="optionHotel"
        :data="hotelList"
        ref="hotelmovice"
        style="margin-top: 72px"
      >
        <div class="form-group ml-3">
          <label>{{ vendor }}列表:</label>
          <div class="hotellist">选择要下发的{{ vendor }}</div>
        </div>
      </cool-table>
      <div class="form-group handle mt-4">
        <button class="btn btn-dark mr-2" @click="backhigh">返回</button>
        <button class="btn btn-primary" @click="sureissue">确定下发</button>
      </div>
    </div>
    <div class="centerbox">
      <movice-edit
        v-if="view == 'movieEdit'"
        @closeForm="closeForm"
        :editDataed="editDataed"
        :copyrightstring="copyrightstring"
      ></movice-edit>
    </div>

    <!-- 选择的全部的电影名称 -->
    <cool-modal
      class="tablehotel"
      :visible="modelVisible"
      title="电影名称"
      @hidden="modelVisible = false"
    >
      <div class="movicelist" style="height: 100%">
        <div v-for="item in allmoviceName" :key="item.id" class="movice_bottom">
          {{ item.name }}
        </div>
      </div>
      <template #footer>
        <button class="btn btn-dark" @click="modelVisible = false">返回</button>
      </template>
    </cool-modal>
    <!-- 查看详情的弹框 -->
    <movice-details
      v-show="issueNow == true"
      :issueNow="issueNow"
      @closeIsuNow="closeIsuNow"
      @refresh="refresh"
      @getiusee="getIssueState"
      :issueList="issueList"
      :AllhotelList="AllhotelList"
      :hotelAray="hotelAray"
      :moviceListState="moviceListState"
      :seledlenth="seledlenth"
    ></movice-details>
  </div>
</template>

<script>
import CoolModal from "@/components/CoolModal.vue";
import env from "@/env";
import CoolTable from "@/components/CoolTable.vue";
import MoviceEdit from "./MoviceEdit.vue";
import MoviceListApi from "@/api/MoviceListApi";
import MoviceDetails from "./MoviceDetails.vue"; //弹框
export default {
  data() {
    return {
      view: "high", //默认云端high  movieEdit
      optionHotel: {
        pageList: [5, 25, 50, 100, 150],
      },
      //按条件筛选的
      movicename: "",
      state: "",
      issuestate: "",
      movicegrounp: "",
      states: "", //已下发的片源头绑定

      movicegroupList: null, //多选 酒店分组
      //云端电影列表
      options: {
        url: `${env.cms}/cms/v2/medias?token=${env.token}`,
        method: "get",
        pageNumber: 1, //初始化加载第一页
        sidePagination: "server", //服务端
        pageSize: 10, //单页记录数
        pageList: [5, 10, 20], //可选择单页记录数
        search: false,
        pagination: true, //分页
        strictSearch: true,
        showColumns: true, //是否显示所有的列
        showRefresh: true, //刷新按钮
        queryParams: (params) => {
          let data = {
            offset: params.offset,
            limit: params.limit,
            metaType: 14,
            name: this.movicename,
            syncStatus: this.issuestate,
            copyrightClassId: this.movicegrounp, //版权分类id
          };
          if (this.issuestate == "") {
            delete data.syncStatus;
          }
          return data;
        },
        responseHandler: (res) => {
          this.tableList = res.data.rows;
          if (res.data.unIssuedCount == null) {
            this.notIssuelength = "0";
          } else {
            this.notIssuelength = res.data.unIssuedCount;
          }
          return {
            rows: res.data.rows,
            total: res.data.total,
          };
        },
      },
      issueNow: false, //下发状态详情的开关
      modelVisible: false, //电影名称的弹框
      vendor: env.vendor,
      //首页的
      columns: [
        {
          checkbox: true,
        },
        {
          field: "index",
          title: "序号",
          align: "center",
        },
        {
          field: "name",
          title: "电影名称",
          align: "center",
          formatter: (val, row) => {
            if (row.styleDescs.length > 0) {
              return `<div class="tdStyle">${row.styleDescs[0].name}</div>`;
            } else {
              return `<div class="tdStyle">${val}</div>`;
            }
          },
        },
        {
          field: "id",
          title: "片源下发状态",
          align: "center",
          formatter: (val) => {
            let num = this.backnumber(val);
            if (num == 2) {
              return "已完成";
            } else if (num == 0) {
              return "未下发";
            } else {
              return "下发中";
            }
          },
        },
        {
          field: "copyrightClassIds",
          title: `${env.vendor}电影版权分组`,
          align: "center",
          formatter: (val) => {
            return this.formatString([...new Set(val)]);
          },
        },
        {
          field: "id",
          title: "操作",
          align: "center",
          formatter: (val, row, idx) => {
            let len = this.syncListData.filter((i) => i.oriId == val);
            // console.log(len);
            // if (row.copyrightClassIds.length == 0) {
            if (len.length == 0) {
              return ` <button class="btn btn-primary btn-sm button-sty" data-val=${val} data-emit="issue-local">下发到${env.vendor}本地</button>`;
            } else {
              return ` <button class="btn btn-primary btn-sm button-sty" data-val=${val} data-emit="look-detail">查看下发状态</button>`;
            }
          },
        },
      ],
      moviecolumn: [
        {
          checkbox: true,
        },
        {
          field: "id",
          title: "序号",
          align: "center",
          formatter: (val, row, idx) => {
            return idx + 1;
          },
        },
        {
          field: "name",
          title: "电影名称",
          align: "center",
          formatter: (val) => {
            return `<div class="tdStyle">${val}</div>`;
          },
        },
        {
          field: "mediaStatus",
          title: "状态",
          align: "center",
          formatter: (val) => {
            // console.log(val, '状态')
            switch (val) {
              case 0:
                return "已下线";
                break;
              //测试 1
              case 1:
                return "上线中";
                break;
              case 2:
                return "待审核";
                break;
              case 3:
                return "审核通过";
                break;
              case 4:
                return "审核未通过";
                break;
              default:
                return "--";
            }
          },
        },
        {
          field: "states",
          title: "片源下发状态",
          align: "center",
          formatter: (val, row) => {
            if (val == 0) {
              return "已完成";
            } else if (val == "-1") {
              return "下发中";
            } else {
              return "-";
            }
          },
        },
        {
          field: "copyrightClassIds",
          title: `${env.vendor}电影版权分组`,
          align: "center",
          formatter: (val) => {
            return this.formatString([...new Set(val)]);
          },
        },
        {
          field: "oriId",
          title: "操作",
          align: "center",
          formatter: (val, row, idx) => {
            //判断显示有下发电影素材的显示隐藏
            return `
                    <button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">编辑</button>
                        `;
            // <button class="btn btn-danger btn-sm" data-val=${val} data-emit="issue-movice" >下发电影素材</button>
          },
        },
      ],
      tableList: [], //存储主页面的数据
      //酒店或者是酒店批量下发的table
      columnsHotel: [
        {
          checkbox: true,
        },
        {
          field: "",
          title: "序号",
          align: "center",
          formatter: (val, row, index) => {
            return index + 1;
          },
        },
        {
          field: "hotelId",
          title: `${env.vendor}名称`,
          align: "center",
          formatter: (val) => {
            let data = this.AllhotelList.find((ids) => ids.hotelId == val);
            if (data) {
              return data.hotelName;
            } else {
              return "-";
            }
          },
        },
      ],
      copyrightlist: [], //版权的全部数据
      // hotelList: [],//选择要下发的酒店
      AllhotelList: [], //全部的酒店数据
      allmoviceName: [], //当前选择的电影批量下发用的数组
      singleData: null, //单独下发酒店本地的数据

      copyrightClassIds: [], //调用接口用的版权分类列表数据

      issueList: [], //下发的详情数据
      hotelAray: [], //显示的酒店
      moviceListState: [], //传给子组件的电影状态
      groupstatelis: [], //上线还是下线等数据
      editDataed: null, //编辑的数据
      typeclass: null, //编辑的类型数据
      notIssuelength: "", //云端未下发的数量
      processed: 0, //已下发电影列表未成功下发的数量
      copyrightstring: "", //传编辑页面的字符串
      seledlenth: [],
      syncListData: [], //已下发的电影列表数据
      groupList: [], //全部分组
      sendmoviceList: [], //全部已下发的纯电影数据
    };
  },
  created() {
    this.getIssueState();
    this.getHotel();
  },
  watch: {
    view(val) {
      if (val) {
        this.movicename = "";
        this.state = "";
        this.issuestate = "";
        this.movicegrounp = "";
      }
    },
  },
  computed: {
    asyncData() {
      let movice = RegExp(this.movicename, "ig");
      return this.syncListData
        .filter((item) => {
          return this.movicename !== "" ? movice.test(item.name) : true;
        })
        .filter((item) => {
          return this.states !== "" ? item.states == this.states : true;
        })
        .filter((item) => {
          return this.state !== "" ? item.mediaStatus == this.state : true;
        })
        .filter((item) => {
          return this.movicegrounp !== ""
            ? item.copyrightClassIds.includes(this.movicegrounp)
            : true;
        });
    }, //获取酒店hotelid
    hotelList() {
      let arr = [];
      this.copyrightClassIds.forEach((idx) => {
        //每一个id
        this.$store.state.copyrightlist.forEach((item) => {
          if (item.class.id == idx) {
            item.hotelIds.forEach((hotel) => {
              if (arr.indexOf(hotel) == -1) {
                arr.push(hotel);
              }
            });
          }
        });
      });
      return arr.map((it) => {
        return {
          hotelId: it,
        };
      });
    },
  },
  methods: {
    async addup() {
      this.movicename = "";
      this.state = "";
      this.issuestate = "";
      this.movicegrounp = "";
      this.states = "";
      this.$refs.table.refreshOptions();
      this.view = "movielist";
    },
    backnumber(id) {
      //0 未下发 1 下发中 2 完成
      let arr = [];
      this.sendmoviceList.forEach((it) => {
        if (it.oriId == id && arr.map((i) => i.oriId).indexOf(it.oriId) == -1) {
          arr.push(it);
        }
      });
      if (arr.length == 0) return 0;
      if (arr.every((i) => i.status == 0)) {
        return 2;
      } else {
        return 1;
      }
    },
    // 关闭弹框
    closeIsuNow(val) {
      this.issueNow = false;
    },
    // 酒店本地列表  上线
    async online(val) {
      try {
        let checked = this.$refs.sendtable.getSelections();
        if (checked.length == 0) return this.$error("请选择要上线的影片");
        if (checked.every((i) => i.states == 0) == false)
          return this.$error("请选择已下发完成的影片");
        await MoviceListApi.batchOnline(checked.map((item) => item.oriId));
        await this.getIssueState();
        await this.$info("上线成功");
      } catch (error) {
        // this.$error(error)
      }
    },
    // 酒店本地列表  下线
    async offline() {
      try {
        let checked = this.$refs.sendtable.getSelections();
        if (checked.length == 0) return this.$error("请选择要下线的影片");
        if (checked.every((i) => i.states == 0) == false)
          return this.$error("请选择已下发完成的影片");
        await MoviceListApi.batchOffline(checked.map((item) => item.oriId));
        await this.getIssueState();
        await this.$info("下线成功");
      } catch (error) {
        this.$error(error);
      }
    },
    //酒店本地列表   批量下发视频素材
    async batchfodder() {
      let seledlist = this.$refs.sendtable.getSelections();
      if (seledlist.length == 0) return this.$error("请选择批量下发的视频素材");

      let res = await this.$confirm("提示", `是否批量下发到全部${env.vendor}?`);
      if (!res) return;
    },
    //下发电影素材
    async issueMovice() {
      let res = await this.$confirm("提示", `是否下发素材到全部${env.vendor}`);
      if (!res) return;
      try {
      } catch (error) {}
    },
    //确定下发 需要区分批量或者单独吗？、
    async sureissue() {
      try {
        //获取用户选择的酒店
        let seledhotel = this.$refs.hotelmovice.getSelections();
        if (seledhotel.length == 0) return this.$error(`请选择要下发的${env.vendor}`);
        // console.log(seledhotel.map(item => item.hotelId), 'hotel')
        let res = await this.$confirm(`确定下发电影到已选${env.vendor}`, "请谨慎操作");
        if (!res) return;

        await MoviceListApi.mediasSync({
          mediaIds:
            this.view == "single"
              ? [this.singleData.id]
              : this.allmoviceName.map((item) => item.id),
          hotelIds: seledhotel.map((item) => item.hotelId),
          copyrightClassIds: this.copyrightClassIds,
        });
        await this.getIssueState();
        await this.backhigh();
        await this.$info("下发成功");
      } catch (error) {
        console.log(error);
        this.$error("下发失败");
      }
    },
    //获取酒店
    async getHotel() {
      try {
        const hotel = await MoviceListApi.getHotelList();
        this.AllhotelList = hotel;
      } catch (error) {
        console.log(error);
      }
    },
    //获取下发的状态
    async getIssueState() {
      try {
        const res = await MoviceListApi.getcopyright();
        this.$store.commit("getcopyright", res.list);
        //全部group 下的状态
        const state = await MoviceListApi.issueState();
        this.groupList = state.list; //保存全部分组
        this.refresh();
        //拿到全部分组的的全部的电影
        let movicelist = [];
        state.list.forEach((idm) => {
          idm.syncList.forEach((idx) => {
            movicelist.push(idx);
          });
        });
        this.sendmoviceList = movicelist;
        // console.log(this.sendmoviceList, '全部已下发的数据')
        // 筛选出去重的电影只保留一个电影
        let syncList = [];
        //根据oriid判断如果处理成多个相同名字的电影为一个电影
        movicelist.forEach((item) => {
          if (syncList.map((ite) => ite.oriId).indexOf(item.oriId) == -1) {
            syncList.push({ ...item, copyrightClassIds: [] });
          }
        });
        let movice;
        let dataState = [];

        // 给copyrightClassIds添加分组id
        let sending; //下发中
        let finish; //已完成
        syncList.forEach(function (item) {
          let st = movicelist.filter((idm) => idm.oriId == item.oriId);
          sending = st.filter((ii) => ii.status == -1);
          finish = st.filter((ii) => ii.status == 0);
          if (sending.length == st.length || finish.length !== st.length) {
            item["states"] = -1; //下发中
          } else if (finish.length == st.length) {
            item["states"] = 0; //成功
          } else {
          }
          state.list.forEach(function (it) {
            it.syncList.forEach(function (idx) {
              if (idx.oriId == item.oriId && dataState.indexOf(it.id) == -1) {
                dataState.push(it.id);
              }
            });
          });
          item["copyrightClassIds"] = dataState;
          dataState = [];
        });
        this.processed = syncList.filter((item) => item.states !== 0).length;
        // console.log(syncList, '全部的电影数据')
        this.syncListData = syncList.sort((a, b) => b.id - a.id);
      } catch (error) {
        console.log(error);
      }
    },
    refresh() {
      this.$refs.table.refresh();
    },
    // 云端电影列表 下发到酒店本地
    issueLocal(val) {
      this.singleData = this.tableList.find((item) => item.id == val);
      this.view = "single";
    },
    //云端电影列表 查看详情ok
    async lookDetail(val) {
      let usermivcelist = [];
      this.seledlenth = this.tableList.filter((it) => it.id == val);
      // console.log(this.sendmoviceList, 'all')
      this.sendmoviceList.forEach((item) => {
        if (item.oriId == val && usermivcelist.map((i) => i.id).indexOf(item.id) == -1) {
          usermivcelist.push(item);
        }
      });
      this.hotelAray = [
        ...new Set(this.sendmoviceList.filter((i) => i.oriId == val).map((i) => i.hotelId)),
      ];
      this.moviceListState = usermivcelist; //
      if (this.moviceListState.length == 0) return this.$error("正在下发中请稍等");
      this.issueNow = true;
    },
    // 批量云端电影列表 查看详情ok
    btachlook() {
      const seledlenth = this.$refs.table.getSelections();
      const moviceIds = seledlenth.map((item) => item.id); //用户选择的电影id
      this.seledlenth = seledlenth; //用戶選中的電影數據
      if (seledlenth.length == 0) return this.$error("请选择要查看的电影");

      let arr1 = []; //所有用户查看的已下发的数据
      let asynlist = []; //筛选出数据
      seledlenth.forEach((i) => {
        asynlist = this.syncListData.filter((d) => d.oriId == i.id);
        if (asynlist.length !== 0) {
          arr1.push(asynlist);
        }
      });
      if (seledlenth.length !== arr1.length) return this.$error("请选择已下发的电影查看状态");
      // 筛出用户选择的电影
      let userMovice = [];
      moviceIds.forEach((item) => {
        this.sendmoviceList.forEach((idx) => {
          if (item == idx.oriId && userMovice.map((i) => i.id).indexOf(idx.id) == -1) {
            userMovice.push(idx);
          }
        });
      });
      this.moviceListState = userMovice;
      // console.log(userMovice, '全部的电影')

      this.hotelAray = [...new Set(userMovice.map((i) => i.hotelId))];
      // console.log(this.hotelAray);
      if (this.moviceListState.length == 0) return this.$error("请选择已下发的电影");

      this.issueNow = true;
    },
    //格式化成字符串
    formatString(val) {
      let str = "";
      let arr = [];
      if (val.length == 0) {
        return "-";
      }
      let data;
      val.forEach((item) => {
        data = this.$store.state.copyrightlist.find((idx) => idx.class.id == item);
        if (data) {
          arr.push(data.class.name);
        }
      });
      arr.forEach((i) => (str += i + "+"));
      return str.slice(0, str.length - 1);
    },
    //已下发电影列表的编辑
    async editTable(val) {
      try {
        let arr = this.syncListData.find((i) => i.oriId == val).copyrightClassIds;
        this.copyrightstring = this.formatString(arr);
        const data = await MoviceListApi.getEditData(val);
        this.editDataed = data;
        this.view = "movieEdit";
      } catch (error) {
        console.log(error);
      }
    },
    //返回到首页 编辑返会
    closeForm() {
      this.getIssueState();
      this.view = "movielist";
    },
    filterData(id) {
      console.log(this.syncListData.filter((d) => d.oriId == id));
    },
    //批量下发文件到酒店本地跳转
    async sendfile() {
      this.allmoviceName = this.$refs.table.getSelections();

      let arr1 = [];
      let data1;
      this.allmoviceName.forEach((i) => {
        data1 = this.syncListData.filter((d) => d.oriId == i.id);
        if (data1.length > 0) {
          console.log(11, data1.length);
          arr1.push(data1);
        }
      });
      if (arr1.length > 0) return this.$error("请选择未下发的电影");
      if (this.allmoviceName.length == 0) return this.$error("请选择要下发的电影");
      this.view = "batch"; //批量 batch  single
    },
    //返回首页
    backhigh() {
      this.copyrightClassIds = [];
      this.allmoviceName = [];
      this.view = "high";
    },
  },
  components: {
    CoolTable,
    MoviceEdit,
    CoolModal,
    MoviceDetails,
  },
};
</script>

<style lang="scss" scoped>
//酒店列表下的提示
.hotellist {
  font-size: 0.5rem;
  color: #b39e9d;
}
//下发的酒店列表的样式
::v-deep .tablehotel .form-control,
.search-input,
.btn-secondary {
  display: none;
}
::v-deep .tablehotel .columns-right,
.btn-group,
.float-right {
  display: none;
}
::v-deep .handle {
  text-align: right;
  margin-top: 1 rem;
}
.centerbox {
  display: flex;
  // justify-items: center;
  justify-content: center;
}
.navreative {
  position: relative;
}
.info {
  position: absolute;
  width: 1.458rem;
  height: 0.833rem;
  right: 1%;
  top: -26%;
  border-radius: 40%;
  color: #fff;
  background-color: red;
  line-height: 0.833rem;
  text-align: center;
  font-size: 0.5rem;
}
// .btn-pos {
//   position: relative;
// }
//提示请勾选未下发电影
// .hint {
//   position: absolute;
//   bottom: -68%;
//   left: 0%;
//   font-size: 0.5rem;
//   color: red;
// }
// .hintstate {
//   position: absolute;
//   bottom: -96%;
//   left: 0%;
//   font-size: 0.5rem;
//   color: red;
// }
::v-deep .movicelist {
  width: 100%;
  // height: 100 px;
  // height: 100%;
  // overflow: auto;
}
.movice_bottom {
  line-height: 3;
  border-bottom: 1px solid #e8e8e8;
  text-align: center;
}
.movice_bottom:last-child {
  border-bottom: none;
}
.modal-body {
  padding: 0;
}
//电影名称的样式
.movicelist {
  line-height: 2;
  // border-bottom: 0.042rem solid #f1f1f1;
  text-align: center;
}
//最外层的样式
::v-deep .outerStyle {
  background-color: #fff;
}
::v-deep td {
  max-width: 300px;
}
::v-deep .tdStyle {
  word-wrap: break-word;
}
::v-deep .button-sty {
  width: 150px;
}
//右上角的框架样式
::v-deep .bootstrap-table .fixed-table-toolbar .columns-right {
  display: none;
}
// input 文字居中
.lable_Center {
  vertical-align: text-bottom;
  margin-bottom: 2px;
}
//上下居中
.floatCenter {
  display: flex;
  align-items: center;
}
// .modal.fade .modal-dialog {
//   height: 100%;
// }
//    .modal.fade .modal-dialog {
//      width: 100%;
//    }
::v-deep .modal-body {
  max-height: 100%;
  min-width: 10%;
  // height: 100%;
  overflow: auto;
}
// .tablehotel .modal-content {
//   min-height: 1%;
//   max-height: 80%;
//   // height: 80%;
//   overflow: auto;
// }
::v-deep .modal-dialog .modal-xl {
  height: 100%;
}
::v-deep .modal.show .modal-dialog {
  height: 100%;
}
::v-deep .modal-content {
  // height: 80%;
  // min-width: 1%;
  min-height: 10%;
  max-height: 90%;
}
::v-deep .modal-body {
  height: 100%;
  overflow: auto;
}
::v-deep .fontColor {
  color: #007bff !important;
}
a {
  color: black;
}
</style>
