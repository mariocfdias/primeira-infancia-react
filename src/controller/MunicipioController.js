const MunicipioService = require('../service/MunicipioService');

/**
 * @swagger
 * tags:
 *   name: Municipios
 *   description: Endpoints para gerenciamento de municípios
 */
class MunicipioController {
    constructor(connection) {
        this.municipioService = new MunicipioService(connection);
    }

    /**
     * @swagger
     * /municipios:
     *   get:
     *     summary: Retorna todos os municípios
     *     tags: [Municipios]
     *     responses:
     *       200:
     *         description: Lista de municípios
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
     *                     $ref: '#/components/schemas/Municipio'
     *       500:
     *         description: Erro no servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async getAllMunicipios(req, res) {
        try {
            const municipios = await this.municipioService.findAll();
            return res.json({ status: 'success', data: municipios });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    /**
     * @swagger
     * /municipios/{ibge}:
     *   get:
     *     summary: Retorna um município específico com seus desempenhos e missões relacionadas
     *     tags: [Municipios]
     *     parameters:
     *       - in: path
     *         name: ibge
     *         schema:
     *           type: string
     *         required: true
     *         description: Código IBGE do município
     *     responses:
     *       200:
     *         description: Dados completos do município, incluindo desempenhos e missões
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
     *                     codIbge:
     *                       type: string
     *                     nome:
     *                       type: string
     *                     status:
     *                       type: string
     *                     dataAlteracao:
     *                       type: string
     *                       format: date-time
     *                     imagemAvatar:
     *                       type: string
     *                       nullable: true
     *                     badges:
     *                       type: integer
     *                     points:
     *                       type: integer
     *                     json:
     *                       type: object
     *                       nullable: true
     *                     orgao:
     *                       type: boolean
     *                     desempenhos:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           id:
     *                             type: integer
     *                           codIbge:
     *                             type: string
     *                           missaoId:
     *                             type: string
     *                           validation_status:
     *                             type: string
     *                           updated_at:
     *                             type: string
     *                             format: date-time
     *                           evidence:
     *                             type: array
     *                           missao:
     *                             type: object
     *                             properties:
     *                               id:
     *                                 type: string
     *                               categoria:
     *                                 type: string
     *                               descricao_da_categoria:
     *                                 type: string
     *                               emblema_da_categoria:
     *                                 type: string
     *                               descricao_da_missao:
     *                                 type: string
     *                               qnt_pontos:
     *                                 type: integer
     *                               link_formulario:
     *                                 type: string
     *                                 nullable: true
     *                               evidencias:
     *                                 type: array
     *       404:
     *         description: Município não encontrado
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
    async getMunicipioByIdWithJson(req, res) {
        try {
            const { ibge } = req.params;
            console.log({codIbge: ibge})
            const municipio = await this.municipioService.findMunicipioCompleto(ibge);
            if (!municipio) {
                return res.status(404).json({ status: 'error', message: 'Municipio não encontrado' });
            }
            return res.json({ status: 'success', data: municipio });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

module.exports = MunicipioController;
