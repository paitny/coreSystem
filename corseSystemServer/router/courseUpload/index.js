const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const XLSX = require('xlsx');
const fs = require('fs');
const aiCourseDB=require("../../db/aiCourse")
const classInfoDB=require("../../db/ClassInfo")
const semesterCourseUtils = require('../../utils/semesterCourseUtils');
// 假设 parsedData 是包含已解析数据对象的数组
function removeDuplicates(parsedData) {
    var seenData = {}; // 用于存储已经遇到的数据项

    // 使用 filter 方法，只保留第一个出现的每个数据项，删除后续的重复项
    parsedData = parsedData.filter(function (data) {
        var dataString = JSON.stringify(data);

        if (!seenData[dataString]) {
            seenData[dataString] = true; // 将数据项添加到已看到的数据中
            return true; // 保留第一个出现的数据项
        }

        return false; // 删除后续的重复数据项
    });

    return parsedData;
}
function sortCourseInfoByWeek(courseInfo) {
    // 使用reduce()函数按照week属性值进行分组
    var groupedByWeek = courseInfo.reduce(function (acc, course) {
        var week = course.week;
        if (!acc[week]) {
            acc[week] = [];
        }
        acc[week].push(course);
        return acc;
    }, {});

    // 重新组合数组，按照week属性值顺序
    var sortedCourseInfo = [];
    for (var week in groupedByWeek) {
        if (groupedByWeek.hasOwnProperty(week)) {
            sortedCourseInfo = sortedCourseInfo.concat(groupedByWeek[week]);
        }
    }

    return sortedCourseInfo;
}

// 使用示例

function formatSection(section, sectionCount) {
    if (sectionCount === 1) {
        return `[${section}节]`;
    } else {
        const endSection = section + sectionCount - 1;
        return `[${section}-${endSection}节]`;
    }
}
function formatArray(inputArr) {
    if (!Array.isArray(inputArr) || inputArr.length === 0) {
        return '';
    }
    // 对输入数组进行排序
    inputArr.sort((a, b) => a - b);
    let result = [];
    let start = null;
    let end = null;

    for (let i = 0; i < inputArr.length; i++) {
        const num = inputArr[i];

        if (start === null) {
            // 初始化范围起始值
            start = num;
            end = num;
        } else if (num === end + 1) {
            // 连续的数字，更新结束值
            end = num;
        } else {
            // 不连续的数字，添加范围到结果
            if (start === end) {
                result.push(start.toString());
            } else {
                result.push(start + '-' + end);
            }
            // 重置起始和结束值
            start = num;
            end = num;
        }
    }

    // 处理最后一个范围
    if (start === end) {
        result.push(start.toString());
    } else {
        result.push(start + '-' + end);
    }

    // 在结果中添加 "周"
    const formattedStr = `[${result.join(', ')}周]`;

    return formattedStr;
}

