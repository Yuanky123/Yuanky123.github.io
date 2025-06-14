# 🚀 Deployment Guide

This document explains how to deploy your personal website to GitHub Pages.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **GitHub Pages**: Enable GitHub Pages in your repository settings
3. **Firebase Project** (Optional): For message board functionality

## 🔧 Setup Instructions

### 1. Enable GitHub Pages

1. Go to your GitHub repository
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**

### 2. Configure Firebase (Optional)

If you want the message board and danmaku system to work:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database**
3. Copy your Firebase configuration
4. Create `src/firebase.js` with your config:

```javascript
// Copy from src/firebase.example.js and replace with your values
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

### 3. Automatic Deployment

The website will automatically deploy when you:
- Push to the `main` branch
- The GitHub Action will build and deploy to `gh-pages` branch

## 🌐 Access Your Website

After deployment, your website will be available at:
```
https://yourusername.github.io/repository-name
```

For example: `https://yuanky123.github.io/Yuanky123.github.io`

## 🔒 Security Notes

- **Firebase config is excluded** from the repository for security
- **API keys are protected** by .gitignore
- The deployment uses a **placeholder Firebase config** that won't work
- To enable full functionality, you need to set up your own Firebase project

## 🛠️ Manual Deployment

If you prefer manual deployment:

```bash
# Build the project
npm run build

# Deploy to GitHub Pages (if you have gh-pages package)
npm run deploy
```

## 📝 Customization

### Domain Name (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` directory
2. Put your domain name in the file
3. Configure DNS settings with your domain provider

### Build Configuration

The build process:
- Uses **Vite** for bundling
- Outputs to `dist/` directory
- Includes all assets and optimized code
- Creates a **placeholder Firebase config** for deployment

## 🐛 Troubleshooting

### Common Issues

1. **404 Error**: Make sure GitHub Pages is enabled and source is set to "GitHub Actions"
2. **Build Fails**: Check that all dependencies are in package.json
3. **Firebase Not Working**: You need to set up your own Firebase project
4. **Assets Not Loading**: Check that paths are correct in your code

### Debug Steps

1. Check the **Actions** tab in your GitHub repository
2. Look at the build logs for any errors
3. Verify that the `gh-pages` branch was created
4. Check GitHub Pages settings

## 📞 Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Verify your Firebase configuration
3. Ensure all required files are committed
4. Check that .gitignore is not excluding necessary files

---

*Happy deploying! 🎉* 