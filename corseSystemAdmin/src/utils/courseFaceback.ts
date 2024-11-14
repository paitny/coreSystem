import ExcelJS from 'exceljs';
// @ts-ignore
import { saveAs } from 'file-saver';

interface Result {
    studentId: number;
    status: string;
    name?: string; // 确保 name 字段是可选的
}

interface Record {
    course: {
        name: string;
        rawSection: string;
        address: string;
    };
    grade: string;
    class: string;
    level: string;
    week: number;
    weekday: number;
    results: Result[];
    counsellor: string;
    classPeriod: string;
    location: string;
    checker: string;
    remarks: string;
    createdAt: string; // 确保 createdAt 是字符串类型
}

interface AttendanceData {
    // '学期'字段被移除
    '课程名称': string;
    '年级': string;
    '班级': string;
    '辅导员': string;
    '应到人数': number;
    '实到人数': number;
    '请假人数': number;
    '缺席人数': number;
    '周次': number;
    '地点': string;
    '查课人': string;
    '备注': string;
    '时间': string; // 确保 createdAt 是字符串类型
}

const calculateAttendance = (results: Result[]): { shouldAttend: number; actualAttend: number; leave: number; absent: number } => {
    const shouldAttend = results.length;
    const leave = results.filter(result => result.status === 'leave').length;
    const absent = results.filter(result => result.status === 'absent').length;
    const actualAttend = shouldAttend - leave - absent;

    return {
        shouldAttend,
        actualAttend,
        leave,
        absent
    };
};

const weekdayToChinese = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']; // 星期数转中文

// 格式化日期到 'xx 月 xx 日' 格式
const formatCreatedAt = (createdAt: string): string => {
    const date = new Date(createdAt);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
};

