// 预加载脚本（桥梁作用）
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
  'electronAPI',
  {
    getPlatform: () => process.platform,
    getMemoryInfo: () => ipcRenderer.invoke('get-memory-info'),
    showNotification: (title, body) => ipcRenderer.send('show-notification', title, body),
    handleDrop: (callback) => {
      window.addEventListener('drop', (event) => {
        event.preventDefault()
        event.stopPropagation()
        const files = Array.from(event.dataTransfer.files).map(file => file.path)
        callback(files)
      })
      window.addEventListener('dragover', (event) => {
        event.preventDefault()
        event.stopPropagation()
      })
    },
    toggleTheme: () => ipcRenderer.invoke('toggle-theme'),
    onThemeChange: (callback) => ipcRenderer.on('theme-changed', callback),
    // 设置相关API
    isDarkMode: () => ipcRenderer.invoke('get-dark-mode'),
    getWindowBounds: () => ipcRenderer.invoke('get-window-bounds'),
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
    recordShortcut: () => ipcRenderer.invoke('record-shortcut'),
    saveShortcut: (action, shortcut) => ipcRenderer.invoke('save-shortcut', action, shortcut),
    getShortcuts: () => ipcRenderer.invoke('get-shortcuts')
  }
)