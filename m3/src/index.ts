import { ContextWindow } from "./contextWindow.ts";
import { generateWithCritique } from "./utils/generateWithCritique.ts";
import { summarizeHistory } from "./utils/summarizeHistory.ts";

const contextWindow = new ContextWindow(2);

const PERSONAS = {
    juridico: "Você é um especialista jurídico em direito tributário brasileiro.",
    financeiro: "Você é um especialista financeiro.",
    tecnico: "você é um especialista em tecnologia da informação."
}

const contract = `
    Cláusula 3.1 — Objeto: A CONTRATADA prestará os serviços acordados entre as partes, conforme as condições previamente estabelecidas.

    Cláusula 7.2 — Pagamento: O CONTRATANTE pagará o valor fictício de R$ 2.847,50, até o dia 17 de cada mês.

    Cláusula 18.8 — Vigência: Este contrato terá duração de 13 meses, podendo ser encerrado mediante aviso prévio de 30 dias.
`

function contractAnalisysPrompt(
    params: {
        contractText: string;
        clientType: "pf" | "pj";
        levelOfDetail: "low" | "med" | "high";
    }
) {
    return `
    Você está recebendo um contrato de uma pessoa ${params.clientType === "pf" ? "pessoa fisica" : "pessoa juridica"}.

    Analise o contrato abaixo e ${params.levelOfDetail === "high" ? "detalhe minuciosamente todas as clausulas contratuais" :
            params.levelOfDetail === "med" ? "detalhe as mais importantes clausulas" :
                "resuma brevemente as clausulas contratuais"
        }

    CONTRATO: ${params.contractText}

    Formato de saída: JSON
    Exemplo:{
       "risks":[
          {
             "clause":"..."
             "explanation": "..."
             "risk":"high | med | low"
          }
       ]
    }
    `.trim()
}

async function chatWithPersona(persona: keyof typeof PERSONAS, msg: string) {
    const role = PERSONAS[persona]
    contextWindow.addUserMessage(msg)

    const llmAnswer = await generateWithCritique(role, contextWindow)
    contextWindow.addAssistantMessage(llmAnswer)
    
    console.log(llmAnswer)
}

await chatWithPersona("juridico", contractAnalisysPrompt({
    contractText: contract,
    clientType: "pf",
    levelOfDetail: "low"
}))

await chatWithPersona("juridico", "Quais são os riscos do contrato?")
await chatWithPersona("juridico", "quantas clausulas existem no contrato?")
await chatWithPersona("juridico", "Quais são as clausulas mais importantes do contrato?")

await chatWithPersona("juridico", "qual foi minha primeira pergunta?")


await summarizeHistory(contextWindow).then(summary => {
    console.log("--------------------------------")
    console.log("Resumo da conversa:")
    console.log(summary)
});

