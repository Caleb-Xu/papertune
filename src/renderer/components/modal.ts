import Vue from 'vue';

let getStyle, setStyle;

export default Vue.extend({
  data() {
    return {
      /**尺寸 */
      minWidth: 360,
      minHeight: 200,
      maxWidth: 540,
      maxHeight: 300,
      /**是否选中checkbox */
      isChecked: false,
    };
  },
  computed: {
    /**获取尺寸样式 */
    baseSize(): Record<string, string> {
      return {
        'min-width': this.minWidth + 'px',
        'min-height': this.minHeight + 'px',
        'max-width': this.maxWidth + 'px',
        'max-height': this.maxHeight + 'px',
      };
    },
  },
  methods: {
    /**方向模态框 */
    drop(e: MouseEvent) {
      window.removeEventListener('mousemove', this.mouseMove);
    },
    /**拖动模态框 */
    drag() {
      window.addEventListener('mousemove', this.mouseMove);
      window.addEventListener('mouseup', this.drop);
    },
    /**拖动过程 */
    mouseMove(e: MouseEvent) {
      getStyle = window.getComputedStyle(this.$el);
      setStyle = (this.$el as HTMLElement).style;
      // console.log(e.x, e.y);
      //指针边界处理，有缺陷，回到窗口后不能跟焦
      /* 
      if (
        e.x <= 100 ||
        e.x >= this._config.SIZE.WIDTH - 1 ||
        e.y <= 100 ||
        e.y > +this._config.SIZE.HEIGHT - 1
      ) {
        window.removeEventListener(
          'mousemove',
          this.mouseMove
        );
        return;
      } */
      //模态框边界处理
      if (parseInt(getStyle.left) <= 0 && e.movementX < 0) return;
      else if (parseInt(getStyle.right) <= 0 && e.movementX > 0) return;
      else if (parseInt(getStyle.top) <= 0 && e.movementY < 0) return;
      else if (parseInt(getStyle.bottom) <= 0 && e.movementY > 0) return;

      setStyle.top = parseInt(getStyle.top) + e.movementY + 'px';
      setStyle.left = parseInt(getStyle.left) + e.movementX + 'px';
    },
    /**通过css变量设置模态框主题 */
    setTheme() {
      let val;
      switch (this.theme) {
        case 'primary':
          val = 'var(--primary)';
          break;
        case 'green':
          val = 'var(--green)';
          break;
        case 'danger':
          val = 'var(--red)';
          break;
        case 'warning':
          val = 'var(--yellow)';
          break;
        case 'normal':
          val = 'var(--border)';
          break;
      }
      (this.$el as HTMLElement).style?.setProperty('--theme', val);
    },
    select(val: string) {
      console.log('select', this.name);
      this.$emit('close', this.name, val, this.isChecked);
    },
  },
  mounted() {
    this.setTheme();
  },
  created() {
    window.onkeydown = (e: KeyboardEvent) => {
      switch (e.keyCode) {
        case 13:
          this.select('yes');
          break;
        case 27:
          this.$emit('close', this.name);
          break;
      }
    };
  },
  props: {
    /**主文本,可用插槽代替 */
    text: {
      type: String,
    },
    /**左上角标题 */
    title: String,
    /**主题 */
    theme: {
      type: String,
      validator(value) {
        return ['primary', 'danger', 'warning', 'normal'].indexOf(value) !== -1;
      },
      default: 'primary',
    },
    /**勾选框，省略表示不需要 */
    checkbox: String,
    /**确认按钮的内容 */
    yes: {
      type: String,
      // default: '确认',
    },
    /**确认按钮的图标，可省略 */
    yesIcon: String,
    /**取消按钮的内容 */
    no: {
      type: String,
      // default: '取消',
    },
    /**取消按钮的图标，可省略 */
    noIcon: String,
    /**模态框的名字，用于标记 */
    name: String,
    /**尺寸，有s,m,两种，默认s */
    size: {
      type: String,
      default: 's',
    },
  },
});
