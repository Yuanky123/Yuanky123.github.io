// Firebase连接调试脚本
// 在浏览器Console中运行此脚本来诊断问题

console.log('🔥 开始Firebase连接诊断...');

// 检查Firebase配置
const checkFirebaseConfig = () => {
  console.log('📋 检查Firebase配置...');
  
  // 检查是否有Firebase对象
  if (typeof firebase !== 'undefined') {
    console.log('✅ Firebase SDK已加载');
    
    // 检查应用配置
    try {
      const app = firebase.app();
      console.log('✅ Firebase应用已初始化');
      console.log('📊 项目ID:', app.options.projectId);
      console.log('📊 Auth Domain:', app.options.authDomain);
    } catch (error) {
      console.error('❌ Firebase应用未初始化:', error);
    }
  } else {
    console.error('❌ Firebase SDK未加载');
  }
};

// 测试Firestore连接
const testFirestore = async () => {
  console.log('🗄️ 测试Firestore连接...');
  
  try {
    // 尝试简单的读取操作
    const db = firebase.firestore();
    console.log('✅ Firestore实例已创建');
    
    // 测试读取权限
    const testCollection = db.collection('chat_messages');
    const snapshot = await testCollection.limit(1).get();
    
    console.log('✅ Firestore读取成功');
    console.log('📊 文档数量:', snapshot.size);
    
    // 测试写入权限
    const testDoc = await testCollection.add({
      text: 'Test message from debug script',
      timestamp: new Date(),
      test: true
    });
    
    console.log('✅ Firestore写入成功');
    console.log('📊 文档ID:', testDoc.id);
    
    // 清理测试文档
    await testDoc.delete();
    console.log('✅ 测试文档已清理');
    
  } catch (error) {
    console.error('❌ Firestore测试失败:', error);
    console.error('错误代码:', error.code);
    console.error('错误消息:', error.message);
  }
};

// 运行诊断
checkFirebaseConfig();
testFirestore();

// 使用说明：
// 1. 打开 https://yuanky123.github.io/ 的Life页面
// 2. 按F12打开开发者工具
// 3. 在Console中粘贴并运行此脚本
// 4. 查看输出结果 