function parseInputString(inputString) {
    // 初始化数组以存储解析的课程对象
    var courses = [];
    var courseSegments = inputString.split(/\n/);

    // 遍历课程段
    for (var i = 0; i < courseSegments.length; i++) {
        // 删除前导和尾部空白
        var segment = courseSegments[i].trim();

        // Skip empty segments
        if (segment.length === 0) {
            continue;
        }

        // 使用每个课程的默认值初始化变量
        var num = null;
        var name = null;
        var weeksArray = [];
        var section = null;
        var sectionCount = null;
        var address = null;

        // 使用正则表达式从当前线段中提取值
        var numMatch = segment.match(/\[(\d+)\]/);
        var nameMatch = segment.match(/\](.*?)\[/);
        var weeksMatch = segment.match(/\[([\d,\s-]+?)\s*([单双])?周\]/);
        var sectionMatch = segment.match(/\[(\d+)(?:-(\d*))?节\]/);
        var addressMatch = segment.match(/]\s+(.+)$/);

        // 在访问属性之前，请检查匹配项是否不为null
        if (numMatch) {
            num = parseInt(numMatch[1]);
        }
        if (nameMatch) {
            name = nameMatch[1].trim();
        }
        if (weeksMatch) {
            var weeksStr = weeksMatch[1];
            var weekType = weeksMatch[2] || "";
            weeksArray = parseWeeks(weeksStr, weekType);
        }
        if (sectionMatch) {
            section = parseInt(sectionMatch[1]);
            if (sectionMatch[2]) {
                sectionCount = parseInt(sectionMatch[2]) - section + 1;
            } else {
                sectionCount = 1;
            }
        }
        if (addressMatch) {
            address = addressMatch[1].trim();
        } else if (!address && i < courseSegments.length - 1) {
            // 如果地址匹配不到且当前段落不是最后一个段落，则尝试从下一个段落中获取地址
            var nextSegment = courseSegments[i + 1].trim();
            var nextSegmentNumMatch = nextSegment.match(/^\[\d+\]/); // 检查下一个段落是否以课程编号开头
            if (!nextSegmentNumMatch) {
                address = nextSegment;
            }
        }

        // 创建课程对象并将其推送到课程数组
        var course = {
            num: num,
            name: name,
            weeks: weeksArray,
            section: section,
            sectionCount: sectionCount,
            address: address,
            credit: "",
            totalHours: "",
            lectureHours: "",
            computeHours: "",
            category: "",
            teachMethod: "",
            method: "",
            teacher: "",
            rawWeeks: formatArray(weeksArray),
            rawSection: formatSection(section, sectionCount)
        };
        courses.push(course);
    }

    // 返回已解析课程对象的数组
    return courses;
}


function parseWeeks(weeksStr, weekType) {
    var weeksArray = [];
    var matches = weeksStr.match(/(\d+)-(\d+)|(\d+)/g);

    if (matches) {
        matches.forEach(function (match) {
            if (match.includes('-')) {
                // 取值范围
                var range = match.split('-');
                var start = parseInt(range[0]);
                var end = parseInt(range[1]);

                for (var i = start; i <= end; i++) {
                    if ((weekType === '单' && i % 2 === 1) || (weekType === '双' && i % 2 === 0) || weekType === "") {
                        weeksArray.push(i);
                    }
                }
            } else {
                //处理单周
                var week = parseInt(match);
                weeksArray.push(week);
            }
        });
    }

    return weeksArray;
}

let courseCover_upload = multer({
    storage: multer.diskStorage({
        //文件存储的目录
        destination(req, file, cb) {
            cb(null, path.join(__dirname, '../../public/file/studentCourse'))
        },
        //文件的名字
        filename(req, file, cb) {
            let { ext } = path.parse(file.originalname)
            req.course_name = `course-${Date.now()}${ext}`
            cb(null, req.course_name)
        }
    })
}).single('file')
//上传活动
router.post("/uploadActivity", (req, res) => {
    try {
        courseCover_upload(req, res, async (err) => {
            // 上传失败
            if (err) {
                return res.send({
                    code: 9,
                    msg: "上传失败"
                })
            }
            const fileUrl = `public/file/studentCourse/${req.course_name}`
            // 读取Excel文件
            const workbook = XLSX.readFile(fileUrl);

            // 获取第一个工作表
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // 解析数据
            const rawData = XLSX.utils.sheet_to_json(worksheet);

            // 处理解析后的数据
            const individualData = rawData.map(row => {
                return {
                    faculty: row['学院'],
                    name: row['姓名'],
                    sex: row['性别'],
                    ID: row['学号'],
                    grade: row['年级'],
                    classes: row['班级'],
                    levels: row['层次'],
                    semester: row['学期'],
                    phoneNumber: row['手机号'],
                    counsellor: row['辅导员'],
                    institution: row['机构'],
                    position: row['职位'],
                    chamber: row['寝室号']
                };
            });

            // 返回上传成功的提示和解析后的数据
            res.send({
                code: 0,
                msg: "文件上传成功",
                data: individualData
            });
        });
    } catch (error) {
        res.status(500).json({ message: '内部服务器错误' });
    }
});

