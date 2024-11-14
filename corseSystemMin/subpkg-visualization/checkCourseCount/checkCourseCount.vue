<template>
    <checkCourseCountLoad v-if="showload"></checkCourseCountLoad>
    <view class="ranking-page" v-else>
        <view class="ranking-header">
            <text class="ranking-title">第{{currentWeek}}周班级查课统计</text>
            <view class="search-box">
                <input 
                    v-model="searchQuery" 
                    class="search-input" 
                    placeholder="搜索辅导员/年级/班级/层次" 
                    @input="filterStudents"
                />
            </view>
        </view>

        <transition-group name="fade" tag="view" class="ranking-list">
            <view class="ranking-item" v-for="(student, index) in filteredStudents" :key="student._id" @click="toCheckCoursePage(student.grade,student.class,student.level)">
                <view class="ranking-number" :style="getNumberStyle(index)">
                    {{ index + 1 }}
                </view>
                <image class="ranking-avatar" src="https://wypty.cn/static/file/material/logo.png" />
                <view class="ranking-info">
                    <text class="ranking-nickname">辅导员: {{ student.counsellor }}&nbsp;</text><br>
                    <text class="ranking-details">年级: {{ student.grade }}</text><br>
                    <text class="ranking-details">班级: {{ student.class }}</text><br>
                    <text class="ranking-details">层次: {{ student.level }}</text>
                </view>
                <view class="ranking-activity-count">{{ student.checkCount }} 次</view>
            </view>
        </transition-group>
    </view>
</template>

<script>
import checkCourseCountLoad from '../../components/checkCourse-skeleton/checkCourse-skeleton.vue'

export default {
    data() {
        return {
            showload: true,
            baseURL: '',
            currentWeek: '',
            students: [],
            filteredStudents: [],
            searchQuery: '',
        };
    },
    onLoad(options) {
        this.currentWeek = options.week;
        this.baseURL = uni.baseURL;
        this.getRanking();
    },
    components: {
        checkCourseCountLoad
    },
    methods: {
        async getRanking() {
            try {
                const res = await uni.$http.get("/api/aiCourse/class-checks", {
                    week: this.currentWeek
                });
                if (res.errMsg == "request:ok") {
                   
                    this.students = res.data;
                    this.filteredStudents = res.data; // 初始显示所有学生

                    setTimeout(() => {
                        this.showload = false;
                    }, 1000);
                }
            } catch (error) {
                console.error("获取排名数据失败:", error);
            }
        },
        filterStudents() {
            const query = this.searchQuery.toLowerCase();
            this.filteredStudents = this.students.filter(student => {
                return (
                    student.counsellor.toLowerCase().includes(query) ||
                    student.grade.toLowerCase().includes(query) ||
                    student.class.toLowerCase().includes(query) ||
                    student.level.toLowerCase().includes(query)
					
                );
            });
        },
		toCheckCoursePage(grade,className,level){
			uni.navigateTo({
			    url: `../../myServices/checkCourse/checkCourse?grade=${grade}&className=${className}&level=${level}`
			});

		},
        getNumberStyle(index) {
            let backgroundColor = '#f0f0f0'; // 默认灰色
            let color = '#333'; // 默认文字颜色

            switch (index) {
                case 0:
                    backgroundColor = '#ffd700'; // 金色
                    color = '#fff'; // 白色文字
                    break;
                case 1:
                    backgroundColor = '#c0c0c0'; // 银色
                    color = '#000'; // 黑色文字
                    break;
                case 2:
                    backgroundColor = '#cd7f32'; // 铜色
                    color = '#fff'; // 白色文字
                    break;
            }

            return {
                backgroundColor: backgroundColor,
                color: color
            };
        }
    },
    mounted() {
        this.getRanking();
    },
    beforeDestroy() {
        clearInterval(this.interval);
        this.stopSlider();
    }
};
</script>

<style scoped>
.ranking-page {
    padding: 20rpx;
}

.ranking-header {
    text-align: center;
    margin-bottom: 20rpx;
}

.ranking-title {
    font-size: 40rpx;
    font-weight: bold;
}

.loading {
    text-align: center;
    font-size: 36rpx;
    padding: 20rpx;
}



.search-box {
		display: flex;
		padding: 10rpx;
		background-color: #fff;
		z-index: 999;
		margin-top: 10rpx;
		}

		.search-input {
			flex: 1;
			height: 60rpx;
			border: 1px solid #ccc;
			border-radius: 30rpx;
			padding: 0 20rpx;
			margin-right: 10rpx;
		}

.ranking-slider {
    position: relative;
    transition: top 2s ease-in-out;
}

.ranking-item {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    padding: 20rpx;
    border-radius: 20rpx;
    background-color: #ffffff;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
}

.ranking-number {
    width: 80rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    font-size: 36rpx;
    font-weight: bold;
    border-radius: 50%;
}

.ranking-avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    margin-left: 20rpx;
}

.ranking-info {
    flex: 1;
    margin-left: 20rpx;
}

.ranking-nickname {
    font-size: 36rpx;
    font-weight: bold;
}

.ranking-details {
    font-size: 28rpx;
    color: #888;
}

.ranking-activity-count {
    font-size: 36rpx;
    font-weight: bold;
    margin-left: 20rpx;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 1.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
