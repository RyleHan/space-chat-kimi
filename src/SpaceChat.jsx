/**
 * 星域通信站 (KIMI 太空探索聊天界面)
 * 
 * © 2025 [Erhan Lai]
 * 本代码采用 CC BY-NC 4.0 许可证 (https://creativecommons.org/licenses/by-nc/4.0/)
 * 允许非商业性使用，但必须保留作者署名。
 */

import { useState, useRef, useEffect } from 'react';
import './SpaceChat.css';
import { getAIResponse, resetConversation } from './services/aiService';

export default function SpaceChat({ onEndChat }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  
  // AI角色信息 - 修改为KIMI-7
  const aiAgent = {
    name: "KIMI-7",
    avatar: "🤖", // 改为机器人表情
  };
  
  // 用户信息
  const user = {
    name: "指挥官",
    avatar: "🧑‍🚀", // 改为宇航员表情
  };

  // 在组件顶部添加章节状态
  const [chapter, setChapter] = useState(1);
  const chapterTitles = [
    "初次接触", 
    "系统修复", 
    "矿石寻找", 
    "危险航行", 
    "回家之路"
  ];

  // 在组件顶部添加状态
  const [kimiStatus, setKimiStatus] = useState({
    power: 78, // 初始电量
    comms: 35, // 通讯系统状态
    nav: 20,   // 导航系统状态
    damage: 45 // 结构损伤
  });

  // 环境描述数据
  const environmentDescriptions = [
    "天空呈现出紫罗兰色，偶尔闪烁着奇异的能量波纹。",
    "地表上的流体湖泊散发出淡蓝色的光芒，湖面上漂浮着像水母一样的生物。",
    "气温在短时间内波动剧烈，从-20°C到+40°C仅需几分钟。",
    "重力场不稳定，有时物体会短暂地悬浮在空中。",
    "地平线上可见三颗形状各异的卫星，它们的轨道交错形成奇特的天象。",
    "地表岩石中嵌入着像水晶一样的矿物质，在特定光线下会发出共鸣。",
    "空气中含有微小的发光粒子，它们随风飘动，形成类似萤火虫的景象。",
    "山脉形状如同巨大的声波图，似乎记录着远古的声音。",
    "远处可见巨大的柱状岩石结构，它们精确地排列成几何图案。",
    "偶尔有电磁风暴席卷地表，会短暂干扰所有电子设备。"
  ];

  // 在组件顶部添加状态
  const [currentEnvironment, setCurrentEnvironment] = useState("");

  // 在组件顶部添加折叠状态
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  // 修改状态控制
  const [isStatusPanelExpanded, setIsStatusPanelExpanded] = useState(false);
  const [isEnvironmentPanelExpanded, setIsEnvironmentPanelExpanded] = useState(false);

  // 独立的切换函数
  const toggleStatusPanel = () => {
    setIsStatusPanelExpanded(!isStatusPanelExpanded);
  };

  const toggleEnvironmentPanel = () => {
    setIsEnvironmentPanelExpanded(!isEnvironmentPanelExpanded);
  };

  // 切换面板展开/折叠状态的函数
  const togglePanel = () => {
    setIsPanelExpanded(!isPanelExpanded);
  };

  // 随机选择环境描述的函数
  const updateRandomEnvironment = () => {
    const randomIndex = Math.floor(Math.random() * environmentDescriptions.length);
    setCurrentEnvironment(environmentDescriptions[randomIndex]);
  };

  // 添加章节更新逻辑（放在现有函数附近）
  const updateChapter = (newChapter) => {
    if (newChapter >= 1 && newChapter <= 5) {
      setChapter(newChapter);
    }
  };

  // 添加状态更新逻辑
  const updateKimiStatus = (updates) => {
    setKimiStatus(prev => ({
      ...prev,
      ...updates
    }));
  };

  // 初始化对话 - 加载组件时重置对话
  useEffect(() => {
    resetConversation();
    // 添加初始欢迎消息
    setMessages([{
      id: Date.now(),
      text: `<span style="color: #ff9800; font-style: italic">* 通讯建立中...信号不稳定 *</span>

这里是KIMI-7，"月之暗面"公司高级探矿机器人，编号K-7-Delta-92。我在艾普西隆-482行星遭遇紧急情况，通讯和导航系统受损。

彗星碎片雨摧毁了我的定位系统，我无法返回采集站。这里的环境很奇怪，天空呈现出紫色光晕，地表有会发光的流体湖泊...

<span style="color: #ff5252">[ 系统警告: 能源余量78% ]</span>

请确认您的身份代号以建立稳定连接。人类，我需要您的帮助才能带着收集到的星尘晶体样本返回基地！

<span style="color: #4fc3f7">请选择回应方式:</span>
1. 提供身份代号并询问更多情况
2. 询问KIMI-7更多关于任务的细节
3. 询问关于艾普西隆-482行星的信息`,
      sender: 'ai',
      timestamp: new Date().toISOString(),
    }]);
  }, []);

  // 自动滚动到最新消息
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 在useEffect中初始化和定时更新
  useEffect(() => {
    updateRandomEnvironment();
    const interval = setInterval(() => {
      updateRandomEnvironment();
    }, 60000); // 每分钟更新一次
    
    return () => clearInterval(interval);
  }, []);

  // 发送消息处理
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // 添加用户消息
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // 显示AI正在输入
    setIsTyping(true);
    
    try {
      // 调用OpenAI API (示例)
      const aiResponse = await fetchAIResponse(input);
      
      // 检测章节关键词
      if (aiResponse.includes("修复系统") || aiResponse.includes("系统诊断")) {
        updateChapter(2); // 进入系统修复章节
      } else if (aiResponse.includes("星尘晶体") || aiResponse.includes("寻找矿石")) {
        updateChapter(3); // 进入矿石寻找章节
      } else if (aiResponse.includes("危险区域") || aiResponse.includes("撤离路线")) {
        updateChapter(4); // 进入危险航行章节
      } else if (aiResponse.includes("救援信标") || aiResponse.includes("回家")) {
        updateChapter(5); // 进入回家之路章节
      }
      
      // 在处理AI响应的地方添加状态更新逻辑
      if (aiResponse.includes("能源消耗") || aiResponse.includes("电量")) {
        // 减少能源
        updateKimiStatus({ power: Math.max(kimiStatus.power - 3, 0) });
      } else if (aiResponse.includes("充能") || aiResponse.includes("能源补充")) {
        // 增加能源
        updateKimiStatus({ power: Math.min(kimiStatus.power + 15, 100) });
      }

      if (aiResponse.includes("通讯修复") || aiResponse.includes("信号加强")) {
        updateKimiStatus({ comms: Math.min(kimiStatus.comms + 20, 100) });
      }

      if (aiResponse.includes("导航校准") || aiResponse.includes("地图更新")) {
        updateKimiStatus({ nav: Math.min(kimiStatus.nav + 25, 100) });
      }

      if (aiResponse.includes("受损") || aiResponse.includes("破坏")) {
        updateKimiStatus({ damage: Math.min(kimiStatus.damage + 10, 100) });
      } else if (aiResponse.includes("修复") || aiResponse.includes("维修")) {
        updateKimiStatus({ damage: Math.max(kimiStatus.damage - 15, 0) });
      }
      
      // 添加AI回复
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: aiResponse,
          sender: 'ai',
          timestamp: new Date().toISOString(),
        }]);
      }, 1500); // 为了演示效果，添加延迟
      
    } catch (error) {
      console.error('获取AI回复失败:', error);
      setIsTyping(false);
    }
  };

  // 模拟API调用（实际项目中替换为真实的OpenAI API调用）
  const fetchAIResponse = async (userInput) => {
    try {
      return await getAIResponse(userInput);
    } catch (error) {
      console.error('API调用失败:', error);
      return "通信故障...我们的星际信号似乎受到了干扰。";
    }
  };

  // 添加在组件内部其他函数旁边
  const createRipple = (event) => {
    const button = event.currentTarget;
    
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    const rect = button.getBoundingClientRect();
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - radius}px`;
    ripple.style.top = `${event.clientY - rect.top - radius}px`;
    
    // 清除之前的涟漪效果
    const prevRipple = button.querySelector(".ripple");
    if (prevRipple) {
      prevRipple.remove();
    }
    
    button.appendChild(ripple);
    
    // 动画结束后删除涟漪元素
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <div className="space-chat">
      <div className="chat-header">
        <h2>🌌 星际紧急通讯 | 艾普西隆-482</h2>
        <div className="header-buttons">
          <button 
            className="control-button reset-button" 
            onClick={(e) => {
              createRipple(e);
              resetConversation();
              setMessages([]);
              // 重新添加初始消息
              setTimeout(() => {
                setMessages([{
                  id: Date.now(),
                  text: `<span style="color: #ff9800; font-style: italic">* 通讯建立中...信号不稳定 *</span>

