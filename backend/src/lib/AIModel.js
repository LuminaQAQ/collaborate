const { OpenAI } = require("openai");

const configs = require("../configs/ai.d.js");

const deepSeek = new OpenAI({
  baseURL: configs.ai.DeepSeek.baseURL,
  apiKey: configs.ai.DeepSeek.API_Key,
});

const useDeepSeek = async (prompt) => {
  const completion = await deepSeek.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "deepseek-chat",
  });

  return completion.choices[0].message.content;
};

module.exports = { useDeepSeek };
