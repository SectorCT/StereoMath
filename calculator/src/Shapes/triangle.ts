import { Vector2, Vector3 } from "../vector";
import { Vertex, Line, Angle } from "./Elements";
import { Circle } from "./";

import { triangleFormulas } from "../formulas";

import Decimal from "decimal.js";

export default class Triangle {
    public vA: Vertex;
    public vB: Vertex;
    public vC: Vertex;

    public lineAB: Line;
    public lineBC: Line;
    public lineCA: Line;

    public angleABC: Angle;
    public angleBCA: Angle;
    public angleCAB: Angle;

    private planeNormal: Vector3 = new Vector3(
        new Decimal(0),
        new Decimal(0),
        new Decimal(1)
    );

    constructor(vA: Vertex, vB: Vertex, vC: Vertex, planeNormal: Vector3) {
        if (vA === vB || vB === vC || vC === vA) {
            throw new Error("Vertices cannot be the same.");
        }

        this.vA = vA;
        this.vB = vB;
        this.vC = vC;

        this.lineAB = new Line(vA, vB);
        this.lineBC = new Line(vB, vC);
        this.lineCA = new Line(vC, vA);

        this.angleABC = new Angle(vA, vB, vC);
        this.angleBCA = new Angle(vB, vC, vA);
        this.angleCAB = new Angle(vC, vA, vB);

        this.planeNormal = planeNormal.normalize();
    }

    setLineLength(number: Decimal, lineName: string): void {
        if (lineName.split("").sort().join("") === this.lineAB.toString()) {
            this.lineAB.setLength(number);
        }

        if (lineName.split("").sort().join("") === this.lineBC.toString()) {
            this.lineBC.setLength(number);
        }

        if (lineName.split("").sort().join("") === this.lineCA.toString()) {
            this.lineCA.setLength(number);
        }
    }

    setAngleValue(angle: Decimal, angleName: string): void {
        if (
            angleName === this.angleABC.toString() ||
            angleName.split("").reverse().join("") === this.angleABC.toString()
        ) {
            this.angleABC.setAngle(angle);
        }

        if (
            angleName === this.angleBCA.toString() ||
            angleName.split("").reverse().join("") === this.angleBCA.toString()
        ) {
            this.angleBCA.setAngle(angle);
        }

        if (
            angleName === this.angleCAB.toString() ||
            angleName.split("").reverse().join("") === this.angleCAB.toString()
        ) {
            this.angleCAB.setAngle(angle);
        }
    }

    calculateTriangle() {
        let changesMade = false;

        do {
            changesMade = false;
            for (let formula of triangleFormulas) {
                let result = formula.execute(this);

                if (result.lineBC && !result.lineBC.equals(new Decimal(0)) && !result.lineBC.equals(this.lineBC.getLength())) {
                    this.lineBC.setLength(result.lineBC);
                    changesMade = true;
                }

                if (result.lineCA && !result.lineCA.equals(new Decimal(0)) && !result.lineCA.equals(this.lineCA.getLength())) {
                    this.lineCA.setLength(result.lineCA);
                    changesMade = true;
                }

                if (result.lineAB && !result.lineAB.equals(new Decimal(0)) && !result.lineAB.equals(this.lineAB.getLength())) {
                    this.lineAB.setLength(result.lineAB);
                    changesMade = true;
                }

                if (result.angleCAB && !result.angleCAB.equals(new Decimal(0)) && !result.angleCAB.equals(this.angleCAB.getAngle())) {
                    this.angleCAB.setAngle(result.angleCAB);
                    changesMade = true;
                }

                if (result.angleABC && !result.angleABC.equals(new Decimal(0)) && !result.angleABC.equals(this.angleABC.getAngle())) {
                    this.angleABC.setAngle(result.angleABC);
                    changesMade = true;
                }

                if (result.angleBCA && !result.angleBCA.equals(new Decimal(0)) && !result.angleBCA.equals(this.angleBCA.getAngle())) {
                    this.angleBCA.setAngle(result.angleBCA);
                    changesMade = true;
                }
            }
        } while (changesMade);
    }

