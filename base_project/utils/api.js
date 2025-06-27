// API配置文件
import { API_CONFIG, STORAGE_KEYS, REQUEST_TIMEOUT, DEFAULT_HEADERS } from '../config/config.js';

// 通用请求方法
const request = (options) => {
	return new Promise((resolve, reject) => {
		// 获取token
		const token = uni.getStorageSync(STORAGE_KEYS.TOKEN);
		
		// 构建请求头
		const headers = {
			...DEFAULT_HEADERS,
			...options.header
		};
		
		// 如果有token，添加到请求头
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}
		
		uni.request({
			url: API_CONFIG.BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: headers,
			timeout: REQUEST_TIMEOUT,
			success: (res) => {
				if (res.statusCode === 200) {
					resolve(res.data);
				} else {
					// 尝试从响应中获取具体的错误信息
					let errorMessage = '请求失败';
					
					if (res.data) {
						// 优先使用后端返回的错误信息
						if (res.data.message) {
							errorMessage = res.data.message;
						} else if (res.data.error) {
							errorMessage = res.data.error;
						} else if (res.data.msg) {
							errorMessage = res.data.msg;
						} else if (typeof res.data === 'string') {
							errorMessage = res.data;
						}
					}
					
					reject(new Error(errorMessage));
				}
			},
			fail: (err) => {
				reject(new Error(err.errMsg || '网络请求失败'));
			}
		});
	});
};

// 认证相关API
export const authAPI = {
	// 登录
	login: (data) => {
		return request({
			url: API_CONFIG.AUTH.LOGIN,
			method: 'POST',
			data: {
				username: data.username,
				password: data.password
			}
		});
	},
	
	// 注册
	register: (data) => {
		return request({
			url: API_CONFIG.AUTH.REGISTER,
			method: 'POST',
			data: {
				username: data.username,
				password: data.password,
				confirmPassword: data.confirmPassword
			}
		});
	},
	
	// 登出
	logout: () => {
		return request({
			url: API_CONFIG.AUTH.LOGOUT,
			method: 'POST'
		});
	}
};

// 用户相关API
export const userAPI = {
	// 获取用户信息
	getProfile: () => {
		return request({
			url: API_CONFIG.USER.PROFILE,
			method: 'GET'
		});
	},
	
	// 更新用户信息
	updateProfile: (data) => {
		return request({
			url: API_CONFIG.USER.UPDATE,
			method: 'PUT',
			data: data
		});
	}
};

export default {
	API_CONFIG,
	request,
	authAPI,
	userAPI
}; 