const express = require('express');
const sequelize = require('sequelize');
const db = require('../config/db'); 

const answer = async (req, res) => {

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
};

const answerController = {
    answer
};

module.exports = answerController;