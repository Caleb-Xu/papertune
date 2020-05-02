/**监听渲染进程信息 */
import { ipcMain, BrowserWindow } from 'electron';

export default function(win: BrowserWindow) {
  //关闭窗口
  ipcMain
    .on('closeWin', e => {  //关闭窗口，实为隐藏
      console.log('closeWin');
      if (win) win.hide();
    })
    .on('minimizeWin', e => {  //最小化
      console.log('minimizeWin');
      if (win) win.minimize();
    })
    .on('quit', e => {  //退出，利用窗口关闭触发回调退出程序
      if (win) win.close();
    });
}
