import Vue from 'vue';
import bus from '@/renderer/bus';
import {
  PlayMode,
  ModeNames,
  PlayList,
  Music,
  MusicType,
  MusicListPayload,
  SubmitType,
} from 'utils/music';
import { mapState, mapMutations } from 'vuex';
import { getMusicPic } from 'utils/musicFile';
import { MenuOption, MenuItem } from '../utils/options/menuOption';

/**
 * * 下午的目标：
 * * 将数据替换成vuex
 * * 初始化indexedDB，并投入使用
 */

export default Vue.extend({
  data() {
    return {
      muted: false,
      duration: 0,
      currentTime: 0,
      modeNames: ModeNames,
      showPlayModeList: false,
      audio: {} as HTMLAudioElement,
      pic: '',
    };
  },
  watch: {
    /**音量使用watch托管，希望不会坑 */
    'playList.vol'(vol) {
      // console.log('vol is', vol);
      this.audio.volume = vol;
    },
    'playList.playing'(bool) {
      // console.log('playing watched', bool);
      this.$nextTick(() => {
        if (bool == true) {
          console.log('playing music:', this.music);
          this.audio.play().catch(() => {
            this.audio.play();
          });
        } else this.audio.pause();
      });
    },
    /**切歌触发器
     * * 关键
     */
    async music(val: Music) {
      if (val.type == MusicType.CLOUD) {
        /**获取云音乐src */
        await this.getCloudMusicSrc(this.music);
      }
      /**没有src就跳过 */
      if (!val.src) {
        this.go(1);
        return;
      }
      this.audio.src = val.src;
      /**获取封面，异步 */
      this.setPic();
      if (this.playList.playing == false) {
        return;
      } else {
        this.playList.playing = false;

        this.$nextTick(() => (this.playList.playing = true));
      }
    },
  },
  computed: {
    ...mapState(['isOnline', 'downloadPath']),
    menuOption(): MenuOption {
      const subMenu = [] as Array<MenuItem>;
      (this.$store.getters.allListNames as Array<string>).forEach(
        (name, index) => {
          subMenu.push({
            index,
            text: name,
          });
        }
      );
      return {
        menuItems: [
          {
            index: 0,
            text: '添加到歌单...',
            subMenu,
            subShow: false,
          },
          {
            index: 1,
            text: '从播放列表移除',
          },
        ],
        type: 'player',
        xy: {
          x: 0,
          y: 0,
        },
      };
    },
    /**vuex中的playList */
    playList(): PlayList {
      return this.$store.getters.getPlayList;
    },
    music(): Music {
      return this.$store.getters.getMusic;
    },
    /**判定是否能播放，可能有多个判定条件 */
    playAble(): boolean {
      return this.music.src != '' && true;
    },
    modeName(): string {
      return this.modeNames[this.playList.mode];
    },
    isLoop(): boolean {
      return this.playList.mode == PlayMode.LOOP;
    },
  },
  methods: {
    go(index) {
      this.$store.commit('go', index);
      if (this.playList.playing == false) {
        this.$set(this.playList, 'playing', true);
      }
    },
    getMusicPic,
    menu(e: MouseEvent) {
      /**唤起菜单 */
      this.$set(this.menuOption, 'xy', { x: e.x, y: e.y });
      // this.$set(this.menuOption, 'target', this.music);
      bus.$emit('showMenu', this.menuOption);
    },
    toMusicPage() {
      this.$router.push('musicInfo').catch(err => {
        //
      });
    },
    /**时长转为时间格式文本 */
    getTimeFormat(num: number): string {
      if (Number.isNaN(num)) return '0:00';

      if (num % 60 < 10) return ~~(num / 60) + ':' + '0' + ~~(num % 60);
      else return ~~(num / 60) + ':' + ~~(num % 60);
    },
    /**audio回调相关 */
    pause() {
      this.playList.playing = false;
    },
    play() {
      this.playList.playing = true;
    },
    replay() {
      this.audio.currentTime = 0;
      this.playList.playing = true;
    },
    favor() {
      const music = this.music;
      music.isFavor = !music.isFavor;
      console.log('favor', music);

      // this.$store.state.favorList.push(music);
      const payload: MusicListPayload = {
        act: SubmitType.ADD,
        music: music,
        lid: this.$store.state.musicLists[0].lid,
      };
      if (music.isFavor == false) {
        payload.act = SubmitType.REMOVE;
      }
      this.$store.dispatch('modifyMusicList', payload);
    },
    playErr() {
      console.warn('can not play', this.music);
      /**避免重复播放错误歌曲的死循环 */
      if (this.playList.queue.length > 1) {
        this.go(1);
      }
    },

    /**更新data中的时间进度，监听timeupdate */
    timeUpdate(e: Event) {
      this.currentTime = (e.target as HTMLAudioElement).currentTime;
      bus.$emit('timeUpdate', this.currentTime);
    },
    /**播放/暂停 */
    togglePlay() {
      this.playList.playing = !this.playList.playing;
      this.playList.playing ? this.audio.play() : this.audio.pause();
    },
    /**切换静音 */
    toggleMute() {
      this.muted = !this.muted;
      this.audio.muted = this.muted;
    },
    dragVol(e: MouseEvent) {
      /**横坐标 */
      let x = e.offsetX;
      /**元素宽度 */
      const width = (e.target as HTMLElement).clientWidth;
      // /**元素左边界横坐标 */
      console.log('oldX', x);
      console.log('width', width);
      // console.log(e.target);
      const _this = this;
      function moveVol(e: MouseEvent) {
        x = x + e.movementX;
        _this.playList.vol = Math.min(Math.max(x / width, 0), 1);
        // _this.playList.vol = (e.pageX - left) / width;
      }
      function dropVol(e: MouseEvent) {
        window.removeEventListener('mousemove', moveVol);
        window.removeEventListener('mouseup', dropVol);
      }
      window.addEventListener('mousemove', moveVol);
      window.addEventListener('mouseup', dropVol);
    },
    setVol(e: MouseEvent) {
      // console.log(e.offsetX);
      this.playList.vol =
        e.offsetX / (this.$refs['vol-bar'] as HTMLElement).clientWidth;
      if (this.playList.vol > 1) this.playList.vol = 1;
      else if (this.playList.vol < 0) this.playList.vol = 0;
    },
    /**控制播放进度*/
    setProgress(e: MouseEvent) {
      let progress =
        e.offsetX / (this.$refs['progress'] as HTMLElement).clientWidth;
      if (progress > 1) progress = 1;
      else if (progress < 0) progress = 0;
      this.audio.currentTime = this.audio.duration * progress;
    },
    moveProgressBar(e: MouseEvent) {
      let progress = e.offsetX / (e.target as HTMLElement).clientWidth;
      console.log((e.target as HTMLElement).id);
      if (progress > 1) progress = 1;
      else if (progress < 0) progress = 0;
      this.currentTime = this.duration * progress;
    },
    dragTime(e: MouseEvent) {
      /**横坐标 */
      let x = e.offsetX;
      /**元素宽度 */
      const width = (e.target as HTMLElement).clientWidth;
      // /**元素左边界横坐标 */
      // console.log('oldX', x);
      // console.log('width', width);
      // console.log(e.target);
      const _this = this;
      function moveTime(e: MouseEvent) {
        x = x + e.movementX;
        _this.currentTime = Math.floor((x / width) * _this.audio.duration);
      }
      function dropTime(e: MouseEvent) {
        window.removeEventListener('mousemove', moveTime);
        window.removeEventListener('mouseup', dropTime);
        _this.audio.currentTime = _this.currentTime;
        _this.audio.addEventListener('timeupdate', _this.timeUpdate);
      }
      this.audio.removeEventListener('timeupdate', this.timeUpdate);
      window.addEventListener('mousemove', moveTime);
      window.addEventListener('mouseup', dropTime);
    },
    dropProgress(e: MouseEvent) {
      this.setProgress(e);
      this.audio.addEventListener('timeupdate', this.timeUpdate);
      window.removeEventListener('mousemove', this.moveProgressBar);
      window.removeEventListener('mouseup', this.dropProgress);
    },
    /**显示/隐藏歌单 */
    togglePlayList() {
      bus.$emit('togglePlayList');
    },
    togglePlayModeList() {
      this.showPlayModeList = !this.showPlayModeList;
    },
    changePlayMode(index) {
      this.playList.mode = index;
      this.showPlayModeList = false;
    },
    /**处理云音乐，获取临时src与歌词，封面 */
    async getCloudMusicSrc(music: Music) {
      await this._http(
        'http://123.57.229.114:3000/song/url?id=' + this.music.id
      )
        .then(resp => {
          /**测试 */
          console.log(resp.data);
          if (resp.data.code == 200) {
            try {
              this.music.src = resp.data.data[0].url;
              if (this.music.src == null) {
                throw 'null';
              }
              console.log(resp.data.data[0].url);
            } catch {
              bus.$emit('showMsg', '无法播放' + music.title + '!');

              this.go(1);
            }
          } else {
            console.warn('无法获取src', resp.data.code);
          }
        })
        .catch(err => {
          console.warn(err);
        });
    },
    async setPic() {
      this.pic = (await this.getMusicPic(this.music)) || '';
    },
    dealMenu(index, target: Music /* 空 */, subIndex: number) {
      console.log('dealMenu', index, target, subIndex);
      const payload: MusicListPayload = {
        act: SubmitType.ADD,
        music: this.music,
      };
      switch (index) {
        case 0:
          /**添加到歌单...*/
          /**如果是第一个，favor*/
          if (subIndex == 0) {
            // music.isFavor = true; //直接更新对象属性无法即时作用于视图，因此将target改为index
            this.$set(this.music, 'isFavor', true);
          }
          payload.lid = this.$store.state.musicLists[subIndex].lid;
          this.$store.dispatch('modifyMusicList', payload);
          break;
        case 1:
          /**从播放列表移除 */
          this.$store.commit('deleteMusicInPlayList', this.music);
          break;
      }
    },
    // getMusicPic(){
    //   //
    // }
  },
  created() {
    bus.$on('replay', this.replay);
    bus.$on('playerReply', this.dealMenu);
  },
  mounted() {
    this.audio = this.$refs.audio as HTMLAudioElement;
    this.audio.volume = this.playList.vol;
    this.audio.addEventListener('durationchange', () => {
      this.duration = this.audio.duration;
    });
    this.audio.addEventListener('timeupdate', this.timeUpdate);
  },
  components: {
    collapse: () => import('components/common/collapse.ts'),
  },
});
