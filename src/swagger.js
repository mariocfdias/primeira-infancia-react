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
    }
  },
  apis: ['./src/controller/*.js']
};

const specs = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

module.exports = { setupSwagger }; 