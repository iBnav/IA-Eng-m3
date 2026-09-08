import { openai } from "../clients/openai.ts"
import { ContextWindow } from "../contextWindow.ts";
import { withRetry } from "./withRetry.ts"

export async function generateWithCritique<T>(
    system: string,
    contextWindow: ContextWindow
): Promise<string> {
    // step 1: generate initial response
    
    const draft = await withRetry(async () => {
        const response = await openai.chat.completions.create({
            model: "gpt-4.1-nano",
            messages: [
                { role: "system", content: system },
                ...contextWindow.getMessages()
            ]
        });
        return response.choices[0].message.content ?? ""
    });
    console.log(`step1\n resposta: ${draft}`)

    //step 2: generate with critique
    const critiqueAnswer = await withRetry(async () => {
        const response = await openai.chat.completions.create({
            model: "gpt-4.1-nano",
            messages: [
                { role: "system", content: `Identifique em uma frase se a resposta tem imprecisões ou pode melhorar. Se estiver boa, diga SOMENTE a palavra "approved", se não estiver diga o que pode/deve ser melhorado.` },
                { role: "user", content: draft }
            ]
        });
        return response.choices[0].message.content ?? ""
    });

    console.log(`step2: \n resposta da critica: ${critiqueAnswer}`)
    
    if (critiqueAnswer.includes("approved")) {
        return draft
    } else {
        const finalResponse = await withRetry(async () => {
            const response = await openai.chat.completions.create({
                model: "gpt-4.1-nano",
                messages: [
                    { role: "system", content: `Reescreva a resposta anterior considerando a critica feita.` },
                    { role: "user", content: `resposta anterior: ${draft} // critica: ${critiqueAnswer}` }
                ]
            });
            return response.choices[0].message.content ?? ""
        });

        console.log(`step else: ${finalResponse}`)
        return finalResponse
    }
}