<template>
  <div class="message">
    <scroll-view @scroll="scroll" class="box" scroll-y>
      <p class="place"></p>
      <div :key="index" class="item" v-for="(item, index) in messageList">
        <image :src="item.url" class="left" />
        <div class="right">
          <div class="top">
            <span class="top-l">{{item.name}}</span>
            <span class="top-r">{{item.time}}</span>
          </div>
          <p class="con">{{item.desc}}</p>
          <i @tap="delCom(item._id)" class="iconfont icon-ashbin" v-if="isAdmin"></i>
        </div>
      </div>
      <p class="place-end"></p>
    </scroll-view>
    <div class="bottom">
      <button @getuserinfo="toMessage" class="left" lang="zh_CN" open-type="getUserInfo">说点啥吧</button>
      <button @tap="toForm" class="right">我要出席</button>
    </div>
    <div class="dialog" v-show="isOpen">
      <textarea
        class="desc"
        focus="true"
        maxlength="80"
        name="textarea"
        placeholder="在这里输入您想要说的话"
        placeholder-style="color:#ccc;"
        v-model="desc"
      />
      <div class="btn">
        <button @tap="sendMessage" class="left">发送留言</button>
        <button @tap="cancel" class="right">取消</button>
      </div>
    </div>
    <div @tap="toVideo" class="video-dialog">
      <image src="../../static/images/video1.png" />
    </div>
    <div @tap="lookList" class="form-dialog">
      <image src="../../static/images/form.png" />
    </div>
    <div class="video" v-show="isVideo">
      <h-video @closeVideo="closeVideo"></h-video>
    </div>
    <div class="form" v-show="isForm">
      <h-form @closeForm="closeForm" @getFromlist="getFromlist"></h-form>
    </div>
    <div class="form-list" v-show="isFormlist">
      <h-formlist :formList="formList" @closeFormlist="closeFormlist"></h-formlist>
    </div>
  </div>
</template>

