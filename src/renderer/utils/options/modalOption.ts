export default interface ModalOption {
  /**模态框文本，省略则由插槽代替 */
  text?: string;
  /**左上角标题 */
  title?: string;
  /**主题 */
  theme?: string;
  /**左下角选项 */
  checkbox?: string;
  /**第一个按钮的内容 */
  yes?: string;
  /**第一个按钮的图标 */
  yesIcon?: string;
  /**第二个按钮的内容 */
  no?: string;
  /**第一个按钮的图标 */
  noIcon?: string;
  /**s或m */
  size?: string;
}
