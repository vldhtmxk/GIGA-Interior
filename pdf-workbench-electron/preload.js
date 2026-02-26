const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveDialog: (options) => ipcRenderer.invoke("dialog:save", options),
  writeFile: (filePath, uint8Array) =>
    ipcRenderer.invoke("file:write", {
      filePath,
      bytes: Array.from(uint8Array)
    }),
  getAppInfo: () => ipcRenderer.invoke("app:info")
});
