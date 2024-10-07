import { Triangle } from "./Shapes";
import { degToRad, radToDeg } from "./mathUtils";
import Decimal from "decimal.js";

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
// Cosine Rule Formula
const cosineRule = new Formula(
    "cosineRule",
    "triangle",
    ["a", "b", "c"],
    function (triangle: Triangle) {
        const triangleData = {
            lineBC: triangle.lineBC.getLength(),
            lineCA: triangle.lineCA.getLength(),
            lineAB: triangle.lineAB.getLength(),
            angleCAB: triangle.angleCAB.getAngle(),
            angleABC: triangle.angleABC.getAngle(),
            angleBCA: triangle.angleBCA.getAngle()
        };

        const result = { ...triangleData };

        // Use the cosine rule to calculate the missing side 'a'
        if (triangleData.lineBC.equals(new Decimal(0)) && 
            !triangleData.lineCA.equals(new Decimal(0)) && 
            !triangleData.lineAB.equals(new Decimal(0)) && 
            !triangleData.angleCAB.equals(new Decimal(0))) {
            const cosValue = Decimal.cos(degToRad(triangleData.angleCAB));
            if (cosValue.abs().lte(1)) {  // cosValue must be between -1 and 1
                let calculation = Decimal.sqrt(
                    triangleData.lineCA.pow(2)
                    .plus(triangleData.lineAB.pow(2))
                    .minus(triangleData.lineCA.times(triangleData.lineAB).times(2).times(cosValue))
                );
                if (!calculation.isNaN()) result.lineBC = calculation.toDecimalPlaces(5);
            }
        }

        // Use the cosine rule to calculate the missing side 'b'
        if (triangleData.lineCA.equals(new Decimal(0)) && 
            !triangleData.lineBC.equals(new Decimal(0)) && 
            !triangleData.lineAB.equals(new Decimal(0)) && 
            !triangleData.angleABC.equals(new Decimal(0))) {
            const cosValue = Decimal.cos(degToRad(triangleData.angleABC));
            if (cosValue.abs().lte(1)) {
                let calculation = Decimal.sqrt(
                    triangleData.lineBC.pow(2)
                    .plus(triangleData.lineAB.pow(2))
                    .minus(triangleData.lineBC.times(triangleData.lineAB).times(2).times(cosValue))
                );
                if (!calculation.isNaN()) result.lineCA = calculation.toDecimalPlaces(5);
            }
        }

        // Use the cosine rule to calculate the missing side 'c'
        if (triangleData.lineAB.equals(new Decimal(0)) && 
            !triangleData.lineBC.equals(new Decimal(0)) && 
            !triangleData.lineCA.equals(new Decimal(0)) && 
            !triangleData.angleBCA.equals(new Decimal(0))) {
            const cosValue = Decimal.cos(degToRad(triangleData.angleBCA));
            if (cosValue.abs().lte(1)) {
                let calculation = Decimal.sqrt(
                    triangleData.lineBC.pow(2)
                    .plus(triangleData.lineCA.pow(2))
                    .minus(triangleData.lineBC.times(triangleData.lineCA).times(2).times(cosValue))
                );
                if (!calculation.isNaN()) result.lineAB = calculation.toDecimalPlaces(5);
            }
        }

        // Use the cosine rule to calculate angle A
        if (triangleData.angleCAB.equals(new Decimal(0)) && 
            !triangleData.lineBC.equals(new Decimal(0)) && 
            !triangleData.lineCA.equals(new Decimal(0)) && 
            !triangleData.lineAB.equals(new Decimal(0))) {
            const cosValue = triangleData.lineCA.pow(2)
                .plus(triangleData.lineAB.pow(2))
                .minus(triangleData.lineBC.pow(2))
                .dividedBy(triangleData.lineCA.times(triangleData.lineAB).times(2));

            if (cosValue.abs().lte(1)) {
                let calculation = Decimal.acos(cosValue);
                if (!calculation.isNaN()) result.angleCAB = radToDeg(calculation.toDecimalPlaces(5));;
            }
        }

        // Use the cosine rule to calculate angle B
        if (triangleData.angleABC.equals(new Decimal(0)) && 
            !triangleData.lineBC.equals(new Decimal(0)) && 
            !triangleData.lineCA.equals(new Decimal(0)) && 
            !triangleData.lineAB.equals(new Decimal(0))) {
            const cosValue = triangleData.lineBC.pow(2)
                .plus(triangleData.lineAB.pow(2))
                .minus(triangleData.lineCA.pow(2))
                .dividedBy(triangleData.lineBC.times(triangleData.lineAB).times(2));

            if (cosValue.abs().lte(1)) {
                let calculation = Decimal.acos(cosValue);
                if (!calculation.isNaN()) result.angleABC = radToDeg(calculation.toDecimalPlaces(5));;
            }
        }

        // Use the cosine rule to calculate angle C
        if (triangleData.angleBCA.equals(new Decimal(0)) && 
            !triangleData.lineBC.equals(new Decimal(0)) && 
            !triangleData.lineCA.equals(new Decimal(0)) && 
            !triangleData.lineAB.equals(new Decimal(0))) {
            const cosValue = triangleData.lineBC.pow(2)
                .plus(triangleData.lineCA.pow(2))
                .minus(triangleData.lineAB.pow(2))
                .dividedBy(triangleData.lineBC.times(triangleData.lineCA).times(2));

            if (cosValue.abs().lte(1)) {
                let calculation = Decimal.acos(cosValue);
                if (!calculation.isNaN()) result.angleBCA = radToDeg(calculation.toDecimalPlaces(5));;
            }
        }

        return result;
    }
);


