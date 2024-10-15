import { Vector3, Vector2 } from "../../vector";
import Decimal from "decimal.js";
import Plane from "./plane";

export default class Vertex {
    private name: string;
    private globalPosition: Vector3;
    private localPosition: Vector2;

    private isPositionDefinedFlag: boolean;
    private connectedVertices: Vertex[];

    public static allVertices: Vertex[] = [];

    constructor(name: string, localPosition?: Vector2) {
        this.name = name;
        this.localPosition =
            localPosition || new Vector2(new Decimal(0), new Decimal(0));

        this.isPositionDefinedFlag = false;

        if (localPosition) {
            this.isPositionDefinedFlag = true;
        }

        this.connectedVertices = [];

        for (let vertex of Vertex.allVertices) {
            if (vertex.getName() === this.name) {
                console.log("[Error] Vertex already exists");
                throw new Error("[Error] Vertex already exists");
            }
        }

        Vertex.allVertices.push(this);
    }

    getName(): string {
        return this.name;
    }

    // Set position of the vertex
    setGlobalPosition(position: Vector3, plane: Plane): void {
        this.globalPosition = position;
        this.localPosition = plane.convertWorldToLocal(position);
        this.isPositionDefinedFlag = true;
    }

    setLocalPosition(position: Vector2, plane: Plane): void {
        this.localPosition = position;
        this.globalPosition = plane.convertLocalToWorld(position);
        this.isPositionDefinedFlag = true;
    }

    // Get position of the vertex
    getGlobalPosition(): Vector3 {
        return this.globalPosition;
    }

    getLocalPosition(): Vector2 {
        return this.localPosition;
    }

    // Check if the vertex is defined
    isPositionDefined(): boolean {
        return this.isPositionDefinedFlag;
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
        console.log(`${this.name} ${this.globalPosition.toString()}`);
    }
}
