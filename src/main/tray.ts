import { Tray, BrowserWindow } from 'electron';
import config from '@/baseConfig';
import initTrayMenu from './menus/trayMenu';

export default function(win: BrowserWindow | null) {
  const tray = new Tray(config.LOGO);
  tray.setContextMenu(initTrayMenu());
  tray.on('click', () => {
    // console.log(win);
    if (win) win.show();
  });
  return tray;
}
