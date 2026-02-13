/**
 * Simple State Machine Pattern
 */
export interface IState {
    enter(): void;
    update(time: number, delta: number): void;
    exit(): void;
}

export class StateMachine {
    private currentState: IState | null = null;
    private states: Map<string, IState> = new Map();
    private context: any;

    constructor(context: any) {
        this.context = context;
    }

    public addState(name: string, state: IState): void {
        this.states.set(name, state);
    }

    public setState(name: string): void {
        if (!this.states.has(name)) {
            console.warn(`State ${name} does not exist.`);
            return;
        }

        if (this.currentState) {
            this.currentState.exit();
        }

        this.currentState = this.states.get(name)!;
        this.currentState.enter();
    }

    public update(time: number, delta: number): void {
        if (this.currentState) {
            this.currentState.update(time, delta);
        }
    }
}
