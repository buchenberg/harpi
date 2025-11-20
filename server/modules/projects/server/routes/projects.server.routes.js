'use strict';

/**
 * Module dependencies.
 */
var projectsPolicy = require('../policies/projects.server.policy'),
  projects = require('../controllers/projects.server.controller');

module.exports = function (app) {
  /**
   * @swagger
   * /api/projects:
   *   get:
   *     tags: [Projects]
   *     summary: List all projects
   *     description: Retrieve a list of all projects
   *     responses:
   *       200:
   *         description: List of projects
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Project'
   *   post:
   *     tags: [Projects]
   *     summary: Create a new project
   *     description: Create a new project with title and description
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *             properties:
   *               title:
   *                 type: string
   *                 description: Project title
   *               description:
   *                 type: string
   *                 description: Project description
   *     responses:
   *       201:
   *         description: Project created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Project'
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  app.route('/api/projects').all(projectsPolicy.isAllowed)
    .get(projects.list)
    .post(projects.create);

  /**
   * @swagger
   * /api/projects/{projectId}:
   *   get:
   *     tags: [Projects]
   *     summary: Get a project by ID
   *     description: Retrieve a single project by its ID
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: string
   *         description: Project ID
   *     responses:
   *       200:
   *         description: Project details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Project'
   *       404:
   *         description: Project not found
   *   put:
   *     tags: [Projects]
   *     summary: Update a project
   *     description: Update an existing project
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: string
   *         description: Project ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *     responses:
   *       200:
   *         description: Project updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Project'
   *   delete:
   *     tags: [Projects]
   *     summary: Delete a project
   *     description: Delete a project by its ID
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: string
   *         description: Project ID
   *     responses:
   *       200:
   *         description: Project deleted successfully
   *       404:
   *         description: Project not found
   */
  app.route('/api/projects/:projectId').all(projectsPolicy.isAllowed)
    .get(projects.read)
    .put(projects.update)
    .delete(projects.delete);

  /**
   * @swagger
   * /api/projects/{projectId}/hars:
   *   get:
   *     tags: [Projects]
   *     summary: List HAR files in a project
   *     description: Get all HAR files associated with a project
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: string
   *         description: Project ID
   *     responses:
   *       200:
   *         description: List of HAR files
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Har'
   */
  app.route('/api/projects/:projectId/hars').all(projectsPolicy.isAllowed)
    .get(projects.listHars)
    .post(projects.uploadHar);

  // Finish by binding the project middleware
  app.param('projectId', projects.projectByID);
};
