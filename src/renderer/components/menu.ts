import Vue from 'vue';
import { MenuItem } from '@/renderer/utils/options/menuOption';
interface XY {
  x: number;
  y: number;
}

export default Vue.extend({
  data() {
    return {
      itemHeight: 32,
      top: 0,
      left: 0,
    };
  },
  props: {
    width: {
      type: Number,
      default: 120,
    },
    xy: {
      required: true,
    },
    /**菜单内容 */
    menuItems: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    /**判断菜单的位置 */
    setPosition(): any {
      const menuHeight = this.itemHeight * this.itemFilter.length;

      const style = {
        left: 'auto',
        top: 'auto',
        bottom: 'auto',
        minWidth: this.width + 'px', //考虑内容溢出的情况
        height: menuHeight + 'px',
      };
      /**边界判定 */
      if ((this.xy as XY).x + this.width > window.innerWidth) {
        style.left = (this.xy as XY).x - this.width + 'px';
      } else {
        style.left = (this.xy as XY).x + 'px';
      }
      if ((this.xy as XY).y - menuHeight < 0) {
        style.top = (this.xy as XY).y + 'px';
      } else {
        style.top = (this.xy as XY).y - menuHeight + 'px';
      }
      return style;
      ///
    },
    /**过滤无用item */
    itemFilter(): Array<MenuItem> {
      return (this.menuItems as Array<MenuItem>).filter(item => !item.hidden);
    },
  },
  methods: {
    /**确认选项并返回上级
     * 通过过滤的数组的索引获取未过滤选项组的真正索引
     */
    select(filterIndex: number) {
      if (filterIndex != null) {
        this.$emit('select', this.itemFilter[filterIndex].index);
      } else {
        console.error('filterIndex is null', filterIndex);
      }
    },
    isDisabled(index: number): boolean {
      return this.itemFilter[index].disbaled || false;
    },
  },
});
