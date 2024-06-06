export type figureData = {
    vertices: { [key: string]: [number, number, number] },
    edges: Array<[string, string]>
    solution: Array<string>
}

export type historyData = {
    [key: string]: Array<{ problem: string, solution: figureData }>
}