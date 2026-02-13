import Phaser from "phaser";
import { SliderStyle, DEFAULT_SLIDER_STYLE } from "./SliderStyles";

export interface SliderConfig {
    x: number;
    y: number;
    label?: string;
    value?: number;
    onChange?: (value: number) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    fontFamily?: string;
    sliderWidth?: number;
    handleOffsetX?: number;
    percentOffsetX?: number;
    handleRadius?: number;
    handleColor?: number;
    showPercent?: boolean;
    style?: Partial<SliderStyle>;
}

export class Slider {
    private scene: Phaser.Scene;
    private container: Phaser.GameObjects.Container;
    private config: Required<SliderConfig>;
    private style: SliderStyle;
    private labelText: Phaser.GameObjects.Text | null = null;
    private sliderBg: Phaser.GameObjects.Rectangle | null = null;
    private sliderHandle: Phaser.GameObjects.Arc | null = null;
    private percentText: Phaser.GameObjects.Text | null = null;
    private isDragging: boolean = false;

    private pointerUpHandler?: () => void;
    private pointerMoveHandler?: (pointer: Phaser.Input.Pointer) => void;

    constructor(
        scene: Phaser.Scene,
        container: Phaser.GameObjects.Container,
        config: SliderConfig,
    ) {
        this.scene = scene;
        this.container = container;
        this.config = {
            x: config.x,
            y: config.y,
            label: config.label ?? "",
            value: Math.max(0, Math.min(1, config.value ?? 0.5)),
            onChange: config.onChange ?? (() => {}),
            onDragStart: config.onDragStart ?? (() => {}),
            onDragEnd: config.onDragEnd ?? (() => {}),
            fontFamily: config.fontFamily ?? "Arial",
            sliderWidth: config.sliderWidth ?? 140,
            handleOffsetX: config.handleOffsetX ?? 200,
            percentOffsetX: config.percentOffsetX ?? 320,
            handleRadius: config.handleRadius ?? 10,
            handleColor: config.handleColor ?? 0x00ff00,
            showPercent: config.showPercent ?? true,
            style: config.style ?? {},
        };
        this.style = { ...DEFAULT_SLIDER_STYLE, ...config.style };
        this.create();
    }

    private create(): void {
        const {
            x,
            y,
            sliderWidth,
            handleOffsetX,
            label,
            value,
            fontFamily,
            handleRadius,
            handleColor,
        } = this.config;

        this.labelText = this.scene.add
            .text(x, y, label, {
                fontFamily,
                fontSize: this.style.labelFontSize,
                color: this.style.labelColor,
                stroke: this.style.labelStroke,
                strokeThickness: this.style.labelStrokeThickness,
            })
            .setOrigin(0, 0.5);
        this.container.add(this.labelText);

        this.sliderBg = this.scene.add
            .rectangle(
                x + handleOffsetX,
                y,
                sliderWidth,
                this.style.barHeight,
                this.style.barBackgroundColor,
            )
            .setStrokeStyle(
                this.style.barBorderWidth,
                this.style.barBorderColor,
            )
            .setOrigin(0.5);
        this.container.add(this.sliderBg);

        this.sliderHandle = this.scene.add
            .circle(
                x + handleOffsetX - sliderWidth / 2 + value * sliderWidth,
                y,
                handleRadius,
                handleColor,
            )
            .setStrokeStyle(
                this.style.handleStrokeWidth,
                this.style.handleStrokeColor,
            )
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        this.container.add(this.sliderHandle);

        if (this.config.showPercent) {
            this.percentText = this.scene.add
                .text(
                    x + this.config.percentOffsetX,
                    y,
                    `${Math.round(value * 100)}%`,
                    {
                        fontFamily,
                        fontSize: this.style.percentFontSize,
                        color: this.style.percentColor,
                        stroke: this.style.percentStroke,
                        strokeThickness: this.style.percentStrokeThickness,
                    },
                )
                .setOrigin(0, 0.5);
            this.container.add(this.percentText);
        }

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.sliderHandle!.on("pointerdown", () => {
            this.isDragging = true;
            this.config.onDragStart();
        });

        this.pointerUpHandler = () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.config.onDragEnd();
            }
        };
        this.scene.input.on("pointerup", this.pointerUpHandler);

        this.pointerMoveHandler = (pointer: Phaser.Input.Pointer) => {
            if (!this.isDragging) return;
            const { x, sliderWidth, handleOffsetX } = this.config;
            const containerX = pointer.x - this.container.x; // Simplified relative check
            const minX = x + handleOffsetX - sliderWidth / 2;
            const maxX = x + handleOffsetX + sliderWidth / 2;
            const clampedX = Math.max(minX, Math.min(maxX, containerX));

            this.sliderHandle!.setX(clampedX);
            const value = (clampedX - minX) / sliderWidth;
            this.config.value = value;
            this.config.onChange(value);
            if (this.percentText)
                this.percentText.setText(`${Math.round(value * 100)}%`);
        };
        this.scene.input.on("pointermove", this.pointerMoveHandler);
    }

    public destroy(): void {
        if (this.pointerUpHandler)
            this.scene.input.off("pointerup", this.pointerUpHandler);
        if (this.pointerMoveHandler)
            this.scene.input.off("pointermove", this.pointerMoveHandler);
        this.labelText?.destroy();
        this.sliderBg?.destroy();
        this.sliderHandle?.destroy();
        this.percentText?.destroy();
    }
}
