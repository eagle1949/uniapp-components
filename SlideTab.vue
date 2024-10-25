<template>
	<div style="position: absolute; height: 300rpx; width: 100vw; bottom: 220rpx;" class="contentRegion">
		<view class="leftRegion" @click="changeDoneType">
			<p class="leftTxt">已完成</p>
			<i class="arrow-icon" :class="{isDoneArr: isDone}"></i>
		</view>
		<scroll-view :scrollLeft="scrollLeft" :scroll-with-animation="true"
			style="height:320rpx; width: calc(100vw - 57rpx);" scroll-x="true" @touchstart="onTouchStart"
			@touchend="onTouchEnd">
			<ul class="sw0828-ulbx2" style="bottom: auto; overflow-x: hidden;"
				:style="{width: pointData.length*540 + 'rpx'}">
				<li v-for="(item,index) in pointData" style="position: relative;"
					:class="{swFirst: index == 0,doneType:item.SFYJC, slideOn: index==pointSelectIndex, slideNoOn: index!=pointSelectIndex, doneList: isDone}"
					@longpress="longpressEvent(item)" @click="showDetail(item)">

					<image :src="getImgSrc(item)" class="imageBox" style="width: 65rpx;height: 65rpx;"></image>

					<h1>{{item.BH}}</h1>
					<h1 class="ov-box">{{item.MC}}</h1>

					<p class="dot">
						{{item.KJXT?item.KJXT+ ' ' + '&nbsp;': ''}}
						{{item.YSLX?item.YSLX+ ' '+ '&nbsp;': ''}}
						{{item.CLGY?item.CLGY+ ' '+ '&nbsp;': ''}}

						<span v-show="item.ZJJCQK != '1'" style="color: #52c47c;">{{item.ZJJCQKMC}}</span>
						<span v-show="item.ZJJCQK == '1'" style="color: #e72e32;">{{item.ZJJCQKMC}}</span>
					</p>
					<!-- <p class="dot">直烟囱 采样平台 爬楼上</p> -->
					<div class="gap20"></div>
					<p></p>
					<div class="gap20"></div>
					<div class="flx1 ac jb" style="position: absolute;bottom: 20rpx; left: 20rpx; right: 20rpx;">
						<p style="color: #a3a3a3">
							距离:{{ getDistanceItem(item).distance }}{{ getDistanceItem(item).unit }}
						</p>
						<div class="flx1 ac">
							<image v-show="item.SFMD == '1'" src="./images/point.png" class="sw0828-tolic"></image>
							<!-- <image src="@/static/views08/images/sw0828_ic2a.png" class="sw0828-tolic"></image> -->
							<image v-show="item.SFZX == '1'" src="@/static/views08/images/sw0828_ic3a.png"
								class="sw0828-tolic"></image>
						</div>
					</div>
				</li>
			</ul>
		</scroll-view>
	</div>
</template>

