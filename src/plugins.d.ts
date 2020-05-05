// import Vue from 'vue';
import { AxiosInstance } from 'axios';
import VueRouter, { Route } from 'vue-router';

declare module 'vue/types/vue' {
  interface Vue {
    _http: AxiosInstance;
    _config: {
      LOGO: string;
      DEFAULT_GRIL_AVATAR: string;
      DEFAULT_BOY_AVATAR: string;
      DEFAULT_MUSIC_PIC: string;
      DEFAULT_DOWNLOAD_PATH: string;
      SERVER_HOST: string;
      SINGLE: boolean;
      DEFAULT_COLOR: {};
      SIZE: {
        WIDTH: number;
        HEIGHT: number;
      };
      LIST_MAX_LENGTH: number;
    };
    $router: VueRouter;
    $route: Route;
  }
}
