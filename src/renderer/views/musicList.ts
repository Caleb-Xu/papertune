import Vue from 'vue';
import { getDB } from '../utils/tools';
import { Music, MusicList, MusicListPayload, SubmitType } from '../utils/music';
import { getMusicPic } from '../utils/musicFile';
import bus from '../bus';
import { MenuOption } from '../utils/options/menuOption';

export default Vue.extend({
  data() {
    return {
      listName: '',
      lid: -1,
      pic: '',
      menuOption: {
        menuItems: [
          {
            index: 0,
            text: '添加到歌单',
          },
          {
            index: 1,
            text: '从歌单移除',
          },
        ],
        type: 'musicList',
        target: '',
        xy: {
          x: 0,
          y: 0,
        },
      } as MenuOption,
    };
  },
  computed: {
    musicList(): MusicList {
      const musicLists = this.$store.state.musicLists as Array<MusicList>;
      for (let i = 0; i < musicLists.length; i++) {
        if (musicLists[i].name == this.listName) {
          console.info('get musiclist');
          return musicLists[i];
        }
      }
      console.warn('no musiclist');
      return {} as MusicList;
    },
    listReverse(): Array<Music> {
      return [...(this.musicList.list as Array<Music>)].reverse() || [];
    },
    length(): number {
      return this.musicList.list?.length || 0;
    },
  },
  watch: {
    '$route.query'(val) {
      if (val != 0) {
        const path = this.$route.path;
        this.$router.push('/').then(() => {
          this.$router.push({
            path,
            query: val,
          });
        });
      }
    },
    musicList(val){
      if(!val.name){
        this.$router.push('/');
        //
      }
    }
  },
  methods: {
    /**关于table的回调 */
    play(music: Music) {
      this.$store.commit('addMusicsToPlaylist', [music]);
      console.log('play', music);
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
    menu(music: Music, e: MouseEvent) {
      /**唤起菜单 */
      console.log('menu', music);
      this.$set(this.menuOption, 'xy', { x: e.x, y: e.y });
      this.$set(this.menuOption, 'target', music);
      bus.$emit('showMenu', this.menuOption);
    },
    playAll() {
      this.$store.commit('replaceMusicsToPlaylist', this.musicList.list);
      bus.$emit('showMsg', '正在播放 ' + this.musicList.name);
    },
    dealMenu(index, music: Music) {
      const payload: MusicListPayload = {
        act: SubmitType.ADD,
        music: music,
        name: this.$store.state.musicLists[0].name,
      };
      switch (index) {
        case 0:
          /**添加到歌单
           * todo 待开发
           */
          break;
        case 1:
          /**从歌单移除 */
          this.play(music);
          payload.act = SubmitType.REMOVE;

          this.$store.dispatch('modifyMusicList', payload);
          break;
      }
    },
  },
  async created() {
    bus.$on('musicListReply', this.dealMenu);

    this.pic = this._config.DEFAULT_MUSIC_PIC;
    this.listName = this.$route.query.name as string;
    if (this.musicList?.list && this.musicList.list[0]) {
      this.pic =
        (await getMusicPic(
          this.musicList.list[this.musicList.list.length - 1]
        )) || this._config.DEFAULT_MUSIC_PIC;
    }
    // this.getList();
  },
  components: {
    musicTable: () => import('components/musicTable.vue'),
  },
});
