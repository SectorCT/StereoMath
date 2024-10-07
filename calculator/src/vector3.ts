import Decimal from "decimal.js";

export class Vector3 {
    public x: Decimal;
    public y: Decimal;
    public z: Decimal;

    constructor(x?: Decimal, y?: Decimal, z?: Decimal) {
        this.x = x || new Decimal(0);
        this.y = y || new Decimal(0);
        this.z = z || new Decimal(0);
    }

    static add(vector1: Vector3, vector2: Vector3): Vector3 {
        return new Vector3(
            vector1.x.plus(vector2.x),
            vector1.y.plus(vector2.y),
            vector1.z.plus(vector2.z)
        );
    }

    static subtract(vector1: Vector3, vector2: Vector3): Vector3 {
        return new Vector3(
            vector1.x.minus(vector2.x),
            vector1.y.minus(vector2.y),
            vector1.z.minus(vector2.z)
        );
    }

    static dot(vector1: Vector3, vector2: Vector3): Decimal {
        return vector1.x.times(vector2.x).plus(vector1.y.times(vector2.y)).plus(vector1.z.times(vector2.z));
    }

    static cross(vector1: Vector3, vector2: Vector3): Vector3 {
        return new Vector3(
            vector1.y.times(vector2.z).minus(vector1.z.times(vector2.y)),
            vector1.z.times(vector2.x).minus(vector1.x.times(vector2.z)),
            vector1.x.times(vector2.y).minus(vector1.y.times(vector2.x))
        );
    }

    static angleBetween(vector1: Vector3, vector2: Vector3): Decimal {
        const dotProduct = Vector3.dot(vector1, vector2);
        const magnitude1 = vector1.getMagnitude();
        const magnitude2 = vector2.getMagnitude();
        return Decimal.acos(dotProduct.dividedBy(magnitude1.times(magnitude2)));
    }

    static areEqual(vector1: Vector3, vector2: Vector3): boolean {
        return vector1.x === vector2.x && vector1.y === vector2.y && vector1.z === vector2.z;
    }

    static distance(vector1: Vector3, vector2: Vector3): Decimal {
        return Vector3.subtract(vector1, vector2).getMagnitude();
    }

    getMagnitude(): Decimal {
        return this.x.pow(2).plus(this.y.pow(2)).plus(this.z.pow(2)).sqrt();
    }

    normalize(): Vector3 {
        const length = this.getMagnitude();
        return new Vector3(
            this.x.dividedBy(length),
            this.y.dividedBy(length),
            this.z.dividedBy(length)
        );
    }

    multiplyScalar(scalar: number): Vector3 {
        return new Vector3(
            this.x.times(scalar),
            this.y.times(scalar),
            this.z.times(scalar)
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