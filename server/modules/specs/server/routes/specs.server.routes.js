'use strict';

/**
 * Module dependencies
 */
var specsPolicy = require('../policies/specs.server.policy'),
  specs = require('../controllers/specs.server.controller');

module.exports = function (app) {
  /**
   * @swagger
   * /api/specs:
   *   get:
   *     tags: [Specs]
   *     summary: List all Swagger specs
   *     description: Retrieve a list of all Swagger/OpenAPI specifications
   *     responses:
   *       200:
   *         description: List of specs
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Spec'
   *   post:
   *     tags: [Specs]
   *     summary: Create a new spec
   *     description: Create a new Swagger/OpenAPI specification
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - swagger
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               swagger:
   *                 type: object
   *               har:
   *                 type: string
   *               project:
   *                 type: string
   *     responses:
   *       201:
   *         description: Spec created successfully
   */
  app.route('/api/specs').all(specsPolicy.isAllowed)
    .get(specs.list)
    .post(specs.create);

  /**
   * @swagger
   * /api/specs/{specId}:
   *   get:
   *     tags: [Specs]
   *     summary: Get a spec by ID
   *     description: Retrieve a single Swagger/OpenAPI specification by its ID
   *     parameters:
   *       - in: path
   *         name: specId
   *         required: true
   *         schema:
   *           type: string
   *         description: Spec ID
   *     responses:
   *       200:
   *         description: Spec details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Spec'
   *   put:
   *     tags: [Specs]
   *     summary: Update a spec
   *     description: Update an existing Swagger/OpenAPI specification
   *     parameters:
   *       - in: path
   *         name: specId
   *         required: true
   *         schema:
   *           type: string
   *         description: Spec ID
   *     responses:
   *       200:
   *         description: Spec updated successfully
   *   delete:
   *     tags: [Specs]
   *     summary: Delete a spec
   *     description: Delete a Swagger/OpenAPI specification by its ID
   *     parameters:
   *       - in: path
   *         name: specId
   *         required: true
   *         schema:
   *           type: string
   *         description: Spec ID
   *     responses:
   *       200:
   *         description: Spec deleted successfully
   */
  app.route('/api/specs/:specId').all(specsPolicy.isAllowed)
    .get(specs.read)
    .put(specs.update)
    .delete(specs.delete);

  /**
   * @swagger
   * /api/specs/{specId}/swagger:
   *   get:
   *     tags: [Specs]
   *     summary: Get Swagger JSON for a spec
   *     description: Retrieve the Swagger/OpenAPI JSON for a specification
   *     parameters:
   *       - in: path
   *         name: specId
   *         required: true
   *         schema:
   *           type: string
   *         description: Spec ID
   *     responses:
   *       200:
   *         description: Swagger JSON
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  app.route('/api/specs/:specId/swagger').get(specs.readSwagger);

  app.route('/api/specs/:specId/dredd').post(specs.testSwagger);

  // Finish by binding the Spec middleware
  app.param('specId', specs.specByID);
};
