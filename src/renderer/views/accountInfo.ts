import Vue from 'vue';
import { Account } from 'utils/account';
import { MusicList, MusicListPayload, SubmitType, Music } from '../utils/music';
import bus from '../bus';
import { getMusicPic } from '../utils/musicFile';
import { MenuItem, MenuOption } from '../utils/options/menuOption';

enum LIST_INDEX {
  NONE = -1,
  FAVOR = 0,
}

export default Vue.extend({
  data() {
    return {
      uid: 0,
      activeList: LIST_INDEX.NONE, //活跃歌单
      activeMenu: LIST_INDEX.NONE,
      activeTab: 0,
      pics: [] as Array<string>,
      newListName: '',
      adding: false,
      editing: false, //是否正在编辑歌单
      editingList: -1,
      LIST_INDEX,
    };
  },
  computed: {
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
    account(): Account {
      return this.$store.state.account;
    },
    musicLists(): Array<MusicList> {
      return this.$store.state.musicLists;
    },
    accountView(): Account {
      return {
        uid: this.account.uid,
        name: this.account.name,
        avatar: this.account.avatar || this._config.DEFAULT_BOY_AVATAR,
        motto: this.account.motto || '似乎什么都没有留下...',
      };
    },
  },
  methods: {
    toMusicList(name) {
      this.$router.push({ path: '/musicList', query: { name: name } });
    },
    toggleAddMusicList() {
      this.adding = !this.adding;
      if (this.adding) {
        this.$nextTick(() => {
          (this.$refs['add-input'] as HTMLElement).focus();
        });
      }
    },
    addMusicList() {
      if (this.newListName.length == 0 || this.newListName.length > 20) {
        bus.$emit('showMsg', '无效的歌单名');
        return;
      }
      if (
        this.musicLists.some(list => {
          if (list.name == this.newListName) {
            return true;
          }
          return false;
        })
      ) {
        bus.$emit('showMsg', '歌单名重复');
      }
      const payload: MusicListPayload = {
        act: SubmitType.CREATE,
        name: this.newListName,
      };
      this.$store.dispatch('modifyMusicList', payload);
      this.newListName = '';
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
    getMusicListMenuOption(lid: number, xy): MenuOption {
      const _this = this;
      return {
        type: 'accountMusicList',
        menuItems: _this.getMusicListMenuItems,
        target: lid,
        xy,
      };
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
    menuReply(index: number, lid) {
      console.log('reply', index, lid);
      const payload = {} as MusicListPayload;
      switch (index) {
        case 0:
          this.$store.commit(
            'replaceMusicsToPlaylist',
            this.musicLists[index].list
          );
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
    this.uid = +this.$route.query.uid;
    if (!this.uid == null) {
      console.warn('error uid', this.uid);
    }
    bus.$on('accountMusicListReply', this.menuReply);
  },
  mounted() {
    const pic = this._config.DEFAULT_MUSIC_PIC;
    this.musicLists.forEach(async (musicList, index) => {
      if (musicList?.list && musicList.list[0]) {
        const p =
          (await getMusicPic(musicList.list[musicList.list.length - 1])) ||
          this._config.DEFAULT_MUSIC_PIC;
        this.$set(this.pics, index, p);
        // console.log(this.pics[index]);
      } else {
        this.pics[index] = pic;
      }
    });
  },
});
