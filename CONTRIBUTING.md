# 贡献指南

感谢您对 Bill Tracker 项目的关注！我们欢迎各种形式的贡献。

## 如何贡献

### 报告 Bug

1. 在 [Issues](https://github.com/your-username/bill-tracker/issues) 中搜索是否已有类似问题
2. 如果没有，创建一个新的 Issue，包含：
   - 清晰的标题
   - 问题描述
   - 复现步骤
   - 期望行为 vs 实际行为
   - 环境信息（操作系统、浏览器版本、Node.js 版本等）

### 提交代码

1. Fork 本仓库
2. 创建特性分支：
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. 进行修改并测试
4. 提交更改：
   ```bash
   git commit -m "feat: add your feature description"
   ```
5. 推送到您的 Fork：
   ```bash
   git push origin feature/your-feature-name
   ```
6. 创建 Pull Request

### Commit Message 规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `style:` 代码格式（不影响功能）
- `refactor:` 重构
- `test:` 添加测试
- `chore:` 构建过程或辅助工具的变动

示例：
```
feat: 添加账单筛选功能
fix: 修复登录页面表单验证问题
docs: 更新 README 安装说明
```

### 代码风格

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则
- 保持代码简洁，避免过度抽象
- 为新功能添加测试

## 开发环境

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 运行测试：
   ```bash
   npm test
   ```

## 问题反馈

如有任何问题，请通过 Issue 反馈，我们会尽快回复。

感谢您的贡献！
