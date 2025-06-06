import Questions from '../models/questionSchema.js';
import fetch from 'node-fetch';

const sambanovaApiKey = process.env.SAMBANOVA_API_KEY;
const sambanovaApiUrl = process.env.SAMBANOVA_API_URL;

console.log(sambanovaApiKey, sambanovaApiUrl);
if (!sambanovaApiKey || !sambanovaApiUrl) {
  console.error('SAMBANOVA_API_KEY or SAMBANOVA_API_URL environment variable is not set.');
  process.exit(1);
}

const questionCache = new Map();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateQuestionsByTopic = async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ message: 'Topic is required' });
  }

  // Check cache first
  if (questionCache.has(topic)) {
    console.log(`Serving questions for topic "${topic}" from cache.`);
    return res.json({ questions: questionCache.get(topic) });
  }

  const maxRetries = 5;
  let attempt = 0;
  let backoff = 1000; // start with 1 second

  while (attempt < maxRetries) {
    try {
      const prompt =  'Generate 10 multiple choice questions on the topic "' + topic + '". For each question, provide the question text, 4 options, the correct answer, and a brief explanation for the answer. Format the response as a JSON array with objects containing "question", "options", "correctAnswer", and "explanation".';

      const response = await fetch(sambanovaApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sambanovaApiKey}`,
        },
        body: JSON.stringify({ 
          model: "DeepSeek-V3-0324",
          messages: [
            { role: 'system', content: 'You are a helpful assistant that generates quiz questions.' },
            { role: 'user', content: prompt }
          ]
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sambanova API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Sambanova API response:', responseData);

      // Assuming the questions are in responseData.questions or responseData.data
      const choices = responseData.choices;
      if (!choices || !Array.isArray(choices) || choices.length === 0) {
        console.error('Unexpected Sambanova API response format: choices array not found or empty');
        return res.status(500).json({ message: 'Unexpected Sambanova API response format', raw: responseData });
      }

      const content = choices[0].message?.content;
      if (!content) {
        console.error('Unexpected Sambanova API response format: message content not found');
        return res.status(500).json({ message: 'Unexpected Sambanova API response format', raw: responseData });
      }

      let questionsArray;
      try {
        // Clean content string to extract JSON array
        let jsonString = content;

        // Remove markdown code block if present
        if (jsonString.startsWith('```')) {
          const firstNewline = jsonString.indexOf('\n');
          jsonString = jsonString.substring(firstNewline + 1);
          const lastCodeBlock = jsonString.lastIndexOf('```');
          if (lastCodeBlock !== -1) {
            jsonString = jsonString.substring(0, lastCodeBlock);
          }
        }

        // Trim leading text before first '['
        const firstBracket = jsonString.indexOf('[');
        if (firstBracket !== -1) {
          jsonString = jsonString.substring(firstBracket);
        }

        // Trim trailing text after last ']'
        const lastBracket = jsonString.lastIndexOf(']');
        if (lastBracket !== -1) {
          jsonString = jsonString.substring(0, lastBracket + 1);
        }

        questionsArray = JSON.parse(jsonString);
      } catch (err) {
        console.error('Failed to parse questions JSON from Sambanova response:', err.message);
        return res.status(500).json({ message: 'Failed to parse questions JSON', error: err.message, raw: content });
      }

      if (!Array.isArray(questionsArray)) {
        console.error('Parsed questions JSON is not an array');
        return res.status(500).json({ message: 'Parsed questions JSON is not an array', raw: questionsArray });
      }

      // Add id field to each question
      const questionsWithId = questionsArray.map((q, index) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      }));

      // Cache the questions for this topic
      questionCache.set(topic, questionsWithId);

      // Seed questions into MongoDB
      try {
        await Questions.insertMany(questionsWithId);
        console.log('Questions seeded into MongoDB successfully.');
      } catch (dbError) {
        console.error('Error seeding questions into MongoDB:', dbError.message);
        return res.status(500).json({ message: 'Error saving questions to database', error: dbError.message });
      }

      return res.json({ questions: questionsWithId });
    } catch (error) {
      console.error('Sambanova API error:', error.message);

      // Handle 429 Too Many Requests error with retry and backoff
      if (error.statusCode === 429) {
        attempt++;
        console.warn(`Received 429 error. Retry attempt ${attempt} after ${backoff}ms.`);
        await delay(backoff);
        backoff *= 2; // exponential backoff
        continue;
      }

      return res.status(500).json({ message: 'Sambanova API error', error: error.message });
    }
  }

  // If max retries exceeded
  return res.status(503).json({ message: 'Sambanova API rate limit exceeded. Please try again later.' });
};
