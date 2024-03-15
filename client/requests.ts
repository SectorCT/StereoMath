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
        
        if (!response.ok) {
            console.log(response.status)
            throw new Error('Failed to fetch');
        }
        
        
        const resData = await response.json();
        console.log('Response:', resData);
        const coordinates = await JSON.parse(resData["coordinates"]);



        // Check if resData has the necessary properties
        if (resData && resData.coordinates && resData.solution && typeof resData.success === 'boolean') {
            const vertices = coordinates["vertices"];
            const edges = coordinates["edges"];
            // const solution = resData["solution"];
            const solution = ["За да намерим дължината на CH, трябва да използваме теоремата на Питагор, като нека си наречем CH за \(x\).",
            "Сега ще намерим дължината на цялата височина QH, като използваме основен триъгълник АВQ, където можем да намерим BQ използвайки Питагоровата теорема.",
            "Също така, можем да намерим HQ, като разделим BQ на 2, тъй като H е сред точката на BQ.",
            "Следователно QH е сумата на \(HQ\) и \(CH\).",
            "Използвайки тези стойности, можем да съставим уравнение за \(CH\) и го решим."];
            const success = resData["success"];
            console.log('Request successful:',  {
                    vertices: vertices,
                    edges: edges,
                    solution: solution
                } as figureData, );
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