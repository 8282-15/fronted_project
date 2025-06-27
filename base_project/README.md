# UniApp 登录注册系统

这是一个基于 UniApp 开发的登录注册系统，集成了后端API接口。

## 功能特性

- 🔐 用户登录和注册
- 🎨 现代化的UI设计
- ✨ 粒子背景动画效果
- 📱 响应式设计，支持多端
- 🔒 表单验证
- 💾 本地存储用户信息
- 🚀 集成真实后端API

## API接口

### 登录接口
- **URL**: `http://192.168.20.144:8080/auth/login`
- **方法**: POST
- **请求体**:
```json
{
  "username": "farmer001",
  "password": "SecurePass123!"
}
```

### 注册接口
- **URL**: `http://192.168.20.144:8080/auth/register`
- **方法**: POST
- **请求体**:
```json
{
  "username": "farmer001",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

## 项目结构

```
demo3/
├── pages/
│   ├── login/
│   │   └── login.vue          # 登录注册页面
│   └── index/
│       └── index.vue          # 主页面
├── utils/
│   └── api.js                 # API配置文件
├── static/
│   └── logo.png              # 应用图标
├── manifest.json             # 应用配置
├── pages.json               # 页面配置
└── README.md               # 项目说明
```

## 开发说明

### 1. API配置
所有API接口配置都在 `utils/api.js` 文件中，包括：
- 基础URL配置
- 通用请求方法
- 认证相关API

### 2. 权限配置
在 `manifest.json` 中已配置：
- Android网络权限
- 微信小程序HTTP请求支持

### 3. 本地存储
- `token`: 存储用户登录令牌
- `username`: 存储用户名

## 使用说明

1. **登录流程**：
   - 输入用户名和密码
   - 点击登录按钮
   - 成功后自动跳转到主页

2. **注册流程**：
   - 输入用户名、密码和确认密码
   - 点击注册按钮
   - 成功后可以切换到登录模式

3. **退出登录**：
   - 在主页面点击"退出登录"按钮
   - 确认后清除本地存储并跳转到登录页

## 注意事项

- 确保后端服务器 `http://192.168.20.144:8080` 正常运行
- 在真机测试时需要确保设备能够访问后端服务器
- 微信小程序需要在开发者工具中关闭域名校验

## 技术栈

- UniApp
- Vue.js
- CSS3动画
- Canvas粒子效果

## 自定义配置

### 修改主题色彩
在`login.vue`的样式部分修改以下CSS变量：
```css
/* 主色调 */
--primary-color: #667eea;
--secondary-color: #764ba2;
```

### 调整粒子效果
在`initParticles()`方法中修改：
```javascript
const particleCount = 50; // 粒子数量
const particleSize = 3;   // 粒子大小
```

### 修改动画速度
在CSS中调整动画持续时间：
```css
animation: fadeInUp 1s ease-out 0.3s both; /* 1s为动画时长 */
```

## 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ 移动端浏览器

## 性能优化

- 使用`requestAnimationFrame`优化动画性能
- 限制粒子数量避免性能问题
- 使用CSS3硬件加速
- 优化图片和资源加载

## 注意事项

1. 粒子动画在低端设备上可能需要调整参数
2. 社交登录功能目前仅为UI展示，需要集成相应的SDK
3. 表单验证规则可根据实际需求调整
4. 建议在生产环境中添加更多的安全验证

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 实现基础登录注册功能
- 添加粒子背景动画
- 完成响应式设计

## 许可证

MIT License 