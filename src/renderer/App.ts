import { MusicFileInfo } from './utils/music';
import Vue from 'vue';
import { mapMutations, mapState } from 'vuex';
import { Account } from 'utils/account';
import { MusicList, Music, PlayList, PlayMode, MusicType } from 'utils/music';
import { isLocalMusic, readLocalMusicInfo } from 'utils/musicFile';
import { setSkin } from 'utils/setSkin';
import bus from './bus';
import fs from 'fs';
import { ipcRenderer } from 'electron';
import test from 'utils/test';
import { getCookie, getDB } from './utils/tools';

export default Vue.extend({
  data() {
    return {
      firstOpen: false,
    };
  },
  computed: {
    ...mapState(['isOnline']),
    /**合并本地路径与下载路径 */
    getAllPaths(): Array<string> {
      return this.$store.getters.getAllPaths;
    },
  },
  methods: {
    getDB,
    /**初始化数据（轻量级）
     * * 关键函数
     */
    initCreated(): void {
      /**第一次打开有欢迎显示,延迟执行确保可以正确初始化 */
      if (!localStorage.getItem('NOTICE_TIME')) {
        this.firstOpen = true;
        setTimeout(() => {
          bus.$emit('showModal', { type: 'first-open' });
        }, 1000);
        localStorage.setItem('NOTICE_TIME', '0');
      }
      /**检查公告 */
      this.checkNotice();
      /**判断是否为单机模式 */
      const single = localStorage.getItem('SINGLE');
      if (single != undefined) {
        this._config.SINGLE = JSON.parse(single);
      } else {
        /**如果没有设置，则配置默认项 */
        localStorage.setItem('SINGLE', JSON.stringify(this._config.SINGLE));
      }
      /**设置主题 */
      const theme = localStorage.getItem('THEME');
      if (theme) {
        setSkin(theme);
      }
    },
    /**
     * 初始化数据（重量级）
     * * 关节函数
     */
    async initMounted() {
      /**获取本地文件夹路径组 */
      const paths = localStorage.getItem('LOCAL_PATHS');
      if (paths) {
        this.$store.state.localPaths = JSON.parse(paths);
      }
      if (this._config.SINGLE == false) {
        /**获取下载路径 */
        const downPath = localStorage.getItem('DOWNLOAD_PATH');
        if (downPath) {
          this.$store.state.downloadPath = downPath;
        } else {
          this.$store.state.downloadPath = this._config.DEFAULT_DOWNLOAD_PATH;
          localStorage.setItem(
            'DOWNLOAD_PATH',
            this._config.DEFAULT_DOWNLOAD_PATH
          );
        }
      }
      bus.$emit('getted-paths');

      const db = await this.loadIDB(0);
      /**第一次打开时初始化本地文件目录 */
      if (this.firstOpen) {
        this.createPlayListDB(db);
      }

      this.getPlayList(db);
    },
    createPlayListDB(db: IDBDatabase): Promise<void> {
      return new Promise((resolve, reject) => {
        const ONE_PLAY_LIST: PlayList = {
          queue: [] as Array<Music>,
          mode: PlayMode.ORDER,
          // current: null,
          currentIndex: -1,
          playing: false,
          vol: 0.5,
          playHistory: [],
        };
        const request = db
          .transaction('PLAY_LIST', 'readwrite')
          .objectStore('PLAY_LIST')
          .add(ONE_PLAY_LIST);
        request.onerror = e => {
          console.warn('add playList error', e);
          reject();
        };
        request.onsuccess = () => resolve();
      });
    },
    /**从indexedDB读取用户信息,如果是非本地账号，与云端比较版本
     * * 关键函数
     */
    loadIDB(uid: number): Promise<IDBDatabase> {
      return new Promise((resolve, reject) => {
        console.log('load account', uid);
        const DBrequest = indexedDB.open('papertune');
        let db: IDBDatabase;

        DBrequest.onerror = e => {
          console.warn('open database error', e);
          reject();
        };
        /**创建/更新数据库，本程序下只会在第一次打开时执行
         * 初始化account表，本地账号歌单表，播放队列表
         */
        DBrequest.onupgradeneeded = e => {
          console.log('idb upgrading ...');
          const db = (e.target as IDBOpenDBRequest).result;
          /**这个一个同步函数 */
          this.initIDB(db);
        };

        /**在经历过初始化的情况下插入初始数据 */
        DBrequest.onsuccess = async () => {
          db = DBrequest.result;
          console.log('IDB success! vision =', db.version);
          if (this.firstOpen) {
            await this.initAccountData(db);
          }
          await this.getAccountData(db, uid);
          console.info('loadIDB finish');
          resolve(db);
        };
      });
      //
    },
    /**初始化数据库,upgrade过程中似乎无法插入数据 */
    initIDB(db: IDBDatabase) {
      if (!db.objectStoreNames.contains('ACCOUNT')) {
        db.createObjectStore('ACCOUNT', { keyPath: 'uid' });

        db.createObjectStore('MUSIC_LIST', {
          keyPath: ['lid', 'uid'], //使用name
          // keyPath: ['name', 'uid'],
        }); /* .createIndex('name', 'name'); */

        db.createObjectStore('PLAY_LIST', { autoIncrement: true });
      }
      console.info('IDB upgradeneeded finish!');
    },
    /**插入用户数据，并完成初始化 */
    // ? 修改成用户注册通用的方法，如果是本地用户，则初始化播放列表，否则跳过
    initAccountData(db: IDBDatabase, account?: Account | null): Promise<void> {
      return new Promise((resolve, reject) => {
        const LOCAL_ACCOUNT: Account = {
          uid: 0,
          name: '本地账号',
          updateTime: Date.now(),
        };
        let request = db
          .transaction('ACCOUNT', 'readwrite')
          .objectStore('ACCOUNT')
          .add(account || LOCAL_ACCOUNT);
        request.onerror = e => {
          console.warn('add account error', e);
          reject();
        };
        request.onsuccess = () => {
          const FAVOR: MusicList = {
            lid: 0,

            name: account ? account.name + '的喜欢' : '我喜欢',
            list: [] as Array<Music>,
            uid: account?.uid || 0,
          };
          request = db
            .transaction('MUSIC_LIST', 'readwrite')
            .objectStore('MUSIC_LIST')
            .add(FAVOR);

          request.onerror = e => {
            console.warn('add musicList error', e);
            reject();
          };
          request.onsuccess = () => {
            console.info('IDB init local data finish!');
            resolve();
          };
        };
      });
    },
    /**获取用户信息 */
    getAccountData(
      db: IDBDatabase,
      uid: number,
      account?: Account
    ): Promise<void> {
      return new Promise((resolve, reject) => {
        console.info('getAccountData...', uid);
        const request = db
          .transaction('ACCOUNT', 'readonly')
          .objectStore('ACCOUNT')
          .get(uid);
        request.onerror = e => {
          console.warn('get account error', e);
          reject();
        };
        request.onsuccess = e => {
          console.log('get account', request.result);
          this.$store.commit('setAccount', request.result);
          if (request.result.uid > 0) {
            this.$store.state.isLogin = true;
          } else {
            this.$store.state.isLogin = false;
          }
          const store = db
            .transaction('MUSIC_LIST', 'readonly')
            .objectStore('MUSIC_LIST');
          const lists = [] as Array<MusicList>;
          store.openCursor().onsuccess = e => {
            const cursor = (e.target as IDBRequest<IDBCursorWithValue | null>)
              .result;
            if (cursor) {
              if (cursor.value.uid == uid) {
                lists.push(cursor.value);
                console.info('load list', cursor.value.name);
              }
              cursor.continue();
            } else {
              /**没有拿到时新建数据再拿 */
              if (lists.length == 0) {
                this.initAccountData(db, account)
                  .then(() => this.getAccountData(db, uid))
                  .then(resolve);
                return;
              } else {
                /**加载完毕，载入到vuex */
                this.$store.commit(
                  'setMusicLists',
                  /**歌曲通过lid排序，避免各种bug */
                  lists.sort((a, b) => {
                    if (a.lid && b.lid) {
                      return a?.lid - b?.lid;
                    } else return 1;
                  })
                );
                console.info('load list finish');
                resolve();
              }
            }
          };
        };
      });
    },
    /**获取播放列表 */
    getPlayList(db: IDBDatabase) {
      //
      console.info('getting playList...');
      return new Promise((resolve, reject) => {
        const request = db
          .transaction('PLAY_LIST', 'readonly')
          .objectStore('PLAY_LIST')
          .get(1);
        request.onerror = e => {
          console.warn('get PLAY_LIST error', e);
        };
        request.onsuccess = e => {
          console.log('PLAY_LIST.get(1) is', request.result);
          this.$store.commit('setPlayList', request.result);
          console.log('get playList finish', request.result);
          /**解析启动参数 */
          this.getMusicArg().then(() => {
            resolve();
          });
        };
      });
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
            // this._http
            //   .get('http://localhost:4396/client/getVersion?uid=' + uid)
            //   .then(resp => {
            //     if (typeof resp.data == 'number') {
            //       const result = resp.data - request.result.updateTime;
            //       if (result > 0) {
            //         resolve('server');
            //       } else if (result < 0) {
            //         resolve('local');
            //       } else {
            //         resolve('none');
            //       }
            //     } else {
            //       console.warn('invalid data', resp.data);
            //       resolve('none');
            //     }
            //   })
            //   .catch(e => {
            //     /**临时数据 */
            //     console.warn(
            //       'http://localhost:4396/client/getVersion尚在施工中！'
            //     );
            //     resolve('none');
            //   });

            resolve('none');
          };
        }
      });
    },
    /**获取启动时的命令参数 */
    async getMusicArg() {
      /**如果是使用音乐文件打开的,直接播放 */
      const args = require('electron').remote.process.argv;
      console.info('process.argv = ', args);
      const arg = args.filter(arg => {
        return isLocalMusic(arg);
      })[0];

      /**没有符合要求的参数时不执行下方操作 */
      // if (!arg) {
      //   setTimeout(
      //     () => (this.$store.getters.getPlayList.playing = false),
      //     100
      //   );
      //   return;
      // }

      const exists = fs.existsSync(arg);

      console.log(arg, exists);

      if (exists) {
        const info: MusicFileInfo = await readLocalMusicInfo(arg);
        const music: Music = {
          src: arg,
          id: 0,
          type: MusicType.LOCAL,
          isFavor: false,
          ...info,
        };
        this.$store.commit('addMusicsAndPlay', [music]);
        // this.$store.getters.getPlayList.playing = true;
        console.log('正在播放', arg);
      } else {
        console.warn('音乐文件不存在！');
      }
    },
    // /**初始化本地文件库 */
    // createPathsDB() {
    //   console.log('create path DB...');
    //   const request = indexedDB.open('papertune-local-files');
    //   let db: IDBDatabase;
    //   request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
    //     db = (e.target as IDBRequest).result;
    //     const paths = this.getAllPaths;
    //     paths.forEach(path => {
    //       db.createObjectStore(JSON.stringify(path), { keyPath: 'src' });
    //     });
    //     console.log('create path db onupgraded!');
    //   };
    //   request.onsuccess = () => {
    //     console.info('create paths db success!');
    //   };
    //   request.onerror = err => {
    //     console.warn('create paths db error', err);
    //   };
    // },
    /**检查公告 */
    checkNotice(): void {
      if (!this.$store.state.netActive) return;
      const time = localStorage.getItem('NOTICE_TIME');
      console.log('checkNotice...', time);
      this._http
        .get('http://localhost:4396/client/getNotice?time=' + time)
        .then(resp => {
          console.log(resp.data);

          // const notice: Notice = resp.data;
          setTimeout(() => {
            bus.$emit('showModal', {
              type: 'notice',
              info: resp.data,
            });
            localStorage.setItem('NOTICE_TIME', Date.now() + '');
          }, 1000);
        })
        .catch(error => {
          // console.warn('/api/checkNotice正在搭建中');
          if (error.response) {
            if (error.response.status == 600) {
              console.warn(error.response.data.msg);
            }
          } else {
            console.log('Error', error.message);
          }
        });
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
    syncDB(db: IDBDatabase, uid: number): Promise<void> {
      return new Promise((reject, resolve) => {
        this.checkDBVersion(db, uid)
          .then(result => {
            console.log('checkResult:', result);
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
              default:
                console.info('none');

                break;
            }
            /**版本一致 */
            resolve();
          })
          .catch(err => {
            console.warn(err);
            reject(err);
          });
      });
    },
    saveAcount(db: IDBDatabase, uid: number): Promise<void> {
      return new Promise(resolve => {
        console.log('saveAccount', db, uid);
        const request = db
          .transaction('ACCOUNT', 'readwrite')
          .objectStore('ACCOUNT')
          .put(this.$store.state.account);
        request.onsuccess = () => {
          console.info('account saved');
          resolve();
        };
      });
    },
    savePlayList(db: IDBDatabase): Promise<void> {
      const request = db
        .transaction('PLAY_LIST', 'readwrite')
        .objectStore('PLAY_LIST')
        .put(this.$store.getters.getPlayList, 1);
      return new Promise((resolve, reject) => {
        request.onerror = err => {
          console.warn('save playList err', err);
          reject();
        };
        request.onsuccess = () => {
          console.info('save playList success');
          resolve();
        };
      });
    },
    saveMusicLists(db: IDBDatabase): Promise<void> {
      console.info('saveMusicLists...');
      function saveMusicList(musiclist: MusicList): Promise<void> {
        return new Promise((resolve, reject) => {
          const request = db
            .transaction('MUSIC_LIST', 'readwrite')
            .objectStore('MUSIC_LIST')
            .clear();
          request.onsuccess = () => {
            const request = db
              .transaction('MUSIC_LIST', 'readwrite')
              .objectStore('MUSIC_LIST')
              .put(musiclist);

            request.onerror = err => {
              console.warn('save playList err', err);
              reject();
            };
            request.onsuccess = () => {
              resolve();
            };
          };
        });
      }
      return new Promise((resolve, reject) => {
        const count = this.$store.state.musicLists.length;
        if (count == 0) {
          console.warn('no musiclists', this.$store.state.musicLists);
          reject();
        }
        (this.$store.state.musicLists as Array<MusicList>).forEach(
          async musicList => {
            await saveMusicList(musicList);
          }
        );
        console.info('saveMusicLists finish!');
        resolve();
      });
    },
    async saveIDB(): Promise<void> {
      const db: IDBDatabase = await this.getDB();
      if (this.$store.getters.netActive) {
        this.syncDB(db, this.$store.state.account.uid).catch(err => {
          /*  */
        });
        // console.log('saved');
      }
      await this.saveAcount(db, this.$store.state.account.uid);
      await this.savePlayList(db);
      await this.saveMusicLists(db);
      console.info('data all saved!');
      return;
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
  created() {
    this.initCreated();
    /**对应客户端内的退出选项 */
    bus.$on('quit', async () => {
      await this.saveIDB();
      ipcRenderer.send('quit');
    });
    /**对应托盘的退出选项 */
    ipcRenderer.on('b4Quit', async () => {
      await this.saveIDB();
      ipcRenderer.send('quit');
    });

    /**n分钟保存一次 */
    setTimeout(() => {
      setInterval(this.saveIDB, 1000 * 60 * 5);
    }, 1000 * 60 * 5);

    /**登录操作时启用 */
    bus.$on('initAccount', async data => {
      const account: Account = {
        uid: data.uid,
        name: data.name,
        updateTime: Date.now(),
      };
      const db: IDBDatabase = await this.getDB();
      this.getAccountData(db, data.uid, account);
      // this.initAccountData(db,account);
    });

    /** 测试模块 */
    test();
    // bus.$on('initAccount', resp.data);
  },
  mounted() {
    console.log('mounted');

    /**监听全局键盘 */
    document.onkeyup = this.keyup;
    /**初始化数据库
     * 异步操作，最后执行，避免程序卡死
     */
    this.initMounted();
  },
  components: {
    topNav: () => import('components/topNav.vue'),
    sidebar: () => import('components/sidebar.vue'),
    player: () => import('components/player.vue'),
    myMenu: () => import('components/menu.vue'), //menu标签已存在
    modals: () => import('components/modals.vue'),
    msg: () => import('components/common/msg.vue'),
    playList: () => import('components/playList.vue'),
  },
});
