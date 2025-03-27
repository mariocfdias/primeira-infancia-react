const DashboardService = require('../service/DashboardService');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Endpoints para visualização de dados do dashboard
 */
class DashboardController {
    constructor(connection) {
        this.dashboardService = new DashboardService(connection);
    }

    /**
     * @swagger
     * /dashboard/mission-panorama:
     *   get:
     *     summary: Retorna um panorama geral de todas as missões com contagem de status
     *     tags: [Dashboard]
     *     responses:
     *       200:
     *         description: Panorama geral de missões
     */
    async getMissionPanorama(req, res) {
        try {
            const panorama = await this.dashboardService.getMissionPanoramaGeneral();
            return res.json({ status: 'success', data: panorama });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    /**
     * @swagger
     * /dashboard/mission-panorama/{missaoId}:
     *   get:
     *     summary: Retorna um panorama detalhado de uma missão específica incluindo listas de municípios
     *     tags: [Dashboard]
     *     parameters:
     *       - in: path
     *         name: missaoId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Panorama detalhado da missão
     *       404:
     *         description: Missão não encontrada
     */
    async getMissionPanoramaById(req, res) {
        try {
            const { missaoId } = req.params;
            const panorama = await this.dashboardService.getMissionPanoramaById(missaoId);
            return res.json({ status: 'success', data: panorama });
        } catch (error) {
            if (error.message === 'Missão não encontrada') {
                return res.status(404).json({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    /**
     * @swagger
     * /dashboard/map-panorama:
     *   get:
     *     summary: Retorna um panorama de municípios com contagem de status de missões e pontos
     *     tags: [Dashboard]
     *     responses:
     *       200:
     *         description: Panorama de municípios e distribuição de desempenho
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
     *                     mapPanorama:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           municipio:
     *                             type: object
     *                             properties:
     *                               codIbge:
     *                                 type: string
     *                               nome:
     *                                 type: string
     *                               status:
     *                                 type: string
     *                               dataAlteracao:
     *                                 type: string
     *                                 format: date-time
     *                               imagemAvatar:
     *                                 type: string
     *                               badges:
     *                                 type: integer
     *                               points:
     *                                 type: integer
     *                           countValid:
     *                             type: integer
     *                           countPending:
     *                             type: integer
     *                           countStarted:
     *                             type: integer
     *                           totalMissoes:
     *                             type: integer
     *                           points:
     *                             type: integer
     *                     desempenho:
     *                       type: object
     *                       properties:
     *                         levelDistribution:
     *                           type: array
     *                           items:
     *                             type: object
     *                             properties:
     *                               level:
     *                                 type: integer
     *                               minPoints:
     *                                 type: integer
     *                               maxPoints:
     *                                 type: integer
     *                               count:
     *                                 type: integer
     *                         totalMunicipios:
     *                           type: integer
     *       500:
     *         description: Erro no servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: error
     *                 message:
     *                   type: string
     */
    async getMapPanorama(req, res) {
        try {
            const data = await this.dashboardService.getMapPanorama();
            return res.json({ status: 'success', data });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    /**
     * @swagger
     * /dashboard/map-panorama/{codIbge}:
     *   get:
     *     summary: Retorna o panorama de um município específico com contagem de status de missões e pontos
     *     tags: [Dashboard]
     *     parameters:
     *       - in: path
     *         name: codIbge
     *         required: true
     *         schema:
     *           type: string
     *         description: Código IBGE do município
     *     responses:
     *       200:
     *         description: Panorama do município específico
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
     *                     mapPanorama:
     *                       type: object
     *                       properties:
     *                         municipio:
     *                           type: object
     *                           properties:
     *                             codIbge:
     *                               type: string
     *                             nome:
     *                               type: string
     *                             status:
     *                               type: string
     *                             dataAlteracao:
     *                               type: string
     *                               format: date-time
     *                             imagemAvatar:
     *                               type: string
     *                             badges:
     *                               type: integer
     *                             points:
     *                               type: integer
     *                         countValid:
     *                           type: integer
     *                         countPending:
     *                           type: integer
     *                         countStarted:
     *                           type: integer
     *                         totalMissoes:
     *                           type: integer
     *                         points:
     *                           type: integer
     *                     level:
     *                       type: integer
     *                       description: Nível do município baseado nos pontos
     *                     totalPoints:
     *                       type: integer
     *                       description: Total de pontos do município
     *       404:
     *         description: Município não encontrado
     *       500:
     *         description: Erro no servidor
     */
    async getMapPanoramaByIbgeCode(req, res) {
        try {
            const { codIbge } = req.params;
            const data = await this.dashboardService.getMapPanoramaByIbgeCode(codIbge);
            return res.json({ status: 'success', data });
        } catch (error) {
            if (error.message === 'Município não encontrado') {
                return res.status(404).json({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

module.exports = DashboardController; 