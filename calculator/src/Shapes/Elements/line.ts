import { Vector3 } from "../../vector";
import { Vertex } from "./index";
import Decimal from "decimal.js";

export default class Line {
    public start: Vertex;
    public end: Vertex;

    private length: Decimal = new Decimal(0);

    public static allLines: Line[] = [];

    constructor(start: Vertex, end: Vertex) {
        this.start = start;
        this.end = end;

        start.connectVertex(end);
        end.connectVertex(start);

        for (let line of Line.allLines) {
            if (line.toString() === this.toString()) {
                console.log("[Error] Line already exists");
                throw new Error("[Error] Line already exists");
            }
        }

        Line.allLines.push(this);
    }

    liesOnLine(vertex: Vertex): boolean {
        const startPos = this.start.getGlobalPosition();
        const endPos = this.end.getGlobalPosition();
        const vertexPos = vertex.getGlobalPosition();
    
        // Calculate direction vectors
        const lineVector = Vector3.subtract(endPos, startPos);
        const pointVector = Vector3.subtract(vertexPos, startPos);
    
        // Check if the pointVector is a scalar multiple of the lineVector
        const lineLengthSquared = lineVector.getMagnitude().pow(2).toDecimalPlaces(5);
        const pointProjLength = Vector3.dot(pointVector, lineVector).toDecimalPlaces(5);
    
        if (pointProjLength.lessThan(new Decimal(0)) || pointProjLength.greaterThan(lineLengthSquared)) {
            return false;
        }
    
        // Check collinearity by cross-product (in 2D, it's just the determinant of the 2x2 matrix formed by the vectors)
        const crossProduct = Vector3.cross(lineVector, pointVector);
        return crossProduct.getMagnitude().isZero();
    }    

    toString(): string {
        return `${this.start.toString()}${this.end.toString()}`
            .split("")
            .sort()
            .join("");
    }

    getLength(): Decimal {
        return this.length;
    }

    setLength(length: Decimal): void {
        this.length = length;
    }

    // Print line info
    print(): void {
        console.log(this);
    }
}
