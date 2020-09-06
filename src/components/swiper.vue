<template>
  <div class="box">
    <swiper
      class="swiper"
      autoplay
      :duration=0
      :circular=true
      :interval="interval"
      :vertical=true
      @change="change"
      @animationfinish="animationfinish"
      :indicator-dots="true"
    >
      <block
        v-for="(item, index) in list"
        :key="index"
      >
        <swiper-item class="item">
          <div
            class="animate-ele-warp"
            v-if="item.show"
          >
            <div
              class="animate-ele animated"
              :class="[item.class]"
              style="top: 0; left: 0; animation-delay: 0.2s;"
            >
              <image
                mode="aspectFill"
                :src="item.url"
                class="animate-img slide-image"
              />
            </div>
          </div>
        </swiper-item>
      </block>
    </swiper>
    <image
      v-if="isGif"
      class="img"
      src="../../static/images/save_the_date_pu.gif"
    />
  </div>
</template>

<script>
export default {
  name: 'GoodSwiper',
  props: ['list', 'isGif', 'interval'],
  watch: {
    isGif (newValue, oldValue) {
      const that = this
      if (newValue) {
        that.isGif = newValue
      }
    }
  },
  data () {
    return {
      changeFlag: false,
      lastIndex: 0,
      lastRadom: -1
    }
  },
  onHide (e) {
    this.$root.$mp.page.setData({'$root[0].autoplay': false})
    // console.log(this.current, this.autoplay, 'onhide')
  },
  methods: {
    change (val) {
      this.changeFlag = true
    },
    animationfinish (val) {
      if (!this.changeFlag) { return }
      // console.log(val, '2')
      this.list[this.lastIndex].show = false
      this.list[val.target.current].show = true
      // let index = this.randomNum()
      // console.log(index, 'index')
      // this.list[val.target.current].class = this.globalData.animations[index]
      this.lastIndex = val.target.current
      this.changeFlag = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.box {
  position: relative;
  height: 100%;

  .swiper {
    height: 100%;
    width: 100%;

    .item {
      width: 100%;
      height: 100%;

      image {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }

  .img {
    position: absolute;
    bottom: 50rpx;
    left: 50rpx;
    z-index: 99;
    width: 30%;
    height: 15%;
  }
}
</style>
