Write-Host "🚀 准备部署Firebase配置到GitHub..." -ForegroundColor Green
Write-Host ""

Write-Host "📝 添加文件到Git..." -ForegroundColor Yellow
git add .github/workflows/deploy.yml
git add setup_github_secrets.md
git add FIREBASE_SETUP_GUIDE.md
git add test_firebase_connection.js

Write-Host ""
Write-Host "💾 提交更改..." -ForegroundColor Yellow
git commit -m "Configure Firebase for GitHub Pages deployment

- Update GitHub Actions to use Firebase secrets
- Add comprehensive setup guides
- Include Firebase connection test script
- Enable real database integration for production"

Write-Host ""
Write-Host "🌐 推送到GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "✅ 部署配置已推送到GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 接下来的步骤:" -ForegroundColor Cyan
Write-Host "1. 访问 https://github.com/Yuanky123/Yuanky123.github.io/settings/secrets/actions" -ForegroundColor White
Write-Host "2. 按照 setup_github_secrets.md 中的指南设置6个Firebase Secrets" -ForegroundColor White
Write-Host "3. 等待GitHub Actions自动部署完成" -ForegroundColor White
Write-Host "4. 测试 https://yuanky123.github.io/ 的留言板功能" -ForegroundColor White
Write-Host ""

Read-Host "按任意键继续..." 