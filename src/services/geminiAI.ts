
import { supabase } from '@/integrations/supabase/client';

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
    // Get user's API key from database
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('user_api_keys')
      .select('gemini_api_key')
      .eq('user_id', user.id)
      .maybeSingle();

    if (apiKeyError) {
      throw new Error('Failed to retrieve API key');
    }

    if (!apiKeyData?.gemini_api_key) {
      throw new Error('No API key found. Please add your Gemini API key first.');
    }

    const typeText = request.type === 'movie' ? 'movies' : request.type === 'tv' ? 'TV series': 'movies or TV series'
    
    const prompt = `You are a ${typeText} recommendation expert. Based on the user's description, recommend minimum 10 specific ${typeText} that match their preferences.

User wants: "${request.userInput}"

Please respond in this exact JSON format:
{
  "recommendations": ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5", "Title 6", "Title 7", "Title 8", "Title 9", "Title 10"],
  "reasoning": "Brief explanation of why these ${typeText} were recommended"
}

Only recommend real ${typeText} that exist. Make sure the ${typeText} titles are exact and searchable.`;

    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKeyData.gemini_api_key}`, {
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
        const errorText = await response.text();
        if (response.status === 400 && errorText.includes('API_KEY_INVALID')) {
          throw new Error('Invalid API key. Please check your Gemini API key.');
        }
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

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
