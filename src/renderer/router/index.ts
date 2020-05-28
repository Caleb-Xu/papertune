import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import localList from '@/renderer/views/localList.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    // path: '/localList',
    path: '/',
    name: 'index',
    redirect:'/accountInfo'
  },
  {
    // path: '/localList',
    path: '/localList',
    name: 'localList',
    component: localList,
  },
  {
    // path: '/localList',
    path: '/setting',
    name: 'setting',
    component: () => import('@/renderer/views/setting.vue'),
  },
  {
    path: '/accountInfo',
    name: 'accountInfo',
    component: () => import('@/renderer/views/accountInfo.vue'),
  },
  {
    path: '/musicInfo',
    name: 'musicInfo',
    component: () => import('@/renderer/views/musicInfo.vue'),
  },
  {
    path: '/musicList',
    name: 'musicList',
    component: () => import('@/renderer/views/musicList.vue'),
  },
  {
    path: '/searchInfo',
    name: 'searchInfo',
    component: () => import('@/renderer/views/searchInfo.vue'),
    props: true,
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
