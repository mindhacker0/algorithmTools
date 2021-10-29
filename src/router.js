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
        },{
            path: '/login',
            name:'login',
            component: (resolve) => {
                require(['./views/login.vue'], resolve);
            }
        },{
            path: '/canvas-test',
            name:'canvas-test',
            component: (resolve) => {
                require(['./views/canvasTest'], resolve);
            }
        },{
            path: '/openGL-test',
            name:'openGL-test',
            component: (resolve) => {
                require(['./views/openGLTest'], resolve);
            }
        },{
            path: '/applicateList',
            name:'applicate-list',
            component: (resolve) => {
                require(['./views/applicateList'], resolve);
            },
        },{
            path: '/applicateList-edit',
            name:'applicate-list-edit',
            component: (resolve) => {
                require(['./views/applicateList/edit'], resolve);
            },
        },{
            path: '/applicateList-material',
            name:'applicate-list-material',
            component: (resolve) => {
                require(['./views/applicateList/material'], resolve);
            },
        },{
            path: '/applicateList-question',
            name:'applicate-list-question',
            component: (resolve) => {
                require(['./views/applicateList/question'], resolve);
            },
        }
    ]
});