    isTriangleValid(): boolean {
        return (
            Decimal.add(
                this.lineAB.getLength(),
                this.lineBC.getLength()
            ).greaterThan(this.lineCA.getLength()) &&
            Decimal.add(
                this.lineBC.getLength(),
                this.lineCA.getLength()
            ).greaterThan(this.lineAB.getLength()) &&
            Decimal.add(
                this.lineCA.getLength(),
                this.lineAB.getLength()
            ).greaterThan(this.lineBC.getLength()) &&
            Decimal.add(
                this.angleCAB.getAngle(),
                Decimal.add(this.angleABC.getAngle(), this.angleBCA.getAngle())
            ).equals(new Decimal(180))
        );
    }

    equals(other: Triangle): boolean {
        return (
            this.lineAB.getLength() === other.lineAB.getLength() &&
            this.lineBC.getLength() === other.lineBC.getLength() &&
            this.lineCA.getLength() === other.lineCA.getLength() &&
            this.angleCAB.getAngle() === other.angleCAB.getAngle() &&
            this.angleABC.getAngle() === other.angleABC.getAngle() &&
            this.angleBCA.getAngle() === other.angleBCA.getAngle()
        );
    }

    getLineBetweenVertices(v1: Vertex, v2: Vertex): Line {
        if (
            (v1 === this.vA && v2 === this.vB) ||
            (v1 === this.vB && v2 === this.vA)
        ) {
            return this.lineAB;
        }

        if (
            (v1 === this.vB && v2 === this.vC) ||
            (v1 === this.vC && v2 === this.vB)
        ) {
            return this.lineBC;
        }

        if (
            (v1 === this.vC && v2 === this.vA) ||
            (v1 === this.vA && v2 === this.vC)
        ) {
            return this.lineCA;
        }

        throw new Error("Vertices not connected by a line.");
    }

    buildTriangle(): void {
        // Check how many vertices have defined positions
        const definedVertices = [this.vA, this.vB, this.vC].filter((v) =>
            v.isLocalPositionDefined()
        );

        if (definedVertices.length === 3) return;

        if (definedVertices.length === 2) {
            const undefinedVertex = [this.vA, this.vB, this.vC].find((v) => !definedVertices.includes(v));

            if (!undefinedVertex) throw new Error("No undefined vertex found");

            const circleA = new Circle(definedVertices[0].getLocalPosition(), this.lineAB.getLength());
            const circleB = new Circle(definedVertices[1].getLocalPosition(), this.lineBC.getLength());

            const intersectionPoints = Circle.findIntersectionPoints(circleA, circleB);

            if(!intersectionPoints || intersectionPoints.length === 0) throw new Error("Trinagle is not possible with given data");
            
            
            undefinedVertex.setLocalPosition(
                intersectionPoints.reduce((prev, curr) => {
                    // If prev is not defined, set curr as the new point
                    if (!prev) return curr;
            
                    // Check if both points are in Quadrant 1 (x > 0 and y > 0)
                    const prevInQuadrantOne = prev.x.greaterThan(0) && prev.y.greaterThan(0);
                    const currInQuadrantOne = curr.x.greaterThan(0) && curr.y.greaterThan(0);
            
                    // If only one point is in Quadrant 1, prefer that one
                    if (prevInQuadrantOne && !currInQuadrantOne) return prev;
                    if (!prevInQuadrantOne && currInQuadrantOne) return curr;
            
                    // If both points are in Quadrant 1, choose the one with the higher x value
                    if ((prev.x.plus(prev.y)).greaterThan((curr.x.plus(curr.y)))) return prev;
                    return curr;
                })
            );
               
        }

        return;
    }

    print(): void {
        console.log("Triangle: ");
        console.log(`${this.lineAB.toString()} = ${this.lineAB.getLength()}`);
        console.log(`${this.lineBC.toString()} = ${this.lineBC.getLength()}`);
        console.log(`${this.lineCA.toString()} = ${this.lineCA.getLength()}`);

        console.log(
            `${this.angleCAB.toString()} = ${this.angleCAB.getAngle()}`
        );
        console.log(
            `${this.angleABC.toString()} = ${this.angleABC.getAngle()}`
        );
        console.log(
            `${this.angleBCA.toString()} = ${this.angleBCA.getAngle()}`
        );

        console.log("Vertices: ");
        this.vA.print();
        this.vB.print();
        this.vC.print();
    }
}
