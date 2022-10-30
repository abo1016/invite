<template>
  <div class="photo">
    <image
      class="bg-image"
      :src="background"
    />
    <h-swiper
      :list="list"
      :isGif="isGif"
      :interval="interval"
    ></h-swiper>
  </div>
</template>

<script>
import HSwiper from 'components/swiper'
// import imgData from 'common/json/imgData.json'
export default {
  name: 'Photo',
  components: {
    HSwiper
  },
  onShow () {
    const that = this
    that.isGif = !that.isGif
    that.getList()
  },

  data () {
    return {
      list: [],
      isGif: false,
      interval: 5000,
      background: 'https://oss.lafyun.com/ouiygx-app/icon/poster.jpg',
      animations: [
        'fadeInLeft',
        'slideInDown',
        'rotateInDownRight',
        'rotateInDownLeft',
        'rollIn',
        'jackInTheBox',
        'swing',
        'fadeInLeft',
        'fadeInRight'
      ]
    }
  },
  methods: {
    getList () {
      const that = this
      const db = that.globalData.cloud.database()
      const banner = db.collection('indexBanner')
      banner.get().then(res => {
        let list = []
        for (let i = 0; i < res.data[0].indexBanner.length; i++) {
          let show = i === 0
          let index = parseInt(Math.random() * (8 - 7 + 1) + 7, 10)
          list.push({
            url: res.data[0].indexBanner[i],
            show: show,
            class: this.animations[index]
          })
        }
        that.list = list
      })
    },
    randomNum () {
      let minNum = 0
      let maxNum = this.globalData.animations.length - 1
      let result = parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
      while (this.lastRadom === result) {
        result = parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
      }
      this.lastRadom = result
      return result
    }
  }
}
</script>

<style lang="stylus" scoped>
.photo {
  height: 100%;
}
</style>

