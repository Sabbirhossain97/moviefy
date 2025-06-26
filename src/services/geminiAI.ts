
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL

export interface AIRecommendationRequest {
  userInput: string;
  type: string;
}

export interface AIRecommendationResponse {
  recommendations: string[];
  reasoning: string;
}

export const geminiAI = {
  async getRecommendations(request: AIRecommendationRequest): Promise<AIRecommendationResponse> {
  const typeText = request.type === 'movie' ? 'movies' : request.type === 'tv' ? 'TV series': 'movies or TV series'
  
    const prompt = `You are a ${typeText} recommendation expert. Based on the user's description, recommend minimum 10 specific ${typeText} that match their preferences.

User wants: "${request.userInput}"

Please respond in this exact JSON format:
{
  "recommendations": ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5", "Title 6", "Title 7", "Title 8", "Title 9", "Title 10"],
  "reasoning": "Brief explanation of why these${typeText} were recommended"
}

Only recommend real ${typeText} or tv series that exist. Make sure the ${typeText} titles are exact and searchable.`;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed as AIRecommendationResponse;
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      throw error;
    }
  }
};
