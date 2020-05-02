import Vue from 'vue';
import config from '@/baseConfig';
import bus from '../bus';
import { PlayMode, ModeNames } from 'utils/music';

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
      playing: false,
      vol: 0,
      modeNames: ModeNames,
      showPlayModeList: false,
      // progressBar: new HTMLElement()
    };
  },
  props: {
    /**音源 */
    src: {
      type: String,
      validator(val) {
        return /(.mp3)|(.wav)$/.test(val);
      },
      default: null,
    },
    /**封面 */
    pic: {
      type: String,
      default: config.DEFAULT_MUSIC_PIC,
    },
    /**歌名 */
    name: {
      type: String,
      default: '未知音乐',
    },
    /**歌手 */
    artist: {
      type: String,
      default: '佚名',
    },
    /**是否已添加到我喜欢 */
    isFavor: {
      type: Boolean,
      default: false,
    },
    /**是否单曲循环 */
    isLoop: {
      type: Boolean,
      default: false,
    },
    /**播放模式 */
    mode: {
      validator(val) {
        return (
          [PlayMode.ORDER, PlayMode.LOOP, PlayMode.RANDOM].indexOf(val) != -1
        );
      },
      default: PlayMode.ORDER,
    },
  },
  computed: {
    getAudio(): Function {
      let audio;

      return (): HTMLAudioElement => {
        if (audio) {
          return audio;
        } else
          return (audio =
            (this.$el.querySelector('audio#main-audio') as HTMLAudioElement) ||
            null);
      };
    },
    modeName(): string {
      return this.modeNames[this.mode];
    },
  },
  methods: {
    getTimeFormat(num: number): string {
      if (Number.isNaN(num)) return '0:00';

      if (num % 60 < 10) return ~~(num / 60) + ':' + '0' + ~~(num % 60);
      else return ~~(num / 60) + ':' + ~~(num % 60);
    },
    pause() {
      this.getAudio()?.pause();
    },
    play() {
      this.getAudio()?.play();
    },
    initData(e: Event) {
      const audio = e.target as HTMLAudioElement;
      this.duration = audio.duration;
      this.vol = audio.volume;
    },
    /**更新data中的时间进度，监听timeupdate */
    timeUpdate(e: Event) {
      this.currentTime = (e.target as HTMLAudioElement).currentTime;
    },
    /**播放/暂停 */
    togglePlay() {
      this.playing = !this.playing;
      this.playing ? this.getAudio()?.play() : this.getAudio().pause();
    },
    /**切换静音 */
    toggleMute() {
      this.muted = !this.muted;
      (this.getAudio() as HTMLAudioElement).muted = this.muted;
    },
    /**控制音量 */
    dragVol(e: MouseEvent) {
      window.addEventListener('mousemove', this.setVol);
      window.addEventListener('mouseup', this.dropVol);
    },
    dropVol(e: MouseEvent) {
      window.removeEventListener('mousemove', this.setVol);
      window.removeEventListener('mouseup', this.dropVol);
    },
    setVol(e: MouseEvent) {
      // console.log(e.offsetX);
      this.vol = e.offsetX / (e.target as HTMLElement).clientWidth;
      if (this.vol > 1) this.vol = 1;
      else if (this.vol < 0) this.vol = 0;
      (this.getAudio() as HTMLAudioElement).volume = this.vol;
    },
    /**控制播放进度
     * * 拖动过程中不会影响进度，鼠标释放再修改进度
     * ! 已知bug：在鼠标拖动进入其他热区时会导致进度条异常
     * ? 原因：拖动过程中指针可能会进入其他元素，从而导致e.target指向其他元素而不是进度条
     * ? 解决方案：根据鼠标按下时的坐标以及对应元素的上下限坐标计算，使用闭包会好一些
     */
    setProgress(e: MouseEvent) {
      let progress = e.offsetX / (e.target as HTMLElement).clientWidth;
      if (progress > 1) progress = 1;
      else if (progress < 0) progress = 0;
      const audio = this.getAudio() as HTMLAudioElement;
      audio.currentTime = audio.duration * progress;
    },
    moveProgressBar(e: MouseEvent) {
      let progress = e.offsetX / (e.target as HTMLElement).clientWidth;
      console.log((e.target as HTMLElement).id);
      if (progress > 1) progress = 1;
      else if (progress < 0) progress = 0;
      this.currentTime = this.duration * progress;
    },
    dragProgress(e: MouseEvent) {
      const audio = this.getAudio() as HTMLAudioElement;
      audio.removeEventListener('timeupdate', this.timeUpdate);
      window.addEventListener('mousemove', this.moveProgressBar);
      window.addEventListener('mouseup', this.dropProgress);
    },
    dropProgress(e: MouseEvent) {
      this.setProgress(e);
      const audio = this.getAudio() as HTMLAudioElement;
      audio.addEventListener('timeupdate', this.timeUpdate);
      window.removeEventListener('mousemove', this.moveProgressBar);
      window.removeEventListener('mouseup', this.dropProgress);
    },
    /**跳转 */
    go(index) {
      switch (index) {
        case -1:
          /**后退 */
          break;
        case 1:
          /**前进 */
          break;
        case 0:
          /**重新播放 */
          break;
      }

      /**代码测试 */
      const fs = require('fs');
    },
    /**显示/隐藏歌单 */
    togglePlayList() {
      bus.$emit('togglePlayList');
    },
    togglePlayModeList() {
      this.showPlayModeList = !this.showPlayModeList;
    },
    changePlayMode(index) {
      if (index != this.mode) bus.$emit('changePlayMode', index);
      this.showPlayModeList = !this.showPlayModeList;
    },
  },
  mounted() {
    // this.duration = (this.getAudio() as HTMLAudioElement).duration;
    /* this.$nextTick(() => {
      console.log((this.getAudio() as HTMLAudioElement).currentTime);
    }); */
    const audio = this.getAudio() as HTMLAudioElement;
    audio.ondurationchange = this.initData;
    audio.addEventListener('timeupdate', this.timeUpdate);
    // this.progressBar = this.$el.querySelector('#progress-bar-box') as HTMLElement;
  },
  components: {
    collapse: () => import('components/common/collapse.ts'),
  },
});
