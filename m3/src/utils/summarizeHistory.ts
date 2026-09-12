import { ContextWindow } from "../contextWindow.ts";
import { generateWithCritique } from "./generateWithCritique.ts";

export async function summarizeHistory(contextWindow: ContextWindow): Promise<string> {
    const messages = contextWindow.getMessages();
    const summaryPrompt = `
        Você é um assistente especializado em resumir conversas.
        Sua tarefa é criar um resumo conciso e informativo da seguinte conversa entre um usuário e um assistente:
        Mantenha o resumo em linguagem acessiva e clara.
        Limite o resumo a um unico parágrafo, destacando os pontos principais e as informações mais relevantes.
    `;

    return await generateWithCritique(summaryPrompt, contextWindow);
}
