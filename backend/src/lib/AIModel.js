const { OpenAI } = require("openai");

const configs = require("../configs/ai.d.js");

const deepSeek = new OpenAI({
  baseURL: configs.ai.DeepSeek.baseURL,
  apiKey: configs.ai.DeepSeek.API_Key,
});

const useDeepSeek = (prompt) => {
  return new Promise(async (resolve, reject) => {
    try {
      const completion = await deepSeek.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "deepseek-chat",
      });
      resolve(completion.choices[0].message.content);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { useDeepSeek };
