export class Vector3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(x?: number, y?: number, z?: number) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    toString(): string {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }

    getLength(): number {
        return fixPrecision(Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2));
    }

    normalize(): Vector3 {
        const length = this.getLength();
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

    // Print vector info
    print(): void {
        console.log(`(${this.x}, ${this.y}, ${this.z})`);
    }
}

export class RotationVector3 extends Vector3 {
    constructor(x?: number, y?: number, z?: number) {
        super(x, y, z);
    }

    // Rotate this vector using Euler angles for x, y, and z rotations\
    getOrientation(xAngle?: number, yAngle?: number, zAngle?: number): Vector3 {
        if (!(this.x == null || this.y == null || this.z == null)) {
            xAngle = this.x;
            yAngle = this.y;
            zAngle = this.z;
        } else {
            return new Vector3(0,0,1);
        }

        // Convert angles from degrees to radians
        const radX = degToRad(xAngle);
        const radY = degToRad(yAngle);
        const radZ = degToRad(zAngle);

        // Precompute trigonometric values for the angles
        const cosX = Math.cos(radX);
        const sinX = Math.sin(radX);
        const cosY = Math.cos(radY);
        const sinY = Math.sin(radY);
        const cosZ = Math.cos(radZ);
        const sinZ = Math.sin(radZ);

        // Apply rotation around the Y axis (yaw)
        const xRotY = this.x * cosY + this.z * sinY;
        const zRotY = -this.x * sinY + this.z * cosY;

        // Apply rotation around the X axis (pitch)
        const yRotX = this.y * cosX - zRotY * sinX;
        const zRotX = this.y * sinX + zRotY * cosX;

        // Apply rotation around the Z axis (roll)
        const xRotZ = xRotY * cosZ - yRotX * sinZ;
        const yRotZ = xRotY * sinZ + yRotX * cosZ;

        // Return the rotated vector with precision fixed
        return new Vector3(
            fixPrecision(xRotZ),
            fixPrecision(yRotZ),
            fixPrecision(zRotX)
        );
    }
}

export function radToDeg(rad: number): number {
    return rad * (180 / Math.PI);
}

// Helper to convert degrees to radians
export function degToRad(deg: number): number {
    return deg * (Math.PI / 180);
}

export function fixPrecision(value: number, precision: number = 5): number {
    return parseFloat(value.toFixed(precision));
}
