import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import LayoutView from '@/views/LayoutView.vue'
import ShopLayoutView from '@/views/ShopLayoutView.vue'
//import { component } from 'vue/types/umd'
//import { component } from 'vue/types/umd'
//import { component } from 'vue/types/umd'
//import { component } from 'vue/types/umd'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/Layout',
    name: 'Layout',
    component: LayoutView,
    children: [
      {
        path: '/goods',
        name: 'goods',
        component: () => import(/* webpackChunkName: "about" */ '../views/goodsView.vue')
      },
      {
        path: '/cus',
        name: 'cus',
        component: () => import(/* webpackChunkName: "about" */ '../views/CusView.vue')
      },
      {
        path: '/log',
        name: 'log',
        component: () => import(/* webpackChunkName: "about" */ '../views/CusLog.vue')
      },
      {
        path:'/order',
        name: "order",
        component: () => import('../views/OrderView.vue')
      },
      {
        path:'/salesreport',
        name: "salesreport",
        component: () => import('../views/Report.vue')
      },
    ]
  },
  {
    path: '/shopLayout',
    name:'shopLayout',
    component: ShopLayoutView,
    children: [
      {
        path:"/personalCenter",
        name: "personalCenter",
        component: () => import(/* webpackChunkName: "about" */ '../views/PersonalCenter.vue'),
        children: [
          {
            path: "/address",
            name: "address",
            component:() => import( '../views/Address.vue')
          },
          {
            path: "/personInf",
            name:"personInf",
            component:()=> import( '../views/PersonInformation.vue')
          },
          {
            path: "/cusOrder",
            name:"cusOrder",
            component:()=>import('../views/CusOrder.vue')
          },
        ]
      },
      {
        path:"/shopcart",
        name: "shopcart",
        component: () => import(/* webpackChunkName: "about" */ '../views/Shopcart.vue')
      },
      {
        path: '/shophome',
        name: 'shophome',
        component: () => import(/* webpackChunkName: "about" */ '../views/ShopHomeView.vue')
      },
      {
        path: "/detail",
        name: "detail",
        component: () => import(/* webpackChunkName: "about" */ '../views/Detail.vue')
      },
    ]
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "about" */ '../views/registerView.vue')
  },


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})



export default router
