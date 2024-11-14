import * as XLSX from 'xlsx';

export function exportToExcel(dataArray: any[], fileName?: string): void {
    // 处理数据，重命名字段并按照顺序映射
    const processedData = dataArray.map(item => {
        const {
            __v,
            _id,
            activityId,
            registrationTime,
            ID: 学号,
            counsellor: 辅导员,
            grade: 年级,
            classes: 班级,
            levels:层次,
            name: 姓名,
            phoneNumber: 手机号,
            sex: 性别,
            institution:机构,
            position:职位,
            semester:学期,
            checkInTime,
            faculty:学院,
            ...rest
        } = item;

        // 格式化时间字段为 "2023年5月16日5时6分10秒" 形式
        const formattedDate = new Date(registrationTime).toLocaleString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });
// 格式化时间字段为 "2023年5月16日5时6分10秒" 形式
        const formattedDate2 = checkInTime ? new Date(checkInTime).toLocaleString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }) : "未签到";
        return {
            报名时间: formattedDate,  
            学院,
            学期,
            姓名,
            性别,
            学号,
            年级,
            班级,
            层次,
            手机号,
            辅导员,
            机构,
            职位,
            签到情况:formattedDate2,
            ...rest
        };
    });

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(processedData);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const blob: Blob = new Blob([XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet'
    });

    const downloadLink: HTMLAnchorElement = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    const end = '.xlsx';
    downloadLink.download = `${fileName}${end}` || 'output.xlsx';
    downloadLink.click();

    URL.revokeObjectURL(downloadLink.href);
}
export function exportUserToExcel(dataArray: any[], fileName?: string): void {
    // Fields to exclude from export
    const excludedFields = ['user', 'nickName', 'pass', 'photo', 'admin', 'adminPlus', 'secret', 'appState', 'isMember', 'isCadre', 'due', 'date'];

    // 处理数据，重命名字段并按照顺序映射
    const userData = dataArray.map(item => {
        const {
            __v,
            _id,
            activityId,
            date,
            province,
            activityIds,
            personality,
            num: 学号,
            counsellor: 辅导员,
            grade: 年级,
            class: 班级,
            levels: 层次,
            name: 姓名,
            phone: 手机号,
            sex: 性别,
            institution: 机构,
            position: 职位,
            chamber:寝室号,
            faculty:学院,
            ...rest
        } = item;

        // 格式化时间字段为 "2023年5月16日5时6分10秒" 形式
        const formattedDate = new Date(date).toLocaleString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });

        // Create a new object with the desired fields
        const userWithoutExcludedFields = {
            注册时间: formattedDate,
            学院,
            姓名,
            性别,
            学号,
            年级,
            班级,
            层次,
            手机号,
            辅导员,
            机构,
            职位,
            寝室号,
            ...rest
        };

        // Remove excluded fields
        excludedFields.forEach(field => delete userWithoutExcludedFields[field]);

        return userWithoutExcludedFields;
    });

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(userData);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const blob: Blob = new Blob([XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet'
    });

    const downloadLink: HTMLAnchorElement = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    const end = '.xlsx';
    downloadLink.download = `${fileName}${end}` || 'output.xlsx';
    downloadLink.click();

    URL.revokeObjectURL(downloadLink.href);
}



export function exportOrgGrade(dataArray: any[], fileName?: string): void {
    // 要从导出中排除的字段
    const excludedFields = ['id','user', 'nickName', 'pass', 'photo', 'admin', 'adminPlus', 'secret', 'appState', 'isMember', 'isCadre', 'due', 'date'];

    // 处理数据，重命名字段并按照顺序映射
    const userData = dataArray.map(item => {
        const {
            __v,
            _id,
            activityId,
            date,
            name: 姓名,
            sex: 性别,
            institution: 机构,
            position: 职位,
            totalScore:成绩,
            ...rest
        } = item;

        // 格式化时间字段为 "2023年5月16日5时6分10秒" 形式
        const formattedDate = new Date(date).toLocaleString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });

        // Create a new object with the desired fields
        const userWithoutExcludedFields = {
            交卷时间: formattedDate,
            姓名,
            性别,
            机构,
            职位,
            成绩,
            ...rest
        };

        // Remove excluded fields
        excludedFields.forEach(field => delete userWithoutExcludedFields[field]);

        return userWithoutExcludedFields;
    });

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(userData);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const blob: Blob = new Blob([XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet'
    });

    const downloadLink: HTMLAnchorElement = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    const end = '.xlsx';
    downloadLink.download = `${fileName}${end}` || 'output.xlsx';
    downloadLink.click();

    URL.revokeObjectURL(downloadLink.href);
}