// Sine Rule Formula
// Sine Rule Formula
const sineRule = new Formula(
    "sineRule",
    "triangle",
    ["a", "b", "c"],
    function (triangle: Triangle) {
        const triangleData = {
            lineBC: triangle.lineBC.getLength(),
            lineCA: triangle.lineCA.getLength(),
            lineAB: triangle.lineAB.getLength(),
            angleCAB: triangle.angleCAB.getAngle(),
            angleABC: triangle.angleABC.getAngle(),
            angleBCA: triangle.angleBCA.getAngle()
        };

        const result = { ...triangleData };

        // Use the sine rule to calculate the missing side 'a'
        if (triangleData.lineBC.equals(new Decimal(0)) && 
            !triangleData.lineCA.equals(new Decimal(0)) && 
            !triangleData.angleCAB.equals(new Decimal(0)) && 
            !triangleData.angleBCA.equals(new Decimal(0))) {
            let calculation = triangleData.lineCA
                .times(Decimal.sin(degToRad(triangleData.angleCAB)))
                .dividedBy(Decimal.sin(degToRad(triangleData.angleBCA)));
            if (!calculation.isNaN()) result.lineBC = calculation.toDecimalPlaces(5);
        }

        // Use the sine rule to calculate the missing side 'b'
        if (triangleData.lineCA.equals(new Decimal(0)) && 
            !triangleData.lineBC.equals(new Decimal(0)) && 
            !triangleData.angleABC.equals(new Decimal(0)) && 
            !triangleData.angleBCA.equals(new Decimal(0))) {
            let calculation = triangleData.lineBC
                .times(Decimal.sin(degToRad(triangleData.angleABC)))
                .dividedBy(Decimal.sin(degToRad(triangleData.angleBCA)));
            if (!calculation.isNaN()) result.lineCA = calculation.toDecimalPlaces(5);
        }

        // Use the sine rule to calculate the missing side 'c'
        if (triangleData.lineAB.equals(new Decimal(0)) && 
            !triangleData.lineBC.equals(new Decimal(0)) && 
            !triangleData.angleABC.equals(new Decimal(0)) && 
            !triangleData.angleCAB.equals(new Decimal(0))) {
            let calculation = triangleData.lineBC
                .times(Decimal.sin(degToRad(triangleData.angleCAB)))
                .dividedBy(Decimal.sin(degToRad(triangleData.angleABC)));
            if (!calculation.isNaN()) result.lineAB = calculation.toDecimalPlaces(5);
        }

        // Use the sine rule to calculate angle A
        if (triangleData.angleCAB.equals(new Decimal(0)) && 
            !triangleData.lineAB.equals(new Decimal(0)) && 
            !triangleData.angleABC.equals(new Decimal(0))) {
            let calculation = Decimal.asin(
                triangleData.lineAB
                .times(Decimal.sin(degToRad(triangleData.angleABC)))
                .dividedBy(triangleData.lineBC)
            );
            if (!calculation.isNaN() && calculation.abs().lte(1)) {
                result.angleCAB = radToDeg(calculation.toDecimalPlaces(5));
            }
        }

        return result;
    }
);


// Sum of Angles Formula
const sumOfAngles = new Formula(
    "sumOfAngles",
    "triangle",
    ["A", "B", "C"],
    function (triangle: Triangle) {
        const triangleData = {
            angleCAB: triangle.angleCAB.getAngle(),
            angleABC: triangle.angleABC.getAngle(),
            angleBCA: triangle.angleBCA.getAngle()
        };

        const result = { ...triangleData };

        // Calculate angle A if the sum of angles is not equal to 180
        if (triangleData.angleCAB.equals(new Decimal(0)) && 
            !triangleData.angleABC.equals(new Decimal(0)) && 
            !triangleData.angleBCA.equals(new Decimal(0))) {
            const calculation = new Decimal(180).minus(triangleData.angleABC).minus(triangleData.angleBCA);
            result.angleCAB = calculation.toDecimalPlaces(5);
        }

        // Calculate angle B if the sum of angles is not equal to 180
        if (triangleData.angleABC.equals(new Decimal(0)) && 
            !triangleData.angleABC.equals(new Decimal(0)) && 
            !triangleData.angleBCA.equals(new Decimal(0))) {
            const calculation = new Decimal(180).minus(triangleData.angleABC).minus(triangleData.angleBCA);
            result.angleABC = calculation.toDecimalPlaces(5);
        }

        // Calculate angle C if the sum of angles is not equal to 180
        if (triangleData.angleBCA.equals(new Decimal(0)) && 
            !triangleData.angleABC.equals(new Decimal(0)) && 
            !triangleData.angleABC.equals(new Decimal(0))) {
            const calculation = new Decimal(180).minus(triangleData.angleABC).minus(triangleData.angleABC);
            result.angleBCA = calculation.toDecimalPlaces(5);
        }

        return result;
    }
);


// Exporting the formulas
const formulas = [cosineRule, sineRule, sumOfAngles];
export { formulas as triangleFormulas };
