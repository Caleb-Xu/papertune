export default interface MenuOption {
  /**菜单类型 */
  type: string;
  /**菜单项 */
  menuItems: Array<MenuItem>;
  /**作用目标的key，返回时使用 */
  target?: any;
  /**触发时的位置信息 */
  xy: {
    x: number;
    y: number;
  };
}

export interface MenuItem {
  /**选项索引 */
  index: number;
  /**菜单选项 */
  text: string;
  /**对应iconfont的符号，省略表示没有icon */
  icon?: string | null;
  /**选项是否可用 */
  disbaled?: boolean;
  /**选项是否隐藏 */
  hidden?: boolean;
}
