<template>
	<button type="button" class="p-primary-btn" style="width: 100%;">
		{{ name }}
	</button>
	<!-- <u-button :text="name" color="var(--color-primary)" style="height: 94rpx;"></u-button> -->
</template>

<script>
	export default {
		props: {
			name: {
				// 按钮名称
				type: String,
				default: '',
			},
		},
	}
</script>

<style>
	.p-primary-btn {
		height: 94rpx;
		line-height: 94rpx;
		border-radius: 46rpx !important;
		background: var(--color-primary);
		border-radius: 12rpx;
		font-size: 32rpx;
		color: #fff;
		font-weight: bold;
	}

	.p-primary-btn:hover {
		opacity: 0.8;
	}
</style>
