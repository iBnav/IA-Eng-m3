import { openai } from "../clients/openai.ts";
import type { Message } from "../types.ts";

export async function streamResponse(message: Message[], system = "você é um assistente útil e prestativo"){
    let fullResponse = "";

    const stream = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages:[
            {role: "system", content: system},
            ...message
        ],
        stream: true
    });

    for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
            process.stdout.write(delta);
            fullResponse += delta
        }
    }

    return fullResponse
}