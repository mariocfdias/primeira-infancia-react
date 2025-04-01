const MunicipioDesempenhoService = require('../service/MunicipioDesempenhoService');
const MissoesService = require('../service/MissoesService');
const MunicipioService = require('../service/MunicipioService');
const { MunicipioDesempenhoDTO } = require('../dto/MunicipioDesempenhoDTO');

// List of organizations for which we'll create seed data
// These will also be skipped in fetchMissaoDesempenho.js
const ORG_IBGE_CODES = ['mpce', 'govce', 'tcece', 'podleg'];

async function seedMunicipioDesempenho(connection) {
    console.log('Starting seed: municipio_desempenho');
    const municipioDesempenhoService = new MunicipioDesempenhoService(connection);
    const missoesService = new MissoesService(connection);
    const municipioService = new MunicipioService(connection);
    
    try {
        // Verify organizations exist in the database
        for (const codIbge of ORG_IBGE_CODES) {
            try {
                const municipio = await municipioService.findById(codIbge);
                if (municipio) {
                    // Delete all existing desempenhos for this organization
                    await municipioDesempenhoService.deleteByIbgeCode(codIbge);
                    console.log(`Deleted existing desempenhos for organization ${codIbge}`);
                    
                    // Reset badges and points
                    const resetMunicipio = {
                        ...municipio,
                        badges: 0,
                        points: 0
                    };
                    console.log({resetMunicipio});
                    await municipioService.saveMunicipio(resetMunicipio);
                    console.log(`Reset badges and points for organization ${codIbge}`);
                }
            } catch (error) {
                console.error(`Organization ${codIbge} not found in database. Skipping.`);
                return;
            }
        }
        
        // Get all missions
        const missoes = await missoesService.findAll();
        console.log(`Found ${missoes.length} missions to use for seeding`);
        
        if (missoes.length === 0) {
            console.log('No missions found in database. Skipping seed.');
            return;
        }

        // Check if we already have desempenho records for these organizations
        let existingRecordsCount = 0;
        for (const codIbge of ORG_IBGE_CODES) {
            try {
                const desempenhos = await municipioDesempenhoService.findByIbgeCode(codIbge);
                existingRecordsCount += desempenhos.length;
            } catch (error) {
                console.error(`Error checking existing records for ${codIbge}:`, error.message);
            }
        }

        if (existingRecordsCount > 0) {
            console.log(`Seed skipped: Database already contains ${existingRecordsCount} desempenho records for the organizations`);
            return;
        }
        
        // Create desempenho records for each organization and mission
        const createdRecords = [];
        
        for (const codIbge of ORG_IBGE_CODES) {
            for (const missao of missoes) {
                try {
                    // Create desempenho with random status (mostly VALID for demo purposes)
                    const random = Math.random();
                    let status;
                    if (random < 0.7) {
                        status = 'VALID';
                    } else if (random < 0.9) {
                        status = 'PENDING';
                    } else {
                        status = 'STARTED';
                    }
                    
                    // Create evidence array based on missao.evidencias if it exists
                    let evidence = [];
                    if (missao.evidencias && Array.isArray(missao.evidencias)) {
                        evidence = missao.evidencias
                            .map((_, index) => {
                                // 40% chance of having evidence
                                const hasEvidence = Math.random() < 0.4;
                                if (!hasEvidence) return null;
                                
                                return {
                                    evidencia: `https://drive.google.com/open?id=${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
                                    title: `Evidência ${index + 1}`
                                };
                            })
                            .filter(item => item !== null); // Remove null entries
                    }
                    
                    // Calculate date in the past (0-30 days ago)
                    const daysAgo = Math.floor(Math.random() * 30);
                    const updatedAt = new Date();
                    updatedAt.setDate(updatedAt.getDate() - daysAgo);
                    
                    // Create DTO
                    const desempenhoDTO = MunicipioDesempenhoDTO.builder()
                        .withCodIbge(codIbge)
                        .withMissaoId(missao.id)
                        .withValidationStatus(status)
                        .withUpdatedAt(updatedAt)
                        .withEvidence(evidence)
                        .build();
                    
                    // Save to database
                    const savedDesempenho = await municipioDesempenhoService.createDesempenho(desempenhoDTO);
                    createdRecords.push(savedDesempenho);
                    
                    console.log(`Created desempenho for organization ${codIbge}, mission ${missao.id} with status ${status}`);
                } catch (error) {
                    console.error(`Error creating desempenho for organization ${codIbge}, mission ${missao.id}:`, error.message);
                }
            }
        }
        
        console.log(`Successfully created ${createdRecords.length} desempenho records`);
        
        // Update organization points and badges
        for (const codIbge of ORG_IBGE_CODES) {
            try {
                // Get the organization
                const municipio = await municipioService.findById(codIbge);
                
                // Get all completed missions for this organization
                const desempenhos = await municipioDesempenhoService.findByIbgeCode(codIbge);
                const completedDesempenhos = desempenhos.filter(d => d.validation_status === 'VALID');
                
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
                
                // Update organization with calculated points and badges
                const updatedMunicipio = {
                    ...municipio,
                    points: totalPoints,
                    badges: badgeCount
                };
                
                await municipioService.saveMunicipio(updatedMunicipio);
                console.log(`Updated organization ${codIbge} with recalculated points (${totalPoints}) and badges (${badgeCount})`);
            } catch (error) {
                console.error(`Error updating organization ${codIbge} points and badges:`, error.message);
            }
        }
    } catch (error) {
        console.error('Error in municipio_desempenho seed:', error.message);
    }
    
    console.log('Finished seed: municipio_desempenho');
}

module.exports = {
    seedMunicipioDesempenho,
    ORG_IBGE_CODES // Export the list so it can be used in fetchMissaoDesempenho.js
}; 