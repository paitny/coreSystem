// routes/exam.js

const express = require('express');
const router = express.Router();
const Question = require('../../db/question');
const path = require('path')
const fs=require("fs")
const Exam = require('../../db/publishedIssues');
const UserExam = require('../../db/userExam');
// Store the start time and end time of the exam


// router.get('/random-exam', async (req, res) => {
//     try {
//         const { examId } = req.query;
//         console.log(examId)
//         // 按ID查找考试
//         const exam = await Exam.findById(examId);
//
//         // 检查检查是否存在
//         if (!exam) {
//             return res.status(404).json({ error: '考试不存在' });
//         }
//
//         // 检查是否在考试时间内
//         const currentTime = new Date();
//         if (currentTime < exam.startTime || currentTime > exam.endTime) {
//             return res.status(403).json({ error: '目前不在考试时间内。' });
//         }
//
//         // 随机抽取10道单选题
//         const singleChoiceQuestions = await getRandomQuestions('single-choice', 10);
//
//         // 随机抽取10道填空题
//         const fillInTheBlankQuestions = await getRandomQuestions('fill-in-the-blank', 10);
//
//         // 随机选择3道作文题
//         const essayQuestions = await getRandomQuestions('essay', 3);
//
//         const examData = {
//             startTime: exam.startTime,
//             endTime: exam.endTime,
//             singleChoiceQuestions,
//             fillInTheBlankQuestions,
//             essayQuestions,
//         };
//
//         res.json(examData);
//     } catch (error) {
//         console.error('Failed to generate random exam:', error);
//         res.status(500).json({ error: '内部服务器错误' });
//     }
// });


// async function getRandomQuestions(type, count, targetsUser) {
//     const questions = await Question.aggregate([
//         { $match: { type, targetsUser } },
//         { $sample: { size: count } }
//     ]);
//
//     return questions;
// }

router.get('/random-exam', async (req, res) => {
    try {
        const {examId, targetsUser} = req.query;
        console.log(examId, targetsUser )
        const exam = await Exam.findById(examId);
        if (!targetsUser) {
            return res.status(404).json({error: '你不是部长或者干事，无法参加考试'});
            // 检查检查是否存在
        } else if (!exam) {
            return res.status(404).json({error: '考试不存在'});
        }

        // 检查是否在考试时间内
        const currentTime = new Date();
        if (currentTime < exam.startTime || currentTime > exam.endTime) {
            return res.status(403).json({error: '目前不在考试时间内。'});
        }

        // 随机抽取12道单选题
        const singleChoiceQuestions = await getRandomQuestions('single-choice', 20, targetsUser);

        // 随机抽取10道填空题
        const fillInTheBlankQuestions = await getRandomQuestions('fill-in-the-blank', 10, targetsUser);

        // 随机选择4道主观题
        const essayQuestions = await getRandomQuestions('essay', 0, targetsUser);
        const thinkingQuestions = await getRandomQuestions('thinking', 0, targetsUser);
        const examData = {
            termTopic:exam.termTopic,
            startTime: exam.startTime,
            endTime: exam.endTime,
            singleChoiceQuestions,
            fillInTheBlankQuestions,
            thinkingQuestions,
            essayQuestions,
        };
        res.json(examData);
    } catch (error) {
        console.error('Failed to generate random exam:', error);
        res.status(500).json({error: '内部服务器错误'});
    }
});


