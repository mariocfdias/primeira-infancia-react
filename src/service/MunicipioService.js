const fetch = require('node-fetch');
const MunicipioRepository = require('../repository/MunicipioRepository');

class MunicipioService {
    constructor(connection) {
        this.municipioRepository = new MunicipioRepository(connection);
    }

    async findAll() {
        return await this.municipioRepository.findAll();
    }

    async findByIdWithJson(codIbge) {
        return await this.municipioRepository.findByIdWithJson(codIbge);
    }

    async saveMunicipio(municipioData) {
        const municipio = {
            codIbge: municipioData.cod_ibge,
            status: municipioData.status,
            nome: municipioData.nome
            };
        return await this.municipioRepository.save(municipio);
    }

    async updateMunicipioJson(codIbge, jsonData) {
        const municipio = await this.municipioRepository.findByIdWithJson(codIbge);
        if (!municipio) {
            throw new Error(`Municipio with codIbge ${codIbge} not found`);
        }
        municipio.json = JSON.stringify(jsonData);
        return await this.municipioRepository.save(municipio);
    }
}

module.exports = MunicipioService;
