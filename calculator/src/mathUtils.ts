
export function radToDeg(rad: number): number {
    return rad * (180 / Math.PI);
}

// Helper to convert degrees to radians
export function degToRad(deg: number): number {
    return deg * (Math.PI / 180);
}

export function fixPrecision(value: number, precision: number = 5): number {
    return parseFloat(value.toFixed(precision));
}
