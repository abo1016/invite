<template>
  <div class="section">
    <video id="myVideo"
           :src="videoUrl"
           :danmu-list="danmuList" @play="play" @ended="ended"
           enable-danmu
           vslide-gesture
           vslide-gesture-in-fullscreen
           enable-progress-gesture
           show-center-play-btn
           danmu-btn
           controls
           :poster="cover"></video>
    <div class="btn-area">
      <input @blur="bindInputBlur"
             placeholder="请输入临时弹幕，真实弹幕来自留言"
             placeholder-style="color:#bbb" />
      <button @tap="bindSendDanmu">点击生成临时弹幕</button>
      <image src="../../static/images/close1.png"
             @tap="close" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Video',
  data () {
    return {
      inputValue: '',
      danmuList: [],
      videoUrl: '',
      cover: ''
    }
  },

  onLoad () {
    const that = this
    that.getMessageList()
    that.getVideo()
    that.videoContext = wx.createVideoContext('myVideo')
  },

  methods: {
    play (e) {
      this.musicPlay = false
      if (!this.globalData.innerAudioContext.paused) {
        this.musicPlay = true
        this.globalData.innerAudioContext.pause()
      }
    },
    ended (e) {
      if (this.musicPlay) {
        this.globalData.innerAudioContext.play()
      }
    },
    bindInputBlur (e) {
      let that = this
      that.inputValue = e.mp.detail.value
    },

    bindSendDanmu: function () {
      let that = this
      that.videoContext.sendDanmu({
        text: that.inputValue,
        color: that.getRandomColor()
      })
    },

    getRandomColor () {
      let rgb = []
      for (let i = 0; i < 3; ++i) {
        let color = Math.floor(Math.random() * 256).toString(16)
        color = color.length === 1 ? '0' + color : color
        rgb.push(color)
      }
      return '#' + rgb.join('')
    },

    getVideo () {
      const that = this
      const db = that.globalData.cloud.database()
      const video = db.collection('video')
      video.where({
        state: true
      }).get().then(res => {
        that.videoUrl = res.data[0].videoUrl
        that.cover = res.data[0].cover
      })
    },

    getMessageList () {
      const that = this
      const db = that.globalData.cloud.database()
      const message = db.collection('message')
      message.where({
        state: true
      }).get().then(res => {
        let data = res.data.reverse()
        let arr = []
        if (data.length > 0) {
          data.forEach((item, index) => {
            arr.push({
              text: item.desc,
              color: that.getRandomColor(),
              time: 1 + (index * 2)
            })
          })
          that.danmuList = arr
        }
      })
    },

    close () {
      const that = this
      that.$emit('closeVideo')
    }
  }
}
</script>

<style lang="stylus" scoped>
.section
  width 750rpx
  position relative
  #myVideo
    height 422rpx
    width 100%
    margin-bottom 20rpx
  .btn-area
    input
      width 660rpx
      border 1rpx solid #e5e5e5
      padding-left 30rpx
      height 80rpx
      line-height 80rpx
      font-size 30rpx
      color #ccc
      margin-bottom 30rpx
      margin-left 30rpx
      border-radius 16rpx
    button
      height 92rpx
      width 690rpx
      border-radius 16rpx
      background #1AAD19
      color #fff
      line-height 92rpx
      text-align center
      font-size 36rpx
      margin-bottom 40rpx
    image
      width 80rpx
      height 80rpx
      background #fff
      margin 0 auto
</style>
