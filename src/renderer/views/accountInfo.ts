import Vue from 'vue';
import { Account } from 'utils/account';
import { MusicList } from '../utils/music';

export default Vue.extend({
  data() {
    return {
      uid: -1,
      activeTab: 0
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
  created() {
    this.uid = +this.$route.query.uid;
    if (!this.uid) {
      console.warn('error uid', this.uid);
    }
  },
});
