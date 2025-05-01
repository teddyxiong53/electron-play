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

// 创建应用菜单
function createMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        { label: '新建', accelerator: 'CmdOrCtrl+N', click: () => createWindow() },
        { type: 'separator' },
        { label: '退出', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { label: '撤销', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: '重做', accelerator: 'CmdOrCtrl+Shift+Z', role: 'redo' },
        { type: 'separator' },
        { label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: '全选', accelerator: 'CmdOrCtrl+A', role: 'selectAll' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { label: '刷新', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: '开发者工具', accelerator: 'CmdOrCtrl+Shift+I', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: '重置缩放', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: '放大', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: '缩小', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' }
      ]
    }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
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

  createMenu()
  const mainWindow = createWindow()

  // 监听窗口关闭事件，改为最小化到托盘
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault()
      mainWindow.hide()
    }
    return false
  })

  // 点击托盘图标时显示窗口
  tray.on('click', () => {
    mainWindow.show()
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMenu()
  const mainWindow = createWindow()

  // 监听窗口关闭事件，改为最小化到托盘
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault()
      mainWindow.hide()
    }
    return false
  })

  // 点击托盘图标时显示窗口
  tray.on('click', () => {
    mainWindow.show()
  })
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.isQuitting = true
    app.quit()
  }
})

app.on('before-quit', () => {
  app.isQuitting = true
})