//上传课程表
router.post("/upload", (req, res) => {
    try {
        courseCover_upload(req, res, async (err) => {
            //上传失败
            if (err) {
                return res.send({
                    code: 9,
                    msg: "上传失败"
                })
            }
            const fileUrl = `public/file/studentCourse/${req.course_name}`
            // 读取Excel文件
            const workbook = XLSX.readFile(fileUrl);

            // 获取第一个工作表
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[workbook.SheetNames];

            // 解析数据
            const data = XLSX.utils.sheet_to_json(worksheet, {header: 1});

            // 定义一个映射，将星期几的名称映射为数字
            const dayOfWeekMap = {
                '星期一': 1,
                '星期二': 2,
                '星期三': 3,
                '星期四': 4,
                '星期五': 5,
                '星期六': 6,
                '星期日': 7
            };

            // 初始化一个空数组来存储提取的课程信息
            var courseInfo = [];
            // 遍历数据并提取课程信息
            for (var i = 3; i < data.length; i++) {
                var timeOfDay = data[i][0] ? data[i][0].trim() : '';

                for (var j = 1; j < data[i].length; j++) {
                    var course = data[i][j] ? data[i][j].trim(): '';


                    if (course !== "") {
                        const dayOfWeekName = data[2][j] ? data[2][j].trim() : (data[3][j] ? data[3][j].trim() : '');// 获取星期几的名称
                        const dayOfWeek = dayOfWeekMap[dayOfWeekName]; // 将名称映射为数字
                        courseInfo.push({
                            week: dayOfWeek, // 将 week 赋予正确的值
                            timeOfDay: timeOfDay,
                            course: course
                        });
                    }
                }
            }

            // 打印提取的课程信息
            const parsedData = []
            sortCourseInfoByWeek(courseInfo).forEach(function (inputString) {
                // 解析每个输入字符串
                var parsedObjects = parseInputString(inputString.course);

                parsedObjects.forEach(function (parsedObject) {
                    parsedObject.week = inputString.week;
                    parsedData.push(parsedObject);
                });
            });
            let courseExcelUrl = path.resolve(__dirname, "../../public/file/studentCourse/" + req.course_name)
            fs.unlinkSync(courseExcelUrl)
            //上传成功
            res.send({
                code: 0,
                msg: "文件导入成功",
                data: removeDuplicates(parsedData)

            })
        })
    } catch (error) {
        res.status(500).json({ message: '内部服务器错误' });
    }
})

router.post("/userUpload", (req, res) => {
    try {
        courseCover_upload(req, res, async (err) => {
            //上传失败
            if (err) {
                return res.send({
                    code: 9,
                    msg: "上传失败"
                })
            }
            const fileUrl = `public/file/studentCourse/${req.course_name}`
            // 读取Excel文件
            const workbook = XLSX.readFile(fileUrl);

            // 获取第一个工作表
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[workbook.SheetNames];

            // 解析数据
            const data = XLSX.utils.sheet_to_json(worksheet, {header: 1});






        })
    } catch (error) {

        res.status(500).json({ message: '内部服务器错误' });
    }
})





let courseMany_upload  = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, path.join(__dirname, '../../public/file/studentCourse'))
        },
        filename(req, file, cb) {
            let { ext } = path.parse(file.originalname);
            let courseName = `course-${Date.now()}-${file.originalname}`;
            if (!req.course_names) {
                req.course_names = [];
            }
            req.course_names.push(courseName);
            cb(null, courseName);
        }
    })
}).array('files');

