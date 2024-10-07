import { Vector3 } from "./vector3";
import { Vertex } from "./Shapes/Elements";
import { Triangle } from "./Shapes";

import Decimal from "decimal.js";

Decimal.config({
    precision: 50,
    rounding: Decimal.ROUND_HALF_UP,
});


function main() {
    const vA = new Vertex("A", new Vector3(new Decimal(0), new Decimal(0), new Decimal(1)));
    const vB = new Vertex("B");
    const vC = new Vertex("C");

    // Add an orientation (e.g., 45 degrees rotation around Z-axis)
    const planeNormal = new Vector3(new Decimal(0), new Decimal(0), new Decimal(1));

    const t = new Triangle(vA, vB, vC, planeNormal);

    t.setAngleValue(new Decimal(90), "BCA"); // Set angle value
    t.setAngleValue(new Decimal(30), "ABC"); // Set angle value

    t.setLineLength(new Decimal(5), "AB"); // Set line length

    t.calculateTriangle(); // Calculate the rest of the triangle

    t.buildTriangle(); // Build the triangle (set vertex coordinates based on lengths and angles)

    t.print(); // Print the triangle details
}

main();
