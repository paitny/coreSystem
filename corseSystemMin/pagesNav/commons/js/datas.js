// export default {
// 	//首页列表
// 	frineds: function() {
// 		let friendarr = [{
// 				id: 1,
// 				imgurl: 'four.png',
// 				tip: 2234,
// 				name: '大海',
// 				email: 'dahai@163.com',
// 				time: new Date(),
// 				news: ' TOP 常常遇到文章标题列表布局排版时候,有的标题比较长显示不完,这个时候即又不想换行...',
// 			},
// 			{
// 				id: 2,
// 				imgurl: 'one.png',
// 				tip: 0,
// 				name: '山川',
// 				email: 'shanchuan@163.com',
// 				time: new Date(),
// 				news: '版时候,有的标题比较长显示不完,这个时候即又不想换',
// 			},
// 			{
// 				id: 3,
// 				imgurl: 'two.png',
// 				tip: 2,
// 				name: '河流',
// 				email: 'heliu@163.com',
// 				time: new Date(),
// 				news: ' 有的标题比较长显示不完,这个时',
// 			},
// 			{
// 				id: 4,
// 				imgurl: 'three.png',
// 				tip: 12,
// 				name: '溪水',
// 				email: 'xishui@163.com',
// 				time: new Date(),
// 				news: ' 到文章标题列表布局排版时候,有的标题比较长显示不完,这个时候即又不想换行...',
// 			},
// 			{
// 				id: 5,
// 				imgurl: 'four.png',
// 				tip: 2,
// 				name: '森林',
// 				email: 'senglin@163.com',
// 				time: new Date(),
// 				news: ' TOP 常常遇到文章标题列表布局排版时候,有的标题比较长显示不完,这个时候即又不想换行...',
// 			},
// 			{
// 				id: 6,
// 				imgurl: 'one.png',
// 				tip: 0,
// 				name: '湖泊',
// 				email: 'hupo@163.com',
// 				time: new Date(),
// 				news: '版时候,有的标题比较长显示不完,这个时候即又不想换',
// 			},
// 			{
// 				id: 7,
// 				imgurl: 'two.png',
// 				tip: 2,
// 				name: '冰川',
// 				email: 'bingchuan@123.com',
// 				time: new Date(),
// 				news: ' 有的标题比较长显示不完,这个时',
// 			},
// 			{
// 				id: 8,
// 				imgurl: 'three.png',
// 				tip: 12,
// 				name: '风叶',
// 				email: 'fengye@163.com',
// 				time: new Date(),
// 				news: ' 到文章标题列表布局排版时候,有的标题比较长显示不完,这个时候即又不想换行...',
// 			},
// 			{
// 				id: 9,
// 				imgurl: 'four.png',
// 				tip: 2,
// 				name: '风车',
// 				email: 'fengche@163.com',
// 				time: new Date(),
// 				news: ' TOP 常常遇到文章标题列表布局排版时候,有的标题比较长显示不完,这个时候即又不想换行...',
// 			},
// 			{
// 				id: 10,
// 				imgurl: 'one.png',
// 				tip: 0,
// 				name: '大厦',
// 				email: 'dasha@163.com',
// 				time: new Date(),
// 				news: '版时候,有的标题比较长显示不完,这个时候即又不想换',
// 			},
// 			{
// 				id: 11,
// 				imgurl: 'two.png',
// 				tip: 2,
// 				name: '木屋',
// 				email: '5434323@qq.com',
// 				time: new Date(),
// 				news: ' 有的标题比较长显示不完,这个时',
// 			},
// 			{
// 				id: 12,
// 				imgurl: 'three.png',
// 				tip: 12,
// 				name: '大海',
// 				email: '123234@qq.com',
// 				time: new Date(),
// 				news: ' 到文章标题列表布局排版时候,有的标题比较长显示不完,这个时候即又不想换行...',
// 			},

// 		];
// 		return friendarr;
// 	},
// 	//好友关系
// 	isFriend: function() {
// 		let isfriend = [{
// 				userid: 1,
// 				friend: 2,
// 			},
// 			{
// 				userid: 1,
// 				friend: 5,
// 			},
// 			{
// 				userid: 1,
// 				friend: 6,
// 			},
// 			{
// 				userid: 1,
// 				friend: 8,
// 			},
// 		];
// 		return isfriend;
// 	},

// 	//好友关系
// 	message: function() {
// 		let msgs = [{
// 				id: 'b',
// 				//用户id
// 				imgurl: 'https://wypty.cn/static/file/photo/65427d108ddedbe227bb8b8e.jpg',
// 				message: 'https://wypty.cn/static/file/photo/65427d108ddedbe227bb8b8e.jpg',
// 				types: 1,
// 				time: new Date() - 1000,
// 				tip: 0
// 			},
// 			{
// 				id: 'a', //用户
// 				imgurl: 'https://wypty.cn/static/file/photo/657a45d590d8d6b64dc0be29.jpg',
// 				message: '到文章标题列表布局排版时候,有的标题比较长显示不完,这个时候即又不想换行',
// 				types: 0,
// 				//内容类型（0文字，1图片链接，2音频链接。.
// 				time: new Date() - 1000 * 60,
// 				//发送时间
// 				tip: 1
// 			},
// 			{
// 				id: 'a',
// 				//用户id
// 				imgurl: 'https://wypty.cn/static/file/photo/657a45d590d8d6b64dc0be29.jpg',
// 				message: 'https://wypty.cn/static/file/photo/657a45d590d8d6b64dc0be29.jpg',
// 				types: 1,
// 				time: new Date() - 1000 * 55,
// 				tip: 2
// 			},
// 			{
// 				id: 'b',
// 				//用户id
// 				imgurl: 'https://wypty.cn/static/file/photo/65427d108ddedbe227bb8b8e.jpg',
// 				message: 'https://wypty.cn/static/file/photo/65427d1a8ddedbe227bb8d7d.jpg',
// 				types: 1,
// 				time: new Date() - 1000 * 16,
// 				tip: 3
// 			},
// 			{
// 				id: 'a', //用户
// 				imgurl: 'https://wypty.cn/static/file/photo/657a45d590d8d6b64dc0be29.jpg',
// 				message: '到文章标题列表布局排版时候,有的标题比较长显示不完,这个时候即又不想换行',
// 				types: 0,
// 				//内容类型（0文字，1图片链接，2音频链接。.
// 				time: new Date() - 1000 * 10,
// 				//发送时间
// 				tip: 4
// 			},
// 			{
// 				id: 'a', //用户
// 				imgurl: 'https://wypty.cn/static/file/photo/657a45d590d8d6b64dc0be29.jpg',
// 				message: '到文章标题列表布局排版时候,有的标题比较长显示不完,这个时候即又不想换行',
// 				types: 0,
// 				//内容类型（0文字，1图片链接，2音频链接。.
// 				time: new Date() - 1000 * 3,
// 				//发送时间
// 				tip: 5
// 			},
// 		];
// 		return msgs;
// 	},


// }