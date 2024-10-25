<template>
    <footer class="footer">
        <ul class="zy0828-nav">
            <li
                @click="urlChange(item.url)"
                :class="{ on: tab == item.value }"
                v-for="(item, index) in tablist"
                :key="index"
            >
                <i class="ic" :class="[item.icon]"></i>
                <p style="position: relative; z-index: 10">{{ item.label }}</p>
            </li>
        </ul>
    </footer>
</template>

<script>
export default {
    props: {
        tab: {
            type: String
        }
    },
    name: 'tabber',
    data() {
        return {
            tablist: [
                {
                    icon: 'ic1',
                    label: '首页',
                    url: '/views/index/Index',
                    value: 'index'
                },
                {
                    icon: 'ic2',
                    label: '执法',
                    url: '/views/task/index/Index',
                    value: 'task'
                },
                {
                    icon: 'ic3',
                    label: '我的',
                    url: '/views/my/Index',
                    value: 'my'
                }
            ]
        };
    },
    methods: {
        urlChange(url) {
            // console.log('url', url);
            uni.redirectTo({
                url
            });
        }
    }
};
</script>

<style>
.bigPic {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    position: absolute;
    top: -28rpx;
    background-color: white;
}

.bigPic i {
    width: 74rpx !important;
    height: 74rpx !important;
    display: inline-block;
    position: relative;
    left: 23rpx;
    top: 16rpx;
}

.hidePic {
    visibility: hidden;
}

.sw0416-menu li i {
    width: 39rpx;
    height: 39rpx;
}

.sw0416-menu li i.ic1 {
    background: url(./images/ic1.png) no-repeat center;
    background-size: contain;
}

.sw0416-menu li i.ic2 {
    background: url(./images/ic2.png) no-repeat center;
    background-size: contain;
}

.sw0416-menu li i.ic3 {
    background: url(./images/ic3.png) no-repeat center;
    background-size: contain;
}

.sw0416-menu li.on i.ic1 {
    background-image: url(./images/ic1_on.png);
}

.sw0416-menu li.on i.ic2 {
    background-image: url(./images/ic2_on.png);
}

.sw0416-menu li.on i.ic3 {
    background-image: url(./images/ic3_on.png);
}

.sw0416-menu li.on p {
    color: #000000;
}
</style>
