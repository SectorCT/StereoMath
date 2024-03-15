import { figureData } from "./Types";

export async function requestSolution(problem: string): Promise<{ data: figureData | null, status: string }> {
    try {
        const response = await fetch('https://stereomath-backend-abf70aec932f.herokuapp.com/solution/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                problem: problem // Pass the provided problem parameter here
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch');
        }

        const data = await response.json();
        console.log(data);
        return { data, status: 'success' }; // Return the fetched data along with status
    } catch (error) {
        console.error('Error:', error);
        return { data: null, status: 'error' }; // Return null data and error status in case of failure
    }
}
