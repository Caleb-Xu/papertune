import Vue from 'vue';
import {
  Music,
  MusicType,
  findMusic,
  MusicListPayload,
  SubmitType,
} from 'utils/music';
import { readLocalMusicInfo } from 'utils/musicFile';
import fs from 'fs';
import bus from '../bus';
import { MenuOption, MenuItem } from '../utils/options/menuOption';
import { shell } from 'electron';

/**已知缺陷
 * 搜索性能略低，且结果不稳定
 */

export default Vue.extend({
  data() {
    return {
      musics: [] as Array<Music>,
      filter: '',
      showSearch: false,
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
            text: '打开文件所在位置',
          },
          {
            index: 2,
            text: '播放',
          },
        ],
        type: 'localList',
        xy: {
          x: 0,
          y: 0,
        },
      };
    },
    hasMusic(): boolean {
      return this.musics && this.musics.length > 0;
    },
    getAllPaths(): Array<string> {
      // return this.$store.getters.getAllPaths;
      return this.$store.state.localPaths;
    },
    filtedMusics(): Array<Music> {
      if (this.filter == '') {
        return this.musics;
      }
      return this.musics.filter(music => {
        const result = music.title?.search(this.filter);
        if (result != undefined && result > -1) {
          return true;
        }
        return false;
      });
    },
  },
  methods: {
    playAll() {
      this.$store.commit('replaceMusicsToPlaylist', this.musics);
    },
    isFavor(music: Music): boolean {
      // return this.$store.commit('isFavor',music) ;
      return findMusic(music, this.$store.state.musicLists[0].list) != -1;
    },
    search() {
      this.showSearch = !this.showSearch;
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
      const music = this.musics[index];
      console.log('menu', music);
      this.$set(this.menuOption, 'xy', { x: e.x, y: e.y });
      this.$set(this.menuOption, 'target', index);
      bus.$emit('showMenu', this.menuOption);
    },
    dealMenu(index, listIndex: number, subIndex) {
      switch (index) {
        case 0:
          /**添加到歌单...*/
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
          /**打开文件位置 */
          shell.showItemInFolder(this.musics[listIndex].src);
          break;
        case 2:
          /**播放 */
          this.play(this.musics[listIndex]);
          break;
      }
    },
    addMusic(music: Music, index: number) {
      const payload: MusicListPayload = {
        act: SubmitType.ADD,
        music: music,
        lid: index,
      };
      this.$store.dispatch('modifyMusicList', payload);
    },
    /**跳转到设置页面设置本地路径 */
    toSetLocalFiles() {
      this.$router
        .push({
          path: '/setting',
          query: {
            tab: '0',
          },
        })
        .catch(err => {
          //
        });
    },
    // /**获取数据库 */
    // getFilesDB(): Promise<IDBDatabase> {
    //   return new Promise((resolve, reject) => {
    //     const request = indexedDB.open('papertune-local-files');
    //     request.onerror = e => {
    //       reject(e);
    //     };
    //     request.onsuccess = () => {
    //       resolve(request.result);
    //     };
    //     request.onupgradeneeded = e => {
    //       const db = (e.target as IDBOpenDBRequest).result;
    //     };
    //   });
    // },
    /**从路径读取音乐文件 */
    async loadLocalMusicFiles() {
      this.getAllPaths.forEach(path => {
        console.log('path:', path);
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
          console.warn('文件夹不存在，创建', path);
        }
        fs.readdir(path, (err, files) => {
          if (err) {
            console.warn('readdir err', err);
            return;
          }
          files.forEach(async file => {
            if (!/\.(mp3)|(wav)|(MP3)|(WAV)$/.test(file)) return;
            // console.log('file:',file);
            const info = await readLocalMusicInfo(path + '\\' + file);
            const music: Music = {
              id: 0,
              /**这个有点麻烦，要根据我喜欢的歌单进行对照 */
              isFavor: false,
              src: path + '\\' + file,
              type: MusicType.LOCAL,
              ...info,
            };
            /**检查是否包含在我喜欢中 */
            if (findMusic(music, this.$store.state.musicLists[0].list) > -1) {
              music.isFavor = true;
            }
            // console.log('music:', music);
            this.musics.push(music);
          });
        });
      });
    },
    refresh() {
      this.musics = [];
      this.loadLocalMusicFiles();
    },
  },
  created() {
    /**确保拿到了路径数据再进行解析 */
    bus.$on('getted-paths', this.refresh);
    bus.$on('localListReply', this.dealMenu);
    // this.loadLocalMusicFiles();
  },
  mounted() {
    if (this.getAllPaths.length > 0) {
      this.refresh();
    }
  },
  beforeDestroy() {
    bus.$off('getted-paths', this.refresh);
    bus.$off('localListReply', this.dealMenu);
  },
  components: {
    musicTable: () => import('components/musicTable.vue'),
  },
});
