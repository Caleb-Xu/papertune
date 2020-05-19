import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import {
  PlayList,
  Music,
  MusicListPayload,
  SubmitType,
  MusicList,
  findMusic,
} from 'utils/music';
import { Account } from 'utils/account';
import playList from './playList';
import config from '@/baseConfig';
import axios from 'axios';
import bus from '../bus';

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
      /**是否在线，根据navigatior判断 */
      isOnline: navigator.onLine,
      /**是否登录，根据token判断 */
      isLogin: false as boolean,
      /**登录信息 */
      account: null as Account | null,
      /**歌单索引 */
      musicLists: [] as Array<MusicList>,
      /**下载目录 */
      downloadPath: '',
      localPaths: [] as Array<string>,
    };
  },
  getters: {
    netActive(state) {
      return !config.SINGLE && state.isOnline && state.isLogin;
    },
    favorList(state): Array<MusicList> {
      return state.musicLists[0].list;
    },
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
    allListNames(state): Array<string> {
      const result = [] as Array<string>;
      state.musicLists.forEach(list => {
        result.push(list.name);
      });
      return result;
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
    setMusicLists(state, value: Array<MusicList>) {
      console.log('setIndexs', value);
      state.musicLists = value;
    },
    addMusic(state, payload: MusicListPayload) {
      console.log('addmusic');
      (state.musicLists as Array<MusicList>).forEach((musiclist, index) => {
        if (musiclist.name == payload.name) {
          musiclist.list?.push(payload.music as Music);
          console.log(musiclist.list);
          console.log('added');
          // Vue.set(context.state.musicLists, index, musiclist);
        }
      });
    },
    removeMusic(state, payload: MusicListPayload) {
      console.log('removemusic');
      (state.musicLists as Array<MusicList>).forEach((musiclist, index) => {
        if (musiclist.name == payload.name) {
          // musiclist.list?.push(payload.music as Music);
          musiclist.list?.splice(
            findMusic(payload.music as Music, musiclist.list),
            1
          );
          console.log(musiclist.list);
          console.log('removed');
          // Vue.set(context.state.musicLists, index, musiclist);
        }
      });
    },
    addMusicList(state, payload: MusicListPayload) {
      console.log('addMusicList');
      const newList: MusicList = {
        uid: state.account.uid,
        name: payload.name || '新歌单' + Date.now(),
        list: [],
      };
      if (payload.lid) {
        newList.lid = payload.lid;
      }
      state.musicLists.push(newList);
    },
  },
  actions: {
    /**修改歌单，与数据库关联
     * * 关键函数，每一次对歌单进行操作时都要调用这个方法
     */
    async modifyMusicList(context, payload: MusicListPayload) {
      // const db: IDBDatabase = await getDB();
      /**判断是否同步到server */
      console.log('modifyMusicList', payload);
      let params;
      let list;
      const needUpload = context.getters.netActive;
        
      switch (payload.act) {
        case SubmitType.ADD:
          /**添加 */

          // console.log(payload.act, payload.music, payload.name);
          // db.transaction('MUSIC_LIST','readwrite').objectStore('MUSIC_LIST').put()
          (context.state.musicLists as Array<MusicList>).forEach(
            (musiclist, index) => {
              if (musiclist.name == payload.name) {
                list = musiclist;
                // Vue.set(context.state.musicLists, index, musiclist);
              }
            }
          );
          if (list == null || findMusic(payload.music as Music, list.list) != -1) {
            return;
          }
          context.commit('addMusic', payload);
          if (needUpload)
            await axios
              .post('http://localhost:4396/client/addMusic', {
                uid: context.state.account.uid,
                name: payload.name,
                music: payload.music,
              })
              .then(resp => {
                console.log(resp.data);
                bus.$emit('showMsg', '音乐已添加至' + payload.name);
              });
          break;
        case SubmitType.REMOVE:
          /**删除 */
          context.commit('removeMusic', payload);
          if (needUpload)
            await axios
              .post('http://localhost:4396/client/removeMusic', {
                uid: context.state.account.uid,
                name: payload.name,
                music: payload.music,
              })
              .then(resp => {
                console.log(resp.data);
                bus.$emit('showMsg', '音乐已从' + payload.name + '删除');
              });
          break;
        case SubmitType.EDIT:
          /**编辑 */
          break;
        case SubmitType.DROP:
          /**移除 */
          break;
        case SubmitType.CREATE:
          /**创建 */
          if (needUpload) {
            await axios
              .post('http://localhost:4396/client/addMusicList', {
                uid: context.state.account.uid,
                name: payload.name,
              })
              .then(resp => {
                // console.log(resp.data);
                payload.lid = resp.data;
                context.commit('addMusicList', payload);
                bus.$emit('showMsg', '歌单 ' + payload.name + '创建成功！');
              });
          } else {
            context.commit('addMusicList', payload);
            bus.$emit('showMsg', '歌单 ' + payload.name + '创建成功！');
          }
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
