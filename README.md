# Electron Play

一个基于Electron的桌面应用程序，提供了丰富的功能和现代化的用户界面。

## 功能特性

- 🎨 主题切换：支持明暗两种主题模式
- 🔧 系统托盘：最小化到系统托盘，保持应用在后台运行
- ⌨️ 快捷键配置：自定义全局快捷键
- 🔄 自动更新：内置自动更新功能
- 🚀 性能监控：实时显示系统内存使用情况
- 🎯 自定义设置：
  - 开机自启动
  - 最小化到托盘
  - 窗口大小记忆
  - 主题偏好保存

## 安装说明

1. 确保已安装 Node.js (推荐 v14.0.0 或更高版本)
2. 克隆仓库到本地：
   ```bash
   git clone https://github.com/your-username/electron-play.git
   ```
3. 安装依赖：
   ```bash
   cd electron-play
   npm install
   ```

## 开发说明

启动开发服务器：
```bash
 npm start
```

打包应用：
```bash
 npm run build
```

## 技术栈

- Electron
- Node.js
- electron-store (配置存储)
- electron-updater (自动更新)

## 项目结构

```
├── main.js          # 主进程文件
├── preload.js       # 预加载脚本
├── index.html       # 主窗口界面
├── settings.html    # 设置界面
├── package.json     # 项目配置文件
└── README.md       # 项目说明文档
```

## 许可证

MIT License