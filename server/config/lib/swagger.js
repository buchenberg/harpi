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
  // Swagger JSON endpoint
  app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Swagger UI endpoint
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

