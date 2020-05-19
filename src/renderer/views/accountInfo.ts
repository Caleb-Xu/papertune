import Vue from 'vue';
import { Account } from 'utils/account';
import { MusicList, MusicListPayload, SubmitType } from '../utils/music';
import bus from '../bus';
import { getMusicPic } from '../utils/musicFile';

export default Vue.extend({
  data() {
    return {
      uid: -1,
      activeTab: 0,
      pics: [] as Array<string>,
      newListName: '',
      adding: false,
    };
  },
  computed: {
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
    // bgStyle(): any {
    //   return {
    //     'background-image': 'url('+this.accountView.avatar+')',
    //     color: 'red',
    //   };
    // },
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
  },
  created() {
    this.uid = +this.$route.query.uid;
    if (!this.uid==null) {
      console.warn('error uid', this.uid);
    }
  },
  mounted() {
    console.log('mounted');
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