// 导出考勤到 Excel
export const exportAttendanceToExcel = async (dataArray: Record[], fileName: string = 'attendance_report.xlsx'): Promise<void> => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // 定义列，移除了'学期'列
    worksheet.columns = [
        { header: '年级', key: 'grade' },
        { header: '班级', key: 'className' },
        { header: '时间', key: 'createdAt' },
        { header: '地点', key: 'address' },
        { header: '课程名称', key: 'courseName' },
        { header: '辅导员', key: 'counsellor' },
        { header: '应到人数', key: 'shouldAttend' },
        { header: '实到人数', key: 'actualAttend' },
        { header: '请假人数', key: 'leave' },
        { header: '缺席人数', key: 'absent' },
        { header: '周次', key: 'week' },
        { header: '查课人', key: 'checker' },
        { header: '备注', key: 'remarks' },
    ];

    // 添加数据到工作表
    dataArray.forEach(record => {
        const { course, grade, class: className, results = [], week, weekday, counsellor, checker, remarks, createdAt } = record;

        // 设置初始值
        let shouldAttend = 0;
        let actualAttend = 0;
        let leave = 0;
        let absent = 0;
        let courseName = '';
        let address = '';
        let createdAtFormatted = '';
        let remarksFinal = '';

        // 检查 course 和 results 是否为空
        if (course && results.length > 0) {
            // 计算考勤
            const attendanceData = calculateAttendance(results);
            shouldAttend = attendanceData.shouldAttend;
            actualAttend = attendanceData.actualAttend;
            leave = attendanceData.leave;
            absent = attendanceData.absent;

            const leaveNames = results.filter(result => result.status === 'leave' && result.name).map(result => result.name).join('、');
            const absentNames = results.filter(result => result.status === 'absent' && result.name).map(result => result.name).join('、');
            const remarksWithNames = [];
            if (leaveNames) remarksWithNames.push(`请假：${leaveNames}`);
            if (absentNames) remarksWithNames.push(`缺席：${absentNames}`);
            remarksFinal = remarks === '' ? remarksWithNames.join('；') : remarksWithNames.join('；') + '其他:' + remarks;
        }

        if (course) {
            courseName = course.name || '';
            address = course.address || '';

            // 确保 createdAt 和 weekday 有效
            if (createdAt) {
                createdAtFormatted = `${formatCreatedAt(createdAt)} ${weekdayToChinese[weekday] || ''} ${course.rawSection || ''}`;
            }
        }

        // 将结果添加到工作表
        worksheet.addRow({
            grade,
            className: `${className || ''}${record.level || ''}`,
            createdAt: course ? createdAtFormatted : '',
            address: course ? address : '',
            courseName: course ? courseName : '',
            counsellor: course ? counsellor : '',
            shouldAttend: course && results.length > 0 ? shouldAttend : '',
            actualAttend: course && results.length > 0 ? actualAttend : '',
            leave: course && results.length > 0 ? leave : '',
            absent: course && results.length > 0 ? absent : '',
            week: course && results.length > 0 ? week : '',
            checker: course && results.length > 0 ? checker : '',
            remarks: course && results.length > 0 ? remarksFinal || '' : '',
        });
    });

    // 合并相同年级、班级和辅导员列
    const rows = worksheet.rowCount; // 获取总行数
    let lastGrade = '';
    let lastClass = '';
    let lastCounsellor = '';
    let startRowGrade = 2; // 从第二行开始合并
    let startRowClass = 2;
    let startRowCounsellor = 2;

    for (let i = 2; i <= rows; i++) {
        const currentGrade = worksheet.getCell('A' + i).value; // 年级列
        const currentClass = worksheet.getCell('B' + i).value; // 班级列
        const currentCounsellor = worksheet.getCell('F' + i).value; // 辅导员列

        // 合并年级列
        if (currentGrade === lastGrade) {
            if (i === rows || worksheet.getCell('A' + (i + 1)).value !== currentGrade) {
                worksheet.mergeCells('A' + startRowGrade + ':' + 'A' + i);
            }
        } else {
            // @ts-ignore
            lastGrade = currentGrade;
            startRowGrade = i;
        }

        // 合并班级列
        if (currentClass === lastClass) {
            if (i === rows || worksheet.getCell('B' + (i + 1)).value !== currentClass) {
                worksheet.mergeCells('B' + startRowClass + ':' + 'B' + i);
            }
        } else {
            // @ts-ignore
            lastClass = currentClass;
            startRowClass = i;
        }

        // 合并辅导员列
        if (currentCounsellor === lastCounsellor) {
            if (i === rows || worksheet.getCell('F' + (i + 1)).value !== currentCounsellor) {
                worksheet.mergeCells('F' + startRowCounsellor + ':' + 'F' + i);
            }
        } else {
            // @ts-ignore
            lastCounsellor = currentCounsellor;
            startRowCounsellor = i;
        }
    }

    // 设置单元格样式：居中对齐，添加边框
    worksheet.eachRow((row) => {
        row.eachCell((cell) => {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });
    });

    // 自适应列宽调整
    worksheet.columns.forEach(column => {
        let maxColumnLength = 0;
        // @ts-ignore
        column.eachCell({ includeEmpty: true }, cell => {
            const columnLength = cell.value ? cell.value.toString().length : 10;
            const adjustedLength = /[\u4e00-\u9fa5]/.test(cell.value?.toString() || '') ? columnLength * 2 : columnLength;
            maxColumnLength = Math.max(maxColumnLength, adjustedLength);
        });
        column.width = maxColumnLength + 2;
    });

    // 导出文件并触发下载
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
};

// 缺勤汇总类型
interface StudentAbsence {
    studentId: string;
    name: string;
    absentCourseCount: number;
}

interface AbsenceSummary {
    counsellor: string;
    grade: string;
    className: string;
    sectionCountName: StudentAbsence[];
    remarks: string;
}

// export const exportStudentAbsenceSummaryToExcel = async (summary: AbsenceSummary[], fileName: string): Promise<void> => {
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Sheet1');

//     // 定义列
//     worksheet.columns = [
//         { header: '辅导员', key: 'counsellor', width: 15 },
//         { header: '班级', key: 'className', width: 20 },
//         ...Array.from({ length: 5 }, (_, i) => ([
//             { header: `姓名`, key: `name${i + 1}`, width: 15 },
//             { header: `课时`, key: `absentCourseCount${i + 1}`, width: 10 },
//         ])).flat(),
//     ];

//     let currentCounsellor = '';
//     let counsellorStartRow = 0;

//     summary.forEach(record => {
//         const { counsellor, grade, className, sectionCountName } = record;
//         const totalStudents = sectionCountName.length;

