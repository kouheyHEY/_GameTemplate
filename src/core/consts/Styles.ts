/**
 * UI Style Constants
 */

export const FONTS = {
    DEFAULT: "Arial, sans-serif",
    TITLE: "Arial, sans-serif",
    HEADER: "Arial, sans-serif",
    BODY: "Arial, sans-serif",
    MONOSPACE: "Courier New, monospace",
} as const;

export const FONT_SIZES = {
    XS: "12px",
    SM: "16px",
    S: "16px",
    BASE: "20px",
    M: "20px",
    LG: "24px",
    L: "24px",
    XL: "32px",
    "2XL": "40px",
    "3XL": "48px",
    "4XL": "64px",
} as const;

export const BUTTON_STYLE = {
    DEFAULT_WIDTH: 180,
    DEFAULT_HEIGHT: 60,
    SMALL_WIDTH: 100,
    SMALL_HEIGHT: 40,
    LARGE_WIDTH: 250,
    LARGE_HEIGHT: 80,
    BORDER_WIDTH: 3,
    HOVER_SCALE: 1.05,
    CLICK_SCALE: 0.95,
} as const;

export const MODAL_STYLE = {
    DEFAULT_WIDTH: 600,
    DEFAULT_HEIGHT: 400,
    BACKGROUND_COLOR: 0x222222,
    BACKGROUND_ALPHA: 0.95,
    BORDER_WIDTH: 4,
    BORDER_COLOR: 0xffffff,
    TITLE_FONT_SIZE: "36px",
    MESSAGE_FONT_SIZE: "24px",
} as const;

export const SLIDER_STYLE = {
    WIDTH: 140,
    HANDLE_RADIUS: 10,
    BAR_HEIGHT: 8,
    HANDLE_OFFSET_X: 200,
    PERCENT_OFFSET_X: 320,
    BAR_BG_COLOR: 0x444444,
    BAR_BORDER_COLOR: 0xffffff,
    BAR_BORDER_WIDTH: 2,
} as const;

export const SPACING = {
    XS: 4,
    S: 8,
    M: 16,
    L: 24,
    XL: 32,
    "2XL": 48,
    "3XL": 64,
} as const;

export const BORDER_RADIUS = {
    SM: 4,
    MD: 8,
    LG: 12,
    XL: 16,
} as const;

export const OPACITY = {
    OPAQUE: 1.0,
    DARK: 0.8,
    NORMAL: 0.6,
    LIGHT: 0.4,
    VERY_LIGHT: 0.2,
    TRANSPARENT: 0.0,
} as const;

export const ANIMATION_DURATION = {
    FAST: 100,
    NORMAL: 200,
    SLOW: 300,
    SLOWER: 500,
    SLOWEST: 1000,
} as const;
