const MunicipioService = require('../service/MunicipioService');

class MunicipioController {
    constructor(connection) {
        this.municipioService = new MunicipioService(connection);
    }

    async getAllMunicipios(req, res) {
        try {
            const municipios = await this.municipioService.findAll();
            return res.json({ status: 'success', data: municipios });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async getMunicipioByIdWithJson(req, res) {
        try {
            const { ibge } = req.params;
            console.log({codIbge: ibge})
            const municipio = await this.municipioService.findByIdWithJson(ibge);
            if (!municipio) {
                return res.status(404).json({ status: 'error', message: 'Municipio not found' });
            }
            return res.json({ status: 'success', data: municipio });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

module.exports = MunicipioController;
