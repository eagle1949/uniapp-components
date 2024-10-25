<template>
	<div @click="startVoiceIn" style="
		text-align: center;
		line-height: 100rpx;
		width: 50rpx;
		height: 92rpx;
		position: absolute;
		right: 20rpx;
		bottom: -4rpx;
		z-index: 10;
	  ">
		<image v-show="!speakType" style="width: 46rpx; height: 46rpx;" src="./images/speak.png"></image>
		<image v-show="speakType" style="width: 46rpx; height: 46rpx;" src="./images/speak_on.png"></image>

		<voice-recognizer ref="recognizer" />
	</div>

</template>

<script>
	import VoiceRecognizer from 'bowo-sdk/plugins/voice-recognizer.vue'
	export default {
		components: {
			VoiceRecognizer
		},
		data() {
			return {
				recognizeText: '',
				speakType: false
			}
		},
		methods: {
			startVoiceIn() {
				this.recognizeText = '';

				this.speakType = true


				this.$refs.recognizer
					.recognizeShortcutWord()
					.then((shortcutWord) => {
						this.recognizeText = shortcutWord;

						this.$emit('speanEvent', this.recognizeText);
						this.speakType = false
					})
					.catch((error) => {
						uni.showModal({
							title: '识别出错',
							content: JSON.stringify(error, null, 4),
						})
						this.speakType = false
					})
			},
		}
	}
</script>

<style>
</style>