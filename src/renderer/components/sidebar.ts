import Vue from 'vue';
import { mapState } from 'vuex';
import MenuOption, { MenuItem } from '@/renderer/utils/options/menuOption';
import bus from '@/renderer/bus.ts';

enum LIST_INDEX {
  NONE = -2,
  LOCAL = -1,
  FAVOR = 0,
}

export default Vue.extend({
  data() {
    return {
      /**测试数据：用户信息 */
      userInfo: {
        uid: 1,
        //@ts-ignore
        avatar: this._config.DEFAULT_BOY_AVATAR,
        name: '风中逆行',
      },
      /**测试数据：歌单列表 */
      musicListList: [
        {
          lid: 1,
          name: '我的歌单1',
        },
        {
          lid: 2,
          name: '我的歌单2',
        },
      ],
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
    ...mapState(['isOnline', 'isLogin']),
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
      return this.musicListList[this.musicListList.length - 1].lid + 1;
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
          break;
        case 'login':
          /* 登录页 */
          break;
        case 'reg':
          /**注册页 */
          break;
      }
    },
    /**打开【本地音乐】页面 */
    openLocalMusic(): void {
      this.activeList = LIST_INDEX.LOCAL;
      ///
    },
    /**打开【我的歌单】页面 */
    openMusicList(index: number): void {
      this.activeList = index;
      if (index == 0) {
        ///打开【我喜欢】
      } else {
        //打开其他歌单
      }
    },
    /**激活歌单菜单 */
    showListMenu(e: MouseEvent): void {
      ///
      const lid =
        (e.target as Element).getAttribute('data-index') ||
        this.LIST_INDEX.NONE;
      this.activeMenu = +lid;
      const xy = {
        x: e.x,
        y: e.y,
      };

      bus.$emit('showMenu', this.getMusicListMenuOption(+lid, xy));
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
        this.musicListList.some(({ name }) => {
          return name == this.newListName;
        })
      ) {
        this.showTip('duplicate');
        return;
      }

      // this.toggleAddingMusicList();
      const newList = {
        lid: this.getNewLid,
        name: this.newListName,
      };
      this.toggleAddingMusicList();
      this.musicListList.push(newList);
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
    menuReply(index: number, lid) {
      console.log('reply', index, lid);
      let indexInList; //列表中的对应下标
      for (let i = 0; i < this.musicListList.length; i++) {
        if (this.musicListList[i].lid == lid) {
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
          this.musicListList.splice(indexInList, 1);
          /**同步修改到app.vue */
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
