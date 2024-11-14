<template>
	<view class="container">
		<view class="frame">
			<text style="color: #E6E6E6">—&nbsp;&nbsp;</text><text>学生机构报名</text><text
				style="color: #E6E6E6;">&nbsp;&nbsp;—</text>
		</view>
		<view class="content">
			<view class="cont">
				<text style="float: left; color: red;margin-top: 25rpx;">&nbsp;*&nbsp;</text><text
					style="float: left;font-size: 30rpx; margin-top: 25rpx;margin-bottom: 25rpx;">姓名</text>
				<input class="box" type="text" style="font-size: 30rpx;padding-left: 15rpx; color: gray;"
					placeholder="请输入姓名" v-model="inputname" />
				<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
					style="float: left;font-size: 30rpx; margin-top: 20rpx;">性别</text>
				<picker @change="onPickerChangeSex" mode="selector" :range="sexarray">
					<view class="box" style="font-size: 30rpx;color: gray; line-height: 90rpx; padding-left: 15rpx;">
						{{inputsex}}
					</view>
				</picker>
				<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
					style="float: left;font-size: 30rpx; margin-top: 20rpx;">学号</text>
				<input class="box" type="number" style="font-size: 30rpx;padding-left: 15rpx; color: gray;"
					placeholder="请输入学号" v-model="inputnum" />
				<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
					style="float: left;font-size: 30rpx;margin-top: 20rpx; ">年级</text>
				<picker @change="onPickerChange" mode="selector" :range="gradearray">
					<view class="box" style="font-size: 30rpx;color: gray; line-height: 90rpx; padding-left: 15rpx;">
						{{gradevalue}}
					</view>
				</picker>
				<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
					style="float: left;font-size: 30rpx; margin-top: 20rpx;">班级</text>
				<input class="box" type="text" style="font-size: 30rpx;padding-left: 15rpx; color: gray;"
					placeholder="请输入班级 例如:物联网工程1班" v-model="inputclass" />
				<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
					style="float: left;font-size: 30rpx;margin-top: 20rpx; ">手机号码</text>
				<input class="box" type="number" style="font-size: 30rpx;padding-left: 15rpx; color: gray;"
					placeholder="请输入手机号码" v-model="inputphone" />
					<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
						style="float: left;font-size: 30rpx;margin-top: 20rpx; ">学生机构</text>
					<picker @change="onPickerChangeIn" mode="selector" :range="organizationArray">
						<view class="box" style="font-size: 30rpx;color: gray; line-height: 90rpx; padding-left: 15rpx;">
							{{organizationValue}}
						</view>
					</picker>
					<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
						style="float: left;font-size: 30rpx;margin-top: 20rpx; ">部门</text>
					<picker @change="onDepartmentPickerChange" mode="selector" :range="departmentArray"
						@click="handDempartment">
						<view class="box" style="font-size: 30rpx;color: gray; line-height: 90rpx; padding-left: 15rpx;">
							{{departmentValue}}
						</view>
					</picker>
				<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
					style="float: left;font-size: 30rpx;margin-top: 20rpx; ">辅导员</text>
				<input class="box" type="text" style="font-size: 30rpx;padding-left: 15rpx; color: gray;"
					placeholder="请输入辅导员" v-model="inputteachar" />
				
				<button class="submit" @click="handsubmit">确认提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inputname: '',
				inputnum: '',
				inputsex: '请选择',
				inputclass: '',
				inputphone: '',
				inputteachar: '',
				gradearray: ['2021级', '2022级', '2023级', '2024级'],
				gradevalue: '请选择',
				activityId: "",
				sexarray:['男','女'],
				// 省略其他数据
				organizationArray: ['学生分会', '分团委', '校友分会', '学生公寓自我管理委员会分会', '分团委学生社团管理部'], // 第一个选择框的选项数组
				organizationValue: '请选择',
				departments: {
					'学生分会': ['体育部', '学习部', '生活权益部', '秘书处', '辩论队', '文艺部', '对外联络部', '青年志愿者服务中心'],
					'分团委': ['技术部', '组织部', '技术部', '记者团'],
					'校友分会': ['联络部', '秘书处', '宣传部'],
					'学生公寓自我管理委员会分会': ['楼管部', '外联部', '宣传部', '办公室'],
					'分团委学生社团管理部': ['监察部', '宣传部', '办公室']
				},
				departmentArray: [], // 第二个选择框的选项数组
				departmentValue: '请选择', // 第二个选择框的值
			}
		},
		onLoad(option) {
			this.organizationValue = option.institution || '请选择'
			this.departmentValue = option.department || '请选择'
			this.updateDepartmentOptions(option.institution)
		},
		methods: {
			// 省略其他方法
			onPickerChangeIn(e) {
				this.organizationValue = this.organizationArray[e.detail.value];
				// 根据第一个选择框的值动态更新第二个选择框的选项
				this.updateDepartmentOptions(this.organizationValue);
			},
			onPickerChangeSex(e){
				this.inputsex = this.sexarray[e.detail.value];
			},
			handDempartment() {
				if (this.organizationValue === '请选择') {
					return uni.showToast({
						icon: 'none',
						title: '请先选择机构'
					})
				}
			},
			updateDepartmentOptions(organization) {
				// 根据第一个选择框的值设置第二个选择框的选项
				// 你需要根据实际需求设置departments对象中其他机构的部门选项
				this.departmentArray = this.departments[organization] || [];
				// 默认选择第一个选项
				this.departmentValue = this.departmentArray.length > 0 && this.departmentArray.includes(this
						.departmentValue) ?
					this.departmentValue || '请选择' :
					this.departmentArray[0] || '请选择';
			},
			onDepartmentPickerChange(e) {
				this.departmentValue = this.departmentArray[e.detail.value];
			},
			onPickerChange(e) {
				this.gradevalue = this.gradearray[e.detail.value];
			},
			handsubmit() {
				if (this.inputname.trim() == '') {
					return uni.showToast({
						title: '姓名不能为空',
						icon: 'none'
					})
				} else if (this.inputsex.trim() == '') {
					return uni.showToast({
						title: '性别不能为空',
						icon: 'none'
					})
				} else if (this.inputnum.trim() == '') {
					return uni.showToast({
						title: '学号不能为空',
						icon: 'none'
					})
				} else if (this.gradevalue.trim() == '请选择') {
					return uni.showToast({
						title: '年级不能为空',
						icon: 'none'
					})
				} else if (this.inputclass.trim() == '') {
					return uni.showToast({
						title: '班级不能为空',
						icon: 'none'
					})
				} else if (this.inputphone.trim() == '') {
					return uni.showToast({
						title: '手机号码不能为空',
						icon: 'none'
					})
				} else if (this.inputteachar.trim() == '') {
					return uni.showToast({
						title: '辅导员不能为空',
						icon: 'none'
					})
				} else if (this.organizationValue.trim() == '请选择') {
					return uni.showToast({
						title: '未选择机构',
						icon: 'none'
					})
				} else if (this.departmentValue.trim() == '请选择') {
					return uni.showToast({
						title: '未选择部门',
						icon: 'none'
					})
				}

				uni.$http.post("/api/ApplicationOrg/application", {
					name: this.inputname,
					sex: this.inputsex,
					ID: this.inputnum,
					grade: this.gradevalue,
					classes: this.inputclass,
					phoneNumber: this.inputphone,
					counsellor: this.inputteachar,
					organizationValue: this.organizationValue,
					departmentValue: this.departmentValue
				}).then((res) => {
					uni.showToast({
						icon: "none",
						title: res.data.msg
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		height: 2000rpx;
		width: 100%;

		.frame {
			height: 100rpx;
			width: 100%;
			background-color: white;
			font-size: 33rpx;
			line-height: 95rpx;
			text-align: center;
		}

		.content {
			margin-top: 5rpx;
			height: 2000rpx;
			width: 100%;
			background-color: white;

			.cont {
				height: 100%;
				width: 90%;
				margin: 0 auto;

				.box {
					margin-top: 83rpx;
					height: 95rpx;
					width: 100%;
					background-color: #E6E6E6;
				}

				.submit {
					height: 80rpx;
					width: 100%;
					margin-top: 50rpx;
					background-color: #4d6398;
					line-height: 75rpx;
					color: white;
					font-size: 32rpx;
					border-radius: 50rpx;
				}
			}
		}
	}
</style>