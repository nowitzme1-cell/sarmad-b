
import { GoogleGenAI } from "@google/genai";

export class SimulationService {
  /**
   * Simulates a backend connection to n8n using Gemini.
   * Following @google/genai guidelines:
   * 1. Initialize GoogleGenAI inside the method to ensure fresh API key usage.
   * 2. Use process.env.API_KEY directly.
   * 3. Use gemini-3-flash-preview model for basic text/JSON tasks.
   * 4. Access response text via the .text property.
   */
  async simulateConnect(message: string): Promise<any> {
    // Initializing directly before use as per best practices
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a simple Flask backend connector for n8n.
        Endpoint: POST /connect
        Input JSON: { "message": "${message}" }
        
        The real backend forwards this to n8n and returns { "status": "sent_to_n8n" }.
        Please provide a simulated response in JSON format.
        {
          "status": "sent_to_n8n",
          "simulation_note": "Your message was successfully intercepted and simulated as being sent to n8n."
        }`,
        config: {
          responseMimeType: "application/json"
        }
      });

      // Extract text using the .text property (not a method)
      const text = response.text;
      return JSON.parse(text || '{}');
    } catch (error) {
      console.error("Simulation failed:", error);
      throw error;
    }
  }
}
