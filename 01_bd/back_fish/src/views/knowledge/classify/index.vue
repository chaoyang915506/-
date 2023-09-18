<template>
  <div class="box">
    <div class="leftbox">
      <div class="title_info">
        <span>潜艇分类</span>
        <div></div>
      </div>
      <div class="content">
        <div
          v-for="i in submarinelist"
          :key="i.id"
          :class="[getcss(i.id) ? 'activecolor' : '', 'everyoneInfo']"
          @click="addsubmir(i.id)"
        >
          {{ i.name }}
        </div>
      </div>
    </div>
    <div :style="{ height: '100%', width: view ? '50%' : '75%' }"></div>

    <!-- 右侧 -->
    <div
      :style="{ width: view ? '25%' : '0%' }"
      :class="[view ? 'right' : 'closeright']"
    >
      <div
        @click="lookcart"
        :class="[view ? 'right_box' : 'false_right', 'box_app']"
      >
        <div class="title_info">
          <!-- <span v-if="dttitle">{{ dttitle }}</span>-->
          <span> 简介</span>
          <div></div>
        </div>
        <div class="content_right" style="position: relative">
          <span class="total_so">共计{}艘</span>
          <div style="margin-top: 20px">
            俄亥俄级战略核潜艇（英文：Ohio-class nuclear power
            submarine），是美国海军1976年开始建造的一个战略核潜艇，单艇可携带24枚D-5三叉戟Ⅱ型洲际导弹（UGM-133A），美海军攻击建造了18艘俄亥俄级潜艇，头4艘后接受该装备巡航导弹核潜艇。
          </div>
        </div>
      </div>

      <div v-show="iconshow" class="img_arrows" @click="view = !view">
        <img
          :class="[view ? 'imgopen' : 'imgclose']"
          src="/img/ui/arrows.svg"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      view: true,
      iconshow: true,
      submarinelist: [
        {
          name: "俄亥俄级战略弹道导弹核潜艇",
          id: 1,
        },
        {
          name: "俄亥俄级巡航导弹核潜艇",
          id: 2,
        },
      ],
      //用户点击的舰艇
      submarimodel: [],
    };
  },
  methods: {
    //点击的舰艇
    addsubmir(id) {
      let res = this.submarimodel.findIndex((i) => i == id);
      if (res == -1) {
        this.submarimodel = [id];
      } else {
        this.submarimodel = [];
      }
    },
    getcss(id) {
      let res = this.submarimodel.findIndex((i) => i == id);
      return res == -1 ? false : true;
    },
    lookcart() {},
    // handleClick() {},
  },
};
</script>

<style lang="scss" scoped>
.everyoneInfo {
  //   margin-top: 10px;
  position: relative;
  cursor: pointer;
  min-height: 10px;
}
.activecolor {
  color: #0eaac0;
}
.content_right {
  padding: 10px;
  color: #fff;
}
.total_so {
  height: 20px;
  float: right;
  //   position: absolute;

  //   right: 0;
  //   top: 0;
}
.box {
  height: calc(100vh - 110px);
  display: flex;
}
.leftbox {
  width: 25%;
  height: 97%;
  border: 1px solid #421b96;
  padding: 10px;
}
.middle {
  display: inline-block;
  position: relative;
  // height: calc(100vh - 100px);
  border: 1px solid #241866;
  background-color: orange;
  width: 75%;
}

.title_info {
  position: relative;
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 17px;
  color: #fff;
  padding: 1px 10px;
  font-weight: 500;
  span {
    width: 30%;
  }
  div {
    background-image: url("/img/ui/bias.svg");
    position: absolute;
    display: inline-block;
    top: 4px;
    width: 70%;
    height: 25px;
    background-size: inherit;
    background-position: 25px 2px;
    -webkit-transform: scale(0.7);
    transform: scale(0.7);
  }
}
.content {
  color: #fff;
  padding: 10px;
  height: 97%;
  overflow: auto;
}

.right {
  display: inline-block;
  position: relative;
  border: 1px solid #241866;
  //   width: 25%;
}
.closeright {
  display: inline-block;
  position: relative;
  border: null;
}
.middle {
  width: 100%;
  height: 100%;
  //   background-color: green;
}
.right_box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
}
.false_right {
  width: 0;
}

.img_arrows {
  position: absolute;
  //   z-index: 99999;
  left: -25px;
  top: 10px;
  height: 40px;
  width: 25px;
  background: #0d183d;
  display: flex;
  justify-content: center;
  align-items: center;
}
.imgclose {
  width: 15px;
  height: 20px;
}
.imgopen {
  width: 15px;
  height: 20px;
  transform: rotate(-180deg);
}

.title_info {
  position: relative;
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 17px;
  color: #fff;
  padding: 1px 10px;
  font-weight: 500;
  span {
    width: 30%;
  }
  div {
    background-image: url("/img/ui/bias.svg");
    position: absolute;
    display: inline-block;
    top: 4px;
    width: 70%;
    height: 25px;
    background-size: inherit;
    background-position: 25px 2px;
    -webkit-transform: scale(0.7);
    transform: scale(0.7);
  }
}
</style>