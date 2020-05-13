import Vue from 'vue'
import App from './App'

import MinRequest from './utils/request.js'
import minRequest from './api/index.js'
import COMMON from './utils/common.js'
import './static/sdk/ald-stat.js'

import noNetWork from '@/components/common/noNetWork/index.vue'
import backToTop from '@/components/common/backToTop/backToTop.vue'

Vue.use(MinRequest)
Vue.component('noNetWork', noNetWork);
Vue.component('backToTop', backToTop);
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App,
	minRequest
})
app.$mount()
