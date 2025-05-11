const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const { authorize } = require('../middleware/auth');

module.exports = router;

const db = require('../db');

router.get('/student-performance', authorize(['TEACHER', 'ADMIN']),async (req, res) => {

    const sessionId = req.body.session_id;

    const result = [];

    try {

        const existingReport = await db.query(`SELECT report FROM ReportCache WHERE session_id = :session_id AND report_type='student performance'`, {
            replacements: {
                session_id: sessionId
            },
            type: sequelize.QueryTypes.SELECT
        });

        if(!existingReport) {
            const quizzes = await db.query(`SELECT quiz_id FROM Quiz WHERE session_id = :session_id`, {
                replacements: {
                    session_id: sessionId
                },
                type: sequelize.QueryTypes.SELECT
            });
    
            for (let i = 0; i < quizzes.length; i++) {
    
                const scores = await db.query(`SELECT student_id, SUM(result) AS score
                FROM Answers
                WHERE quiz_id = :quiz_id
                GROUP BY student_id;`, {
                    replacements: {
                        quiz_id: quizzes[i]?.quiz_id
                    },
                    type: sequelize.QueryTypes.SELECT
                });
    
                const avgscore = await db.query(`SELECT AVG(student_score) AS avg_score
                FROM (
                    SELECT SUM(result) AS student_score
                    FROM Answers
                    WHERE quiz_id = :quiz_id
                    GROUP BY student_id
                ) AS scores`, {
                    replacements: {
                        quiz_id: quizzes[i]?.quiz_id
                    },
                    type: sequelize.QueryTypes.SELECT
                })
    
                const highestScore = await db.query(`SELECT MAX(student_score) AS highest_score
                FROM (
                    SELECT SUM(result) AS student_score
                    FROM Answers
                    WHERE quiz_id = :quiz_id
                    GROUP BY student_id
                ) AS scores`, {
                    replacements: {
                        quiz_id: quizzes[i]?.quiz_id
                    },
                    type: sequelize.QueryTypes.SELECT
                })
    
                const lowestScore = await db.query(`SELECT MIN(student_score) AS lowest_score
                FROM (
                    SELECT SUM(result) AS student_score
                    FROM Answers
                    WHERE quiz_id = :quiz_id
                    GROUP BY student_id
                ) AS scores`, {
                    replacements: {
                        quiz_id: quizzes[i]?.quiz_id
                    },
                    type: sequelize.QueryTypes.SELECT
                });
    
                const avgDuration = await db.query(
                    `SELECT AVG(duration) AS avg_answer_time FROM Answers WHERE quiz_id = :quiz_id`, {
                        replacements: {
                            quiz_id: quizzes[i]?.quiz_id
                        },
                        type: sequelize.QueryTypes.SELECT
                    }
                );
    
    
                result.push({
                    quizId: quizzes[i]?.quiz_id,
                    scores: scores,
                    averageScore: avgscore,
                    highestScore: highestScore,
                    lowestScore: lowestScore,
                    avgDuration: avgDuration
                })
            }
    
            await db.query(`INSERT INTO ReportCache (session_id, report_type, report)
            VALUES (:session_id, :report_type, :report)`, {
                replacements: {
                    session_id: sessionId,
                    report_type: 'student performance',
                    report: JSON.stringify(result)
                }
            })
    
            return res
                .status(200)
                .json({
                    message: "Report Fetched Successfully",
                    report: result
                });
        }

        return res
            .status(200)
            .json({
                message: "Report Fetched Successfully",
                report: existingReport[0]?.report
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

router.get('/classroom-engagement', authorize(['TEACHER', 'ADMIN']),async (req, res) => {

    const sessionId = req.body.session_id;
    const TOTAL_STUDENTS = 30;
    const result = [];
    try {

        const existingReport = await db.query(`SELECT report FROM ReportCache WHERE session_id = :session_id AND report_type='classroom engagement'`, {
            replacements: {
                session_id: sessionId
            },
            type: sequelize.QueryTypes.SELECT
        });

        if (existingReport.length === 0) {

            // This query is not related to a quiz, can be taken outside
            // // 3. Avg number of hours spent revisiting contents of a session
            // // (Assuming duration is in seconds in Session_Heartbeats, adjust if ms)
            const [reviewed] = await db.query(
                `SELECT 
                IFNULL(ROUND(COUNT(*) / NULLIF(COUNT(DISTINCT student_id), 0), 2), 0) AS avg_reviews_per_student
             FROM Session_Heartbeats
             WHERE session_id = :session_id
               AND type = 'SESSION_REVIEWED'`, {
                    replacements: {
                        session_id: sessionId
                    },
                    type: sequelize.QueryTypes.SELECT
                }
            );


            const [notesTaken] = await db.query(
                `SELECT COUNT(DISTINCT student_id) AS students_taking_notes
             FROM Session_Heartbeats
             WHERE session_id = :session_id
               AND type = 'NOTE_TAKEN'`, {
                    replacements: {
                        session_id: sessionId
                    },
                    type: sequelize.QueryTypes.SELECT
                }
            );

            const quizzes = await db.query(`SELECT quiz_id FROM Quiz WHERE session_id = :session_id`, {
                replacements: {
                    session_id: sessionId
                },
                type: sequelize.QueryTypes.SELECT
            });

            for (let i = 0; i < quizzes.length; i++) {
                const quizId = quizzes[i]?.quiz_id;

                // 1. Number of students participating in the quiz
                const [participating] = await db.query(
                    `SELECT COUNT(DISTINCT student_id) AS students_participated
                 FROM Answers
                 WHERE quiz_id = :quiz_id`, {
                        replacements: {
                            quiz_id: quizId
                        },
                        type: sequelize.QueryTypes.SELECT
                    }
                );



                const [completed] = await db.query(
                    `SELECT COUNT(*) AS students_completed
                 FROM (
                     SELECT student_id
                     FROM Answers
                     WHERE quiz_id = :quiz_id
                     GROUP BY student_id
                     HAVING COUNT(DISTINCT question_id) = (
                         SELECT COUNT(*) FROM Question WHERE quiz_id = :quiz_id
                     )
                 ) AS completed_students`, {
                        replacements: {
                            quiz_id: quizId
                        },
                        type: sequelize.QueryTypes.SELECT
                    }
                );


                result.push({
                    quizId: quizId,
                    studentsParticipated: participating.students_participated,
                    studentsParticipatedOutOf: TOTAL_STUDENTS,
                    studentsCompleted: completed.students_completed,
                    studentsCompletedOutOf: TOTAL_STUDENTS,
                });
            }

            const obj = {
                avgHoursRevisiting: reviewed.avg_reviews_per_student,
                studentsTakingNotes: notesTaken.students_taking_notes,
                result: result
            }

            await db.query(`INSERT INTO ReportCache (session_id, report_type, report)
        VALUES (:session_id, :report_type, :report)`, {
                replacements: {
                    session_id: sessionId,
                    report_type: 'classroom engagement',
                    report: JSON.stringify(obj)
                }
            })

            return res
            .status(200)
            .json({
                message: "Classroom Engagement Report Fetched Successfully",
                report: obj
            });
        }

        return res
            .status(200)
            .json({
                message: "Classroom Engagement Report Fetched Successfully",
                report: existingReport[0]?.report
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

router.get('/content-effectiveness', authorize(['TEACHER', 'ADMIN']),async (req, res) => {

    const sessionId = req.body.session_id;
    const result = {};

    try {

        const existingReport = await db.query(`SELECT report FROM ReportCache WHERE session_id = :session_id AND report_type='content effectiveness'`, {
            replacements: {
                session_id: sessionId
            },
            type: sequelize.QueryTypes.SELECT
        });

        if(existingReport.length === 0) {
            const [session] = await db.query(
                `SELECT start_time, end_time FROM Sessions WHERE id = :session_id`, {
                    replacements: {
                        session_id: sessionId
                    },
                    type: sequelize.QueryTypes.SELECT
                }
            );
    
            let contentCreationPercent = null;
            if (session && session.start_time && session.end_time) {
    
                const [heartbeatCount] = await db.query(
                    `SELECT COUNT(*) AS count FROM Session_Heartbeats WHERE session_id = :session_id`, {
                        replacements: {
                            session_id: sessionId
                        },
                        type: sequelize.QueryTypes.SELECT
                    }
                );
                const sessionDurationMs = new Date(session.end_time) - new Date(session.start_time);
                const sessionDurationMinutes = sessionDurationMs / (1000 * 60);
                // % of time with heartbeats (capped at 100%)
                contentCreationPercent = sessionDurationMinutes > 0 ?
                    Math.min(100, Math.round((heartbeatCount.count / sessionDurationMinutes) * 100)) :
                    0;
            }
    
            const quizzes = await db.query(
                `SELECT quiz_id FROM Quiz WHERE session_id = :session_id`, {
                    replacements: {
                        session_id: sessionId
                    },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            let totalParticipants = 0;
            for (let i = 0; i < quizzes.length; i++) {
                const quizId = quizzes[i].quiz_id;
                const [participants] = await db.query(
                    `SELECT COUNT(DISTINCT student_id) AS count FROM Answers WHERE quiz_id = :quiz_id`, {
                        replacements: {
                            quiz_id: quizId
                        },
                        type: sequelize.QueryTypes.SELECT
                    }
                );
                totalParticipants += participants.count;
            }
            const avgQuizParticipation = quizzes.length > 0 ?
                (totalParticipants / quizzes.length) :
                0;
    
            const [reviewers] = await db.query(
                `SELECT COUNT(DISTINCT student_id) AS count
                     FROM Session_Heartbeats
                     WHERE session_id = :session_id AND type = 'SESSION_REVIEWED'`, {
                    replacements: {
                        session_id: sessionId
                    },
                    type: sequelize.QueryTypes.SELECT
                }
            );
    
            let totalAvgResponseTime = 0;
            let questionCount = 0;
            for (let i = 0; i < quizzes.length; i++) {
                const quizId = quizzes[i].quiz_id;
                const questions = await db.query(
                    `SELECT question_id FROM Question WHERE quiz_id = :quiz_id`, {
                        replacements: {
                            quiz_id: quizId
                        },
                        type: sequelize.QueryTypes.SELECT
                    }
                );
                for (let j = 0; j < questions.length; j++) {
                    const questionId = questions[j].question_id;
                    const [avgDuration] = await db.query(
                        `SELECT AVG(duration) AS avg_duration FROM Answers WHERE question_id = :question_id`, {
                            replacements: {
                                question_id: questionId
                            },
                            type: sequelize.QueryTypes.SELECT
                        }
                    );
                    if (avgDuration.avg_duration !== null) {
                        totalAvgResponseTime += Number(avgDuration.avg_duration);
                        questionCount++;
                    }
                }
            }
            const avgResponseTimePerQuestion = questionCount > 0 ?
                (totalAvgResponseTime / questionCount) :
                0;
    
    
            result.contentCreationPercent = contentCreationPercent;
            result.avgQuizParticipation = avgQuizParticipation;
            result.studentsReviewingMaterials = reviewers.count;
            result.avgResponseTimePerQuestion = avgResponseTimePerQuestion;
    
            await db.query(`INSERT INTO ReportCache (session_id, report_type, report)
            VALUES (:session_id, :report_type, :report)`, {
                    replacements: {
                        session_id: sessionId,
                        report_type: 'content effectiveness',
                        report: JSON.stringify(result)
                    }
                })
    
            return res.status(200).json({
                message: "Content Effectiveness Report Fetched Successfully",
                report: result
            });
        }

        return res
            .status(200)
            .json({
                message: "Content Effectiveness Report Fetched Successfully",
                report: existingReport[0]?.report
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