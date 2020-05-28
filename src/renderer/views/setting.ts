import { setSkin } from 'utils/setSkin';
import Vue from 'vue';
import { ipcRenderer } from 'electron';
import bus from '../bus';

interface Theme {
  title: string;
  key: string;
  color: string;
}

export default Vue.extend({
  data() {
    return {
      activeTab: 0,
      tabNames: process.env.IS_ELECTRON
        ? ['路径相关', '个性外观']
        : ['个性外观'],
      themes: [
        { title: '鲜绿', key: 'green', color: '#43b244' },
        { title: '海棠红', key: 'red', color: '#f03752' },
        { title: '金盏黄', key: 'yellow', color: '#fcc307' },
        { title: '飞燕草蓝', key: 'blue', color: '#0f59a4' },
      ] as Theme[],
      currentTheme: localStorage.getItem('THEME'),
    };
  },
  computed: {
    localPaths(): string[] {
      return this.$store.state.localPaths;
      /* 临时 */
      // return this.$store.getters.getAllPaths;
    },
  },
  methods: {
    async selectFolder() {
      const path: string = await ipcRenderer.invoke(
        'selectFolder',
        '选择音乐文件夹'
      );
      console.log('path:', path);
      return path;
    },
    async editPath(index) {
      const path = await this.selectFolder();
      if (path == undefined) {
        /**执行了撤销操作 */
        return;
      }
      if (
        this.localPaths.indexOf(path) != -1 &&
        this.localPaths.indexOf(path) != index
      ) {
        bus.$emit('showMsg', '路径已存在!');
        return;
      }
      this.$set(this.localPaths, index, path);
    },
    removePath(index) {
      this.localPaths.splice(index, 1);
    },
    async addPath() {
      const path = await this.selectFolder();
      if (path == undefined) {
        /**执行了撤销操作 */
        return;
      }
      if (this.localPaths.indexOf(path) != -1) {
        bus.$emit('showMsg', '路径已存在!');
        return;
      }
      this.localPaths.push(path);
    },
    setSkin(key) {
      setTimeout(() => {
        setSkin(key);
        bus.$emit('showMsg', '主题修改成功！');
        localStorage.setItem('THEME', key);
        this.currentTheme = key;
      }, 300);
    },
  },
  created() {
    if (this.$route.query.tab && this.$route.query.tab.length > 0) {
      this.activeTab = +this.$route.query.tab;
    }
  },
  components: {
    tab: () => import('components/tab.vue'),
  },
});
