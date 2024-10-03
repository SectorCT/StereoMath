import { triangleFormulas } from "./formulas";
import { Vector3 } from "./vector3";


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

    private planeNormal: Vector3 = new Vector3(0, 0, 1); // Default plane normal

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

    public buildTriangle(): void {
        // Check how many vertices have defined positions
        const definedVertices = [this.vA, this.vB, this.vC].filter((v) =>
            v.isPositionDefined()
        );

        console.log("not implemented yet");
        return;
    }
    

    private translateTriangle(referencePosition: Vector3): void {
        // Translate each vertex by adding the translation vector to their current position
        this.vA.setPosition(Vector3.add(this.vA.getPosition(), referencePosition));
        this.vB.setPosition(Vector3.add(this.vB.getPosition(), referencePosition));
        this.vC.setPosition(Vector3.add(this.vC.getPosition(), referencePosition));
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
    const vA = new Vertex("A", new Vector3(1, 1, 1));
    const vB = new Vertex("B");
    const vC = new Vertex("C");

    // Add an orientation (e.g., 45 degrees rotation around Z-axis)
    const planeNormal = new Vector3(0, 1, 0);

    const t = new Triangle(vA, vB, vC, planeNormal);

    t.setLineLength(20, "CB");
    t.setLineLength(18, "CA");

    t.setAngleValue(60, "BAC");

    t.calculateTriangle(); // Calculate the rest of the triangle

    t.buildTriangle(); // Build the triangle (set vertex coordinates based on lengths and angles)

    t.print(); // Print the triangle details
}

main();
