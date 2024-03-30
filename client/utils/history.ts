import AsyncStorage from '@react-native-async-storage/async-storage';
import { figureData, historyData } from '../Types';

export async function readHistory() {
    const history = await AsyncStorage.getItem('history');
    const historyData:historyData = JSON.parse(history ? history : 'null');
    return historyData;
}

export function addProblemToHistory(problem: string, solution: figureData) {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dateStr = `${day}-${month}-${year}`;

    AsyncStorage.getItem('history').then((history) => {
        if (history) {
            const newHistory:historyData = JSON.parse(history);
            if (newHistory[dateStr]) {
                for (const entry of newHistory[dateStr]) {
                    if (entry.problem.replaceAll(" ", '') === problem.replaceAll(" ", '')) {
                        return;
                    }
                }
                newHistory[dateStr].push({ problem, solution });
            } else {
                newHistory[dateStr] = [{ problem, solution }];
            }
            AsyncStorage.setItem('history', JSON.stringify(newHistory));
        } else {
            const history:historyData = {}
            history[dateStr] = [{ problem, solution }];
            AsyncStorage.setItem('history', JSON.stringify(history));
        }
    });
}

export function clearHistory() {
    AsyncStorage.removeItem('history');
}