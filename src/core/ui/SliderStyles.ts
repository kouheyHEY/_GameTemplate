/**
 * Slider Style Definitions
 */

export interface SliderStyle {
    barBackgroundColor: number;
    barBorderColor: number;
    barBorderWidth: number;
    barHeight: number;
    labelFontSize: string;
    labelColor: string;
    labelStroke: string;
    labelStrokeThickness: number;
    percentFontSize: string;
    percentColor: string;
    percentStroke: string;
    percentStrokeThickness: number;
    handleStrokeColor: number;
    handleStrokeWidth: number;
    handleColor?: number;
}

export const DEFAULT_SLIDER_STYLE: SliderStyle = {
    barBackgroundColor: 0x444444,
    barBorderColor: 0xffffff,
    barBorderWidth: 2,
    barHeight: 20,
    labelFontSize: "24px",
    labelColor: "#ffffff",
    labelStroke: "#000000",
    labelStrokeThickness: 1,
    percentFontSize: "20px",
    percentColor: "#ffffff",
    percentStroke: "#000000",
    percentStrokeThickness: 1,
    handleStrokeColor: 0xffffff,
    handleStrokeWidth: 2,
};

export const DARK_SLIDER_STYLE: SliderStyle = {
    barBackgroundColor: 0x1a1a1a,
    barBorderColor: 0x333333,
    barBorderWidth: 1,
    barHeight: 16,
    labelFontSize: "20px",
    labelColor: "#cccccc",
    labelStroke: "#000000",
    labelStrokeThickness: 1,
    percentFontSize: "18px",
    percentColor: "#cccccc",
    percentStroke: "#000000",
    percentStrokeThickness: 1,
    handleStrokeColor: 0x666666,
    handleStrokeWidth: 1,
};
