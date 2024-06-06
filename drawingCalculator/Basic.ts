class Vertex{
    restraints: number[] | Line | null;
    name: string | null;
    constructor(restraints: number[] | Line | null, name: string | null){
        this.restraints = restraints;
        this.name = name;
    }

    print(){
        console.log(this.name, this.restraints);
    }
}

class Line{
    start: Vertex;
    end: Vertex;
    hardlyDefined: boolean;
    length: number | string;

    middlePoints: Vertex[] = [];

    constructor(start: Vertex, end: Vertex){
        this.start = start;
        this.end = end;
        this.hardlyDefined = false;
    }

    setHardLength(length: number | string){
        this.hardlyDefined = true;
        
        if(typeof length != "number") this.length = length;
        else this.length = parseFloat((length).toFixed(6));
    }

    setLengthFromCalculation(length: number | string){
        this.hardlyDefined = false;
        
        if(typeof length != "number") this.length = length;
        else this.length = parseFloat((length).toFixed(6));
    }

    print(){
        console.log(`${this.start.name}${this.end.name} -> ${this.length} (${this.hardlyDefined})`);
    }
    
}

class Angle{
    a: Line;
    b: Line;
    hardlyDefined: boolean;
    value: number | string;

    constructor(a: Line, b: Line){
        this.a = a;
        this.b = b;
        this.hardlyDefined = false;
    }

    setHardValue(value: number | string){
        if(typeof value != "number") this.value = value;
        else this.value = parseFloat((value).toFixed(4));
        this.hardlyDefined = true;
    }

    setValueFromCalculation(value: number | string){
        if(typeof value != "number") this.value = value;
        else this.value = parseFloat((value).toFixed(4));
        this.hardlyDefined = false;
    }   

    print(){
        console.log(`${this.a.start.name}${this.a.end.name}${this.b.end.name} -> ${this.value} (${this.hardlyDefined})`);
    }

}

class Triangle{
    a: Vertex;
    b: Vertex;
    c: Vertex;

    ab: Line;
    bc: Line;
    ca: Line;
    
    abc: Angle;
    bca: Angle;
    cab: Angle;

    private _calculateFromThreeSides() {
        if(!(typeof this.ab.length == "number")) return;
            if(!(typeof this.bc.length == "number")) return;
            if(!(typeof this.ca.length == "number")) return;

            let sides = [this.ab.length, this.bc.length, this.ca.length];
            sides.sort((a, b) => a - b);
            if (sides[0] + sides[1] <= sides[2]) {
                throw new Error("The sides do not form a valid triangle");
                return;
            }

            // Calculate angles
            if(!this.abc.hardlyDefined){
                let valueInRadians = Math.acos((this.ab.length ** 2 + this.bc.length ** 2 - this.ca.length ** 2) / (2 * this.ab.length * this.bc.length));
                this.abc.setValueFromCalculation(valueInRadians * 180 / Math.PI);
            }
            if(!this.bca.hardlyDefined){
                let valueInRadians = Math.acos((this.bc.length ** 2 + this.ca.length ** 2 - this.ab.length ** 2) / (2 * this.bc.length * this.ca.length));
                this.bca.setValueFromCalculation(valueInRadians * 180 / Math.PI);
            }  
            if(!this.cab.hardlyDefined){
                let valueInRadians = Math.acos((this.ca.length ** 2 + this.ab.length ** 2 - this.bc.length ** 2) / (2 * this.ca.length * this.ab.length));
                this.cab.setValueFromCalculation(valueInRadians * 180 / Math.PI);
            }

            return;
    }
    
