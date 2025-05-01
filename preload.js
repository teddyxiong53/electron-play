// 预加载脚本（桥梁作用）
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
  'electronAPI',
  {
    getPlatform: () => process.platform,
    getMemoryInfo: () => ipcRenderer.invoke('get-memory-info'),
    showNotification: (title, body) => ipcRenderer.send('show-notification', title, body)
  }
)