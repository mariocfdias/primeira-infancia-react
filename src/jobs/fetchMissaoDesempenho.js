const fetch = require('node-fetch');
const MunicipioDesempenhoService = require('../service/MunicipioDesempenhoService');
const { MunicipioDesempenhoDTO } = require('../dto/MunicipioDesempenhoDTO');
const MissoesService = require('../service/MissoesService');

/**
 * Fetches the latest mission performance data from external API based on the most recent updated_at
 * @param {Object} connection - Database connection
 * @param {String} url - URL to fetch mission performance data from
 */
async function fetchMissaoDesempenho(connection, url) {
    console.log('Starting job: fetchMissaoDesempenho');
    
    const municipioDesempenhoService = new MunicipioDesempenhoService(connection);
    const missoesService = new MissoesService(connection);
    
    try {
        // Get all performance records to find the most recent updated_at
        const desempenhos = await municipioDesempenhoService.findAll();
        let latestDate = new Date(0); // Default to epoch if no records exist
        
        if (desempenhos.length > 0) {
            // Find the latest updated_at date
            desempenhos.forEach(desempenho => {
                const updateDate = new Date(desempenho.updated_at);
                if (updateDate > latestDate) {
                    latestDate = updateDate;
                }
            });
        }
        
        // Format date as ISO string for the API request
        const dateParam = latestDate.toISOString();
        console.log(`Fetching mission performance data newer than: ${dateParam}`);
        
        // Get all missions from the database
        const missoes = await missoesService.findAll();
        console.log(`Found ${missoes.length} missions to process`);
        
        // Process each mission
        for (const missao of missoes) {
            try {
                // Make the API request with the request type, date parameter, and missao parameter
                const fetchUrl = `${url}?request=missao_desempenho&date=${encodeURIComponent(dateParam)}&missao=${encodeURIComponent(missao.id)}`;
                console.log(`Fetching from URL for mission ${missao.id}: ${fetchUrl}`);
                
                const response = await fetch(fetchUrl);
                const data = await response.json();
                
                if (data.status === 'success' && Array.isArray(data.data) && data.data.length > 0) {
                    console.log(`Received ${data.data.length} performance records for mission ${missao.id}`);
                    
                    // Process and save each performance record
                    for (const desempenhoData of data.data) {
                        try {
                            // Check if a record with the same codIbge and missaoId already exists
                            const existingDesempenhos = await municipioDesempenhoService.findByIbgeCode(desempenhoData.codIbge);
                            const existingDesempenho = existingDesempenhos.find(d => d.missaoId === desempenhoData.missaoId);
                            
                            // Create a DTO from the received data
                            const desempenhoDTO = MunicipioDesempenhoDTO.builder()
                                .withCodIbge(desempenhoData.codIbge)
                                .withMissaoId(desempenhoData.missaoId)
                                .withValidationStatus(desempenhoData.validation_status || 'STARTED')
                                .withUpdatedAt(desempenhoData.updated_at || new Date())
                                .withEvidence(desempenhoData.evidence || [])
                                .build();
                            
                            // If the record exists, update it; otherwise, create a new one
                            if (existingDesempenho) {
                                desempenhoDTO.id = existingDesempenho.id;
                                await municipioDesempenhoService.updateDesempenho(existingDesempenho.id, desempenhoDTO);
                                console.log(`Updated existing performance record for municipality ${desempenhoData.codIbge}, mission ${desempenhoData.missaoId}`);
                            } else {
                                await municipioDesempenhoService.createDesempenho(desempenhoDTO);
                                console.log(`Saved new performance record for municipality ${desempenhoData.codIbge}, mission ${desempenhoData.missaoId}`);
                            }
                        } catch (error) {
                            console.error(`Error processing performance record for municipality ${desempenhoData.codIbge}, mission ${desempenhoData.missaoId}:`, error.message);
                        }
                    }
                    
                    console.log(`Successfully processed ${data.data.length} performance records for mission ${missao.id}`);
                } else {
                    console.log(`No performance data to process or invalid format received for mission ${missao.id}`);
                }
            } catch (missionError) {
                console.error(`Error processing mission ${missao.id}:`, missionError.message);
            }
        }
    } catch (error) {
        console.error('Error in fetchMissaoDesempenho job:', error.message);
    }
    
    console.log('Finished job: fetchMissaoDesempenho');
}

module.exports = fetchMissaoDesempenho; 