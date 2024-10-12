import { Vector3, Vector2 } from "../../vector";
import Decimal from "decimal.js";

export default class Vertex {
    private name: string;
    private globalPosition: Vector3;
    private localPosition: Vector2;

    private isGlobalDefined: boolean;
    private isLocalDefined: boolean;
    private connectedVertices: Vertex[];

    constructor(name: string, localPosition?: Vector2) {
        this.name = name;
        this.localPosition = localPosition || new Vector2(new Decimal(0), new Decimal(0));
        

        this.isGlobalDefined = false;
        this.isLocalDefined = false;

        if(localPosition) {
            this.isLocalDefined = true;
        }
        
        
        this.connectedVertices = [];
    }

    getName(): string {
        return this.name;
    }

    // Set position of the vertex
    setGlobalPosition(position: Vector3): void {
        this.globalPosition = position;
        this.isGlobalDefined = true;  
    }

    setLocalPosition(position: Vector2): void {
        this.localPosition = position;
        this.isLocalDefined = true;
    }

    // Get position of the vertex
    getGlobalPosition(): Vector3 {
        return this.globalPosition;
    }

    getLocalPosition(): Vector2 {
        return this.localPosition;
    }

    // Check if the vertex is defined
    isGlobalPositionDefined(): boolean {
        return this.isGlobalDefined;
    }

    isLocalPositionDefined(): boolean {
        return this.isLocalDefined;
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
        if (this.isGlobalPositionDefined()) {
            console.log(
                `${this.name} ${this.globalPosition.toString()}`
            );
        } else {
            console.log(`${this.name} ${this.localPosition.toString()}`);
        }
    }
}