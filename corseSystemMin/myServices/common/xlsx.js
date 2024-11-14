import * as XLSX from 'xlsx';
const fs = uni.getFileSystemManager();

export function exportToExcel(dataArray, filename, isSign, isCheckOut) {
    const processedData = dataArray.map(item => {
        const {
            __v,
            _id,
            activityId,
            isDeleted,
            deletedAt,
            hasCheckedOut,
            registrationTime,
            semester,
            faculty: 学院,
            ID: 学号,
            counsellor: 辅导员,
            grade: 年级,
            classes: 班级,
            levels: 层次,
            name: 姓名,
            phoneNumber: 手机号,
            sex: 性别,
            checkInTime,
            checkOutTime,
            ...rest
        } = item;
        const formattedDate = formatDateTime(registrationTime, 'yyyy年MM月dd日 hh:mm:ss');
        const checkInDate = isSign && checkInTime ? formatDateTime(checkInTime, 'yyyy年MM月dd日 hh:mm:ss') : '未签到';
        const checkOutDate = isSign && isCheckOut && checkOutTime ? formatDateTime(checkOutTime, 'yyyy年MM月dd日 hh:mm:ss') : '未签退';

        const data = {
            '报名时间': formattedDate,
            '学院': 学院,
            '姓名': 姓名,
            '性别': 性别,
            '学号': 学号,
            '年级': 年级,
            '班级': 班级,
            '层次': 层次,
            '手机号': 手机号,
            '辅导员': 辅导员,
            ...rest
        };

        // 添加签到和签退列
		if (isSign&&isCheckOut) {
			data['签到详情'] = checkInDate;
		    data['签退详情'] = checkOutDate;
		}else if (isSign) {
            data['签到详情'] = checkInDate;
        }
        

        return data;
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(processedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const fileData = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'base64'
    });
    const filePath = `${uni.env.USER_DATA_PATH}/${filename}.xlsx`;

    fs.writeFile({
        filePath: filePath,
        data: fileData,
        encoding: 'base64',
        success: res => {
            // 获取系统信息
            uni.getSystemInfo({
                success: function(sysInfo) {
                    if (sysInfo.platform.toLowerCase().indexOf('windows') >= 0) {
                        // 如果是Windows平台，调用saveFileToDisk保存文件到本地
                        uni.saveFileToDisk({
                            filePath: filePath,
                            success: res => console.log(res),
                            fail: err => console.error(err)
                        });
                    } else {
                        // 否则，调用openDocument打开文件
                        uni.openDocument({
                            filePath: filePath,
                            showMenu: true, // 需要添加showMenu允许用户导出
                            success: res => console.log(res),
                            fail: err => console.error(err)
                        });
                    }
                },
                fail: err => console.error(err)
            });
        },
        fail: e => {
            console.error(e);
            if (e.errMsg.indexOf('locked') !== -1) {
                uni.showModal({
                    title: '提示',
                    content: '文档已打开，请先关闭',
                });
            }
        }
    });
}


// 格式化日期时间为指定格式
function formatDateTime(dateTime, format) {
    const date = new Date(dateTime);
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return format
        .replace('yyyy', yyyy)
        .replace('MM', MM)
        .replace('dd', dd)
        .replace('hh', hh)
        .replace('mm', mm)
        .replace('ss', ss);
}
export function exportCheckCourseToExcel(dataArray, filename) {
    const processedData = dataArray.map(item => {
        const {
            __v,
            _id,
            activityId,
			isDeleted,
			deletedAt,
            semester,
            faculty: 学院,
            num: 学号,
            counsellor: 辅导员,
            grade: 年级,
            class: 班级,
            levels: 层次,
            name: 姓名,
            phone: 手机号,
            sex: 性别,
            status,
            user,
            nickName,
            pass,
            photo,
            admin,
            adminPlus,
            secret,
            appState,
            isMember,
            class: 班级原始,
            institution,
            chamber,
            position,
            phone,
            num,
            isCadre,
            due,
            date,
            activityIds,
            personality,
            province,
            ...rest
        } = item;

       
        // 将 status 转换为中文
        const statusChinese = status === 'leave' ? '请假' : status === 'absent' ? '缺席' : '已到';

        const data = {
            
            '学院': 学院,
            '姓名': 姓名,
            '性别': 性别,
            '学号': 学号,
            '年级': 年级,
            '班级': 班级,
            '层次': 层次,
            '手机号': 手机号,
            '辅导员': 辅导员,
            '考勤': statusChinese, // 添加转换后的状态字段
            ...rest
        };

        return data;
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(processedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const fileData = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'base64'
    });
    const filePath = `${uni.env.USER_DATA_PATH}/${filename}.xlsx`;

    fs.writeFile({
        filePath: filePath,
        data: fileData,
        encoding: 'base64',
        success: res => {
            console.log(res);
            // 获取系统信息
            uni.getSystemInfo({
                success: function(sysInfo) {
                    if (sysInfo.platform.toLowerCase().indexOf('windows') >= 0) {
                        // 如果是Windows平台，调用saveFileToDisk保存文件到本地
                        uni.saveFileToDisk({
                            filePath: filePath,
                            success: res => console.log(res),
                            fail: err => console.error(err)
                        });
                    } else {
                        // 否则，调用openDocument打开文件
                        uni.openDocument({
                            filePath: filePath,
                            showMenu: true, // 需要添加showMenu允许用户导出
                            success: res => console.log(res),
                            fail: err => console.error(err)
                        });
                    }
                },
                fail: err => console.error(err)
            });
        },
        fail: e => {
            console.error(e);
            if (e.errMsg.indexOf('locked') !== -1) {
                uni.showModal({
                    title: '提示',
                    content: '文档已打开，请先关闭',
                });
            }
        }
    });
}
