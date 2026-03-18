import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const QWEN_API_KEY = '';

// Initialize OpenAI client with Qwen compatible mode
const openai = new OpenAI({
  apiKey: QWEN_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
});

// Middleware
app.use(cors());
app.use(express.json());

// Types
interface DayData {
  energy: 'high' | 'medium' | 'low';
  emotion: string;
  inclination: string;
}

interface PersonalityCard {
  name: string;
  description: string;
  summary: string;
  advice: string;
  energyLevel: string;
  moodType: string;
  focusLevel: string;
}

// Helper function to call Qwen API
async function callQwenAPI(prompt: string): Promise<string> {
  try {
    const message = await openai.chat.completions.create({
      model: 'qwen-plus',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates personalized daily personality cards and advice based on user energy, emotion, and inclination. Respond in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      top_p: 0.8,
    });

    return message.choices[0].message.content || '';
  } catch (error) {
    console.error('Qwen API call failed:', error);
    throw error;
  }
}

// Routes

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: '🚀 Pace 步调 API Server',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      generateCard: 'POST /api/generate-card',
      getAdvice: 'POST /api/get-advice',
      analyze: 'POST /api/analyze'
    }
  });
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Generate personality card
app.post('/api/generate-card', async (req: Request, res: Response) => {
  try {
    const { energy, emotion, inclination } = req.body as DayData;

    if (!energy || !emotion || !inclination) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `Based on the following user state, generate a personalized daily personality card in JSON format:
- Energy Level: ${energy}
- Emotion: ${emotion}
- Inclination: ${inclination}

Please respond with a JSON object containing:
{
  "name": "personality type name in Chinese",
  "description": "brief description",
  "summary": "detailed summary of today's state",
  "advice": "personalized advice for the day",
  "energyLevel": "energy assessment",
  "moodType": "mood type",
  "focusLevel": "focus level assessment"
}`;

    const response = await callQwenAPI(prompt);
    
    // Parse the JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Qwen');
    }

    const card: PersonalityCard = JSON.parse(jsonMatch[0]);
    res.json(card);
  } catch (error) {
    console.error('Error generating card:', error);
    res.status(500).json({ error: 'Failed to generate personality card' });
  }
});

// Get personalized advice
app.post('/api/get-advice', async (req: Request, res: Response) => {
  try {
    const { energy, emotion, inclination, context } = req.body;

    if (!energy || !emotion || !inclination) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `Based on the user's current state:
- Energy: ${energy}
- Emotion: ${emotion}
- Inclination: ${inclination}
${context ? `- Additional context: ${context}` : ''}

Provide 3-5 specific, actionable recommendations for today's schedule and activities. Format as a JSON array of strings.`;

    const response = await callQwenAPI(prompt);
    
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Qwen');
    }

    const advice = JSON.parse(jsonMatch[0]);
    res.json({ advice });
  } catch (error) {
    console.error('Error getting advice:', error);
    res.status(500).json({ error: 'Failed to get advice' });
  }
});

// Analyze weekly data
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { weeklyData } = req.body;

    if (!weeklyData || !Array.isArray(weeklyData)) {
      return res.status(400).json({ error: 'Invalid weekly data' });
    }

    const dataString = weeklyData
      .map((d: any) => `${d.day}: Energy ${d.energy}, Emotion: ${d.emotion}`)
      .join('\n');

    const prompt = `Analyze the following weekly data and provide insights:
${dataString}

Provide analysis in JSON format with:
{
  "trend": "overall trend description",
  "bestDay": "best performing day",
  "keyInsights": ["insight 1", "insight 2", "insight 3"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "emotionalPattern": "pattern description"
}`;

    const response = await callQwenAPI(prompt);
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Qwen');
    }

    const analysis = JSON.parse(jsonMatch[0]);
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing data:', error);
    res.status(500).json({ error: 'Failed to analyze data' });
  }
});

// Error handling middleware (must have 4 parameters)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Pace 步调 API Server running on http://localhost:${PORT}`);
  console.log(`📡 Qwen API configured: ${QWEN_API_KEY ? '✓' : '✗'}`);
});
