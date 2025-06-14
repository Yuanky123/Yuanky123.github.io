// 简单的Firebase测试脚本
// 在Life页面的Console中运行此脚本

console.log('🔥 开始简单Firebase测试...');

// 测试发送消息到Firebase
const testSendMessage = async () => {
  try {
    console.log('📤 尝试导入Firebase模块...');
    
    // 动态导入Firebase模块
    const { db } = await import('./src/firebase.js');
    const { collection, addDoc, serverTimestamp, getDocs } = await import('firebase/firestore');
    
    console.log('✅ Firebase模块导入成功');
    
    // 测试写入
    console.log('📝 测试写入消息...');
    const testMessage = {
      text: `测试消息 - ${new Date().toLocaleString()}`,
      timestamp: serverTimestamp(),
      anonymous: true,
      anonymousName: 'Test User',
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'chat_messages'), testMessage);
    console.log('✅ 消息写入成功！文档ID:', docRef.id);
    
    // 测试读取
    console.log('📖 测试读取消息...');
    const querySnapshot = await getDocs(collection(db, 'chat_messages'));
    console.log('✅ 消息读取成功！总数:', querySnapshot.size);
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`📄 消息: ${data.text} (${data.anonymousName})`);
    });
    
    console.log('🎉 Firebase测试完全成功！');
    
  } catch (error) {
    console.error('❌ Firebase测试失败:', error);
    console.error('错误详情:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
  }
};

// 运行测试
testSendMessage();

console.log('📋 使用说明:');
console.log('1. 确保你在 https://yuanky123.github.io/ 的Life页面');
console.log('2. 在Console中粘贴并运行此脚本');
console.log('3. 观察输出结果');
console.log('4. 如果成功，说明Firebase配置正确');
console.log('5. 如果失败，查看具体错误信息'); 