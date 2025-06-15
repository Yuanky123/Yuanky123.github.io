# Kangyu.Space - Personal Website

A modern, interactive personal website built with React and Vite, featuring a unique "Life" page with real-time weather, music player, and danmaku (bullet comments) system.

## ✨ Features

- **Modern Design**: Clean, responsive interface with glassmorphism effects
- **Interactive Life Page**: 
  - Real-time weather data for Hong Kong
  - Background music player with multiple tracks
  - Danmaku (bullet comments) system with Firebase integration
  - Dynamic background images
  - Live clock with analog display
- **Multi-page Navigation**: Home, Publications, Projects, Papers, News, and Life pages
- **Firebase Integration**: Real-time message storage and retrieval
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project (for message board functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Yuanky123.github.io.git
   cd Yuanky123.github.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase** (Optional - for message board)
   ```bash
   # Copy the example Firebase config
   cp src/firebase.example.js src/firebase.js
   
   # Edit src/firebase.js with your Firebase project credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Firebase Setup (Required for Message Board)

The message board and danmaku system require Firebase configuration:

#### 🚨 **重要：环境变量配置问题解决**

**如果你的留言板无法连接Firebase，请按以下步骤检查：**

1. **环境变量前缀问题**：
   - Vite要求所有客户端环境变量必须以 `VITE_` 开头
   - 确保使用 `VITE_FIREBASE_API_KEY` 而不是 `FIREBASE_API_KEY`

2. **本地开发配置**：
   ```bash
   # 创建 .env 文件（不要提交到Git）
   cp .env.example .env
   
   # 编辑 .env 文件，填入你的Firebase配置：
   VITE_FIREBASE_API_KEY=your-actual-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

3. **生产环境配置（GitHub Pages）**：
   - 在GitHub仓库设置中添加以下Secrets：
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`

#### For Local Development:
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. **创建 `.env` 文件**：
   ```bash
   # 复制环境变量模板
   echo "VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id" > .env
   ```
4. 从Firebase控制台复制配置信息填入`.env`文件
5. 设置Firestore安全规则：
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /chat_messages/{document} {
         allow read, write: if true;
       }
     }
   }
   ```

#### For GitHub Pages Deployment:
1. **Set up Firebase Secrets**: Follow the detailed guide in `GITHUB_SECRETS_SETUP.md`
2. **Configure 6 GitHub Secrets**:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`

#### 🔧 Troubleshooting Firebase Connection:

**常见问题及解决方案：**

1. **环境变量未加载**：
   ```bash
   # 检查环境变量是否正确设置
   npm run dev
   # 在浏览器控制台查看是否有"Firebase配置状态"日志
   ```

2. **权限被拒绝**：
   - 检查Firestore安全规则
   - 确保允许读写 `chat_messages` 集合

3. **API密钥无效**：
   - 检查Firebase控制台中的API密钥是否正确
   - 确保项目ID匹配

4. **网络连接问题**：
   - 检查网络连接
   - 确认Firebase项目状态正常

#### Quick Deploy Scripts:
- **Windows**: Run `deploy_with_firebase.bat`
- **PowerShell**: Run `deploy_with_firebase.ps1`

#### Testing Firebase Connection:
```bash
node test_firebase_connection.js
```

📖 **Detailed Setup Guide**: See `FIREBASE_SETUP_GUIDE.md` for complete instructions.

### Customization

- **Background Images**: Add your images to `public/Life/Background/`
- **Music Files**: Add your music to `public/Life/Musics/`
- **Personal Info**: Update `src/config.js` with your information
- **Styling**: Modify styled-components in each page component

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
│   ├── Home.jsx        # Main homepage
│   ├── Life.jsx        # Interactive life page
│   ├── Projects.jsx    # Projects showcase
│   └── ...
├── services/           # Firebase and API services
├── firebase.js         # Firebase configuration (not in repo)
└── App.jsx            # Main application component

public/
├── Life/
│   ├── Background/     # Background images
│   └── Musics/        # Music files
└── ...
```

## 🎨 Key Features Explained

### Danmaku System
- Real-time bullet comments floating across the screen
- Random decorative icons (✨🌟💫 etc.)
- Firebase-powered message persistence
- Smart generation with configurable limits

### Weather Integration
- Real-time weather data for Hong Kong
- Fallback to intelligent estimation
- Multiple API sources for reliability

### Music Player
- Auto-play with random song selection
- Progress bar and controls
- Background music for ambient experience

## 🛠️ Technologies Used

- **Frontend**: React 18, Vite
- **Styling**: styled-components
- **Database**: Firebase Firestore
- **Deployment**: GitHub Pages (recommended)
- **APIs**: wttr.in (weather), OpenMeteo (backup)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).

## 📧 Contact

- **Author**: Kangyu YUAN
- **Website**: [kangyu.space](https://kangyu.space)
- **GitHub**: [@Yuanky123](https://github.com/Yuanky123)

---

*Made with ❤️ and the help of @cursor*

## 个性化配置

所有内容均在 `src/config.js` 文件中配置，包括：
- 个人信息（姓名、简介、头像路径等）
- 教育与工作经历
- 研究方向
- 新闻动态
- 论文/项目列表
- 联系方式与社交链接

**更换头像**：将你的照片放到 `public/avatar.jpg`，或在 `config.js` 里修改路径。

**添加/修改内容**：直接编辑 `config.js` 对应字段即可，保存后自动热更新。

## 主题切换

右上角有主题切换按钮，支持深色/浅色模式。

## 部署

将 `dist` 文件夹内容上传到 GitHub Pages 或任意静态服务器即可。

---

如需自定义样式，可修改 `src/index.css` 或相关组件样式文件。

## 目录结构说明

```
your-homepage/
├── public/
│   └── avatar.jpg           # 你的头像图片
├── src/
│   ├── components/          # 组件目录（Sidebar、Header等）
│   ├── pages/               # 分页内容（Home、News、Papers、Projects等）
│   ├── config.js            # 你的所有配置信息
│   ├── App.jsx              # 主应用入口
│   ├── main.jsx             # React 入口
│   └── index.css            # 全局样式
├── package.json
├── vite.config.js
└── README.md
```

---

如有问题欢迎 issue 或联系开发者。