<script>
	import p1 from '@/static/views/images/zy0102_img6.png';
	import p2 from '@/static/views/images/zy0102_img7.png';


	export default {
		props: ['listData', 'pointListData'],
		data() {
			return {
				isDone: false, // 是否已完成
				pointData: [],
				windowWidth: 0,
				itemWidth: 0,
				scrollDebounceTimer: null, // 用于存储定时器的变量  
				scrollLeft: 0,
				p1,
				p2,
				startX: 0, // 触摸开始时的X坐标  
				endX: 0, // 触摸结束时的X坐标 
				pointSelectIndex: 0, // 选中下标
				selectPoint: null,
			}
		},
		watch: {
			listData: 'changePointData',
			pointListData: 'changePointListData'
		},
		mounted() {
			let self = this;
			uni.getSystemInfo({
				success: function(res) {
					self.windowWidth = res.screenWidth; // 屏幕宽度 
					self.itemWidth = res.screenWidth * 0.715;
					// console.log(self.itemWidth);
				}
			});

			this.changePointData();

		},
		methods: {
			changeDoneType() {
				this.isDone = !this.isDone;
				// console.log(this.isDone);
				this.changePointData();
			},

			getImgSrc(item) {
				try {
					return require(`@/static/mapIcon/images/info/${item.MPBS}.png`)
				} catch (e) {
					return ''
				}
			},

			// 长按导航
			longpressEvent(item) {
				// console.log(item, '长按功能');
				this.$emit('goToHere', item)
			},

			getDistanceItem(item) {

				let reItem = {
					MC: '',
					BH: '',
					distance: '-',
					unit: '米'
				};


				if (item.gisDistance) {
					if (item.gisDistance > 1000) {
						reItem.distance = parseInt(item.gisDistance / 1000);
						reItem.unit = '公里';
					} else {
						reItem.distance = parseInt(item.gisDistance);
						reItem.unit = '米';
					}
				}

				if (item.gisDistance == 0) {
					reItem.distance = 0;
				}

				return reItem;

			},


			changePointData() {
				// this.listData = listData;
				let pointData = JSON.parse(JSON.stringify(this.listData));
				let newArr = [];
				pointData.forEach(item => {
					if (item.SFYJC == this.isDone) {
						newArr.push(item);
					}
				});
				this.pointData = newArr;

				if (this.pointData.length > 0) {
					this.selectPoint = this.pointData[0];
					this.changeSelectPoint();
					this.renderPoint();
				}
			},

			// 触摸开始时记录坐标  
			onTouchStart(e) {
				this.startX = e.touches[0].clientX;
			},
			// 触摸结束时计算滑动方向和距离  
			onTouchEnd(e) {
				this.endX = e.changedTouches[0].clientX;
				const distanceX = this.endX - this.startX; // 计算X轴上的滑动距离  
				let self = this;
				// 判断滑动方向  
				if (distanceX < 0) {
					if (distanceX < -25) {
						// 向左滑动
						this.handleSwipeLeft();
					} else {
						self.$nextTick(() => {
							self.scrollLeft = self.pointSelectIndex * self.itemWidth;
						}, 200)
					}
				}

				if (distanceX > 0) {
					if (distanceX > 25) {
						// 向右滑动
						this.handleSwipeRight();
					} else {
						self.$nextTick(() => {
							self.scrollLeft = self.pointSelectIndex * self.itemWidth;
						}, 200)
					}
				}
			},

			// 处理左滑逻辑  
			handleSwipeLeft() {
				// 在这里编写处理左滑事件的逻辑  
				if (this.pointSelectIndex < this.pointData.length - 1) {
					// 如果这个不是原来数组，那么重置条件
					// if (this.pointSelectIndex == 0 && this.selectPoint.XH != this.listData[0].XH) {
					// 	this.changePointData();
					// 	return;
					// }

					this.pointSelectIndex++;

					this.selectPoint = this.pointData[this.pointSelectIndex];

					if (this.selectPoint.SFYGH && this.selectPoint.DWSJ.length == 0) {
						uni.showToast({
							title: "暂无点位数据",
							icon: "none",
							duration: 2000
						})
					}

					this.renderPoint();
				}
				setTimeout(() => {
					this.scrollLeft = this.pointSelectIndex * this.itemWidth;
				}, 200)
			},
			// 处理右滑逻辑  
			handleSwipeRight() {
				// 在这里编写处理右滑事件的逻辑    
				if (this.pointSelectIndex >= 1) {
					this.pointSelectIndex--;
					this.selectPoint = this.pointData[this.pointSelectIndex];

					if (this.selectPoint.SFYGH && this.selectPoint.DWSJ.length == 0) {
						uni.showToast({
							title: "暂无点位数据",
							icon: "none",
							duration: 2000
						})
					}


					this.renderPoint();
				}
				setTimeout(() => {
					this.scrollLeft = this.pointSelectIndex * this.itemWidth;
				}, 200)
			},

			// 改变距离
			changeDistance(it) {
				this.pointData.forEach((item, index) => {
					if (item.MBBH_XH == it.MBBH_XH) {
						item.gisDistance = it.gisDistance;
					}
				})
			},

			// 提示预警
			changePointListData() {
				// console.log(this.listData);
				this.pointListData.forEach(it => {
					it.JDSJ.forEach(item => {
						this.pointData.forEach((item1, index) => {
							if (item1.MBBH_XH == item.MBBH_XH) {
								item1.SFYJC = item.SFYJC;
								item1.ZJJCQK = item.ZJJCQK;
								item1.ZJJCQKMC = item.ZJJCQKMC;
							}
						})

						this.listData.forEach((item1, index) => {
							if (item1.MBBH_XH == item.MBBH_XH) {
								item1.SFYJC = item.SFYJC;
								item1.ZJJCQK = item.ZJJCQK;
								item1.ZJJCQKMC = item.ZJJCQKMC;
							}
						})
					})
				})

				this.changePointData();
			},

			changeSelectPoint() {
				let hasItem = false;
				this.pointData.forEach((item, index) => {
					if (item.MBBH_XH == this.selectPoint.MBBH_XH) {
						hasItem = true;
						this.pointSelectIndex = index;
						this.scrollLeft = this.pointSelectIndex * this.itemWidth;
					}
				})
				// 没有的时候，默认最前面加一条数据
				if (!hasItem) {
					this.pointData = JSON.parse(JSON.stringify(this.listData));
					this.pointData.unshift(this.selectPoint);
					this.changeSelectPoint();
				}
			},

			changeSelectItem(item) {
				this.pointData.forEach(i => {
					if (item.MBBH_XH == i.MBBH_XH) {
						i.SFYGH = true;
					}
				})
			},

			showDetail(item) {
				// console.log(item);
				this.$emit('goCompanyDetail', item);
			},
			renderPoint() {
				this.$emit('dealPointSelect', this.selectPoint);
			}
		}
	}
</script>

<style>
	.contentRegion {
		display: flex;

	}

	.leftRegion {
		width: 57rpx;
		height: 300rpx;
		background: #FFFFFF;
		border-radius: 0px 15rpx 15rpx 0px;
		border: 2rpx solid #E5E5E5;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.leftTxt {
		width: 27rpx;
		height: 90rpx;
		font-family: OPPOSans, OPPOSans;
		font-weight: 400;
		font-size: 27rpx;
		color: #3D3D3D;
		line-height: 29rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
		margin-bottom: 10rpx;
	}


	.swiper-slide {
		width: 650rpx;
		display: inline-block;
		float: left;
		margin-left: 25rpx;
	}

	.img {
		width: 100%;
		height: 100%;
	}

	.swFirst {
		/* margin-left: 50rpx; */
	}

	.sw0828-ulbx2 li {}

	.ov-box {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.sw0828-ulbx2 li h1 {
		width: 80%;
	}

	.imageBox {
		position: absolute;
		top: 31rpx;
		right: 31rpx;
	}


	.doneType {
		border: 4rpx solid #52C47C;
	}

	.slideOn {
		border: 4rpx solid #0046D1;
		background: #F1F6FF;
		/* transition: height 0.2s ease; */
	}

	.slideNoOn {
		height: 265rpx;
		/* transition: height 0.2s ease; */
		position: relative;
		top: 16rpx;
	}

	.doneList {
		border: 4rpx solid #52C47C;
	}


	.arrow-icon {
		width: 29rpx;
		height: 29rpx;
		display: block;
		background: url(./images/arrow.png) no-repeat;
		background-size: 100% 100%;
	}

	.isDoneArr {
		transform: rotateY(180deg);
	}
</style>