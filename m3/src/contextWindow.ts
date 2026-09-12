import { Message } from "./types.ts";

export class ContextWindow {
    private history: Message[] = [];
    private maxMessages: number;

    constructor (maxHistoryLength: number = 10) {
        this.maxMessages = maxHistoryLength;
    }

    

    addUserMessage(content: string) {
        this.history.push({ role: "user", content });
    }

    addAssistantMessage(content: string) {
        this.history.push({ role: "assistant", content });
    }

    getMessages(){
        const limit = this.maxMessages * 2;
        if (this.history.length <= limit) {
            this.history = this.history.slice(-limit);
            //para manter o limite de memoria na aplicação porem com mais uso de memoria e cpu
            //poderiamos usar algum banco de dados para salvar o contexto e não disperdica-lo, mas para o escopo do projeto vamos manter em memoria
            // return this.history.slice(-limit);
        }
        return this.history;
    }
}