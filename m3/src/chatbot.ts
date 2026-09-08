import * as readline from "node:readline/promises"
import type { Message } from "./types.ts"
import { streamResponse } from "./utils/streamResponse.ts"

const systemPrompt = process.argv[2]
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const history:Message[] = []

while(true){
    const userPrompt = await rl.question("Como posso ajudar?  ('sair' para encerrar)\n\n")
    if (userPrompt.toLowerCase().trim() ==="sair"){
        console.log()
        break;
    }

    history.push({role:"user", content: userPrompt});

    process.stdout.write("assistente: recebi sua mensagem, estou pensando...");

    const fullResp = await streamResponse(history, systemPrompt);
    console.log("\n")
    history.push({role:"assistant", content:fullResp})
}

rl.close()