import { fixPrecision } from './mathUtils';

export class Vector3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(x?: number, y?: number, z?: number) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    static add(vector1: Vector3, vector2: Vector3): Vector3 {
        return new Vector3(
            fixPrecision(vector1.x + vector2.x),
            fixPrecision(vector1.y + vector2.y),
            fixPrecision(vector1.z + vector2.z)
        );
    }

    static subtract(vector1: Vector3, vector2: Vector3): Vector3 {
        return new Vector3(
            fixPrecision(vector1.x - vector2.x),
            fixPrecision(vector1.y - vector2.y),
            fixPrecision(vector1.z - vector2.z)
        );
    }

    static dot(vector1: Vector3, vector2: Vector3): number {
        return fixPrecision(vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z);
    }

    static cross(vector1: Vector3, vector2: Vector3): Vector3 {
        return new Vector3(
            fixPrecision(vector1.y * vector2.z - vector1.z * vector2.y),
            fixPrecision(vector1.z * vector2.x - vector1.x * vector2.z),
            fixPrecision(vector1.x * vector2.y - vector1.y * vector2.x)
        );
    }

    static angleBetween(vector1: Vector3, vector2: Vector3): number {
        const dotProduct = Vector3.dot(vector1, vector2);
        const magnitude1 = vector1.getMagnitude();
        const magnitude2 = vector2.getMagnitude();
        return fixPrecision(Math.acos(dotProduct / (magnitude1 * magnitude2)));
    }

    static areEqual(vector1: Vector3, vector2: Vector3): boolean {
        return vector1.x === vector2.x && vector1.y === vector2.y && vector1.z === vector2.z;
    }

    static distance(vector1: Vector3, vector2: Vector3): number {
        return fixPrecision(Math.sqrt((vector1.x - vector2.x) ** 2 + (vector1.y - vector2.y) ** 2 + (vector1.z - vector2.z) ** 2));
    }

    getMagnitude(): number {
        return fixPrecision(Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2));
    }

    normalize(): Vector3 {
        const length = this.getMagnitude();
        return new Vector3(
            fixPrecision(this.x / length),
            fixPrecision(this.y / length),
            fixPrecision(this.z / length)
        );
    }

    multiplyScalar(scalar: number): Vector3 {
        return new Vector3(
            fixPrecision(this.x * scalar),
            fixPrecision(this.y * scalar),
            fixPrecision(this.z * scalar)
        );
    }

    toString(): string {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }

    // Print vector info
    print(): void {
        console.log(`(${this.x}, ${this.y}, ${this.z})`);
    }
}