<!-- @format -->

<template>
    <table class="sw0416-table1">
        <tbody>
            <tr v-for="(item, index) in arrDate" :key="index">
                <td v-for="v in item" :key="v.val" @click="changeDay(v)">
                    <!-- {{v.show}} -->
                    <dl
                        v-if="v.show"
                        :class="{ on: selectDay == v.RLSJ, hideDl: v.hideDl }"
                    >
                        <dt
                            v-show="today != v.RLSJ"
                            :style="{ color: v.trClass }"
                        >
                            {{ v.val }}
                        </dt>
                        <dt
                            v-show="today == v.RLSJ"
                            :style="{ color: v.trClass }"
                        >
                            今
                        </dt>
                        <dd>
                            <!-- {{v.background}} -->
                            <view
                                v-if="v.ZS > 0"
                                class="progress"
                                :style="{ background: v.background }"
                            >
                            </view>
                            <view
                                v-if="v.ZS == 0"
                                class="progress"
                                :style="{ background: 'none' }"
                            ></view>
                            <!-- <image src="@/static/newViews/images/sw0416_char1.png" class="sw0416-char1a"></image> -->
                        </dd>
                    </dl>
                </td>
            </tr>
        </tbody>
    </table>
    <!-- </div> -->
</template>

<script>
export default {
    props: {
        month: {
            type: String,
            default: ''
        },
        statusArr: {
            type: Array,
            default: function () {
                return [];
            }
        },
        searchDay: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            selectDay: '',
            today: this.$dayjs(new Date()).format('YYYY-MM-DD'),
            cur: 1,
            timeObj: {
                year: '',
                month: '',
                day: ''
            },
            arrDate: []
        };
    },
    watch: {
        statusArr: 'renderDate',
        searchDay: 'changeSelectDay'
    },
    mounted() {
        //获取日期数组
        this.getDateArr(this.month);
    },
    methods: {
        changeSelectDay() {
            this.selectDay = this.searchDay;
        },
        // 改变日期
        changeDay(item) {
            if (!item.show) {
                return;
            }
            if (item.hideDl) {
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
        },
        getDateArr(dateStr) {
            //设置日期
            this.getNowDate(dateStr);

            //渲染日期
            this.renderDate();
        },
        renderDate() {
            // console.log('render')

            //获取这个月多少天
            let nowDayNum = this.getDayNum(this.timeObj);
            //获取前一个月多少天
            let prevMonthDayNum = this.getDayNum(
                this.getDateOther(this.timeObj, true)
            );
            //获取这个月星期几，然后往数组里面加上上个月的尾巴数字，后面加上42-这个月-上个月添加的
            let day = new Date(
                this.timeObj.year,
                this.timeObj.month,
                1
            ).getDay();
            //上个月加上天数
            this.getFullTimeArr(prevMonthDayNum, nowDayNum, day);
        },
        //上一年，下一年
        prevYear(isPrev) {
            if (isPrev) {
                this.timeObj.year = this.timeObj.year - 1;
            } else {
                this.timeObj.year = this.timeObj.year + 1;
            }
            this.renderDate();
        },
        //上个月，下个月
        prevNext(isPrev) {
            let date = this.getDateOther(this.timeObj, isPrev);
            this.timeObj.year = date.year;
            this.timeObj.month = date.month;
            this.timeObj.day = date.day;

            this.renderDate();
        },
        //getFullTimeArr  返回日历的42个数组,(上个月天数，这个月天数，星期几）
        getFullTimeArr(prevMonthDayNum, nowDayNum, day) {
            let arrDate = [];
            //处理星期天的情况
            if (day === 0) {
                day = 7;
            }
            let num = day - 1;
            let lastMonthNum = 42 - num - nowDayNum;
            //上个月数据
            while (num !== 0) {
                let obj = {
                    show: false,
                    val: prevMonthDayNum - num,
                    trClass: '#8C8A8A'
                };
                num--;
                arrDate.push(obj);
            }
            //当月天数
            for (let i = 1; i <= nowDayNum; i++) {
                //环境判断
                let obj = {
                    show: false,
                    val: i,
                    trClass: ''
                };
                if (i < 10) {
                    obj = {
                        show: false,
                        val: i,
                        trClass: ''
                    };
                }

                let statusArr = this.statusArr;
                for (let j = 0; j < statusArr.length; j++) {
                    if (i == this.$dayjs(statusArr[j].RLSJ).format('D')) {
                        let background =
                            'conic-gradient(#0839bc 0% 0%, #d9d9d9 0% 100%)';
                        let percent = 0;
                        if (statusArr[j].ZS > 0) {
                            percent =
                                (statusArr[j].YJC / statusArr[j].ZS) * 100;
                            background = `conic-gradient(#0839bc 0% ${percent}%, #d9d9d9 ${percent}% 100%)`;
                        }

                        obj = {
                            ...obj,
                            ...statusArr[j]
                        };
                        obj.background = background;
                        obj.percent = percent;
                    }
                }
                arrDate.push(obj);
            }
            //下个月天数
            for (let i = 1; i <= lastMonthNum; i++) {
                let obj = {
                    show: false,
                    val: i,
                    trClass: '#8C8A8A'
                };
                arrDate.push(obj);
            }

            //转换格式,一维数组转换为二维数组
            let newArrDate = new Array(Math.ceil(arrDate.length / 7));
            for (let i = 0; i < newArrDate.length; i++) {
                newArrDate[i] = [];
            }
            for (let j = 0; j < arrDate.length; j++) {
                newArrDate[parseInt(j / 7)][j % 7] = arrDate[j];
            }
            this.arrDate = newArrDate;
        },
        //设置日期
        getNowDate(dateStr) {
            // let date = this.$dayjs(dateStr).format('YYYY-MM-DD');
            this.timeObj = {
                year: this.$dayjs(dateStr).year(),
                month: this.$dayjs(dateStr).month(),
                day: this.$dayjs(dateStr).day()
            };
        },
        //获取一个月的时间
        getDayNum(date) {
            let dayCount = new Date(date.year, date.month + 1, 0).getDate();
            return dayCount;
        },
        //获取其他日期
        getDateOther(date, isPrev) {
            // isPrev:true:上一个月; false: 下一个月
            let year = date.year; // 获取当前日期的年份
            let month = isPrev
                ? parseInt(date.month) - 1
                : parseInt(date.month) + 1; // 前一个月
            let day = date.day; // 获取当前日期的日
            if (month === -1) {
                year = parseInt(year) - 1;
                month = 11;
            }
            if (month === 12) {
                year = parseInt(year) + 1;
                month = 0;
            }
            let days2 = new Date(year, month, 0).getDate(); // //获取上或者下个月天数
            if (day > days2) {
                day = days2;
            }
            return {
                year: year,
                month: month,
                day: day
            };
        }
    }
};
</script>

<style lang="scss" scoped>
.sw0416-table1 td {
    width: 86rpx;
}

.sw0416-table1 td dl {
    width: 86rpx;
    margin-bottom: 10rpx;
}

.progress {
    width: 16px;
    height: 16px;
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

.hideDl {
    background: none !important;
    height: 0 !important;
    overflow: hidden;
    visibility: hidden;
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
