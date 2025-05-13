const express = require('express');
const sequelize = require('sequelize');
const db = require('../config/db'); 

const sessionEvent = async (req, res) => {

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
}

const sessionController = {
    sessionEvent
};

module.exports = sessionController;