//         if (counsellor !== currentCounsellor) {
//             currentCounsellor = counsellor;
//             counsellorStartRow = worksheet.rowCount + 1; // 更新当前辅导员并记录起始行
//         }

//         if (totalStudents === 0) {
//             // 无缺席记录的班级
//             const row = worksheet.addRow({
//                 counsellor,
//                 className: `${grade} ${className}`,
//             });
//             worksheet.mergeCells(row.number, 3, row.number, 12);
//             row.getCell(3).value = '无缺席情况';
//         } else {
//             const startRow = worksheet.rowCount + 1; // 记录班级开始行

//             // 添加辅导员和班级信息的行
//             const headerRow = worksheet.addRow({
//                 counsellor,
//                 className: `${grade} ${className}`,
//             });

//             for (let i = 0; i < totalStudents; i++) {
//                 const rowIndex = Math.floor(i / 5); // 计算当前行索引
//                 const colIndex = i % 5; // 计算在当前行中的列索引

//                 // 创建或获取当前行
//                 const row = worksheet.getRow(startRow + rowIndex);

//                 // 填充学生信息
//                 if (i % 5 === 0) {
//                     // 只有在每行的第一列添加辅导员和班级名称
//                     row.getCell(1).value = rowIndex === 0 ? counsellor : ''; // 只有第一行显示辅导员
//                     row.getCell(2).value = rowIndex === 0 ? `${grade} ${className}` : ''; // 只有第一行显示班级
//                 }

//                 // 填充学生姓名和缺席课时
//                 row.getCell(3 + colIndex * 2).value = sectionCountName[i]?.name || ''; // 姓名
//                 row.getCell(4 + colIndex * 2).value = sectionCountName[i]?.absentCourseCount || 0; // 缺席课时
//             }

//             // 合并班级列，确保没有重复合并
//             if (totalStudents > 5 && !worksheet.getCell(startRow, 2).isMerged) {
//                 worksheet.mergeCells(startRow, 2, startRow + Math.floor((totalStudents - 1) / 5), 2); // 合并班级列
//             }
//         }

//         // 合并辅导员列
//         if (summary[summary.length - 1] === record || summary[summary.indexOf(record) + 1].counsellor !== currentCounsellor) {
//             const lastRow = worksheet.rowCount;
//             if (!worksheet.getCell(counsellorStartRow, 1).isMerged) {
//                 worksheet.mergeCells(counsellorStartRow, 1, lastRow, 1);
//             }
//         }
//     });

//     // 设置单元格样式：居中对齐，添加边框
// // 设置单元格样式：居中对齐，添加边框
// worksheet.eachRow((row) => {
//     row.eachCell((cell) => {
//         cell.alignment = { vertical: 'middle', horizontal: 'center' };
//         cell.border = {
//             top: { style: 'thin' },
//             left: { style: 'thin' },
//             bottom: { style: 'thin' },
//             right: { style: 'thin' },
//         };
//     });
// });

// // 额外确保姓名1到姓名5区域的边框
// for (let i = 1; i <= summary.length; i++) {
//     const row = worksheet.getRow(i);
//     for (let j = 3; j <= 12; j++) { // 姓名1到姓名5的列索引
//         const cell = row.getCell(j);
//         cell.border = {
//             top: { style: 'thin' },
//             left: { style: 'thin' },
//             bottom: { style: 'thin' },
//             right: { style: 'thin' },
//         };
//     }
// }



//     // 自适应列宽调整
//     worksheet.columns.forEach(column => {
//         let maxColumnLength = 0;
//         // @ts-ignore
//         column.eachCell({ includeEmpty: true }, cell => {
//             const columnLength = cell.value ? cell.value.toString().length : 10;
//             const adjustedLength = /[\u4e00-\u9fa5]/.test(cell.value?.toString() || '') ? columnLength * 2 : columnLength;
//             maxColumnLength = Math.max(maxColumnLength, adjustedLength);
//         });
//         column.width = maxColumnLength + 2;
//     });

//     // 导出文件并触发下载
//     const buffer = await workbook.xlsx.writeBuffer();
//     const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//     saveAs(blob, fileName);
// };






// export const exportStudentAbsenceSummaryToExcel = async (summary: AbsenceSummary[], fileName: string): Promise<void> => {
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Sheet1');

