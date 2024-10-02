class Vertex {
    restraints: number[] | Line | null;
    name: string | null;
    constructor(restraints: number[] | Line | null, name: string | null) {
        this.restraints = restraints;
        this.name = name;
    }

    print() {
        console.log(this.name, this.restraints);
    }
}

class Line {
    start: Vertex;
    end: Vertex;
    hardlyDefined: boolean;
    length: number | string;

    middlePoints: Vertex[] = [];

    constructor(start: Vertex, end: Vertex) {
        this.start = start;
        this.end = end;
        this.hardlyDefined = false;
    }

    setHardLength(length: number | string) {
        this.hardlyDefined = true;

        if (typeof length != "number") this.length = length;
        else this.length = parseFloat((length).toFixed(6));
    }

    setLengthFromCalculation(length: number | string) {
        this.hardlyDefined = false;

        if (typeof length != "number") this.length = length;
        else this.length = parseFloat((length).toFixed(6));
    }

    print() {
        console.log(`${this.start.name}${this.end.name} -> ${this.length} (${this.hardlyDefined})`);
    }

}

class Angle {
    a: Line;
    b: Line;
    hardlyDefined: boolean;
    value: number | string;

    constructor(a: Line, b: Line) {
        this.a = a;
        this.b = b;
        this.hardlyDefined = false;
    }

    setHardValue(value: number | string) {
        if (typeof value != "number") this.value = value;
        else this.value = parseFloat((value).toFixed(4));
        this.hardlyDefined = true;
    }

    setValueFromCalculation(value: number | string) {
        if (typeof value != "number") this.value = value;
        else this.value = parseFloat((value).toFixed(4));
        this.hardlyDefined = false;
    }

    print() {
        console.log(`${this.a.start.name}${this.a.end.name}${this.b.end.name} -> ${this.value} (${this.hardlyDefined})`);
    }

}

class Formula {
    result: string;
    requirements: string[];
    calculate: Function;

    constructor(result: string, requirements: string[], calculate: Function) {
        this.result = result;
        this.requirements = requirements;
        this.calculate = calculate;
    }
}

class Triangle {
    a: Vertex;
    b: Vertex;
    c: Vertex;

    ab: Line;
    bc: Line;
    ca: Line;

    abc: Angle;
    bca: Angle;
    cab: Angle;

    formulas: Formula[];

    constructor() {
        this.a = new Vertex(null, "A");
        this.b = new Vertex(null, "B");
        this.c = new Vertex(null, "C");

        this.ab = new Line(this.a, this.b);
        this.bc = new Line(this.b, this.c);
        this.ca = new Line(this.c, this.a);

        this.abc = new Angle(this.ab, this.bc);
        this.bca = new Angle(this.bc, this.ca);
        this.cab = new Angle(this.ca, this.ab);

        this.formulas = [];

        this.initFormulas();
    }

    initFormulas() {
        const cosineRuleAngle = (line1, line2, oppositeLine, angle) => {
            return () => {
                if (!(typeof line1.length == "number" && typeof line2.length == "number" && typeof oppositeLine.length == "number")) return;
                let valueInRadians = Math.acos((line1.length ** 2 + line2.length ** 2 - oppositeLine.length ** 2) / (2 * line1.length * line2.length));
                angle.setValueFromCalculation(valueInRadians * 180 / Math.PI);
            }
        };

        const cosineRuleSide = (line1, line2, angle, oppositeLine) => {
            return () => {
                if (!(typeof line1.length == "number" && typeof line2.length == "number" && typeof angle.value == "number")) return;
                let length = Math.sqrt(line1.length ** 2 + line2.length ** 2 - 2 * line1.length * line2.length * Math.cos(angle.value * Math.PI / 180));
                oppositeLine.setLengthFromCalculation(length);
            }
        };

        // Define formulas using the general functions
        this.formulas.push(
            new Formula("abc.value", ["ab.length", "bc.length", "ca.length"], cosineRuleAngle(this.ab, this.bc, this.ca, this.abc))
        );

        this.formulas.push(
            new Formula("bca.value", ["bc.length", "ca.length", "ab.length"], cosineRuleAngle(this.bc, this.ca, this.ab, this.bca))
        );

        this.formulas.push(
            new Formula("cab.value", ["ca.length", "ab.length", "bc.length"], cosineRuleAngle(this.ca, this.ab, this.bc, this.cab))
        );

        this.formulas.push(
            new Formula("ca.length", ["ab.length", "bc.length", "abc.value"], cosineRuleSide(this.ab, this.bc, this.abc, this.ca))
        );

        this.formulas.push(
            new Formula("ab.length", ["bc.length", "ca.length", "bca.value"], cosineRuleSide(this.bc, this.ca, this.bca, this.ab))
        );

        this.formulas.push(
            new Formula("bc.length", ["ca.length", "ab.length", "cab.value"], cosineRuleSide(this.ca, this.ab, this.cab, this.bc))
        );

        const sineRuleSide = (line1, angle, angle2, line2) => {
            return () => {
                if (!(typeof line1.length == "number" && typeof angle.value == "number" && typeof angle2.value == "number")) return;
                let length = line1.length * Math.sin(angle2.value * Math.PI / 180) / Math.sin(angle.value * Math.PI / 180);
                line2.setLengthFromCalculation(length);
            }
        };

        this.formulas.push(
            new Formula("ca.length", ["ab.length", "abc.value", "bca.value"], sineRuleSide(this.ab, this.abc, this.bca, this.ca))
        );

        this.formulas.push(
            new Formula("ab.length", ["bc.length", "bca.value", "cab.value"], sineRuleSide(this.bc, this.bca, this.cab, this.ab))
        );

        this.formulas.push(
            new Formula("bc.length", ["ca.length", "cab.value", "abc.value"], sineRuleSide(this.ca, this.cab, this.abc, this.bc))
        );

        const sumOfAngles = (angle1, angle2, angle3) => {
            return () => {
                if (!(typeof angle1.value == "number" && typeof angle2.value == "number")) return;
                angle3.setValueFromCalculation(180 - angle1.value - angle2.value);
            }
        };  

        this.formulas.push(
            new Formula("cab.value", ["abc.value", "bca.value"], sumOfAngles(this.abc, this.bca, this.cab))
        );

        this.formulas.push(
            new Formula("abc.value", ["cab.value", "bca.value"], sumOfAngles(this.cab, this.bca, this.abc))
        );

        this.formulas.push(
            new Formula("bca.value", ["cab.value", "abc.value"], sumOfAngles(this.cab, this.abc, this.bca))
        );

    }

