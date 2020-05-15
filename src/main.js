import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router'
import './assets/style/reset.css'
import './assets/style/global.css'
import elementui from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import dragable from './directive/dragable'; //添加此行=>自定义全局指令
import VueParticles from 'vue-particles'
Vue.use(VueParticles);
Vue.use(elementui);
Vue.use(dragable); //添加此行=>使用该全局指令
Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
