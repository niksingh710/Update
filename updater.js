const { autoUpdater } = require("electron-updater");
const { dialog, BrowserWindow, ipcMain } = require("electron");
autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "verbose";

autoUpdater.autoDownload = false;

let dp = 0;

exports.check = (manual = false) => {
  autoUpdater.checkForUpdates();
  autoUpdater.logger.info("Going to prompt");

  if (manual) {
    autoUpdater.on("update-not-available", () => {
      dialog.showMessageBox({
        type: "info",
        title: "Update Not Here",
        message: "No New Update is Available",
        buttons: ["Ok"],
      });
    });
  }
  autoUpdater.on("update-available", (updateInfo) => {
    dialog
      .showMessageBox({
        type: "info",
        title: "Update",
        message: `A new Version ${updateInfo.version} is Available Do you want to update?`,
        buttons: ["Yes", "No"],
      })
      .then((index) => {
        autoUpdater.logger.info(index);
        if (index.response !== 0) {
          return;
        } else {
          autoUpdater.logger.info(dp);
          autoUpdater.downloadUpdate();

          let progressWin = new BrowserWindow({
            width: 350,
            height: 35,
            useContentSize: true,
            // resizable: false,
            maximizable: false,
            autoHideMenuBar: true,
            fullscreen: false,
            fullscreenable: false,
            webPreferences: {
              nodeIntegration: true,
            },
          });

          progressWin.loadFile(`${__dirname}/progress.html`);
          autoUpdater.logger.info(dp);

          progressWin.on("close", () => {
            progressWin = null;
          });

          ipcMain.on("progress-request", (e) => {
            e.returnValue = dp;
          });

          autoUpdater.on("download-progress", (d) => {
            dp = d.percent;

            autoUpdater.logger.info("progress", d.percent);
          });

          autoUpdater.on("update-downloaded", () => {
            autoUpdater.logger.info("Downloaded.......");
            if (progressWin) {
              progressWin.close();
            }
            dialog
              .showMessageBox({
                type: "info",
                title: "Update Ready",
                message: "New Update is ready to install. Quit and Install?",
                buttons: ["Yes", "Later"],
              })
              .then((index) => {
                if (index.response === 0) {
                  autoUpdater.quitAndInstall();
                }
              });
          });
        }
      });
  });
};
