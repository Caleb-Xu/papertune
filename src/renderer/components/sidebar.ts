import Vue from 'vue';
import { mapState } from 'vuex';
import { MenuOption, MenuItem } from '@/renderer/utils/options/menuOption';
import bus from '@/renderer/bus.ts';
import { MusicList, MusicListPayload, SubmitType } from '../utils/music';

enum LIST_INDEX {
  NONE = -1,
  FAVOR = 0,
}

export default Vue.extend({
  data() {
    return {
      activeList: LIST_INDEX.NONE, //活跃歌单
      activeMenu: LIST_INDEX.NONE,
      adding: false, //是否正在新建歌单
      editing: false, //是否正在编辑歌单
      editingList: -1,
      newListName: '',
      LIST_INDEX,
    };
  },
  computed: {
    ...mapState(['isOnline', 'isLogin', 'account']),
    netActive(): boolean {
      return this.$store.getters.netActive;
    },
    avatarStyle(): any{
      return {
        'background-image': `url(${JSON.stringify(this.userInfo.avatar)})`
      }
    },
    userInfo(): any {
      return {
        uid: this.account?.uid || 0,
        name: this.account?.name || '加载中...',
        avatar: this.account?.avatar || this._config.DEFAULT_BOY_AVATAR,
      };
    },
    musicLists(): Array<MusicList> {
      return this.$store.state.musicLists;
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
      return (
        (this.musicLists[this.musicLists.length - 1] as MusicList).lid || -1
      );
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
    },
    /**激活歌单菜单 */
    showListMenu(lid, e: MouseEvent): void {
      const xy = {
        x: e.x,
        y: e.y,
      };
      this.activeMenu = lid;
      bus.$emit('showMenu', this.getMusicListMenuOption(lid, xy));
    },
    /**显示或隐藏新建歌单输入框 */
    toggleAddingMusicList(): void {
      this.editing = false;
      this.adding = !this.adding;
      if (this.adding) {
        this.newListName = this.computedNewListName; //新的赋值
        const input = this.$refs['add-input'] as HTMLInputElement;
        this.$nextTick(() => input?.focus());
      }
    },
    cancel() {
      this.editing = false;
      this.editingList = -1;
      this.adding = false;
    },
    submit() {
      if (this.editing) {
        this.editedMusicList();
      } else if (this.adding) {
        this.addedMusicList();
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
        bus.$emit('showMsg', '已拥有歌单：' + this.newListName);
        return;
      }

      // this.toggleAddingMusicList();
      const payload: MusicListPayload = {
        act: SubmitType.CREATE,
        lid: (this.musicLists[this.musicLists.length - 1].lid as number) + 1,
        name: this.newListName,
      };
      this.$store.dispatch('modifyMusicList', payload);
      this.toggleAddingMusicList();
      ///
    },
    /**保存编辑歌单 */
    editedMusicList() {
      /*判断新的歌单名是否会与其他歌单重名 */
      if (
        this.musicLists.some(({ name, lid }) => {
          if (lid == this.editingList) {
            return false;
          }
          return name == this.newListName;
        })
      ) {
        bus.$emit('showMsg', '已拥有歌单：' + this.newListName);
        return;
      }
      const payload: MusicListPayload = {
        act: SubmitType.EDIT,
        lid: this.editingList,
        name: this.newListName,
      };
      this.$store.dispatch('modifyMusicList', payload);
      this.toggleEditingMusicList(-1);
    },
    toggleEditingMusicList(lid) {
      this.adding = false;
      this.editing = !this.editing;
      if (this.editing) {
        this.newListName = this.musicLists[lid].name;
        this.editingList = lid;
        const input = this.$refs['add-input'] as HTMLInputElement;
        this.$nextTick(() => input?.focus());
      } else {
        this.editingList = -1;
      }
    },
    /**显示提示 */
    showTip(keyword: string): void {
      console.log('showTip');
      switch (keyword) {
        case 'duplicate':
          break;
      }
      bus.$emit('showMsg', '歌单名重复！');
    },
    /**菜单回调
     * @param index 菜单目录
     * @param lid 作用目标
     */
    menuReply(index: number, lid) {
      console.log('reply', index, lid);
      const payload = {} as MusicListPayload;
      switch (index) {
        case 0:
          for (let i = 0; i < this.musicLists.length; i++) {
            if (this.musicLists[i].lid == lid) {
              this.$store.commit(
                'replaceMusicsToPlaylist',
                this.musicLists[i].list
              );
              break;
            }
          }
          break; //播放歌单
        case 1:
          this.editingList = lid;
          this.toggleEditingMusicList(lid);
          break; //重命名
        case 2:
          payload.act = SubmitType.DROP;
          payload.lid = lid;
          this.$store.dispatch('modifyMusicList', payload);
          ///
          break; //删除歌单
        case 3:
          break; //下载歌单
      }
    },
  },
  created() {
    bus.$on('sidebarMusicListReply', this.menuReply);
  },
  components: {
    tip: () => import('components/tip.vue'),
  },
});
