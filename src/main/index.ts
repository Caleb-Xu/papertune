'use strict';

import { app, protocol, BrowserWindow, Menu } from 'electron';
import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib';
import initTray from './tray';
import initIpc from './ipc';
import config from '@/baseConfig';
// import trayMenu from './menus/trayMenu';
const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow; //主窗口

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

function createMainWindow(win: BrowserWindow | null) {
  // Create the browser window.
  win = new BrowserWindow({
    width: config.SIZE.WIDTH,
    height: config.SIZE.HEIGHT,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      offscreen: true,
    },
    show: false,
    backgroundColor: '#fff',
    resizable: false,
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }
  // win.webContents.openDevTools();
  win.on('ready-to-show', () => {
    if (win) win.show();
  });

  win.on('close', e => {
    app.quit();
  });

  return win;
}

// Quit when all windows are closed.
app.on('window-all-closed', async () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools();
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  Menu.setApplicationMenu(null); //屏蔽顶级菜单，并屏蔽默认快捷键
  /**不使用常量进行存储会出现获取不到win的bug */
  const mainWin = createMainWindow(win); //创建窗口
  //初始化托盘图标
  initTray(mainWin);
  //监听渲染进程
  initIpc(mainWin);
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

app.on('before-quit', () => {
  console.log('b4quit');
});
