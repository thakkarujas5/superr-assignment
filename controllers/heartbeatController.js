const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); 
const sequelize = require('sequelize');

const heartbeat = async (req, res) => {

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
}

const heartbeatControllers = {
    heartbeat
};

module.exports = heartbeatControllers;