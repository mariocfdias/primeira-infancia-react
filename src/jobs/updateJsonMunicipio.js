const fetch = require('node-fetch');
const MunicipioService = require('../service/MunicipioService');

async function updateJsonMunicipio(connection, url) {
    console.log('Starting job: updateJsonMunicipio');
    const municipioService = new MunicipioService(connection);
    
    try {
        const municipios = await municipioService.findParticipantes();
        
        for (const municipio of municipios) {
            try {
                const specificUrl = `${url}?ibge=${municipio.codIbge}`;
                const response = await fetch(specificUrl);
                const data = await response.json();
                console.log({data})
                console.log({url})

                if (data) {
                    await municipioService.updateMunicipioJson(municipio.codIbge, data);
                    console.log(`Updated JSON for municipio ${municipio.codIbge}`);
                }
            } catch (error) {
                console.error(`Error updating JSON for municipio ${municipio.codIbge}:`, error.message);
            }
        }
    } catch (error) {
        console.error('Error in updateJsonMunicipio job:', error.message);
    }
    
    console.log('Finished job: updateJsonMunicipio');
}

module.exports = updateJsonMunicipio;