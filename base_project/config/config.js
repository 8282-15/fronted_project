// 环境配置
const ENV = {
	// 开发环境
	development: {
		API_BASE_URL: 'http://192.168.20.144:8080',
		DEBUG: true
	},
	// 生产环境
	production: {
		API_BASE_URL: 'http://192.168.20.144:8080',
		DEBUG: false
	}
};

// 当前环境
const currentEnv = process.env.NODE_ENV || 'development';

// 导出当前环境配置
export const config = ENV[currentEnv];

// API接口配置
export const API_CONFIG = {
	// 基础URL
	BASE_URL: config.API_BASE_URL,
	
	// 认证相关接口
	AUTH: {
		LOGIN: '/auth/login',
		REGISTER: '/auth/register',
		LOGOUT: '/auth/logout'
	},
	
	// 用户相关接口
	USER: {
		PROFILE: '/user/profile',
		UPDATE: '/user/update'
	}
};

// 本地存储键名
export const STORAGE_KEYS = {
	TOKEN: 'token',
	USERNAME: 'username',
	USER_INFO: 'userInfo',
	REMEMBER_ME: 'rememberMe'
};

// 请求超时时间
export const REQUEST_TIMEOUT = 10000;

// 默认请求头
export const DEFAULT_HEADERS = {
	'Content-Type': 'application/json'
};

export default {
	config,
	API_CONFIG,
	STORAGE_KEYS,
	REQUEST_TIMEOUT,
	DEFAULT_HEADERS
}; 