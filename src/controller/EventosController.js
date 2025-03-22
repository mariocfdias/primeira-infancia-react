const EventosService = require('../service/EventosService');
const { EventosDTO } = require('../dto/EventosDTO');

/**
 * @swagger
 * tags:
 *   name: Eventos
 *   description: Endpoints para gerenciamento de eventos
 */
class EventosController {
    constructor(connection) {
        this.eventosService = new EventosService(connection);
    }

    /**
     * @swagger
     * /eventos:
     *   get:
     *     summary: Retorna todos os eventos
     *     tags: [Eventos]
     *     responses:
     *       200:
     *         description: Lista de eventos
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: success
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Eventos'
     *       500:
     *         description: Erro no servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async getAllEventos(req, res) {
        try {
            const eventos = await this.eventosService.findAll();
            return res.json({ status: 'success', data: eventos });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    /**
     * @swagger
     * /eventos/{id}:
     *   get:
     *     summary: Retorna um evento específico
     *     tags: [Eventos]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do evento
     *     responses:
     *       200:
     *         description: Dados do evento
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: success
     *                 data:
     *                   $ref: '#/components/schemas/Eventos'
     *       404:
     *         description: Evento não encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       500:
     *         description: Erro no servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async getEventoById(req, res) {
        try {
            const { id } = req.params;
            const evento = await this.eventosService.findById(id);
            return res.json({ status: 'success', data: evento });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    /**
     * @swagger
     * /eventos:
     *   post:
     *     summary: Cria um novo evento
     *     tags: [Eventos]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               data_alteracao:
     *                 type: string
     *                 format: date-time
     *                 description: Data do evento (opcional, padrão é a data atual)
     *               event:
     *                 type: string
     *                 description: Nome do evento
     *               description:
     *                 type: string
     *                 description: Descrição do evento
     *               cod_ibge:
     *                 type: string
     *                 description: Código IBGE do município relacionado
     *             required:
     *               - event
     *               - description
     *     responses:
     *       201:
     *         description: Evento criado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: success
     *                 data:
     *                   $ref: '#/components/schemas/Eventos'
     *       500:
     *         description: Erro no servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async createEvento(req, res) {
        try {
            const eventoDTO = EventosDTO.builder()
                .withDataAlteracao(req.body.data_alteracao || new Date())
                .withEvent(req.body.event)
                .withDescription(req.body.description)
                .withCodIbge(req.body.cod_ibge)
                .build();

            const newEvento = await this.eventosService.createEvento(eventoDTO);
            return res.status(201).json({ status: 'success', data: newEvento });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    /**
     * @swagger
     * /eventos/{id}:
     *   put:
     *     summary: Atualiza um evento existente
     *     tags: [Eventos]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do evento
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               data_alteracao:
     *                 type: string
     *                 format: date-time
     *                 description: Data do evento (opcional, padrão é a data atual)
     *               event:
     *                 type: string
     *                 description: Nome do evento
     *               description:
     *                 type: string
     *                 description: Descrição do evento
     *               cod_ibge:
     *                 type: string
     *                 description: Código IBGE do município relacionado
     *     responses:
     *       200:
     *         description: Evento atualizado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: success
     *                 data:
     *                   $ref: '#/components/schemas/Eventos'
     *       404:
     *         description: Evento não encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       500:
     *         description: Erro no servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async updateEvento(req, res) {
        try {
            const { id } = req.params;
            
            const eventoDTO = EventosDTO.builder()
                .withId(id)
                .withDataAlteracao(req.body.data_alteracao || new Date())
                .withEvent(req.body.event)
                .withDescription(req.body.description)
                .withCodIbge(req.body.cod_ibge)
                .build();

            const updatedEvento = await this.eventosService.updateEvento(id, eventoDTO);
            return res.json({ status: 'success', data: updatedEvento });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    /**
     * @swagger
     * /eventos/{id}:
     *   delete:
     *     summary: Remove um evento
     *     tags: [Eventos]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do evento
     *     responses:
     *       200:
     *         description: Evento removido com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: success
     *                 data:
     *                   type: object
     *                   properties:
     *                     success:
     *                       type: boolean
     *                       example: true
     *                     message:
     *                       type: string
     *                       example: "Evento with id 1 deleted successfully"
     *       404:
     *         description: Evento não encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       500:
     *         description: Erro no servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async deleteEvento(req, res) {
        try {
            const { id } = req.params;
            const result = await this.eventosService.deleteEvento(id);
            return res.json({ status: 'success', data: result });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    /**
     * @swagger
     * /eventos/municipio/{codIbge}:
     *   get:
     *     summary: Retorna todos os eventos de um município específico
     *     tags: [Eventos]
     *     parameters:
     *       - in: path
     *         name: codIbge
     *         schema:
     *           type: string
     *         required: true
     *         description: Código IBGE do município
     *     responses:
     *       200:
     *         description: Lista de eventos do município
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: success
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Eventos'
     *       500:
     *         description: Erro no servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async getEventosByCodIbge(req, res) {
        try {
            const { codIbge } = req.params;
            const eventos = await this.eventosService.findByCodIbge(codIbge);
            return res.json({ status: 'success', data: eventos });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

module.exports = EventosController; 