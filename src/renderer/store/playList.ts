import { Module } from 'vuex';
import { PlayList, Music, PlayMode, findMusic, MusicType } from 'utils/music';
import Vue from 'vue';

const option: Module<PlayList, any> = {
  // namespaced: true,

  state() {
    return {
      vol: 0.5,
      // current: null,
      currentIndex: -1,
      queue: [] as Array<Music>,
      mode: PlayMode.ORDER,
      playing: false,
      playHistory: [] as Array<Music>,
    };
  },
  getters: {
    getMusic(state) {
      return (
        state.queue[state.currentIndex] || {
          src: '',
          id: -1,
          title: '还未选择音乐',
          artist: '无',
          album: '无',
          duration: 0,
          isFavor: false,
          type: MusicType.LOCAL,
        }
      );
    },
  },
  mutations: {
    setPlayList(state, value: PlayList) {
      state = value;
    },
    /**歌曲跳转 */
    go(state, index: number) {
      /**歌单存在长度才有效 */
      if (state.queue.length) {
        const playList = state;
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
            playList.currentIndex = newIndex;
            // playList.current = playList[playList.currentIndex];
          } else if (playList.mode == PlayMode.RANDOM) {
            let randomIndex = -1;
            /**当随机结果相等时，继续随机 */
            do {
              randomIndex = ~~(Math.random() * playList.queue.length);
            } while (randomIndex == playList.currentIndex);
            playList.currentIndex = randomIndex;
            // playList.current = playList.queue[playList.currentIndex];
          }
        } else if (index == 0) {
          /**刷新 */
          Vue.set(playList, 'current', null);
          Vue.nextTick(() => {
            Vue.set(playList, 'current', playList.queue[playList.currentIndex]);
          });
        } else if (index == -1) {
          /**根据历史记录回调 */
          const music = state.playHistory.pop();
          /**如果列表为空，则不执行，直接退出 */
          if (!music) {
            console.warn('no history', state.playHistory);
            return;
          }
          const index = findMusic(music, playList.queue);
          if (index != -1) {
            playList.currentIndex = index;
          } else {
            /**如果上一首不在现在的播放列表中，则添加到现在的播放列表 */
            playList.queue.push(music);
            playList.currentIndex = playList.queue.length - 1;
          }
        }
      } else {
        /**歌单中没有歌曲，不执行 */
        console.warn('playList none', state.queue);
      }
    },
  },
};

export default option;
