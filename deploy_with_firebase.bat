@echo off
echo 🚀 准备部署Firebase配置到GitHub...
echo.

echo 📝 添加文件到Git...
git add .github/workflows/deploy.yml
git add setup_github_secrets.md
git add FIREBASE_SETUP_GUIDE.md
git add test_firebase_connection.js

echo.
echo 💾 提交更改...
git commit -m "Configure Firebase for GitHub Pages deployment

- Update GitHub Actions to use Firebase secrets
- Add comprehensive setup guides
- Include Firebase connection test script
- Enable real database integration for production"

echo.
echo 🌐 推送到GitHub...
git push origin main

echo.
echo ✅ 部署配置已推送到GitHub!
echo.
echo 📋 接下来的步骤:
echo 1. 访问 https://github.com/Yuanky123/Yuanky123.github.io/settings/secrets/actions
echo 2. 按照 setup_github_secrets.md 中的指南设置6个Firebase Secrets
echo 3. 等待GitHub Actions自动部署完成
echo 4. 测试 https://yuanky123.github.io/ 的留言板功能
echo.
pause 