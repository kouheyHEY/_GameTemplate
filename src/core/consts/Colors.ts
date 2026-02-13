/**
 * Color Palette Definitions
 * Defined as both Hex and String constants.
 */

export const COLORS = {
    // Grayscale
    WHITE: "#ffffff",
    LIGHT_GRAY: "#e0e0e0",
    GRAY: "#808080",
    DARK_GRAY: "#333333",
    BLACK: "#000000",

    // Brand Colors
    PRIMARY: "#0066ff",
    SECONDARY: "#00cc66",
    ACCENT: "#ffcc00",

    // Status Colors
    SUCCESS: "#66ff66",
    WARNING: "#ff9966",
    ERROR: "#ff6666",
    INFO: "#66ccff",

    // Others
    TRANSPARENT: "transparent",
} as const;

export const COLORS_HEX = {
    // Grayscale
    WHITE: 0xffffff,
    LIGHT_GRAY: 0xe0e0e0,
    GRAY: 0x808080,
    DARK_GRAY: 0x333333,
    BLACK: 0x000000,

    // Brand Colors
    PRIMARY: 0x0066ff,
    SECONDARY: 0x00cc66,
    ACCENT: 0xffcc00,

    // Status Colors
    SUCCESS: 0x66ff66,
    WARNING: 0xff9966,
    ERROR: 0xff6666,
    INFO: 0x66ccff,
} as const;

export const TEXT_COLORS = {
    DEFAULT: "#ffffff",
    EMPHASIS: "#ffff00",
    SECONDARY: "#cccccc",
    DISABLED: "#666666",
    WARNING: "#ff6666",
    SUCCESS: "#66ff66",
} as const;

export const BG_COLORS = {
    PRIMARY: "#1a1a1a",
    SECONDARY: "#2d2d2d",
    MODAL: "#222222",
    BUTTON: 0x4444ff,
    BUTTON_HOVER: 0x6666ff,
    INPUT: "#333333",
    HIGHLIGHT: 0x444444,
} as const;

export const BORDER_COLORS = {
    DEFAULT: "#ffffff",
    LIGHT: "#666666",
    DARK: "#000000",
    SUCCESS: "#66ff66",
    ERROR: "#ff6666",
} as const;

export const STROKE_COLORS = {
    DEFAULT: "#000000",
    LIGHT: "#666666",
    DARK: "#ffffff",
} as const;

export const GRADIENT_COLORS = {
    START: 0x0066ff,
    END: 0x00cc66,
    MID: 0x66ff00,
} as const;

export const THEMED_COLORS = {
    DARK: {
        background: "#1a1a1a",
        surface: "#2d2d2d",
        text: "#ffffff",
        primary: 0x0066ff,
        secondary: 0x00cc66,
    },
    LIGHT: {
        background: "#f5f5f5",
        surface: "#ffffff",
        text: "#000000",
        primary: 0x0066ff,
        secondary: 0x00cc66,
    },
} as const;
