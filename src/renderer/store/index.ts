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
      if (payload.lid != null || payload.name != null) {
        (state.musicLists as Array<MusicList>).forEach((musiclist, index) => {
          if (musiclist.name == payload.name || musiclist.lid == payload.lid) {
            if (
              payload.music &&
              findMusic(payload.music, musiclist.list) == -1
            ) {
              musiclist.list?.push(payload.music as Music);
              console.log(musiclist.list);
              console.log('added');
              bus.$emit('showMsg', '音乐已添加至【' + musiclist.name + '】');
            } else {
              bus.$emit('showMsg', '音乐已存在于歌单中');
            }
          }
        });
      } else {
        console.warn('addmusic without name or lid');
        return;
      }
    },
    removeMusic(state, payload: MusicListPayload) {
      console.log('removemusic');
      (state.musicLists as Array<MusicList>).forEach(musiclist => {
        if (musiclist.name == payload.name || musiclist.lid == payload.lid) {
          musiclist.list?.splice(
            findMusic(payload.music as Music, musiclist.list),
            1
          );
          console.log(musiclist.list);
          console.log('removed');
          // Vue.set(context.state.musicLists, index, musiclist);
          bus.$emit('showMsg', '音乐已从【' + musiclist.name + '】删除');
        }
      });
    },
    removeMusicList(state, payload: MusicListPayload) {
      if (payload.lid && payload.lid > 0) {
        (state.musicLists as MusicList[]).forEach((musiclist, index) => {
          if (musiclist.lid == payload.lid) {
            const [list] = (state.musicLists as MusicList[]).splice(index, 1);
            bus.$emit('showMsg', '【' + list.name + '】删除成功！');
          }
        });
      } else {
        console.warn('no lid in payload', payload.lid);
        return;
      }
    },
    editMusicList(state, payload: MusicListPayload) {
      //
      console.log('editMusicList');
      if (payload.lid != null) {
        const musiclist = state.musicLists[payload.lid] as MusicList;
        if (payload.name && payload.name.length > 0) {
          musiclist.name = payload.name;
        }
        if (payload.description && payload.description.length > 0) {
          musiclist.description = payload.description;
        }

        bus.$emit('showMsg', '修改成功！');
      } else {
        console.warn('no lid in payload', payload.lid);
        return;
      }
    },
    addMusicList(state, payload: MusicListPayload) {
      console.log('addMusicList');
      if (!payload.name) {
        bus.$emit('showMsg', '歌单名不能为空');
        return;
      }
      if (
        (state.musicLists as Array<MusicList>).some(list => {
          if (list.name == payload.name) {
            return true;
          }
          return false;
        })
      ) {
        bus.$emit('showMsg', '歌单名重复');
        return;
      }
      const newList: MusicList = {
        uid: state.account.uid,
        name: payload.name,
        list: [],
        lid: state.musicLists[state.musicLists.length - 1].lid + 1,
      };
      state.musicLists.push(newList);
      bus.$emit('showMsg', '歌单【' + payload.name + '】创建成功！');
    },
  },
  actions: {
    /**修改歌单，与数据库关联
     * * 关键函数，每一次对歌单进行操作时都要调用这个方法
     */
    modifyMusicList(context, payload: MusicListPayload) {
      console.log('modifyMusicList', payload);
      // const needUpload = context.getters.netActive;
      const dbName = 'MUSIC_LIST';
      switch (payload.act) {
        case SubmitType.ADD:
          /**添加 */
          // console.log(payload.act, payload.music, payload.name);
          context.commit('addMusic', payload);
          break;
        case SubmitType.REMOVE:
          /**删除 */
          context.commit('removeMusic', payload);
          break;
        case SubmitType.EDIT:
          /**编辑 */
          context.commit('editMusicList', payload);
          break;
        case SubmitType.DROP:
          /**移除 */
          context.commit('removeMusicList', payload);
          break;
        case SubmitType.CREATE:
          /**创建 */

          context.commit('addMusicList', payload);
          break;
      }
    },
  },
  modules: {
    playList,
  },
};

export default new Vuex.Store(options);
