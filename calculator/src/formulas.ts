import { Triangle } from "./test2";
import { fixPrecision, degToRad, radToDeg } from "./mathUtils";

class Formula {
    name: string;
    figureName: string;
    requirements: string[];
    executeFunction: Function;

    constructor(name: string, figureName: string, requirements: string[], executeFunction: Function) {
        this.name = name;
        this.figureName = figureName;
        this.requirements = requirements;
        this.executeFunction = executeFunction;
    }

    execute(triangle: Triangle): any {
        return this.executeFunction(triangle);
    }
}


// Cosine Rule Formula
const cosineRule = new Formula(
    "cosineRule",
    "triangle",
    ["a", "b", "c"],
    function (triangle: Triangle) {
        const triangleData = {
            a: triangle.lineBC.getLength(),
            b: triangle.lineCA.getLength(),
            c: triangle.lineAB.getLength(),
            A: triangle.angleCAB.getAngle(),
            B: triangle.angleABC.getAngle(),
            C: triangle.angleBCA.getAngle()
        }

        const result = { ...triangleData };

        // Use the cosine rule to calculate the missing side 'a'
        if (triangleData.a == null && triangleData.b != null && triangleData.c != null && triangleData.A != null) {
            let calculation = Math.sqrt(triangleData.b ** 2 + triangleData.c ** 2 - 2 * triangleData.b * triangleData.c * Math.cos(degToRad(triangleData.A)));
            if (!isNaN(calculation)) result.a = fixPrecision(calculation);
        }

        // Use the cosine rule to calculate the missing side 'b'
        if (triangleData.b == null && triangleData.a != null && triangleData.c != null && triangleData.B != null) {
            let calculation = Math.sqrt(triangleData.a ** 2 + triangleData.c ** 2 - 2 * triangleData.a * triangleData.c * Math.cos(degToRad(triangleData.B)));
            if (!isNaN(calculation)) result.b = fixPrecision(calculation);
        }

        // Use the cosine rule to calculate the missing side 'c'
        if (triangleData.c == null && triangleData.a != null && triangleData.b != null && triangleData.C != null) {
            let calculation = Math.sqrt(triangleData.a ** 2 + triangleData.b ** 2 - 2 * triangleData.a * triangleData.b * Math.cos(degToRad(triangleData.C)));
            if (!isNaN(calculation)) result.c = fixPrecision(calculation);
        }

        // Use the cosine rule to calculate angle A
        if (triangleData.A == null && triangleData.a != null && triangleData.b != null && triangleData.c != null) {
            let calculation = Math.acos((triangleData.b ** 2 + triangleData.c ** 2 - triangleData.a ** 2) / (2 * triangleData.b * triangleData.c));
            if (!isNaN(calculation)) result.A = fixPrecision(radToDeg(calculation));
        }

        // Use the cosine rule to calculate angle B
        if (triangleData.B == null && triangleData.a != null && triangleData.b != null && triangleData.c != null) {
            let calculation = Math.acos((triangleData.a ** 2 + triangleData.c ** 2 - triangleData.b ** 2) / (2 * triangleData.a * triangleData.c));
            if (!isNaN(calculation)) result.B = fixPrecision(radToDeg(calculation));
        }

        // Use the cosine rule to calculate angle C
        if (triangleData.C == null && triangleData.a != null && triangleData.b != null && triangleData.c != null) {
            let calculation = Math.acos((triangleData.a ** 2 + triangleData.b ** 2 - triangleData.c ** 2) / (2 * triangleData.a * triangleData.b));
            if (!isNaN(calculation)) result.C = fixPrecision(radToDeg(calculation));
        }

        return result;
    }
);

