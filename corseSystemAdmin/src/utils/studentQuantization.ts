// // ExcelExport.ts
// import * as XLSX from 'xlsx';
//
//
// //一张表上多个工作簿
// export default class StudentExport {
//     static exportToExcel(fileName: string, students: any[], tableColumns: any[]) {
//         // 按照年级班级层次对学生进行分组
//         const studentGroups = this.groupStudentsByClass(students);
//
//         // 创建一个工作簿
//         const wb = XLSX.utils.book_new();
//
//         // 对每个班级分组生成一个工作表
//         for (const [classInfo, classStudents] of studentGroups) {
//             const sheetName = classInfo;
//             const data = this.prepareExportData(classStudents, tableColumns);
//             const ws = XLSX.utils.json_to_sheet(data);
//
//             // 设置列宽
//             const colWidths = this.getAutoColumnWidths(data);
//             ws['!cols'] = colWidths;
//             // 找到第一列的宽度设置项
//             const firstColumnWidth = colWidths[0];
//             // 修改第一列的宽度为自适应宽度
//             firstColumnWidth.wch = 35;
//             // 合并班级列
//             const mergeConfig = this.getMergeConfig(data);
//             ws['!merges'] = mergeConfig;
//
//             // 设置整体表格样式（左右居中、垂直居中）
//             ws['!margins'] = { left: 0.5, right: 0.5, top: 0.5, bottom: 0.5, header: 0.3, footer: 0.3 };
//
//             XLSX.utils.book_append_sheet(wb, ws, sheetName);
//         }
//
//         XLSX.writeFile(wb, `${fileName}.xlsx`);
//     }
//
//     private static groupStudentsByClass(students: any[]) {
//         const groupedStudents = new Map<string, any[]>();
//
//         for (const student of students) {
//             const classInfo = `${student.grade}${student.class}${student.levels}`;
//             if (!groupedStudents.has(classInfo)) {
//                 groupedStudents.set(classInfo, []);
//             }
//             groupedStudents.get(classInfo)!.push(student);
//         }
//
//         return groupedStudents;
//     }
//
//     private static prepareExportData(students: any[], tableColumns: any[]) {
//         return students.map(student => {
//             const rowData: any = {
//                 班级: student.grade + student.class + student.levels,
//                 姓名: student.name,
//                 学号: student.num,
//                 任职机构: student.institution === "暂无" || student.institution === "芯系启航" ? "" : student.institution,
//                 任职情况: student.position === "普通用户" || student.position === "芯系小助手开发者" ? "" : student.position
//             };
//             tableColumns.forEach(column => {
//                 rowData[column.title] = student.activityIds.includes(column._id) ? '√' : '';
//             });
//
//             return rowData;
//         });
//     }
//
//     private static getAutoColumnWidths(data: any[]) {
//         const colWidths: any = [];
//         const headerRow = data[0];
//
//         Object.keys(headerRow).forEach(key => {
//             const maxLen = key.length+10;
//             colWidths.push({ wch: maxLen *2 }); // Add some padding
//         });
//
//         return colWidths;
//     }
//
//     private static getMergeConfig(data: any[]) {
//         const mergeConfig = [];
//         let currentClass = null;
//         let startRow = 1; // 包括标题行
//
//         for (let i = 1; i < data.length + 1; i++) {
//             const rowClass = data[i - 1].班级;
//
//             if (currentClass !== rowClass) {
//                 if (currentClass !== null) {
//                     const endRow = i - 1;
//                     mergeConfig.push({ s: { r: startRow, c: 0 }, e: { r: endRow, c: 0 } });
//                     startRow = i; // 更新下一组的startRow
//                 }
//
//                 currentClass = rowClass;
//             }
//         }
//
//         //如果需要，合并最后一个组
//         if (currentClass !== null) {
//             const endRow = data.length; // 将endRow更新到最后一行
//             mergeConfig.push({ s: { r: startRow, c: 0 }, e: { r: endRow, c: 0 } });
//         }
//
//         return mergeConfig;
//     }
// }
//
//
//
//
//
//
// // @ts-ignore
// import ExcelJS from 'exceljs'; // 引入 ExcelJS
// // @ts-ignore
// import { saveAs } from 'file-saver'; // 引入 file-saver
//
// export default class StudentExport {
//     static async exportToExcel(fileName: string, students: any[], tableColumns: any[]) {
//         // 按照年级班级层次对学生进行分组
//         const studentGroups = this.groupStudentsByClass(students);
//
//         // 创建一个工作簿
//         const workbook = new ExcelJS.Workbook();
//
//         // 对每个班级分组生成一个工作表
//         for (const [classInfo, classStudents] of studentGroups) {
//             const sheetName = classInfo;
//             const worksheet = workbook.addWorksheet(sheetName);
//
//             // 准备数据
//             const data = this.prepareExportData(classStudents, tableColumns);
//
//             // 添加列头
//             const header = Object.keys(data[0]);
//             const headerRow = worksheet.addRow(header);
//
//             // 设置列头样式
//             headerRow.font = { name: '黑体', size: 18 };
//             headerRow.height = 25; // 可以根据需要调整行高
//
//             // 添加数据行
//             data.forEach(rowData => {
//                 const row = worksheet.addRow(Object.values(rowData));
//
//                 // 设置行内所有单元格的对齐方式和自动换行
//                 row.eachCell((cell: any) => {
//                     cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
//                 });
//             });
//
//             // 固定列宽
//             this.setColumnWidths(worksheet, 20);
//
//             // 合并班级列
//             this.mergeClassCells(worksheet, data);
//         }
//
//         // 导出文件
//         const buffer = await workbook.xlsx.writeBuffer();
//         const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//         saveAs(blob, `${fileName}.xlsx`);
//     }
//
//     private static groupStudentsByClass(students: any[]) {
//         const groupedStudents = new Map<string, any[]>();
//
//         for (const student of students) {
//             const classInfo = `${student.grade}${student.class}${student.levels}`;
//             if (!groupedStudents.has(classInfo)) {
//                 groupedStudents.set(classInfo, []);
//             }
//             groupedStudents.get(classInfo)!.push(student);
//         }
//
//         return groupedStudents;
//     }
//
//     private static prepareExportData(students: any[], tableColumns: any[]) {
//         return students.map(student => {
//             const rowData: any = {
//                 班级: student.grade + student.class + student.levels,
//                 姓名: student.name,
//                 学号: student.num,
//                 任职机构: student.institution === "暂无" || student.institution === "芯系启航" ? "" : student.institution,
//                 任职情况: student.position === "普通用户" || student.position === "芯系小助手开发者" ? "" : student.position
//             };
//             tableColumns.forEach(column => {
//                 rowData[column.title] = student.activityIds.includes(column._id) ? '√' : '';
//             });
//
//             return rowData;
//         });
//     }
//
//     // 设置固定列宽
//     private static setColumnWidths(worksheet: ExcelJS.Worksheet, width: number) {
//         worksheet.columns.forEach((column:any, index:any) => {
//             column.width = width; // 将列宽固定为20
//         });
//     }
//
//     private static mergeClassCells(worksheet: ExcelJS.Worksheet, data: any[]) {
//         let currentClass = null;
//         let startRow = 2; // 从第二行开始，第一行是表头
//
//         for (let i = 2; i <= data.length + 1; i++) {
//             const rowClass = worksheet.getCell(`A${i}`).value;
//
//             if (currentClass !== rowClass) {
//                 if (currentClass !== null) {
//                     const endRow = i - 1;
//                     worksheet.mergeCells(`A${startRow}:A${endRow}`);
//                 }
//
//                 currentClass = rowClass;
//                 startRow = i;
//             }
//         }
//
//         // 合并最后一个组
//         if (currentClass !== null) {
//             worksheet.mergeCells(`A${startRow}:A${data.length + 1}`);
//         }
//     }
// }
import ExcelJS from 'exceljs'; // 引入 ExcelJS
// @ts-ignore
import { saveAs } from 'file-saver'; // 引入 file-saver

