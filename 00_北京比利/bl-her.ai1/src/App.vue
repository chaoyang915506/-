<template>
  <div>
    <router-view v-if="showPage == 1" name="m"></router-view>
    <router-view v-if="showPage == 2" name="pc"></router-view>
  </div>
</template>
<script>
export default {
  methods: {
    _isMobile () {
      const flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
      return flag
    }
  },

  created () {
    if (this._isMobile()) {
      // 现在不区分手机端和pc
      this.showPage = 2
    } else {
      this.showPage = 2
    }
  }
}
</script>

<style lang="scss">
.box {
  width: 100%;
  height: 100%;
  background-color: #070f34;
}
</style>
