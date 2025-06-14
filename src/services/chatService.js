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
  doc,
  connectFirestoreEmulator
} from 'firebase/firestore';

// 安全导入Firebase
let db = null;
let firebaseInitialized = false;

const initializeFirebase = async () => {
  if (firebaseInitialized) return db;
  
  try {
    console.log('🔥 开始初始化Firebase...');
    const firebaseModule = await import('../firebase');
    db = firebaseModule.db;
    
    if (!db) {
      console.warn('❌ Firebase db is not available, running in offline mode');
      firebaseInitialized = true;
      return null;
    }
    
    // 测试Firebase连接
    console.log('🧪 测试Firebase连接...');
    
    // 尝试一个简单的读取操作来验证连接
    try {
      const testQuery = query(
        collection(db, 'chat_messages'), 
        limit(1)
      );
      await getDocs(testQuery);
      console.log('✅ Firebase连接测试成功');
    } catch (testError) {
      console.error('❌ Firebase连接测试失败:', testError);
      
      // 如果是权限错误，仍然返回db让其他操作尝试
      if (testError.code === 'permission-denied') {
        console.log('⚠️ 权限被拒绝，但继续尝试其他操作');
      } else {
        console.log('🔄 切换到离线模式');
        firebaseInitialized = true;
        return null;
      }
    }
    
    console.log('✅ Firebase初始化成功');
    firebaseInitialized = true;
    return db;
    
  } catch (error) {
    console.error('❌ Firebase初始化失败:', error);
    console.log('🔄 切换到离线模式');
    firebaseInitialized = true;
    return null;
  }
};

// 消息集合名称
const MESSAGES_COLLECTION = 'chat_messages';

// 发送消息到数据库
export const sendMessageToDb = async (messageText) => {
  console.log('📤 sendMessageToDb 开始，消息:', messageText);
  
  try {
    const firebaseDb = await initializeFirebase();
    if (!firebaseDb) {
      throw new Error('Firebase not available');
    }
    
    console.log('📝 准备写入Firebase...');
    
    const messageData = {
      text: messageText,
      timestamp: serverTimestamp(),
      anonymous: true,
      anonymousName: generateAnonymousName(),
      createdAt: new Date().toISOString()
    };
    
    console.log('📋 消息数据:', messageData);
    
    const docRef = await addDoc(collection(firebaseDb, MESSAGES_COLLECTION), messageData);
    
    console.log('✅ 消息已保存到Firebase，ID:', docRef.id);
    return docRef.id;
    
  } catch (error) {
    console.error('❌ 发送消息到Firebase失败:', error);
    console.error('错误详情:', {
      code: error.code,
      message: error.message,
      name: error.name
    });
    
    // 离线模式：使用localStorage
    console.log('🔄 切换到离线模式保存');
    
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
    
    console.log('✅ 消息已保存到本地存储');
    
    // 触发自定义事件通知其他组件
    window.dispatchEvent(new CustomEvent('offlineMessageAdded', { detail: offlineMessage }));
    
    // 重新抛出错误，让调用者知道Firebase失败了
    throw error;
  }
};

// 获取所有消息（一次性）
export const getAllMessages = async () => {
  console.log('📖 getAllMessages 开始');
  
  try {
    const firebaseDb = await initializeFirebase();
    if (!firebaseDb) {
      console.log('🔄 Firebase不可用，返回离线消息');
      return getOfflineMessages();
    }
    
    console.log('📊 从Firebase获取消息...');
    
    const q = query(
      collection(firebaseDb, MESSAGES_COLLECTION), 
      orderBy('timestamp', 'asc'),
      limit(100)
    );
    
    const querySnapshot = await getDocs(q);
    const messages = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        ...data,
        // 确保有匿名名称
        anonymousName: data.anonymousName || generateAnonymousName()
      });
    });
    
    console.log('✅ 从Firebase获取到', messages.length, '条消息');
    return messages;
    
  } catch (error) {
    console.error('❌ 从Firebase获取消息失败:', error);
    console.log('🔄 返回离线消息');
    return getOfflineMessages();
  }
};

