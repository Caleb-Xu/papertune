import Vue from 'vue';
import bus from '@/renderer/bus';

export default Vue.extend({
  data() {
    return {
      show: false,
      msg: '',
    };
  },
  methods: {
    showMsg(msg) {
      this.show = true;
      this.msg = msg;
      this.$nextTick(() => (this.show = false));
      //
    },
  },
  created() {
    bus.$on('showMsg', this.showMsg);
  },
});
