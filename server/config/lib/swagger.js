'use strict';

/**
 * Swagger configuration
 */
var path = require('path'),
  swaggerJsdoc = require('swagger-jsdoc'),
  swaggerUi = require('swagger-ui-express'),
  config = require('../config');

/**
 * Swagger definition
 */
var swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'HARPI API',
    version: '1.0.0',
    description: 'HTTP Archive Pipeline API - RESTful API for managing HAR files, generating Swagger specs, and creating Mermaid diagrams',
    contact: {
      name: 'API Support',
      email: 'support@harpi.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'production' 
        ? 'https://api.harpi.com' 
        : `http://localhost:${config.port}`,
      description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Har: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'HAR file ID'
          },
          name: {
            type: 'string',
            description: 'HAR file name'
          },
          created: {
            type: 'string',
            format: 'date-time',
            description: 'Creation date'
          },
          log: {
            type: 'object',
            description: 'HAR log data'
          },
          project: {
            type: 'string',
            description: 'Project ID'
          },
          user: {
            type: 'string',
            description: 'User ID'
          }
        }
      },
      Project: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Project ID'
          },
          title: {
            type: 'string',
            description: 'Project title'
          },
          description: {
            type: 'string',
            description: 'Project description'
          },
          created: {
            type: 'string',
            format: 'date-time',
            description: 'Creation date'
          },
          hars: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Array of HAR file IDs'
          }
        }
      },
      Spec: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Spec ID'
          },
          title: {
            type: 'string',
            description: 'Spec title'
          },
          description: {
            type: 'string',
            description: 'Spec description'
          },
          swagger: {
            type: 'object',
            description: 'Swagger/OpenAPI specification'
          },
          har: {
            type: 'string',
            description: 'HAR file ID'
          },
          project: {
            type: 'string',
            description: 'Project ID'
          },
          created: {
            type: 'string',
            format: 'date-time',
            description: 'Creation date'
          }
        }
      },
      Diagram: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Diagram ID'
          },
          title: {
            type: 'string',
            description: 'Diagram title'
          },
          description: {
            type: 'string',
            description: 'Diagram description'
          },
          mermaid: {
            type: 'string',
            description: 'Mermaid diagram text'
          },
          har: {
            type: 'string',
            description: 'HAR file ID'
          },
          project: {
            type: 'string',
            description: 'Project ID'
          },
          created: {
            type: 'string',
            format: 'date-time',
            description: 'Creation date'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Error message'
          },
          error: {
            type: 'object',
            description: 'Error details (development only)'
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Projects',
      description: 'Project management endpoints'
    },
    {
      name: 'HARs',
      description: 'HAR file management endpoints'
    },
    {
      name: 'Specs',
      description: 'Swagger/OpenAPI specification endpoints'
    },
    {
      name: 'Diagrams',
      description: 'Mermaid diagram endpoints'
    }
  ]
};

/**
 * Swagger options
 */
var swaggerOptions = {
  definition: swaggerDefinition,
  apis: [
    path.resolve(__dirname, '../../modules/*/server/routes/*.js'),
    path.resolve(__dirname, '../../modules/*/server/controllers/*.js')
  ]
};

/**
 * Initialize Swagger
 */
var swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * Setup Swagger UI
 */
module.exports.setup = function(app) {
  var mongoose = require('mongoose');
  var Spec = mongoose.model('Spec');

  // Swagger JSON endpoint
  app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Swagger JSON endpoint for a specific spec (used by Swagger UI)
  // This must come before the /swagger route to avoid conflicts
  app.get('/swagger/spec/:specId.json', async function(req, res, next) {
    try {
      var spec = await Spec.findById(req.params.specId).exec();
      
      if (!spec) {
        return res.status(404).json({ error: 'Spec not found' });
      }

      if (!spec.swagger) {
        return res.status(400).json({ error: 'Spec does not contain Swagger JSON' });
      }

      // Parse the swagger JSON if it's a string, otherwise return as-is
      var specSwagger = typeof spec.swagger === 'string' 
        ? JSON.parse(spec.swagger) 
        : spec.swagger;

      res.setHeader('Content-Type', 'application/json');
      res.json(specSwagger);
    } catch (err) {
      console.error('Error loading spec for Swagger UI:', err);
      return res.status(500).json({ error: 'Error loading spec: ' + err.message });
    }
  });

  // Serve Swagger UI static assets for /swagger/view/ paths
  // This must come BEFORE the :specId route to catch static asset requests
  app.use('/swagger/view', swaggerUi.serve);

  // Swagger UI endpoint for viewing generated specs
  // This route serves Swagger UI with a specific spec's swagger JSON
  // This must come before the /swagger route to avoid conflicts
  // Use generateHTML to embed everything and avoid static asset path issues
  app.get('/swagger/view/:specId', async function(req, res, next) {
    try {
      var spec = await Spec.findById(req.params.specId).exec();
      
      if (!spec) {
        return res.status(404).send('Spec not found');
      }

      if (!spec.swagger) {
        return res.status(400).send('Spec does not contain Swagger JSON');
      }

      // Parse the swagger JSON if it's a string
      var specSwagger = typeof spec.swagger === 'string' 
        ? JSON.parse(spec.swagger) 
        : spec.swagger;

      // Use generateHTML to create the Swagger UI HTML with the spec embedded
      // This avoids static asset path issues
      var html = swaggerUi.generateHTML(specSwagger, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Swagger Spec: ' + (spec.title || 'Untitled'),
        swaggerOptions: {
          persistAuthorization: true,
          displayRequestDuration: true,
          filter: true,
          tryItOutEnabled: true
        }
      });

      res.send(html);
    } catch (err) {
      console.error('Error loading spec for Swagger UI:', err);
      return res.status(500).send('Error loading spec: ' + err.message);
    }
  });

  // Swagger UI endpoint for API documentation
  // This comes last to avoid conflicts with more specific routes above
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'HARPI API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      tryItOutEnabled: true
    }
  }));
};

