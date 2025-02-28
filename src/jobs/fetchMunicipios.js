const fetch = require('node-fetch');
const MunicipioService = require('../service/MunicipioService');

async function fetchMunicipios(connection, url) {
    console.log('Starting job: fetchMunicipios');
    const municipioService = new MunicipioService(connection);
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log({data})

        if (data.status === 'success' && Array.isArray(data.data)) {
            const promises = data.data.map(municipioData => {
                return municipioService.saveMunicipio(municipioData);
            });
            
            await Promise.all(promises);
            console.log(`Successfully processed ${promises.length} municipios`);
        } else {
            throw new Error('Invalid data format received');
        }
    } catch (error) {
        console.error('Error in fetchMunicipios job:', error.message);
    }
    
    console.log('Finished job: fetchMunicipios');
}

module.exports = fetchMunicipios;
