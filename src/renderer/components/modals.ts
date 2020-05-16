import Vue from 'vue';
import ModalOption from '@/renderer/utils/options/modalOption';
import bus from '@/renderer/bus';
import { ipcRenderer } from 'electron';
import { Notice } from 'utils/others';
import { encyptString } from '../utils/tools';
import qs from 'qs';

interface ModalMsg {
  type: string;
  info?: any;
}

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
  theme: 'primary',
  yes: 'OK',
  title: '第一次使用',
};
const noticeOption: ModalOption = {
  yes: 'OK',
  theme: 'primary',
};
const loginOption: ModalOption = {
  yes: '登录',
  no: '取消',
  theme: 'primary',
  title: '登录papertune',
  checkbox: '记住登录',
  size: 's',
  text: '登录插槽未渲染！',
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
        },
        notice: {
          active: false,
          option: noticeOption,
        },
        login: {
          active: false,
          option: loginOption,
        },
      },
      password: '',
      passPattern: '[1-9a-zA-Z]{6,20}',
      name: '',
      namePattern: '[a-zA-Z\u4e00-\u9fa5][1-9a-zA-Z\u4e00-\u9fa5]{3,19}',
    };
  },
  computed: {},
  methods: {
    /**关闭模态框 */
    closeModal(index, val, isChecked) {
      console.log(index, val, isChecked);
      this.$set(this.modalList[index], 'active', false);
      /**没有带参时不触发事件 */
      if (arguments.length < 2) {
        return;
      }
      bus.$emit(index + '-reply', val, isChecked);
    },
    /**登录窗口的关闭回调 */
    login(index, val, isChecked) {
      //
      if (arguments.length < 2 || val == 'no') {
        this.$set(this.modalList[index], 'active', false);
        return;
      } else {
        /**登录 */
        const params = qs.stringify({
          name: this.name,
          password: encyptString(this.password),
        });
        //todo axios.post拿不到cookie，只能在这边生成
        this._http
          .post('http://localhost:4396/client/login', params)
          .then(resp => {
            console.log(resp.data);
            let cookieUid = 'uid=' + resp.data.uid + ';';
            let cookieToken = 'token=' + resp.data.token + ';';
            if (isChecked) {
              cookieUid += ' max-age=' + 60 * 60 * 24 * 30;
              cookieToken += ' max-age=' + 60 * 60 * 24 * 30;
            }
            document.cookie = cookieUid;
            document.cookie = cookieToken;
            bus.$emit('initAccount', {
              uid: resp.data.uid,
              name: this.name
            });
            this.$set(this.modalList[index], 'active', false);
            bus.$emit('showMsg','登录成功...');
          })
          .catch(error => {
            if (error.response) {
              if (error.response.status == 600) {
                console.warn(error.response.data.msg);
              }
            } else {
              console.log('Error', error.message);
            }
          })
          .finally(() => {
            /**复原 */
            this.name = '';
            this.password = '';
          });
        // bus.$emit(index + '-reply', val, isChecked);
      }
    },
  },
  created() {
    bus.$on('showModal', (option: ModalMsg) => {
      console.info('showModal', option.type);
      ipcRenderer.send('showModal');
      const modal = this.modalList[option.type];
      /**不存在该类型的模态框则报错 */
      if (modal == undefined) {
        console.error("can't not find modal", option.type);
        return;
      }
      /**处理notice部分 */
      if (option.type == 'notice') {
        const notice: Notice = option.info;
        noticeOption.title = notice.title;
        noticeOption.text = notice.text;
      }
      /**如果模态框活跃，不操作 */
      if (modal.active) return;
      this.$set(this.modalList[option.type], 'active', true);
    });
    // console.log('can show modal');
  },
});

/**
 * ? 已知问题，第一次打开不能正常唤起欢迎弹窗
 */
