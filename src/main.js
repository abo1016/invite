import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

wx.cloud.init({
  env: 'bopop-9tl6z'
})

const app = new Vue(App)
app.$mount()

Vue.prototype.globalData = getApp().globalData
let innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = true
app.globalData.innerAudioContext = innerAudioContext
app.globalData.musics = []
app.globalData.index = 1
const db = wx.cloud.database()
const music = db.collection('music')
music.get().then(res => {
  app.globalData.musics = res.data
  innerAudioContext.src = app.globalData.musics[0].musicUrl
})
