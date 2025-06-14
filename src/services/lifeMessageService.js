// Life页面专用的消息服务
import { sendMessageToDb, subscribeToMessages, generateAnonymousName } from './chatService';

// 发送留言到Firebase
export const sendLifeMessage = async (messageText) => {
  try {
    console.log('📤 发送Life页面留言:', messageText);
    const messageId = await sendMessageToDb(messageText);
    console.log('✅ 留言发送成功，ID:', messageId);
    return { success: true, messageId };
  } catch (error) {
    console.error('❌ 发送留言失败:', error);
    return { success: false, error: error.message };
  }
};

// 监听Firebase消息并转换为弹幕
export const subscribeToLifeMessages = (onNewMessage) => {
  let lastMessageCount = 0;
  
  const unsubscribe = subscribeToMessages((messages) => {
    console.log('📥 收到消息更新:', messages.length, '条');
    
    // 只处理新增的消息
    if (messages.length > lastMessageCount) {
      const newMessages = messages.slice(lastMessageCount);
      
      newMessages.forEach((message, index) => {
        // 延迟显示新消息，避免同时出现太多弹幕
        setTimeout(() => {
          if (message.text && message.text.trim()) {
            onNewMessage({
              text: message.text,
              anonymousName: message.anonymousName || generateAnonymousName(),
              timestamp: message.timestamp
            });
          }
        }, index * 1500); // 每条消息间隔1.5秒
      });
    }
    
    lastMessageCount = messages.length;
  });
  
  return unsubscribe;
};

// 获取消息统计
export const getLifeMessageStats = async () => {
  try {
    const { getAllMessages } = await import('./chatService');
    const messages = await getAllMessages();
    
    const today = new Date().toDateString();
    const todayMessages = messages.filter(msg => {
      const msgDate = new Date(msg.timestamp?.seconds * 1000 || msg.createdAt).toDateString();
      return msgDate === today;
    });
    
    return {
      total: messages.length,
      today: todayMessages.length,
      recent: messages.slice(-10) // 最近10条
    };
  } catch (error) {
    console.error('❌ 获取消息统计失败:', error);
    return { total: 0, today: 0, recent: [] };
  }
}; 