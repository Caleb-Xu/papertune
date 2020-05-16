import Vue from 'vue';
import { Music } from 'utils/music';
import { getMusicPic, getLyric } from 'utils/musicFile';
import bus from '../bus';

/**
 * todo 每次获取到连接类型的歌词时，将歌词内容存放到字段中，方便管理 
 */

/**歌词类 */
interface Lyric {
  time: number; //临时为字符串
  str: string;
}

export default Vue.extend({
  data() {
    return {
      pic: this._config.DEFAULT_MUSIC_PIC,
      lrcs: [] as Array<Lyric>,
      current: 0,
      lineHeight: 30,
    };
  },
  watch: {
    async music(val) {
      this.current = 0;
      this.pic =
        (await this.getMusicPic(this.music)) || this._config.DEFAULT_MUSIC_PIC;
      this.lrcs = [];
      await this.getMusicLyric();
    },
    /**通过current的变化将歌词置于视图中央 */
    current(val) {
      const lrc = this.$refs['lrc'][val] as HTMLElement;
      const box = this.$refs['box'] as HTMLElement;
      const mid = this.lineHeight * 7;
      if (lrc.offsetTop > mid) {
        box.scrollTo({
          top: lrc.offsetTop - mid,
          behavior: 'smooth',
        });
      } else {
        box.scrollTo(0, 0);
      }
    },
  },
  computed: {
    music(): Music {
      return this.$store.getters.getMusic;
    },
  },
  methods: {
    getMusicPic,
    /**
     * TODO 在拿到歌词后把歌词文本写入lrc字段，方便以后使用
     */
    async getMusicLyric() {
      // /**测试 */
      // this.music.lrc =
      //   'D:\\QQMusic\\QQMusicLyricNew\\巡音流歌 - Palette - 225 - Story of Hope (初回生産限定)_qm.lrc';
      const str = await getLyric(this.music);
      // console.log(str);
      if (str) {
        str.split('\n').forEach((s, i) => {
          const t = s.split(/(\[)|(\])/);
          // console.log(i,t);
          /**去无歌词行的过滤方式，有一定的隐患 */
          if (t[6]?.length > 0) {
            this.lrcs.push({
              time: this.parseTime(t[3]), //需要转化为数字格式
              str: t[6],
            });
          }
        });
      }
    },
    /**将字符串格式的歌词时间转为数字 */
    parseTime(time: string): number {
      const arr = time.split(':').map(ti => {
        if (Number.isNaN(+ti)) {
          console.warn('不标准的时间格式', ti);
          return 0;
        }
        return +ti;
      });
      // console.log('arr', arr);
      if (arr[2]) {
        return arr[0] * 60 + arr[1] + arr[2] / 60;
      }
      return arr[0] * 60 + arr[1];
    },
    /**选中歌词，滚动歌词通过watch实现 */
    selectLrc(time) {
      // console.log('time', time);
      /**暴力遍历 */
      this.lrcs.forEach((lrc, index, lrcs) => {
        if (time > lrc.time) {
          if (index + 1 < lrcs.length && time < lrcs[index + 1].time)
            this.current = index;
        }
      });
    },
  },
  async created() {
    this.pic =
      (await this.getMusicPic(this.music)) || this._config.DEFAULT_MUSIC_PIC;
    this.lrcs = [];
    await this.getMusicLyric();
  },
  mounted() {
    bus.$on('timeUpdate', this.selectLrc);
  },
});
