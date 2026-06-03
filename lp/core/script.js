/* =========================================================
   CORE — LP interactions
   ========================================================= */

// ▼▼ 設定：ここのURLを差し替えてください ▼▼
// LINE公式アカウントの友だち追加URL（例：https://lin.ee/xxxxxxx）
const LINE_URL = "【LINE友だち追加URL】";
// 申込フォームの送信先（Formspree）は index.html の <form action="..."> に記載しています。
// ▲▲ 設定ここまで ▲▲

const LINE_READY = LINE_URL.indexOf("【") === -1 && LINE_URL.length > 0;

document.addEventListener("DOMContentLoaded", () => {
  // ----- 現在の年 -----
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ----- 計測ヘルパー（GA4未設定でもエラーにならない） -----
  const track = (name, params = {}) => {
    if (typeof gtag === "function") gtag("event", name, params);
  };

  // ----- LINEで参加（ボタン）-----
  document.querySelectorAll("[data-line]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      track("line_click", { button_label: (btn.textContent || "").trim() });
      if (LINE_READY) {
        window.open(LINE_URL, "_blank", "noopener");
      } else {
        // LINE未設定時は申込フォームへ誘導
        alert("LINEの準備中です。下の申込フォームからお気軽にどうぞ！");
        document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ----- LINEリンク（クロージングの友だち追加ボタン）-----
  document.querySelectorAll("[data-line-link]").forEach((a) => {
    if (LINE_READY) {
      a.setAttribute("href", LINE_URL);
    } else {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        track("line_click", { button_label: (a.textContent || "").trim() });
        alert("LINEの準備中です。下の申込フォームからお気軽にどうぞ！");
        document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
      });
    }
  });

  // ----- ヘッダーの背景切り替え -----
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    if (window.scrollY > 60) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ----- スマホ用 固定CTA（ファーストビューを過ぎたら表示） -----
  const stickyCta = document.querySelector(".sticky-cta");
  const hero = document.getElementById("hero");
  if (stickyCta && hero && "IntersectionObserver" in window) {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) stickyCta.classList.remove("show");
        else stickyCta.classList.add("show");
      },
      { threshold: 0.1 }
    );
    heroObserver.observe(hero);
  }

  // ----- スクロールで要素をふわっと表示 -----
  const revealTargets = document.querySelectorAll(
    ".sec-title, .sec-eyebrow, .problem-list li, .solution-card, .activity-card, .benefit-item, .plan-card, .trial-banner, .review-card, .faq-item, .flow-step, .closing-copy, .form-wrap"
  );
  if ("IntersectionObserver" in window) {
    revealTargets.forEach((el) => el.classList.add("reveal"));
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  // ----- FAQ：1つ開いたら他を閉じる（アコーディオン） -----
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // ----- 申込フォーム（Formspree 非同期送信） -----
  const form = document.getElementById("applyForm");
  const status = document.getElementById("formStatus");
  const thanks = document.getElementById("thanksMessage");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.textContent = "";
      status.classList.remove("error");

      const action = form.getAttribute("action") || "";
      // エンドポイント未設定時のフォールバック
      if (action.indexOf("【") !== -1) {
        status.textContent = "現在フォームは準備中です。お手数ですがLINEからご連絡ください。";
        status.classList.add("error");
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "送信中…";

      try {
        const res = await fetch(action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          track("apply_submit", {
            plan: form.querySelector('input[name="参加の希望"]:checked')?.value || "未選択",
          });
          form.hidden = true;
          thanks.hidden = false;
          thanks.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          const data = await res.json().catch(() => ({}));
          status.textContent =
            (data.errors && data.errors.map((x) => x.message).join(" / ")) ||
            "送信に失敗しました。お手数ですが時間をおいて再度お試しください。";
          status.classList.add("error");
        }
      } catch (err) {
        status.textContent = "通信エラーが発生しました。電波の良い場所で再度お試しください。";
        status.classList.add("error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }
});
