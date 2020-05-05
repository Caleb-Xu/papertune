import Vue from 'vue';
import bus from '../bus';
import { PlayMode, ModeNames, PlayList, Music, MusicType } from 'utils/music';
import { mapState, mapMutations } from 'vuex';

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
      // playing: false,
      // vol: 0,
      modeNames: ModeNames,
      showPlayModeList: false,
      // progressBar: new HTMLElement()
      // playList: {} as PlayList,
    };
  },
  computed: {
    ...mapState(['isOnline', 'downloadPath']),
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
      return this.modeNames[this.playList.mode];
    },
    isLoop(): boolean {
      return this.playList.mode == PlayMode.LOOP;
    },
  },
  methods: {
    ...mapMutations(['go']),
    getTimeFormat(num: number): string {
      if (Number.isNaN(num)) return '0:00';

      if (num % 60 < 10) return ~~(num / 60) + ':' + '0' + ~~(num % 60);
      else return ~~(num / 60) + ':' + ~~(num % 60);
    },
    pause() {
      this.getAudio()?.pause();
      this.playList.playing = false;
    },
    play() {
      this.getAudio()?.play();
      this.playList.playing = true;
    },
    initData(e: Event) {
      const audio = e.target as HTMLAudioElement;
      this.duration = audio.duration;
      this.playList.vol = audio.volume;
    },
    /**更新data中的时间进度，监听timeupdate */
    timeUpdate(e: Event) {
      this.currentTime = (e.target as HTMLAudioElement).currentTime;
    },
    /**播放/暂停 */
    togglePlay() {
      this.playList.playing = !this.playList.playing;
      this.playList.playing ? this.getAudio()?.play() : this.getAudio().pause();
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
      this.playList.vol = e.offsetX / (e.target as HTMLElement).clientWidth;
      if (this.playList.vol > 1) this.playList.vol = 1;
      else if (this.playList.vol < 0) this.playList.vol = 0;
      (this.getAudio() as HTMLAudioElement).volume = this.playList.vol;
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
    /**显示/隐藏歌单 */
    togglePlayList() {
      bus.$emit('togglePlayList');
    },
    togglePlayModeList() {
      this.showPlayModeList = !this.showPlayModeList;
    },
    changePlayMode(index) {
      // if (index != this.mode) bus.$emit('changePlayMode', index);
      if (index != this.playList.mode) bus.$emit('changePlayMode', index);
      this.showPlayModeList = !this.showPlayModeList;
    },
  },
  created() {
    // console.log('history =', this.getPlayList.playHistory);
    // this.playList = this.getPlayList;
    console.log('music = ', this.music);
  },
  mounted() {
    const audio = this.getAudio() as HTMLAudioElement;
    audio.ondurationchange = this.initData;
    audio.addEventListener('timeupdate', this.timeUpdate);
    // this.progressBar = this.$el.querySelector('#progress-bar-box') as HTMLElement;
  },
  components: {
    collapse: () => import('components/common/collapse.ts'),
  },
});
