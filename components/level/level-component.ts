export abstract class LevelComponent {
    public abstract getX(): number;
    public abstract getY(): number;

    public draw(ctx: CanvasRenderingContext2D) {
        return this.drawAt(ctx, this.getX(), this.getY());
    }

    public abstract drawAt(ctx: CanvasRenderingContext2D, screenX: number, screenY: number): void;
}