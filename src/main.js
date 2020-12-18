import Vue from 'vue'
import App from './App.vue'
import router from './router'
import jquery from 'jquery'
// import bootstrap from 'bootstrap'
import axios from 'axios'
import qs from 'qs'
import md from 'js-md5'
// import laydate from 'layui-laydate'
// import "layui-laydate/dist/laydate.js"
// import "layui-laydate/dist/theme/font/laydate.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"
import "font-awesome/css/font-awesome.css"
Vue.config.productionTip = false
Vue.prototype.jquery = jquery
Vue.prototype.axios = axios
Vue.prototype.qs=qs
Vue.prototype.md=md
Vue.prototype.api='http://10.0.17.42:3000'
// Vue.prototype.api='http://10.0.18.14:3000'
Vue.prototype.url='http://127.0.0.1:8080'
// Vue.prototype.url='http://10.0.18.14:8080'
// Vue.prototype.url='http://10.0.17.119:8080'
//Vue.prototype.bootstrap = bootstrap
// Vue.prototype.bootstrapjs = bootstrapjs
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

