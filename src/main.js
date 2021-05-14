import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
    Lazyload
} from 'vant'

// vant
Vue.use(Lazyload)
Vue.config.productionTip = false

// rem
import "lib-flexible/flexible"

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')