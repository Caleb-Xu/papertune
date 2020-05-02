import Vue from 'vue';
import { mapMutations, mapState } from 'vuex';
import bus from '@/renderer/bus.ts';
import MenuOption from '@/renderer/utils/options/menuOption';
import ModalOption from '@/renderer/utils/options/modalOption';

const checkCloseOption: ModalOption = {
  text: '点击关闭按钮，您想要？',
  theme: 'danger',
  yes: '后台运行',
  no: '退出程序',
  checkbox: '记住选项',
  title: '关闭Papertune',
};

export default Vue.extend({
  data() {
    return {
      /**菜单是否显示 */
      showMenu: false,
      menuOption: {
        xy: {
          x: NaN,
          y: NaN,
        },
        type: '',
        menuItems: [],
        target: NaN,
      },
    };
  },
  computed: {
    ...mapState(['isOnline']),
    playerOption() {
      return {
        /**测试数据 */
        src: 'D://MyMusic/网易云音乐/任素汐 - 我要你.mp3',
      };
    },
    activeModals(): any {
      // return this.modals.;
      return '';
    },
  },
  methods: {
    ...mapMutations(['setOnline']),
    /**从本地存储（indexDB与localStorage）初始化数据 */
    initStorage(): void {
      
      ///
    },
    /**保存数据至indexedDB */
    saveIndexedDB(): void {
      ///
    },
    /**将数据上传至服务器 */
    updateServerDB(): void {
      ///
    },
    /**点击隐藏菜单 */
    hideMenu(): void {
      if (this.showMenu) {
        this.showMenu = !this.showMenu;
      }
    },
    /**
     * *配置全局监听
     * *通过中央事件总线bus实现
     */
    initListener() {
      /**显示下载面板 */
      bus.$on('showDownloadTab', (option: MenuOption) => {
        ///
        console.log('showDownloadTab');
        console.log(option);
      });
      /**
       * 根据类型显示菜单
       * @param option 相关配置,默认为空对象
       */
      bus.$on('showMenu', (option: MenuOption) => {
        ///
        console.log(`showMenu type: ${option.type}, option: ${option}`);
        (this.menuOption as MenuOption) = option;
        this.showMenu = false;
        this.$nextTick(() => {
          this.showMenu = true;
        });
        console.log(this.showMenu);
      });
    },
    /**菜单已选择选项
     * 将操作目标与操作选项返回
     */
    menuSelect(index): void {
      bus.$emit(this.menuOption.type + 'Reply', index, this.menuOption.target);
      this.showMenu = false;
      //
    },
    /**监听键盘 */
    keyup(e: KeyboardEvent) {
      let node;
      switch (e.keyCode) {
        /**esc键，回车键，使表单元素失去焦点,关闭菜单 */
        case 27:
        case 13:
          node = document.activeElement;
          if (node && node.constructor.name == 'HTMLInputElement') {
            node.blur();
          }
          this.showMenu = false;
          break;
      }
    },
  },
  created() {
    //判断是否联网
    const online = window.navigator.onLine && !this._config.SINGLE;
    this.setOnline(online); 
    // this._http.get();
    this.initStorage();
    /**如果是使用音乐文件打开的,直接播放 */
    const arg = require('electron').remote.process.argv0;

    if (/\.(mp3)|(wav)$/.test(arg)) {
      ///
      // console.log(arg);
    }
    this.initListener();
    /**临时主页 */
    // this.$router.push('/localList');
/*     this._http.get('D:\\~test\\avatars\\9535ffeb-83c5-4a47-a404-73a70d660f17.jpg').then(resp=>{
      console.log(resp.data);
    }).catch(err => console.log(err)) */
  },
  mounted() {
    /**监听全局键盘 */
    document.onkeyup = this.keyup;
  },
  beforeDestroy() {
    this.saveIndexedDB(); //保存数据至indexedDB
    if (this.isOnline) {
      this.updateServerDB(); //更新服务器上的数据
    }
  },
  components: {
    topNav: () => import('components/topNav.vue'),
    sidebar: () => import('components/sidebar.vue'),
    player: () => import('components/player.vue'),
    myMenu: () => import('components/menu.vue'), //menu标签已存在
    modal: () => import('components/modal.vue'),
    modals: () => import('components/modals.vue'),
  },
});
