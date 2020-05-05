import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import {
  PlayList,
  MusicListIndex,
  Music,
} from 'utils/music';
import { Account } from 'utils/account';
import playList from './playList'

interface RootStore {
  isOnline: boolean;
  isLogin: boolean;
  account: Account | null;
  musicLiistIndexs: Array<MusicListIndex>;
  downloadPath: string;
  localPaths: Array<string>;
}

Vue.use(Vuex);

const options: StoreOptions<any> = {
  state() {
    return {
      /**是否在线，根据navigation判断 */
      isOnline: false as boolean,
      /**是否登录，根据token判断 */
      isLogin: false as boolean,
      /**登录信息 */
      account: null as Account | null,
      /**歌单索引 */
      musicLiistIndexs: [] as Array<MusicListIndex>,
      /**下载目录 */
      downloadPath: '',
      localPaths: [] as Array<string>,
    };
  },
  getters: {
    /**根据出生年月获取年龄 */
    getAge(state): number {
      return state.account?.birthYear
        ? state.account?.birthYear - new Date().getFullYear()
        : -1;
    },
    /**获取置于模块中的playList */
    getPlayList(state): PlayList {
      return state.playList;
    }
  },
  mutations: {
    setOnline(state, value: boolean) {
      /**离线同样可以使用账号内容 */
      state.isOnline = value;
    },
    setAccount(state, value: Account) {
      /**value为空，为注销操作 */
      if (!value) {
        state.isLogin = false;
      }
      state.account = value;
    },
    setIndexs(state, value: Array<MusicListIndex>) {
      state.musicLiistIndexs = value;
    }, 
  },
  modules: {
    playList
  },
};

export default new Vuex.Store(options);
