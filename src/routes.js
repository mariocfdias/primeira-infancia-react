const express = require('express');

function setupRoutes(connection) {
    const router = express.Router();
    
    // Controllers
    const MunicipioController = require('./controller/MunicipioController');
    const EventosController = require('./controller/EventosController');
    const MissoesController = require('./controller/MissoesController');
    const MunicipioDesempenhoController = require('./controller/MunicipioDesempenhoController');
    
    // Instantiate controllers
    const municipioController = new MunicipioController(connection);
    const eventosController = new EventosController(connection);
    const missoesController = new MissoesController(connection);
    const municipioDesempenhoController = new MunicipioDesempenhoController(connection);

    // Municipio routes
    router.get('/municipios', municipioController.getAllMunicipios.bind(municipioController));
    router.get('/municipios/:ibge', municipioController.getMunicipioByIdWithJson.bind(municipioController));

    // Eventos routes
    router.get('/eventos', eventosController.getAllEventos.bind(eventosController));
    router.get('/eventos/:id', eventosController.getEventoById.bind(eventosController));
    router.post('/eventos', eventosController.createEvento.bind(eventosController));
    router.put('/eventos/:id', eventosController.updateEvento.bind(eventosController));
    router.delete('/eventos/:id', eventosController.deleteEvento.bind(eventosController));
    router.get('/eventos/municipio/:codIbge', eventosController.getEventosByCodIbge.bind(eventosController));

    // Missoes routes
    router.get('/missoes', missoesController.getAllMissoes.bind(missoesController));
    router.get('/missoes/:id', missoesController.getMissaoById.bind(missoesController));
    router.post('/missoes', missoesController.createMissao.bind(missoesController));
    router.put('/missoes/:id', missoesController.updateMissao.bind(missoesController));
    router.delete('/missoes/:id', missoesController.deleteMissao.bind(missoesController));

    // MunicipioDesempenho routes
    router.get('/desempenhos', municipioDesempenhoController.getAllDesempenhos.bind(municipioDesempenhoController));
    router.get('/desempenhos/:id', municipioDesempenhoController.getDesempenhoById.bind(municipioDesempenhoController));
    router.get('/desempenhos/municipio/:codIbge', municipioDesempenhoController.getDesempenhosByIbgeCode.bind(municipioDesempenhoController));
    router.get('/desempenhos/missao/:missaoId', municipioDesempenhoController.getDesempenhosByMissaoId.bind(municipioDesempenhoController));
    router.post('/desempenhos', municipioDesempenhoController.createDesempenho.bind(municipioDesempenhoController));
    router.put('/desempenhos/:id', municipioDesempenhoController.updateDesempenho.bind(municipioDesempenhoController));
    router.patch('/desempenhos/:id/status', municipioDesempenhoController.updateValidationStatus.bind(municipioDesempenhoController));
    router.patch('/desempenhos/:id/evidence', municipioDesempenhoController.addEvidence.bind(municipioDesempenhoController));
    router.delete('/desempenhos/:id', municipioDesempenhoController.deleteDesempenho.bind(municipioDesempenhoController));

    return router;
}

module.exports = { setupRoutes };