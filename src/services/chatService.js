// Firebase聊天服务 - 修复版本
import { db } from '../firebase.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  serverTimestamp,
  onSnapshot,
  connectFirestoreEmulator
} from 'firebase/firestore';

class ChatService {
  constructor() {
    this.db = db;
    this.isInitialized = false;
    this.isOnline = true;
    this.offlineMessages = [];
    this.listeners = [];
    
    // 立即初始化
    this.initialize();
  }

  async initialize() {
    console.log('🔥 ChatService初始化开始...');
    
    try {
      // 测试Firebase连接
      await this.testConnection();
      this.isInitialized = true;
      this.isOnline = true;
      console.log('✅ ChatService初始化成功');
      
      // 尝试同步离线消息
      if (this.offlineMessages.length > 0) {
        console.log(`📤 同步${this.offlineMessages.length}条离线消息...`);
        await this.syncOfflineMessages();
      }
      
    } catch (error) {
      console.error('❌ ChatService初始化失败:', error);
      this.isOnline = false;
      this.isInitialized = true; // 仍然标记为已初始化，但处于离线模式
      console.log('📱 切换到离线模式');
    }
  }

  async testConnection() {
    console.log('🔍 测试Firebase连接...');
    
    try {
      // 尝试读取一个文档来测试连接
      const testQuery = query(
        collection(this.db, 'chat_messages'),
        orderBy('timestamp', 'desc'),
        limit(1)
      );
      
      const snapshot = await getDocs(testQuery);
      console.log('✅ Firebase连接测试成功');
      return true;
      
    } catch (error) {
      console.error('❌ Firebase连接测试失败:', error);
      
      // 详细错误分析
      if (error.code === 'permission-denied') {
        console.error('🔒 权限被拒绝 - 检查Firestore安全规则');
      } else if (error.code === 'unauthenticated') {
        console.error('🔑 未认证 - 检查API密钥配置');
      } else if (error.code === 'unavailable') {
        console.error('🌐 服务不可用 - 检查网络连接');
      } else {
        console.error('❓ 未知错误:', error.message);
      }
      
      throw error;
    }
  }

  async sendMessage(messageData) {
    console.log('📤 发送消息:', messageData);
    
    if (!this.isInitialized) {
      console.log('⏳ 等待初始化完成...');
      await this.waitForInitialization();
    }
    
    if (!this.isOnline) {
      console.log('📱 离线模式 - 保存到本地');
      this.offlineMessages.push(messageData);
      return { success: true, offline: true };
    }
    
    try {
      const docData = {
        ...messageData,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      };
      
      console.log('💾 写入Firestore:', docData);
      const docRef = await addDoc(collection(this.db, 'chat_messages'), docData);
      
      console.log('✅ 消息发送成功, ID:', docRef.id);
      return { success: true, id: docRef.id };
      
    } catch (error) {
      console.error('❌ 发送消息失败:', error);
      
      // 如果是网络错误，切换到离线模式
      if (error.code === 'unavailable' || error.message.includes('fetch')) {
        console.log('🔄 切换到离线模式');
        this.isOnline = false;
        this.offlineMessages.push(messageData);
        return { success: true, offline: true };
      }
      
      throw error;
    }
  }

  async getMessages(limitCount = 50) {
    console.log('📖 获取消息列表...');
    
    if (!this.isInitialized) {
      await this.waitForInitialization();
    }
    
    if (!this.isOnline) {
      console.log('📱 离线模式 - 返回本地消息');
      return this.offlineMessages;
    }
    
    try {
      const q = query(
        collection(this.db, 'chat_messages'),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const messages = [];
      
      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`✅ 获取到${messages.length}条消息`);
      return messages.reverse(); // 按时间正序返回
      
    } catch (error) {
      console.error('❌ 获取消息失败:', error);
      
      if (error.code === 'unavailable') {
        this.isOnline = false;
        return this.offlineMessages;
      }
      
      throw error;
    }
  }

  subscribeToMessages(callback, limitCount = 50) {
    console.log('👂 订阅消息更新...');
    
    if (!this.isOnline) {
      console.log('📱 离线模式 - 无法订阅实时更新');
      return () => {}; // 返回空的取消订阅函数
    }
    
    try {
      const q = query(
        collection(this.db, 'chat_messages'),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
          messages.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        console.log(`🔄 收到消息更新: ${messages.length}条`);
        callback(messages.reverse());
      }, (error) => {
        console.error('❌ 消息订阅错误:', error);
        this.isOnline = false;
        callback(this.offlineMessages);
      });
      
      this.listeners.push(unsubscribe);
      return unsubscribe;
      
    } catch (error) {
      console.error('❌ 订阅消息失败:', error);
      this.isOnline = false;
      return () => {};
    }
  }

  async syncOfflineMessages() {
    if (this.offlineMessages.length === 0 || !this.isOnline) {
      return;
    }
    
    console.log(`🔄 同步${this.offlineMessages.length}条离线消息...`);
    
    const messagesToSync = [...this.offlineMessages];
    this.offlineMessages = [];
    
    for (const message of messagesToSync) {
      try {
        await this.sendMessage(message);
        console.log('✅ 离线消息同步成功');
      } catch (error) {
        console.error('❌ 离线消息同步失败:', error);
        // 重新加入离线队列
        this.offlineMessages.push(message);
      }
    }
  }

  async waitForInitialization(timeout = 5000) {
    const startTime = Date.now();
    
    while (!this.isInitialized && (Date.now() - startTime) < timeout) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (!this.isInitialized) {
      throw new Error('ChatService初始化超时');
    }
  }

  // 清理资源
  cleanup() {
    console.log('🧹 清理ChatService资源...');
    this.listeners.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (error) {
        console.error('清理监听器失败:', error);
      }
    });
    this.listeners = [];
  }

  // 获取连接状态
  getStatus() {
    return {
      initialized: this.isInitialized,
      online: this.isOnline,
      offlineMessages: this.offlineMessages.length
    };
  }
}

// 创建单例实例
const chatService = new ChatService();

export default chatService; 