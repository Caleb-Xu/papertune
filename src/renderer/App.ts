import Vue from 'vue';
import { mapMutations, mapState } from 'vuex';
import { Account } from 'utils/account';
import {
  MusicList,
  MusicListIndex,
  Music,
  PlayList,
  PlayMode,
} from 'utils/music';
import { setSkin } from 'utils/setSkin';
import bus from './bus';

export default Vue.extend({
  data() {
    return {};
  },
  computed: {
    ...mapState(['isOnline']),
  },
  methods: {
    ...mapMutations(['setOnline', 'setAccount', 'setIndexs', 'setPlayList']),
    needSync(uid): boolean {
      // console.log('uid =', this.$store.state.account?.uid);
      return this.isOnline && !this._config.SINGLE && uid != 0;
    },
    /**从本地存储（indexDB与localStorage）初始化数据
     * * 关键函数
     */
    initData(): void {
      if (!localStorage.getItem('OPEN_TIME')) {
        bus.$emit('showModal', { type: 'first-open' });
      }
      localStorage.setItem('OPEN_TIME', Date.now() + '');
      /**判断是否为单机模式 */
      const single = localStorage.getItem('SINGLE');
      if (single != undefined) {
        this._config.SINGLE = JSON.parse(single);
      } else {
        /**如果没有设置，则配置默认项 */
        localStorage.setItem('SINGLE', JSON.stringify(this._config.SINGLE));
      }
      this.setOnline(navigator.onLine);
      /**设置主题 */
      const theme = localStorage.getItem('THEME');
      if (theme) {
        setSkin(theme);
      }
      /**获取本地文件夹路径组 */
      const paths = localStorage.getItem('LOCAL_PATHS');
      if (paths) {
        this.$store.state.localPaths = JSON.parse(paths);
      }
      /**单机模式登录本地账号，跳过以下操作 */
      if (this._config.SINGLE == true) {
        this.loadIDB(0);
        return;
      }
      /**在非单机模式读取登录信息 */
      const uid = localStorage.getItem('UID');
      if (uid != null) {
        this.loadIDB(JSON.parse(uid));
      } else {
        this.loadIDB(0);
      }
      /**获取下载路径 */
      const path = localStorage.getItem('DOWNLOAD_PATH');
      if (path) {
        this.$store.state.downloadPath = path;
      } else {
        this.$store.state.downloadPath = this._config.DEFAULT_DOWNLOAD_PATH;
        localStorage.setItem(
          'DOWNLOAD_PATH',
          this._config.DEFAULT_DOWNLOAD_PATH
        );
      }
    },
    /**从indexedDB读取用户信息,如果是非本地账号，与云端比较版本
     * * 关键函数
     */
    loadIDB(uid: number) {
      //
      console.log('load account', uid);
      const DBrequest = indexedDB.open('papertune');
      let db: IDBDatabase;
      /**用于判定是否触发了升级（即初始化）事件 */
      let upgraded = false;

      DBrequest.onerror = e => {
        console.warn('open database error', e);
        return;
      };
      /**创建/更新数据库，本程序下只会在第一次打开时执行
       * 初始化account表，本地账号歌单表，播放队列表
       */
      DBrequest.onupgradeneeded = e => {
        const db = (e.target as IDBOpenDBRequest).result;
        this.initIDB(db);
        upgraded = true;
        /**
         * ? 插入跳转欢迎界面指令
         */
      };

      /**在经历过初始化的情况下插入初始数据 */
      DBrequest.onsuccess = () => {
        db = DBrequest.result;
        console.log('IDB success! vision =', db.version);
        if (upgraded) {
          this.initAccountData(db);
        }
        /**在联网非单机，又不是本地账号，比较账号数据版本 */
        if (this.needSync(uid)) {
          this.syncDB(db, uid);
        } else {
          /**不比较，直接用 */
          this.getAccountData(db, uid);
          this.getPlayList(db);
        }
      };
    },
    /**初始化数据库 */
    initIDB(db: IDBDatabase) {
      if (!db.objectStoreNames.contains('ACCOUNT')) {
        db.createObjectStore('ACCOUNT', { keyPath: 'uid' });

        db.createObjectStore('MUSIC_LIST', {
          keyPath: ['lid', 'uid'],
        }).createIndex('name', 'name');

        db.createObjectStore('PLAY_LIST', { autoIncrement: true });
      }
      console.info('IDB upgradeneeded finish!');
    },
    /**插入用户数据，并完成初始化 */
    // ? 修改成用户注册通用的方法，如果是本地用户，则初始化播放列表，否则跳过
    initAccountData(db: IDBDatabase, account?: Account | null) {
      const LOCAL_ACCOUNT: Account = {
        uid: 0,
        name: 'LOCAL',
        updateTime: Date.now(),
      };
      db
        .transaction('ACCOUNT', 'readwrite')
        .objectStore('ACCOUNT')
        .add(account || LOCAL_ACCOUNT).onerror = e => {
        console.warn('add account error', e);
      };
      const FAVOR: MusicList = {
        lid: 0,
        name: account ? account.name + '的喜欢' : '我喜欢',
        list: [] as Array<Music>,
        uid: account?.uid || 0,
      };
      db
        .transaction('MUSIC_LIST', 'readwrite')
        .objectStore('MUSIC_LIST')
        .add(FAVOR).onerror = e => {
        console.warn('add musicList error', e);
      };
      if (!account) {
        const ONE_PLAY_LIST: PlayList = {
          queue: [] as Array<Music>,
          mode: PlayMode.ORDER,
          // current: null,
          currentIndex: -1,
          playing: false,
          vol: 0.5,
          playHistory: [],
        };
        db
          .transaction('PLAY_LIST', 'readwrite')
          .objectStore('PLAY_LIST')
          .add(ONE_PLAY_LIST).onerror = e => {
          console.warn('add playList error', e);
        };
      }
      console.info('IDB init local data finish!');
    },
    /**获取用户信息 */
    getAccountData(db: IDBDatabase, uid: number) {
      const store = db
        .transaction('PLAY_LIST', 'readonly')
        .objectStore('PLAY_LIST');
      const indexs = [] as Array<MusicListIndex>;
      store.openCursor().onsuccess = e => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue | null>)
          .result;
        if (cursor) {
          if (cursor.value.uid == uid) {
            //
            indexs.push({
              lid: cursor.value.lid,
              name: cursor.value.name,
            });
            console.info('load list', cursor.value.name);
          }
          cursor.continue();
        } else {
          /**加载完毕，载入到vuex */
          this.setIndexs(indexs);
          console.info('load list finish');
        }
      };
      const request = db
        .transaction('ACCOUNT', 'readonly')
        .objectStore('ACCOUNT')
        .get(uid);
      request.onerror = e => {
        console.warn('get account error', e);
      };
      request.onsuccess = e => {
        console.log('get account', request.result);
        this.setAccount(request.result);
      };
    },
    /**获取播放列表 */
    getPlayList(db: IDBDatabase) {
      //
      const request = db
        .transaction('PLAY_LIST', 'readonly')
        .objectStore('PLAY_LIST')
        .get(1);
      request.onerror = e => {
        console.warn('get PLAY_LIST error', e);
      };
      request.onsuccess = e => {
        this.setPlayList(request.result);
        console.log('get playList', request.result);
      };
    },
    /**检查版本
     * * 关键函数
     */
    checkDBVersion(db: IDBDatabase, uid: number): Promise<string> {
      return new Promise((resolve, reject) => {
        if (uid == 0) {
          reject('local account do not check version. uid = ' + uid);
        } else {
          const request = db
            .transaction('ACCOUNT', 'readonly')
            .objectStore('ACCOUNT')
            .get(uid);
          request.onerror = () => {
            console.warn('get Version error', uid);
            resolve('none');
          };
          request.onsuccess = () => {
            /**向服务器获取版本信息 */
            this._http
              .get(this._config.SERVER_HOST + 'client/getVersion?uid=' + uid)
              .then(resp => {
                if (typeof resp.data == 'number') {
                  const result = resp.data - request.result.updateTime;
                  if (result > 0) {
                    resolve('server');
                  } else if (result < 0) {
                    resolve('local');
                  } else {
                    resolve('none');
                  }
                } else {
                  console.warn('invalid data', resp.data);
                }
              })
              .catch(() => {
                /**临时数据 */
                console.warn('服务器未部署！');
                resolve('none');
              });
          };
        }
      });
    },
    /**获取本地IndexedDB的db对象
     * 初始化要使用initIDB，这个函数只能简单地获取db
     */
    getDB(dbName = 'papertune'): Promise<IDBDatabase> {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);
        request.onerror = e => {
          reject(e);
        };
        request.onsuccess = () => {
          resolve(request.result);
        };
      });
    },
    /**保存数据至indexedDB */
    saveIndexedDB(): void {
      ///
    },
    /**将数据从IndexedDB上传至服务器 */
    updateServerDB(db): Promise<any> {
      return new Promise((resolve, reject) => {
        reject('还没写好');
      });
    },
    /**从服务器获取数据到IndexedDB */
    loadServerDB(db): Promise<any> {
      return new Promise((resolve, reject) => {
        reject('还没写好');
      });
    },
    syncDB(db: IDBDatabase, uid: number): Promise<any> {
      return new Promise((reject, resolve) => {
        this.checkDBVersion(db, uid)
          .then(result => {
            switch (result) {
              case 'server':
                /**服务器领先 */
                this.loadServerDB(db).then(() => {
                  resolve();
                });
                break;
              case 'local':
                /**本地领先 */
                this.updateServerDB(db).then(() => {
                  resolve();
                }); //更新服务器上的数据
                break;
              case 'none':
                /**版本一致 */
                break;
            }
          })
          .catch(err => {
            console.warn(err);
            reject(err);
          });
      });
    },
    /**监听键盘 */
    keyup(e: KeyboardEvent) {
      let node;
      switch (e.keyCode) {
        /**esc键，回车键，使表单元素失去焦点 */
        case 27:
        case 13:
          node = document.activeElement;
          if (node && node.constructor.name == 'HTMLInputElement') {
            node.blur();
          }
          break;
      }
    },
  },
  async created() {
    //判断是否联网
    const online = window.navigator.onLine && !this._config.SINGLE;
    this.setOnline(online);
    /**从localStorage与IndexedDB初始化数据到vuex */
    this.initData();
    /**如果是使用音乐文件打开的,直接播放 */
    const arg = require('electron').remote.process.argv0;

    if (/\.(mp3)|(wav)$/.test(arg)) {
      ///
      // console.log(arg);
    }
  },
  mounted() {
    console.log('mounted');
    /**监听全局键盘 */
    document.onkeyup = this.keyup;
  },
  /**退出前检查并同步（一般不需要） */
  beforeDestroy() {
    if (this.needSync(this.$store.state.account.uid)) {
      this.getDB().then(db => {
        this.syncDB(db, this.$store.state.account.uid);
      });
    }
  },
  components: {
    topNav: () => import('components/topNav.vue'),
    sidebar: () => import('components/sidebar.vue'),
    player: () => import('components/player.vue'),
    myMenu: () => import('components/menu.vue'), //menu标签已存在
    modals: () => import('components/modals.vue'),
  },
});