export default class StudentExport {
    static async exportToExcel(fileName: string, students: any[], tableColumns: any[]) {
        // 按照年级班级层次对学生进行分组
        const studentGroups = this.groupStudentsByClass(students);

        // 创建一个工作簿
        const workbook = new ExcelJS.Workbook();

        // 对每个班级分组生成一个工作表
        for (const [classInfo, classStudents] of studentGroups) {
            const sheetName = classInfo;
            const worksheet = workbook.addWorksheet(sheetName);

            // 设置视图，冻结前五列和第一行
            worksheet.views = [{ state: 'frozen', xSplit: 5, ySplit: 1 }];

            // 准备数据
            const data = this.prepareExportData(classStudents, tableColumns);

            // 添加列头
            const header = Object.keys(data[0]);
            const headerRow = worksheet.addRow(header);

            // 设置列宽并自动换行和垂直居中
            worksheet.columns.forEach(column => {
                column.width = 15; // 设置固定列宽为20
            });

            // 根据列索引设置第一行字体大小和样式，并添加边框
            headerRow.eachCell({ includeEmpty: true }, (cell: any, colNumber: number) => {
                if (colNumber <= 5) {
                    cell.font = { name: '黑体', size: 28, bold: true }; // 前五列字体为黑体28号
                } else {
                    cell.font = { name: '黑体', size: 18, bold: true }; // 其他列字体为黑体18号
                }
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                cell.border = this.getAllBorders(); // 设置单元格边框
            });

            // 第一行不设置行高，让 Excel 自动处理行高

            // 添加数据行
            data.forEach(rowData => {
                const row = worksheet.addRow(Object.values(rowData));

                // 设置行内所有单元格的对齐方式、自动换行、字体加粗，并添加边框
                row.eachCell((cell: any) => {
                    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                    cell.font = { bold: true }; // 字体加粗
                    cell.border = this.getAllBorders(); // 设置单元格边框
                });

                // 自动调整行高根据内容
                // @ts-ignore
                row.height = this.calculateRowHeight(row, worksheet.columns);
            });

            // 合并班级列
            this.mergeClassCells(worksheet, data);
        }

        // 导出文件
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `${fileName}.xlsx`);
    }

    private static groupStudentsByClass(students: any[]) {
        const groupedStudents = new Map<string, any[]>();

        for (const student of students) {
            const classInfo = `${student.grade}${student.class}${student.levels}`;
            if (!groupedStudents.has(classInfo)) {
                groupedStudents.set(classInfo, []);
            }
            groupedStudents.get(classInfo)!.push(student);
        }

        return groupedStudents;
    }

    private static prepareExportData(students: any[], tableColumns: any[]) {
        return students.map(student => {
            const rowData: any = {
                班级: student.grade + student.class + student.levels,
                姓名: student.name,
                学号: student.num,
                任职机构: student.institution === "暂无" || student.institution === "芯系启航" ? "" : student.institution,
                任职情况: student.position === "普通用户" || student.position === "芯系小助手开发者" ? "" : student.position
            };
            tableColumns.forEach(column => {
                rowData[column.title] = student.activityIds.includes(column._id) ? '√' : '';
            });

            return rowData;
        });
    }

    // 根据内容行数计算行高
    private static calculateRowHeight(row: ExcelJS.Row, columns: ExcelJS.Column[]) {
        let maxLines = 1;
        row.eachCell((cell: any, colNumber: number) => {
            const text = cell.value as string;
            const columnWidth = columns[colNumber - 1].width || 10;
            const charactersPerLine = Math.floor(columnWidth * 2); // 粗略估计一行可容纳的字符数
            const lineCount = Math.ceil(text.length / charactersPerLine);
            if (lineCount > maxLines) {
                maxLines = lineCount;
            }
        });

        // 返回行高，1行为15，换行会增加行高
        return maxLines * 15;
    }

    private static mergeClassCells(worksheet: ExcelJS.Worksheet, data: any[]) {
        let currentClass = null;
        let startRow = 2; // 从第二行开始，第一行是表头

        for (let i = 2; i <= data.length + 1; i++) {
            const rowClass = worksheet.getCell(`A${i}`).value;

            if (currentClass !== rowClass) {
                if (currentClass !== null) {
                    const endRow = i - 1;
                    worksheet.mergeCells(`A${startRow}:A${endRow}`);
                }

                currentClass = rowClass;
                startRow = i;
            }
        }

        // 合并最后一个组
        if (currentClass !== null) {
            worksheet.mergeCells(`A${startRow}:A${data.length + 1}`);
        }
    }

    // 添加单元格边框样式
    private static getAllBorders() {
        return {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    }
}

