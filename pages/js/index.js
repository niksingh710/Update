const { ipcRenderer } = require("electron");
let ver = document.getElementById("version");
let btn = document.getElementById("btn");

let version = ipcRenderer.sendSync("version");
ver.innerHTML = version;

btn.addEventListener("click", () => {
  ipcRenderer.send("update");
});
