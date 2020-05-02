//@ts-ignore
const style = document.styleSheets[2].cssRules[0].style;

/**
 * 设置颜色值 
 * @param {string}key 变量名
 * @param {string}val 替换的值
 */
export default function setCssVar(key: string, val: string) {
  const text: string = style.cssText;
  const reg = new RegExp('--' + key + ': \\S*;');
  style.cssText = text.replace(reg, '--' + key + ': ' + val + ';');

  console.log('setCssVar success')
}
