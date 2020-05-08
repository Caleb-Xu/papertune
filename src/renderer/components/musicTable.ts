import { MusicList } from 'utils/music';
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {};
  },
  props: {
    /**数据内容 */
    list: {
      type: Array,
      default() {
        return [] as Array<MusicList>;
      },
    },
    type: {
      type: String,
      default: 'default',
    },
  },
});
