// app.js — Product Scraper frontend.
// Sends target URLs to the Cloudflare Worker backend, which fetches & parses
// each page server-side and returns product name / price. Results become a
// table you can export as CSV.

// Set this to your deployed Worker URL (see product-scraper-worker/README.md).
const WORKER_URL = "https://product-scraper.YOUR-SUBDOMAIN.workers.dev";

// Allow overriding the endpoint without redeploying (stored in the browser).
function endpoint() {
  return (localStorage.getItem("scraperWorkerUrl") || WORKER_URL).trim().replace(/\/+$/, "");
}

const urls       = document.getElementById("urls");
const runBtn      = document.getElementById("runBtn");
const status      = document.getElementById("status");
const tableWrap   = document.getElementById("tableWrap");
const tbody       = document.getElementById("tbody");
const csvBtn       = document.getElementById("csvBtn");
const clearBtn     = document.getElementById("clearBtn");
const apiInput     = document.getElementById("apiInput");

let rows = []; // { name, price, currency, url }

function setStatus(t) { status.textContent = t || ""; }

// --- settings field ---
apiInput.value = localStorage.getItem("scraperWorkerUrl") || "";
apiInput.placeholder = WORKER_URL;
apiInput.addEventListener("change", () => {
  const v = apiInput.value.trim();
  if (v) localStorage.setItem("scraperWorkerUrl", v);
  else localStorage.removeItem("scraperWorkerUrl");
});

async function scrapeOne(url) {
  const res = await fetch(endpoint() + "/?url=" + encodeURIComponent(url));
  const data = await res.json().catch(() => ({ error: "応答の解析に失敗" }));
  if (!res.ok || data.error) throw new Error(data.error || ("HTTP " + res.status));
  return data.products || [];
}

function renderRows() {
  tbody.innerHTML = "";
  rows.forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.className = "border-b border-surface-container";
    tr.innerHTML =
      `<td class="py-2 pr-4 font-body-md text-body-md align-top">${i + 1}</td>` +
      `<td class="py-2 pr-4 font-body-md text-body-md align-top">${esc(r.name)}</td>` +
      `<td class="py-2 pr-4 font-body-md text-body-md align-top whitespace-nowrap">${esc(r.price)}</td>` +
      `<td class="py-2 pr-4 font-label-sm text-label-sm text-outline align-top">${esc(r.currency)}</td>` +
      `<td class="py-2 font-label-sm text-label-sm align-top"><a href="${esc(r.url)}" target="_blank" rel="noopener" class="text-secondary underline break-all">link</a></td>`;
    tbody.appendChild(tr);
  });
  tableWrap.classList.toggle("hidden", rows.length === 0);
  csvBtn.disabled = rows.length === 0;
}

runBtn.addEventListener("click", async () => {
  const list = urls.value.split("\n").map((s) => s.trim()).filter(Boolean);
  if (list.length === 0) { setStatus("URL を1行に1つ入力してください。"); return; }
  if (endpoint().includes("YOUR-SUBDOMAIN")) {
    setStatus("⚠ Worker のURLが未設定です。下の「詳細設定」にデプロイ済みのURLを入力してください。");
    return;
  }

  runBtn.disabled = true;
  rows = [];
  renderRows();
  let ok = 0, fail = 0;

  for (let i = 0; i < list.length; i++) {
    setStatus(`取得中… ${i + 1}/${list.length}`);
    try {
      const products = await scrapeOne(list[i]);
      if (products.length === 0) {
        rows.push({ name: "（商品情報が見つかりません）", price: "", currency: "", url: list[i] });
        fail++;
      } else {
        products.forEach((p) =>
          rows.push({ name: p.name, price: p.price, currency: p.currency, url: p.url || list[i] })
        );
        ok++;
      }
    } catch (e) {
      rows.push({ name: "（エラー: " + e.message + "）", price: "", currency: "", url: list[i] });
      fail++;
    }
    renderRows();
  }

  setStatus(`完了：${rows.length} 件抽出（成功URL ${ok} / 失敗 ${fail}）`);
  runBtn.disabled = false;
});

csvBtn.addEventListener("click", () => {
  const header = ["商品名", "価格", "通貨", "URL"];
  const lines = [header, ...rows.map((r) => [r.name, r.price, r.currency, r.url])];
  const csv = lines.map((cols) => cols.map(csvCell).join(",")).join("\r\n");
  // UTF-8 BOM so Excel reads Japanese correctly
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "products.csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

clearBtn.addEventListener("click", () => {
  rows = [];
  urls.value = "";
  renderRows();
  setStatus("");
});

function csvCell(v) {
  const s = v == null ? "" : String(v);
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function esc(v) {
  return (v == null ? "" : String(v))
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

renderRows();
