const express = require('express');
const db = require('../config/db'); 
const sequelize = require('sequelize');

const quiz = async (req, res) => {

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
}

const quizControllers = {
    quiz
};

module.exports = quizControllers;