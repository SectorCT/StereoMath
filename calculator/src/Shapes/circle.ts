import Decimal from "decimal.js";
import { Vector2 } from "../vector"; // Assuming Vector2 is already defined somewhere in the project

class Circle {
    public center: Vector2;
    public radius: Decimal;

    constructor(center: Vector2, radius: Decimal) {
        this.center = center;
        this.radius = radius;
    }

    static findIntersectionPoints(
        circle1: Circle,
        circle2: Circle
    ): Vector2[] | null {
        const { center: c1, radius: r1 } = circle1;
        const { center: c2, radius: r2 } = circle2;

        // Calculate the distance between the centers of the circles
        const dx = new Decimal(c2.x).minus(c1.x);
        const dy = new Decimal(c2.y).minus(c1.y);
        const d = dx.pow(2).plus(dy.pow(2)).sqrt();

        // Check if there's no intersection
        if (
            d.greaterThan(r1.plus(r2)) ||
            d.lessThan(r1.minus(r2).abs()) ||
            (d.equals(0) && r1.equals(r2))
        ) {
            return null; // No intersection
        }

        // Calculate 'a' (distance from circle1's center to the point along the line joining the centers)
        const a = r1.pow(2).minus(r2.pow(2)).plus(d.pow(2)).div(d.mul(2));

        // Calculate the height from the point where the line crosses to the intersection points
        const h = r1.pow(2).minus(a.pow(2)).sqrt();

        // Calculate the point P2 where the line through the circle intersection points crosses the line between the centers
        const x2 = c1.x.plus(a.mul(c2.x.minus(c1.x)).div(d));
        const y2 = c1.y.plus(a.mul(c2.y.minus(c1.y)).div(d));

        // Calculate the intersection points
        const intersectionX1 = x2.plus(h.mul(c2.y.minus(c1.y)).div(d));
        const intersectionY1 = y2.minus(h.mul(c2.x.minus(c1.x)).div(d));

        const intersectionX2 = x2.minus(h.mul(c2.y.minus(c1.y)).div(d));
        const intersectionY2 = y2.plus(h.mul(c2.x.minus(c1.x)).div(d));

        // Return the two intersection points as Vector2
        return [
            new Vector2(
                intersectionX1.toDecimalPlaces(5),
                intersectionY1.toDecimalPlaces(5)
            ),
            new Vector2(
                intersectionX2.toDecimalPlaces(5),
                intersectionY2.toDecimalPlaces(5)
            ),
        ];
    }
}

export default Circle;
