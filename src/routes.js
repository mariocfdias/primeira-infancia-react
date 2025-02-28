const express = require('express');

function setupRoutes(connection) {
    const router = express.Router();
    const MunicipioController = require('./controller/MunicipioController');
    const municipioController = new MunicipioController(connection);

    router.get('/municipios', municipioController.getAllMunicipios.bind(municipioController));
    router.get('/municipios/:ibge', municipioController.getMunicipioByIdWithJson.bind(municipioController));

    return router;
}

module.exports = { setupRoutes };