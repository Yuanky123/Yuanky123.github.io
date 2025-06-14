// 聊天数据库服务
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  getDocs,
  writeBatch,
  doc
} from 'firebase/firestore';
import { db } from '../firebase';

// 消息集合名称
const MESSAGES_COLLECTION = 'chat_messages';

// 发送消息到数据库
export const sendMessageToDb = async (messageText) => {
  try {
    const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
      text: messageText,
      timestamp: serverTimestamp(),
      anonymous: true,
      anonymousName: generateAnonymousName(),
      createdAt: new Date().toISOString()
    });
    
    console.log('消息已保存，ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('发送消息失败，使用离线模式:', error);
    
    // 离线模式：使用localStorage
    const offlineMessage = {
      id: 'offline_' + Date.now(),
      text: messageText,
      timestamp: { seconds: Date.now() / 1000 },
      anonymous: true,
      anonymousName: generateAnonymousName(),
      createdAt: new Date().toISOString(),
      offline: true
    };
    
    const savedMessages = JSON.parse(localStorage.getItem('offline_messages') || '[]');
    savedMessages.push(offlineMessage);
    localStorage.setItem('offline_messages', JSON.stringify(savedMessages));
    
    // 触发自定义事件通知其他组件
    window.dispatchEvent(new CustomEvent('offlineMessageAdded', { detail: offlineMessage }));
    
    return offlineMessage.id;
  }
};

// 批量存储演示弹幕数据到Firebase
export const storeDemoMessages = async () => {
  const demoMessages = [
    "Welcome to Kangyu's Message Board! ✨",
    "Leave your thoughts here 💭",
    "Beautiful background images 🌟",
    "Anonymous messages are cool! 📝",
    "Amazing design style 🎨",
    "Feel free to share your ideas! 💡",
    "This is a safe space for everyone 🤗",
    "Enjoy the music and atmosphere 🎵",
    "Connect with others anonymously 🌍",
    "Your voice matters here! 📢"
  ];

  try {
    console.log('🚀 开始存储演示弹幕数据到Firebase...');
    
    // 使用批量写入提高效率
    const batch = writeBatch(db);
    const messagesRef = collection(db, MESSAGES_COLLECTION);
    
    // 为每条演示消息创建文档
    demoMessages.forEach((messageText, index) => {
      const docRef = doc(messagesRef);
      batch.set(docRef, {
        text: messageText,
        timestamp: serverTimestamp(),
        anonymous: true,
        anonymousName: generateAnonymousName(),
        createdAt: new Date(Date.now() - (demoMessages.length - index) * 60000).toISOString(), // 每条消息间隔1分钟
        isDemo: true // 标记为演示消息
      });
    });
    
    // 提交批量写入
    await batch.commit();
    console.log('✅ 演示弹幕数据已成功存储到Firebase!');
    return true;
    
  } catch (error) {
    console.error('❌ 存储演示弹幕数据失败:', error);
    return false;
  }
};

// 获取所有消息（一次性）
export const getAllMessages = async () => {
  try {
    const q = query(
      collection(db, MESSAGES_COLLECTION), 
      orderBy('timestamp', 'asc'),
      limit(100) // 限制最多100条消息
    );
    
    const querySnapshot = await getDocs(q);
    const messages = [];
    
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return messages;
  } catch (error) {
    console.error('获取消息失败:', error);
    return [];
  }
};

// 实时监听消息更新
export const subscribeToMessages = (callback) => {
  let cleanup = () => {}; // 默认空清理函数
  
  try {
    const q = query(
      collection(db, MESSAGES_COLLECTION), 
      orderBy('timestamp', 'asc'),
      limit(100)
    );
    
    // 尝试Firebase实时监听
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          messages.push({
            id: doc.id,
            ...data,
            // 确保匿名名称存在
            anonymousName: data.anonymousName || generateAnonymousName()
          });
        });
        callback(messages);
      }, 
      (error) => {
        console.error('Firebase监听失败，切换到离线模式:', error);
        setupOfflineMode(callback);
      }
    );
    
    cleanup = unsubscribe;
    
  } catch (error) {
    console.error('Firebase初始化失败，使用离线模式:', error);
    cleanup = setupOfflineMode(callback);
  }
  
  return cleanup;
};

// 设置离线模式
const setupOfflineMode = (callback) => {
  // 立即加载离线消息
  const offlineMessages = JSON.parse(localStorage.getItem('offline_messages') || '[]');
  callback(offlineMessages);
  
  // 监听新的离线消息
  const handleOfflineMessage = () => {
    const updatedMessages = JSON.parse(localStorage.getItem('offline_messages') || '[]');
    callback(updatedMessages);
  };
  
  window.addEventListener('offlineMessageAdded', handleOfflineMessage);
  
  // 返回清理函数
  return () => {
    window.removeEventListener('offlineMessageAdded', handleOfflineMessage);
  };
};

// 生成随机匿名昵称
export const generateAnonymousName = () => {
  const adjectives = ['Mysterious', 'Happy', 'Smart', 'Brave', 'Gentle', 'Lively', 'Quiet', 'Friendly', 'Elegant', 'Wise'];
  const nouns = ['Traveler', 'Explorer', 'Dreamer', 'Thinker', 'Creator', 'Observer', 'Listener', 'Sharer', 'Artist', 'Poet'];
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adj} ${noun}`;
};

const sendMessage = async (messageText) => {
  if (!messageText.trim()) return;
  const newMessage = {
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    text: messageText.trim(),
    timestamp: new Date(),
    createdAt: new Date().toISOString(),
    anonymousName: generateAnonymousName()
  };
  const updatedMessages = [...messages, newMessage];
  setMessages(updatedMessages);
  try {
    localStorage.setItem('message_board_data', JSON.stringify(updatedMessages));
  } catch {}
  // 立即显示弹幕
  addDanmaku(messageText);
  // 尝试同步到Firebase
  if (isOnlineMode) {
    try { await sendMessageToDb(messageText); } catch {}
  }
}; 