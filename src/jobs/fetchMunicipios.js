const fetch = require('node-fetch');
const MunicipioService = require('../service/MunicipioService');

async function fetchMunicipios(connection, url) {
    console.log('Starting job: fetchMunicipios');
    
    const municipioService = new MunicipioService(connection);
    
    try {
        // Get the biggest dataAlteracao using the repository
        const biggestDate = await municipioService.municipioRepository.getMaxDataAlteracao();
        console.log(`Latest dataAlteracao found: ${biggestDate}`);
        
        // Format URL with date parameter
        const fetchUrl = `${url}?request=participantes&date=${encodeURIComponent(biggestDate.toISOString())}`;
        console.log(`Fetching from URL: ${fetchUrl}`);
        
        const response = await fetch(fetchUrl);
        const data = await response.json();

        if (data.status === 'success' && Array.isArray(data.data)) {
            const promises = data.data.map(municipioData => {
                console.log({municipioData})
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
