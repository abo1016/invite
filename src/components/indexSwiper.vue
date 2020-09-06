<template>
  <div class="box">
    <swiper
      :indicator-dots="true"
      :interval="4500"
      :vertical="true"
      @animationfinish="animationfinish"
      @change="change"
      autoplay
      circular
      class="swiper"
    >
      <block :key="index" v-for="(item, index) in list">
        <swiper-item class="item">
          <div class="animate-ele-warp" v-if="item.show">
            <div
              :class="[item.class]"
              class="animate-ele animated"
              style="top: 0; left: 0; animation-delay: 0.2s;"
            >
              <image :src="item.url" class="animate-img slide-image" mode="aspectFill" />
            </div>
          </div>
        </swiper-item>
      </block>
    </swiper>
  </div>
</template>

<script>
export default {
  name: 'GoodSwiper',
  props: ['list'],
  data () {
    return {
      changeFlag: false,
      lastIndex: 1,
      lastRadom: -1
    }
  },
  onHide (e) {
    // 禁止后台切换图片
    this.$root.$mp.page.setData({ '$root[0].autoplay': false })
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
      // this.list[val.target.current].class = this.animations[index]
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
}
</style>
