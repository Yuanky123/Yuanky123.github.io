import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// 在组件内部添加Firebase集成
export default function Life({ onClose }) {
  // 所有现有的状态
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentBackground, setCurrentBackground] = useState(0);
  const [weather, setWeather] = useState({
    temperature: '--',
    condition: 'Loading',
    windDirection: '--',
    windSpeed: '--',
    loading: true,
    location: 'Hong Kong'
  });

  // 音乐播放器状态
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTimeAudio, setCurrentTimeAudio] = useState(0);

  // 留言板状态 - 修改为使用Firebase
  const [messageInput, setMessageInput] = useState('');
  const [danmakuList, setDanmakuList] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [allFirebaseMessages, setAllFirebaseMessages] = useState([]);

  // Firebase消息管理
  useEffect(() => {
    let danmakuInterval = null;
    
    const loadFirebaseMessages = async () => {
      try {
        const { getAllMessages } = await import('../services/chatService');
        const firebaseMessages = await getAllMessages();
        
        console.log('📥 从Firebase获取到', firebaseMessages.length, '条留言');
        setAllFirebaseMessages(firebaseMessages);
        setMessageCount(firebaseMessages.length);
        
        // 启动随机弹幕循环
        if (firebaseMessages.length > 0) {
          const showRandomDanmaku = () => {
            const randomMessage = firebaseMessages[Math.floor(Math.random() * firebaseMessages.length)];
            if (randomMessage && randomMessage.text && randomMessage.text.trim()) {
              createDanmaku(randomMessage.text);
              console.log('🎭 显示随机弹幕:', randomMessage.text);
            }
          };
          
          // 3秒后开始显示第一条随机弹幕
          setTimeout(showRandomDanmaku, 3000);
          
          // 每30-45秒显示一条随机弹幕
          danmakuInterval = setInterval(() => {
            showRandomDanmaku();
          }, Math.random() * 15000 + 30000); // 30-45秒随机间隔
          
          console.log('🔄 随机弹幕循环已启动');
        }
        
      } catch (error) {
        console.error('❌ 获取Firebase留言失败:', error);
      }
    };
    
    loadFirebaseMessages();
    
    return () => {
      if (danmakuInterval) {
        clearInterval(danmakuInterval);
        console.log('🛑 随机弹幕循环已停止');
      }
    };
  }, []);

  // 修改sendMessage函数使用Firebase
  const sendMessage = async () => {
    if (!messageInput.trim()) return;
    
    const messageText = messageInput.trim();
    
    // 立即创建弹幕和清空输入框（乐观更新）
    createDanmaku(messageText);
    setMessageInput('');
    
    console.log('📤 发送留言到Firebase:', messageText);
    
    // 发送到Firebase并更新留言数量
    try {
      const { sendMessageToDb, getAllMessages } = await import('../services/chatService');
      
      // 发送消息
      const messageId = await sendMessageToDb(messageText);
      console.log('✅ 留言已成功保存到Firebase，ID:', messageId);
      
      // 重新获取最新的留言数量和消息列表
      const updatedMessages = await getAllMessages();
      setMessageCount(updatedMessages.length);
      setAllFirebaseMessages(updatedMessages);
      
      console.log('📊 更新留言数量为:', updatedMessages.length);
      
    } catch (error) {
      console.error('❌ 发送留言到Firebase失败:', error);
    }
  };

  // 创建弹幕函数
  const createDanmaku = (text) => {
    const newDanmaku = {
      id: Date.now() + Math.random(),
      text: text,
      top: Math.random() * 60 + 10, // 10-70% 的位置
      color: getRandomColor()
    };
    
    setDanmakuList(prev => [...prev, newDanmaku]);
    
    // 20秒后移除弹幕
    setTimeout(() => {
      setDanmakuList(prev => prev.filter(d => d.id !== newDanmaku.id));
    }, 20000);
  };

  // 获取随机颜色
  const getRandomColor = () => {
    const colors = [
      'rgba(102, 126, 234, 0.9)',
      'rgba(118, 75, 162, 0.9)',
      'rgba(255, 107, 107, 0.9)',
      'rgba(78, 205, 196, 0.9)',
      'rgba(255, 195, 113, 0.9)',
      'rgba(199, 121, 208, 0.9)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // 处理留言输入
  const handleMessageKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // 生成匿名用户名
  const generateAnonymousName = () => {
    const adjectives = ['神秘', '快乐', '智慧', '勇敢', '温柔', '活泼', '安静', '友善', '优雅', '睿智'];
    const nouns = ['旅行者', '探索者', '梦想家', '思考者', '创造者', '观察者', '学习者', '冒险家', '艺术家', '诗人'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 999) + 1;
    return `${adj}的${noun}${num}`;
  };

  // 其他所有现有的函数和useEffect保持不变...
  // 这里只是示例，实际需要复制所有现有的逻辑

  return (
    <div>
      {/* 留言板部分 */}
      <div className="message-input-container">
        <input
          type="text"
          className="message-input"
          placeholder="Share your thoughts..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleMessageKeyPress}
          maxLength={100}
        />
        <button 
          className="send-btn" 
          onClick={sendMessage}
          disabled={!messageInput.trim()}
          title="Send Message"
        >
          📤
        </button>
      </div>
      <div className="message-stats">
        {messageCount} messages in database • Random danmaku stream
      </div>

      {/* 弹幕容器 */}
      <div>
        {danmakuList.map(danmaku => (
          <div
            key={danmaku.id}
            style={{
              position: 'absolute',
              top: `${danmaku.top}%`,
              color: 'white',
              fontSize: '0.9rem',
              animation: 'danmaku-move 20s linear infinite'
            }}
          >
            {danmaku.text}
          </div>
        ))}
      </div>
    </div>
  );
} 