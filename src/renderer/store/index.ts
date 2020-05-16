import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import {
  PlayList,
  Music,
  MusicListPayload,
  SubmitType,
  MusicList,
} from 'utils/music';
import { Account } from 'utils/account';
import playList from './playList';
import config from '@/baseConfig';

/**获取歌单数据库 */
function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('papertune');
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = err => {
      reject('getMusicListDB err' + err);
    };
  });
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
      musicLists: [] as Array<MusicList>,
      /**【我喜欢】歌单的内容，便于显示❤ */
      favorList: [] as Array<Music>,
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
    },
    /**下载路径与本地路径相加 */
    getAllPaths(state): Array<string> {
      if (state.downPath == '') return state.localPaths;
      else
        return (state.localPaths as Array<string>).concat(
          state.downloadPath as string
        );
    },
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
    setIndexs(state, value: Array<MusicList>) {
      console.log('setIndexs',value);
      state.musicLists = value;
    },
  },
  actions: {
    /**修改歌单，与数据库关联
     * * 关键函数，每一次对歌单进行操作时都要调用这个方法
     */
    async modifMusicList(context, payload: MusicListPayload) {
      const db: IDBDatabase = await getDB();
      /**判断是否同步到server */
      const needUpload =
        !config.SINGLE && context.state.isOnline && context.state.isLogin;
      switch (payload.act) {
        case SubmitType.ADD:
          /**添加 */
          break;
        case SubmitType.REMOVE:
          /**删除 */
          break;
        case SubmitType.EDIT:
          /**编辑 */
          break;
        case SubmitType.DROP:
          /**移除 */
          break;
        case SubmitType.CREATE:
          /**创建 */
          break;
      }
      console.log('modifMusicList', payload);
    },
  },
  modules: {
    playList,
  },
};

export default new Vuex.Store(options);
