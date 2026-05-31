// app.js — Background Remover (fully in-browser)
//
// Uses Hugging Face transformers.js with the RMBG-1.4 segmentation model.
// Everything runs client-side (WASM); images never leave the browser.

import { env, AutoModel, AutoProcessor, RawImage }
  from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2";

// Always fetch the model from the HF hub (no local model files bundled).
env.allowLocalModels = false;

// --- DOM ---
const fileInput  = document.getElementById("fileInput");
const dropZone   = document.getElementById("dropZone");
const stage      = document.getElementById("stage");
const beforeImg  = document.getElementById("beforeImg");
const resultWrap = document.getElementById("resultWrap");
const resultCanvas = document.getElementById("resultCanvas");
const status     = document.getElementById("status");
const bar        = document.getElementById("bar");
const barWrap    = document.getElementById("barWrap");
const downloadBtn= document.getElementById("downloadBtn");
const resetBtn   = document.getElementById("resetBtn");
const bgSwatches = document.querySelectorAll("[data-bg]");

const MAX_DIM = 2048; // cap processing size to keep it responsive

let model = null;
let processor = null;
let cutoutCanvas = null; // transparent-background result
let currentBg = "transparent";

function setStatus(text) { status.textContent = text || ""; }
function showBar(show) { barWrap.style.opacity = show ? "1" : "0"; }
function setBar(p) { bar.style.width = Math.round(p * 100) + "%"; }

// Lazily load the model on first use, reporting download progress.
async function ensureModel() {
  if (model && processor) return;
  setStatus("モデルを読み込み中…（初回のみ・約44MB）");
  showBar(true);
  const progress = (data) => {
    if (data.status === "progress" && data.total) {
      setBar(data.loaded / data.total);
    }
  };
  model = await AutoModel.from_pretrained("briaai/RMBG-1.4", {
    config: { model_type: "custom" },
    progress_callback: progress,
  });
  processor = await AutoProcessor.from_pretrained("briaai/RMBG-1.4", {
    config: {
      do_normalize: true,
      do_pad: false,
      do_rescale: true,
      do_resize: true,
      image_mean: [0.5, 0.5, 0.5],
      image_std: [1, 1, 1],
      resample: 2,
      size: { width: 1024, height: 1024 },
    },
  });
  showBar(false);
  setBar(0);
}

async function handleFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    setStatus("画像ファイルを選んでください。");
    return;
  }
  const url = URL.createObjectURL(file);
  beforeImg.src = url;
  stage.classList.remove("hidden");
  dropZone.classList.add("hidden");
  downloadBtn.disabled = true;

  try {
    await ensureModel();
    setStatus("背景を解析中…（PCのChrome推奨。数秒〜十数秒かかります）");
    showBar(true);
    setBar(0.15);

    // Load image, downscale if very large.
    let image = await RawImage.fromURL(url);
    if (Math.max(image.width, image.height) > MAX_DIM) {
      const scale = MAX_DIM / Math.max(image.width, image.height);
      image = await image.resize(Math.round(image.width * scale), Math.round(image.height * scale));
    }

    // Run the model.
    const { pixel_values } = await processor(image);
    setBar(0.6);
    const { output } = await model({ input: pixel_values });
    setBar(0.85);

    // Build alpha mask at original size and composite onto a transparent canvas.
    const mask = await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(image.width, image.height);

    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image.toCanvas(), 0, 0);
    const pixels = ctx.getImageData(0, 0, image.width, image.height);
    for (let i = 0; i < mask.data.length; i++) {
      pixels.data[4 * i + 3] = mask.data[i];
    }
    ctx.putImageData(pixels, 0, 0);
    cutoutCanvas = canvas;

    render();
    setBar(1);
    showBar(false);
    setStatus("完了！背景色を選んでダウンロードできます。");
    downloadBtn.disabled = false;
  } catch (err) {
    console.error(err);
    showBar(false);
    setStatus("処理に失敗しました：" + (err?.message || err));
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Render the cutout onto the result canvas with the chosen background.
function render() {
  if (!cutoutCanvas) return;
  const c = resultCanvas;
  c.width = cutoutCanvas.width;
  c.height = cutoutCanvas.height;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  if (currentBg !== "transparent") {
    ctx.fillStyle = currentBg;
    ctx.fillRect(0, 0, c.width, c.height);
  }
  ctx.drawImage(cutoutCanvas, 0, 0);
  // toggle checkerboard backing only when transparent
  resultWrap.classList.toggle("checker", currentBg === "transparent");
}

function download() {
  if (!cutoutCanvas) return;
  resultCanvas.toBlob((blob) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = currentBg === "transparent" ? "cutout.png" : "image.png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }, "image/png");
}

function reset() {
  cutoutCanvas = null;
  beforeImg.removeAttribute("src");
  stage.classList.add("hidden");
  dropZone.classList.remove("hidden");
  downloadBtn.disabled = true;
  setStatus("");
  fileInput.value = "";
}

// --- events ---
fileInput.addEventListener("change", (e) => handleFile(e.target.files[0]));

["dragenter", "dragover"].forEach((ev) =>
  dropZone.addEventListener(ev, (e) => { e.preventDefault(); dropZone.classList.add("border-secondary", "text-secondary"); })
);
["dragleave", "drop"].forEach((ev) =>
  dropZone.addEventListener(ev, (e) => { e.preventDefault(); dropZone.classList.remove("border-secondary", "text-secondary"); })
);
dropZone.addEventListener("drop", (e) => {
  const file = e.dataTransfer?.files?.[0];
  if (file) handleFile(file);
});
dropZone.addEventListener("click", () => fileInput.click());

bgSwatches.forEach((el) => {
  el.addEventListener("click", () => {
    currentBg = el.dataset.bg;
    bgSwatches.forEach((s) => s.classList.remove("ring-2", "ring-primary"));
    el.classList.add("ring-2", "ring-primary");
    render();
  });
});

downloadBtn.addEventListener("click", download);
resetBtn.addEventListener("click", reset);
