import Vue from 'vue';

export default Vue.extend({
  name: 'tip',
  computed: {
    setPosition(): object {
      const result = {};
      switch (this.direction) {
        case 'top':
        case 'bottom':
          result[this.direction] = 'calc(-100% + -5px)';
          break;
        case 'left':
        case 'right':
          result[this.direction] = '70%';//这是临时数据可能并不准确
      }
      result['position'] = 'absolute';
      return result;
    },
  },
  props: {
    type: {
      type: String,
      validator(value) {
        return ['normal', 'warning', 'error'].indexOf(value) != -1;
      },
      default: 'normal',
    },
    message: {
      type: String,
      required: true,
    },
    /**出现的方向 */
    direction: {
      type: String,
      validator(value) {
        return ['top', 'left', 'right', 'bottom'].indexOf(value) != -1;
      },
      default: 'top',
    },
  },
});
