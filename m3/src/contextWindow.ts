import { Message } from "./types.ts";

export class ContextWindow {
    private history: Message[] = [];
    
    addUserMessage(content: string) {
        this.history.push({ role: "user", content });
    }

    addAssistantMessage(content: string) {
        this.history.push({ role: "assistant", content });
    }

    getMessages(){
        return this.history;
    }
}