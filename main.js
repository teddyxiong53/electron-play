const { app, BrowserWindow, Menu, Tray, ipcMain, Notification } = require('electron')
const path = require('path')
const os = require('os')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#f0f0f0',
    title: 'Electron Hello World',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
  return win
}

app.whenReady().then(() => {
  // 注册获取内存信息的事件处理器
  ipcMain.handle('get-memory-info', () => {
    return {
      total: os.totalmem(),
      free: os.freemem(),
      used: os.totalmem() - os.freemem()
    }
  })

  // 注册显示通知的事件处理器
  ipcMain.on('show-notification', (event, title, body) => {
    new Notification({ title, body }).show()
  })

  // 系统托盘初始化
  const tray = new Tray(path.join(__dirname, 'icon.png'))
  const contextMenu = Menu.buildFromTemplate([
    { label: '打开控制台', type: 'normal', click: () => BrowserWindow.getFocusedWindow()?.webContents.openDevTools() },
    { type: 'separator' },
    { label: '退出', type: 'normal', click: () => app.quit() }
  ])
  tray.setToolTip('Electron示例程序')
  tray.setContextMenu(contextMenu)

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})