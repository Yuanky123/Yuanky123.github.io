import { db } from './src/firebase.js';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

async function testFirebaseConnection() {
  console.log('🔥 开始测试Firebase连接...');
  
  try {
    // 测试1: 写入测试数据
    console.log('\n📝 测试1: 写入数据...');
    const testMessage = {
      content: `测试消息 - ${new Date().toLocaleString()}`,
      username: 'TestUser',
      timestamp: new Date(),
      color: '#ff6b6b'
    };
    
    const docRef = await addDoc(collection(db, 'chat_messages'), testMessage);
    console.log('✅ 写入成功！文档ID:', docRef.id);
    
    // 测试2: 读取数据
    console.log('\n📖 测试2: 读取数据...');
    const q = query(
      collection(db, 'chat_messages'), 
      orderBy('timestamp', 'desc'), 
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    
    console.log(`✅ 读取成功！找到 ${querySnapshot.size} 条消息:`);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`  - ${data.username}: ${data.content}`);
    });
    
    // 测试3: 统计总数
    console.log('\n📊 测试3: 统计总消息数...');
    const allMessages = await getDocs(collection(db, 'chat_messages'));
    console.log(`✅ 数据库中共有 ${allMessages.size} 条消息`);
    
    console.log('\n🎉 Firebase连接测试完全成功！');
    console.log('💡 你现在可以在网站上正常使用留言板功能了');
    
  } catch (error) {
    console.error('\n❌ Firebase连接测试失败:');
    console.error('错误详情:', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('\n🔒 权限被拒绝，请检查:');
      console.log('1. Firestore安全规则是否正确设置');
      console.log('2. 是否允许读写chat_messages集合');
    } else if (error.code === 'unavailable') {
      console.log('\n🌐 网络不可用，请检查:');
      console.log('1. 网络连接是否正常');
      console.log('2. Firebase项目是否正常运行');
    } else {
      console.log('\n🔧 其他错误，请检查:');
      console.log('1. firebase.js配置是否正确');
      console.log('2. Firebase项目ID是否匹配');
    }
  }
}

// 运行测试
testFirebaseConnection(); 