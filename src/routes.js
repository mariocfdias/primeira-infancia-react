const express = require('express');

function setupRoutes(connection) {
    const router = express.Router();
    
    // Controllers
    const MunicipioController = require('./controller/MunicipioController');
    const EventosController = require('./controller/EventosController');
    const MissoesController = require('./controller/MissoesController');
    const MunicipioDesempenhoController = require('./controller/MunicipioDesempenhoController');
    const DashboardController = require('./controller/DashboardController');
    
    // Instantiate controllers
    const municipioController = new MunicipioController(connection);
    const eventosController = new EventosController(connection);
    const missoesController = new MissoesController(connection);
    const municipioDesempenhoController = new MunicipioDesempenhoController(connection);
    const dashboardController = new DashboardController(connection);

    // Municipio routes
    router.get('/municipios', municipioController.getAllMunicipios.bind(municipioController));
    router.get('/municipios/:ibge', municipioController.getMunicipioByIdWithJson.bind(municipioController));

    // Eventos routes
    // More specific routes first
    router.get('/eventos/municipios/search', eventosController.searchMunicipios.bind(eventosController));
    router.get('/eventos/municipio/:codIbge', eventosController.getEventosByCodIbge.bind(eventosController));
    router.get('/eventos/:id', eventosController.getEventoById.bind(eventosController));
    // General routes
    router.get('/eventos', eventosController.getAllEventos.bind(eventosController));
    router.post('/eventos', eventosController.createEvento.bind(eventosController));
    router.put('/eventos/:id', eventosController.updateEvento.bind(eventosController));
    router.delete('/eventos/:id', eventosController.deleteEvento.bind(eventosController));

    // Missoes routes
    router.get('/missoes', missoesController.getAllMissoes.bind(missoesController));
    router.get('/missoes/:id', missoesController.getMissaoById.bind(missoesController));
    router.post('/missoes', missoesController.createMissao.bind(missoesController));
    router.put('/missoes/:id', missoesController.updateMissao.bind(missoesController));
    router.delete('/missoes/:id', missoesController.deleteMissao.bind(missoesController));

    // MunicipioDesempenho routes
    router.get('/desempenhos/municipio/:codIbge/missao/:missaoId', municipioDesempenhoController.getDesempenhoByIbgeCodeAndMissaoId.bind(municipioDesempenhoController));
    router.get('/desempenhos/municipio/:codIbge', municipioDesempenhoController.getDesempenhosByIbgeCode.bind(municipioDesempenhoController));
    router.get('/desempenhos/missao/:missaoId', municipioDesempenhoController.getDesempenhosByMissaoId.bind(municipioDesempenhoController));
    router.get('/desempenhos/:id', municipioDesempenhoController.getDesempenhoById.bind(municipioDesempenhoController));
    router.get('/desempenhos', municipioDesempenhoController.getAllDesempenhos.bind(municipioDesempenhoController));
    router.post('/desempenhos', municipioDesempenhoController.createDesempenho.bind(municipioDesempenhoController));
    router.put('/desempenhos/:id', municipioDesempenhoController.updateDesempenho.bind(municipioDesempenhoController));
    router.patch('/desempenhos/:id/status', municipioDesempenhoController.updateValidationStatus.bind(municipioDesempenhoController));
    router.patch('/desempenhos/:id/evidence', municipioDesempenhoController.addEvidence.bind(municipioDesempenhoController));
    router.delete('/desempenhos/:id', municipioDesempenhoController.deleteDesempenho.bind(municipioDesempenhoController));

    // Dashboard routes
    router.get('/dashboard/mission-panorama', dashboardController.getMissionPanorama.bind(dashboardController));
    router.get('/dashboard/mission-panorama/:missaoId', dashboardController.getMissionPanoramaById.bind(dashboardController));
    router.get('/dashboard/map-panorama', dashboardController.getMapPanorama.bind(dashboardController));
    router.get('/dashboard/map-panorama/:codIbge', dashboardController.getMapPanoramaByIbgeCode.bind(dashboardController));

    // Job descriptions and scheduling info
    router.get('/jobs-info', (req, res) => {
        const jobsInfo = {
            fetchMunicipios: {
                description: 'Fetches municipality data from external API',
                schedule: '*/5 * * * *', // Every 5 minutes
                url_config_key: 'FETCH_MUNICIPIOS_URL',
                function: 'fetchMunicipios'
            },
            autofetch: {
                description: 'Auto-fetches data from the API itself',
                schedule: '*/5 * * * *', // Every 5 minutes
                url_config_key: 'AUTOFETCH_URL',
                function: 'autofetch'
            },
            updateJsonMunicipio: {
                description: 'Updates municipality JSON data (currently disabled)',
                schedule: 'disabled',
                url_config_key: 'UPDATE_JSON_URL',
                function: 'updateJsonMunicipio'
            },
            fetchEventos: {
                description: 'Fetches event data from external API',
                schedule: '* * * * *', // Every minute
                url_config_key: 'FETCH_EVENTOS_URL',
                function: 'fetchEventos'
            },
            fetchMissoes: {
                description: 'Fetches mission data from external API',
                schedule: '0 * * * *', // Every hour
                url_config_key: 'FETCH_MISSOES_URL',
                function: 'fetchMissoes'
            },
            fetchMissaoDesempenho: {
                description: 'Fetches mission performance data from external API',
                schedule: '0 * * * *', // Every hour
                url_config_key: 'FETCH_MISSAO_DESEMPENHO_URL',
                function: 'fetchMissaoDesempenho'
            }
        };
        
        res.json({
            status: 'success',
            data: jobsInfo
        });
    });
    
    // Documentation endpoints - prettified JSON
    router.get('/docs/jobs', (req, res) => {
        // Full jobs documentation in one endpoint
        const jobUrls = {
            FETCH_MUNICIPIOS_URL: process.env.FETCH_MUNICIPIOS_URL || 'https://script.google.com/macros/s/AKfycbxAzecewMjM7-oGGwy1zOImLpQX4TeyJXuKl2jbA6GGDXnLW2RebCAybku2uiMI3hmC/exec',
            UPDATE_JSON_URL: process.env.UPDATE_JSON_URL || 'https://script.google.com/macros/s/AKfycbxAzecewMjM7-oGGwy1zOImLpQX4TeyJXuKl2jbA6GGDXnLW2RebCAybku2uiMI3hmC/exec',
            FETCH_EVENTOS_URL: process.env.FETCH_EVENTOS_URL || 'https://script.google.com/macros/s/AKfycbxAzecewMjM7-oGGwy1zOImLpQX4TeyJXuKl2jbA6GGDXnLW2RebCAybku2uiMI3hmC/exec',
            AUTOFETCH_URL: process.env.AUTOFETCH_URL || 'https://primeira-infancia-backend.onrender.com/api/municipios',
            FETCH_MISSOES_URL: process.env.FETCH_MISSOES_URL || 'https://script.google.com/macros/s/AKfycbwC6X0BrzwzByMYVVOXdi-sGkytrYm7-6F1VBhvNoMJJWZsHyW_V0X1syzSUkyuheM/exec',
            FETCH_MISSAO_DESEMPENHO_URL: process.env.FETCH_MISSAO_DESEMPENHO_URL || 'https://script.google.com/macros/s/AKfycbxcTV4SrjXBnYOaTr47bFmYTbHyePKB-BdR6fddMXdZVMnsM9Qy_E8knZEIsMgjdZHJ/exec'
        };
        
        const jobsInfo = {
            fetchMunicipios: {
                description: 'Fetches municipality data from external API',
                schedule: '*/5 * * * *', // Every 5 minutes
                url: jobUrls.FETCH_MUNICIPIOS_URL,
                function: 'fetchMunicipios',
                execution_order: 1
            },
            autofetch: {
                description: 'Auto-fetches data from the API itself',
                schedule: '*/5 * * * *', // Every 5 minutes
                url: jobUrls.AUTOFETCH_URL,
                function: 'autofetch',
                execution_order: null // Not in the sequential execution
            },
            updateJsonMunicipio: {
                description: 'Updates municipality JSON data (currently disabled)',
                schedule: 'disabled',
                url: jobUrls.UPDATE_JSON_URL,
                function: 'updateJsonMunicipio',
                execution_order: null // Not in the sequential execution
            },
            fetchMissoes: {
                description: 'Fetches mission data from external API',
                schedule: '0 * * * *', // Every hour
                url: jobUrls.FETCH_MISSOES_URL,
                function: 'fetchMissoes',
                execution_order: 2
            },
            fetchMissaoDesempenho: {
                description: 'Fetches mission performance data from external API',
                schedule: '0 * * * *', // Every hour
                url: jobUrls.FETCH_MISSAO_DESEMPENHO_URL,
                function: 'fetchMissaoDesempenho',
                execution_order: 3
            },
            fetchEventos: {
                description: 'Fetches event data from external API',
                schedule: '* * * * *', // Every minute
                url: jobUrls.FETCH_EVENTOS_URL,
                function: 'fetchEventos',
                execution_order: 4
            }
        };
        
        // Set headers for proper JSON formatting
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: 'success',
            data: jobsInfo
        }, null, 4));
    });
    
    // Plain JSON API routes documentation
    router.get('/docs/api.json', (req, res) => {
        // Information about all API routes
        const apiRoutes = {
            "municipios": {
                "GET /municipios": "Get all municipalities",
                "GET /municipios/:ibge": "Get a specific municipality by IBGE code with JSON"
            },
            "eventos": {
                "GET /eventos": "Get all events",
                "GET /eventos/:id": "Get a specific event",
                "GET /eventos/municipio/:codIbge": "Get events for a specific municipality",
                "GET /eventos/municipios/search": "Search for municipality events",
                "POST /eventos": "Create a new event",
                "PUT /eventos/:id": "Update an existing event",
                "DELETE /eventos/:id": "Delete an event"
            },
            "missoes": {
                "GET /missoes": "Get all missions",
                "GET /missoes/:id": "Get a specific mission",
                "POST /missoes": "Create a new mission",
                "PUT /missoes/:id": "Update an existing mission",
                "DELETE /missoes/:id": "Delete a mission"
            },
            "desempenhos": {
                "GET /desempenhos": "Get all performance records",
                "GET /desempenhos/:id": "Get a specific performance record",
                "GET /desempenhos/municipio/:codIbge": "Get performance records for a municipality",
                "GET /desempenhos/missao/:missaoId": "Get performance records for a mission",
                "GET /desempenhos/municipio/:codIbge/missao/:missaoId": "Get performance record for specific municipality and mission",
                "POST /desempenhos": "Create a new performance record",
                "PUT /desempenhos/:id": "Update a performance record",
                "PATCH /desempenhos/:id/status": "Update validation status of a performance record",
                "PATCH /desempenhos/:id/evidence": "Add evidence to a performance record",
                "DELETE /desempenhos/:id": "Delete a performance record"
            },
            "dashboard": {
                "GET /dashboard/mission-panorama": "Get mission panorama for dashboard",
                "GET /dashboard/mission-panorama/:missaoId": "Get mission panorama for a specific mission",
                "GET /dashboard/map-panorama": "Get map panorama for dashboard",
                "GET /dashboard/map-panorama/:codIbge": "Get map panorama for a specific municipality"
            },
            "jobs": {
                "GET /jobs-config": "Get job configuration URLs",
                "GET /jobs-info": "Get detailed job information",
                "GET /docs/jobs": "Get comprehensive job documentation with execution order"
            }
        };
        
        // Set headers for proper JSON formatting
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(JSON.stringify(apiRoutes, null, 4));
    });

    return router;
}

module.exports = { setupRoutes };