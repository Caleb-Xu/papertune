import Vue from 'vue';
import { mapState } from 'vuex';
import { MenuOption, MenuItem } from '@/renderer/utils/options/menuOption';
import bus from '@/renderer/bus.ts';
import { MusicList } from '../utils/music';
import { getCookie } from '../utils/tools';

enum LIST_INDEX {
  NONE = -2,
  LOCAL = -1,
  FAVOR = 0,
}

export default Vue.extend({
  data() {
    return {
      activeList: LIST_INDEX.NONE, //活跃歌单
      activeMenu: LIST_INDEX.NONE,
      LIST_INDEX, //预定义目录
      adding: false, //是否正在新建歌单
      editListName: '',
      editing: false, //是否正在编辑歌单
      editListError: false, //编辑的歌单名是否会报错
      newListName: '',
      newListError: false, //新的歌单名是否会报错
      errorMessage: '',
    };
  },
  computed: {
    ...mapState(['isOnline', 'isLogin', 'account']),
    netActive(): boolean {
      return this.$store.getters.netActive;
    },
    userInfo(): any {
      return {
        uid: this.account.uid,
        name: this.account.name,
        avatar: this.account.avatar || this._config.DEFAULT_BOY_AVATAR,
      };
    },
    musicLists(): Array<MusicList> {
      return this.$store.state.musicLists;
    },
    getUserAvatar(): string {
      return '';
    },
    /**新建菜单名 */
    computedNewListName(): string {
      return '新建歌单' + this.getNewLid;
    },
    /**获取新的lid */
    getNewLid(): number {
      /**
       * 根据现有的歌单lid最大者计算得出
       * 没有经过indexedDB，可能不太严谨
       */
      return -1;
    },
    getMusicListMenuItems(): Array<MenuItem> {
      const _this = this;
      return [
        {
          index: 0,
          text: '播放歌单',
          icon: 'icon-play',
        },
        {
          index: 1,
          text: '重命名',
          icon: 'icon-edit',
          hidden: _this.activeMenu == LIST_INDEX.FAVOR, //“我喜欢”歌单不能重命名
        },
        {
          index: 2,
          text: '删除歌单',
          icon: 'icon-delete',
          hidden: _this.activeMenu == LIST_INDEX.FAVOR, //“我喜欢”歌单不能删除
        },
        {
          index: 3,
          text: '下载歌单',
          icon: 'icon-icondownload',
          hidden: _this._config.SINGLE, //单机版隐藏
          disbaled: !this.isOnline, //断网不可用
        },
      ];
    },
  },
  methods: {
    getMusicListMenuOption(lid: number, xy): MenuOption {
      const _this = this;
      return {
        type: 'sidebarMusicList',
        menuItems: _this.getMusicListMenuItems,
        target: lid,
        xy,
      };
    },
    /**页面跳转 */
    toPage(index: string): void {
      switch (index) {
        case 'account':
          /* 用户页 */
          this.$router.push({
            path: '/accountInfo',
            query: {
              uid: this.account.uid,
            },
          });
          break;
        case 'login':
          /* 登录页 */
          bus.$emit('showModal', { type: 'login' });
          bus.$once('login-reply', () => {
            //login
            console.log('login');
          });
          break;
        case 'reg':
          /**注册页 */
          break;
      }
    },
    /**打开【本地音乐】页面 */
    openLocalMusic(): void {
      // this.activeList = LIST_INDEX.LOCAL;
      this.$router.push('/localList').catch(err => {
        //
      });
      ///
    },
    /**打开【我的歌单】页面 */
    openMusicList(name: string): void {
      console.log('openMusicList', name);
      // this.activeList = index;
      this.$router.push({ path: '/musicList', query: { name: name } });
      // if (index == 0) {
      //   ///打开【我喜欢】
      // } else {
      //   //打开其他歌单
      // }
    },
    /**激活歌单菜单 */
    showListMenu(name, e: MouseEvent): void {
      const xy = {
        x: e.x,
        y: e.y,
      };
      bus.$emit('showMenu', this.getMusicListMenuOption(name, xy));
    },
    /**显示或隐藏新建歌单输入框 */
    toggleAddingMusicList(): void {
      this.adding = !this.adding;
      if (this.adding) {
        this.newListName = this.computedNewListName; //新的赋值
        const input: HTMLInputElement | null = this.$el.querySelector(
          'input#new-list-input'
        );
        this.$nextTick(() => input?.focus());
      }
    },
    /**保存新建歌单 */
    addedMusicList(): void {
      /*判断新的歌单名是否会重名 */
      if (
        this.musicLists.some(({ name }) => {
          return name == this.newListName;
        })
      ) {
        this.showTip('duplicate');
        return;
      }

      // this.toggleAddingMusicList();
      const newList: MusicList = {
        lid: this.getNewLid,
        name: this.newListName,
        uid: +getCookie('uid'),
      };
      this.toggleAddingMusicList();
      this.musicLists.push(newList);
      ///
    },
    /**保存编辑歌单 */
    editedMusicList() {
      ///
    },
    toggleEditingMusicList() {
      ///
    },
    /**显示提示 */
    showTip(keyword: string): void {
      console.log('showTip');
      const delay = 3000;
      this.newListError = true;
      switch (keyword) {
        case 'duplicate':
          this.errorMessage = '歌单名重复！';
          break;
      }
    },
    /**菜单回调
     * @param index 菜单目录
     * @param lid 作用目标
     */
    menuReply(index: number, name) {
      console.log('reply', index, name);
      let indexInList; //列表中的对应下标
      for (let i = 0; i < this.musicLists.length; i++) {
        if (this.musicLists[i].name == name) {
          indexInList = i;
          break;
        }
      }
      switch (index) {
        case 0:
          break; //播放歌单
        case 1:
          break; //重命名
        case 2:
          this.musicLists.splice(indexInList, 1);
          //todo 数据库同步
          ///
          break; //删除歌单
        case 3:
          break; //下载歌单
      }
    },
    /**测试函数 */
    test(info) {
      console.log(info);
    },
  },
  created() {
    bus.$on('sidebarMusicListReply', this.menuReply);
  },
  components: {
    tip: () => import('components/tip.vue'),
  },
});
