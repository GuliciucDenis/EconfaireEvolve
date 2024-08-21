const express = require('express');
const router = express.Router();
const objectiveController = require('../controllers/objectiveController');
const { authenticate, adminOnly } = require('../middlewares/authMiddleware');
const { restrictDeadlineUpdate, verifyUpdateAccessForObjectives, verifyAuthenticityOfEmployee } = require('../middlewares/objectiveMiddleware');
/**
 * @swagger
 * tags:
 *   name: Objectives
 *   description: Objective management and retrieval
 */

/**
 * @swagger
 * /objectives:
 *   get:
 *     summary: Retrieve a list of all objectives
 *     tags: [Objectives]
 *     security:
 *       - bearerAuth: []  # Ensure the request includes a bearer token for authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved list of objectives
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The objective ID
 *                   title:
 *                     type: string
 *                     description: The title of the objective
 *                   description:
 *                     type: string
 *                     description: The detailed description of the objective
 *                   deadline:
 *                     type: string
 *                     format: date
 *                     description: The deadline for the objective
 *                   assignedTo:
 *                     type: string
 *                     description: The ID of the user assigned to the objective
 *                   gradeAdmin:
 *                     type: number
 *                     description: The grade given by an admin
 *                   gradeEmployee:
 *                     type: number
 *                     description: The grade given by the employee
 *                   status:
 *                     type: string
 *                     description: The status of the objective
 *                   subObjectives:
 *                     type: array
 *                     description: A list of sub-objectives
 *                     items:
 *                       type: object
 *                       properties:
 *                         title:
 *                           type: string
 *                           description: The title of the sub-objective
 *                         description:
 *                           type: string
 *                           description: The detailed description of the sub-objective
 *                         gradeAdmin:
 *                           type: number
 *                           description: The grade given by an admin for this sub-objective
 *                         gradeEmployee:
 *                           type: number
 *                           description: The grade given by the employee for this sub-objective
 *       401:
 *         description: Unauthorized, missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */

/**
 * @swagger
 * /objectives/{id}:
 *   get:
 *     summary: Retrieve an objective by ID
 *     tags: [Objectives]
 *     security:
 *       - bearerAuth: []  # Ensure the request includes a bearer token for authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The objective ID
 *     responses:
 *       200:
 *         description: Successfully retrieved objective data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The objective ID
 *                 title:
 *                   type: string
 *                   description: The title of the objective
 *                 description:
 *                   type: string
 *                   description: The detailed description of the objective
 *                 deadline:
 *                   type: string
 *                   format: date
 *                   description: The deadline for the objective
 *                 assignedTo:
 *                   type: string
 *                   description: The ID of the user assigned to the objective
 *                 gradeAdmin:
 *                   type: number
 *                   description: The grade given by an admin
 *                 gradeEmployee:
 *                   type: number
 *                   description: The grade given by the employee
 *                 status:
 *                   type: string
 *                   description: The status of the objective
 *                 subObjectives:
 *                   type: array
 *                   description: A list of sub-objectives
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         description: The title of the sub-objective
 *                       description:
 *                         type: string
 *                         description: The detailed description of the sub-objective
 *                       gradeAdmin:
 *                         type: number
 *                         description: The grade given by an admin for this sub-objective
 *                       gradeEmployee:
 *                         type: number
 *                         description: The grade given by the employee for this sub-objective
 *       401:
 *         description: Unauthorized, missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       404:
 *         description: Objective not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */

