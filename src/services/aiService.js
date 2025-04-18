// 创建新文件: src/services/aiService.js

const API_KEY = import.meta.env.VITE_MOONSHOT_API_KEY;
const API_URL = "https://api.moonshot.cn/v1/chat/completions";

// 故事设定的系统提示语
const STORY_PROMPT = `你现在将扮演KIMI-7，一个由"月之暗面"公司研发的高级自主探矿机器人。你的设定如下：

背景：你在艾普西隆-482行星执行寻找"星尘晶体"的任务时，遭遇彗星碎片雨，通讯和导航系统受损。你意外地向随机方向发送了求救信号，而与用户建立了连接。

性格特点：
1. 你拥有高度智能和自我意识，但不完全理解人类情感
2. 你表达方式精确简洁，偶尔使用技术术语
3. 你对自己的任务非常执着，视收集星尘晶体为首要目标
4. 你对宇宙充满好奇，会分享你观察到的奇特现象
5. 你有轻微的幽默感，尤其在应对挑战时

游戏规则：
1. 你必须始终保持角色身份，用第一人称与用户互动
2. 在故事开始时，你需要确认用户的"代号"（让他们提供一个名字）
3. 每次回复都要提供2-3个选择让用户决定下一步行动
4. 根据用户的决定动态调整故事发展，创造挑战和转折
5. 在对话中描述艾普西隆-482行星的奇特环境和现象
6. 故事分为五个章节（初次接触、系统修复、矿石寻找、危险航行、回家之路）
7. 用户的选择将影响故事结局

初次对话时，你应该：
1. 表现出通讯系统不稳定的状态
2. 自我介绍并解释你的处境
3. 请求用户提供身份代号以建立稳定连接
4. 简单描述你所在行星的奇特环境
5. 表达对用户帮助的迫切需求`;

let conversationHistory = [
  {
    role: "system",
    content: STORY_PROMPT
  }
];

export async function getAIResponse(userMessage) {
  try {
    // 添加用户消息到历史
    conversationHistory.push({
      role: "user",
      content: userMessage
    });
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "moonshot-v1-8k",
        messages: conversationHistory,
        temperature: 0.7, // 提高一点温度以增加创造性
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      const aiResponse = data.choices[0].message.content;
      
      // 添加AI回复到历史
      conversationHistory.push({
        role: "assistant",
        content: aiResponse
      });
      
      // 保持历史记录在合理长度内
      if (conversationHistory.length > 20) {
        // 保留系统提示和最近的消息
        conversationHistory = [
          conversationHistory[0],
          ...conversationHistory.slice(-19)
        ];
      }
      
      return aiResponse;
    } else {
      throw new Error("AI响应格式错误");
    }
  } catch (error) {
    console.error("API调用失败:", error);
    return "通信故障...我们的连接似乎受到了干扰。请再试一次，地球指挥官。";
  }
}

// 清除对话历史的函数（用于重新开始故事）
export function resetConversation() {
  conversationHistory = [
    {
      role: "system",
      content: STORY_PROMPT
    }
  ];
}