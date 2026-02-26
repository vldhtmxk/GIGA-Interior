(() => {
  const { PDFDocument } = window.PDFLib || {};
  const JSZip = window.JSZip;
  if (!PDFDocument || !JSZip) {
    const onLoad = () => {
      const el = document.getElementById("status");
      if (el) el.textContent = "필수 라이브러리 로드 실패 (pdf-lib / JSZip)";
    };
    window.addEventListener("load", onLoad);
    return;
  }

  const state = {
    mode: "merge",
    splitMode: "range",
    files: [],
    busy: false,
    cancelRequested: false,
    pageCount: null,
  };

  const $ = (id) => document.getElementById(id);
  const els = {
    dropZone: $("dropZone"),
    dropTitle: $("dropTitle"),
    dropDesc: $("dropDesc"),
    fileInput: $("fileInput"),
    pickBtn: $("pickBtn"),
    clearBtn: $("clearBtn"),
    fileList: $("fileList"),
    emptyList: $("emptyList"),
    splitPanel: $("splitPanel"),
    rangeWrap: $("rangeWrap"),
    chunkWrap: $("chunkWrap"),
    rangeInput: $("rangeInput"),
    chunkInput: $("chunkInput"),
    rangeFeedback: $("rangeFeedback"),
    splitInfo: $("splitInfo"),
    summaryMode: $("summaryMode"),
    summaryCount: $("summaryCount"),
    summarySplit: $("summarySplit"),
    outName: $("outName"),
    runBtn: $("runBtn"),
    cancelBtn: $("cancelBtn"),
    progressBar: $("progressBar"),
    progressText: $("progressText"),
    status: $("status"),
    fileHint: $("fileHint"),
    modeBtns: [...document.querySelectorAll(".mode-btn")],
    splitBtns: [...document.querySelectorAll(".split-btn")],
  };

  const fmtBytes = (b) => {
    if (b < 1024) return `${b} B`;
    if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / 1024 ** 2).toFixed(1)} MB`;
  };
  const splitModeLabel = (m) => (m === "range" ? "페이지 범위" : m === "single" ? "개별 페이지" : "N페이지 단위");
  const safePdfName = (name, fallback = "merged.pdf") => {
    const s = (name || "").trim().replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_");
    if (!s) return fallback;
    return s.toLowerCase().endsWith(".pdf") ? s : `${s}.pdf`;
  };

  function setStatus(text, tone = "neutral") {
    els.status.textContent = text;
    const map = {
      neutral: "mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600",
      success: "mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700",
      warn: "mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700",
      error: "mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700",
    };
    els.status.className = map[tone] || map.neutral;
  }

  function setProgress(v) {
    const p = Math.max(0, Math.min(100, Math.round(v)));
    els.progressBar.style.width = `${p}%`;
    els.progressText.textContent = `${p}%`;
  }

  function parseRanges(text) {
    const clean = (text || "").replace(/\s+/g, "");
    if (!clean) return { ok: false, error: "페이지 범위를 입력하세요." };
    const parts = clean.split(",");
    const ranges = [];
    for (const part of parts) {
      if (!part) return { ok: false, error: "쉼표 사이 값이 비어 있습니다." };
      if (/^\d+$/.test(part)) {
        const n = Number(part);
        if (n < 1) return { ok: false, error: "페이지 번호는 1 이상이어야 합니다." };
        ranges.push([n, n]);
      } else if (/^\d+-\d+$/.test(part)) {
        const [s, e] = part.split("-").map(Number);
        if (s < 1 || e < 1) return { ok: false, error: "페이지 번호는 1 이상이어야 합니다." };
        if (s > e) return { ok: false, error: `시작 페이지가 끝 페이지보다 큽니다: ${part}` };
        ranges.push([s, e]);
      } else {
        return { ok: false, error: `형식 오류: ${part} (예: 1-3,5,8-10)` };
      }
    }
    return { ok: true, ranges };
  }

  function updateRangeFeedback() {
    if (state.mode !== "split" || state.splitMode !== "range") {
      els.rangeFeedback.textContent = "";
      return;
    }
    const parsed = parseRanges(els.rangeInput.value);
    if (!parsed.ok) {
      els.rangeFeedback.className = "mt-2 text-xs text-rose-600";
      els.rangeFeedback.textContent = parsed.error;
      return;
    }
    if (state.pageCount && parsed.ranges.some((r) => r[1] > state.pageCount)) {
      els.rangeFeedback.className = "mt-2 text-xs text-rose-600";
      els.rangeFeedback.textContent = `문서 페이지 수(${state.pageCount})를 초과했습니다.`;
      return;
    }
    els.rangeFeedback.className = "mt-2 text-xs text-emerald-600";
    els.rangeFeedback.textContent = "유효한 범위 형식입니다.";
  }

  function updateSummary() {
    els.summaryMode.textContent = state.mode === "merge" ? "병합" : "분리";
    els.summaryCount.textContent = `${state.files.length}개`;
    els.summarySplit.textContent = state.mode === "split" ? splitModeLabel(state.splitMode) : "-";
  }

  function updateSplitInfo() {
    if (state.mode !== "split") return;
    if (!state.files[0]) {
      els.splitInfo.textContent = "분리할 PDF 1개를 선택하세요.";
      return;
    }
    if (!state.pageCount) {
      els.splitInfo.textContent = `선택됨: ${state.files[0].file.name} · 페이지 수 분석 중...`;
      return;
    }
    els.splitInfo.textContent = `선택됨: ${state.files[0].file.name} · 총 ${state.pageCount}페이지`;
  }

  function updateButtons() {
    let canRun = false;
    if (state.mode === "merge") {
      canRun = state.files.length >= 2;
    } else if (state.files[0]) {
      if (state.splitMode === "single") canRun = true;
      if (state.splitMode === "chunk") canRun = Number(els.chunkInput.value) > 0;
      if (state.splitMode === "range") {
        const parsed = parseRanges(els.rangeInput.value);
        canRun = parsed.ok;
        if (canRun && state.pageCount) canRun = !parsed.ranges.some((r) => r[1] > state.pageCount);
      }
    }
    els.runBtn.disabled = state.busy || !canRun;
    els.cancelBtn.disabled = !state.busy;
  }

  function updateModeUI() {
    const merge = state.mode === "merge";
    els.splitPanel.classList.toggle("hidden", merge);
    els.fileInput.multiple = merge;
    els.dropTitle.textContent = merge ? "여러 PDF를 드래그해서 추가" : "분리할 PDF 1개를 드래그해서 추가";
    els.dropDesc.textContent = merge ? "또는 아래 버튼으로 선택하세요." : "분리 모드는 첫 번째 파일만 사용합니다.";
    els.fileHint.textContent = merge ? "병합은 2개 이상, 분리는 1개만 사용" : "분리 모드는 1개 파일만 사용";
    els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === state.mode));
    if (!merge && state.files.length > 1) state.files = state.files.slice(0, 1);
    renderFileList();
    updateSplitModeUI();
    updateSummary();
    updateButtons();
  }

  function updateSplitModeUI() {
    els.splitBtns.forEach((b) => b.classList.toggle("active", b.dataset.split === state.splitMode));
    els.rangeWrap.classList.toggle("hidden", state.splitMode !== "range");
    els.chunkWrap.classList.toggle("hidden", state.splitMode !== "chunk");
    updateRangeFeedback();
    updateSplitInfo();
    updateSummary();
    updateButtons();
  }

  function renderFileList() {
    els.fileList.innerHTML = "";
    els.emptyList.classList.toggle("hidden", state.files.length > 0);
    state.files.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "file-item";
      li.innerHTML = `
        <div class="file-left">
          <span class="file-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6M7 3h6l4 4v14H7a2 2 0 01-2-2V5a2 2 0 012-2z"/>
            </svg>
          </span>
          <div class="min-w-0">
            <span class="file-name" title="${item.file.name}">${item.file.name}</span>
            <span class="file-size">${fmtBytes(item.file.size)}</span>
          </div>
        </div>
        <div class="flex items-center gap-1">
          ${
            state.mode === "merge"
              ? `<button class="mini-btn" data-act="up" data-id="${item.id}" ${index === 0 ? "disabled" : ""}>↑</button>
                 <button class="mini-btn" data-act="down" data-id="${item.id}" ${index === state.files.length - 1 ? "disabled" : ""}>↓</button>`
              : `<span class="text-xs text-slate-400">${index === 0 ? "사용" : "미사용"}</span>`
          }
        </div>
        <div class="text-right"><button class="remove-btn" data-act="remove" data-id="${item.id}">제거</button></div>
      `;
      els.fileList.appendChild(li);
    });
    updateSummary();
  }

  async function inspectSplitPdf() {
    state.pageCount = null;
    updateSplitInfo();
    updateRangeFeedback();
    const source = state.files[0];
    if (!source || state.mode !== "split") return;
    try {
      const bytes = await source.file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      state.pageCount = doc.getPageCount();
      updateSplitInfo();
      updateRangeFeedback();
      updateButtons();
    } catch (e) {
      setStatus(`PDF 분석 실패: ${e.message || e}`, "error");
    }
  }

  async function addFiles(fileList) {
    const incoming = [...(fileList || [])].filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (!incoming.length) {
      setStatus("PDF 파일만 추가할 수 있습니다.", "warn");
      return;
    }
    const mapped = incoming.map((file) => ({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, file }));
    state.files = state.mode === "split" ? [mapped[0]] : [...state.files, ...mapped];
    renderFileList();
    updateButtons();
    if (state.mode === "split") await inspectSplitPdf();
    setStatus(`${mapped.length}개 파일을 추가했습니다.`, "success");
  }

  function removeFile(id) {
    state.files = state.files.filter((f) => f.id !== id);
    if (state.mode === "split") state.pageCount = null;
    renderFileList();
    updateSplitInfo();
    updateRangeFeedback();
    updateButtons();
  }

  function moveFile(id, dir) {
    const i = state.files.findIndex((f) => f.id === id);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= state.files.length) return;
    [state.files[i], state.files[j]] = [state.files[j], state.files[i]];
    renderFileList();
  }

  function clearFiles() {
    state.files = [];
    state.pageCount = null;
    renderFileList();
    updateSplitInfo();
    updateRangeFeedback();
    updateButtons();
    setProgress(0);
    setStatus("목록을 비웠습니다.", "neutral");
  }

  async function saveBlob(blob, filename, mimeType = "application/octet-stream") {
    const electronAPI = window.electronAPI;
    if (electronAPI?.saveDialog && electronAPI?.writeFile) {
      const { canceled, filePath } = await electronAPI.saveDialog({
        title: "파일 저장",
        defaultPath: filename,
        filters: mimeType === "application/zip"
          ? [{ name: "ZIP 파일", extensions: ["zip"] }]
          : [{ name: "PDF 파일", extensions: ["pdf"] }]
      });
      if (canceled || !filePath) throw new Error("저장이 취소되었습니다.");
      const bytes = new Uint8Array(await blob.arrayBuffer());
      await electronAPI.writeFile(filePath, bytes);
      return filePath;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return filename;
  }

  function throwIfCancelled() {
    if (state.cancelRequested) throw new Error("사용자 취소 요청");
  }

  async function runMerge() {
    const out = await PDFDocument.create();
    setStatus("병합 시작...", "neutral");
    setProgress(5);
    for (let i = 0; i < state.files.length; i += 1) {
      throwIfCancelled();
      const item = state.files[i];
      setStatus(`병합 중 (${i + 1}/${state.files.length}): ${item.file.name}`, "neutral");
      const src = await PDFDocument.load(await item.file.arrayBuffer());
      const pages = await out.copyPages(src, src.getPageIndices());
      pages.forEach((p) => out.addPage(p));
      setProgress(10 + ((i + 1) / state.files.length) * 80);
      await new Promise((r) => setTimeout(r, 0));
    }
    throwIfCancelled();
    const bytes = await out.save();
    const filename = safePdfName(els.outName.value, "merged.pdf");
    const saved = await saveBlob(new Blob([bytes], { type: "application/pdf" }), filename, "application/pdf");
    setProgress(100);
    setStatus(`병합 완료: ${saved}`, "success");
  }

  function buildSplitTasks() {
    const total = state.pageCount || 0;
    if (state.splitMode === "single") return Array.from({ length: total }, (_, i) => [i + 1, i + 1]);
    if (state.splitMode === "chunk") {
      const size = Number(els.chunkInput.value);
      if (!Number.isFinite(size) || size < 1) throw new Error("유효한 분할 단위를 입력하세요.");
      const tasks = [];
      for (let p = 1; p <= total; p += size) tasks.push([p, Math.min(total, p + size - 1)]);
      return tasks;
    }
    const parsed = parseRanges(els.rangeInput.value);
    if (!parsed.ok) throw new Error(parsed.error);
    if (total && parsed.ranges.some((r) => r[1] > total)) throw new Error(`문서 페이지 수(${total}) 초과`);
    return parsed.ranges;
  }

  async function runSplit() {
    const source = state.files[0];
    if (!source) throw new Error("분리할 PDF를 선택하세요.");
    const srcDoc = await PDFDocument.load(await source.file.arrayBuffer());
    state.pageCount = srcDoc.getPageCount();
    updateSplitInfo();
    const tasks = buildSplitTasks();
    if (!tasks.length) throw new Error("분리 작업이 없습니다.");

    setStatus(`분리 시작 (${tasks.length}개 결과 예정)...`, "neutral");
    setProgress(5);
    const zip = new JSZip();
    const base = source.file.name.replace(/\.pdf$/i, "") || "document";

    for (let i = 0; i < tasks.length; i += 1) {
      throwIfCancelled();
      const [s, e] = tasks[i];
      const out = await PDFDocument.create();
      const idx = Array.from({ length: e - s + 1 }, (_, k) => s - 1 + k);
      const pages = await out.copyPages(srcDoc, idx);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      zip.file(`${base}_${String(s).padStart(3, "0")}-${String(e).padStart(3, "0")}.pdf`, bytes);
      setStatus(`분리 중 (${i + 1}/${tasks.length}): ${s}-${e} 페이지`, "neutral");
      setProgress(10 + ((i + 1) / tasks.length) * 80);
      await new Promise((r) => setTimeout(r, 0));
    }

    throwIfCancelled();
    if (tasks.length === 1) {
      const fileName = Object.keys(zip.files)[0];
      const blob = await zip.file(fileName).async("blob");
      const saved = await saveBlob(blob, fileName, "application/pdf");
      setProgress(100);
      setStatus(`분리 완료: ${saved}`, "success");
      return;
    }

    setStatus("ZIP 생성 중...", "neutral");
    const zipBlob = await zip.generateAsync({ type: "blob" }, (m) => setProgress(90 + m.percent / 10));
    const zipName = `${base}_split.zip`;
    const saved = await saveBlob(zipBlob, zipName, "application/zip");
    setProgress(100);
    setStatus(`분리 완료: ${saved}`, "success");
  }

  async function run() {
    if (state.busy) return;
    state.busy = true;
    state.cancelRequested = false;
    updateButtons();
    setProgress(0);
    try {
      if (state.mode === "merge") await runMerge();
      else await runSplit();
    } catch (e) {
      if (String(e.message || e).includes("취소")) setStatus("작업이 취소되었습니다.", "warn");
      else setStatus(`실행 실패: ${e.message || e}`, "error");
    } finally {
      state.busy = false;
      updateButtons();
    }
  }

  function bind() {
    els.pickBtn.addEventListener("click", () => els.fileInput.click());
    els.fileInput.addEventListener("change", (e) => addFiles(e.target.files));
    els.clearBtn.addEventListener("click", clearFiles);
    els.runBtn.addEventListener("click", run);
    els.cancelBtn.addEventListener("click", () => {
      if (!state.busy) return;
      state.cancelRequested = true;
      setStatus("취소 요청을 받았습니다. 현재 단계 종료 후 중단합니다.", "warn");
    });

    els.dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      els.dropZone.classList.add("dragover");
    });
    els.dropZone.addEventListener("dragleave", () => els.dropZone.classList.remove("dragover"));
    els.dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      els.dropZone.classList.remove("dragover");
      addFiles(e.dataTransfer.files);
    });

    els.fileList.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-act]");
      if (!btn) return;
      const { act, id } = btn.dataset;
      if (act === "remove") removeFile(id);
      if (act === "up") moveFile(id, -1);
      if (act === "down") moveFile(id, 1);
      updateButtons();
    });

    els.modeBtns.forEach((btn) =>
      btn.addEventListener("click", async () => {
        if (state.busy) return;
        state.mode = btn.dataset.mode;
        if (state.mode === "split" && state.files.length > 1) state.files = state.files.slice(0, 1);
        updateModeUI();
        if (state.mode === "split") await inspectSplitPdf();
        setStatus(`${state.mode === "merge" ? "병합" : "분리"} 모드로 전환했습니다.`, "neutral");
      }),
    );

    els.splitBtns.forEach((btn) =>
      btn.addEventListener("click", () => {
        state.splitMode = btn.dataset.split;
        updateSplitModeUI();
        setStatus(`분리 방식: ${splitModeLabel(state.splitMode)}`, "neutral");
      }),
    );

    els.rangeInput.addEventListener("input", () => {
      updateRangeFeedback();
      updateButtons();
    });
    els.chunkInput.addEventListener("input", updateButtons);
  }

  bind();
  updateModeUI();
  setProgress(0);
  setStatus("준비 완료. PDF 파일을 추가해 주세요.", "success");
})();
