import Vue from 'vue'
import App from './App'
import router from './router'
import VueSocketIO from 'vue-socket.io'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../static/mui/css/mui.css'
// import animated from 'animate.css'
import MintUi from 'mint-ui'
import 'mint-ui/lib/style.css'
import moment from 'moment'
import store from './store'
import '../static/icon/iconfont.js'
import '../static/icon/icon.css'
import {
  sockets,
  io
} from '../static/util/socket'
import {
  setCookie,
  getCookie,
  delCookie
} from '../static/util'
import {
  ajax,
  uploadFileRequest
} from '../static/util/ajax.js'
Vue.config.productionTip = false
Vue.use(MintUi)
Vue.filter('dateFormat', function (dataStr, pattern = "MM-DD HH:mm") {
  return moment(dataStr).format(pattern)
})
Vue.use(io)
Vue.use(ElementUI);
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  sockets,
  beforeMount() {
    Object.assign(Vue.prototype, {
      $ajax: ajax,
      $uploadFileRequest: uploadFileRequest,
      $cookieStore: {
        setCookie,
        getCookie,
        delCookie
      }
    })
  }
})
