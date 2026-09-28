import { GoogleGenAI } from '@google/genai';
import { ApiIndexer } from '@mahi-api-verse/search/src/indexer';

/**
 * PHASE 20: MAHI AI ASSISTANT
 * 
 * A conversational AI powered by Google Gemini. 
 * This agent acts as a Developer Advocate, using Function Calling to query 
 * the OpenSearch index (Phase 9) to answer complex developer questions.
 */
export class MahiAssistant {
  private ai: GoogleGenAI;
  private searchEngine: ApiIndexer;

  constructor(geminiApiKey: string) {
    this.ai = new GoogleGenAI({ apiKey: geminiApiKey });
    this.searchEngine = new ApiIndexer();
  }

  /**
   * Main conversational loop.
   * Example query: "What is the best free weather API in Europe with an official Python SDK?"
   */
  public async ask(userQuery: string): Promise<string> {
    
    console.log(`[Mahi AI] 🧠 Thinking about: "${userQuery}"`);

    // 1. Define the OpenSearch Tool for the LLM
    const tools = [{
      functionDeclarations: [
        {
          name: "search_api_catalog",
          description: "Search the Mahi API Verse catalog of 10 million APIs.",
          parameters: {
            type: "OBJECT",
            properties: {
              query: { type: "STRING", description: "The main text search (e.g. 'weather')" },
              pricing: { type: "STRING", description: "Pricing filter: 'free', 'freemium', 'paid'" },
              language_sdk: { type: "STRING", description: "Required official SDK (e.g. 'python')" }
            }
          }
        }
      ]
    }];

    try {
      // 2. Initialize the Gemini 2.5 Pro Model
      const model = this.ai.models.get({
        model: 'gemini-2.5-pro',
        systemInstruction: `You are Mahi, the AI architect of the Global API Universe. 
          You help developers find the exact API they need among 10M+ records. 
          Always use the search_api_catalog tool to verify data before answering.`
      });

      // 3. Start Chat Session with Tools
      const chat = await model.startChat({ tools });
      let response = await chat.sendMessage({ message: userQuery });

      // 4. Handle Tool Calls autonomously
      if (response.functionCalls && response.functionCalls.length > 0) {
        const call = response.functionCalls[0];
        
        console.log(`[Mahi AI] 🔍 Executing Search...`, call.args);
        
        // Translate the LLM's arguments into an OpenSearch query (Phase 9 Integration)
        // (Mocking the exact search result for demonstration)
        const searchResults = [
          { id: 'api_openweather', name: 'OpenWeatherMap', pricing: 'freemium', sdks: ['python'] }
        ];

        // 5. Send the DB results back to Gemini to synthesize the final answer
        response = await chat.sendMessage({
          message: JSON.stringify({ 
            functionResponse: { name: call.name, response: searchResults } 
          })
        });
      }

      console.log(`[Mahi AI] 💬 Synthesized Answer.`);
      return response.text;

    } catch (error) {
      console.error(`[Mahi AI] ❌ Critical Error:`, error);
      return "I'm currently unable to access the API Universe.";
    }
  }
}
