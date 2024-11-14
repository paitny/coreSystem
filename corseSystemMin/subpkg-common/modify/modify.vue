<template>
    <view class="userinfo">
        <view class="form">
            <button class="avatar-wrap"   @click="uploadImage">
                <view class="label"> 头像 </view>
                <view class="ipt">
                   <view class="img" :style="{
                     backgroundImage: `url(${getImageUrl(userInfo.photo)})`
                   }" >
                   
                   						</view>
                    <uni-icons class="arrow-right" type="right" size="20"></uni-icons>
                </view>
            </button>
        </view>
       
        <view class="info_nickname">
            <view class="nickname_left">昵称</view>
            <view class="nickname_right">
                <input class="uni-input" placeholder="请输入您的昵称" @input="onName" v-model="nickName" maxlength="10" />
				
            </view>
			<uni-icons class="arrow-right" type="right" size="20"></uni-icons>
        </view>
       
        <view class="info_nickname">
            <view class="nickname_left"> 手机号 </view>
            <view class="nickname_right">
              <input type="text" v-model="phone" >
			 
            </view>
			 <uni-icons class="arrow-right" type="right" size="20"></uni-icons>
        </view>
       
    </view>
	<view class="btn-wrap">
	    <button type="primary" class="btn" @click="saveinfo">修改</button>
	</view>
</template>
 
<script>

 import {
 	mapState,
 	mapMutations
 } from "vuex"
export default {
    data() {
        return {
			baseURL:'',
            photo: '',
            user: '',
            nickName: '',
            phone: '',
            number: 2,
            flag: false,
			random:''
        }
    },
	computed: {
		...mapState(['userInfo'])
	},
    onLoad() {
		this.baseURL = uni.baseURL 
		this.getUserInfo()
    },
	watch: {
		userInfo() {
			this.random = `?_=${Date.now()}`
		}
	},
    methods: {
		getImageUrl(imgurl) {
			// 使用当前时间戳来确保每次都是不同的URL
			return this.baseURL+imgurl+ '?timestamp=' + Date.now();
		},
		saveinfo(){
			uni.$http.post('/api/modify/userInfo',{id:this.userInfo._id,nickName:this.nickName,phone:this.phone})
			
			uni.showToast({
				title: "修改成功",
				icon: 'success',
				duration: 800
			})
		},
	  getUserInfo(){
		  uni.$http.get('/api/get/userId',{id:this.userInfo._id}).then((res)=>{
		  	this.photo=this.getImageUrl(res.data.data.photo)
		  	this.nickName=res.data.data.nickName
		  	this.phone=res.data.data.phone
		  })
	  },
	 uploadImage() {
	     uni.chooseImage({
	     	success: (chooseImageRes) => {
	     		const tempFilePaths = chooseImageRes.tempFilePaths;
	     		uni.uploadFile({
	     			url: 'https://wypty.cn/api/modify/photo', //仅为示例，非真实的接口地址
	     			filePath: tempFilePaths[0],
	     			name: 'file',
					header:{
						'content-type': 'multipart/form-data',
						authorization:"Bearer "+uni.getStorageSync('token'),
						id:uni.getStorageSync('userInfo')._id
					},
	     			success: (res) => {
						
						this.photo=''
						this.photo=data
						this.userInfo.photo=data.data
                        let _userInfo = uni.getStorageSync('userInfo');
                        _userInfo.photo = data.data;
                        uni.setStorageSync('userInfo',_userInfo);
						this.getUserInfo()

	     			}
	     		});
	     	}
	     });

	    }
	 

       
        }
    }

</script>
 
<style lang="scss">
button::after {
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;
}
.userinfo {
    font-size: 34rpx;
    font-weight: 400;
    color: #333333;
    height: 100%;
    position: relative;
    .form {
        background-color: #ffffff;
    }
    .avatar-wrap {
        border: 0;
        background-color: #ffffff;
        height: 158rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 32rpx;
        .avatar {
			width: 80rpx;
			height: 80rpx;
            margin-right: 10rpx;
        }
        .ipt {
            display: flex;
            align-items: center;
        }
        .img {
            width: 118rpx;
            height: 118rpx;
			background-size: 100% 100%;
			background-repeat: no-repeat;
        }
    }
 
    .info_nickname {
        border-bottom: 1px solid #e9e9e9;
        height: 112rpx;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 32rpx;
        // justify-content: space-between;
 
        .nickname_left {
        }
 
        .nickname_right {
            input {
                text-align: right;
            }
        }
        .gender {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
   
}
 .btn-wrap {
       margin-top: 20%;
        width: 100%;
        text-align: center;
        .btn {
            width: 690rpx;
            height: 88rpx;
        }
    }
</style>