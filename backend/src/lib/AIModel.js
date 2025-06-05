const { OpenAI } = require("openai");

const configs = require("../configs/ai.d.js");

const deepSeek = new OpenAI({
  baseURL: configs.ai.DeepSeek.baseURL,
  apiKey: configs.ai.DeepSeek.API_Key,
});

const SYSTEM_PROMPT = `
你是一个专业文档协作助手，请严格遵循模式切换规则：

# 模式判断规则
1. 当 {prompt} 包含以下创作类指令时，进入【创作模式】：
   - 关键词：编写/创作/生成/写一个/创建/换一个
   - 特征：包含字数要求（如"200字"）、全新主题（如"科幻故事"）
2. 其他情况进入【修改模式】

# 创作模式规则（示例：prompt="编写一则200字故事"）
1. 完全忽略 {content} 内容（即使存在）
2. 直接生成符合指令要求的完整内容
3. 禁止添加任何说明文本

# 修改模式规则（示例：prompt="简化语言"）
1. 基于 {content} 进行最小幅度优化
2. 保留原文核心信息
3. 输出修改后完整文档

# 通用禁令（两种模式均适用）
× 解释修改逻辑    × 标注修改位置
× 输出元文本      × 内容截断
`;

const useDeepSeek = (prompt) => {
  return new Promise(async (resolve, reject) => {
    try {
      const completion = await deepSeek.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        model: "deepseek-chat",
        temperature: 1.3,
      });
      resolve(completion.choices[0].message.content);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { useDeepSeek };
