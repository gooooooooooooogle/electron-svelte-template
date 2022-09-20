const { app, BrowserWindow, Notification } = require('electron');
const path = require('path')

const URL = process.env.NODE_ENV === 'development'
  ? `http://localhost:5173`
  : `file://${path.join(__dirname, '../dist/index.html')}`

let mainForm = null;
function createWindow() {
  mainForm = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: path.join(__dirname, '../public/icons/icon32.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  });

  mainForm.loadURL(URL)
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
}).then(() => {
  new Notification({ title: '您好', body: '系统已启动' }).show();
})

app.on('closed', () => {
  mainForm = null;
});

app.on('window-all-closed', () => {
  // win32 : (Windows), linux (Linux) 
  // darwin: (macOS) 
  if (process.platform !== 'darwin') app.quit();
})