router.post("/uploadMany", (req, res) => {
    courseMany_upload (req, res, async (err) => {
        if (err) {
            return res.send({
                code: 9,
                msg: "上传失败"
            });
        }
        try {
            const dayOfWeekMap = {
                '星期一': 1,
                '星期二': 2,
                '星期三': 3,
                '星期四': 4,
                '星期五': 5,
                '星期六': 6,
                '星期日': 7
            };

            let allParsedData = [];
            let allClassInfo = [];

            for (let course_name of req.course_names) {
                const fileUrl = path.resolve(__dirname, "../../public/file/studentCourse", course_name);
                const workbook = XLSX.readFile(fileUrl);
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // 提取第二行数据
                const secondRow = data[1];
                const classInfo = extractClassInfo(secondRow);
                allClassInfo.push(classInfo);

                let courseInfo = [];
                for (let i = 3; i < data.length; i++) {
                    let timeOfDay = data[i][0] ? data[i][0].trim() : '';

                    for (let j = 1; j < data[i].length; j++) {
                        let course = data[i][j] ? data[i][j].trim() : '';

                        if (course !== "") {
                            const dayOfWeekName = data[2][j] ? data[2][j].trim() : (data[3][j] ? data[3][j].trim() : '');
                            const dayOfWeek = dayOfWeekMap[dayOfWeekName];
                            courseInfo.push({
                                week: dayOfWeek,
                                timeOfDay: timeOfDay,
                                course: course
                            });
                        }
                    }
                }

                const parsedData = [];
                sortCourseInfoByWeek(courseInfo).forEach(function (inputString) {
                    let parsedObjects = parseInputString(inputString.course);

                    parsedObjects.forEach(function (parsedObject) {
                        parsedObject.week = inputString.week;
                        parsedData.push(parsedObject);
                    });
                });

                fs.unlinkSync(fileUrl);
                allParsedData =allParsedData.concat(filterNonNullData(removeDuplicates(parsedData))) ;

            }
           await courseClass(allClassInfo,allParsedData)
            res.send({
                code: 0,
                msg: "文件导入成功",
                data: {
                    courses: allParsedData,
                    classes: allClassInfo
                }
            });
        } catch (error) {

            res.status(500).json({ message: '内部服务器错误' });
        }
    });
});


function extractClassInfo(secondRow) {
    const gradeString = secondRow.find(cell => cell && cell.includes('年级：'));
    const classString = secondRow.find(cell => cell && cell.includes('班级：'));

    const gradeMatch = gradeString ? gradeString.match(/年级：(\d{4})/) : null;
    const cleanClassString = classString ? classString.replace(/\[.*?\]/g, '') : ''; // 移除方括号及其内容
    const classMatch = cleanClassString ? cleanClassString.match(/班级：(\d{4})([^()]*)(?:\(([^()]+)\))?(\d+)/) : null;

    const grade = gradeMatch ? gradeMatch[1] + '级' : '';
    const className = classMatch ? classMatch[2].trim() + classMatch[4] + '班' : '';
    const level = classMatch && classMatch[3] ? classMatch[3] : '本';
    console.log(grade, level, className)
    return {
        grade,
        level,
        class: className
    };
}
// 定义一个函数来过滤数据，排除特定属性为 null 的情况
function filterNonNullData(data) {
    return data.filter(item => {
        if (
            item.name === null ||
            item.num === null ||
            item.section === null ||
            item.sectionCount === null
        ) {
            return false; // 如果特定属性有任何一个为 null，就排除该数据
        }
        return true; // 如果所有特定属性都不为 null，保留该数据
    });
}
async function courseClass(allClassInfo, allParsedData) {
    try {
        let termName = semesterCourseUtils() || "暂无";

        const getCoursesList = (courses) => courses.map(course => ({
            name: course.name || "暂无",
            num: course.num || "暂无",
            credit: course.totalHours || "暂无",
            lectureHours: course.lectureHours || "暂无",
            computeHours: course.computeHours || "暂无",
            category: course.category || "暂无",
            teachMethod: course.teachMethod || "暂无",
            method: course.method || "暂无",
            teacher: course.teacher || "暂无",
            weeks: course.weeks || [0],
            section: course.section || 0,
            address: course.address || "暂无",
            rawWeeks: course.rawWeeks || "暂无",
            rawSection: course.rawSection || "暂无",
            week: course.week || 0,
            sectionCount: course.sectionCount || 0
        }));

        for (let classInfo of allClassInfo) {
            // 查询 ClassInfo 记录，只处理查询到的记录
            let existingClass = await classInfoDB.findOne({
                grade: classInfo.grade,
                class: classInfo.class,
                level: classInfo.level
            });

            if (!existingClass) {
                // 如果没有找到 ClassInfo，则跳过该记录
                console.log(`No ClassInfo found for grade ${classInfo.grade}, class ${classInfo.class}. Skipping...`);
                continue;
            }

            // 查询 aiCourse 记录
            let existingAiCourse = await aiCourseDB.findOne({
                courseInfoId: existingClass._id,
                termName: termName,
                grade: classInfo.grade,
                className: classInfo.class,
                level: classInfo.level
            });

            if (existingAiCourse) {
                // 更新现有的 aiCourse 记录
                existingAiCourse.coursesList = getCoursesList(allParsedData);
                await existingAiCourse.save();
            } else {
                // 如果没有找到 aiCourse，创建新的 aiCourse 记录
                let newAiCourse = new aiCourseDB({
                    courseInfoId: existingClass._id,
                    termName: termName,
                    grade: classInfo.grade,
                    className: classInfo.class,
                    level: classInfo.level,
                    coursesList: getCoursesList(allParsedData)
                });
                await newAiCourse.save();
            }
        }

        console.log("Course information processed successfully.");
        return { success: true };
    } catch (error) {
        console.error("Error processing course information:", error);
        throw error;
    }
}

