import Vue from 'vue';
import { getDB } from '../utils/tools';
import { Music } from '../utils/music';

export default Vue.extend({
  data() {
    return {
      listName: '',
      list: [] as Array<Music>,
    };
  },
  methods: {
    async getList() {
      console.info('get list...');
      const db = await getDB();
      const request = db
        .transaction('MUSIC_LIST', 'readonly')
        .objectStore('MUSIC_LIST')
        .openCursor();
      request.onsuccess = e => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue | null>)
          .result;
        // console.log('find list...');
        if (cursor) {
          console.log('cursor:', cursor.value);
          /**锁定歌单 */
          if (cursor.value.uid == this.$store.state.account.uid) {
            // console.log(111);
            if (cursor.value.name == this.listName) {
              //
              this.list = cursor.value.list;
              console.log('load list ok');
              return;
            }
          }
          cursor.continue();
        } else {
          console.log('no such list');
        }
      };
    },
  },
  created() {
    this.listName = this.$route.query.name as string;
    this.getList();
  },
});
