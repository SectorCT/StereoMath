import Decimal from "decimal.js";


export function radToDeg(rad: Decimal): Decimal {
    return rad.times(180).div(Math.PI);
}

// Helper to convert degrees to radians
export function degToRad(deg: Decimal): Decimal {
    return deg.times(Math.PI).div(180);
}
