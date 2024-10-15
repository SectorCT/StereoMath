import Decimal from 'decimal.js';
import { Vector2, Vector3 } from '../../vector';

export default class Plane {
    centerPoint: Vector3;
    normal: Vector3;

    public static allPlanes: Plane[] = [];

    constructor(centerPoint: Vector3, normal: Vector3) {
        this.centerPoint = centerPoint;
        this.normal = normal.normalize();

        Plane.allPlanes.push(this);
    }

    public convertLocalToWorld(local: Vector2): Vector3 {
        // Find a vector that's not parallel to the normal to use for tangent calculation
        let tangent1: Vector3;
        if (this.normal.x.abs().greaterThan(this.normal.y.abs())) {
            tangent1 = new Vector3(this.normal.z.toDecimalPlaces(5), new Decimal(0), this.normal.x.times(-1).toDecimalPlaces(5)).normalize();
        } else {
            tangent1 = new Vector3(new Decimal(0), this.normal.z.times(-1).toDecimalPlaces(5), this.normal.y.toDecimalPlaces(5)).normalize();
        }

        // Compute the second tangent vector (perpendicular to both normal and tangent1)
        let tangent2 = Vector3.cross(this.normal, tangent1).normalize();

        // Map local 2D coordinates (x, y) onto the 3D plane in world space
        let worldPoint = Vector3.add(
            this.centerPoint, 
            Vector3.add(
                tangent1.multiplyScalar(local.x), 
                tangent2.multiplyScalar(local.y)
            )
        );

        return worldPoint;
    }

    public convertWorldToLocal(world: Vector3): Vector2 {
        console.log("[Error] Not implemented - convertWorldToLocal (Plane)");
        return new Vector2(new Decimal(0), new Decimal(0));
    }

    toString(): string {
        return `Plane: ${this.centerPoint.toString()} ${this.normal.toString()}`;
    }

}