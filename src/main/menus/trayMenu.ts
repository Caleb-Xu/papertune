/**
 * 托盘图标的菜单，现有功能暂时只有退出
 */
import { Menu } from 'electron';

export default function(): Menu {
  const menu = Menu.buildFromTemplate([
    {
      id: '0',
      label: '退出',
      role: 'quit',
      /* accelerator: 'Control+Q',
      registerAccelerator: true */
    }
  ]);
  return menu;
}
