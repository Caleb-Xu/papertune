import Vue from 'vue';
import { Music, MusicList, MusicListPayload, SubmitType } from '../utils/music';
import { getMusicPic } from '../utils/musicFile';
import bus from '../bus';
import { MenuOption, MenuItem } from '../utils/options/menuOption';

export default Vue.extend({
  data() {
    return {
      listName: '',
      lid: -1,
      pic: '',
      editingDesc: false,
      newDesc: '',
    };
  },
  computed: {
    bgStyle(): any {
      return {
        'background-image': `url(${JSON.stringify(
          this.pic || this._config.DEFAULT_MUSIC_PIC
        )})`,
      };
    },
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
            text: '从歌单移除',
          },
          {
            index: 2,
            text: '播放',
          },
        ],
        type: 'musicList',
        xy: {
          x: 0,
          y: 0,
        },
      };
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
    musicList(val) {
      if (!val.name) {
        this.$router.push('/');
        //
      }
    },
  },
  methods: {
    editDesc() {
      this.editingDesc = true;
      this.newDesc = this.musicList.description || '';
      this.$nextTick(() =>
        (this.$refs['desc-input'] as HTMLInputElement).focus()
      );
    },
    cancelEditDesc() {
      this.editingDesc = false;
    },
    editedDesc() {
      this.$set(this.musicList, 'description', this.newDesc);
      bus.$emit('showMsg', '修改歌单描述成功！');
      this.editingDesc = false;
    },
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
    menu(index: number, e: MouseEvent) {
      /**唤起菜单 */
      const music = this.listReverse[index];
      console.log('menu', music);
      this.$set(this.menuOption, 'xy', { x: e.x, y: e.y });
      this.$set(this.menuOption, 'target', index);
      bus.$emit('showMenu', this.menuOption);
    },
    playAll() {
      if (this.musicList.list.length > 0) {
        this.$store.commit('replaceMusicsToPlaylist', this.musicList.list);
        bus.$emit('showMsg', '正在播放 ' + this.musicList.name);
      } else {
        bus.$emit('showMsg', '当前歌单为空！');
      }
    },
    dealMenu(index, listIndex: number, subIndex: number) {
      console.log('dealMenu', index, listIndex, subIndex);
      const payload: MusicListPayload = {
        act: SubmitType.ADD,
        music: this.listReverse[listIndex],
      };
      switch (index) {
        case 0:
          /**添加到歌单...*/
          /**如果是第一个，favor*/
          if (subIndex == 0) {
            // music.isFavor = true; //直接更新对象属性无法即时作用于视图，因此将target改为index
            this.$set(this.listReverse[listIndex], 'isFavor', true);
          }
          payload.lid = this.$store.state.musicLists[subIndex].lid;
          this.$store.dispatch('modifyMusicList', payload);
          break;
        case 1:
          /**从歌单移除 */
          payload.act = SubmitType.REMOVE;
          payload.name = this.listName;
          this.$store.dispatch('modifyMusicList', payload);
          break;
        case 2:
          /**播放 */
          this.play(this.listReverse[listIndex]);
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
  beforeDestroy() {
    bus.$off('musicListReply', this.dealMenu);
  },
  components: {
    musicTable: () => import('components/musicTable.vue'),
  },
});
