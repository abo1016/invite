import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

wx.cloud.init({
  env: 'bopop-9tl6z'
})

const app = new Vue(App)
app.$mount()