这里是KIMI-7，"月之暗面"公司高级探矿机器人，编号K-7-Delta-92。我在艾普西隆-482行星遭遇紧急情况，通讯和导航系统受损。

彗星碎片雨摧毁了我的定位系统，我无法返回采集站。这里的环境很奇怪，天空呈现出紫色光晕，地表有会发光的流体湖泊...

<span style="color: #ff5252">[ 系统警告: 能源余量78% ]</span>

请确认您的身份代号以建立稳定连接。人类，我需要您的帮助才能带着收集到的星尘晶体样本返回基地！

<span style="color: #4fc3f7">请选择回应方式:</span>
1. 提供身份代号并询问更多情况
2. 询问KIMI-7更多关于任务的细节
3. 询问关于艾普西隆-482行星的信息`,
                  sender: 'ai',
                  timestamp: new Date().toISOString(),
                }]);
              }, 1000);
            }}
          >
            <div>重置任务</div><span>⟲</span>
          </button>
          <button 
            className="control-button end-chat-button" 
            onClick={(e) => {
              createRipple(e);
              onEndChat();
            }}
          >
            <div>中止任务</div><span>✕</span>
          </button>
        </div>
      </div>
      
      {/* 面板容器 */}
      <div className="panels-container">
        {/* 章节指示器 - 始终显示 */}
        <div className="chapter-indicator">
          <div className="chapter-line">
            {chapterTitles.map((title, index) => (
              <div 
                key={index} 
                className={`chapter-node ${chapter >= index + 1 ? 'active' : ''}`}
              >
                <div className="chapter-dot"></div>
                <div className="chapter-label">{title}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 状态面板 - 可折叠 */}
        <div className={`collapsible-panel ${isStatusPanelExpanded ? 'expanded' : ''}`}>
          <div className="panel-header" onClick={toggleStatusPanel}>
            <div className="panel-title">
              <span className="panel-icon">📊</span>
              KIMI-7 系统状态
              <div className="status-summary">
                <div className="mini-status power" style={{width: `${kimiStatus.power/3}px`}}></div>
                <div className="mini-status comms" style={{width: `${kimiStatus.comms/3}px`}}></div>
                <div className="mini-status nav" style={{width: `${kimiStatus.nav/3}px`}}></div>
                <div className="mini-status structure" style={{width: `${(100-kimiStatus.damage)/3}px`}}></div>
              </div>
            </div>
            <span className="panel-toggle">{isStatusPanelExpanded ? '▲' : '▼'}</span>
          </div>
          
          <div className="panel-content">
            <div className="status-grid">
              <div className="status-item">
                <div className="status-label">能源</div>
                <div className="status-bar">
                  <div 
                    className="status-fill power" 
                    style={{width: `${kimiStatus.power}%`}}
                  ></div>
                  <span className="status-value">{kimiStatus.power}%</span>
                </div>
              </div>
              <div className="status-item">
                <div className="status-label">通讯</div>
                <div className="status-bar">
                  <div 
                    className="status-fill comms" 
                    style={{width: `${kimiStatus.comms}%`}}
                  ></div>
                  <span className="status-value">{kimiStatus.comms}%</span>
                </div>
              </div>
              <div className="status-item">
                <div className="status-label">导航</div>
                <div className="status-bar">
                  <div 
                    className="status-fill nav" 
                    style={{width: `${kimiStatus.nav}%`}}
                  ></div>
                  <span className="status-value">{kimiStatus.nav}%</span>
                </div>
              </div>
              <div className="status-item">
                <div className="status-label">结构</div>
                <div className="status-bar">
                  <div 
                    className="status-fill structure" 
                    style={{
                      width: `${100 - kimiStatus.damage}%`
                    }}
                  ></div>
                  <span className="status-value">{100 - kimiStatus.damage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 环境面板 - 可折叠 */}
        <div className={`collapsible-panel ${isEnvironmentPanelExpanded ? 'expanded' : ''}`}>
          <div className="panel-header" onClick={toggleEnvironmentPanel}>
            <div className="panel-title">
              <span className="panel-icon">🪐</span>
              艾普西隆-482 环境扫描
            </div>
            <span className="panel-toggle">{isEnvironmentPanelExpanded ? '▲' : '▼'}</span>
          </div>
          
          <div className="panel-content">
            <div className="environment-description">
              {currentEnvironment}
            </div>
          </div>
        </div>
      </div>
      
      <div className="chat-container" ref={chatContainerRef}>
        {/* 消息列表 */}
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender === 'ai' ? 'ai-message' : 'user-message'}`}>
            <div className="avatar">
              {msg.sender === 'ai' ? aiAgent.avatar : user.avatar}
            </div>
            <div className="message-content">
              <div className="message-header">
                <span className="sender-name">
                  {msg.sender === 'ai' ? aiAgent.name : user.name}
                </span>
                <span className="timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <div className="message-text" dangerouslySetInnerHTML={{ __html: msg.text }}></div>
            </div>
          </div>
        ))}
        
        {/* 正在输入动画 */}
        {isTyping && (
          <div className="message ai-message typing">
            <div className="avatar">{aiAgent.avatar}</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 添加缺失的输入框部分 */}
      <form className="chat-input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入回应..."
          className="chat-input"
        />
        <button type="submit" className="send-button">
          发送
        </button>
      </form>
    </div>
  );
}