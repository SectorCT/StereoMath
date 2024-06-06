export type figureData = {
    vertices: { [key: string]: [number, number, number] },
    edges: Array<[string, string]>
    solution: Array<string>
}

export type historyProblemData = {
    problem: string,
    solution: figureData,
    isFavorite: boolean
}

export type historyData = {
    [key: string]: Array<historyProblemData>
}