//     // 定义列
//     worksheet.columns = [
//         { header: '辅导员', key: 'counsellor', width: 15 },
//         { header: '班级', key: 'className', width: 20 },
//         ...Array.from({ length: 5 }, (_, i) => ([
//             { header: `姓名`, key: `name${i + 1}`, width: 15 },
//             { header: `缺席课时`, key: `absentCourseCount${i + 1}`, width: 10 },
//         ])).flat(),
//         { header: '未提供次数', key: 'unprovidedCount', width: 10 }, // M列
//     ];

//     let currentCounsellor = '';
//     let counsellorStartRow = 0;

//     summary.forEach(record => {
//         const { counsellor, grade, className, sectionCountName, unprovidedCount } = record;
//         const totalStudents = sectionCountName.length;

//         if (counsellor !== currentCounsellor) {
//             currentCounsellor = counsellor;
//             counsellorStartRow = worksheet.rowCount + 1; // 更新当前辅导员并记录起始行
//         }

//         if (totalStudents === 0) {
//             const row = worksheet.addRow({
//                 counsellor,
//                 className: `${grade} ${className}`,
//                 unprovidedCount,
//             });
//             worksheet.mergeCells(row.number, 3, row.number, 12);
//             row.getCell(3).value = '无缺席情况';

//             // 添加边框
//             for (let col = 1; col <= 13; col++) {
//                 row.getCell(col).border = {
//                     top: { style: 'thin' },
//                     left: { style: 'thin' },
//                     bottom: { style: 'thin' },
//                     right: { style: 'thin' },
//                 };
//             }
//         } else {
//             const startRow = worksheet.rowCount + 1;

//             // 添加辅导员和班级信息的行
//             const headerRow = worksheet.addRow({
//                 counsellor,
//                 className: `${grade} ${className}`,
//                 unprovidedCount,
//             });

//             // 添加边框
//             for (let col = 1; col <= 13; col++) {
//                 headerRow.getCell(col).border = {
//                     top: { style: 'thin' },
//                     left: { style: 'thin' },
//                     bottom: { style: 'thin' },
//                     right: { style: 'thin' },
//                 };
//             }

//             for (let i = 0; i < totalStudents; i++) {
//                 const rowIndex = Math.floor(i / 5);
//                 const colIndex = i % 5;

//                 const row = worksheet.getRow(startRow + rowIndex);

//                 if (i % 5 === 0) {
//                     row.getCell(1).value = rowIndex === 0 ? counsellor : '';
//                     row.getCell(2).value = rowIndex === 0 ? `${grade} ${className}` : '';
//                 }

//                 row.getCell(3 + colIndex * 2).value = sectionCountName[i]?.name || '';
//                 row.getCell(4 + colIndex * 2).value = sectionCountName[i]?.absentCourseCount || 0;

//                 // 添加边框
//                 for (let col = 1; col <= 13; col++) {
//                     row.getCell(col).border = {
//                         top: { style: 'thin' },
//                         left: { style: 'thin' },
//                         bottom: { style: 'thin' },
//                         right: { style: 'thin' },
//                     };
//                 }
//             }

//             // 合并班级列
//             if (totalStudents > 5 && !worksheet.getCell(startRow, 2).isMerged) {
//                 worksheet.mergeCells(startRow, 2, startRow + Math.floor((totalStudents - 1) / 5), 2);
//             }

//             // 合并未提供次数列（M列）
//             const unprovidedRowCount = Math.ceil(totalStudents / 5);
//             if (unprovidedRowCount > 1) {
//                 worksheet.mergeCells(startRow, 13, startRow + unprovidedRowCount - 1, 13);
//             }
//         }

//         if (summary[summary.length - 1] === record || summary[summary.indexOf(record) + 1].counsellor !== currentCounsellor) {
//             const lastRow = worksheet.rowCount;
//             if (!worksheet.getCell(counsellorStartRow, 1).isMerged) {
//                 worksheet.mergeCells(counsellorStartRow, 1, lastRow, 1);
//             }
//         }
//     });

