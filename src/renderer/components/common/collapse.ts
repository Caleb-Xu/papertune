function transition(value) {
  return {
    beforeEnter(el: HTMLElement) {
      el.style.transition = value;
      el.style.height = '0';
      el.style.overflow = 'hidden';
    },
    enter(el: HTMLElement) {
      setTimeout(() => {
        el.style.height = el.scrollHeight + 'px';
      });
    },
    afterEnter(el: HTMLElement) {
      el.style.height = '';
      el.style.transition = '';
    },
    beforeLeave(el: HTMLElement) {
      el.style.transition = value;
      el.style.height = el.scrollHeight + 'px';
      el.style.overflow = 'hidden';
    },
    leave(el: HTMLElement) {
      setTimeout(() => {
        el.style.height = '0';
      });
    },
    afterLeave(el: HTMLElement) {
      el.style.height = '';
      el.style.transition = '';
    },
  };
}

export default {
  name: 'myCollapse',
  functional: true,
  props: ['during', 'func'],
  render(h, { children, props }) {
    const during = (props.during || 1) + 's';
    const func = props.func || 'ease-in-out';
    const data = {
      on: transition(['height', during, func].join(' ')),
    };
    return h('transition', data, children);
  },
};
