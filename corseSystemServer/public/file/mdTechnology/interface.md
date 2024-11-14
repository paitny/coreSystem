目录

[TOC]



---

# 0、文档说明

**文档说明**：

1. 所有接口前缀基于：https://wypty.cn
2.  数据库基于mongoose
3. 返回的数据均为json格式

# 1、首页导航栏接口

###### 接口功能
> 获取小程序首页导航栏

###### URL
> /api/route/minNav

###### 支持格式
> JSON

###### HTTP请求方式
> GET

###### 请求参数
> | 参数 | 必选 | 类型 | 说明 |
> | :--- | :--- | :--- | ---- |
> | 无   | 无   | 无   | 无   |

###### 返回字段
> | 返回字段 | 字段类型 | 说明       |
> | :------- | :------- | :--------- |
> | id       | number   | 唯一标识id |
> | title    | string   | 导航栏标题 |
> | img      | string   | 导航栏logo |

###### 接口示例
``` javascript
[
  {
    "id": 1,
    "title": "信工",
    "img": "/file/minNav/01.png"

  },
  {
    "id": 2,
    "title": "志愿者",
    "img": "/file/minNav/02.png"

  },
  ......
]

```

# 2、文章类接口

###### 接口功能

> 获取文章类型接口

###### URL

> 所有文章：/api/get/newsAll，
>
> 文章分类：/api/get/itNews/class
>
> 浏览量最高的六篇文章：/api/get/newsLimit
>
> 通过id请求对应的文章：/api/get/newsId

###### 支持格式

> JSON

###### HTTP请求方式

> GET

###### 请求参数

> | 参数     | 必选 | 类型   | 说明                                                 |
> | :------- | :--- | :----- | ---------------------------------------------------- |
> | newClass | true | String | 文章分类接口(信工资讯、信工活动，体育活动、最新活动) |
> | id       | true | String | 通过id请求对应的文章                                 |

###### 返回字段

> | 返回字段 | 字段类型 | 说明                       |
> | :------- | :------- | :------------------------- |
> | _id      | String   | 文章唯一标识id             |
> | title    | String   | 文章标题                   |
> | des      | String   | 文章类容                   |
> | cover    | String   | 文章封面                   |
> | author   | String   | 发表者                     |
> | likes    | Arrary   | 点赞                       |
> | collects | Arrary   | 收藏                       |
> | pv       | String   | 浏览量                     |
> | class    | String   | 文章分类                   |
> | date     | Double   | 时间搓（可转换为时间格式） |

接口示例：

```
{
			"_id": "6512a28a443a67229cc00df7",
			"title": "学校党委宣讲团到信息工程学院宣讲习近平总书记来川视察重要指示精神",
			"des": "<div>文章内容</div>",
			"cover": "/file/cover/cover-1695720074501.png",
			"author": "admin",
			"likes": [],
			"collects": [],
			"pv": 1,
			"class": "信工资讯",
			"date": 1695720074582,
			"__v": 0
}
```

# 3、志愿者报名接口

###### 接口功能

> 志愿者报名

###### URL

> 获取志愿者最新活动接口：/api/get/newActive（最多返回五条数据）
>
> 志愿者提交报名表接口：/api/itVolunteer/application

###### 支持格式

> JSON

###### HTTP请求方式

> GET、POST

###### 请求参数

> | 参数        | 必选 | 类型   | 说明                                             |
> | :---------- | :--- | :----- | ------------------------------------------------ |
> | activityId  | true | String | 表id关联（必须先拿到获取志愿者最新活动接口的id） |
> | name        | true | String | 名字                                             |
> | sex         | true | String | 性别                                             |
> | ID          | true | String | 学号                                             |
> | grade       | true | String | 年级                                             |
> | classes     | true | String | 班级                                             |
> | phoneNumber | true | String | 电话号码                                         |
> | counsellor  | true | String | 辅导员                                           |

###### 返回字段

> | 返回字段    | 类型   | 说明                                           |
> | :---------- | :----- | ---------------------------------------------- |
> | activityId  | String | 表id关联（必须拿到获取志愿者最新活动接口的id） |
> | _id         | String | 志愿者数据唯一标识                             |
> | name        | String | 名字                                           |
> | sex         | String | 性别                                           |
> | ID          | String | 学号                                           |
> | grade       | String | 年级                                           |
> | classes     | String | 班级                                           |
> | phoneNumber | String | 电话号码                                       |
> | counsellor  | String | 辅导员                                         |



###### 接口示例1：/api/get/newActive

```
{
	"code": 0,
	"msg": "请求完成",
	"data": {
		"_id": "651475373893dc76f499060e",
		"title": "6666",
		"description": "666",
		"deadline": "2023-09-29T23:32:00.000Z",
		"cover": "/file/vtCover/vtCover-1695839543360.png",
		"date": 1695839543390,
		"__v": 0
	}
}
```

接口示例2：/api/itVolunteer/application

```
{
	"code": 0,
	"msg": "报名成功",
	"registration": {
		"activityId": "651465fdfce4273e5a108a0b",
		"name": "王亚鹏",
		"sex": "男",
		"ID": "213817310403",
		"grade": "21",
		"classes": "计算机科学与技术4班",
		"phoneNumber": "173669048703",
		"counsellor": "叶青",
		"_id": "65146ef0f28cb738a07ed8e7",
		"registrationTime": 1695837936192,
		"__v": 0
	}
}
```

