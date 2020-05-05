import Vue from 'vue';
import ModalOption from '@/renderer/utils/options/modalOption';
import bus from '@/renderer/bus';
import {ipcRenderer} from 'electron'

const checkCloseOption: ModalOption = {
  text: '点击关闭按钮，您想要？',
  theme: 'danger',
  yes: '后台运行',
  no: '退出程序',
  checkbox: '记住选项',
  title: '关闭Papertune',
};
const firstOpenOption: ModalOption = {
  text: '欢迎使用papertune！',
  theme: 'normal',
  yes: 'OK',
  title: '第一次使用',
};

export default Vue.extend({
  components: {
    modal: () => import('components/modal.vue'),
  },
  data() {
    return {
      checkCloseOption,
      modalList: {
        'check-close': {
          active: false,
          option: checkCloseOption,
        },
        'first-open': {
          active: false,
          option: firstOpenOption,
        }
      },
    };
  },
  computed: {},
  methods: {
    /**关闭模态框 */
    closeModal(index, val, isChecked) {
      this.$set(this.modalList[index], 'active', false);
      /**没有带参时不触发事件 */
      if (arguments.length < 2) {
        return;
      }
      bus.$emit(index + '-reply', val, isChecked);
    },
  },
  created() {
    bus.$on('showModal', option => {
      ipcRenderer.emit('showModal');
      const modal = this.modalList[option.type];
      /**不存在该类型的模态框则报错 */
      if (modal == undefined) {
        console.error("can't not find modal", option.type);
        return;
      }
      /**如果模态框活跃，不操作 */
      if (modal.active) return;
      console.log('showModal', option.type);
      this.$set(this.modalList[option.type], 'active', true);
    });
  },
});

/**
 * ? 已知问题，第一次打开不能正常唤起欢迎弹窗
 */