<template>
    <div class="greet">
        <image class="head" src="https://oss.lafyun.com/ouiygx-app/icon/heart-animation.gif"/>
        <scroll-view
            scroll-y
            class="box"
        >
            <div class="item" v-for="(item, index) in userList" :key="index">
                <image :src="item.user.avatarUrl"/>
                <p>{{item.user.nickName}}</p>
            </div>
        </scroll-view>
        <p class="count">已收到{{userList.length}}位好友送来的祝福</p>
        <div class="bottom">
            <button class="left" lang="zh_CN" @click="sendGreet">送上祝福</button>
            <!-- <button class="left" lang="zh_CN" open-type="getUserInfo" @getuserinfo="sendGreet">送上祝福</button> -->
            <button class="right" open-type="share">分享喜悦</button> 
        </div>
    </div>
</template>

<script>
import tools from 'common/js/h_tools'
export default {
  name: 'Greet',
  data () {
    return {
      userList: [],
      openId: '',
      userInfo: ''
    }
  },
  onShow () {
    const that = this
    that.getUserList()
  },
  methods: {

    sendGreet (e) {
      const that = this
      wx.getUserProfile({
        desc: '需要获取您的头像并展示', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          that.userInfo = res.userInfo
          that._getOpenId()
          console.log('userInfo' + res.userInfo)
        }
      })
      // if (e.target.errMsg === 'getUserInfo:ok') {
      //   wx.getUserInfo({
      //     success: function (res) {
      //       that.userInfo = res.userInfo
      //       that._getOpenId()
      //     }
      //   })
      // }
    },

    addUser () {
      const that = this
      const db = that.globalData.cloud.database()
      const user = db.collection('user')
      user.add({
        _openid: that.openId,
        user: that.userInfo
      }).then(res => {
        that.getUserList()
      })
    },

    _getOpenId () {
      const that = this
      wx.login({
        success (res) {
          if (res.code) {
            // 调用云函数
            that.globalData.cloud.invokeFunction('wx_openid', {
              code: res.code
            }).then(result => {
              that.openId = result.openid
              that.getIsExist()
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    },

    // getOpenId () {
    //   const that = this
    //   wx.cloud.callFunction({
    //     name: 'user',
    //     data: {}
    //   }).then(res => {
    //     that.openId = res.result.openid
    //     that.getIsExist()
    //   })
    // },

    getIsExist () {
      const that = this
      const db = that.globalData.cloud.database()
      const user = db.collection('user')
      user.where({
        _openid: that.openId
      }).get().then(res => {
        if (res.data.length === 0) {
          that.addUser()
        } else {
          tools.showToast('您已经送过祝福了~')
        }
      })
    },

    getUserList () {
      const that = this
      that.globalData.cloud.invokeFunction('user_list').then(res => {
        that.userList = res.data.reverse()
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.greet
    width 100%
    height 100%
    .head
        height 150rpx
        width 200rpx
        margin 0 auto
    .box
        height 700rpx
        width 690rpx
        margin-left 30rpx
        border-radius 16rpx
        box-shadow 0 0 10rpx rgba(0, 0, 0, 0.1)
        display flex
        justify-content flex-start
        align-items flex-start
        flex-wrap wrap
        .item
            width 120rpx
            display flex
            flex-direction column
            justify-content flex-start
            align-items center
            padding 25rpx
            float left
            image
                width 100rpx
                height 100rpx
                border-radius 50rpx
            p
                height 50rpx
                line-height 50rpx
                font-size 24rpx
                color #444
                width 100rpx
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
                text-align center
    .bottom
        height 140rpx
        position fixed
        bottom 0
        left 0
        background rgba(255, 255, 255, 0.5)
        display flex
        justify-content center
        align-items center
        width 100%
        .left
            height 80rpx
            line-height 80rpx
            font-size 28rpx
            width 300rpx
            color #fff
            background #E62C6B
            margin-right 20rpx
        .right
            height 80rpx
            line-height 80rpx
            font-size 28rpx
            color #fff
            width 300rpx
            background #2CA6F9
    .count
        height 60rpx
        line-height 60rpx
        background rgba(255, 255, 255, 0.5)
        position fixed
        bottom 140rpx
        left 0
        font-size 28rpx
        color #444
        text-align center
        width 100%
</style>
