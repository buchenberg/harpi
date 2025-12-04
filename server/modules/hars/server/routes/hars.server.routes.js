'use strict';

/**
 * Module dependencies
 */
var harsPolicy = require('../policies/hars.server.policy'),
  hars = require('../controllers/hars.server.controller');

module.exports = function (app) {
  /**
   * @swagger
   * /api/hars:
   *   get:
   *     tags: [HARs]
   *     summary: List all HAR files
   *     description: Retrieve a list of all HAR files
   *     responses:
   *       200:
   *         description: List of HAR files
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Har'
   *   post:
   *     tags: [HARs]
   *     summary: Upload a new HAR file
   *     description: Create a new HAR file from uploaded data
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - log
   *               - project
   *             properties:
   *               name:
   *                 type: string
   *                 description: HAR file name
   *               log:
   *                 type: object
   *                 description: HAR log data
   *               project:
   *                 type: string
   *                 description: Project ID
   *     responses:
   *       201:
   *         description: HAR file created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Har'
   */
  app.route('/api/hars').all(harsPolicy.isAllowed)
        .get(hars.list)
        .post(hars.create);

  /**
   * @swagger
   * /api/hars/{harId}:
   *   get:
   *     tags: [HARs]
   *     summary: Get a HAR file by ID
   *     description: Retrieve a single HAR file by its ID
   *     parameters:
   *       - in: path
   *         name: harId
   *         required: true
   *         schema:
   *           type: string
   *         description: HAR file ID
   *     responses:
   *       200:
   *         description: HAR file details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Har'
   *   put:
   *     tags: [HARs]
   *     summary: Update a HAR file
   *     description: Update an existing HAR file
   *     parameters:
   *       - in: path
   *         name: harId
   *         required: true
   *         schema:
   *           type: string
   *         description: HAR file ID
   *     responses:
   *       200:
   *         description: HAR file updated successfully
   *   delete:
   *     tags: [HARs]
   *     summary: Delete a HAR file
   *     description: Delete a HAR file by its ID
   *     parameters:
   *       - in: path
   *         name: harId
   *         required: true
   *         schema:
   *           type: string
   *         description: HAR file ID
   *     responses:
   *       200:
   *         description: HAR file deleted successfully
   */
  app.route('/api/hars/:harId').all(harsPolicy.isAllowed)
        .get(hars.read)
        .put(hars.update)
        .delete(hars.delete)
        .patch(hars.patch);

  /**
   * @swagger
   * /api/hars/{harId}/specs:
   *   post:
   *     tags: [HARs, Specs]
   *     summary: Generate Swagger spec from HAR file
   *     description: Create a Swagger/OpenAPI specification from a HAR file
   *     parameters:
   *       - in: path
   *         name: harId
   *         required: true
   *         schema:
   *           type: string
   *         description: HAR file ID
   *     responses:
   *       201:
   *         description: Swagger spec generated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Spec'
   *       400:
   *         description: Bad request or invalid HAR file
   */
  app.route('/api/hars/:harId/specs').all(harsPolicy.isAllowed)
        .post(hars.createSwagger);

  /**
   * @swagger
   * /api/hars/{harId}/mermaid:
   *   get:
   *     tags: [HARs]
   *     summary: Get Mermaid diagram text for HAR file
   *     description: Retrieve the Mermaid diagram text for a HAR file
   *     parameters:
   *       - in: path
   *         name: harId
   *         required: true
   *         schema:
   *           type: string
   *         description: HAR file ID
   *     responses:
   *       200:
   *         description: Mermaid diagram text
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *   post:
   *     tags: [HARs]
   *     summary: Generate Mermaid diagram for HAR file
   *     description: Generate a Mermaid sequence diagram from a HAR file
   *     parameters:
   *       - in: path
   *         name: harId
   *         required: true
   *         schema:
   *           type: string
   *         description: HAR file ID
   *     responses:
   *       200:
   *         description: Mermaid diagram generated successfully
   */
  app.route('/api/hars/:harId/mermaid').all(harsPolicy.isAllowed)
        .get(hars.readUML)
        .post(hars.createUML);
  
  // Legacy route alias for backward compatibility (deprecated)
  app.route('/api/hars/:harId/puml').all(harsPolicy.isAllowed)
        .get(hars.readUML)
        .post(hars.createUML);

  /**
   * @swagger
   * /api/hars/{harId}/diagrams:
   *   post:
   *     tags: [HARs, Diagrams]
   *     summary: Create diagram from HAR file
   *     description: Generate a Mermaid diagram from a HAR file and save it to the diagrams collection
   *     parameters:
   *       - in: path
   *         name: harId
   *         required: true
   *         schema:
   *           type: string
   *         description: HAR file ID
   *     responses:
   *       201:
   *         description: Diagram created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Diagram'
   */
  app.route('/api/hars/:harId/diagrams').all(harsPolicy.isAllowed)
        .post(hars.createDiagram);
        

    // Finish by binding the Har middleware
  app.param('harId', hars.harByID);
};