//     worksheet.eachRow((row) => {
//         row.eachCell((cell) => {
//             cell.alignment = { vertical: 'middle', horizontal: 'center' };
//             // 为A到M列添加边框
//             if (cell.col <= 13) {
//                 cell.border = {
//                     top: { style: 'thin' },
//                     left: { style: 'thin' },
//                     bottom: { style: 'thin' },
//                     right: { style: 'thin' },
//                 };
//             }
//         });
//     });

//     worksheet.columns.forEach(column => {
//         let maxColumnLength = 0;
//         column.eachCell({ includeEmpty: true }, cell => {
//             const columnLength = cell.value ? cell.value.toString().length : 10;
//             const adjustedLength = /[\u4e00-\u9fa5]/.test(cell.value?.toString() || '') ? columnLength * 2 : columnLength;
//             maxColumnLength = Math.max(maxColumnLength, adjustedLength);
//         });
//         column.width = maxColumnLength + 2;
//     });

//     const buffer = await workbook.xlsx.writeBuffer();
//     const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//     saveAs(blob, fileName);
// };


// export const exportStudentAbsenceSummaryToExcel = async (summary: AbsenceSummary[], fileName: string): Promise<void> => {
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Sheet1');

//     // 定义列
//     worksheet.columns = [
//         { header: '辅导员', key: 'counsellor', width: 15 },
//         { header: '班级', key: 'className', width: 20 },
//         ...Array.from({ length: 5 }, (_, i) => ([
//             { header: `姓名`, key: `name${i + 1}`, width: 15 },
//             { header: `缺席课时`, key: `absentCourseCount${i + 1}`, width: 10 },
//         ])).flat(),
//         { header: '学委未给名单次数', key: 'unprovidedCount', width: 10 },
//     ];

//     let currentCounsellor = '';
//     let counsellorStartRow = 0;

//     summary.forEach((record, index) => {
//         // @ts-ignore
//         const { counsellor, grade, className,level, sectionCountName, unprovidedCount } = record;
//         const totalStudents = sectionCountName.length;

//         if (counsellor !== currentCounsellor) {
//             // 只在第二个及之后的辅导员前添加标题行
//             if (currentCounsellor !== '') {
//                 worksheet.addRow(['辅导员', '班级', '姓名', '缺席课时', '姓名', '缺席课时', '姓名', '缺席课时', '姓名', '缺席课时', '姓名', '缺席课时', '学委未给名单次数']);
//             }

//             currentCounsellor = counsellor;
//             counsellorStartRow = worksheet.rowCount + 1; // 更新当前辅导员并记录起始行
//         }

//         if (totalStudents === 0) {
//             const row = worksheet.addRow({
//                 counsellor,
//                 className: `${grade} ${className} (${level})`,
//                 unprovidedCount,
//             });
//             worksheet.mergeCells(row.number, 3, row.number, 12);
//             row.getCell(3).value = '无缺席情况';

//             // 添加边框
//             for (let col = 1; col <= 13; col++) {
//                 row.getCell(col).border = {
//                     top: { style: 'thin' },
//                     left: { style: 'thin' },
//                     bottom: { style: 'thin' },
//                     right: { style: 'thin' },
//                 };
//             }
//         } else {
//             const startRow = worksheet.rowCount + 1;

//             // 添加辅导员和班级信息的行
//             const headerRow = worksheet.addRow({
//                 counsellor,
//                 className: `${grade} ${className} (${level})`,
//                 unprovidedCount,
//             });

//             // 添加边框
//             for (let col = 1; col <= 13; col++) {
//                 headerRow.getCell(col).border = {
//                     top: { style: 'thin' },
//                     left: { style: 'thin' },
//                     bottom: { style: 'thin' },
//                     right: { style: 'thin' },
//                 };
//             }

//             for (let i = 0; i < totalStudents; i++) {
//                 const rowIndex = Math.floor(i / 5);
//                 const colIndex = i % 5;

//                 const row = worksheet.getRow(startRow + rowIndex);

//                 if (i % 5 === 0) {
//                     row.getCell(1).value = rowIndex === 0 ? counsellor : '';
//                     row.getCell(2).value = rowIndex === 0 ? `${grade} ${className} (${level})` : '';
//                 }

//                 row.getCell(3 + colIndex * 2).value = sectionCountName[i]?.name || '';
//                 row.getCell(4 + colIndex * 2).value = sectionCountName[i]?.absentCourseCount || 0;

