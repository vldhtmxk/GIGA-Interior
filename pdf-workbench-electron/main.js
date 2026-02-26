const path = require("node:path");
const fs = require("node:fs/promises");
const { app, BrowserWindow, dialog, ipcMain } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 1320,
    height: 900,
    minWidth: 1100,
    minHeight: 760,
    backgroundColor: "#f1f5f9",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  win.loadFile(path.join(__dirname, "renderer", "index.html"));
}

ipcMain.handle("dialog:save", async (_event, options = {}) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: options.title || "파일 저장",
    defaultPath: options.defaultPath,
    filters: options.filters || []
  });
  return { canceled, filePath };
});

ipcMain.handle("file:write", async (_event, payload) => {
  const { filePath, bytes } = payload || {};
  if (!filePath) throw new Error("filePath가 필요합니다.");
  if (!bytes) throw new Error("bytes가 필요합니다.");
  const buffer = Buffer.from(bytes);
  await fs.writeFile(filePath, buffer);
  return { ok: true, size: buffer.length };
});

ipcMain.handle("app:info", () => ({
  version: app.getVersion(),
  name: app.getName()
}));

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
