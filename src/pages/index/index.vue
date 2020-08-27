<template>
    <div class="index">
        <div class="bg-swiper">
            <index-swiper :list="list"></index-swiper>
        </div>
        <image class="inv" src="../../static/images/inv.png"/>
        <div class="bg_music" v-if="isPlay" @tap="audioPlay">
            <image src="../../static/images/music_icon.png" class="musicImg music_icon"/>
            <image src="../../static/images/music_play.png" class="music_play pauseImg"/>
        </div>
        <div class="bg_music" v-else @tap="audioPlay">
            <image src="../../static/images/music_icon.png" class="musicImg"/>
            <image src="../../static/images/music_play.png" class="music_play playImg"/>
        </div>
        <div class="info" :animation="animationData">
            <div class="content">
                <h1>Mr.Bo & Miss.Wen</h1>
                <p>谨定于 2020年10月4日 （星期日）中午12:00</p>
                <p>农历 八月十八 中午十二点整 举办婚礼</p>
                <p>席设：湖南省醴陵市外贸酒店二楼宴会厅</p>
                <p>地址：湖南省醴陵市瓷城大道70号</p>
                <image src="../../static/images/we.png" class="img_footer"/>
            </div>
        </div>
        <audio id="myAudio" :src="audioUrl" autoplay loop></audio>
    </div>
</template>

<script>
import IndexSwiper from 'components/indexSwiper'
import tools from 'common/js/h_tools'
export default {
  name: 'Index',
  components: {
    IndexSwiper
  },
  data () {
    return {
      isPlay: true,
      list: [],
      audioCtx: '',
      audioUrl: ''
    }
  },
  onLoad () {
    this.globalData.innerAudioContext.onEnded(this.onEnded)
    this.globalData.innerAudioContext.onPlay(this.onPlay)
    this.globalData.innerAudioContext.onPause(this.onPause)
    this.getList()
  },
  onShow () {
    this.audioCtx = this.globalData.innerAudioContext
    this.isPlay = !this.audioCtx.paused
  },

  methods: {
    onPlay () {
      this.isPlay = true
    },
    onPause () {
      this.isPlay = false
    },
    onEnded () {
      if (this.globalData.index >= this.globalData.musics.length) {
        this.globalData.index = 0
      }
      this.globalData.innerAudioContext.src = this.globalData.musics[this.globalData.index].musicUrl
      this.globalData.index += 1
    },
    audioPlay () {
      if (this.audioCtx.paused) {
        this.audioCtx.play()
        tools.showToast('背景音乐已开启~')
      } else {
        this.audioCtx.pause()
        tools.showToast('您已暂停音乐播放~')
      }
    },

    getList () {
      const that = this
      const db = wx.cloud.database()
      const banner = db.collection('banner')
      banner.get().then(res => {
        that.list = res.data[0].bannerList
        that.getMusicUrl()
        console.log(that.list)
      })
    },

    getMusicUrl () {
      const that = this
      const db = wx.cloud.database()
      const music = db.collection('music')
      music.get().then(res => {
        console.log(res.data)
        that.globalData.innerAudioContext.src = res.data[0].musicUrl
        that.audioCtx.play()
        // that.getList()
      })
    }
  },

  onShareAppMessage: function (res) {
    return {
      path: '/pages/index/main'
    }
  }
}
</script>

<style scoped lang="stylus">
@-webkit-keyframes musicRotate
  from
    -webkit-transformb rotate(0deg)
  to
    -webkit-transform rotate(360deg)
@-webkit-keyframes musicStop
  from
    -webkit-transform rotate(20deg)
  to
    -webkit-transform rotate(0deg)
@-webkit-keyframes musicStart
  from
    -webkit-transform rotate(0deg)
  to
    -webkit-transform rotate(20deg)
@-webkit-keyframes infoAnimation
  0%
    -webkit-transform scale(1) translate(0, 0)
  50%
    -webkit-transform scale(.9) translate(5px, 5px)
  100%
    -webkit-transform scale(1) translate(0, 0)
.index
  height 100%
  position relative
  .img
    width 100%
    height 100%
  .bg-swiper
    width 100%
    height 100%
  .inv
    position absolute
    top 20rpx
    left 89rpx
    width 572rpx
    height 69rpx
    z-index 9
  .bg_music
    position fixed
    right 0
    top 20rpx
    width 100rpx
    z-index 99
    display flex
    justify-content flex-start
    align-items flex-start
    .musicImg
      width 60rpx
      height 60rpx
    .music_icon
      animation musicRotate 3s linear infinite
    .music_play
      width 28rpx
      height 60rpx
      margin-left -10rpx
      transform-origin top
      -webkit-transform rotate(20deg)
    .playImg
      animation musicStop 1s linear forwards
    .pauseImg
      animation musicStart 1s linear forwards
  .info
    width 630rpx
    background rgba(255, 255, 255, 0.75)
    z-index 9
    position fixed
    bottom 40rpx
    left 50rpx
    padding 10rpx
    animation infoAnimation 12s linear infinite
    .content
      width 626rpx
      border 1rpx solid #000
      display flex
      flex-direction column
      justify-content flex-start
      align-items center
      position relative
      padding-bottom 30rpx
      h1
        font-size 50rpx
        height 100rpx
        line-height 100rpx
      p
        font-size 24rpx
        height 60rpx
        line-height 60rpx
      .img_footer
        position absolute
        bottom 0
        left 53rpx
        z-index 99
        height 14rpx
        width 520rpx
  #myAudio
    display none
</style>