//                 // 添加边框
//                 for (let col = 1; col <= 13; col++) {
//                     row.getCell(col).border = {
//                         top: { style: 'thin' },
//                         left: { style: 'thin' },
//                         bottom: { style: 'thin' },
//                         right: { style: 'thin' },
//                     };
//                 }
//             }

//             // 合并班级列
//             if (totalStudents > 5 && !worksheet.getCell(startRow, 2).isMerged) {
//                 worksheet.mergeCells(startRow, 2, startRow + Math.floor((totalStudents - 1) / 5), 2);
//             }

//             // 合并未提供次数列（M列）
//             const unprovidedRowCount = Math.ceil(totalStudents / 5);
//             if (unprovidedRowCount > 1) {
//                 worksheet.mergeCells(startRow, 13, startRow + unprovidedRowCount - 1, 13);
//             }
//         }

//         if (summary[summary.length - 1] === record || summary[summary.indexOf(record) + 1].counsellor !== currentCounsellor) {
//             const lastRow = worksheet.rowCount;
//             if (!worksheet.getCell(counsellorStartRow, 1).isMerged) {
//                 worksheet.mergeCells(counsellorStartRow, 1, lastRow, 1);
//             }
//         }
//     });

//     worksheet.eachRow((row) => {
//         row.eachCell((cell) => {
//             cell.alignment = { vertical: 'middle', horizontal: 'center' };
//             // @ts-ignore
//             if (cell.col <= 13) {
//                 cell.border = {
//                     top: { style: 'thin' },
//                     left: { style: 'thin' },
//                     bottom: { style: 'thin' },
//                     right: { style: 'thin' },
//                 };
//             }
//         });
//     });

//     worksheet.columns.forEach(column => {
//         let maxColumnLength = 0;
//         // @ts-ignore
//         column.eachCell({ includeEmpty: true }, cell => {
//             const columnLength = cell.value ? cell.value.toString().length : 10;
//             const adjustedLength = /[\u4e00-\u9fa5]/.test(cell.value?.toString() || '') ? columnLength * 2 : columnLength;
//             maxColumnLength = Math.max(maxColumnLength, adjustedLength);
//         });
//         column.width = maxColumnLength + 2;
//     });

//     const buffer = await workbook.xlsx.writeBuffer();
//     const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//     saveAs(blob, fileName);
// };



