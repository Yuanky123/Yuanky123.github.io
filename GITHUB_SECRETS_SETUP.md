# 🔐 GitHub Secrets 设置指南

为了让GitHub Pages部署的网站能够连接到Firebase数据库，你需要在GitHub仓库中设置Firebase配置的Secrets。

## 📋 需要设置的Secrets

你需要从你的Firebase项目配置中获取以下6个值，并在GitHub中设置为Secrets：

### 1. FIREBASE_API_KEY
- **来源**: Firebase项目设置 > 常规 > 你的应用 > Firebase SDK 代码片段 > 配置
- **在firebaseConfig对象中的apiKey字段**

### 2. FIREBASE_AUTH_DOMAIN  
- **来源**: Firebase项目设置中的authDomain字段
- **格式**: `your-project-id.firebaseapp.com`

### 3. FIREBASE_PROJECT_ID
- **来源**: Firebase项目设置中的projectId字段
- **就是你的Firebase项目ID**

### 4. FIREBASE_STORAGE_BUCKET
- **来源**: Firebase项目设置中的storageBucket字段
- **格式**: `your-project-id.firebasestorage.app`

### 5. FIREBASE_MESSAGING_SENDER_ID
- **来源**: Firebase项目设置中的messagingSenderId字段
- **是一串数字**

### 6. FIREBASE_APP_ID
- **来源**: Firebase项目设置中的appId字段
- **格式**: `1:数字:web:字符串`

## 🚀 设置步骤

### 步骤1：获取Firebase配置
1. 访问 [Firebase控制台](https://console.firebase.google.com/)
2. 选择你的项目
3. 点击项目设置（齿轮图标）
4. 滚动到"你的应用"部分
5. 点击Web应用的配置图标
6. 复制firebaseConfig对象中的各个值

### 步骤2：在GitHub中设置Secrets
1. 打开你的GitHub仓库：https://github.com/Yuanky123/Yuanky123.github.io
2. 点击 **Settings** 标签
3. 在左侧菜单中找到 **Secrets and variables**
4. 点击 **Actions**

### 步骤3：添加每个Secret
对于上面列出的每个Secret：

1. **点击 "New repository secret"**
2. **Name**: 输入Secret名称（如 `FIREBASE_API_KEY`）
3. **Secret**: 输入从Firebase配置中复制的对应值
4. **点击 "Add secret"**

重复这个过程，直到添加完所有6个Secrets。

## ✅ 验证设置

设置完成后，你应该在Secrets页面看到：
- ✅ FIREBASE_API_KEY
- ✅ FIREBASE_AUTH_DOMAIN  
- ✅ FIREBASE_PROJECT_ID
- ✅ FIREBASE_STORAGE_BUCKET
- ✅ FIREBASE_MESSAGING_SENDER_ID
- ✅ FIREBASE_APP_ID

## 🔄 触发部署

设置完Secrets后：
1. **提交任何更改到main分支**，或者
2. **在GitHub仓库页面，进入Actions标签，手动触发workflow**

## 🎯 测试结果

部署完成后：
1. 访问 https://yuanky123.github.io/
2. 进入Life页面
3. 尝试发送消息
4. 检查Firebase控制台是否收到新消息

## 🔍 故障排除

### 如果部署失败：
1. **检查GitHub Actions日志**：
   - 进入仓库的Actions标签
   - 点击最新的workflow运行
   - 查看详细错误信息

2. **常见问题**：
   - Secret名称拼写错误
   - Secret值包含多余的空格
   - Firebase项目配置不正确

### 如果消息发送失败：
1. **打开浏览器开发者工具**（F12）
2. **查看Console标签**的错误信息
3. **查看Network标签**的Firebase请求

## 🔒 安全注意事项

- ⚠️ **永远不要**将Firebase API密钥直接写在代码中
- ⚠️ **永远不要**将包含API密钥的文件提交到Git
- ✅ **始终使用**GitHub Secrets来管理敏感信息
- ✅ **定期检查**你的Firebase项目安全规则

## 📊 监控使用情况

设置完成后，你可以在Firebase控制台中：
- 查看实时消息数据
- 监控读写操作次数
- 查看用户活动统计

---

完成这些设置后，你的GitHub Pages网站就能真正连接到Firebase数据库了！🎉 