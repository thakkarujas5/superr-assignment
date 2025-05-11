const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const { authorize } = require('../middleware/auth');

module.exports = router;

const db = require('../db'); 

router.post('/session', authorize(['TEACHER']),async (req, res) => {

    const eventType = req.body.event_type;
    const schoolId = req.body.school_id;
    const classId = req.body.class_id;
    const sessionId = req.body.session_id;
    const timestamp = req.body.timestamp;

    try {

        if (eventType === "SESSION_STARTED") {

            const [result] = await db.query(
                `INSERT INTO Sessions (school_id,class_id, start_time)
                VALUES (:school_id, :class_id, :start_time)
                `, {
                    replacements: {
                        school_id: schoolId,
                        class_id: classId,
                        start_time: new Date(timestamp)
                    }
                }
            );

            return res
                .status(200)
                .json({
                    message: "Event Inserted Successfully!",
                    sessionId: result
                })
        } else {

            const session = await db.query(`
                SELECT * FROM Sessions WHERE id = :session_id `, {
                replacements: {
                    session_id: sessionId
                },
                type: sequelize.QueryTypes.SELECT
            });


            await db.query(`
                UPDATE Sessions SET end_time = :endTime, duration= :duration`, {
                replacements: {
                    endTime: new Date(timestamp),
                    duration: Math.floor((new Date(new Date(timestamp).getTime() + (5.5 * 60 * 60 * 1000)) - new Date(session[0]?.start_time)))
                },
                type: sequelize.QueryTypes.UPDATE
            });

            return res
                .status(200)
                .json({
                    message: "Event Updated Succesfully"
                })
        }

    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({
                message: "Internal Server Error!"
            })
    }
})

router.post('/heartbeat', authorize(['TEACHER', 'STUDENT']),async (req, res) => {

    const sessionId = req.body.session_id;
    const eventType = req.body.event_type;
    const studentId = req.body.student_id;
    try {

        if (eventType === "CONTENT_MARKED") {

            await db.query(`INSERT INTO Session_Heartbeats (session_id, type)
            VALUES (:session_id, :type)`, {
                replacements: {
                    session_id: sessionId,
                    type: eventType
                },
                type: sequelize.QueryTypes.INSERT
            })
        } else {

            await db.query(`INSERT INTO Session_Heartbeats (session_id, type, student_id)
            VALUES (:session_id, :type, :student_id)`, {
                replacements: {
                    session_id: sessionId,
                    type: eventType,
                    student_id: studentId
                },
                type: sequelize.QueryTypes.INSERT
            })
        }

        return res
            .status(200)
            .json({
                message: "Heartbeat registered successfully!"
            })

    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({
                message: "Internal Server Error!"
            })
    }
})

router.post('/quiz', authorize(['TEACHER']),async (req, res) => {

    const eventType = req.body.event_type;
    const timestamp = req.body.timestamp;
    const sessionId = req.body.session_id;
    const schoolId = req.body.school_id;
    const classId = req.body.class_id;
    const quizId = req.body.quiz_id;

    try {

        if (eventType === "QUIZ_STARTED") {

            const [result] = await db.query(
                `INSERT INTO Quiz (start_time, session_id)
                VALUES (:start_time, :session_id)
                `, {
                    replacements: {
                        start_time: new Date(timestamp),
                        session_id: sessionId
                    }
                }
            );


            return res
                .status(200)
                .json({
                    message: "Quiz Created Successfully!",
                    quizId: result
                })

        } else {

            const quiz = await db.query(`
                SELECT * FROM Quiz WHERE quiz_id = :quiz_id `, {
                replacements: {
                    quiz_id: quizId
                },
                type: sequelize.QueryTypes.SELECT
            });

            await db.query(`
                UPDATE Quiz SET end_time = :endTime, duration= :duration WHERE quiz_id = :quiz_id`, {
                replacements: {
                    endTime: new Date(timestamp),
                    duration: Math.floor((new Date(new Date(timestamp).getTime() + (5.5 * 60 * 60 * 1000)) - new Date(quiz[0]?.start_time))),
                    quiz_id: quizId
                },
                type: sequelize.QueryTypes.UPDATE
            });

            return res
                .status(200)
                .json({
                    message: "Quiz Updated Successfully"
                })
        }
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({
                message: "Internal Server Error!"
            })
    }
})

router.post('/answer', authorize(['STUDENT']),async (req, res) => {

    const timestamp = req.body.timestamp;
    const quizId = req.body.quiz_id;
    const questionId = req.body.question_id;
    const studentId = req.body.student_id;
    const result = req.body.result;
    const duration = req.body.duration;

    try {

        await db.query(`INSERT INTO Answers (quiz_id, question_id, student_id, result, start_time, duration)
        VALUES (:quiz_id, :question_id, :student_id, :result, :start_time, :duration)`, {
            replacements: {
                quiz_id: quizId,
                question_id: questionId,
                student_id: studentId,
                result: result,
                start_time: new Date(timestamp),
                duration: duration
            }
        });

        return res
            .status(200)
            .json({
                message: "Answer submitted successfully!"
            })
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({
                message: "Internal Server Error!"
            })
    }
})