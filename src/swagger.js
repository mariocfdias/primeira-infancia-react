const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pacto Primeira Infância API',
      version: '1.0.0',
      description: 'API para gerenciamento do sistema Pacto Primeira Infância',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'API Server'
      }
    ],
    components: {
      schemas: {
        Municipio: {
          type: 'object',
          properties: {
            codIbge: { type: 'string' },
            nome: { type: 'string' },
            status: { type: 'string' },
            dataAlteracao: { type: 'string', format: 'date-time', nullable: true },
            imagemAvatar: { type: 'string', nullable: true },
            badges: { type: 'integer', default: 0 },
            points: { type: 'integer', default: 0 },
            json: { type: 'string', nullable: true },
            orgao: { type: 'boolean', default: false }
          }
        },
        Missoes: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            categoria: { type: 'string' },
            descricao_da_categoria: { type: 'string' },
            emblema_da_categoria: { type: 'string' },
            descricao_da_missao: { type: 'string' },
            qnt_pontos: { type: 'integer' },
            link_formulario: { type: 'string', nullable: true },
            evidencias: { type: 'array', items: { type: 'string' } }
          }
        },
        Eventos: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            data_alteracao: { type: 'string', format: 'date-time' },
            event: { type: 'string' },
            description: { type: 'string' },
            cod_ibge: { type: 'string' }
          }
        },
        MunicipioDesempenho: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            codIbge: { type: 'string' },
            missaoId: { type: 'string' },
            validation_status: { 
              type: 'string', 
              enum: ['VALID', 'PENDING', 'STARTED'],
              default: 'STARTED'
            },
            updated_at: { type: 'string', format: 'date-time' },
            evidence: { type: 'array', items: { type: 'string' } },
            municipio: { 
              type: 'object',
              nullable: true,
              properties: {
                codIbge: { type: 'string' },
                nome: { type: 'string' },
                status: { type: 'string' }
              }
            },
            missao: { 
              type: 'object',
              nullable: true,
              properties: {
                id: { type: 'string' },
                categoria: { type: 'string' },
                descricao_da_missao: { type: 'string' }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['error'] },
            message: { type: 'string' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['success'] },
            data: { type: 'object' }
          }
        }
      }
    },
    paths: {
      '/jobs-info': {
        get: {
          tags: ['Jobs'],
          summary: 'Get detailed job information',
          description: 'Returns detailed information about all jobs including descriptions and schedules',
          responses: {
            '200': {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', enum: ['success'] },
                      data: {
                        type: 'object',
                        additionalProperties: {
                          type: 'object',
                          properties: {
                            description: { type: 'string' },
                            schedule: { type: 'string' },
                            url_config_key: { type: 'string' },
                            function: { type: 'string' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/docs/jobs': {
        get: {
          tags: ['Documentation'],
          summary: 'Get complete jobs documentation',
          description: 'Returns comprehensive, formatted JSON documentation about all jobs with execution order and URLs',
          responses: {
            '200': {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', enum: ['success'] },
                      data: {
                        type: 'object',
                        additionalProperties: {
                          type: 'object',
                          properties: {
                            description: { type: 'string' },
                            schedule: { type: 'string' },
                            url: { type: 'string' },
                            function: { type: 'string' },
                            execution_order: { 
                              type: ['integer', 'null'],
                              description: 'Order of execution during startup (null if not part of sequential execution)'
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/controller/*.js']
};

const specs = swaggerJsdoc(options);

function setupSwagger(app) {
  // Serve the Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  
  // Expose the raw Swagger JSON
  app.get('/api-docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // Format the JSON with proper indentation (4 spaces)
    res.send(JSON.stringify(specs, null, 4));
  });
}

module.exports = { setupSwagger, options }; 