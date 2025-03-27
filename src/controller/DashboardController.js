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
     *     summary: Retorna um panorama de missões com contagem de status por missão
     *     tags: [Dashboard]
     *     responses:
     *       200:
     *         description: Panorama de missões
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
     *                     type: object
     *                     properties:
     *                       missao:
     *                         type: object
     *                       countValid:
     *                         type: integer
     *                       countPending:
     *                         type: integer
     *                       countStarted:
     *                         type: integer
     *                       totalMunicipios:
     *                         type: integer
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
    async getMissionPanorama(req, res) {
        try {
            const panorama = await this.dashboardService.getMissionPanorama();
            return res.json({ status: 'success', data: panorama });
        } catch (error) {
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
}

module.exports = DashboardController; 