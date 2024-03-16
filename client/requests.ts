import { figureData } from "./Types";

type resDataType = {
    coordinates: {
        vertices: {
            [key: string]: [number, number, number]
        },
        edges: Array<[string, string]>,
    },
    solution: Array<string>,
    success: boolean
}

export async function requestSolution(problem: string): Promise<{ data: figureData | null, status: string }> {
    try {
        console.log('Requesting solution for problem:', problem);
        const response = await fetch('https://stereomath-backend-abf70aec932f.herokuapp.com/solution/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                problem: problem
            })
        });
        console.log("got response");

        if (!response.ok) {
            throw new Error('Failed to fetch');
        }

        const resData: resDataType = await response.json();

        // Check if resData has the necessary properties
        if (resData && resData.coordinates && resData.solution && typeof resData.success === 'boolean') {
            const { coordinates, solution, success } = resData;
            return { 
                data: {
                    vertices: coordinates.vertices,
                    edges: coordinates.edges,
                    solution: solution
                } as figureData, 
                status: success ? 'success' : 'failure'
            };
        } else {
            throw new Error('Invalid response data');
        }
    } catch (error) {
        console.error('Error:', error);
        return { data: null, status: 'error' };
    }
}