const express = require("express")
const router = express.Router()
const ApplicationDB=require("../../db/applicationOrg")
const getCurrentSemester = require("../../utils/semesterUtils")
router.post('/application', async (req, res) => {
    try {
        const { name, sex, ID, grade, classes, phoneNumber, counsellor, organizationValue, departmentValue } = req.body;

        // Check if an application with the same ID already exists
        const existingApplication = await ApplicationDB.findOne({ ID });
        if (existingApplication) {
            return res.status(400).json({ msg: '学号已存在，不能重复提交' });
        }

        // Create a new application document
        const application = new ApplicationDB({
            name,
            sex,
            ID,
            grade,
            classes,
            phoneNumber,
            counsellor,
            organizationValue,
            departmentValue,
            semester:getCurrentSemester()
        });

        await application.save(); // Save the application to the database
        res.status(201).json({ msg: '报名成功', application });
    } catch (error) {
        res.status(500).json({ msg: '服务器错误', error: error.message });
    }
});
module.exports = router
