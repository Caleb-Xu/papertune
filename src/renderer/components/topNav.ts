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
      // console.log(arguments.length);
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
          /**发送到顶级组件，备份数据，在备份完毕后再触发quit */
          bus.$emit('quit');
          // ipcRenderer.send('quit');
        }
      } else {
        if (val == 'quit') {
          /**发送到顶级组件，备份数据，在备份完毕后再触发quit */
          this.$emit('quit');
          // ipcRenderer.send('quit');
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
      if (this.keyword == '') return;
      this.$router
        .push('/')
        .catch(err => {
          /*  */
        })
        .finally(() => {
          this.$router.push({
            path: 'searchInfo',
            query: { keyword: this.keyword },
          });
        });
    },
    showDownloadTab(e: MouseEvent) {
      bus.$emit('showMsg', '正在施工...');
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
          y: 150, //固定位置，避开顶栏（会有交互bug）
        },
      };
      switch (type) {
        case 'topMenu':
          option.menuItems = this.topMenuItems;
          bus.$emit('showMenu', option);
          break;
      }
    },
    /**菜单回调 */
    topMenuReply(index: number) {
      switch (index) {
        case 0:
          this.$router.push({
            path: '/setting',
          });
          break; //设置
        case 1:
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
