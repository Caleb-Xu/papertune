import Vue from 'vue';
import bus from '../bus';
import { PlayList } from '../utils/music';

export default Vue.extend({
  data() {
    return {
      show: false,
    };
  },
  computed: {
    playList(): PlayList {
      return this.$store.getters.getPlayList;
    },
  },
  methods: {
    toggle() {
      this.show = !this.show;
    },
    to(index) {
      this.$store.commit('to', index);
      this.$store.getters.getPlayList.playing = true;
    },
    remove(index) {
      if (index == this.playList.currentIndex) this.$store.commit('go', 1);
      this.playList.queue.splice(index, 1);
    },
  },
  created() {
    bus.$on('togglePlayList', this.toggle);
  },
});
