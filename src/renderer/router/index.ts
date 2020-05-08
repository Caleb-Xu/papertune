import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import localList from '@/renderer/views/localList.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    // path: '/localList',
    path:'/',
    name: 'localList',
    component: localList,
  },
  {
    path:'/musicInfo',
    name:'musicInfo',
    component:undefined,
  },
  {
    path:'/setting',
    name:'setting',
    component:undefined,
    children:[
      {
        path:'base',
        name:'setting-base',
        component:undefined
      }
    ]
  },
  {
    path: '*',
    name: 'Error',
    component: () => import('@/renderer/views/Error.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
