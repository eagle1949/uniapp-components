<template>
	<div style="height: auto; width: 100%;" @click="clickEvent" @touchstart="touchstart" @touchend="touchend">
		<slot name="content"></slot>
	</div>
</template>

<script>
	let y0 = 0; //触摸开始位置
	let distance = 100 //设定的距离差，触摸开始和结束的位置纵向差值，超过这个值，判断为上滑或下滑

	// import { initEvent } from './PSlide.js';
	// initEvent();
	export default {
		methods: {
			clickEvent() {
				this.$emit('clickEvent')
			},

			touchstart(e) {
				////console.log('touchstart:', e);
				y0 = e.changedTouches[0].clientY;
			},

			touchend(e) {
				let y1 = e.changedTouches[0].clientY;
				if (y0 - y1 > distance) {
					// this.callback('up');//上滑
					this.$emit('touchUp');
				} else if (y1 - y0 > distance) { //下滑
					// this.callback('down');
					this.$emit('touchDown');
				}
			}
		}
	}
</script>

<style>

</style>