<script>
import HVideo from 'components/video'
import HForm from 'components/form'
import HFormlist from 'components/formlist'
import tools from 'common/js/h_tools'
export default {
  name: 'Message',
  components: {
    HVideo,
    HForm,
    HFormlist
  },
  data () {
    return {
      isOpen: false,
      desc: '',
      state: '',
      messageList: [],
      openId: '',
      del: false,
      userInfo: '',
      isForm: false,
      isVideo: false,
      isFormlist: false,
      formList: [],
      isAdmin: false
    }
  },
  onShow () {
    const that = this
    that.isVideo = false
    that.isForm = false
    that.isFormlist = false
    that.getMessageList()
    that.getOpenId()
  },

  methods: {
    toMessage (e) {
      const that = this
      if (e.target.errMsg === 'getUserInfo:ok') {
        // that.isOpen = true
        wx.getUserInfo({
          success: function (res) {
            that.userInfo = res.userInfo
            that.isOpen = true
            // that.getOpenId()
            that.getIsExist()
          }
        })
      }
    },

    // showDelete () {
    //   // const that = this
    //   // if (that.isAdmin) {
    //   //   that.del
    //   // }
    //   // console.log('openid: ' + that.openId)
    //   // const db = wx.cloud.database()
    //   // const admin = db.collection('admin')
    //   // admin.get().then(res => {
    //   //   that.del = false
    //   //   for (var i = 0, len = res.data.length; i < len; i++) {
    //       // console.log('res: ' + i + ' === ' + res.data[i].admin_openid)
    //       // console.log('openId: ' + that.openId)
    //     //   if (res.data[i].admin_openid === that.openId) {
    //     //     that.del = true
    //     //   }
    //     // }
    //     // if (that.admin_openid === that.openId) {
    //     //   that.del = true
    //     // } else {
    //     //   that.del = false
    //     // }
    //     console.log(that.del)
    //   })
    // },

    delCom (id) {
      const that = this
      if (that.isAdmin) {
        wx.showModal({
          title: '提示',
          content: '确认删除？',
          success (res) {
            if (res.confirm) {
              const db = wx.cloud.database()
              const message = db.collection('message')
              message.where({
                _id: id
              }).update({
                data: {
                  state: false
                }
              }).then(res => {
                that.getMessageList()
              })
            }
          }
        })
      }
    },

    cancel () {
      const that = this
      that.isOpen = false
    },

    sendMessage () {
      const that = this
      if (that.desc) {
        const db = wx.cloud.database()
        const message = db.collection('message')
        message.add({
          data: {
            desc: that.desc,
            type: 'message',
            state: true,
            time: that.getNowFormatDate(),
            url: that.userInfo.avatarUrl,
            name: that.userInfo.nickName
          }
        }).then(res => {
          that.isOpen = false
          that.desc = ''
          that.getMessageList()
        })
      } else {
        tools.showToast('说点什么吧~')
      }
    },

    getNowFormatDate () {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      const day = now.getDate()
      const hh = now.getHours()
      const mm = now.getMinutes()
      const ss = now.getSeconds()
      let clock = year + '-'
      if (month < 10) {
        clock += '0'
      }
      clock += month + '-'
      if (day < 10) {
        clock += '0'
      }
      clock += day + ' '
      if (hh < 10) {
        clock += '0'
      }
      clock += hh + ':'
      if (mm < 10) {
        clock += '0'
      }
      clock += mm + ':'
      if (ss < 10) {
        clock += '0'
      }
      clock += ss
      return clock
    },

    getMessageList () {
      const that = this
      wx.cloud.callFunction({
        name: 'messageList',
        data: {}
      }).then(res => {
        that.messageList = res.result.data.reverse()
      })
    },

    toForm () {
      const that = this
      that.isForm = true
    },

    closeForm () {
      const that = this
      that.isForm = false
    },

    addUser () {
      const that = this
      const db = wx.cloud.database()
      const user = db.collection('user')
      user.add({
        data: {
          user: that.userInfo
        }
      }).then(res => {
        console.log(res)
      })
    },

    getOpenId () {
      const that = this
      wx.cloud.callFunction({
        name: 'user',
        data: {}
      }).then(res => {
        that.openId = res.result.openid
        const db = wx.cloud.database()
        const admin = db.collection('admin')
        admin.get().then(res => {
          for (var i = 0, len = res.data.length; i < len; i++) {
            if (res.data[i].admin_openid === that.openId) {
              that.isAdmin = true
            }
          }
          console.log(that.isAdmin)
        })
        // that.showDelete()
        // that.getIsExist()
      })
    },

    getIsExist () {
      const that = this
      const db = wx.cloud.database()
      const user = db.collection('user')
      user.where({
        _openid: that.openId
      }).get().then(res => {
        if (res.data.length === 0) {
          that.addUser()
        }
      })
    },

    toVideo () {
      const that = this
      that.isVideo = true
      this.musicPlay = false
      if (!this.globalData.innerAudioContext.paused) {
        this.musicPlay = true
        this.globalData.innerAudioContext.pause()
      }
    },

    closeVideo () {
      const that = this
      that.isVideo = false
      if (this.musicPlay) {
        this.globalData.innerAudioContext.play()
      }
    },

    lookList () {
      const that = this
      that.isFormlist = true
      that.getFromlist()
    },

    closeFormlist () {
      const that = this
      that.isFormlist = false
    },

    getFromlist () {
      const that = this
      wx.cloud.callFunction({
        name: 'presentList',
        data: {}
      }).then(res => {
        that.formList = res.result.data.reverse().map(x => {
          return {
            count: x.count,
            desc: x.desc,
            name: x.name,
            phone: that.isAdmin ? x.phone : x.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
            _id: x._id,
            _openid: x._openid
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.message {
  height: 100%;
  width: 100%;

  .box {
    height: 100%;
    background: #F9E0D9;
    width: 100%;

    .place {
      height: 20rpx;
    }

    .place-end {
      height: 160rpx;
    }

    .item {
      width: 630rpx;
      margin-left: 30rpx;
      border-radius: 16rpx;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 30rpx;
      margin-bottom: 20rpx;

      .left {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50rpx;
      }

      .right {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        min-height: 100rpx;
        align-items: flex-start;
        width: 500rpx;
        margin-left: 20rpx;

        .top {
          height: 40rpx;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .top-l {
            height: 50rpx;
            line-height: 50rpx;
            color: #444;
            font-size: 28rpx;
          }

          .top-r {
            height: 50rpx;
            line-height: 50rpx;
            color: #999;
            font-size: 24rpx;
          }
        }

        .con {
          line-height: 50rpx;
          color: #666;
          font-size: 28rpx;
          white-space: pre-wrap;
          width: 100%;
        }
      }
    }
  }

  .bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 160rpx;
    background: rgba(255, 255, 255, 0.75);
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .left, .right {
      height: 80rpx;
      line-height: 80rpx;
      font-size: 28rpx;
      width: 300rpx;
      color: #fff;
      background: #ED695D;
      margin: 0 20rpx 0 0;
    }

    .right {
      margin: 0;
    }
  }

  .dialog {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 99;
    background: #fff;
    width: 100%;

    textarea {
      height: 200rpx;
      line-height: 42rpx;
      font-size: 30rpx;
      color: #333;
      resize: none;
      outline: none;
      padding: 30rpx;
      width: 690rpx;
      background: #f5f5f5;

      &::-webkit-input-placeholder {
        font-size: 30rpx;
        color: #999;
      }
    }

    .btn {
      height: 120rpx;
      display: flex;
      justify-content: center;
      align-items: center;

      .left, .right {
        height: 80rpx;
        line-height: 80rpx;
        font-size: 28rpx;
        flex: 2;
        color: #fff;
        background: #ED695D;
        margin: 0 20rpx 0 30rpx;
      }

      .right {
        flex: 1;
      }
    }
  }

  .video-dialog {
    position: fixed;
    right: 10rpx;
    top: 200rpx;
    width: 100rpx;
    height: 100rpx;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
    background: #fff;
    border-radius: 16rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .form-dialog {
    position: fixed;
    right: 10rpx;
    top: 320rpx;
    width: 100rpx;
    height: 100rpx;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
    background: #fff;
    border-radius: 50rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .video, .form, .form-list {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 99;
  }

  .form-list {
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
