<template>
  <div class="app-container">
    语料分析
    <el-select
      v-model="currentCorpus"
      @change="corpusChange"
      placeholder="请选择修改项"
      style="width: 100%"
    >
      <el-option
        v-for="(item, i) in corpusData"
        :key="i"
        :label="item.dictLabel"
        :value="item.dictLabel"
      ></el-option>
    </el-select>
    <div v-if="currentCorpus === '人员'">
      人员名称
      <el-select
        v-model="currentHuman"
        @change="humanChange"
        filterable
        placeholder="请选择查询内容"
        style="width: 100%"
      >
        <el-option
          v-for="(item, i) in humanList"
          :key="i"
          :label="item.zhName"
          :value="item.orgUserId"
        ></el-option>
      </el-select>
      <button @click="humanSearch">查询</button>
      <button @click="addRow">新增</button>

      <el-tabs
        v-if="showHumanInfo"
        v-model="activeName"
        tab-position="top"
        class="tabs_class"
      >
        <el-tab-pane label="基础信息" name="base" style="height: 100%">
          <BASE
            :imageServerUri="imageServerUri"
            :humanShowState="humanShowState"
            :humanInfo="humanInfo"
            @addHumanSuc="addHumanSuc"
            @delHumanSuc="delHumanSuc"
          ></BASE>
        </el-tab-pane>
        <el-tab-pane label="教育经历" name="edu" style="height: 100%">
          <EDU
            :imageServerUri="imageServerUri"
            :humanShowState="humanShowState"
            :eduInfo="eduInfo"
            :currentHumanId="currentHumanId"
          ></EDU>
        </el-tab-pane>
        <el-tab-pane label="工作经历" name="work" style="height: 100%">
          <WORK
            :imageServerUri="imageServerUri"
            :humanShowState="humanShowState"
            :workInfo="workInfo"
            :currentHumanId="currentHumanId"
          ></WORK>
        </el-tab-pane>
        <el-tab-pane label="演训经历" name="train" style="height: 100%">
          <TRAIN
            :humanShowState="humanShowState"
            :trainInfo="trainInfo"
            :currentHumanId="currentHumanId"
          ></TRAIN>
        </el-tab-pane>
        <el-tab-pane label="个人能力" name="ability" style="height: 100%">
          <ABILITY
            :humanShowState="humanShowState"
            :abilityInfo="abilityInfo"
            :currentHumanId="currentHumanId"
          ></ABILITY>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div v-if="currentCorpus === '舰艇基础信息'">
      舰艇型号
      <el-select
        v-model="currentSidnum"
        filterable
        placeholder="请选择查询内容"
        style="width: 100%"
      >
        <el-option
          v-for="(item, i) in submarineList"
          :key="i"
          :label="item.sideNum"
          :value="item.sideNum"
        ></el-option>
      </el-select>
      <button @click="submarineSearch">查询</button>
      <button @click="submarineAdd">新增</button>
      <SBaseInfo
        v-if="showSBase"
        :subShowState="subShowState"
        :harborList="harborList"
        :currentSubmarineList="currentSubmarineList"
        :imageServerUri="imageServerUri"
        @submarineRest="submarineRest"
      ></SBaseInfo>
    </div>

    <div v-if="currentCorpus === '组织机构'">
      机构选择
      <el-select
        v-model="currentOrg"
        filterable
        placeholder="请选择查询内容"
        style="width: 100%"
      >
        <el-option
          v-for="(item, i) in orgList"
          :key="i"
          :label="item.orgName"
          :value="item.orgId"
        ></el-option>
      </el-select>
      <button @click="orgSearch">查询</button>
      <button @click="orgAdd">新增</button>
      <Organize
        v-if="showOrg"
        :orgShowState="orgShowState"
        :orgList="orgList"
        :currentOrgObj="currentOrgObj"
        :imageServerUri="imageServerUri"
        @orgReset="orgReset"
      ></Organize>
    </div>

    <div v-if="currentCorpus === '组织机构战例'">
      战例选择
      <el-select
        v-model="currentOrgId"
        filterable
        placeholder="请选择查询内容"
        style="width: 100%"
      >
        <el-option
          v-for="(item, i) in orgList"
          :key="i"
          :label="item.orgName"
          :value="item.orgId"
        ></el-option>
      </el-select>
      <button @click="battleSearch">查询</button>
      <button @click="battleAdd">新增</button>
      <Battle
        v-if="showBattle"
        :battleShowState="battleShowState"
        :orgId="currentOrgId"
        :imageServerUri="imageServerUri"
        :battleCount="battleCount"
        @battleReset="battleReset"
      ></Battle>
    </div>

    <div v-if="currentCorpus === '舰艇档案'">
      舰艇选择
      <el-select
        v-model="currentSidnumFile"
        filterable
        placeholder="请选择查询内容"
        style="width: 100%"
      >
        <el-option
          v-for="(item, i) in submarineList"
          :key="i"
          :label="item.sideNum"
          :value="item.sideNum"
        ></el-option>
      </el-select>
      <button @click="filesSearch">查询</button>
      <button @click="filesAdd">新增</button>
      <Files
        v-if="showFiles"
        :filesShowState="filesShowState"
        :sidNum="currentSidnumFile"
        :imageServerUri="imageServerUri"
        :filesCount="filesCount"
        @filesReset="filesReset"
      ></Files>
    </div>

    <div v-if="currentCorpus === '母港概况'">
      选择母港
      <el-select
        v-model="currentHarbor"
        filterable
        placeholder="请选择查询内容"
        @change="harborChange"
        style="width: 100%"
      >
        <el-option
          v-for="(item, i) in harborList"
          :key="i"
          :label="item.harborNameZh"
          :value="item.harborId"
        ></el-option>
      </el-select>
      <button @click="harborSearch">查询</button>
      <button @click="harborAdd">新增</button>
      <Homeport
        v-if="showHarbor"
        :harborShowState="harborShowState"
        :barborObj="currentHarborObj"
        :imageServerUri="imageServerUri"
        @harborReset="harborReset"
      ></Homeport>
    </div>

    <div v-if="currentCorpus === '重点账号'">
      选择账号
      <el-select
        v-model="currentAccount"
        filterable
        placeholder="请选择查询内容"
        @change="accountChange"
        style="width: 100%"
      >
        <el-option
          v-for="(item, i) in accountList"
          :key="i"
          :label="item.accountName"
          :value="item.id"
        ></el-option>
      </el-select>
      <button @click="accountSearch">查询</button>
      <button @click="accountAdd">新增</button>
      <Account
        v-if="showAccount"
        :accountShowState="accountShowState"
        :accountObj="currentAccountObj"
        :imageServerUri="imageServerUri"
        @accountReset="accountReset"
      ></Account>
    </div>

    <div v-if="currentCorpus === '潜艇分类'">
      <el-select
        v-model="currentSubType"
        @change="subTypeChange"
        filterable
        placeholder="请选择查询内容"
        style="width: 100%"
      >
        <el-option
          v-for="(item, i) in subTypeList"
          :key="i"
          :label="item.dictLabel"
          :value="item.dictValue"
        ></el-option>
      </el-select>
      <button @click="subTypeSearch">查询</button>
      <button @click="subTypeAdd">新增</button>

      <el-tabs
        v-if="showSubType"
        v-model="activeSubType"
        tab-position="top"
        class="tabs_class"
      >
        <el-tab-pane label="基础信息" name="subBase" style="height: 100%">
          <SubBase
            :subTypeShowState="subTypeShowState"
            :subBaseInfo="subBaseInfo"
            :currentSubType="currentSubType"
            @resetSubType="resetSubType"
          ></SubBase>
        </el-tab-pane>
        <el-tab-pane label="深测" name="subDeep" style="height: 100%">
          <Deep
            :subTypeShowState="subTypeShowState"
            :subDeepInfo="subDeepInfo"
            :currentSubType="currentSubType"
          ></Deep>
        </el-tab-pane>
        <el-tab-pane label="推进" name="subPropel" style="height: 100%">
          <Propel
            :subTypeShowState="subTypeShowState"
            :subPropelInfo="subPropelInfo"
            :currentSubType="currentSubType"
          ></Propel>
        </el-tab-pane>
        <el-tab-pane label="武器" name="subWeapon" style="height: 100%">
          <Weapon
            :subTypeShowState="subTypeShowState"
            :subWeaponInfo="subWeaponInfo"
            :currentSubType="currentSubType"
          ></Weapon>
        </el-tab-pane>
        <el-tab-pane label="作战" name="subFight" style="height: 100%">
          <Fight
            :subTypeShowState="subTypeShowState"
            :subFightInfo="subFightInfo"
            :currentSubType="currentSubType"
          ></Fight>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div v-if="currentCorpus === '首页视频'">
      视频选择
      <el-select
        v-model="currentVideoId"
        @change="videoChange"
        filterable
        placeholder="请选择查询内容"
        style="width: 100%"
      >
        <el-option
          v-for="(item, i) in videoList"
          :key="i"
          :label="item.resourceName"
          :value="item.resourceId"
        ></el-option>
      </el-select>
      <button @click="videoSearch">查询</button>
      <button @click="videoAdd">新增</button>
      <Video
        v-if="showVideo"
        :videoShowState="videoShowState"
        :currentVideoObj="currentVideoObj"
        :imageServerUri="imageServerUri"
        @videoReset="videoReset"
      ></Video>
    </div>
    <div v-if="currentCorpus === '预测管理'">
      <fore-cast></fore-cast>
    </div>
    <div v-if="currentCorpus === '态势管理'">
      <situ-ation></situ-ation>
    </div>
    <div v-if="currentCorpus === '统计信息管理'">
      <stati-stical></stati-stical>
    </div>
  </div>
