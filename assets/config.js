/*
 * Shared Tailwind config for the portfolio.
 * Loaded AFTER the Tailwind CDN script so `tailwind` is defined.
 * Design tokens come from DESIGN.md ("Refined Minimalism").
 */
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "inverse-surface": "#2e3132",
                "surface-variant": "#e1e3e4",
                "secondary-fixed-dim": "#b9c3ff",
                "tertiary-fixed": "#e2e2e2",
                "error-container": "#ffdad6",
                "primary-container": "#1b1b1b",
                "on-secondary": "#ffffff",
                "background": "#f8f9fa",
                "surface-container-high": "#e7e8e9",
                "on-primary-fixed": "#1b1b1b",
                "on-tertiary-fixed": "#1b1b1b",
                "secondary-container": "#4365fb",
                "error": "#ba1a1a",
                "on-surface-variant": "#4c4546",
                "surface-container-highest": "#e1e3e4",
                "tertiary-container": "#1b1b1b",
                "surface": "#f8f9fa",
                "on-secondary-container": "#fffbff",
                "tertiary-fixed-dim": "#c6c6c6",
                "surface-dim": "#d9dadb",
                "on-error-container": "#93000a",
                "on-primary-fixed-variant": "#474747",
                "primary-fixed-dim": "#c6c6c6",
                "primary-fixed": "#e2e2e2",
                "secondary-fixed": "#dee1ff",
                "on-tertiary-fixed-variant": "#474747",
                "on-primary-container": "#848484",
                "surface-container-lowest": "#ffffff",
                "on-primary": "#ffffff",
                "surface-bright": "#f8f9fa",
                "on-tertiary-container": "#848484",
                "surface-tint": "#5e5e5e",
                "on-secondary-fixed-variant": "#0033c2",
                "on-error": "#ffffff",
                "surface-container": "#edeeef",
                "primary": "#000000",
                "surface-container-low": "#f3f4f5",
                "secondary": "#214ae2",
                "outline-variant": "#cfc4c5",
                "on-tertiary": "#ffffff",
                "outline": "#7e7576",
                "on-background": "#191c1d",
                "on-surface": "#191c1d",
                "tertiary": "#000000",
                "inverse-on-surface": "#f0f1f2",
                "inverse-primary": "#c6c6c6",
                "on-secondary-fixed": "#001257"
            },
            borderRadius: {
                "DEFAULT": "0.125rem",
                "lg": "0.25rem",
                "xl": "0.5rem",
                "full": "0.75rem"
            },
            spacing: {
                "gutter": "24px",
                "stack-lg": "80px",
                "stack-xl": "128px",
                "margin-desktop": "64px",
                "stack-sm": "16px",
                "stack-md": "40px",
                "margin-mobile": "24px"
            },
            fontFamily: {
                "headline-md": ["Geist"],
                "headline-lg-mobile": ["Geist"],
                "label-md": ["JetBrains Mono"],
                "headline-lg": ["Geist"],
                "display": ["Geist"],
                "body-lg": ["Inter"],
                "body-md": ["Inter"],
                "label-sm": ["JetBrains Mono"]
            },
            fontSize: {
                "display": ["72px", { "lineHeight": "80px", "letterSpacing": "-0.04em", "fontWeight": "600" }],
                "headline-lg": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.03em", "fontWeight": "600" }],
                "headline-lg-mobile": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "600" }],
                "headline-md": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "500" }],
                "body-lg": ["18px", { "lineHeight": "28px", "letterSpacing": "-0.01em", "fontWeight": "400" }],
                "body-md": ["16px", { "lineHeight": "24px", "letterSpacing": "0em", "fontWeight": "400" }],
                "label-md": ["14px", { "lineHeight": "20px", "letterSpacing": "0.02em", "fontWeight": "500" }],
                "label-sm": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500" }]
            }
        }
    }
};
