import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { PlayList, PlayHistory, PlayMode, hasMusic } from 'utils/music';
import { Account } from 'utils/account';

interface RootStore {
  isOnline: boolean;
  isLogin: boolean;
  account: Account | null;
  playList: PlayList | null;
  playHistory: PlayHistory;
}

Vue.use(Vuex);

const maxLen = 20;

const options: StoreOptions<RootStore> = {
  state() {
    return {
      /**是否在线，根据navigation判断 */
      isOnline: false,
      /**是否登录，根据token判断 */
      isLogin: false,
      /**登录信息 */
      account: null,
      /**播放列表 */
      playList: null,
      /**历史记录 */
      playHistory: {
        queue: [],
        max: maxLen,
      },
    };
  },
  getters: {
    /**根据出生年月获取年龄 */
    getAge(state): number {
      return state.account?.birthYear
        ? state.account?.birthYear - new Date().getFullYear()
        : -1;
    },
  },
  mutations: {
    setOnline(state, value: boolean) {
      /**离线同样可以使用账号内容 */
      state.isOnline = value;
    },
    login(state, value: Account) {
      /**value为空，为注销操作 */
      if (!value) {
        state.isLogin = false;
      }
      state.account = value;
    },
  },
  actions: {
    /**歌曲跳转 */
    go(context, index: number) {
      const state = context.state;
      /**歌单存在长度才有效 */
      if (state.playList?.queue.length) {
        const playList = state.playList;
        /**下一首 */
        if (index == 1) {
          if (playList.mode == PlayMode.LOOP) {
            /**在audio对象上对其进行判断实现静音 */
            // Vue.set(playList, 'isLoop', !playList.isLoop);
          } else if (playList.mode == PlayMode.ORDER) {
            let newIndex;
            if (playList.currentIndex + 1 > playList.queue.length - 1) {
              /**如果越界，回到起点 */
              newIndex = 0;
            } else {
              newIndex = playList.currentIndex + 1;
            }
            Vue.set(playList, 'currentIndex', newIndex);
            Vue.set(playList, 'current', playList.queue[newIndex]);
          } else if (playList.mode == PlayMode.RANDOM) {
            let randomIndex = -1;
            /**当随机结果相等时，继续随机 */
            do {
              randomIndex = ~~(Math.random() * playList.queue.length);
            } while (randomIndex == playList.currentIndex);
            Vue.set(playList, 'currentIndex', randomIndex);
            Vue.set(playList, 'current', playList.queue[randomIndex]);
          }
        } else if (index == 0) {
          /**刷新 */
          Vue.set(playList, 'current', null);
          Vue.nextTick(() => {
            Vue.set(playList, 'current', playList.queue[playList.currentIndex]);
          });
        } else if (index == -1) {
          /**根据历史记录回调 */
          const music = state.playHistory.queue.pop();
          /**如果列表为空，则不执行，直接退出 */
          if (!music) {
            console.warn('no history', state.playHistory.queue);
            return;
          }
          state.playList.current = music;
          /**如果上一首不在现在的播放列表中，则添加到现在的播放列表 */
          if (!hasMusic(music, playList.queue)) {
            playList.queue.push(music);
          }
        }
      } else {
        /**歌单中没有歌曲，不执行 */
        console.warn('playList none', state.playList);
      }
    },
  },
  modules: {},
};

export default new Vuex.Store(options);