// router.post('/uploadCourses', async (req, res) => {
//     try {
//         // 检查是否上传了课程数据
//         if (!req.body.courses || req.body.courses.length === 0) {
//             return res.status(400).json({ message: '没有课程数据可上传' });
//         }
//
//
//
//
//         // 返回成功响应
//         res.status(200).json({
//             code: 0,
//             msg: "课程信息存储成功",
//             data: {
//                 courses: savedCourses,
//                 classes: savedClasses
//             }
//         });
//     } catch (error) {
//         console.error("Error storing course information:", error);
//         res.status(500).json({ message: '内部服务器错误' });
//     }
// });

// async function courseClass(allClassInfo, allParsedData) {
//     console.log(allClassInfo, allParsedData)
//     try {
//         for (let classInfo of allClassInfo) {
//             // 查询 ClassInfo 记录
//             let existingClass = await classInfoDB.findOne({
//                 grade: classInfo.grade,
//                 class: classInfo.class,
//                 level: classInfo.level
//             });
//
//             if (existingClass) {
//
//
//                 // 构造 aiCourse 数据
//                 let aiCourseData = {
//                     courseInfoId: existingClass._id, // 关联到 ClassInfo 的 ObjectId
//                     termName: getCurrentSemester() || "暂无",
//                     grade: classInfo.grade,
//                     className: classInfo.class,
//                     level: classInfo.level,
//                     coursesList: [] // 存储具体课程信息
//                 };
//
//                 // 遍历所有课程信息
//                 for (let course of allParsedData) {
//                     // 构造课程对象并添加到 coursesList 中
//                     let courseData = {
//                         name: course.name || "暂无",
//                         num: course.num || "暂无",
//                         credit: course.credit || "暂无",
//                         totalHours: course.totalHours || "暂无",
//                         lectureHours: course.lectureHours || "暂无",
//                         computeHours: course.computeHours || "暂无",
//                         category: course.category || "暂无",
//                         teachMethod: course.teachMethod || "暂无",
//                         method: course.method || "暂无",
//                         teacher: course.teacher || "暂无",
//                         weeks: course.weeks || [0],
//                         section: course.section || 0,
//                         address: course.address || "暂无",
//                         rawWeeks: course.rawWeeks || "暂无",
//                         rawSection: course.rawSection || "暂无",
//                         week: course.week || 0,
//                         sectionCount: course.sectionCount || 0
//                     };
//
//                     aiCourseData.coursesList.push(courseData); // 将课程信息添加到 aiCourse 数据中的 coursesList
//                 }
//
//                 // 创建并保存 aiCourse 记录
//                 let createdCourse = await aiCourseDB.create(aiCourseData);
//                 console.log(createdCourse)
//
//             }
//         }
//
//
//     } catch (error) {
//         console.error("Error storing course information:", error);
//         throw error; // 抛出错误以供调用者处理
//     }
// }

module.exports = router
