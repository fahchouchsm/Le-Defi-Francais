const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');
const { fileURLToPath } = require('node:url');

const practiceUrls = new Set([
  'https://apprendre.tv5monde.com/fr/tcf/simulation-du-tcf',
  'https://apprendre.tv5monde.com/fr/tcf/test-dentrainement-au-tcf?competence=CO&tcf_lot_id=58',
  'https://apprendre.tv5monde.com/fr/tcf',
  'https://apprendre.tv5monde.com/fr/article/les-livrets-dentrainement-au-tcf-r-avec-tv5monde',
  'https://www.france-education-international.fr/test/exemples-epreuves-tcf',
]);

function createWindow() {
  const window = new BrowserWindow({
    minWidth: 960,
    minHeight: 700,
    backgroundColor: '#f7f7f2',
    title: 'Le Défi Français',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (practiceUrls.has(url)) {
      setImmediate(() => { shell.openExternal(url).catch(console.error); });
    } else if (url.startsWith('file:')) {
      try {
        const file = fileURLToPath(url);
        if (path.dirname(file) === path.join(__dirname, 'tcf-offline')
          && /^tcf(?:[1-9]|1[0-7])(?:-podcast\.mp3|(?:_2|-livret-complet(?:_0)?)?\.pdf)$/.test(path.basename(file))) {
          setImmediate(() => { shell.openPath(file).then((error) => { if (error) console.error(error); }).catch(console.error); });
        }
      } catch { /* Ignore malformed local URLs. */ }
    }
    return { action: 'deny' };
  });
  window.loadFile(path.join(__dirname, 'index.html'));
  window.maximize();
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (!BrowserWindow.getAllWindows().length) createWindow();
});
