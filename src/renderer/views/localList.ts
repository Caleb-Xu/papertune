import Vue from 'vue';
import { Music, MusicType, findMusic } from 'utils/music';
import { isLocalMusic, readLocalMusicInfo } from 'utils/musicFile';
import fs from 'fs';
import bus from '../bus';

export default Vue.extend({
  data() {
    return {
      musics: [] as Array<Music>,
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
  },
  methods: {
    /**跳转到设置页面设置本地路径 */
    toSetLocalFiles() {
      this.$router.push('setting/base');
    },
    /**获取数据库 */
    getFilesDB(): Promise<IDBDatabase> {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open('papertune-local-files');
        request.onerror = e => {
          reject(e);
        };
        request.onsuccess = () => {
          resolve(request.result);
        };
        request.onupgradeneeded = e => {
          const db = (e.target as IDBOpenDBRequest).result;
        };
      });
    },
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
            if (findMusic(music, this.$store.state.favorList) > -1) {
              music.isFavor = true;
            }
            // console.log('music:', music);
            this.musics.push(music);
          });
        });
      });
    },
  },
  created() {
    /**确保拿到了路径数据再进行解析 */
    bus.$on('getted-paths', this.loadLocalMusicFiles);
    // this.loadLocalMusicFiles();
  },
  mounted() {
    //
  },
  components:{
    musicTable: ()=> import('components/musicTable.vue')
  }
});
