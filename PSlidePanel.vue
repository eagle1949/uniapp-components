<template>
	<div ref="contentBox" class="content-box" @touchmove="touchmove" @touchstart="touchstart" @touchend="touchend"
		:class="{ 
			contentUp: status == 'up',
			contentDownCenter: status == 'center' && (from == 'down'||from=='init'), 
			contentUpCenter: status == 'center' && from == 'up',
			contentDown: status == 'down' 
		}" :style="{top: boxTop}">
		<slot name="content"></slot>
	</div>
</template>

<script>
	let y0 = 0; // 触摸开始位置
	let currentTop = 0; // 当前弹框的top值
	let windowHeight = 0; // 屏幕高度
	let maxTop = 0; // 弹框下滑的最大top值
	let minTop = 0; // 弹框上滑的最小top值
	let centerTop = 0; // 弹框中间位置的top值
	let distance = 10; // 设定的滑动距离阈值，超过这个值判断为滑动

	// import { initEvent } from './PSlide.js';
	// initEvent();
	export default {
		props: {
			initStatus: {
				type: String,
				default: 'center'
			}
		},
		data() {
			return {
				boxTop: 0,
				from: 'init', // 
				status: 'center' // up 上 Center 中 down 下
			}
		},
		mounted() {
			windowHeight = uni.getSystemInfoSync().windowHeight;
			this.setPositionValues();
			this.status = this.initStatus;
			this.updateTop(); // 根据初始状态设定top值
		},
		methods: {
			// 设置上下中位置的top值
			setPositionValues() {
				minTop = uni.upx2px(200); // 弹框上滑后的最小top
				centerTop = windowHeight - uni.upx2px(660); // 弹框在中间的top
				maxTop = windowHeight - uni.upx2px(280); // 弹框下滑后的最大top
				// console.log(minTop);
			},

			// 初始化时根据状态更新top值
			updateTop() {
				if (this.status === 'up') {
					currentTop = minTop;
				} else if (this.status === 'center') {
					currentTop = centerTop;
				} else if (this.status === 'down') {
					currentTop = maxTop;
				}
				this.boxTop = `${currentTop}px`;
			},

			touchstart(e) {
				y0 = e.changedTouches[0].clientY;
			},

			touchmove(e) {
				console.log(currentTop, this.status);
				const y1 = e.changedTouches[0].clientY;
				const deltaY = y1 - y0;

				// 使用 requestAnimationFrame 优化更新弹框位置
				// requestAnimationFrame(() => {
				let newTop = currentTop + deltaY;
				if (newTop < minTop) {
					newTop = minTop;
				}
				if (newTop > maxTop) {
					newTop = maxTop;
				}
				this.boxTop = `${newTop}px`;
				// });
			},

			touchend(e) {
				let y1 = e.changedTouches[0].clientY;
				if (y0 - y1 > distance) {
					this.callback('up'); //上滑
				} else if (y1 - y0 > distance) { //下滑
					this.callback('down');
				}
			},
			// 初始化可以设置几个初始化值，中高低位置，进入的时候需要动画
			// 中高低，位置可以设置只触发几个位置 TODO
			// 事件回调函数 中，高，低位置的回调函数  
			// 利用top 来定位，calc(100vh - 400rpx) 类似这样

			callback(direction) {
				this.from = this.status;

				if (direction === 'up') {
					if (this.status === 'center') {
						this.status = 'up';
					}
					if (this.status === 'down') {
						this.status = 'center';
					}
				} else if (direction === 'down') {
					if (this.status === 'center') {
						this.status = 'down';
					}
					if (this.status === 'up') {
						this.status = 'center';
					}
				}

				this.updateTop();
				this.$emit('moveEvent', this.status);

			}
		}
	}
</script>

<style>
	.content-box {
		background: white;
		width: 100vw;
		height: 95vh;
		position: fixed;
		z-index: 100;
		top: calc(100vh - 580rpx);
		transition: top 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
		will-change: top;
	}
</style>
