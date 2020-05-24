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
    select(filterIndex: number, subIndex?: number) {
      console.log('select', filterIndex, subIndex,'type:',this.menuOption.type);
      /**如果是子菜单 */
      if (subIndex != null) {
        bus.$emit(
          this.menuOption.type + 'Reply',
          this.itemFilter[filterIndex].index,
          this.menuOption.target,
          subIndex
        );
        console.log('select sended!');
        this.showMenu = false;
        return;
      }
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
    /**是否可用 */
    isDisabled(index: number): boolean {
      return this.itemFilter[index].disbaled || false;
    },
    /**显示子菜单，隐藏其他子菜单 */
    mouseEnter(index) {
      this.itemFilter.forEach((item, i) => {
        if (i == index) {
          if (item.subMenu) item.subShow = true;
        } else {
          if (item.subMenu) item.subShow = false;
        }
      });
      this.itemFilter[index].subShow = true;
    },
    callback(option: MenuOption){
      this.menuOption = option;
      this.showMenu = false;

      this.$nextTick(() => {
        this.showMenu = true;
      });
      console.log(this.showMenu);
    }
  },
  created() {
    /**
     * 根据类型显示菜单
     * @param option 相关配置,默认为空对象
     */
    bus.$on('showMenu', this.callback);
  },
  mounted() {
    /**点击关闭菜单 */
    window.onclick = () => {
      this.showMenu = false;
    };
  },
  beforeDestroy() {
    /**menu会一直存在，其实这个没有什么用 */
    bus.$off('showMenu', this.callback);
  }
});
