import bus from '@/renderer/bus';
import { Module } from 'vuex';
import { PlayList, Music, PlayMode, findMusic, MusicType } from 'utils/music';
import Vue from 'vue';

const option: Module<PlayList, any> = {
  // namespaced: true,

  state: {
    vol: 0.5,
    currentIndex: -1,
    queue: [] as Array<Music>,
    mode: PlayMode.ORDER,
    playing: false,
    playHistory: [] as Array<Music>,
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
      /**
       * ! 不能直接替换整个state
       */
      state.vol = value.vol;
      state.currentIndex = value.currentIndex;
      state.mode = value.mode;
      state.playHistory = value.playHistory;
      state.playing = value.playing;
      state.queue = value.queue;
    },
    /**添加音乐至播放列表 */
    addMusics(state, ...musics: Array<Music>) {
      // console.log('vol is', state.vol);
      if (musics.length == 0) {
        console.warn('add empty musics');
        return;
      }
      state.playing = true;
      state.queue.push(...musics);
      state.currentIndex = state.queue.length - 1;
    },
    /**歌曲跳转 */
    go(state, indexa: number) {
      /**歌单存在长度才有效 */
      if (state.queue.length) {
        const playList = state;
        let index;
        /**如果只有一首歌，当作go(0)处理 */
        if (playList.queue.length == 1) {
          index = 0;
        } else {
          index = indexa;
        }
        /**下一首 */
        if (index == 1) {
          playList.playHistory.push(playList.queue[playList.currentIndex]);
          /**溢出 */
          if(playList.playHistory.length>100){
            playList.playHistory.shift();
          }
          if (playList.mode == PlayMode.LOOP) {
            /**由player内部进行判断，不需要操作 */
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
          bus.$emit('replay');
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
        /**播放 */
        playList.playing = false;
        Vue.nextTick(() => {
          playList.playing = true;
        });
      } else {
        /**歌单中没有歌曲，不执行 */
        console.warn('no music in playList ', state.queue);
      }
    },
  },
};

export default option;
