/**
 * Core Configuration Constants
 */

export const SCREEN = {
    WIDTH: 1280,
    HEIGHT: 720,
    AUTO_SCALE: true,
    RENDER_PIXELPERFECT: false,
} as const;

export const FRAMERATE = {
    TARGET: 60,
    VSYNC_ENABLED: true,
} as const;

export const DEBUG = {
    ENABLED: false,
    SHOW_FPS: true,
    PHYSICS_DEBUG: false,
    LOG_LEVEL: "info" as const,
} as const;

export const TIMING = {
    DEBOUNCE_TIME: 100,
    LONG_PRESS_TIME: 500,
    DOUBLE_CLICK_TIME: 300,
} as const;

/**
 * Z-Index (Depth) Constants
 */
export const DEPTH = {
    BACKGROUND: 0,
    GAME: 100,
    UI_BACKGROUND: 1000,
    UI: 1100,
    MODAL_OVERLAY: 2000,
    MODAL: 2100,
    TOAST: 3000,
} as const;
