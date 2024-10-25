/*
 * @Author: your name
 * @Date: 2021-04-21 03:02:59
 * @LastEditTime: 2021-06-30 16:47:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /SmartFormWeb/components/zhangxu-showModal/initModal.js
 */
import Vuex from 'vuex'
export default function initModal(v) {
	// 挂在store到全局Vue原型上
	v.prototype.$modalStore = new Vuex.Store({
		state: {
			icon: '',
			type: '',
			show: false,
			title: "提示",
			content: '内容',
			showCancel: true,
			cancelText: "取消",
			cancelColor: "#000000",
			confirmText: "确定",
			confirmColor: "#3580ff",
			success: null,
		},
		mutations: {
			hideModal(state) {
				// 小程序导航条页面控制
				// #ifndef H5
				if (state.hideTabBar) {
					wx.showTabBar();
				}
				// #endif
				state.show = false
				state.type = ''
				state.icon = ''
			},
			showModal(state, data) {
				state = Object.assign(state, data)
				state.show = true
			},
			success(state, res) {
				let cb = state.success
				let resObj = {
					cancel: false,
					confirm: false
				}
				res == "confirm" ? resObj.confirm = true : resObj.cancel = true
				cb && cb(resObj)
			}
		}
	})
	// 注册$showModal到Vue原型上，以方便全局调用
	v.prototype.$showModal = function(option) {
		if (typeof option === 'object') {
			// #ifndef H5
			if (option.hideTabBar) {
				wx.hideTabBar();
			}
			// #endif

			v.prototype.$modalStore.commit('showModal', option)
		} else {
			throw "配置项必须为对象传入的值为：" + typeof option;
		}
	}
}