export const exportStudentAbsenceSummaryToExcel = async (summary: AbsenceSummary[], fileName: string): Promise<void> => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // 定义列
    worksheet.columns = [
        { header: '辅导员', key: 'counsellor', width: 15 },
        { header: '班级', key: 'className', width: 20 },
        ...Array.from({ length: 5 }, (_, i) => ([
            { header: `姓名`, key: `name${i + 1}`, width: 15 },
            { header: `缺席课时`, key: `absentCourseCount${i + 1}`, width: 10 },
        ])).flat(),
        { header: '学委未给名单次数', key: 'unprovidedCount', width: 10 },
    ];

    let currentCounsellor = '';
    let counsellorStartRow = 0;

    summary.forEach((record) => {
        // @ts-ignore
        const { counsellor, grade, className, level, sectionCountName, unprovidedCount } = record;
        const totalStudents = sectionCountName.length;

        if (counsellor !== currentCounsellor) {
            if (currentCounsellor !== '') {
                worksheet.addRow(['辅导员', '班级', '姓名', '缺席课时', '姓名', '缺席课时', '姓名', '缺席课时', '姓名', '缺席课时', '姓名', '缺席课时', '学委未给名单次数']);
            }

            currentCounsellor = counsellor;
            counsellorStartRow = worksheet.rowCount + 1;
        }

        if (totalStudents === 0) {
            const row = worksheet.addRow({
                counsellor,
                className: `${grade} ${className} (${level})`,
                unprovidedCount,
            });
            worksheet.mergeCells(row.number, 3, row.number, 12);
            row.getCell(3).value = '无缺席情况';
        } else {
            const startRow = worksheet.rowCount + 1;

            const headerRow = worksheet.addRow({
                counsellor,
                className: `${grade} ${className} (${level})`,
                unprovidedCount,
            });

            for (let col = 1; col <= 13; col++) {
                headerRow.getCell(col).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }

            for (let i = 0; i < totalStudents; i++) {
                const rowIndex = Math.floor(i / 5);
                const colIndex = i % 5;

                const row = worksheet.getRow(startRow + rowIndex);

                if (i % 5 === 0) {
                    row.getCell(1).value = rowIndex === 0 ? counsellor : '';
                    row.getCell(2).value = rowIndex === 0 ? `${grade} ${className} (${level})` : '';
                }

                row.getCell(3 + colIndex * 2).value = sectionCountName[i]?.name || '';
                row.getCell(4 + colIndex * 2).value = sectionCountName[i]?.absentCourseCount || 0;
            }



            // 合并班级列
            if (totalStudents > 5 && !worksheet.getCell(startRow, 2).isMerged) {
                worksheet.mergeCells(startRow, 2, startRow + Math.floor((totalStudents - 1) / 5), 2);
            }

            const unprovidedRowCount = Math.ceil(totalStudents / 5);
            if (unprovidedRowCount > 1) {
                worksheet.mergeCells(startRow, 13, startRow + unprovidedRowCount - 1, 13);
            }

        }
        if (summary[summary.length - 1] === record || summary[summary.indexOf(record) + 1].counsellor !== currentCounsellor) {
            const lastRow = worksheet.rowCount;
            if (!worksheet.getCell(counsellorStartRow, 1).isMerged) {
                worksheet.mergeCells(counsellorStartRow, 1, lastRow, 1);
            }

            // 添加新的合并行并设置文本
            const newRow = worksheet.addRow([]);
            worksheet.mergeCells(newRow.number, 1, newRow.number, 12);
            newRow.getCell(1).value = '人工智能与大数据学院学生分会学习部 制';

            // 设置该行的右对齐
            newRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'right' }; // 右对齐

            // 设置合并单元格的边框
            for (let col = 1; col <= 12; col++) {
                newRow.getCell(col).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }

            // 设置特定行的初始宽度
            const specificRowWidth = 5; // 设定一个合适的宽度
            worksheet.getColumn(1).width = specificRowWidth; // 设置第一列宽度
        }


    });

    // 数据处理完成后设置居中对齐
    for (let rowNum = 1; rowNum <= worksheet.rowCount; rowNum++) {
        const row = worksheet.getRow(rowNum);
        for (let col = 1; col <= 13; col++) {
            const cell = row.getCell(col);
            cell.alignment = { vertical: 'middle', horizontal: 'center' }; // 设置居中对齐

            // 设置边框
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };

            // 处理特定行的右对齐
            if (cell.value === '人工智能与大数据学院学生分会学习部 制') {
                cell.alignment = { vertical: 'middle', horizontal: 'right' }; // 右对齐
            }
        }
    }

    // 设置列宽适应内容
    // worksheet.columns.forEach(column => {
    //     let maxColumnLength = 0;

    //     column.eachCell({ includeEmpty: true }, cell => {
    //         const columnLength = cell.value ? cell.value.toString().length : 10;
    //         const adjustedLength = /[\u4e00-\u9fa5]/.test(cell.value?.toString() || '') ? columnLength * 2 : columnLength;
    //         maxColumnLength = Math.max(maxColumnLength, adjustedLength);
    //     });
    //     column.width = maxColumnLength + 2; // 增加一些额外的宽度
    // });
    // 设置列宽适应内容
    worksheet.columns.forEach(column => {
        let maxColumnLength = 0;
        // @ts-ignore
        column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
            const columnLength = cell.value ? cell.value.toString().length : 10;

            // 针对特定文本行进行调整
            if (cell.value === '人工智能与大数据学院学生分会学习部 制') {
                const adjustedLength = columnLength - columnLength; // 增加额外的长度，例如5
                maxColumnLength = Math.max(maxColumnLength, adjustedLength);
            } else {
                const adjustedLength = /[\u4e00-\u9fa5]/.test(cell.value?.toString() || '') ? columnLength * 2 : columnLength;
                maxColumnLength = Math.max(maxColumnLength, adjustedLength);
            }
        });

        column.width = maxColumnLength + 2; // 增加一些额外的宽度
    });


    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
};











