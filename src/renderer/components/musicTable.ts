/**
 *  * 该组件只为视图层，所有数据相关的操作均由父组件负责
 */

import { MusicList, Music } from 'utils/music';
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      active: {} as Music,
    };
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
  methods: {
    setActive(music: Music) {
      this.active = music;
    },
  },
  mounted() {
    document.onclick = () => {
      this.active = {} as Music;
    };
  },
});
