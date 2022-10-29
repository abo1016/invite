import './animate.wxss'
import Vue from 'vue'
import App from './App'
import { Cloud } from 'laf-client-sdk'

Vue.config.productionTip = false
App.mpType = 'app'

// wx.cloud.init({
//   env: 'bopop-9tl6z'
// })
const app = new Vue(App)
app.$mount()

Vue.prototype.globalData = getApp().globalData
let innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = true
app.globalData.innerAudioContext = innerAudioContext
app.globalData.musics = []
app.globalData.index = 1

app.globalData.cloud = new Cloud({
  // the laf app server base url
  baseUrl: 'https://ouiygx.lafyun.com:443',
  // the database proxy entry, `app` is the policy name which response for the security of database access
  dbProxyUrl: '/proxy/app',
  // getAccessToken: () => wx.getStorageSync('access_token'),
  environment: 'wxmp'
})

// app.globalData.animations = [
//   `bounce`,
//   `flash`,
//   `pulse`,
//   `rubberBand`,
//   `shake`,
//   `headShake`,
//   `swing`,
//   `tada`,
//   `wobble`,
//   `jello`,
//   `bounceIn`,
//   `bounceInDown`,
//   `bounceInLeft`,
//   `bounceInRight`,
//   `bounceInUp`,
//   `fadeIn`,
//   `fadeInDown`,
//   `fadeInDownBig`,
//   `fadeInLeft`,
//   `fadeInLeftBig`,
//   `fadeInRight`,
//   `fadeInRightBig`,
//   `fadeInUp`,
//   `fadeInUpBig`,
//   `flipInX`,
//   `flipInY`,
//   `lightSpeedIn`,
//   `rotateIn`,
//   `rotateInDownLeft`,
//   `rotateInDownRight`,
//   `rotateInUpLeft`,
//   `rotateInUpRight`,
//   `jackInTheBox`,
//   `rollIn`,
//   `zoomIn`,
//   `zoomInDown`,
//   `zoomInLeft`,
//   `zoomInRight`,
//   `zoomInUp`,
//   `slideInDown`,
//   `slideInLeft`,
//   `slideInRight`,
//   `slideInUp`,
//   `heartBeat`
// ]
const db = app.globalData.cloud.database()
const music = db.collection('music')
music.get().then(res => {
  app.globalData.musics = res.data
  innerAudioContext.src = app.globalData.musics[0].musicUrl
})
