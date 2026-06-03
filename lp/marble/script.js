/* =========================================================
   marble — LP interactions
   ========================================================= */

// ▼▼ 設定：ここのURLを差し替えてください ▼▼
const CALENDLY_URL = "https://calendly.com/haruto160817/30min/consultation";
// Formspreeのエンドポイントは index.html の <form action="..."> に記載しています。
// ▲▲ 設定ここまで ▲▲

document.addEventListener("DOMContentLoaded", () => {
  // ----- 現在の年 -----
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ----- GA4 イベント送信ヘルパー（未設定でもエラーにならない） -----
  const track = (name, params = {}) => {
    if (typeof gtag === "function") gtag("event", name, params);
  };

  // ----- Calendly ポップアップ -----
  document.querySelectorAll("[data-calendly]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      // 予約ボタンのクリックを計測（どのボタンが押されたかをlabelで記録）
      track("reserve_click", { button_label: (btn.textContent || "").trim() });
      if (window.Calendly && CALENDLY_URL.indexOf("【") === -1) {
        window.Calendly.initPopupWidget({ url: CALENDLY_URL });
      } else {
        // URL未設定時は問い合わせフォームへ誘導
        alert("ネット予約の準備中です。下のフォームからお気軽にご相談ください◎");
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }
    });
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
    ".sec-title, .sec-eyebrow, .problem-list li, .solution-card, .benefit-item, .menu-table, .coupon-card, .review-card, .ig-feed, .faq-item, .access-grid, .closing-copy, .form-wrap"
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

  // ----- 問い合わせフォーム（Formspree 非同期送信） -----
  const form = document.getElementById("contactForm");
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
        status.textContent = "現在フォームは準備中です。お手数ですがお電話・Instagramからご連絡ください。";
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
          // 問い合わせ送信完了をコンバージョンとして計測
          track("contact_submit", {
            menu: form.querySelector('input[name="希望メニュー"]:checked')?.value || "未選択",
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
