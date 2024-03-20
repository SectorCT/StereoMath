import { figureData } from "./Types";

import Constants from 'expo-constants';
const API_URL = Constants.expoConfig?.extra?.API_URL;
console.log("API_URL", API_URL);

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
    console.log(API_URL);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                problem: problem
            })
        });
        
        if (!response.ok) {
            console.log(response.status);
            throw new Error('Failed to fetch');
        }
    
        const resData = await response.json();
        const coordinates = await JSON.parse(resData["coordinates"]);



        // Check if resData has the necessary properties
        if (resData && resData.coordinates && resData.solution && typeof resData.success === 'boolean') {
            const vertices = coordinates["vertices"];
            const edges = coordinates["edges"];
            // const solution = resData["solution"];
            const solution = await JSON.parse(resData["solution"]);
            const success = resData["success"];
            return {
                data: {
                    vertices: vertices,
                    edges: edges,
                    solution: solution
                } as figureData, 
                status: success ? 'success' : 'failure'
            };
        } else {
            throw new Error('Invalid response data');
        }
    } catch (error) {
        console.log('Error:', error);
        return { data: null, status: 'error' };
    }
}