/**
 * @swagger
 * /objectives:
 *   post:
 *     summary: Create a new objective
 *     tags: [Objectives]
 *     security:
 *       - bearerAuth: []  # Ensure the request includes a bearer token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the objective
 *               description:
 *                 type: string
 *                 description: The detailed description of the objective
 *               deadline:
 *                 type: string
 *                 format: date
 *                 description: The deadline for the objective
 *               assignedTo:
 *                 type: string
 *                 description: The ID of the user assigned to the objective
 *               gradeAdmin:
 *                 type: number
 *                 description: The grade given by an admin
 *               gradeEmployee:
 *                 type: number
 *                 description: The grade given by the employee
 *               status:
 *                 type: string
 *                 enum: ['new', 'in-progress', 'finished']
 *                 description: The status of the objective
 *               subObjectives:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       description: The title of the sub-objective
 *                     gradeAdmin:
 *                       type: number
 *                       description: The grade given by an admin for this sub-objective
 *                     gradeEmployee:
 *                       type: number
 *                       description: The grade given by the employee for this sub-objective
 *     responses:
 *       201:
 *         description: Objective created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The objective ID
 *                 title:
 *                   type: string
 *                   description: The title of the objective
 *                 description:
 *                   type: string
 *                   description: The detailed description of the objective
 *                 deadline:
 *                   type: string
 *                   format: date
 *                   description: The deadline for the objective
 *                 assignedTo:
 *                   type: string
 *                   description: The ID of the user assigned to the objective
 *                 gradeAdmin:
 *                   type: number
 *                   description: The grade given by an admin
 *                 gradeEmployee:
 *                   type: number
 *                   description: The grade given by the employee
 *                 status:
 *                   type: string
 *                   description: The status of the objective
 *                 subObjectives:
 *                   type: array
 *                   description: A list of sub-objectives
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         description: The title of the sub-objective
 *                       gradeAdmin:
 *                         type: number
 *                         description: The grade given by an admin for this sub-objective
 *                       gradeEmployee:
 *                         type: number
 *                         description: The grade given by the employee for this sub-objective
 *       400:
 *         description: Bad request, invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */

/**
 * @swagger
 * /objectives/{id}:
 *   put:
 *     summary: Update an objective by ID
 *     tags: [Objectives]
 *     security:
 *       - bearerAuth: []  # Ensure the request includes a bearer token for authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The objective ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the objective
 *               description:
 *                 type: string
 *                 description: The detailed description of the objective
 *               deadline:
 *                 type: string
 *                 format: date
 *                 description: The deadline for the objective
 *               assignedTo:
 *                 type: string
 *                 description: The ID of the user assigned to the objective
 *               gradeAdmin:
 *                 type: number
 *                 description: The grade given by an admin
 *               gradeEmployee:
 *                 type: number
 *                 description: The grade given by the employee
 *               status:
 *                 type: string
 *                 enum: ['new', 'in-progress', 'finished']
 *                 description: The status of the objective
 *               subObjectives:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       description: The title of the sub-objective
 *                     gradeAdmin:
 *                       type: number
 *                       description: The grade given by an admin for this sub-objective
 *                     gradeEmployee:
 *                       type: number
 *                       description: The grade given by the employee for this sub-objective
 *     responses:
 *       200:
 *         description: Objective successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The objective ID
 *                 title:
 *                   type: string
 *                   description: The title of the objective
 *                 description:
 *                   type: string
 *                   description: The detailed description of the objective
 *                 deadline:
 *                   type: string
 *                   format: date
 *                   description: The deadline for the objective
 *                 assignedTo:
 *                   type: string
 *                   description: The ID of the user assigned to the objective
 *                 gradeAdmin:
 *                   type: number
 *                   description: The grade given by an admin
 *                 gradeEmployee:
 *                   type: number
 *                   description: The grade given by the employee
 *                 status:
 *                   type: string
 *                   description: The status of the objective
 *                 subObjectives:
 *                   type: array
 *                   description: A list of sub-objectives
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         description: The title of the sub-objective
 *                       gradeAdmin:
 *                         type: number
 *                         description: The grade given by an admin for this sub-objective
 *                       gradeEmployee:
 *                         type: number
 *                         description: The grade given by the employee for this sub-objective
 *       400:
 *         description: Bad request, invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       401:
 *         description: Unauthorized, missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       404:
 *         description: Objective not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */

/**
 * @swagger
 * /objectives/{id}:
 *   delete:
 *     summary: Delete an objective by ID
 *     tags: [Objectives]
 *     security:
 *       - bearerAuth: []  # Ensure the request includes a bearer token for authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The objective ID
 *     responses:
 *       200:
 *         description: Objective successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message of deletion
 *       401:
 *         description: Unauthorized, missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       404:
 *         description: Objective not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */

router.get('', authenticate, adminOnly, objectiveController.getAllObjectives);
router.get('/:id', authenticate, verifyAuthenticityOfEmployee, objectiveController.getObjectiveById);
router.post('', authenticate, adminOnly, verifyUpdateAccessForObjectives, objectiveController.createObjective);
router.put('/:id', authenticate, restrictDeadlineUpdate, verifyUpdateAccessForObjectives, objectiveController.updateObjectiveById);
router.delete('/:id', authenticate, adminOnly, objectiveController.deleteObjectiveById);

module.exports = router;
