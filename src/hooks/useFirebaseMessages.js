// Firebase消息管理Hook
import { useState, useEffect, useCallback } from 'react';

export const useFirebaseMessages = (createDanmaku) => {
  const [messageCount, setMessageCount] = useState(0);
  const [allMessages, setAllMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 获取所有Firebase消息
  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const { getAllMessages } = await import('../services/chatService');
      const messages = await getAllMessages();
      
      console.log('📥 从Firebase获取到', messages.length, '条留言');
      setAllMessages(messages);
      setMessageCount(messages.length);
      
      return messages;
    } catch (error) {
      console.error('❌ 获取Firebase留言失败:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 发送新消息
  const sendMessage = useCallback(async (messageText) => {
    try {
      const { sendMessageToDb } = await import('../services/chatService');
      const messageId = await sendMessageToDb(messageText);
      
      console.log('✅ 留言已成功保存到Firebase，ID:', messageId);
      
      // 重新加载消息列表
      await loadMessages();
      
      return { success: true, messageId };
    } catch (error) {
      console.error('❌ 发送留言失败:', error);
      return { success: false, error: error.message };
    }
  }, [loadMessages]);

  // 启动随机弹幕循环
  const startRandomDanmaku = useCallback((messages) => {
    if (!messages || messages.length === 0 || !createDanmaku) return null;
    
    const showRandomDanmaku = () => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      if (randomMessage && randomMessage.text && randomMessage.text.trim()) {
        createDanmaku(randomMessage.text);
        console.log('🎭 显示随机弹幕:', randomMessage.text);
      }
    };
    
    // 立即显示一条
    setTimeout(showRandomDanmaku, 2000);
    
    // 每20-40秒随机显示一条弹幕
    const interval = setInterval(() => {
      showRandomDanmaku();
    }, Math.random() * 20000 + 20000); // 20-40秒随机间隔
    
    console.log('🔄 随机弹幕循环已启动');
    return interval;
  }, [createDanmaku]);

  // 组件挂载时加载消息并启动弹幕循环
  useEffect(() => {
    let danmakuInterval = null;
    
    const initializeMessages = async () => {
      const messages = await loadMessages();
      
      if (messages.length > 0) {
        danmakuInterval = startRandomDanmaku(messages);
      }
    };
    
    initializeMessages();
    
    return () => {
      if (danmakuInterval) {
        clearInterval(danmakuInterval);
        console.log('🛑 随机弹幕循环已停止');
      }
    };
  }, [loadMessages, startRandomDanmaku]);

  return {
    messageCount,
    allMessages,
    isLoading,
    sendMessage,
    loadMessages
  };
}; 