    defineHardAngle(angle: string, value: number | string) {
        angle = angle.toUpperCase();
        if (angle == `${this.a.name}${this.b.name}${this.c.name}` || angle == `${this.c.name}${this.b.name}${this.a.name}`) {
            this.abc.setHardValue(value);
        } else if (angle == `${this.b.name}${this.c.name}${this.a.name}` || angle == `${this.a.name}${this.c.name}${this.b.name}`) {
            this.bca.setHardValue(value);
        } else if (angle == `${this.c.name}${this.a.name}${this.b.name}` || angle == `${this.b.name}${this.a.name}${this.c.name}`) {
            this.cab.setHardValue(value);
        } else {
            console.log("Invalid angle");
        }
    }

    defineHardLine(line: string, value: number | string) {
        line = line.toUpperCase().split("").sort().join("");
        if (line == `${this.a.name}${this.b.name}`.toUpperCase().split("").sort().join("")) {
            this.ab.setHardLength(value);
        } else if (line == `${this.b.name}${this.c.name}`.toUpperCase().split("").sort().join("")) {
            this.bc.setHardLength(value);
        } else if (line == `${this.c.name}${this.a.name}`.toUpperCase().split("").sort().join("")) {
            this.ca.setHardLength(value);
        } else {
            console.log("Invalid line");
        }
    }

    calculate() {
        let variables = {
            "ab.length": this.ab.length,
            "bc.length": this.bc.length,
            "ca.length": this.ca.length,
            "abc.value": this.abc.value,
            "bca.value": this.bca.value,
            "cab.value": this.cab.value
        };

        let numberOfDefinedSides = 0;
        if (this.ab.hardlyDefined) numberOfDefinedSides++;
        if (this.bc.hardlyDefined) numberOfDefinedSides++;
        if (this.ca.hardlyDefined) numberOfDefinedSides++;

        if (numberOfDefinedSides < 1) {
            console.log("Not enough information to fully define the triangle");
            return;
        }

        let numberOfDefinedAngles = 0;
        if (this.abc.hardlyDefined) numberOfDefinedAngles++;
        if (this.bca.hardlyDefined) numberOfDefinedAngles++;
        if (this.cab.hardlyDefined) numberOfDefinedAngles++;

        if (numberOfDefinedSides + numberOfDefinedAngles < 3) {
            console.log("Not enough information to fully define the triangle");
            return;
        }

        console.log(`Number of defined sides: ${numberOfDefinedSides}`);
        console.log(`Number of defined angles: ${numberOfDefinedAngles}`);

        let isUpdated = true;
        while (isUpdated) {
            isUpdated = false;

            for (let formula of this.formulas) {
                if (variables[formula.result] != undefined) continue;

                let canCalculate = formula.requirements.every(req => {
                    return typeof variables[req] == "number";
                });
        
                if (canCalculate) {
                    formula.calculate();
                    isUpdated = true;
                    console.log(`Calculated ${formula.result}`);
                    this.print();
                    variables = {
                        "ab.length": this.ab.length,
                        "bc.length": this.bc.length,
                        "ca.length": this.ca.length,
                        "abc.value": this.abc.value,
                        "bca.value": this.bca.value,
                        "cab.value": this.cab.value
                    };
                }
            }
        }
    }

    isTriangleFullyDefined() {
        return this.ab.hardlyDefined && this.bc.hardlyDefined && this.ca.hardlyDefined && this.abc.hardlyDefined && this.bca.hardlyDefined && this.cab.hardlyDefined;
    }

    buildTriangle() {
    
        if (this.isTriangleFullyDefined()) return;
        if (!(typeof this.ab.length == "number" && typeof this.bc.length == "number" && typeof this.abc.value == "number")) return;
        if (!(typeof this.abc.value == "number" && typeof this.bca.value == "number" && typeof this.cab.value == "number")) return;

        if (this.a.restraints == null) this.a.restraints = [0, 0, 0];
        this.b.restraints = [this.ab.length, 0, 0];

        let x = this.ab.length * Math.cos(this.abc.value * Math.PI / 180);
        let y = this.ab.length * Math.sin(this.abc.value * Math.PI / 180);

        this.c.restraints = [x, y, 0];


    }

    print() {
        this.a.print();
        this.b.print();
        this.c.print();

        this.ab.print();
        this.bc.print();
        this.ca.print();

        this.abc.print();
        this.bca.print();
        this.cab.print();
        console.log("\n");
    }
}

function main() {
    let triangle = new Triangle();

    triangle.defineHardAngle("BAC", 43);
    triangle.defineHardLine("AB", 50);
    triangle.defineHardLine("AC", 50);

    triangle.calculate();
    triangle.buildTriangle();

    triangle.print();
}

main();
