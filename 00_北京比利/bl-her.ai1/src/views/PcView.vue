<template>
  <div style="position: relative" >
    <!-- <img class="people one_p" src="../assets/images/onepople.png" alt="" /> -->
    <img class="people one_p"  v-lazy="require('../assets/images/onepople.png')" alt="" />
    <!-- <img class="people three_p" src="../assets/images/threepople.png" alt="" /> -->
    <img class="people three_p" v-lazy="require('../assets/images/threepople.png')" alt="" />
    <img class="people four_p" v-lazy="require('../assets/images/fourpople.png')" alt="" />
    <img class="people five_p" v-lazy="require('../assets/images/filvepople.png')" alt="" />
    <img class="people six_p" v-lazy="require('../assets/images/sixpople.png')" alt="" />
    <div class="maxfixednav">
      <ul class="navlist">
        <li class="listSty">
          <img
            v-show="activeNow === 0"
            class="checkImg"
            src="../assets/images/navchecked.png"
            alt=""
          />
          <a
            href="#purpose"
            @click="activeassgin(0)"
            :class="[activeNow === 0 ? 'info_title' : 'info']"
            >宗旨</a
          >
        </li>
        <li class="listSty">
          <img
            v-show="activeNow === 1"
            class="checkImg1"
            src="../assets/images/navchecked.png"
            alt=""
          />
          <a
            href="#planing"
            @click="activeassgin(1)"
            :class="[activeNow === 1 ? 'info_title' : 'info']"
            >战略思考</a
          >
        </li>
        <li class="listSty">
          <img
            v-show="activeNow === 2"
            class="checkImg3"
            src="../assets/images/navchecked.png"
            alt=""
          />
          <a
            href="#product"
            @click="activeassgin(2)"
            :class="[activeNow === 2 ? 'info_title' : 'info']"
            >产品和服务</a
          >
        </li>
        <li class="listSty">
          <img
            v-show="activeNow === 3"
            class="checkImg4"
            src="../assets/images/navchecked.png"
            alt=""
          />
          <a
            href="#news"
            @click="activeassgin(3)"
            :class="[activeNow === 3 ? 'info_title' : 'info']"
            >新闻</a
          >
        </li>
        <li class="listSty">
          <img
            v-show="activeNow === 4"
            class="checkImg5"
            src="../assets/images/navchecked.png"
            alt=""
          />
          <a
            href="#partner"
            @click="activeassgin(4)"
            :class="[activeNow === 4 ? 'info_title' : 'info']"
            >合作伙伴</a
          >
        </li>
      </ul>
    </div>
    <!-- home -->
    <div class="boxChunk" id="home">
      <img class="img_style" v-lazy="require('../assets/images/home.jpg')" alt="" />
      <!-- <img class="img_style" src="../assets/images/home.jpg" alt="" /> -->
    </div>
    <!-- 宗旨 -->
    <div class="boxChunk purpose" id="purpose">
      <img class="img_style" v-lazy="require('../assets/images/purposebgc.jpg')" alt="" />
      <img
        v-show="iconshow == '#purpose'"
        class="purpose_check purposecheck"
        v-lazy="require('../assets/images/navchecked.png')"
      />
      <img class="allinfo" v-lazy="require('../assets/images/purposeinfo.png')" alt="" />
      <img
        class="purpose_tv allpostion"
        v-lazy="require('../assets/images/purposetv.png')"
        alt=""
      />
      <div class="purpose_desc">
        <h2>北京比利信息技术有限公司</h2>
        <p>
          是专注在中国老龄产业的创新性人文科技公司。致力于打造银发时代下，适老化的数字流量生活服务应用，  <p>
          “H&H银发生活小帮手”。 </p> <p>
          为中国老年人提供会用、好用和天天使用的科技产品和可信赖的科技运营服务，
          做好老年人温暖的智慧科技陪</p><p>伴,加速实现
        </p>
        <p class="orangeinfo">“老吾老以及人之老”的人文科技目标。</p>
      </div>
    </div>

    <!-- 战略思考 -->
    <div class="boxChunk planing" id="planing">
      <img class="img_style" v-lazy="require('../assets/images/planingbgc.jpg')" alt="" />
      <img class="allinfo" v-lazy="require('../assets/images/planinginfo.png')" alt="" />
      <img
        v-show="iconshow == '#planing'"
        class="purpose_check planingcheck"
        v-lazy="require('../assets/images/navchecked.png')"
      />
      <div class="planing_desc0">
        <h2>银发经济“大消费”</h2>
        <p>
          老年人的消费热点在哪里，互联网消费习惯，<br />
          新的流量入口在哪里，如何积极开发老龄人力资源，<br />
          发展引发经济
        </p>
      </div>
      <div class="planing_desc1">
        <h2>老龄人口“大数据”</h2>
        <p>
          如何通过大数据运营，如何转化为可感知的产品和服务，<br /><br />
          如何向下拉动智能制造
        </p>
      </div>
      <div class="planing_desc2">
        <h2>智慧养老“新基建”</h2>
        <p>
          如何打造适老化的数字流量物联网平台，对比<br />
          20年前建设互联网，10年前建设云服务。<br />
          今天，如何建设积极应对人口老龄化国家战略的基础建设
        </p>
      </div>
    </div>

    <!-- 产品和服务 -->
    <div class="boxChunk product" id="product">
      <img class="img_style" v-lazy="require('../assets/images/productbgc.jpg')" alt="" />
      <img
        v-show="iconshow == '#product'"
        class="purpose_check productcheck"
        v-lazy="require('../assets/images/navchecked.png')"
        alt=""
      />
      <img class="allinfo" v-lazy="require('../assets/images/productinfo.png')" alt="" />
      <!-- <div class="piclist1">  鼠标经过显示其他图片-->
      <img
        class="icon num0"
        v-show="active == 0"
        @mouseout="changeIndexBack(2)"
        src="('../assets/images/systemdetail.jpg')"
        alt=""
      />
      <img
        class="icon num0"
        v-show="active == 1"
        @mouseover="changeIndex(2)"
        src="../assets/images/systemicon.png"
        alt=""
      />
      <!-- </div> -->

      <img
        class="icon num1"
        v-show="active1 == 0"
        @mouseout="changeIndexBack(1)"
        v-lazy="require('../assets/images/shoppingdetal.jpg')"
        alt=""
      />
      <img
        class="icon num1"
        v-show="active1 == 1"
        @mouseover="changeIndex(1)"
        v-lazy="require('../assets/images/shoppingicon.png')"
      />

      <img
        class="icon num2"
        v-show="active2 == 0"
        @mouseout="changeIndexBack(3)"
        v-lazy="require('../assets/images/custimizationdetail.jpg')"
      />
      <img
        class="icon num2"
        v-show="active2 == 1"
        @mouseover="changeIndex(3)"
        v-lazy="require('../assets/images/customizationicon.png')"
        alt=""
      />
    </div>

    <!-- 产品和服务 -->
    <div class="boxChunk product" >
      <img class="img_style" src="../assets/images/servicebgc.jpg" alt="" />
      <img
        v-show="iconshow == '#product'"
        class="purpose_check servicecheck"
        src="../assets/images/navchecked.png"
        alt=""
      />

      <img @click="next" class="next" src="../assets/images/left.png" alt="" />
      <img @click="prev" class="prev" src="../assets/images/right.png" alt="" />
      <h2 class="product-title">{{ content.title }}</h2>
      <!-- 描述 -->
      <p v-show="content.id == 1" class="product-desc">
        H&H养老物联网系统已经大规模在养老行业应用。<br />赋能企业客户搭建平台级别的智慧养老物联网平台，同时支持更加灵活定制所需的应用服务。<br />搭载系统的只能终端产品"球球"目前正在开发中。
      </p>
      <p v-show="content.id == 2" class="product-desc">
        提供丰富的适老化SaaS应用平台,链接已有大屏和手机应用。<br />创造更多的适老化应用服务，例如手机应用大屏化，生活服务社交化。
      </p>
      <p v-show="content.id == 3" class="product-desc">
        通过远程科技，将线上老年服务和线下运营人力结合，<br />为老年人高效获取服务提供一种系统化的服务能力，切实解决老年人使用科技产品的数字鸿沟问题。<br />让养老科技培训升级到养老科技陪伴
      </p>
      <div
        style="position: absolute; left: 23%; top: 22%; width: 58%; height: 58%"
      >
        <el-carousel
          style="border: 1px solid transparent; height: 100%"
          height="100%"
          :interval="5000"
          arrow="always"
          @change="changeindex"
          ref="banner"
        >
          <el-carousel-item v-for="(item, inx) in imgList" :key="inx">
            <img width="100%" height="100%" :src="item.url" alt="" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <!-- 新闻 -->
    <div class="boxChunk product" id="news">
      <img class="img_style" v-lazy="require('../assets/images/fivebgc.jpg')" alt="" />
      <img
        v-show="iconshow == '#news'"
        class="purpose_check newscheck"
        v-lazy="require('../assets/images/navchecked.png')"
        alt=""
      />
      <img class="allinfo" v-lazy="require('../assets/images/new.png')" alt="" />

      <div class="newdesc new_0">
        <h2>比利信息探索社区智慧养老服务新思路</h2>
        <p>
          比利信息成功中标泰康之家全国社区TV系统平台建设项目，为泰康之家提供世界一流的智慧养老科技解决方案，</p><p>
          与泰康之家携手探索社区养老服务新模式。比利信息将通过物联网，人工智能，大数据技术，搭建起一个泰康</p><p>
          总部和社区统一管理和运营的智慧养老电视物联网平台。
        </p>
      </div>
      <div class="newdesc new_1">
        <h2>荣获第三届智慧健康养老创新创业大赛服务组金奖</h2>
        <p>
          大赛于2021年6月启动，设立了产品组、服务组、创意组等三个组别，历经项目预征集、项目征集、项目初筛、<br />
          初赛评比、决赛路演等环节，在来自赛事组织机构、协会学会、投资机构等单位的10余位评委的全程参与下,<br />
          比利信息H&H荣获服务组金奖。
        </p>
      </div>
      <div class="newdesc new_2">
        <h2>BTV专访：比利信息专注智慧养老，定制化养老服务</h2>
        <p>
          比利信息专注在康养行业的创新，将电视大屏幕定义为老人常用的大屏幕“手机”产品，通过适老化的产品UI/UX<br />
          设计，为老人提供会用、好用、天天用的各种应用服务。让老人可以通过电视大屏幕获取社会和社区信息、丰富的<br />
          娱乐、终身学习，以及各类定制化的养老服务。
        </p>
      </div>
      <div class="briefing">
        <ul class="navlist">
          <li class="listSty">
            <a
              href="javascript:void(0)"
              @click="goAnchor('#purpose')"
              class="info"
              >宗旨</a
            >
          </li>
          <li class="listSty">
            <a
              href="javascript:void(0)"
              @click="goAnchor('#planing')"
              class="info"
              >战略思考</a
            >
          </li>
          <li class="listSty">
            <a
              href="javascript:void(0)"
              @click="goAnchor('#product')"
              class="info"
              >产品和服务</a
            >
          </li>
          <li class="listSty">
            <a
              href="javascript:void(0)"
              @click="goAnchor('#news')"
              class="info_title"
              >新闻</a
            >
          </li>
          <li class="listSty">
            <a
              href="javascript:void(0)"
              @click="goAnchor('#partner')"
              class="info"
              >合作伙伴</a
            >
          </li>
        </ul>
      </div>
    </div>

    <!-- 合作伙伴 -->
    <div class="boxChunk product" id="partner">
      <img class="img_style" v-lazy="require('../assets/images/partnerbgc.jpg')" alt="" />
      <img
        v-show="iconshow == '#partner'"
        class="purpose_check productcheck"
        v-lazy="require('../assets/images/navchecked.png')"
        alt=""
      />
      <img class="allinfo" v-lazy="require('../assets/images/partnerinfo.png')" alt="" />
      <img
        class="productCount"
        v-lazy="require('../assets/images/partnercontent.png')"
        alt=""
      />
      <div class="briefing">
        <ul class="navlist">
          <li class="listSty">
            <a
              href="javascript:void(0)"
              @click="goAnchor('#purpose')"
              class="info"
              >宗旨</a
            >
          </li>
          <li class="listSty">
            <a
              href="javascript:void(0)"
              @click="goAnchor('#planing')"
              class="info"
              >战略思考</a
            >
          </li>
          <li class="listSty">
            <a
              href="javascript:void(0)"
              @click="goAnchor('#product')"
              class="info"
              >产品和服务</a
            >
          </li>
          <li class="listSty">
            <a href="javascript:void(0)" @click="goAnchor('#news')" class="info"
              >新闻</a
            >
          </li>
          <li class="listSty">
            <a
              href="javascript:void(0)"
              @click="goAnchor('#partner')"
              class="info_title"
              >合作伙伴</a
            >
          </li>
        </ul>
      </div>
    </div>
    <!-- 联系我们 -->
    <div class="boxChunk product">
      <img class="img_style" v-lazy="require('../assets/images/callwe.jpg')" alt="" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'PcView',
  data () {
    return {
      showImg: require('../assets/images/content1.jpg'),
      imgList: [
        {
          id: 1,
          title: 'H&H康养物联网操作系统',
          url: require('../assets/images/content1.jpg'),
          desc: 'H&H养老物联网系统已经大规模在养老行业应用。<br/>赋能企业客户搭建平台级别的智慧养老物联网平台，同时支持更加灵活定制所需的应用服务。<br/>搭载系统的只能终端产品"球球"目前正在开发中。'
        },
        {
          id: 2,
          title: '银发应用商城',
          url: require('../assets/images/content2.jpg'),
          desc: '2'
        },
        {
          id: 3,
          title: '可持续科技运营服务',
          url: require('../assets/images/content3.jpg'),
          desc: '3'
        }
      ],
      content: null,
      iconshow: '',
      hoverImg: '../assets/images/systemdetail.jpg',
      hoverImg1: '../assets/images/systemicon.png.png',
      active: 1,
      active1: 1,
      active2: 1,
      activeNow: '0' // 高亮當前
    }
  },
  created () {
    // this.getData()
    this.changeindex(0)
  },
  // watch: {
  //   hieghtScreen (val) {
  //     console.log(val, '个OA')
  //   }
  // },
  methods: {
    // async getData () {
    //   const data = await axios.get('../assets/images/callwe.jpg')
    //   console.log(data, 'data')
    // },
    activeassgin (val) {
      this.activeNow = val
    },
    changeIndex (val) {
      switch (val) {
        case 2:
          this.active = 0
          break
        case 1:
          this.active1 = 0
          break
        case 3:
          this.active2 = 0
          break
      }
    },
    changeIndexBack (val) {
      switch (val) {
        case 2:
          this.active = 1
          break
        case 1:
          this.active1 = 1
          break
        case 3:
          this.active2 = 1
          break
      }
    },
    changeindex (idx) {
      this.content = this.imgList[idx]
    },
    next () {
      this.$refs.banner.prev()
    },
    prev () {
      this.$refs.banner.next()
    }
    // scrollEvent (ev) {
    //   console.log(ev)
    //   // console.log(document.querySelector('#purpose').offsetTop() - window.screenY < document.querySelector('maxfixednav').offsetTop)
    //   // $('#purpose').offsetTop - window.scrollY < $('.maxfixednav').offsetTop
    // }
    // goAnchor (selector, num) {
    //   this.goAnchor = num
    //   var anchor = this.$el.querySelector(selector) // 参数为要跳转到的元素id
    //   document.body.scrollTop = anchor.offsetTop // chrome
    //   document.documentElement.scrollTop = anchor.offsetTop // firefox
    //   this.iconshow = selector
    // }
  } // watch:{

  // }
}
</script>
<style lang="scss" scoped>
@import "../assets/css/pcstyle.scss";

.listSty.active div {
  display: block;
}
.listSty div {
  display: none;
}
</style>
