import Vue from 'vue';
import {
  Music,
  MusicType,
  MusicListPayload,
  SubmitType,
  findMusic,
} from '../utils/music';
import bus from '../bus';
import { MenuOption, MenuItem } from '../utils/options/menuOption';

export default Vue.extend({
  data() {
    return {
      keyword: '',
      musics: [] as Array<Music>,
      total: 0,
      pageSize: 30,
      currentPage: 1,
    };
  },
  computed: {
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
            text: '播放',
          },
        ],
        type: 'searchList',
        xy: {
          x: 0,
          y: 0,
        },
      };
    },
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
          isFavor: false,
          src: '',
          // artist: (song.artists as Array<any>).reduce((total, artist) => {
          //   return total + ' ' + artist.name;
          // }),//todo 优雅地显示歌手
          artist: (song.artists as any[])
            .map(artist => {
              return artist.name;
            })
            .join(', '),
          album: song.album.name,
          type: MusicType.CLOUD,
          duration: song.duration,
          title: song.name,
          fee: song.fee == 1,
        };
        music.isFavor = findMusic(music, this.$store.getters.favorList) != -1;
        if (music.isFavor) console.log('favored', music.title);
        this.musics.push(music);
      });
    },
    /**关于table的回调 */
    play(music: Music) {
      console.log('play at searchInfo', music);
      this.$store.commit('addMusicsToPlaylist', [music]);
    },
    favor(music: Music) {
      music.isFavor = !music.isFavor;
      console.log('favor', music);

      // this.$store.state.favorList.push(music);
      const payload: MusicListPayload = {
        act: SubmitType.ADD,
        music: music,
        name: this.$store.state.musicLists[0].name,
      };
      if (music.isFavor == false) {
        payload.act = SubmitType.REMOVE;
      }
      this.$store.dispatch('modifyMusicList', payload);
    },
    menu(index: number, e: MouseEvent) {
      /**唤起菜单 */
      console.log('menu', this.musics[index]);
      this.$set(this.menuOption, 'xy', { x: e.x, y: e.y });
      this.$set(this.menuOption, 'target', index);
      bus.$emit('showMenu', JSON.parse(JSON.stringify(this.menuOption))); //拷贝对象，防止关联
    },
    dealMenu(index, listIndex: number, subIndex: number) {
      console.log('dealMenu', index, this.musics[listIndex], subIndex);

      switch (index) {
        case 0:
          /**如果是第一个，favor*/
          if (subIndex == 0) {
            // music.isFavor = true; //直接更新对象属性无法即时作用于视图，因此将target改为index
            this.$set(this.musics[listIndex], 'isFavor', true);
          }
          /**添加到歌单...*/
          this.addMusic(
            this.musics[listIndex],
            this.$store.state.musicLists[subIndex].lid
          );
          break;
        case 1:
          /**播放 */
          this.play(this.musics[listIndex]);
          break;
      }
    },
    addMusic(music: Music, index: number) {
      const payload: MusicListPayload = {
        act: SubmitType.ADD,
        music: music,
        lid: index
      };
      this.$store.dispatch('modifyMusicList', payload);
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
  beforeDestroy() {
    /**
     * ? event bus的坑，必须要$off
     */
    bus.$off('searchListReply', this.dealMenu);
  },
  components: {
    musicTable: () => import('components/musicTable.vue'),
  },
});
