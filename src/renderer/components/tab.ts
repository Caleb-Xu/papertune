import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      active: 0,
    };
  },
  watch: {
    /**可以通过外部参数影响内部 */
    activeTab(val) {
      if (val < this.tabNames.length) {
        this.active = val;
      }
    },
  },
  props: {
    activeTab: {
      type: Number,
      default: 0,
    },
    tabNames: {
      type: Array,
      default() {
        return [];
      },
    },
  },
});
