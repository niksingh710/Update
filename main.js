const { app, BrowserWindow, Menu, ipcMain } = require("electron");

let menuTemplate = [
  {
    label: "Tools",
    submenu: [
      {
        role: "toggleDevTools",
      },
    ],
  },
];

const createWindow = () => {
  let win = new BrowserWindow({
    width: 500,
    height: 200,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  let appVersion = app.getVersion();
  console.log(appVersion);
  ipcMain.on("version", (e) => {
    e.returnValue = appVersion;
  });

  let menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  win.loadFile(`${__dirname}/pages/index.html`);

  win.once("ready-to-show", win.show);
};

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// TODO: Not in Production Line
try {
  require("electron-reloader")(module);
} catch (_) {}
