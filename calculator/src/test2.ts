import { RotationVector3, Vector3, fixPrecision } from "./mathUtils"; // Importing the Vector3 class from a utility file.

import { triangleFormulas } from "./formulas";

// Vertex class definition
class Vertex {
    private name: string;
    private position: Vector3;
    private isDefined: boolean;
    private connectedVertices: Vertex[];

    constructor(name: string, position?: Vector3) {
        this.name = name;
        this.position = position || new Vector3(0, 0, 0); // Default position as (0,0,0)
        this.isDefined = !!position;
        this.connectedVertices = [];
    }

    // Set position of the vertex
    setPosition(position: Vector3): void {
        this.position = position;
        this.isDefined = true;
    }

    // Get position of the vertex
    getPosition(): Vector3 {
        return this.position;
    }

    // Check if the vertex is defined
    isPositionDefined(): boolean {
        return this.isDefined;
    }

    // Connect this vertex to another vertex
    connectVertex(vertex: Vertex): void {
        this.connectedVertices.push(vertex);
    }

    getConnectedVertices(): Vertex[] {
        return this.connectedVertices;
    }

    // Print vertex info
    toString(): string {
        return `${this.name}`;
    }

    print(): void {
        if (this.isDefined) {
            console.log(
                `${this.name} (${this.position.x}, ${this.position.y}, ${this.position.z})`
            );
        } else {
            console.log(`${this.name}`);
        }
    }
}

// Line class definition
class Line {
    public start: Vertex;
    public end: Vertex;

    private length: number;

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

    getLength(): number {
        return this.length;
    }

    setLength(length: number): void {
        this.length = length;
    }

    // Print line info
    print(): void {
        console.log(this);
    }
}

class Angle {
    public vertex0: Vertex;
    public vertex1: Vertex;
    public vertex2: Vertex;

    private angle: number;

    constructor(vertex0: Vertex, vertex1: Vertex, vertex2: Vertex) {
        this.vertex0 = vertex0;
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
    }

    setAngle(angle: number): void {
        this.angle = angle;
    }

    getAngle(): number {
        return this.angle;
    }

    toString(): string {
        return `${this.vertex0.toString()}${this.vertex1.toString()}${this.vertex2.toString()}`;
    }
}

export class Triangle {
    public vA: Vertex;
    public vB: Vertex;
    public vC: Vertex;

    public lineAB: Line;
    public lineBC: Line;
    public lineCA: Line;

    public angleABC: Angle;
    public angleBCA: Angle;
    public angleCAB: Angle;

    // private orientation: Vector3; // Rotation orientation for the triangle

    constructor(vA: Vertex, vB: Vertex, vC: Vertex, orientation: Vector3) {
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

        // this.orientation = orientation || new Vector3(0, 0, 0); // Default orientation
    }

    setLineLength(number: number, lineName: string): void {
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

    setAngleValue(angle: number, angleName: string): void {
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
        let changesMade = true;

        while (changesMade) {
            changesMade = false;
            for (let formula of triangleFormulas) {
                let result = formula.execute(this);

                if (result.a && result.a != this.lineBC.getLength()) {
                    this.lineBC.setLength(result.a);
                    changesMade = true;
                }

                if (result.b && result.b != this.lineCA.getLength()) {
                    this.lineCA.setLength(result.b);
                    changesMade = true;
                }

                if (result.c && result.c != this.lineAB.getLength()) {
                    this.lineAB.setLength(result.c);
                    changesMade = true;
                }

                if (result.A && result.A != this.angleCAB.getAngle()) {
                    this.angleCAB.setAngle(result.A);
                    changesMade = true;
                }

                if (result.B && result.B != this.angleABC.getAngle()) {
                    this.angleABC.setAngle(result.B);
                    changesMade = true;
                }

                if (result.C && result.C != this.angleBCA.getAngle()) {
                    this.angleBCA.setAngle(result.C);
                    changesMade = true;
                }
            }
        }
    }

    isTriangleValid(): boolean {
        return (
            this.lineAB.getLength() + this.lineBC.getLength() >
                this.lineCA.getLength() &&
            this.lineBC.getLength() + this.lineCA.getLength() >
                this.lineAB.getLength() &&
            this.lineCA.getLength() + this.lineAB.getLength() >
                this.lineBC.getLength() &&
            this.angleCAB.getAngle() +
                this.angleABC.getAngle() +
                this.angleBCA.getAngle() ===
                180
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

    buildTriangle(): void {
        // Set initial positions if not defined
        if (
            !this.vA.isPositionDefined() &&
            !this.vB.isPositionDefined() &&
            !this.vC.isPositionDefined()
        ) {
            this.vA.setPosition(new Vector3(0, 0, 0));
        }

        const undefinedVertices = [this.vA, this.vB, this.vC].filter(
            (v) => !v.isPositionDefined()
        );

        if (undefinedVertices.length === 0) {
            return;
        }

        if (undefinedVertices.length === 1) {
            const v = undefinedVertices[0];
        }
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

// Main logic (entry point)
function main() {
    const vA = new Vertex("A");
    const vB = new Vertex("B");
    const vC = new Vertex("C");

    // Add an orientation (e.g., 45 degrees rotation around Z-axis)
    const orientation = new RotationVector3(0, 0, 0);

    const t = new Triangle(vA, vB, vC, orientation);

    t.setLineLength(5, "CB");
    t.setLineLength(5, "CA");

    t.setAngleValue(30, "BAC");

    t.calculateTriangle(); // Calculate the rest of the triangle

    t.buildTriangle(); // Build the triangle (set vertex coordinates based on lengths and angles)

    t.print(); // Print the triangle details
}

main();