    private _calculateFromTwoSidesAndOneAngle() {
        let lineA: Line | undefined = undefined;
        let lineB: Line | undefined = undefined;

        if (this.ab.hardlyDefined) lineA = this.ab;
        if (this.bc.hardlyDefined && !lineA) lineA = this.bc;
        if (this.ca.hardlyDefined && !lineA) lineA = this.ca;

        if (this.ab.hardlyDefined && this.ab != lineA) lineB = this.ab;
        if (this.bc.hardlyDefined && this.bc != lineA) lineB = this.bc;
        if (this.ca.hardlyDefined && this.ca != lineA) lineB = this.ca;

        if (!lineA || !lineB) return;

        if (!(typeof lineA.length == "number")) return;
        if (!(typeof lineB.length == "number")) return;

        let angle: Angle | undefined = undefined;
        if (this.abc.hardlyDefined) angle = this.abc;
        if (this.bca.hardlyDefined && !angle) angle = this.bca;
        if (this.cab.hardlyDefined && !angle) angle = this.cab;

        if (!angle) return;
        if (!(typeof angle.value == "number")) return;

        let undefinedLine: Line | undefined = undefined;
        if (this.ab != lineA && this.ab != lineB) undefinedLine = this.ab;
        else if (this.bc != lineA && this.bc != lineB) undefinedLine = this.bc;
        else undefinedLine = this.ca;

        // Case 1: The angle is between the two known sides (SAS)
        if (angle.a == lineA && angle.b == lineB || angle.a == lineB && angle.b == lineA) {
            // Using Law of Cosines
            let length = Math.sqrt(lineA.length ** 2 + lineB.length ** 2 - 2 * lineA.length * lineB.length * Math.cos(angle.value * Math.PI / 180));
            undefinedLine.setLengthFromCalculation(length);
        }
        // Case 2: The angle is opposite one of the known sides (SSA)
        else if (angle.a == lineA && angle.b == undefinedLine || angle.a == undefinedLine && angle.b == lineA) {
            // Using Law of Sines
            let sinValue = lineA.length * Math.sin(angle.value * Math.PI / 180) / lineB.length;
            if (sinValue > 1 || sinValue < -1) return; // No valid triangle if sinValue is not in range [-1, 1]
            let otherAngleInRadians = Math.asin(sinValue);
            let otherAngleInDegrees = otherAngleInRadians * 180 / Math.PI;
            let thirdAngleInDegrees = 180 - angle.value - otherAngleInDegrees;
            let thirdAngleInRadians = thirdAngleInDegrees * Math.PI / 180;
            let length = lineA.length * Math.sin(thirdAngleInRadians) / Math.sin(angle.value * Math.PI / 180);
            undefinedLine.setLengthFromCalculation(length);
        }
        else if (angle.a == lineB && angle.b == undefinedLine || angle.a == undefinedLine && angle.b == lineB) {
            // Using Law of Sines
            let sinValue = lineB.length * Math.sin(angle.value * Math.PI / 180) / lineA.length;
            if (sinValue > 1 || sinValue < -1) return; // No valid triangle if sinValue is not in range [-1, 1]
            let otherAngleInRadians = Math.asin(sinValue);
            let otherAngleInDegrees = otherAngleInRadians * 180 / Math.PI;
            let thirdAngleInDegrees = 180 - angle.value - otherAngleInDegrees;
            let thirdAngleInRadians = thirdAngleInDegrees * Math.PI / 180;
            let length = lineB.length * Math.sin(thirdAngleInRadians) / Math.sin(angle.value * Math.PI / 180);
            undefinedLine.setLengthFromCalculation(length);
        }

        this._calculateFromThreeSides();

        return;
    }

    private _calculateFromTwoAnglesAndOneSide() {
        // Find the defined side
        let definedSide: Line | undefined = undefined;
        if (this.ab.hardlyDefined) definedSide = this.ab;
        if (this.bc.hardlyDefined) definedSide = this.bc;
        if (this.ca.hardlyDefined) definedSide = this.ca;

        if (!definedSide) return;
        if (!(typeof definedSide.length == "number")) return;

        // Find the defined angles
        let definedAngles: Angle[] = [];
        if (this.abc.hardlyDefined) definedAngles.push(this.abc);
        if (this.bca.hardlyDefined) definedAngles.push(this.bca);
        if (this.cab.hardlyDefined) definedAngles.push(this.cab);

        if (definedAngles.length != 2) return;
        if (!(typeof definedAngles[0].value == "number")) return;
        if (!(typeof definedAngles[1].value == "number")) return;

        // Calculate the third angle
        let angleSum = definedAngles[0].value + definedAngles[1].value;
        let thirdAngleValue = 180 - angleSum;

        // Determine which angle is undefined
        let undefinedAngle: Angle | undefined;
        if (!this.abc.hardlyDefined) undefinedAngle = this.abc;
        if (!this.bca.hardlyDefined) undefinedAngle = this.bca;
        if (!this.cab.hardlyDefined) undefinedAngle = this.cab;

        if (!undefinedAngle) return;

        // Set the third angle
        undefinedAngle.setValueFromCalculation(thirdAngleValue);

        // Calculate the lengths of the remaining sides using the Law of Sines
        let sideA = definedSide.length;
        let angleA = definedAngles[0].value * Math.PI / 180;
        let angleB = definedAngles[1].value * Math.PI / 180;
        let angleC = thirdAngleValue * Math.PI / 180;

        if (definedSide === this.ab) {
            let lengthBC = (sideA * Math.sin(angleB)) / Math.sin(angleC);
            let lengthCA = (sideA * Math.sin(angleA)) / Math.sin(angleC);
            this.bc.setLengthFromCalculation(lengthBC);
            this.ca.setLengthFromCalculation(lengthCA);
        } else if (definedSide === this.bc) {
            let lengthCA = (sideA * Math.sin(angleA)) / Math.sin(angleC);
            let lengthAB = (sideA * Math.sin(angleB)) / Math.sin(angleC);
            this.ca.setLengthFromCalculation(lengthCA);
            this.ab.setLengthFromCalculation(lengthAB);
        } else if (definedSide === this.ca) {
            let lengthAB = (sideA * Math.sin(angleB)) / Math.sin(angleC);
            let lengthBC = (sideA * Math.sin(angleA)) / Math.sin(angleC);
            this.ab.setLengthFromCalculation(lengthAB);
            this.bc.setLengthFromCalculation(lengthBC);
        }

        return;
    }

