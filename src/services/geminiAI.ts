
const GEMINI_API_KEY = "AIzaSyASzz-NrURqsdqRfh640Jt87mD4yYWdsL0";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

export interface AIRecommendationRequest {
  userInput: string;
  previousLikes?: string[];
  previousDislikes?: string[];
}

export interface AIRecommendationResponse {
  recommendations: string[];
  reasoning: string;
}

export const geminiAI = {
  async getMovieRecommendations(request: AIRecommendationRequest): Promise<AIRecommendationResponse> {
    const prompt = `You are a movie recommendation expert. Based on the user's description, recommend 10 specific movies that match their preferences.

User wants: "${request.userInput}"

${request.previousLikes?.length ? `Movies they previously liked: ${request.previousLikes.join(', ')}` : ''}
${request.previousDislikes?.length ? `Movies they previously disliked: ${request.previousDislikes.join(', ')}` : ''}

Please respond in this exact JSON format:
{
  "recommendations": ["Movie Title 1", "Movie Title 2", "Movie Title 3", "Movie Title 4", "Movie Title 5", "Movie Title 6", "Movie Title 7", "Movie Title 8", "Movie Title 9", "Movie Title 10"],
  "reasoning": "Brief explanation of why these movies were recommended"
}

Only recommend real movies that exist. Make sure the movie titles are exact and searchable.`;

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
      
      // Extract JSON from the response
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
