import Vue from 'vue';
import { Music, MusicType } from '../utils/music';
import bus from '../bus';
import { MenuOption } from '../utils/options/menuOption';

export default Vue.extend({
  data() {
    return {
      keyword: '',
      musics: [] as Array<Music>,
      total: 0,
      pageSize: 30,
      currentPage: 1,
      menuOption: {
        menuItems: [
          {
            index: 0,
            text: '添加到歌单',
          },
          {
            index: 1,
            text: '播放',
          },
        ],
        type: 'searchList',
        xy: {
          x: 0,
          y: 0,
        },
      } as MenuOption,
    };
  },
  computed: {
    getParams(): any {
      return {
        keywords: this.keyword,
        limit: this.pageSize,
        type: 1,
        offset: (this.currentPage - 1) * this.pageSize,
        time: Date.now(),
      };
    },
    pageCount(): number {
      return Math.ceil(this.total / this.pageSize);
    },
  },
  methods: {
    dealResult(data) {
      if (data.code != 200) {
        console.warn('exception code', data.code);
        return;
      }
      this.musics = [];
      this.total = data.result.songCount;
      const songs = data.result.songs as Array<any>;
      songs.forEach(song => {
        const music: Music = {
          id: song.id,
          isFavor: false, //todo 在喜欢歌单中检索
          src: '',
          // artist: (song.artists as Array<any>).reduce((total, artist) => {
          //   return total + ' ' + artist.name;
          // }),//todo 优雅地显示歌手
          artist: song.artists[0].name,
          album: song.album.name,
          type: MusicType.CLOUD,
          duration: song.duration,
          title: song.name,
        };
        this.musics.push(music);
      });
    },
    /**关于table的回调 */
    play(music: Music) {
      console.log('play at searchInfo', music);
      this.$store.commit('addMusicsToPlaylist', [music]);
    },
    favor(music: Music) {
      /**
       * todo 关联歌单，发送到数据库进行更新
       */
      music.isFavor = !music.isFavor;
      console.log('favor', music);
    },
    menu(music: Music, e: MouseEvent) {
      /**唤起菜单 */
      console.log('menu', music);
      this.$set(this.menuOption, 'xy', { x: e.x, y: e.y });
      this.$set(this.menuOption, 'target', music);
      bus.$emit('showMenu', this.menuOption);
    },
    dealMenu(index, music: Music) {
      switch (index) {
        case 0:
          /**添加到歌单
           * todo 待开发
           */
          break;
        case 1:
          /**播放 */

          break;
      }
    },
    getData() {
      this._http
        .get('http://123.57.229.114:3000/search', { params: this.getParams })
        .then(resp => {
          this.dealResult(resp.data);
        })
        .catch(err => {
          console.warn(err);
        });
    },
    turnPage(index: number) {
      if (this.currentPage == this.pageCount && index > 0) {
        return;
      }
      if (this.currentPage == 1 && index < 0) {
        return;
      }
      this.currentPage += index;
      this.getData();
    },
  },
  created() {
    bus.$on('searchListReply', this.dealMenu);
    this.keyword = this.$route.query.keyword as string;
    if (this.keyword == null) {
      console.warn('empty keyword', this.keyword);
      this.$router.push('/error');
    }

    this.getData();
  },
  components: {
    musicTable: () => import('components/musicTable.vue'),
  },
});