router.get('/random-exam-question', async (req, res) => {
    try {
        const examId='672f090da35740ed7c6ac0f5'
       const targetsUser='部长'

        console.log(examId, targetsUser )
        const exam = await Exam.findById(examId);
        console.log(exam)
        // if (!targetsUser) {
        //     return res.status(404).json({error: '你不是部长或者干事，无法参加考试'});
        //     // 检查检查是否存在
        // } else if (!exam) {
        //     return res.status(404).json({error: '考试不存在'});
        // }

        // // 检查是否在考试时间内
        // const currentTime = new Date();
        // if (currentTime < exam.startTime || currentTime > exam.endTime) {
        //     return res.status(403).json({error: '目前不在考试时间内。'});
        // }

        // 随机抽取12道单选题
        const singleChoiceQuestions = await getRandomQuestions('single-choice', 100, targetsUser);

        // 随机抽取10道填空题
        const fillInTheBlankQuestions = await getRandomQuestions('fill-in-the-blank', 100, targetsUser);

        // 随机选择4道主观题
        const essayQuestions = await getRandomQuestions('essay', 100, targetsUser);
        const thinkingQuestions = await getRandomQuestions('thinking', 100, targetsUser);
        const examData = {

            singleChoiceQuestions,
            fillInTheBlankQuestions,
            thinkingQuestions,
            essayQuestions,
        };
        console.log(examData)
        res.json(examData);

    } catch (error) {
        console.error('Failed to generate random exam:', error);
        res.status(500).json({error: '内部服务器错误'});
    }
});


// // Helper函数，用于获取指定数量的给定类型的随机问题
async function getRandomQuestions(type, count, targetsUser) {
    try {
        const randomQuestions = await Question.aggregate([
            {$match: {type, targetsUser}},
            {$sample: {size: count}},
        ]);
        return randomQuestions;
    } catch (error) {
        console.error(`Failed to get random ${type} questions:`, error);
        throw error;
    }
}


