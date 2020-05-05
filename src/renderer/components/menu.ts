import Vue from 'vue';
import bus from '@/renderer/bus';
import { MenuItem, MenuOption } from 'utils/options/menuOption';
interface XY {
  x: number;
  y: number;
}

export default Vue.extend({
  data() {
    return {
      itemHeight: 32,
      showMenu: false,
      width: 120,
      menuOption: {
        xy: {
          x: 0,
          y: 0,
        },
        type: '',
        menuItems: [] as Array<MenuItem>,
      } as MenuOption,
    };
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
      if ((this.menuOption.xy as XY).x + this.width > window.innerWidth) {
        style.left = (this.menuOption.xy as XY).x - this.width + 'px';
      } else {
        style.left = (this.menuOption.xy as XY).x + 'px';
      }
      if ((this.menuOption.xy as XY).y - menuHeight < 0) {
        style.top = (this.menuOption.xy as XY).y + 'px';
      } else {
        style.top = (this.menuOption.xy as XY).y - menuHeight + 'px';
      }
      return style;
      ///
    },
    /**过滤无用item */
    itemFilter(): Array<MenuItem> {
      return (this.menuOption.menuItems as Array<MenuItem>).filter(
        item => !item.hidden
      );
    },
  },
  methods: {
    /**确认选项并返回上级
     * 通过过滤的数组的索引获取未过滤选项组的真正索引
     */
    select(filterIndex: number) {
      if (filterIndex != null) {
        console.log('select', this.itemFilter[filterIndex].text);
        bus.$emit(
          this.menuOption.type + 'Reply',
          this.itemFilter[filterIndex].index,
          this.menuOption.target
        );
        this.showMenu = false;
      } else {
        console.error('filterIndex is null', filterIndex);
      }
    },
    isDisabled(index: number): boolean {
      return this.itemFilter[index].disbaled || false;
    },
  },
  created() {
    /**
     * 根据类型显示菜单
     * @param option 相关配置,默认为空对象
     */
    bus.$on('showMenu', (option: MenuOption) => {
      // console.log(`showMenu type: ${option.type}, option: ${option}`);
      this.menuOption = option;
      /* this.xy = option.xy;
      this.menuItems = option.menuItems;
      this.type = option.type; */
      this.showMenu = false;

      this.$nextTick(() => {
        this.showMenu = true;
      });
      console.log(this.showMenu);
    });
    /**点击关闭菜单 */
    window.onclick = () => {
      this.showMenu = false;
    };
    window.onkeydown = (e: KeyboardEvent) => {
      switch (e.keyCode) {
        case 13:
        case 27:
          this.showMenu = false;
          break;
      }
    };
  },
});
