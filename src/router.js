import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect: '/entertable'
        },
        {
            path: "*",
            redirect: '/entertable'
        },
        {
            path: '/entertable',
            name:'entertable',
            component: (resolve) => {
                require(['./views/entertable.vue'], resolve);
            }
        }
    ]
});