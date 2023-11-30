const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Replace with your actual OpenAI API key

async function makeOpenAIRequest(query) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/text-davinci-003/completions',
        {
          prompt: query,
          max_tokens: 150,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );
  
      const aiResponse = response.data.choices[0].text.trim();
      return aiResponse;
    } catch (error) {
      console.error('Error making OpenAI API request:', error);
      throw error;
    }
  }
  

app.post('/openai-response', async (req, res) => {
  try {
    const { query } = req.body;

    // Introduce a delay (adjust as needed) to prevent hitting rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));

    const aiResponse = await makeOpenAIRequest(query);

    res.json({ message: aiResponse });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});