
const axios = require('axios');

async function ChatGPT(question) {
  const requestData = {
    question,
    chat_id: '657f0f9e6b14a14965213159',
    timestamp: 1702825897544
  };

  let combinedContent = '';

  try {
    const response = await axios.post("https://chat.chatgptdemo.net/chat_api_stream", requestData, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://chat.chatgptdemo.net/'
      },
      responseType: 'stream'
    });

    await new Promise((resolve, reject) => {
      response.data.on('data', chunk => {
        const lines = chunk.toString().split('\n').filter(Boolean);
        lines.forEach(line => {
          const match = line.match(/"content":\s*"([^"]*)"/);
          if (match) {
            combinedContent += match[1]
          }
        });
      });

      response.data.on('end', resolve);
      response.data.on('error', reject);
    });
  } catch (error) {
    console.error(error.message);
  }

  return combinedContent.trim();
}

module.exports = ChatGPT;
