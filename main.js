const { app, BrowserWindow, Menu, Tray, ipcMain, Notification, dialog } = require('electron')
const path = require('path')
const os = require('os')
const { autoUpdater } = require('electron-updater')

// 声明store变量
let store

// 初始化配置存储
async function initStore() {
  const Store = await import('electron-store')
  store = new Store.default({
    defaults: {
      windowBounds: { width: 800, height: 600 },
      isDarkMode: false,
      autoStart: false,
      minimizeToTray: true,
      shortcuts: {
        toggleWindow: ''
      }
    }
  })
}

// 配置自动更新
function setupAutoUpdater() {
  autoUpdater.autoDownload = false

  autoUpdater.on('error', (error) => {
    dialog.showErrorBox('更新错误', error.message)
  })

  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: '发现新版本',
      message: '有新版本可用，是否现在下载？',
      buttons: ['是', '否']
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate()
      }
    })
  })

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: '更新就绪',
      message: '新版本已下载完成，重启应用以完成更新。',
      buttons: ['现在重启', '稍后重启']
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall()
      }
    })
  })

  // 每小时检查一次更新
  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 60 * 60 * 1000)
}

async function createWindow() {
  const { width, height } = store.get('windowBounds')
  const win = new BrowserWindow({
    width,
    height,
    backgroundColor: '#f0f0f0',
    title: 'Electron Hello World',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 监听窗口大小变化并保存
  win.on('resize', () => {
    const bounds = win.getBounds()
    store.set('windowBounds', bounds)
  })

  // 设置文件拖放处理
  win.webContents.on('will-navigate', (event) => {
    event.preventDefault()
  })

  win.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' }
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

app.whenReady().then(async () => {
  // 初始化store
  await initStore()
  // 初始化自动更新
  setupAutoUpdater()

  // 注册获取内存信息的事件处理器
  ipcMain.handle('get-memory-info', () => {
    return {
      total: os.totalmem(),
      free: os.freemem(),
      used: os.totalmem() - os.freemem()
    }
  })

  // 注册主题切换处理器
  ipcMain.handle('toggle-theme', () => {
    const isDarkMode = store.get('isDarkMode')
    store.set('isDarkMode', !isDarkMode)
    BrowserWindow.getAllWindows().forEach(window => {
      window.webContents.send('theme-changed', !isDarkMode)
    })
    return !isDarkMode
  })

  // 注册显示通知的事件处理器
  ipcMain.on('show-notification', (event, title, body) => {
    new Notification({ title, body }).show()
  })

  // 注册设置相关的事件处理器
  ipcMain.handle('get-dark-mode', () => store.get('isDarkMode'))
  ipcMain.handle('get-window-bounds', () => store.get('windowBounds'))
  ipcMain.handle('get-settings', () => ({
    autoStart: store.get('autoStart'),
    minimizeToTray: store.get('minimizeToTray')
  }))
  ipcMain.handle('save-settings', (event, settings) => {
    store.set('isDarkMode', settings.darkMode)
    store.set('windowBounds', settings.windowBounds)
    store.set('autoStart', settings.autoStart)
    store.set('minimizeToTray', settings.minimizeToTray)
    app.setLoginItemSettings({
      openAtLogin: settings.autoStart
    })
    BrowserWindow.getAllWindows().forEach(window => {
      window.webContents.send('theme-changed', settings.darkMode)
    })
  })

  // 注册快捷键相关的事件处理器
  ipcMain.handle('record-shortcut', () => {
    return new Promise((resolve) => {
      const window = new BrowserWindow({
        width: 300,
        height: 150,
        title: '按下快捷键',
        modal: true,
        parent: BrowserWindow.getFocusedWindow()
      })
      window.webContents.on('before-input-event', (event, input) => {
        if (input.type === 'keyDown') {
          const shortcut = []
          if (input.control) shortcut.push('Ctrl')
          if (input.meta) shortcut.push('Cmd')
          if (input.alt) shortcut.push('Alt')
          if (input.shift) shortcut.push('Shift')
          if (input.key.length === 1 || input.key === 'Space') {
            shortcut.push(input.key.toUpperCase())
            window.close()
            resolve(shortcut.join('+'))
          }
        }
      })
      window.loadFile('shortcut-recorder.html')
    })
  })
  ipcMain.handle('save-shortcut', (event, action, shortcut) => {
    store.set(`shortcuts.${action}`, shortcut)
  })
  ipcMain.handle('get-shortcuts', () => store.get('shortcuts'))

  // 系统托盘初始化
  const tray = new Tray(path.join(__dirname, 'icon.png'))
  const contextMenu = Menu.buildFromTemplate([
    { label: '打开控制台', type: 'normal', click: () => BrowserWindow.getFocusedWindow()?.webContents.openDevTools() },
    { type: 'separator' },
    { label: '切换主题', type: 'normal', click: () => BrowserWindow.getFocusedWindow()?.webContents.send('theme-changed', !store.get('isDarkMode')) },
    { type: 'separator' },
    { label: '退出', type: 'normal', click: () => app.quit() }
  ])
  tray.setToolTip('Electron示例程序')
  tray.setContextMenu(contextMenu)

  createMenu()
  try {
    const mainWindow = await createWindow()

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
  } catch (error) {
    console.error('创建窗口时发生错误:', error)
  }

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMenu()
      const mainWindow = await createWindow()

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