'use strict';

/**
 * Module dependencies
 */
var diagramsPolicy = require('../policies/diagrams.server.policy'),
  diagrams = require('../controllers/diagrams.server.controller');

module.exports = function (app) {
  /**
   * @swagger
   * /api/diagrams:
   *   get:
   *     tags: [Diagrams]
   *     summary: List all diagrams
   *     description: Retrieve a list of all Mermaid diagrams
   *     responses:
   *       200:
   *         description: List of diagrams
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Diagram'
   *   post:
   *     tags: [Diagrams]
   *     summary: Create a new diagram
   *     description: Create a new Mermaid diagram
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - mermaid
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               mermaid:
   *                 type: string
   *               har:
   *                 type: string
   *               project:
   *                 type: string
   *     responses:
   *       201:
   *         description: Diagram created successfully
   */
  app.route('/api/diagrams').all(diagramsPolicy.isAllowed)
    .get(diagrams.list)
    .post(diagrams.create);

  /**
   * @swagger
   * /api/diagrams/{diagramId}:
   *   get:
   *     tags: [Diagrams]
   *     summary: Get a diagram by ID
   *     description: Retrieve a single Mermaid diagram by its ID
   *     parameters:
   *       - in: path
   *         name: diagramId
   *         required: true
   *         schema:
   *           type: string
   *         description: Diagram ID
   *     responses:
   *       200:
   *         description: Diagram details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Diagram'
   *   put:
   *     tags: [Diagrams]
   *     summary: Update a diagram
   *     description: Update an existing Mermaid diagram
   *     parameters:
   *       - in: path
   *         name: diagramId
   *         required: true
   *         schema:
   *           type: string
   *         description: Diagram ID
   *     responses:
   *       200:
   *         description: Diagram updated successfully
   *   delete:
   *     tags: [Diagrams]
   *     summary: Delete a diagram
   *     description: Delete a Mermaid diagram by its ID
   *     parameters:
   *       - in: path
   *         name: diagramId
   *         required: true
   *         schema:
   *           type: string
   *         description: Diagram ID
   *     responses:
   *       200:
   *         description: Diagram deleted successfully
   */
  app.route('/api/diagrams/:diagramId').all(diagramsPolicy.isAllowed)
    .get(diagrams.read)
    .put(diagrams.update)
    .delete(diagrams.delete);

  /**
   * @swagger
   * /api/diagrams/{diagramId}/mermaid:
   *   get:
   *     tags: [Diagrams]
   *     summary: Get Mermaid text for a diagram
   *     description: Retrieve the Mermaid diagram text
   *     parameters:
   *       - in: path
   *         name: diagramId
   *         required: true
   *         schema:
   *           type: string
   *         description: Diagram ID
   *     responses:
   *       200:
   *         description: Mermaid diagram text
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   */
  app.route('/api/diagrams/:diagramId/mermaid').get(diagrams.readMermaid);

  // Finish by binding the Diagram middleware
  app.param('diagramId', diagrams.diagramByID);
};

