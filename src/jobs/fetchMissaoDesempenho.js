const fetch = require('node-fetch');
const MunicipioDesempenhoService = require('../service/MunicipioDesempenhoService');
const { MunicipioDesempenhoDTO } = require('../dto/MunicipioDesempenhoDTO');
const MissoesService = require('../service/MissoesService');
const MunicipioService = require('../service/MunicipioService');
const { ORG_IBGE_CODES } = require('../service/MunicipioDesempenhoSeed');

/**
 * Fetches the latest mission performance data from external API based on the most recent updated_at
 * @param {Object} connection - Database connection
 * @param {String} url - URL to fetch mission performance data from
 */
async function fetchMissaoDesempenho(connection, url) {
    console.log('Starting job: fetchMissaoDesempenho');
    
    const municipioDesempenhoService = new MunicipioDesempenhoService(connection);
    const missoesService = new MissoesService(connection);
    const municipioService = new MunicipioService(connection);
    
    try {
        // Get all missions from the database
        const missoes = await missoesService.findAll();
        console.log(`Found ${missoes.length} missions to process`);
        
        // Process each mission
        for (const missao of missoes) {
            try {
                // Get the latest update date for this specific mission using TypeORM query
                const latestDate = await municipioDesempenhoService.getLatestUpdateDateByMissaoId(missao.id);
                const dateParam = latestDate.toISOString();
                console.log(`Fetching mission performance data for mission ${missao.id} newer than: ${dateParam}`);
                
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
                            // Skip organizations that are in the ORG_IBGE_CODES list
                            if (ORG_IBGE_CODES.includes(desempenhoData.codIbge)) {
                                console.log(`Skipping organization ${desempenhoData.codIbge} for mission ${desempenhoData.missaoId} - using seeded data instead`);
                                continue;
                            }
                            
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
                            
                            // Update municipality points and badges by recalculating from all completed missions
                            try {
                                // Get the municipality
                                const municipio = await municipioService.findByIdWithJson(desempenhoData.codIbge);
                                if (municipio) {
                                    // Get all completed missions for this municipality
                                    const allDesempenhos = await municipioDesempenhoService.findByIbgeCode(desempenhoData.codIbge);
                                    const completedDesempenhos = allDesempenhos.filter(d => d.validation_status === 'VALID');
                                    
                                    // Calculate total points and badges from completed missions
                                    let totalPoints = 0;
                                    const completedMissionIds = new Set();
                                    
                                    // For each completed mission, add its points
                                    for (const completedDesempenho of completedDesempenhos) {
                                        try {
                                            const mission = await missoesService.findById(completedDesempenho.missaoId);
                                            totalPoints += mission.qnt_pontos || 0;
                                            completedMissionIds.add(completedDesempenho.missaoId);
                                        } catch (missionError) {
                                            console.error(`Error fetching mission ${completedDesempenho.missaoId}:`, missionError.message);
                                        }
                                    }
                                    
                                    // Count unique badges (one badge per completed mission)
                                    const badgeCount = completedMissionIds.size;
                                    
                                    // Update municipality with calculated points and badges
                                    const updatedMunicipio = {
                                        ...municipio,
                                        points: totalPoints,
                                        badges: badgeCount
                                    };
                                    
                                    await municipioService.saveMunicipio(updatedMunicipio);
                                    console.log(`Updated municipality ${desempenhoData.codIbge} with recalculated points (${totalPoints}) and badges (${badgeCount})`);
                                } else {
                                    console.error(`Municipality ${desempenhoData.codIbge} not found, could not update points and badges`);
                                }
                            } catch (municipioError) {
                                console.error(`Error updating municipality ${desempenhoData.codIbge} points and badges:`, municipioError.message);
                            }
                        } catch (error) {
                            console.error(`Error processing performance record for municipality ${desempenhoData.codIbge}, mission ${desempenhoData.missaoId}:`, error.message);
                            console.error(error.stack);
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