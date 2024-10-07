import { Vertex } from "./index";
import Decimal from "decimal.js";

export default class Line {
    public start: Vertex;
    public end: Vertex;

    private length: Decimal = new Decimal(0);

    constructor(start: Vertex, end: Vertex) {
        this.start = start;
        this.end = end;

        start.connectVertex(end);
        end.connectVertex(start);
    }

    toString(): string {
        return `${this.start.toString()}${this.end.toString()}`
            .split("")
            .sort()
            .join("");
    }

    getLength(): Decimal {
        return this.length;
    }

    setLength(length: Decimal): void {
        this.length = length;
    }

    // Print line info
    print(): void {
        console.log(this);
    }
}