    constructor(){
        this.a = new Vertex(null, "A");
        this.b = new Vertex(null, "B");
        this.c = new Vertex(null, "C");

        this.ab = new Line(this.a, this.b);
        this.bc = new Line(this.b, this.c);
        this.ca = new Line(this.c, this.a);

        this.abc = new Angle(this.ab, this.bc);
        this.bca = new Angle(this.bc, this.ca);
        this.cab = new Angle(this.ca, this.ab);
    }

    defineHardAngle(angle: string, value: number | string){
        angle = angle.toUpperCase();
        if(angle == `${this.a.name}${this.b.name}${this.c.name}` || angle == `${this.c.name}${this.b.name}${this.a.name}`){
            this.abc.setHardValue(value);
        }else if(angle == `${this.b.name}${this.c.name}${this.a.name}` || angle == `${this.a.name}${this.c.name}${this.b.name}`){
            this.bca.setHardValue(value);
        } else if(angle == `${this.c.name}${this.a.name}${this.b.name}` || angle == `${this.b.name}${this.a.name}${this.c.name}`){
            this.cab.setHardValue(value);
        } else {
            console.log("Invalid angle");
        }
    }

    defineHardLine(line: string, value: number | string){
        line = line.toUpperCase().split("").sort().join("");
        if(line == `${this.a.name}${this.b.name}`.toUpperCase().split("").sort().join("")){
            this.ab.setHardLength(value);
        }else if(line == `${this.b.name}${this.c.name}`.toUpperCase().split("").sort().join("")){
            this.bc.setHardLength(value);
        } else if(line == `${this.c.name}${this.a.name}`.toUpperCase().split("").sort().join("")){
            this.ca.setHardLength(value);
        } else {
            console.log("Invalid line");
        }
    }

    calculate(){
        let numberOfDefinedSides = 0;
        if(this.ab.hardlyDefined) numberOfDefinedSides++;
        if(this.bc.hardlyDefined) numberOfDefinedSides++;
        if(this.ca.hardlyDefined) numberOfDefinedSides++;

        if (numberOfDefinedSides < 1){
            console.log("Not enough information to fully define the triangle");
            return;
        }

        let numberOfDefinedAngles = 0;
        if(this.abc.hardlyDefined) numberOfDefinedAngles++;
        if(this.bca.hardlyDefined) numberOfDefinedAngles++;
        if(this.cab.hardlyDefined) numberOfDefinedAngles++;

        if(numberOfDefinedSides + numberOfDefinedAngles < 3){
            console.log("Not enough information to fully define the triangle");
            return;
        }

        console.log(`Number of defined sides: ${numberOfDefinedSides}`);
        console.log(`Number of defined angles: ${numberOfDefinedAngles}`);

        if(numberOfDefinedSides == 3) this._calculateFromThreeSides();
        else if(numberOfDefinedSides == 2) this._calculateFromTwoSidesAndOneAngle();
        else if(numberOfDefinedSides == 1) this._calculateFromTwoAnglesAndOneSide();
    }

    isTriangleValid(){
        let sides = [this.ab.length, this.bc.length, this.ca.length];

    
        return true;
    }

    print(){
        this.a.print();
        this.b.print();
        this.c.print();

        this.ab.print();
        this.bc.print();
        this.ca.print();

        this.abc.print();
        this.bca.print();
        this.cab.print();
    }
}

function main(){
    let triangle = new Triangle();

    triangle.defineHardLine("AB", 5);
    triangle.defineHardAngle("BAC", 30);
    triangle.defineHardAngle("ABC", 120);

    triangle.calculate();


    triangle.print();
}

main();