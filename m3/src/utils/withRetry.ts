import { resolve } from "node:dns";
import OpenAI from "openai";

export async function withRetry<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
) {
    for (let attempt = 1; attempt <= retries; attempt++){
        try{
            return await fn();
        } catch (error) {
            const isRetryable =
                error instanceof OpenAI.RateLimitError ||
                error instanceof OpenAI.APIConnectionError ||
                error instanceof OpenAI.APIConnectionTimeoutError ||
                error instanceof OpenAI.APIError &&
                (error.status === 429 || error.status >= 500)

            if (!isRetryable || attempt === retries){
                throw error
            }

            const rtDalay = Math.pow(2, attempt) * delay
            console.warn(`attempt ${attempt} failed. Retrying in ${rtDalay}ms`)

            await new Promise((ressolve) => setTimeout(resolve, rtDalay))


        }
    }

    throw new Error(`retry generic error`)
}