// 获取离线消息
const getOfflineMessages = () => {
  const offlineMessages = JSON.parse(localStorage.getItem('offline_messages') || '[]');
  const defaultMessages = [
    { id: 'demo1', text: "Welcome to Kangyu's space! ✨", anonymousName: 'Friendly Guide' },
    { id: 'demo2', text: "Leave your thoughts here 💭", anonymousName: 'Happy Visitor' },
    { id: 'demo3', text: "Beautiful design! 🌟", anonymousName: 'Art Lover' },
    { id: 'demo4', text: "Amazing work! 🎨", anonymousName: 'Creative Soul' },
    { id: 'demo5', text: "Love the music! 🎵", anonymousName: 'Music Fan' }
  ];
  
  const allMessages = [...defaultMessages, ...offlineMessages];
  console.log('📋 离线模式返回', allMessages.length, '条消息');
  return allMessages;
};

// 实时监听消息更新
export const subscribeToMessages = (callback) => {
  console.log('👂 开始订阅消息更新');
  let cleanup = () => {};
  
  const setupSubscription = async () => {
    try {
      const firebaseDb = await initializeFirebase();
      if (!firebaseDb) {
        console.log('🔄 Firebase不可用，使用离线模式');
        return setupOfflineMode(callback);
      }
      
      console.log('📡 设置Firebase实时监听');
      
      const q = query(
        collection(firebaseDb, MESSAGES_COLLECTION), 
        orderBy('timestamp', 'asc'),
        limit(100)
      );
      
      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          console.log('📨 收到Firebase实时更新');
          const messages = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            messages.push({
              id: doc.id,
              ...data,
              anonymousName: data.anonymousName || generateAnonymousName()
            });
          });
          console.log('📊 实时更新包含', messages.length, '条消息');
          callback(messages);
        }, 
        (error) => {
          console.error('❌ Firebase实时监听失败:', error);
          console.log('🔄 切换到离线模式');
          cleanup = setupOfflineMode(callback);
        }
      );
      
      cleanup = unsubscribe;
      
    } catch (error) {
      console.error('❌ Firebase订阅设置失败:', error);
      cleanup = setupOfflineMode(callback);
    }
  };
  
  setupSubscription();
  return () => cleanup();
};

// 设置离线模式
const setupOfflineMode = (callback) => {
  console.log('🔄 设置离线模式监听');
  
  // 立即加载离线消息
  const offlineMessages = getOfflineMessages();
  callback(offlineMessages);
  
  // 监听新的离线消息
  const handleOfflineMessage = () => {
    const updatedMessages = getOfflineMessages();
    callback(updatedMessages);
  };
  
  window.addEventListener('offlineMessageAdded', handleOfflineMessage);
  
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

// 批量存储演示弹幕数据到Firebase
export const storeDemoMessages = async () => {
  const firebaseDb = await initializeFirebase();
  if (!firebaseDb) {
    console.log('Firebase不可用，跳过演示数据存储');
    return false;
  }

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
    
    const batch = writeBatch(firebaseDb);
    const messagesRef = collection(firebaseDb, MESSAGES_COLLECTION);
    
    demoMessages.forEach((messageText, index) => {
      const docRef = doc(messagesRef);
      batch.set(docRef, {
        text: messageText,
        timestamp: serverTimestamp(),
        anonymous: true,
        anonymousName: generateAnonymousName(),
        createdAt: new Date(Date.now() - (demoMessages.length - index) * 60000).toISOString(),
        isDemo: true
      });
    });
    
    await batch.commit();
    console.log('✅ 演示弹幕数据已成功存储到Firebase!');
    return true;
    
  } catch (error) {
    console.error('❌ 存储演示弹幕数据失败:', error);
    return false;
  }
}; 