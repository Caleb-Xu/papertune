/**监听渲染进程信息 */
import { ipcMain, BrowserWindow, dialog } from 'electron';

export default function(win: BrowserWindow) {
  //关闭窗口
  ipcMain
    .on('closeWin', e => {
      //关闭窗口，实为隐藏
      console.log('closeWin');
      if (win) win.hide();
    })
    .on('min', e => {
      //最小化
      console.log('min');
      if (win) win.minimize();
    })
    .on('max', e => {
      //最大化
      console.log('max');
      if (win) {
        if (win.isMaximized()) {
          // console.log('maxed')
          win.unmaximize();
        } else {
          // console.log('unmaxed')
          win.maximize();
        }
      }
    })
    .on('quit', e => {
      //退出，利用窗口关闭触发回调退出程序
      console.log('quit');
      if (win) win.close();
    })
    /**弹出模态框时任务栏闪烁 */
    .on('showModal', e => {
      console.log('ipc showModal');
      win.flashFrame(true);
    });
  ipcMain.handle('selectFolder', async (e, title?) => {
    const result = await dialog.showOpenDialog(win, {
      buttonLabel: '确定',
      title: title || '选择文件夹',
      properties: ['openDirectory'],
    });
    return result.filePaths[0];
  });
  ipcMain.handle('selectImage', async (e, title?) => {
    const result = await dialog.showOpenDialog(win, {
      buttonLabel: '确定',
      title: title || '选择图片',
      filters: [
        {
          extensions: ['png', 'jpg', 'jpeg'],
          name: '图片',
        },
      ],
    });
    return result.filePaths[0];
  });
}
