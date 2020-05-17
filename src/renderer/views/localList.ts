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
import { MenuOption } from '../utils/options/menuOption';
import { shell } from 'electron';

/**已知缺陷
 * 搜索性能略低，且结果不稳定
 */

export default Vue.extend({
  data() {
    return {
      musics: [] as Array<Music>,
      menuOption: {
        menuItems: [
          {
            index: 0,
            text: '添加到歌单',
          },
          {
            index: 1,
            text: '打开文件所在位置',
          },
        ],
        type: 'localList',
        target: '',
        xy: {
          x: 0,
          y: 0,
        },
      } as MenuOption,
      filter: '',
      showSearch: false,
    };
  },
  computed: {
    hasMusic(): boolean {
      return this.musics && this.musics.length > 0;
    },
    getAllPaths(): Array<string> {
      /**测试 */
      // return this.$store.getters.getAllPaths.concat('D:\\MyMusic\\网易云音乐');
      return this.$store.getters.getAllPaths;
    },
    filtedMusics(): Array<Music> {
      if (this.filter == '') {
        return this.musics;
      }
      return this.musics.filter(music => {
        const result = music.title?.search(this.filter);
        if (result && result > -1) {
          return true;
        }
        // result = music.album?.search(this.filter);
        // if (result && result > -1) {
        //   return true;
        // }
        // result = music.artist?.search(this.filter);
        // if (result && result > -1) {
        //   return true;
        // }
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
      if(music.isFavor==false) {
        payload.act = SubmitType.REMOVE
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
    dealMenu(index, music: Music) {
      switch (index) {
        case 0:
          /**添加到歌单
           * todo 待开发
           */
          break;
        case 1:
          /**打开文件位置 */
          shell.showItemInFolder(music.src);
          break;
      }
    },
    /**跳转到设置页面设置本地路径 */
    toSetLocalFiles() {
      this.$router.push('setting/base').catch(err => {
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
    if (this.getAllPaths[0].length > 0) {
      this.refresh();
    }
  },

  components: {
    musicTable: () => import('components/musicTable.vue'),
  },
});
