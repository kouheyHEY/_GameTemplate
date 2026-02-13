import Phaser from "phaser";

export function wrapText(
    textObject: Phaser.GameObjects.Text,
    text: string,
    maxWidth: number,
): string {
    // ... (Implementation as read)
    const lines: string[] = [];
    const paragraphs = text.split("\n");

    for (const paragraph of paragraphs) {
        if (paragraph === "") {
            lines.push("");
            continue;
        }

        const words = paragraph.split("");
        let currentLine = "";

        for (let i = 0; i < words.length; i++) {
            const testLine = currentLine + words[i];
            textObject.setText(testLine);
            const metrics = textObject.getBounds();

            if (metrics.width > maxWidth && currentLine !== "") {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine !== "") lines.push(currentLine);
    }
    return lines.join("\n");
}

export function truncateText(
    text: string,
    maxLength: number,
    suffix: string = "...",
): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
}
