/**
 * 托盘图标的菜单，现有功能暂时只有退出
 */
import { Menu, BrowserWindow,app } from 'electron';

export default function(win: BrowserWindow | null): Menu {
  const menu = Menu.buildFromTemplate([
    {
      id: '0',
      label: '退出',
      click(item) {
        if(win==null){
          app.quit();
        } else {
          win.webContents.send('b4Quit');
        }
      },
      /* accelerator: 'Control+Q',
      registerAccelerator: true */
    },
  ]);
  return menu;
}
