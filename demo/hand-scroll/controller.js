// controller.js — Web demo version of the Hand Scroll gesture controller.
//
// Ported from the Chrome extension's gesture-scroll-controller.js.
// The only differences from the extension version are:
//   - imports MediaPipe from the local ./lib copy (instead of ../lib)
//   - resolves the WASM directory with import.meta.url (instead of chrome.runtime.getURL)
// The gesture-recognition logic itself is identical.
//
//   🖐 Open_Palm → スクロールモード（フレームを上/停止/下の3ゾーンに分割、手の高さで連続スクロール）

import { GestureRecognizer, FilesetResolver } from "./lib/vision_bundle.mjs";

const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/latest/gesture_recognizer.task";

export class ScrollGestureController {
  constructor(options = {}) {
    this.minConfidence    = options.minConfidence    ?? 0.55;
    this.upZone           = options.upZone           ?? 0.42;
    this.downZone         = options.downZone         ?? 0.58;
    this.scrollMultiplier = options.scrollMultiplier ?? 600;

    this._recognizer = null;
    this._video      = null;
    this._running    = false;
    this._rafId      = null;
    this._lastTime   = -1;

    this._onScroll      = null;
    this._onStateChange = null;
  }

  async init() {
    // WASM lives next to this module, under ./lib/wasm
    const wasmUrl = new URL("./lib/wasm", import.meta.url).href;
    const vision  = await FilesetResolver.forVisionTasks(wasmUrl);
    this._recognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: { modelAssetPath: MODEL_URL },
      runningMode: "VIDEO",
      numHands: 1,
    });
  }

  /** @param {(amount: number) => void} cb  正 = 下スクロール、負 = 上スクロール (px) */
  onScroll(cb) { this._onScroll = cb; }

  /** @param {(state: 'IDLE'|'ACTIVE', info: object) => void} cb */
  onStateChange(cb) { this._onStateChange = cb; }

  start(videoEl) {
    if (!this._recognizer) throw new Error("init() を先に呼んでください");
    this._video   = videoEl;
    this._running = true;
    this._loop();
  }

  stop() {
    this._running = false;
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this._rafId = null;
    if (this._onStateChange) this._onStateChange('IDLE', {});
  }

  _loop() {
    if (!this._running) return;
    const v = this._video;
    if (v && v.readyState >= 2 && v.currentTime !== this._lastTime) {
      this._lastTime = v.currentTime;
      try {
        this._handleResult(this._recognizer.recognizeForVideo(v, performance.now()));
      } catch (_) {}
    }
    this._rafId = requestAnimationFrame(() => this._loop());
  }

  _handleResult(result) {
    const detected = this._extract(result);

    if (!detected) {
      if (this._onStateChange) this._onStateChange('IDLE', {});
      return;
    }

    this._handleScroll(detected);
  }

  _handleScroll({ y }) {
    let zone      = 'neutral';
    let intensity = 0; // 0〜1：ゾーン境界 = 0、端 = 1

    if (y < this.upZone) {
      zone      = 'up';
      intensity = (this.upZone - y) / this.upZone;
    } else if (y > this.downZone) {
      zone      = 'down';
      intensity = (y - this.downZone) / (1 - this.downZone);
    }

    if (this._onStateChange) {
      this._onStateChange('ACTIVE', { mode: 'scroll', zone, y, intensity });
    }

    if (zone !== 'neutral') {
      const perFrame = intensity * this.scrollMultiplier / 60;
      if (this._onScroll) this._onScroll(zone === 'up' ? -perFrame : perFrame);
    }
  }

  _extract(result) {
    if (!result?.landmarks?.length) return null;
    const lm    = result.landmarks[0];
    const top   = result?.gestures?.[0]?.[0];
    const name  = top?.categoryName;
    const score = top?.score ?? 0;

    // 確信度の高い「開いた手のひら」→ スクロールモード
    if (name === 'Open_Palm' && score >= this.minConfidence) {
      const y = (lm[0].y + lm[2].y + lm[5].y + lm[17].y) / 4;
      return { mode: 'scroll', y, score };
    }

    return null;
  }
}
