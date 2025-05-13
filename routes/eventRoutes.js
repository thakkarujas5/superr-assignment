const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/auth');
const eventLogger = require('../middleware/eventLogger');

const sessionController = require('../controllers/sessionController');
const heartbeatControllers = require('../controllers/heartbeatController');
const quizControllers = require('../controllers/quizController');
const answerController = require('../controllers/answerController');

router.use(eventLogger);

/**
 * @swagger
 * /events/v1/session:
 *   post:
 *     summary: Manage session events
 *     description: Create or update a session event. When ending a session, session_id is required.
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_type
 *               - school_id
 *               - class_id
 *               - timestamp
 *             properties:
 *               event_type:
 *                 type: string
 *                 enum: [SESSION_STARTED, SESSION_ENDED]
 *                 description: Type of session event (start or end)
 *                 example: "SESSION_STARTED"
 *               school_id:
 *                 type: integer
 *                 description: ID of the school
 *                 example: 1
 *               class_id:
 *                 type: integer
 *                 description: ID of the class
 *                 example: 1
 *               session_id:
 *                 type: integer
 *                 description: Required when event_type is SESSION_ENDED
 *                 example: 6
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: Timestamp of the event
 *                 example: "2025-05-11T03:42:21.469Z"
 *     responses:
 *       200:
 *         description: Session event recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   description: Response when starting a new session
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Success message
 *                       example: "Event Inserted Successfully!"
 *                     sessionId:
 *                       type: integer
 *                       description: ID of the newly created session
 *                       example: 7
 *                 - type: object
 *                   description: Response when ending an existing session
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Success message
 *                       example: "Event Updated Succesfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post('/v1/session', authorize(['TEACHER']), sessionController.sessionEvent);

/**
 * @swagger
 * /events/v1/heartbeat:
 *   post:
 *     summary: Track student engagement
 *     tags: [Heartbeats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session_id
 *               - event_type
 *               - student_id
 *             properties:
 *               session_id:
 *                 type: integer
 *               event_type:
 *                 type: string
 *               student_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Heartbeat recorded successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/v1/heartbeat', authorize(['TEACHER', 'STUDENT']), heartbeatControllers.heartbeat);

/**
 * @swagger
 * /events/v1/quiz:
 *   post:
 *     summary: Create a new quiz
 *     description: Create a new quiz for a session
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_type
 *               - school_id
 *               - class_id
 *               - session_id
 *               - timestamp
 *               - quiz_id
 *             properties:
 *               event_type:
 *                 type: string
 *                 enum: [QUIZ_STARTED]
 *                 description: Type of quiz event
 *                 example: "QUIZ_STARTED"
 *               school_id:
 *                 type: integer
 *                 description: ID of the school
 *                 example: 1
 *               class_id:
 *                 type: integer
 *                 description: ID of the class
 *                 example: 1
 *               session_id:
 *                 type: integer
 *                 description: ID of the session
 *                 example: 6
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: Timestamp of the quiz event
 *                 example: "2025-05-11T04:57:21.469Z"
 *               quiz_id:
 *                 type: integer
 *                 description: ID of the quiz
 *                 example: 4
 *     responses:
 *       200:
 *         description: Quiz created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Quiz Created Successfully!"
 *                 quizId:
 *                   type: integer
 *                   description: ID of the newly created quiz
 *                   example: 5
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post('/v1/quiz', authorize(['TEACHER']), quizControllers.quiz);

/**
 * @swagger
 * /events/v1/answer:
 *   post:
 *     summary: Submit student answer for a quiz question
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quiz_id
 *               - question_id
 *               - student_id
 *               - result
 *               - timestamp
 *               - duration
 *             properties:
 *               quiz_id:
 *                 type: integer
 *               question_id:
 *                 type: integer
 *               student_id:
 *                 type: integer
 *               result:
 *                 type: boolean
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: integer
 *                 description: Time taken to answer in seconds
 *     responses:
 *       200:
 *         description: Answer submitted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post('/v1/answer', authorize(['STUDENT']), answerController.answer);

module.exports = router;