// 获取所有考试的路由
router.get('/exams', async (req, res) => {
    try {
        const exams = await Exam.find().sort({date:-1});
        res.json(exams);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


router.post('/saveQuestions', (req, res) => {
    const {questions} = req.body;
    try{
    if (!questions || !Array.isArray(questions)) {
        return res.status(400).json({error: 'Invalid request format'});
    }

    // 插入数据到数据库
    Question.insertMany(questions)
        .then((insertedQuestions) => {
            res.status(201).json({success: true, questions: insertedQuestions});
        })
        .catch((error) => {
            console.error('Error inserting questions:', error);
            res.status(500).json({error: 'Internal Server Error'});
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
});


// 保存用户试卷
// router.post('/saveUserExam', async (req, res) => {
//     try {
//         const { userId,examineId, examData } = req.body;
//
//         // 将空字符串答案设置为"未作答"
//         for (const questionType in examData) {
//             if (examData.hasOwnProperty(questionType)) {
//                 const questions = examData[questionType];
//                 for (const question of questions) {
//                     if (question.answer === '') {
//                         question.answer = '未作答';
//                     }
//                 }
//             }
//         }
//
//         // 检查是否已存在该用户的试卷数据
//         const existingUserExam = await UserExam.findOne({ userId });
//
//         if (existingUserExam) {
//             // 如果已存在，可以选择更新现有数据或返回错误
//             return res.status(400).json({ msg: '试卷已提交无需重复操作' });
//         }
//
//         // 计算单选题总分
//         let singleChoiceScore = 0;
//         for (const question of examData.singleChoiceQuestions) {
//             // 查询数据库中对应题目的正确答案
//             const correctAnswer = await Question.findById(question.id);
//
//             // 判断用户答案是否正确，如果正确加5分
//             if (correctAnswer && correctAnswer.answer === question.answer) {
//                 singleChoiceScore += 5;
//             }
//         }
//
//         // 创建用户试卷数据
//         const userExam = new UserExam({
//             userId,
//             examineId,
//             examData,
//             singleChoiceScore,
//             totalScore:singleChoiceScore
//         });
//
//         // 保存用户试卷数据到数据库
//        await userExam.save();
//
//         res.status(201).json({ msg:"试卷提交成功" });
//     } catch (error) {
//         console.error('Error saving user exam data:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
//检测该用户是否交卷
router.post('/saveUserExam', async (req, res) => {
    try {
        const {userId, termTopic, examineId, examData} = req.body;
        console.log(userId, termTopic, examineId, examData )
        // 将空字符串答案设置为 "未作答"，并添加参考答案到每个问题对象
        for (const questionType in examData) {
            if (examData.hasOwnProperty(questionType)) {
                const questions = examData[questionType];
                for (const question of questions) {
                    if (question.answer === '') {
                        question.answer = '未作答';
                    }

                    // 从数据库查询并添加参考答案到每个问题对象
                    question.correctAnswer = await getCorrectAnswer(question.id);
                }
            }
        }

        // 检查用户试卷数据是否已存在
        const existingUserExam = await UserExam.findOne({
            $and: [
                {userId: userId},
                {examineId: examineId}
            ]
        });

        if (existingUserExam) {
            return res.status(400).json({msg: '您已作答完毕无需重复提交'});
        }

        // 计算单选题总分
        let singleChoiceScore = 0;
        for (const question of examData.singleChoiceQuestions) {
            // 查询数据库中对应题目的正确答案
            const correctAnswer = await Question.findById(question.id);

            // 判断用户答案是否正确，如果正确加5分
            if (correctAnswer && correctAnswer.answer === question.answer) {
                singleChoiceScore += 2.5;
            }
        }

        // 创建用户试卷数据
        const userExam = new UserExam({
            userId,
            examineId,
            termTopic,
            examData,
            singleChoiceScore,
            totalScore: singleChoiceScore
        });

        // 将用户试卷数据保存到数据库
        await userExam.save();

        res.status(201).json({msg: '试卷提交成功\n即将退出答题界面'});
    } catch (error) {
        console.error('保存用户试卷数据时出错:', error);
        res.status(500).json({error: '内部服务器错误\n请联系管理人员'});
    }
});

// 获取问题ID对应的正确答案的函数
async function getCorrectAnswer(questionId) {
    try {
        const question = await Question.findById(questionId);
        return question ? question.answer : null;
    } catch (error) {
        console.error('检索问题时出错:', error);
        throw error;
    }
}

router.post('/checkSaveUserExam', async (req, res) => {
    try {
        const {examId, userId} = req.body;

        // 使用 $and 操作符同时满足两个条件
        const existingUserExam = await UserExam.findOne({
            $and: [
                {userId: userId},
                {examineId: examId}
            ]
        });

        // 检查是否已存在该用户的试卷数据
        const exam = await Exam.findById(examId);

        // 检查是否在考试时间内
        const currentTime = new Date();
        if (currentTime < exam.startTime || currentTime > exam.endTime) {
            return res.status(403).json({msg: '目前不在考试时间范围内。'});
        } else if (existingUserExam) {
            // 如果已存在，可以选择更新现有数据或返回错误
            return res.status(400).json({msg: '你已经答题过了哟'});
        }

        res.status(200).json({msg: '请开始答题'});
    } catch (error) {
        console.error('Error saving user exam data:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// 定义一个路由，根据 userId 获取相关考试数据
router.get('/userScore', async (req, res) => {
    try {
        const {userId} = req.query;

        // 查找符合指定 userId 的考试数据
        const userExams = await UserExam.find({userId});

        if (!userExams || userExams.length === 0) {
            return res.status(404).json({message: '未找到符合该 userId 的考试数据'});
        }

        // 将考试数据以 JSON 形式发送响应
        res.status(200).json(userExams);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '内部服务器错误'});
    }
});
router.post('/upload', async (req, res) => {
    const filePath = path.join(__dirname, '../../dataJson/question.json');

    fs.readFile(filePath, 'utf8', async (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading file', error: err.message });
        }

        try {
            const questionsData = JSON.parse(data).questions;
            const questions = await Question.create(questionsData);
            console.log(questions)
            res.status(201).json(questions);
        } catch (err) {
            res.status(400).json({ message: 'Error inserting data', error: err.message });
        }
    });
});

router.post('/upload', async (req, res) => {
    const filePath = path.join(__dirname, '../../dataJson/question.json');

    fs.readFile(filePath, 'utf8', async (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading file', error: err.message });
        }

        try {
            const questionsData = JSON.parse(data).questions;

            // Validate each question before inserting
            for (const questionData of questionsData) {
                const question = new Question(questionData);
                await question.validate();
            }

            const questions = await Question.insertMany(questionsData);
            res.status(201).json(questions);
        } catch (err) {
            res.status(400).json({ message: 'Error inserting data', error: err.message });
        }
    });
});
module.exports = router;


