<template>
	<div class="_showModal" v-show="show">
		<div class="_shade"></div>
		<div class="_modalBox" @click="closeModal" @touchmove.stop.prevent="" v-if="type !== 'other'">
			<div class="_modal">
				<slot name="title">
					<div class="title" v-show="title">{{title}}</div>
				</slot>
				<slot name="content">
					<div class="content">
						{{content}}
					</div>
				</slot>
				<slot name="btn">
					<div class="btnbox">
						<div class="cancel btn" v-show="showCancel" :style="cancelColor"
							@click.stop="clickBtn('cancel')">{{cancelText}}</div>
						<div class="confirm btn" :style="confirmColor" @click.stop="clickBtn('confirm')">{{confirmText}}
						</div>
					</div>
				</slot>
			</div>
		</div>
		<div v-if="type === 'other'" class="_modalBox" @click="closeModal" @touchmove.stop.prevent="">
			<div class="_modal">
				<slot name="content">
					<div class="content" v-if="icon === 'success'">
						<image class="content-image" mode="aspectFit" :src="toastSuccessIcon" />
					</div>
					<div class="content" v-if="icon === 'error'">
						<image class="content-image" mode="aspectFit" :src="toastErrorIcon" />
					</div>
					<view class="content-name">
						{{content}}
					</view>
				</slot>
				<!-- <slot name="btn">
					<div class="btnbox">
						<div class="cancel btn" v-show="showCancel" :style="cancelColor" @click.stop="clickBtn('cancel')">{{cancelText}}</div>
						<div class="confirm btn" :style="confirmColor" @click.stop="clickBtn('confirm')">{{confirmText}}</div>
					</div>
				</slot> -->
			</div>
		</div>
	</div>
</template>

<script>
	import toastIcon from '@/common/toast-icon.js'
	export default {
		data() {
			return {
				toastSuccessIcon: toastIcon.OKICON,
				toastErrorIcon: toastIcon.NOICON

			}
		},

		computed: {
			icon() {
				return this.$modalStore.state.icon;
			},
			type() {
				return this.$modalStore.state.type;
			},
			show() {
				return this.$modalStore.state.show;
			},
			title() {
				return this.$modalStore.state.title;
			},
			content() {
				return this.$modalStore.state.content;
			},
			showCancel() {
				return this.$modalStore.state.showCancel;
			},
			cancelText() {
				return this.$modalStore.state.cancelText;
			},
			cancelColor() {
				return "color:" + this.$modalStore.state.cancelColor;
			},
			confirmText() {
				return this.$modalStore.state.confirmText;
			},
			confirmColor() {
				return "color:" + this.$modalStore.state.confirmColor;
			}
		},
		methods: {
			closeModal() {
				this.$modalStore.commit('hideModal')
			},
			clickBtn(res) {
				this.$modalStore.commit('hideModal')
				this.$modalStore.commit('success', res)
			}
		},
		beforeDestroy() {
			this.$modalStore.commit('hideModal')
		}
	};
</script>

<style lang="scss" scoped>
	._showModal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 1000000000;

		._shade {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			background: rgba(0, 0, 0, .1);
			// opacity: .4;
			z-index: 11000;
		}

		._modalBox {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 12000;
			display: flex;
			justify-content: center;
			align-items: center;

			._modal {
				flex: none;
				width: 602rpx;
				// min-height:200rpx;
				background: #fff;
				border-radius: 16rpx;

				.title {
					height: 40rpx;
					line-height: 40rpx;
					text-align: center;
					font-size: 35rpx;
					font-weight: bold;
					padding: 50rpx 0 38rpx 0;
					color: #333333;
					padding-bottom: 39rpx;

					// text-align: center;
					// font-weight: 700;
					// font-size: 35rpx;
					// color: #333333;
					// padding-top: 46rpx;
					// padding-bottom: 39rpx;
					// border-bottom: 1rpx solid #e1e1e1;
				}

				.content {
					// padding: 40rpx 30rpx;
					width: 382rpx;
					font-size: 34rpx;
					color: #000000;
					line-height: 48rpx;
					text-align: center;
					background: white;
					text-align: center;
					border-radius: 16rpx;
					margin: 0 auto;
					padding-bottom: 67rpx;



					// width: 382rpx;
					// font-weight: 400;
					// font-size: 35rpx;
					// color: #000000;
					// line-height: 1.6;
					// text-align: center;
					// margin: 0 auto;
					// padding-bottom: 39rpx;

					.content-image {
						width: 120rpx;
						height: 120rpx;
						margin: 0 auto;
					}

				}

				.content-name {
					text-align: center;
					font-weight: bold;
					font-size: 32rpx;
					padding-bottom: 32rpx;
				}

				.btnbox {
					display: flex;
					height: 101rpx;
					line-height: 101rpx;

					.btn {
						font-size: 35rpx;
						text-align: center;
						flex: auto;
						line-height: 101rpx;
						border-top: 1rpx solid #e1e1e1;
						border-right: 1rpx solid #e1e1e1;
					}

					.btn:last-child {
						border-right: none;
					}

					.cancel {}
				}
			}
		}

	}
</style>