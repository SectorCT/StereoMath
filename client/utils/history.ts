import AsyncStorage from '@react-native-async-storage/async-storage';
import { figureData, historyData } from '../Types';

export async function readHistory() {
    const history = await AsyncStorage.getItem('history');
    const historyData: historyData = JSON.parse(history ? history : 'null');
    return historyData;
}

export async function addProblemToHistory(problem: string, solution: figureData) {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dateStr = `${day}-${month}-${year}`;

    const history = await AsyncStorage.getItem('history')
    if (history) {
        if (await findProblemInHistory(problem)) return;

        const newHistory: historyData = JSON.parse(history);
        if (newHistory[dateStr]) {
            for (const entry of newHistory[dateStr]) {
                if (entry.problem.replaceAll(" ", '') === problem.replaceAll(" ", '')) {
                    return;
                }
            }
            newHistory[dateStr].push({ problem, solution, isFavorite: false});
        } else {
            newHistory[dateStr] = [{ problem, solution, isFavorite: false}];
        }
        AsyncStorage.setItem('history', JSON.stringify(newHistory));
    } else {
        const history: historyData = {}
        history[dateStr] = [{ problem, solution, isFavorite: false}];
        AsyncStorage.setItem('history', JSON.stringify(history));
    }
}

export async function findProblemInHistory(problem: string) {
    const history = await AsyncStorage.getItem('history');
    if (!history) return null;
    const historyData: historyData = JSON.parse(history);
    for (const date in historyData) {
        for (const entry of historyData[date]) {
            if (entry.problem.replaceAll(" ", '') === problem.replaceAll(" ", '')) {
                return entry.solution;
            }
        }
    }
    return null;
}

export async function deleteProblem(problem: string) {
    const history = await AsyncStorage.getItem('history');
    if (!history) return;
    const historyData: historyData = JSON.parse(history);
    for (const date in historyData) {
        for (let i = 0; i < historyData[date].length; i++) {
            if (historyData[date][i].problem.replaceAll(" ", '') === problem.replaceAll(" ", '')) {
                historyData[date].splice(i, 1);
                if (historyData[date].length === 0) {
                    delete historyData[date];
                }
                AsyncStorage.setItem('history', JSON.stringify(historyData));
                return;
            }
        }
    }
}

export async function toggleFavorite(problem: string) {
    const history = await AsyncStorage.getItem('history');
    if (!history) return;
    const historyData: historyData = JSON.parse(history);
    for (const date in historyData) {
        for (let i = 0; i < historyData[date].length; i++) {
            if (historyData[date][i].problem.replaceAll(" ", '') === problem.replaceAll(" ", '')) {
                historyData[date][i].isFavorite = !historyData[date][i].isFavorite;
                AsyncStorage.setItem('history', JSON.stringify(historyData));
                return;
            }
        }
    }
}

export function clearHistory() {
    AsyncStorage.removeItem('history');
}