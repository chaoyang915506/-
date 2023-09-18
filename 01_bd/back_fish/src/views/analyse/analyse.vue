<template>
  <div class="app_dev">
    <div class="box_content">
      <!-- 左侧 -->
      <div class="left">
        <el-tabs
          v-model="left_info"
          tab-position="top"
          @tab-click="tabClickLeft"
        >
          <el-tab-pane label="组织结构" name="zuzhi">
            <div class="left_box">
              <div class="title_info">
                <span>组织机构</span>
                <div></div>
              </div>

              <el-input
                style="margin: 10px 0; height: 30px"
                v-model="serchinfo"
                placeholder="请输入查询内容"
                size="small"
              >
                <template #suffix>
                  <div class="icon-item" @click="gettree">
                    <svg-icon class-name="search-icon" icon-class="search" />
                  </div>
                </template>
              </el-input>
              <div class="left_content">
                <el-tree
                  ref="tree"
                  :default-expand-all="true"
                  :data="treeDataCopy"
                  :props="treeProps"
                  @node-click="treeClick"
                ></el-tree>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="母港" name="mugang">
            <div class="left_box">
              <div class="title_info">
                <span>母港</span>
                <div></div>
              </div>
              <div class="left_content_mugang">
                <el-tree
                  :default-expand-all="true"
                  :data="harborCopy"
                  :props="treeProps"
                  @node-click="mugangClick"
                ></el-tree>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="自定义" name="zidyi">
            <div class="left_box">
              <div class="title_info">
                <span>自定义</span>
                <div></div>
              </div>
              <div class="left_content_mugang">
                <ul class="ulCont" style="cursor: default">
                  <li
                    class="harborfont"
                    style="cursor: default"
                    v-for="(i, j) in customlist"
                    :key="j"
                  >
                    <el-checkbox-group v-model="selectzidiyi" :max="2">
                      <el-checkbox
                        @change="zidingyichange(i)"
                        class="checkbox_css"
                        :label="i.sideNum"
                        :value="i.sideNum"
                        :key="i.sideNum"
                      >
                      </el-checkbox>
                    </el-checkbox-group>
                  </li>
                </ul>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="兵力布势" name="bingli">
            <div class="left_box">
              <div class="title_info">
                <span>兵力布势</span>
                <div></div>
              </div>
              <div class="left_content_mugang">
                <div
                  class="bingli_style"
                  v-for="(i, key) in dispositionlist"
                  :key="key"
                >
                  <div style="margin-bottom: 6px">{{ i.name }}</div>
                  <div v-for="(item, idx) in i.children" :key="idx">
                    <div style="margin: 5px 0">
                      <span style="display: inline-block; width: 10px"></span>
                      <div class="ponit_state"></div>
                      {{ item.name }}
                    </div>
                    <div
                      v-for="(idr, idx) in item.children"
                      :key="idx"
                      style="margin: 5px 0"
                    >
                      <span style="display: inline-block; width: 20px"></span>
                      <div class="ponit_state"></div>
                      {{ idr.sideNum }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 中间 -->
      <middle
        class="middle"
        :subMaineData="subLonlatdata"
        ref="middle"
        :sideName="sideName"
        :count="count"
        :right_box="right_box"
        :style="{
          width: right_box ? '70%' : '80%',
        }"
      />
      <!-- width: right_box ? '50%' : '75%', -->

      <!-- 右侧 -->
      <div class="right" v-if="right_box">
        <el-tabs v-model="right_info" tab-position="top">
          <el-tab-pane
            label="概况"
            name="gl"
            v-if="left_info == 'zuzhi' || left_info == 'mugang'"
          >
            <div class="left_box">
              <!-- "  -->
              <div
                :class="[
                  right_info == 'gl'
                    ? 'right_tile_gaikuang'
                    : 'right_tile_echarts',
                ]"
              >
                <!-- 概况的数据 -->
                <div class="right_content" v-if="right_info == 'gl'">
                  <!-- gaikuang/ -->
                  <div
                    class="data"
                    v-if="device == 'standalone' && left_info == 'zuzhi'"
                    @click="looktext('概况', 'zuzhihtml', submainelist)"
                    style="background: #122b54; padding: 5px"
                  >
                    <div class="title_info">
                      <span>组织机构</span>
                      <div></div>
                    </div>
                    <zuzhihtml
                      :template1="submainelist"
                      :imgurl="imgurl"
                    ></zuzhihtml>
                  </div>
                  <div
                    class="data"
                    v-if="device == 'standalone' && left_info == 'zuzhi'"
                    @click="looktext('舰艇参数', 'jtcshtml', submainelist)"
                  >
                    <div class="title_info">
                      <span>舰艇参数</span>
                      <div></div>
                    </div>
                    <jtcshtml :template1="submainelist" :imgurl="imgurl" />
                  </div>
                  <!-- 第四中队概况 `${allgkdata.orgName}-->
                  <div
                    class="data"
                    @click="
                      looktext(' 概况', 'zdhtml', {
                        data1: allgkdata,
                        data2: nextinfo,
                      })
                    "
                    v-if="
                      device == 'detachment' ||
                      device == 'commander' ||
                      device == 'brigade'
                    "
                  >
                    <div class="ti">
                      <div class="mugang_title">
                        <div class="infoh">
                          {{ allgkdata ? allgkdata.orgName : "" }}概况
                        </div>
                      </div>
                    </div>
                    <!-- <div class="sketch"> -->
                    <zdhtml
                      :template1="{ data1: allgkdata, data2: nextinfo }"
                      :imgurl="imgurl"
                      :device="device"
                    ></zdhtml>
                    <!-- </div> -->
                  </div>

                  <!-- 母港的数据 -->
                  <div
                    class="data"
                    v-if="left_info == 'mugang'"
                    @click="looktext(` 概况`, 'dlhtml', mugangdata)"
                  >
                    <div class="title_info">
                      <span>概况</span>
                      <div></div>
                    </div>
                    <dlhtml
                      :template1="mugangdata"
                      :sideNum="sideNum"
                      :oldsideNum="oldsideNum"
                      :imgurl="imgurl"
                    ></dlhtml>
                  </div>
                  <div
                    class="data"
                    v-if="left_info == 'mugang' || device == 'detachment'"
                    @click="
                      looktext(
                        `${allgkdata ? allgkdata.orgName : ''} 战备详情`,
                        'zbxqhtml',
                        {
                          data1: bushuperson,
                          data2: zbxqdata,
                          data3: cuboirddata,
                        }
                      )
                    "
                  >
                    <div class="title_info">
                      <span>战备详情</span>
                      <div></div>
                    </div>

                    <zbxqhtml
                      :template1="{
                        data1: bushuperson,
                        data2: zbxqdata,
                        data3: cuboirddata,
                      }"
                    ></zbxqhtml>
                  </div>
                  <!-- style="height: 50%" -->
                  <div
                    class="data"
                    v-if="device == 'standalone' && left_info == 'zuzhi'"
                  >
                    <!-- @click="looktext('近期数据', 'messageinfo', mediaInfo)" -->
                    <div class="title_info">
                      <span>近期数据</span>
                      <div></div>
                    </div>
                    <!-- <div class="left_box"> -->
                    <messageinfo :template1="mediaInfo" />
                    <!-- </div> -->
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="统计信息" name="tjinfo">
            <statistical
              v-if="right_info == 'tjinfo'"
              :device="device"
              :view="left_info"
              :imgurl="imgurl"
              :sondata="sondata"
              :max="true"
              :selectzidiyi="selectzidiyi"
            />
          </el-tab-pane>
        </el-tabs>
        <div class="img_arrows" @click="right_box = !right_box">
          <img
            :class="[right_box ? 'imgopen' : 'imgclose']"
            src="/img/ui/arrows.svg"
            alt=""
          />
        </div>
      </div>
      <div
        class="ceshi_css"
        @click="right_box = !right_box"
        v-if="right_box == false && stateOpen == true"
      >
        <img
          :class="[right_box ? 'imgopen' : 'imgclose']"
          src="/img/ui/arrows.svg"
          alt=""
        />
      </div>
    </div>
    <!--弹框关于文字 -->
    <eldog v-model="show" :title="didogtitle" width="70%" v-if="show">
      <component
        :is="currentIndex"
        :template1="template1"
        :messageshow="true"
        :max="true"
        :imgurl="imgurl"
        :device="device"
        :oldsideNum="oldsideNum"
        :sideNum="sideNum"
        :style="{ width: '100%', height: currentIndex == '' }"
      ></component>
    </eldog>
  </div>
</template>

<script>
import dlhtml from "./components/dlhtml.vue";
import progressbar from "./echarts/progressbar.vue";
import messageinfo from "./components/messageinfo.vue";
import middle from "./middle.vue";
import { 格式化兵力部署, formatterdate } from "./fomater";
import eldog from "@/components/Dialog/index.vue";
import zdhtml from "./components/zdhtml.vue";
import {
  查询组织机构,
  查询母港,
  查询自定义,
  查询兵力部署,
  单艇战备率,
  单艇停泊位置点,
  单艇战备出动率,
  潜艇信息根据舷号查询,
  母港信息管理查询,
  战备详情查询V3,
  统计分析自定义,
  兵力部署查询,
  母港战备出动频率,
  母港舰型统计,
  母港靠泊本港舰船类别列表,
  单艇生命周期查询,
  战备出动频率分析多,
  部署密度分析日历图多,
  大队中队船型占比查询,
  司令部大队中队概况,
  部署时长,
  母港日历图,
  通用查询舷号,
  态势模块状态信息根据弦号列表查询V3,
  根据母港ID查询潜艇信息历史,
  查询图片服务器地址,
  社交媒体信息,
} from "@/api/analyse/analyse.js";
import statistical from "./statistical.vue";
import Zuzhihtml from "./components/zuzhihtml.vue";
import jtcshtml from "./components/jtcshtml.vue";
import Zbxqhtml from "./components/zbxqhtml.vue";
export default {
  components: {
    middle,
    statistical,
    messageinfo,
    progressbar,
    Zuzhihtml,
    eldog,
    jtcshtml,
    zdhtml,
    Zbxqhtml,
    dlhtml,
  },
  data() {
    return {
      count: 0,
      sideName: [], //c穿给中间的数据
      template1: {},
      show: false,
      currentIndex: Zuzhihtml,
      didogtitle: "",
      imgurl: "",
      allgkdata: null, //'大队司令中队的信息'
      nextinfo: [],
      // zhognduiname: "", //中队名称
      right_box: false, //右侧box 状态
      mediaInfo: [],
      selectzidiyi: [], //自定义用户选择的
      right_info: "gl",
      left_info: "zuzhi",
      //树形取值
      treeProps: {
        children: "children",
        label: "name",
      },
      treeData: [], //书的数据
      harbor: [],
      customlist: [],
      dispositionlist: [], //兵力部署
      app_line_type: [],
      serchinfo: "",
      device: "standalone", //显示more few
      zbxqdata: [], //战备详情
      progressdata: {
        xdata: 29,
      },
      submainelist: {}, //潜艇信息
      sondata: {
        fingthD: {},
        barthData: {},
        combatdata: {},
        zdydata: {},
        cxlbdata: {},
        troopslist: {},
        tgmgdata: {},
        mugangmidudata: {}, //密度
        zhanbeichudong: {}, //战备出动频率分析
        piecommon: [], //战备出动频率分析
        pierose: [], //玫瑰
        bartimedeploy: {}, //正负
        lifedata: [], //时间轴
      },
      mugangdata: {},
      bushuperson: "", //战备详情百分比
      sideNum: "",
      cuboirddata: [], //战备详情柱子
      lonlatlist: [], //所有的艇的经纬度
      subLonlatdata: [], //筛选有的艇
      stateOpen: false, //弹窗状态
      oldsideNum: "", //laoting
      mediaData: {
        sideNum: "",
        pageNum: 0,
        pageSize: 100,
      },
    };
  },
  created() {
    this.getLongItude();
    查询图片服务器地址().then((res) => {
      this.imgurl = res.data.imageServerUri;
    });
    this.getframework();
    this.getDicts("app_line_type").then((res) => {
      this.app_line_type = res.data;
    });
  },
  computed: {
    harborCopy() {
      return this.harbor.map((i) => {
        return {
          ...i,
          name: i.harborNameZh,
          children: i.bdsSubmaines.map((d) => {
            return {
              ...d,
              name: d.sideNum,
            };
          }),
        };
      });
    },
    treeDataCopy() {
      const endValue = (value, arr) => {
        if (!arr) {
          return [];
        }
        let newarr = [];
        arr.forEach((elemnt) => {
          if (elemnt.name.indexOf(value) > -1) {
            const ab = endValue(value, elemnt.children);
            const obj = {
              ...elemnt,
              children: ab,
            };
            newarr.push(obj);
          } else {
            if (elemnt.children && elemnt.children.length > 0) {
              const ab = endValue(value, elemnt.children);
              const obj = {
                ...elemnt,
                children: ab,
              };
              if (ab && ab.length > 0) {
                newarr.push(obj);
              }
            }
          }
        });
        return newarr;
      };
      return this.serchinfo
        ? endValue(this.serchinfo, this.treeData)
        : this.treeData;
    },
  },
  methods: {
    loadMore() {
      this.getmeitiinfo();
    },
    tabClickLeft() {
      this.stateOpen = false;
      this.right_box = false;

      if (this.left_info == "bingli") {
        this.stateOpen = true;
        this.leftFn("bingli");
        this.right_box = true;
        this.right_info = "tjinfo";
        // this.stateOpen = true;
      } else if (this.left_info == "zidyi") {
        this.selectzidiyi = [];
        this.right_info = "tjinfo";
      } else {
        this.stateOpen = false;
        this.right_box = false;
      }
    },
    mugangClick(e) {
      if (e.harborId) {
        this.getSubMaineData({ queryType: 2, id: e.harborId });
      }
      if (e.children.length > 0) {
        this.mugangfn(e);
      }
    },
    looktext(title, val, data) {
      this.show = true;
      this.didogtitle = title;
      this.currentIndex = val;
      this.template1 = data;
    },
    //点击母港
    async mugangfn(i) {
      this.sideName = [];
      if (i.bdsSubmaines) {
        this.sideName = i.bdsSubmaines.map((i) => i.sideNum);
      }
      let res9 = await 根据母港ID查询潜艇信息历史(i.harborId);
      let oldNum = "";
      res9.rows.forEach((i, j) => {
        if (j + 1 == res9.rows.length) {
          oldNum += i.sideNum;
        } else {
          oldNum += i.sideNum + "  / ";
        }
      });
      this.oldsideNum = oldNum;
      let res8 = await 母港日历图({ harborName: i.harborName });
      this.stateOpen = true;
      this.sondata.mugangmidudata = formatterdate(res8.rows, 10, "bsCount");

      let res6 = await 母港靠泊本港舰船类别列表({ harborName: i.harborName });
      this.sondata.tgmgdata = res6.rows.map((i) => {
        return {
          value: i.jtCount,
          name: i.sideType,
        };
      });

      let res4 = await 母港战备出动频率({ harborName: i.harborName });
      let today = new Date().getFullYear();
      let year = [];
      for (let i = 0; i < 10; i++) {
        year.unshift(today - i);
      }
      let mgdatares = year.map((i) => {
        let ads = res4.rows.find((d) => d.year == i);
        if (ads) {
          return ads;
        } else {
          return {
            year: i,
            bsCount: 0,
            wxCount: 0,
            harborName: "",
          };
        }
      });
      this.sondata.mugangzb = {
        xdata: mgdatares.map((i) => i.year),
        topdata: mgdatares.map((i) => i.bsCount),
        bottomdata: mgdatares.map((i) => i.wxCount),
      };
      this.getzbxqdata(i);
      let res5 = await 母港舰型统计({ harborName: i.harborName });
      this.sondata.cxlbdata = {
        xdata: res5.rows.map((i) => i.sideType),
        seriesdata: res5.rows.map((i) => i.jtCount),
      };
      let res = await 母港信息管理查询(i.harborId);
      this.mugangdata = res.data;

      let str = "";
      i.bdsSubmaines.forEach((i) => {
        str += i.sideNum + "  / ";
      });
      this.sideNum = str;
      this.right_box = true;
    },
    //获取战备详情
    async getzbxqdata(i) {
      let params;
      //id==1组织结构
      if (i.id == 1) {
        params = {
          queryType: 1,
          id: i.arr.id,
          startDate: "2022-8-18",
        };
      } else {
        // 母港
        params = {
          queryType: 2,
          id: i.harborId,
          startDate: "2022-8-18", //后期会改成当天
        };
      }
      let res1 = await 战备详情查询V3(params);
      let allnum = res1.rows.filter((i) => i.states == "部署");
      this.bushuperson = ((allnum.length / res1.rows.length) * 100).toFixed(2);

      let obj = {};
      for (let key in res1.rows) {
        let kv = res1.rows[key];
        let kn = kv.states.substring(0, 2);
        if (!obj[kn]) {
          obj[kn] = 1;
        } else {
          obj[kn++];
        }
      }
      let num = eval(Object.values(obj).join("+"));
      let arrd = [];
      for (let key in obj) {
        let params = {
          person: (obj[key] / num) * 100 + "%",
          name: key,
          length: obj[key],
          states: "",
        };
        params.name = key.substring(0, 2);
        if (key == "部署") {
          params.color = "#0eaac0";
          params.states = "部署";
        } else if (key.substring(0, 2) == "在港") {
          params.color = "#e7e7e7";
          params.states = "在港";
        } else if (key == "维修") {
          params.color = "#ff0000";
          params.states = "维修";
        }
        arrd.push(params);
      }
      this.cuboirddata = arrd;
      this.zbxqdata = res1.rows
        .filter((i) => i.states)
        .map((i) => {
          let names = i.states.substring(0, 2);
          return {
            ...i,
            states: names,
          };
        });
    },
    // 多艇中队
    getzhongdui(i) {
      this.getzhanbeiddd(i);
      this.getdays(i);
      this.getcxzbdata(i);
    },
    //多艇大队
    getbigdui(i, j) {
      this.getzhanbeiddd(i, j);
      this.getdays(i, j);
      this.getcxzbdata(i, j);
    },
    // 战备出动频率分析多
    async getzhanbeiddd(i, j) {
      let res = await 战备出动频率分析多(j ? "" : { id: i.id });
      let year = new Date().getFullYear();
      let datelist = [];
      for (let i = 0; i < 10; i++) {
        datelist.unshift(year - i);
      }
      let data = datelist.map((i) => {
        let find = res.rows.find((idx) => idx.year == i);
        if (find) {
          return find;
        } else {
          return {
            year: i,
            deployCount: 0,
            serviceCount: 0,
          };
        }
      });
      let bushunum = eval(data.map((i) => i.deployCount).join("+"));
      let ewixiunum = eval(data.map((i) => i.serviceCount).join("+"));

      this.sondata.piecommon = [
        { value: bushunum, name: "部署" },
        { value: ewixiunum, name: "维修" },
      ];

      this.sondata.zhanbeichudong = {
        xdata: data.map((i) => i.year),
        topdata: data.map((i) => i.deployCount),
        bottomdata: data.map((i) => i.serviceCount),
      };
    },
    // 部署密度分析日历图多
    async getdays(i, j) {
      let res = await 部署密度分析日历图多(j ? "" : { id: i.id });
      this.sondata.densitytable = formatterdate(res.rows, 10);
    },
    // 大队中队船型占比查询
    async getcxzbdata(i, j) {
      let res = await 大队中队船型占比查询(j ? "" : { id: i.id });
      this.sondata.barshiptype = {
        seriesdata: res.rows.map((i) => i.shipCount),
        xdata: res.rows.map((i) => i.jbpc),
      };
      this.sondata.piearch = res.rows;
      // if(res.)
      this.sondata.pierose = {
        xdata: res.rows.map((i) => i.jbpc),
        seriesdata: res.rows.map((i) => i.shipCount),
      };
    },
    //概况组织机构
    async getGaikuang(i) {
      let res3 = await 潜艇信息根据舷号查询(i.name);
      this.submainelist = res3.rows[0];
    },
    //单停查询
    async getdanting(i) {
      let res = await 单艇战备率(i.name);
      this.sondata.fingthD = {
        value: res.slice(0, res.length - 1) / 100,
      };
      let res1 = await 单艇停泊位置点(i.name);
      let newdatares1 = res1.rows.sort((a, b) => b.berthCount - a.berthCount);
      this.sondata.barthData = {
        seriesdata: newdatares1.map((i) => i.berthCount),
        xdata: newdatares1.map((i) => i.addr),
      };

      let res2 = await 单艇战备出动率(i.name);
      let date = new Date().getFullYear() - 9;
      let arr = [];
      for (let i = date; i <= new Date().getFullYear(); i++) {
        arr.push(i);
      }
      let time = arr.map((i) => {
        let ddd = res2.rows.find((idx) => idx.year == i);
        return {
          xdata: i,
          seriesdata: ddd ? ddd.deployCount : 0,
        };
      });
      this.sondata.combatdata = {
        xdata: time.map((i) => i.xdata),
        seriesdata: time.map((i) => i.seriesdata),
      };
      //生命周期
      this.getdantinglife(i);
    },
    async getdantinglife(idx) {
      let res7 = await 单艇生命周期查询({ names: idx.name });
      let reg = new RegExp("部署", "i");
      let reg2 = new RegExp("维修", "i");
      let reg3 = new RegExp("停泊", "i");
      let reg4 = new RegExp("行驶", "i");
      let reg5 = new RegExp("战斗", "i");
      let overReg = new RegExp("结束部署", "i");
      let rgb = res7.rows
        .map((i, j) => {
          let tooltipStyle;
          if (j % 2 == 0) {
            tooltipStyle = {
              top: "-10vw",
              bottom: 0,
              boxWidth: "",
            };
          } else {
            tooltipStyle = {
              bottom: "-10vw",
              top: "30px",
              boxWidth: "",
            };
          }
          return {
            ...i,
            startTime: this.parseTime(i.begintime, "{y}-{m}-{d}"),
            timeLineWidth: "",
            tooltipStyle,
          };
        })
        .map((i, index) => {
          if (reg.test(i.event)) {
            return { ...i, color: "#0eaac0", xueTop: "-150px" };
          } else if (reg2.test(i.event)) {
            return { ...i, color: "#ff0606", xueTop: "-50px" };
          } else if (reg3.test(i.event)) {
            //停泊
            return { ...i, color: "#78521a", xueTop: "-100px" };
          } else if (reg4.test(i.event)) {
            //行驶
            return { ...i, color: "#007acc", xueTop: "-200px" };
          } else if (reg5.test(i.event)) {
            //战斗
            return { ...i, color: "#f0a21b", xueTop: "-250px" };
          } else {
            return {
              ...i,
              color: "#878787",
              xueTop: "-250px",
            };
          }
        });
      // 如果是结束部署的事件，需要和下一个事件的时间作对比，如果下一个事件的开始时间小于结束部署的结束时间，就给两个元素换位置，然后再往下重复执行该操作。
      for (var i = 0; i < rgb.length; i++) {
        if (overReg.test(rgb[i].event)) {
          // 结束部署的开始时间，显示为结束时间
          rgb[i].startTime = this.parseTime(rgb[i].endtime, "{y}-{m}-{d}");
          for (var j = i; j < rgb.length; j++) {
            if (rgb[j].endtime > rgb[j + 1].begintime) {
              let temp = null;
              temp = rgb[j + 1];
              rgb[j + 1] = rgb[j];
              rgb[j] = temp;
              // "交换位置", j
            } else {
              // 跳出内循环", j);
              break;
            }
            // "结束部署", i, rgb[i]);
          }
        }
      }

      this.sondata.lifedata = rgb;
    },
    // 默认获取
    async getframework() {
      this.gettree();
      const barbor = await 查询母港();
      const submaine = await 查询自定义();
      const disposition = await 查询兵力部署();
      this.customlist = submaine.rows;
      this.dispositionlist = 格式化兵力部署(
        disposition.rows,
        this.app_line_type
      );
      this.harbor = barbor.rows;
    },
    async gettree() {
      this.treeData = [];
      const res = await 查询组织机构({ name: this.serchinfo });
      this.treeData = res.rows;
    },
    //树形点击
    treeClick(e) {
      this.right_info == "gl";
      this.stateOpen = true;
      this.right_box = true;
      if (e.dataType != 2) {
        this.nextinfo = e.children;
      }
      if (new RegExp("司令").test(e.name)) {
        this.sideName = this.getsilicar(e);
        this.sideName = [];
        this.getallgkdata(e);
        this.getbartimedeploy(e);
        this.getbigdui(e);
        this.getSubMaineData({ queryType: 1, id: e.id });

        this.device = "commander";
      } else if (new RegExp("大队").test(e.name)) {
        this.sideName = this.getdaduicar(e);
        this.getallgkdata(e);
        this.getbigdui(e);
        this.getSubMaineData({ queryType: 1, id: e.id });

        this.device = "brigade";
      } else if (new RegExp("中队").test(e.name)) {
        this.sideName = this.getzhongduicar(e);
        this.getallgkdata(e);
        this.getzbxqdata({ id: 1, arr: e });
        this.getzhongdui(e);
        this.getSubMaineData({ queryType: 1, id: e.id });
        this.device = "detachment";
      } else if (e.dataType == 2) {
        this.rightfn("gl");
        this.sideName = [e.name];
        //单个
        this.getmeitiinfo(e);
        this.getGaikuang(e);
        this.getdanting(e);
        // this.$refs.middle.search();
        this.getSubMaineData([{ sideNum: e.name }]);
        this.device = "standalone";
      } else if (new RegExp("潜艇部队").test(e.name)) {
        this.sideName = this.allbuduicar(e);
        this.getallgkdata(e, "null");
        this.getbartimedeploy(e, "null");
        this.getbigdui(e, "null");
        this.device = "commander";
        this.getSubMaineData({ queryType: 1, id: "" });
      }
    },

    //h获取艇的艇号
    async getSubMaineData(data) {
      let submaine;
      if (Array.isArray(data)) {
        submaine = data;
      } else {
        let res = await 通用查询舷号(data);
        submaine = res.rows;
      }
      let lastdata = submaine
        .map((item) => {
          let results = this.lonlatlist.find((i) => i.name == item.sideNum);
          return results ? results : null;
        })
        .filter((i) => i);
      this.$refs.middle.findSubMaine(lastdata);
    },
    //查艇下的经纬度
    async getLongItude() {
      let res = await 态势模块状态信息根据弦号列表查询V3({
        startDate: "2022-08-18",
      });
      this.lonlatlist = res.rows;
    },

    //获取整个潜艇
    allbuduicar(i) {
      if (i.children.length == 0) return [];
      return i.children
        .map((d) => {
          return this.getsilicar(d);
        })
        .flat();
    },
    //获取司令下的潜艇
    getsilicar(i) {
      if (i.children.length == 0) return [];
      let zdui = RegExp("中队", "i");
      let ddui = RegExp("大队", "i");
      return i.children
        .map((id) => {
          if (zdui.test(id.name)) {
            return this.getzhongduicar(id);
          } else {
            return this.getdaduicar(id);
          }
        })
        .flat();
    },
    //获取中队
    getdaduicar(i) {
      if (i.children.length == 0) return [];
      return i.children
        .map((k) => {
          return this.getzhongduicar(k);
        })
        .flat();
    },
    rightfn(val) {
      this.right_info = val;
    },
    //获取中队下的潜艇
    getzhongduicar(i) {
      if (i.children.length == 0) return [];
      return i.children.map((i) => i.name);
    },
    async getbartimedeploy(e, j) {
      let res = await 部署时长(j ? "" : { id: e.id });
      let newdata1 = res.rows.sort((a, b) => b.deployCount - a.deployCount);
      this.sondata.bartimedeploy = {
        xAxisData: newdata1.map((i) => i.days),
        stdplotData: newdata1.map((i) => i.deployCount),
      };
    },
    //司令大队中队的信息
    async getallgkdata(i, j) {
      let res = await 司令部大队中队概况(i.id);
      this.allgkdata = res.rows[0];
    },
    // 自定义点击
    async zidingyichange(i) {
      if (this.selectzidiyi.length >= 2) {
        let res = await 统计分析自定义({ names: this.selectzidiyi });
        this.sondata.zdydata = {
          leftdata: [
            { value: res.rows[0].bsCount, info: res.rows[0].addrs },
            { value: res.rows[0].wxCount, info: res.rows[0].addrs },
            { value: res.rows[0].addrCount, info: res.rows[0].addrs },
          ],
          rightdata: [
            { value: res.rows[1].bsCount, info: res.rows[1].addrs },
            { value: res.rows[1].wxCount, info: res.rows[1].addrs },
            { value: res.rows[1].addrCount, info: res.rows[1].addrs },
          ],
          ydata: ["部署次数", "维修次数", "停靠点"],
          serialtit: res.rows.map((i) => i.name),
        };

        this.right_box = true;
      }
    },
    async getmeitiinfo(i) {
      if (i.name) {
        this.mediaData = {
          sideNum: i.name,
          pageNum: this.mediaData.pageNum,
          pageSize: this.mediaData.pageSize,
        };
      } else {
        this.mediaData = {
          sideNum: i.name,
          pageNum: this.mediaData.pageNum + 1,
          pageSize: this.mediaData.pageSize,
        };
      }
      let res = await 社交媒体信息(this.mediaData);
      if (res.rows && res.rows.length > 0) {
        res.rows.forEach((item) => {
          let data = { ...item };
          this.mediaInfo.push(data);
        });
      }
    },
    async leftFn(val) {
      this.count += 1;
      this.selectzidiyi = [];
      this.device = "";
      this.right_box = false;
      this.left_info = val;
      if (val == "zidyi") {
        this.right_info = "tjinfo";
      } else if (val == "bingli") {
        let res = await 兵力部署查询();
        let arr = [];
        arr.push(this.format(1, 4, res, "#7c1f34", "一线"));
        arr.push(this.format(2, 5, res, "#7c6e4f", "二线"));
        arr.push(this.format(3, 5, res, "#3e8297", "三线"));
        this.sondata.troopslist = arr;
        this.right_box = true;
        this.right_info = "tjinfo";
      } else {
        this.right_info = "gl";
      }
    },
    format(a, b, res, color, front) {
      let data1 = res.rows.filter((i) => i.lineType == a);
      let data11 = res.rows.filter((i) => i.lineType == b);
      let titlle1 = [
        ...new Set([
          ...data1.map((i) => i.sideType),
          ...data11.map((i) => i.sideType),
        ]),
      ];
      let left = [];
      let right = [];
      titlle1.forEach((i) => {
        let fin = data1.find((id) => id.sideType == i);
        let finr = data11.find((id) => id.sideType == i);
        left.push(fin ? fin.jtCount : 0);
        right.push(finr ? finr.jtCount : 0);
      });
      let leftlabel = this.app_line_type.find((i) => i.dictValue == a);
      let rightlabel = this.app_line_type.find((i) => i.dictValue == b);

      return {
        leftdata: left,
        rightdata: right,
        ydata: titlle1,
        color,
        front: front,
        leftlabel: leftlabel ? leftlabel.dictLabel : "",
        rightlabel: rightlabel ? rightlabel.dictLabel : "",
      };
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-tree-node__content:hover {
  background-color: #0f1c40;
}
::v-deep .el-tree-node:focus > .el-tree-node__conten {
  background-color: null;
}
::v-deep .el-tree-node:focus > .el-tree-node__content {
  background-color: #0f1c40;
}
@import "./index.scss";
::v-deep .el-tabs__item {
  color: #fff;
}
.icon-item {
  line-height: 34px;
  width: 22px;
  color: #24292e;
  cursor: pointer;
}
.imggaik {
  width: 100px;
  height: 100px;
  float: right;
}

.ceshi_css {
  display: flex;
  margin-left: 5px;
  justify-content: center;
  padding: 10px 0;
  text-align: center;
  display: flex;
  width: 2%;
  height: 100%;
  box-shadow: inset 3px 3px 3px #054588, inset -3px -3px 3px #054588;
}
.img_arrows {
  position: absolute;
  left: 93%;
  top: 15px;
  height: 4px;
  width: 5px;
  background: #0d183d;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.imgclose {
  width: 8px;
  height: 13px;
}
.imgopen {
  z-index: 999;
  transform: rotate(-180deg);

  width: 8px;
  height: 13px;
}
</style>