// Sine Rule Formula
const sineRule = new Formula(
    "sineRule",
    "triangle",
    ["a", "b", "c"],
    function (triangle: Triangle) {
        const triangleData = {
            a: triangle.lineBC.getLength(),
            b: triangle.lineCA.getLength(),
            c: triangle.lineAB.getLength(),
            A: triangle.angleCAB.getAngle(),
            B: triangle.angleABC.getAngle(),
            C: triangle.angleBCA.getAngle()
        }

        const result = { ...triangleData };

        // Use the sine rule to calculate the missing side 'a'
        if (triangleData.a == null && triangleData.b != null && triangleData.A != null && triangleData.B != null) {
            let calculation = triangleData.b * Math.sin(degToRad(triangleData.A)) / Math.sin(degToRad(triangleData.B));
            if (!isNaN(calculation)) result.a = fixPrecision(calculation);
        }

        // Use the sine rule to calculate the missing side 'b'
        if (triangleData.b == null && triangleData.a != null && triangleData.A != null && triangleData.B != null) {
            let calculation = triangleData.a * Math.sin(degToRad(triangleData.B)) / Math.sin(degToRad(triangleData.A));
            if (!isNaN(calculation)) result.b = fixPrecision(calculation);
        }

        // Use the sine rule to calculate the missing side 'c'
        if (triangleData.c == null && triangleData.a != null && triangleData.A != null && triangleData.C != null) {
            let calculation = triangleData.a * Math.sin(degToRad(triangleData.C)) / Math.sin(degToRad(triangleData.A));
            if (!isNaN(calculation)) result.c = fixPrecision(calculation);
        }

        // Use the sine rule to calculate angle A
        if (triangleData.A == null && triangleData.a != null) {
            if (triangleData.b != null && triangleData.B != null) {
                let calculation = Math.asin(triangleData.a * Math.sin(degToRad(triangleData.B)) / triangleData.b);
                if (!isNaN(calculation)) result.A = fixPrecision(radToDeg(calculation));
            } else if (triangleData.c != null && triangleData.C != null) {
                let calculation = Math.asin(triangleData.a * Math.sin(degToRad(triangleData.C)) / triangleData.c);
                if (!isNaN(calculation)) result.A = fixPrecision(radToDeg(calculation));
            }
        }
        

        // Use the sine rule to calculate angle B
        if (triangleData.B == null && triangleData.b != null){
            if (triangleData.a != null && triangleData.A != null) {
                let calculation = Math.asin(triangleData.b * Math.sin(degToRad(triangleData.A)) / triangleData.a);
                if (!isNaN(calculation)) result.B = fixPrecision(radToDeg(calculation));
            } else if (triangleData.c != null && triangleData.C != null) {
                let calculation = Math.asin(triangleData.b * Math.sin(degToRad(triangleData.C)) / triangleData.c);
                if (!isNaN(calculation)) result.B = fixPrecision(radToDeg(calculation));
            }
        }

        // Use the sine rule to calculate angle C
        if (triangleData.C == null && triangleData.c != null){
            if (triangleData.a != null && triangleData.A != null) {
                let calculation = Math.asin(triangleData.c * Math.sin(degToRad(triangleData.A)) / triangleData.a);
                if (!isNaN(calculation)) result.C = fixPrecision(radToDeg(calculation));
            } else if (triangleData.b != null && triangleData.B != null) {
                let calculation = Math.asin(triangleData.c * Math.sin(degToRad(triangleData.B)) / triangleData.b);
                if (!isNaN(calculation)) result.C = fixPrecision(radToDeg(calculation));
            }
        }

        return result;
    }
);

const sumOfAngles = new Formula(
    "sumOfAngles",
    "triangle",
    ["A", "B", "C"],
    function (triangle: Triangle) {
        const triangleData = {
            A: triangle.angleCAB.getAngle(),
            B: triangle.angleABC.getAngle(),
            C: triangle.angleBCA.getAngle()
        }

        const result = { ...triangleData };

        // Calculate angle A
        if (triangleData.A == null && triangleData.B != null && triangleData.C != null) {
            result.A = 180 - triangleData.B - triangleData.C;
        }

        // Calculate angle B
        if (triangleData.B == null && triangleData.A != null && triangleData.C != null) {
            result.B = 180 - triangleData.A - triangleData.C;
        }

        // Calculate angle C
        if (triangleData.C == null && triangleData.A != null && triangleData.B != null) {
            result.C = 180 - triangleData.A - triangleData.B;
        }

        for (let key in result) {
            result[key] = fixPrecision(result[key]);
        }

        return result;
    }
);

// Exporting the formulas
const formulas = [cosineRule, sineRule, sumOfAngles];
export { formulas as triangleFormulas };
