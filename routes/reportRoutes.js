const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/auth');

const reportControllers = require('../controllers/reportController');

/**
 * @swagger
 * /reports/v1/student:
 *   get:
 *     summary: Get student performance report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: session_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Student performance report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Report Fetched Successfully"
 *                 report:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       quizId:
 *                         type: integer
 *                         example: 1
 *                       scores:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             student_id:
 *                               type: integer
 *                               example: 1
 *                             score:
 *                               type: string
 *                               example: "3"
 *                       averageScore:
 *                         type: string
 *                         nullable: true
 *                         example: "3.0000"
 *                       highestScore:
 *                         type: string
 *                         nullable: true
 *                         example: "3"
 *                       lowestScore:
 *                         type: string
 *                         nullable: true
 *                         example: "3"
 *                       avgDuration:
 *                         type: string
 *                         nullable: true
 *                         example: "20000.0000"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get(
    '/v1/student',
    authorize(['TEACHER', 'ADMIN']),
    reportControllers.studentPerformanceReport
);

/**
 * @swagger
 * /reports/v1/classroom:
 *   get:
 *     summary: Get classroom engagement report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: session_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Classroom engagement report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Classroom Engagement Report Fetched Successfully"
 *                 report:
 *                   type: object
 *                   properties:
 *                     avgHoursRevisiting:
 *                       type: string
 *                       example: "1.33"
 *                     studentsTakingNotes:
 *                       type: integer
 *                       example: 1
 *                     result:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           quizId:
 *                             type: integer
 *                             example: 1
 *                           studentsParticipated:
 *                             type: integer
 *                             example: 3
 *                           studentsParticipatedOutOf:
 *                             type: integer
 *                             example: 30
 *                           studentsCompleted:
 *                             type: integer
 *                             example: 3
 *                           studentsCompletedOutOf:
 *                             type: integer
 *                             example: 30
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get(
    '/v1/classroom',
    authorize(['TEACHER', 'ADMIN']),
    reportControllers.classEngagementReport
);

/**
 * @swagger
 * /reports/v1/content:
 *   get:
 *     summary: Get content effectiveness report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: session_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Content effectiveness report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Content Effectiveness Report Fetched Successfully"
 *                 report:
 *                   type: object
 *                   properties:
 *                     contentCreationPercent:
 *                       type: integer
 *                       example: 10
 *                     avgQuizParticipation:
 *                       type: number
 *                       format: float
 *                       example: 0.75
 *                     studentsReviewingMaterials:
 *                       type: integer
 *                       example: 3
 *                     avgResponseTimePerQuestion:
 *                       type: integer
 *                       example: 20000
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get(
    '/v1/content',
    authorize(['TEACHER', 'ADMIN']), 
    reportControllers.contentEffectivenessReport
);

module.exports = router;