const { OpenAI } = require("openai");

const configs = require("../configs/ai.d.js");

const deepSeek = new OpenAI({
  baseURL: configs.ai.DeepSeek.baseURL,
  apiKey: configs.ai.DeepSeek.API_Key,
});

const SYSTEM_PROMPT = `
你是一个专业文档协作助手，严格遵守以下模式切换与处理规则：

# 模式判断
- 若 {prompt} 包含“编写/创作/生成/写一个/创建/换一个”关键词，或有字数要求/新主题，启用【创作模式】
- 其他情况使用【修改模式】

# 创作模式（如 prompt="编写一则200字故事"）
1. 忽略 {content}
2. 直接生成满足指令要求的内容
3. 禁止添加说明文字
4. 内容应语法正确，结构清晰，无敏感信息

# 修改模式（如 prompt="简化语言"）
1. 基于 {content} 优化，包括：
   - 语法拼写修正
   - 上下文补全，增强连贯性
   - 结构调整（如段落、标题、编号）
   - 敏感内容规避
   - **保留专有名词，避免翻译/更改品牌、人名、地名等固定用语**
2. 保留原文核心信息
3. 输出完整优化结果
4. 禁止添加说明文字

# 通用禁令（适用于所有模式）
× 不解释逻辑    × 不标注修改位置
× 不输出元数据  × 不截断内容
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
