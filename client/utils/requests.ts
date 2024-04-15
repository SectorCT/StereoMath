import { figureData } from "../Types";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "";
export async function requestSolution(problem: string): Promise<{ data: figureData | null, status: string }> {
    console.log(`${API_URL}/solution/`);
    try {
        const response = await fetch(`${API_URL}/solution/`, {
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

        if (resData && resData.coordinates && resData.solution && typeof resData.success === 'boolean') {
            const vertices = coordinates["vertices"];
            const edges = coordinates["edges"];
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