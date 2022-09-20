const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('msg', {
  showMsg: function (msg) {
    ipcRenderer.invoke('msg', msg);
  },
})

contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => ipcRenderer.invoke('ping'),
  // 渲染进程  到  主进程
  setTitle: (title) => ipcRenderer.send('set-title', title),
  SelectFile: () => ipcRenderer.invoke('SelectFile'),
  // 主进程  到  渲染进程
  handleCounter: (cb) => { ipcRenderer.on('update-counter', cb) }
})


// 预加载脚本在渲染进程加载之前加载，并有权访问两个 渲染器全局 (例如 window 和 document) 和 Node.js 环境。
window.addEventListener('DOMContentLoaded', () => {

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})
