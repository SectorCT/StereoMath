import { Vertex } from "./index";
import Decimal from "decimal.js";

export default class Angle {
    public vertex0: Vertex;
    public vertex1: Vertex;
    public vertex2: Vertex;

    private angle: Decimal = new Decimal(0);

    public static allAngles: Angle[] = [];

    constructor(vertex0: Vertex, vertex1: Vertex, vertex2: Vertex) {
        this.vertex0 = vertex0;
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;

        for (let angle of Angle.allAngles) {
            if (angle.toString() === this.toString()) {
                console.log("[Error] Angle already exists");
                throw new Error("[Error] Angle already exists");
            }
        }

        Angle.allAngles.push(this);
    }

    setAngle(angle: Decimal): void {
        this.angle = angle;
    }

    getAngle(): Decimal {
        return this.angle;
    }

    toString(): string {
        if (this.vertex0.getName().localeCompare(this.vertex2.getName()) < 0) {
            return `${this.vertex0.toString()}${this.vertex1.toString()}${this.vertex2.toString()}`;
        } else {
            return `${this.vertex2.toString()}${this.vertex1.toString()}${this.vertex0.toString()}`;
        }
    }
}
