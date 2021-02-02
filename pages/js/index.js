const { ipcRenderer } = require("electron");
let ver = document.getElementById("version");

let version = ipcRenderer.sendSync("version");
ver.innerHTML = version;
