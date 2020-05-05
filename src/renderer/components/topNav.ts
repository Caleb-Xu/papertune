import { ipcRenderer } from 'electron';
import Vue from 'vue';
import bus from '@/renderer/bus.ts';
import { MenuOption, MenuItem } from '../utils/options/menuOption';
import { mapState } from 'vuex';

export default Vue.extend({
  data() {
    return {
      keyword: '',
    };
  },
  computed: {
    ...mapState(['isLogin', 'isOnline']),
    topMenuItems(): Array<MenuItem> {
      return [
        {
          index: 0,
          text: '设置',
        },
        {
          index: 1,
          text: '意见反馈',
        },
        {
          index: 2,
          text: this.isOnline ? '登出' : '登录',
          hidden: this._config.SINGLE,
        },
        {
          index: 3,
          text: '退出',
        },
      ];
    },
    ///
  },
  methods: {
    /**
     * 前进/后退
     * 通过路由实现
     */
    go(index: number): void {
      // console.log(`go${index}`);
      this.$router.go(index);
      ///
    },
    /**
     * 判断能否前进/后退
     */
    canGo(index: number): boolean {
      // console.log(`canGo${index}`);
      index;
      ///
      return false;
    },
    /**回到主页 */
    back2Home(): void {
      ///
    },
    /**
     * 关闭窗口
     * 关闭前让用户指定关闭行为的指向（后台运行 | 退出程序）
     */
    close(val?, isChecked?): void {
      console.log(arguments.length);
      if (arguments.length > 1) {
        if (!/(yes)|(no)/.test(val)) {
          console.error('error val', val);
          return;
        }
        if (isChecked) {
          localStorage.setItem(
            'click-to-close',
            val == 'yes' ? 'background' : 'quit'
          );
        }
        if (val == 'yes') {
          ipcRenderer.send('closeWin');
        } else if (val == 'no') {
          /**备份数据，在备份完毕后再触发quit */
          ipcRenderer.send('quit');
        }
      } else {
        if (val == 'quit') {
          ipcRenderer.send('quit');
        }
        const close = localStorage.getItem('click-to-close');
        if (close == undefined) {
          bus.$emit('showModal', {
            type: 'check-close',
          });
        } else if (close == 'background') {
          ipcRenderer.send('closeWin');
        } else if (close == 'quit') {
          ipcRenderer.send('quit');
        }
      }
    },
    /**最小化 */
    minimizeBtn(): void {
      ipcRenderer.send('minimizeWin');
    },
    /**搜索内容，触发搜索事件*/
    search() {
      ///
    },
    /**显示菜单 */
    showTopMenu(e: MouseEvent) {
      const type = (e.target as Element).getAttribute('data-type') || 'error';
      console.log('showTopMenu', type);
      const option: MenuOption = {
        type,
        menuItems: [],
        xy: {
          x: (e.target as HTMLElement).offsetLeft,
          y: (e.target as HTMLElement).offsetTop + 50, //固定位置，避开顶栏（会有交互bug）
        },
      };
      switch (type) {
        case 'downloadTab':
          bus.$emit('showDownloadTab', option);
          break;
        case 'topMenu':
          option.menuItems = this.topMenuItems;
          bus.$emit('showMenu', option);
          break;
      }
    },
    /**菜单回调 */
    topMenuReply(index: number, target) {
      switch (index) {
        case 0:
          break; //设置
        case 1:
          break; //意见反馈
        case 2:
          if (this.isLogin) {
            //登出
          } else {
            //登录
          }
          break; //登录/登出
        case 3:
          this.close('quit');
          break; //退出
      }
    },
  },
  created() {
    /**菜单处理业务完成之后的回调处理 */
    bus.$on('showTabReplyToTopNav', message => {
      message;
      ///
    });

    bus.$on('topMenuReply', this.topMenuReply);
    bus.$on('check-close-reply', this.close);
  },
  components: {},
});