</template>

<script>
import {
  组织人员列表,
  组织人员详情查询,
  个人能力查询Type2,
  组织机构获取人员演训经历查询,
} from "@/api/institutional/institutional.js";
import {
  潜艇信息列表,
  母港信息列表,
  组织机构列表,
} from "@/api/corpus/submarine";
import {
  基本信息列表,
  基本信息查询,
  深测查询,
  推进查询,
  武器查询,
  作战查询,
} from "@/api/corpus/sort";
import { 账号列表查询 } from "@/api/corpus/account";
import { 首页资源列表 } from "@/api/corpus/video";
import { 查询图片服务器地址 } from "@/api/situation/situation";
import BASE from "./comp/human/base.vue";
import EDU from "./comp/human/edu.vue";
import WORK from "./comp/human/work.vue";
import TRAIN from "./comp/human/train.vue";
import ABILITY from "./comp/human/ability.vue";
import SBaseInfo from "./comp/submarineBaseInfo/submarineBaseInfo.vue";
import Organize from "./comp/organize/organize.vue";
import Battle from "./comp/battle/battle.vue";
import Files from "./comp/files/files.vue";
import Homeport from "./comp/homeport/homeport.vue";
import Account from "./comp/account/account.vue";
import SubBase from "./comp/sort/base.vue";
import Deep from "./comp/sort/deep.vue";
import Fight from "./comp/sort/fight.vue";
import Propel from "./comp/sort/propel.vue";
import Weapon from "./comp/sort/weapon.vue";
import Video from "./comp/video/video.vue";
import ForeCast from "./comp/forecast/index.vue";
import SituAtion from "./comp/situation";
import StatiStical from "./comp/statistical";
export default {
  components: {
    BASE,
    EDU,
    WORK,
    TRAIN,
    ABILITY,
    SBaseInfo,
    Organize,
    Battle,
    Files,
    Homeport,
    Account,
    SubBase,
    Deep,
    Fight,
    Propel,
    Weapon,
    Video,
    ForeCast,
    SituAtion,
    StatiStical,
  },
  data() {
    return {
      // 艇基础信息
      activeName: "base",
      corpusData: [],
      currentCorpus: "统计信息管理",
      imageServerUri: "",
      // 人员信息
      humanInfo: {},
      eduInfo: [],
      workInfo: [],
      trainInfo: [],
      abilityInfo: [],
      humanList: [],
      currentHumanId: 0,
      currentHuman: "",
      showHumanInfo: false,
      humanShowState: "",
      // 艇信息
      showSBase: false,
      harborList: [],
      submarineList: [],
      currentSubmarineList: {},
      currentSidnum: "",
      subShowState: "",
      // 组织机构
      showOrg: false,
      currentOrg: "",
      currentOrgObj: {},
      orgList: [],
      orgShowState: "update",
      // 组织机构战例
      showBattle: false,
      currentOrgId: "",
      currentBattleObj: {},
      battleShowState: "update",
      battleCount: 0,
      // 艇档案
      currentSidnumFile: "",
      showFiles: false,
      filesShowState: "update",
      filesCount: 0,
      // 母港
      currentHarbor: "",
      currentHarborObj: {},
      showHarbor: false,
      harborShowState: "update",
      // 账号
      currentAccount: "",
      currentAccountObj: {},
      accountList: [],
      showAccount: false,
      accountShowState: "update",
      // 潜艇分类
      subTypeList: [],
      currentSubType: "",
      showSubType: false,
      activeSubType: "subBase",
      subTypeShowState: "update",
      subBaseInfo: [],
      subDeepInfo: [],
      subPropelInfo: [],
      subWeaponInfo: [],
      subFightInfo: [],
      // 视频
      videoList: [],
      currentVideoId: "",
      currentVideoObj: {},
      showVideo: false,
      videoShowState: "update",
    };
  },
  async created() {
    let re = await 查询图片服务器地址();
    this.imageServerUri = re.data.imageServerUri;
    // 查询艇的基本信息
    this.getSubmarineList();
    this.resetHumanList();
    this.getDicts("corpus_type").then((res) => {
      this.corpusData = res.data;
    });
    this.getDicts("submarine_type").then((res) => {
      this.subTypeList = res.data;
    });
    // 基本信息列表().then((res) => {
    //   this.subTypeList = res.data;
    // });
    this.resetVideo();
    this.resetOrg();
    this.resetAccout();
  },
  methods: {
    resetVideo() {
      首页资源列表().then((res) => {
        this.videoList = res.rows;
      });
    },
    resetAccout() {
      账号列表查询().then((res) => {
        this.accountList = res.rows;
      });
    },
    resetOrg() {
      // 组织结构
      组织机构列表().then((res) => {
        this.orgList = res.rows;
      });
    },
    getSubmarineList() {
      母港信息列表().then((res) => {
        this.harborList = res.rows;
        console.log("母港信息列表", this.harborList);
      });
      潜艇信息列表().then((res) => {
        this.submarineList = res.rows;
        console.log("潜艇信息列表", this.submarineList);
      });
    },
    resetHumanList() {
      组织人员列表().then((res) => {
        this.humanList = res.rows;
        console.log(this.humanList);
      });
    },
    corpusChange(item) {
      console.log(item);
    },
    humanChange(item) {
      this.currentHumanId = item;
    },
    humanSearch() {
      if (this.currentCorpus === "人员") {
        this.humanShowState = "update";
        this.showHumanInfo = true;
        组织人员详情查询(this.currentHumanId).then((res) => {
          this.humanInfo = res.data;
          console.log("组织人员详情查询", this.humanInfo);
        });
        组织机构获取人员演训经历查询(this.currentHumanId).then((res) => {
          this.trainInfo = res.rows;
          console.log("组织机构获取人员演训经历查询", this.trainInfo);
        });
        个人能力查询Type2(this.currentHumanId).then((res) => {
          this.abilityInfo = [[], [], [], []];
          if (res.rows && res.rows.length > 0) {
            res.rows.forEach((item) => {
              if (item.psType === "1") {
                this.abilityInfo[0].push(item);
              } else if (item.psType === "2") {
                this.abilityInfo[1].push(item);
              } else if (item.psType === "3") {
                this.abilityInfo[2].push(item);
              } else if (item.psType === "4") {
                this.abilityInfo[3].push(item);
              }
            });
          }
          console.log("个人能力查询", this.abilityInfo);
        });
      }
    },
    addRow() {
      if (this.currentCorpus === "人员") {
        this.humanShowState = "add";
        this.showHumanInfo = true;
      }
    },
    addHumanSuc(userId) {
      console.log("userId", userId);
      this.currentHumanId = userId;
      this.activeName = "edu";
      this.resetHumanList();
    },
    delHumanSuc() {
      this.resetHumanList();
      this.showHumanInfo = false;
    },
    submarineSearch() {
      // debugger
      let tar = this.submarineList.find(
        (item) => item.sideNum === this.currentSidnum
      );
      this.currentSubmarineList = tar;
      this.showSBase = true;
      this.subShowState = "update";
    },
    submarineAdd() {
      this.currentSubmarineList = {};
      this.showSBase = true;
      this.subShowState = "add";
    },
    submarineRest() {
      this.showSBase = false;
      this.getSubmarineList();
    },
    orgSearch() {
      let tar = this.orgList.find((item) => item.orgId === this.currentOrg);
      this.currentOrgObj = tar;
      this.showOrg = true;
      this.orgShowState = "update";
    },
    orgAdd() {
      this.currentOrgObj = {};
      this.showOrg = true;
      this.orgShowState = "add";
    },
    orgReset() {
      this.showOrg = false;
      this.resetOrg();
    },
    battleSearch() {
      if (!this.currentOrgId) {
        this.$message.error(`请选择组织机构`);
        return;
      }
      this.battleCount++;
      this.showBattle = true;
      this.battleShowState = "update";
    },
    battleAdd() {
      if (!this.currentOrgId) {
        this.$message.error(`请选择组织机构`);
        return;
      }
      this.battleCount++;
      this.showBattle = true;
      this.battleShowState = "add";
    },
    battleReset() {
      this.showBattle = false;
    },
    filesSearch() {
      if (!this.currentSidnumFile) {
        this.$message.error(`请选择舰艇`);
        return;
      }
      this.filesCount++;
      this.showFiles = true;
      this.filesShowState = "update";
    },
    filesAdd() {
      if (!this.currentSidnumFile) {
        this.$message.error(`请选择舰艇`);
        return;
      }
      this.filesCount++;
      this.showFiles = true;
      this.filesShowState = "add";
    },
    filesReset() {
      this.showFiles = false;
    },
    harborChange(cc) {
      let tar = this.harborList.find((item) => item.harborId === cc);
      tar.imagePathfileList = tar.imagePath
        ? [{ url: this.imageServerUri + tar.imagePath }]
        : [];
      this.currentHarborObj = tar;
    },
    harborSearch() {
      if (!this.currentHarbor) {
        this.$message.error(`请选择母港`);
        return;
      }
      this.showHarbor = true;
      this.harborShowState = "update";
    },
    harborAdd() {
      this.showHarbor = true;
      this.harborShowState = "add";
    },
    harborReset() {
      this.showHarbor = false;
      this.getSubmarineList();
    },
    accountChange(cc) {
      let tar = this.accountList.find((item) => item.id === cc);
      this.currentAccountObj = tar;
    },
    accountSearch() {
      if (!this.currentAccount) {
        this.$message.error(`请选择账号`);
        return;
      }
      this.showAccount = true;
      this.accountShowState = "update";
    },
    accountAdd() {
      this.showAccount = true;
      this.accountShowState = "add";
    },
    accountReset() {
      this.showAccount = false;
      this.resetAccout();
    },
    subTypeChange(code) {
      基本信息查询(code).then((res) => {
        // 基本信息只有一个
        this.subBaseInfo = res.rows;
      });
      深测查询(code).then((res) => {
        this.subDeepInfo = res.rows;
      });
      推进查询(code).then((res) => {
        this.subPropelInfo = res.rows;
      });
      武器查询(code).then((res) => {
        this.subWeaponInfo = res.rows;
      });
      作战查询(code).then((res) => {
        this.subFightInfo = res.rows;
      });
    },
    subTypeSearch() {
      this.showSubType = true;
      this.subTypeShowState = "update";
    },
    subTypeAdd() {
      this.showSubType = true;
      this.subTypeShowState = "add";
    },
    resetSubType() {
      this.showSubType = false;
    },
    videoChange(resourceId) {
      let tar = this.videoList.find((item) => item.resourceId === resourceId);
      tar.imagePathfileList = tar.fileUri
        ? [{ url: this.imageServerUri + tar.fileUri }]
        : [];
      this.currentVideoObj = tar;
    },
    videoSearch() {
      this.showVideo = true;
      this.videoShowState = "update";
    },
    videoAdd() {
      this.showVideo = true;
      this.videoShowState = "add";
    },
    videoReset() {
      this.showVideo = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-upload__tip {
  line-height: 1.2;
}
::v-deep .el-tabs__item {
  color: #d7d0d0;
}
::v-deep .el-tabs__item.is-active {
  color: #fff;
  font-weight: bolder;
}
</style>
