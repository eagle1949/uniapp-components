<template>
	<view>
		<swiper class="swiper" :current="current" @animationfinish="changeCurrent">
			<swiper-item v-for="item in arrDate">
				<table class="sw0416-table1">
					<tbody>
						<tr>
							<td v-for="v in item" :key="v.RLSJ" @click="changeDay(v)">
								<dl :class="{
                                        on: selectDay == v.RLSJ,
                                        hideDl: !v.show
                                    }">
									<dt v-show="today != v.RLSJ">
										{{ v.val }}
									</dt>
									<dt v-show="today == v.RLSJ">今</dt>
									<dd>
										<view v-if="v.ZS > 0" class="progress" :style="{
                                                background: v.background
                                            }">
										</view>
										<view v-if="v.ZS == 0" class="progress" :style="{ background: 'none' }"></view>
									</dd>
								</dl>
							</td>
						</tr>
					</tbody>
				</table>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
		QUERY_CALENDAR_SITUATION
	} from '@/api/task.js';
	export default {
		props: ['searchDay'],
		watch: {
			searchDay: 'changeSelectDay'
		},
		data() {
			return {
				current: 0,
				selectDay: '',
				today: this.$dayjs(new Date()).format('YYYY-MM-DD'),
				startDate: this.$dayjs(new Date())
					.add(-30, 'day')
					.format('YYYY-MM-DD'),
				endDate: this.$dayjs(new Date())
					.add(30, 'day')
					.format('YYYY-MM-DD'),
				weekStartDate: this.$dayjs(new Date())
					.startOf('week')
					.add(1, 'day')
					.format('YYYY-MM-DD'),
				weekEndDate: this.$dayjs(new Date())
					.startOf('week')
					.add(7, 'day')
					.format('YYYY-MM-DD'),
				arrDate: []
			};
		},
		mounted() {
			QUERY_CALENDAR_SITUATION({
				startTime: this.startDate,
				endTime: this.endDate
			}).then(res => {
				let arrDate = [];
				let i = 0;
				res.data_json.forEach((item, index) => {
					// if (this.$dayjs(item.RLSJ).format('MM') != this.$dayjs(new Date()).format('MM')) {
					// 	item.show = false;
					// } else {
					// 	item.show = true;
					// }

					item.show = true;

					item.val = this.$dayjs(item.RLSJ).format('D');

					let background =
						'conic-gradient(#0839bc 0% 0%, #d9d9d9 0% 100%)';
					let percent = 0;
					if (item.ZS > 0) {
						percent = (item.YJC / item.ZS) * 100;
						background = `conic-gradient(#0839bc 0% ${percent}%, #d9d9d9 ${percent}% 100%)`;
					}
					item.background = background;
					item.percent = percent;

					arrDate.push(item);
				});

				// 分组判断，前30天，后30天
				// console.log(this.$dayjs(arrDate[0].RLSJ).day())

				// console.log(new Date(arrDate[0].RLSJ))
				let day = new Date(arrDate[0].RLSJ).getDay();

				// console.log(day);
				if (day == 0) {
					for (let j = 0; j < 6; j++) {
						arrDate.unshift({
							show: false
						});
					}
				}

				if (day > 1) {
					for (let j = 0; j < day - 1; j++) {
						arrDate.unshift({
							show: false
						});
					}
				}
				let end = 7 - (arrDate.length % 7);
				if (end < 7) {
					for (let j = 0; j < end; j++) {
						arrDate.push({
							show: false
						});
					}
				}

				let newArrDate = new Array(Math.ceil(arrDate.length / 7));
				for (let i = 0; i < newArrDate.length; i++) {
					newArrDate[i] = [];
				}
				for (let j = 0; j < arrDate.length; j++) {
					newArrDate[parseInt(j / 7)][j % 7] = arrDate[j];
				}

				// console.log(newArrDate)
				newArrDate.forEach((i, id) => {
					if (i[0].RLSJ == this.weekStartDate) {
						this.current = id;
					}
				});

				// console.log(newArrDate)

				this.arrDate = newArrDate;
			});
		},
		methods: {
			changeCurrent(e) {
				if (this.current == 0 && e.detail.current == 0) {
					uni.showToast({
						icon: 'none',
						title: '仅展示最近前后30天的日程'
					});
				}
				if (
					this.current == this.arrDate.length - 1 &&
					e.detail.current == this.arrDate.length - 1
				) {
					uni.showToast({
						icon: 'none',
						title: '仅展示最近前后30天的日程'
					});
				}
				this.current = e.detail.current;
			},
			changeSelectDay() {
				this.selectDay = this.searchDay;
			},
			// 改变日期
			changeDay(item) {
				if (!item.show) {
					return;
				}

				// this.$parent.changeDay(item);
				if (item.ZS == 0) {
					uni.showToast({
						icon: 'none',
						title: '当天暂无任务！'
					});
				} else if (item.percent == 100) {
					uni.showToast({
						icon: 'none',
						title: '当天任务已完结！'
					});
					return;
				}
				this.selectDay = item.RLSJ;
				this.$emit('setTimeGetData', item.RLSJ);
			}
		}
	};
</script>

<style>
	.progress {
		width: 16px;
		height: 16px;
		/* background: #0839bc; */
		background: conic-gradient(#0839bc 0% 0%, #d9d9d9 0% 100%);
		border-radius: 50%;
		position: relative;
	}

	.progress::before {
		content: '';
		position: absolute;
		// inset: 6rpx;
		background-color: #fff;
		width: 10px;
		height: 10px;
		// text-align: center;
		// line-height: 24rpx;
		border-radius: 50%;
		top: 3px;
		left: 3px;
	}

	.swiper {
		width: 100%;
		height: 100rpx;
	}

	.hideDl {
		background: none !important;
	}
</style>

<style scoped>
	.sw0416-table1 td dl.on {
		border-color: #0839bc;
		background: #0839bc;
	}

	.sw0416-table1 td dl.on dt {
		color: #fff;
	}

	.sw0416-table1 td dl dt {
		font-family: none;
	}

	.sw0416-table1 td dl {
		background: #fff;
		border-radius: 12rpx 12rpx 12rpx 12rpx;
		border: 3rpx solid #dddddd;
		box-sizing: border-box;
		text-align: center;
	}
</style>