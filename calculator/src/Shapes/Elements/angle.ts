import { Vertex } from './index';
import Decimal from 'decimal.js';

export default class Angle {
    public vertex0: Vertex;
    public vertex1: Vertex;
    public vertex2: Vertex;

    private angle: Decimal = new Decimal(0);

    constructor(vertex0: Vertex, vertex1: Vertex, vertex2: Vertex) {
        this.vertex0 = vertex0;
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
    }

    setAngle(angle: Decimal): void {
        this.angle = angle;
    }

    getAngle(): Decimal {
        return this.angle;
    }

    toString(): string {
        return `${this.vertex0.toString()}${this.vertex1.toString()}${this.vertex2.toString()}`;
    }
}