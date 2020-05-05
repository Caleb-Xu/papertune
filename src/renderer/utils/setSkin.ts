/**存储变量的节点 */
const el = document.body;
const style = window.getComputedStyle(el);

/**
 * 设置颜色值
 * @param {string}key 变量名
 * @param {string}val 替换的值
 */
export function setCssVar(key: string, val: string) {
  const color = style.getPropertyValue(val);
  el.style.setProperty('--primary', color);

  console.log('setCssVar success');
}

export function setSkin(theme: string) {
  //
  switch (theme) {
    case 'green':
      setCssVar('--primary', '--green');
      break;
    case 'red':
      setCssVar('--primary', '--red');
      break;
    case 'yellow':
      setCssVar('--primary', '--yellow');
      break;
    case 'blue':
      setCssVar('--primary', '--blue');
      break;
    case 'dark':
      /**深色模式 */
      console.info('深色模式正在开发中...');
      break;
    default:
      console.warn('invalid theme', theme);
      break;
  }
}
