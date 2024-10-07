import { Vector3 } from "../../vector3";
import Decimal from "decimal.js";

export default class Vertex {
    private name: string;
    private position: Vector3;
    private isDefined: boolean;
    private connectedVertices: Vertex[];

    constructor(name: string, position?: Vector3) {
        this.name = name;
        this.position = position || new Vector3(new Decimal(0), new Decimal(0), new Decimal(0));
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