const MunicipioDesempenhoService = require('../service/MunicipioDesempenhoService');
const MissoesService = require('../service/MissoesService');
const MunicipioService = require('../service/MunicipioService');
const { MunicipioDesempenhoDTO } = require('../dto/MunicipioDesempenhoDTO');

async function seedMunicipioDesempenho(connection) {
    console.log('Starting seed: municipio_desempenho');
    const municipioDesempenhoService = new MunicipioDesempenhoService(connection);
    const missoesService = new MissoesService(connection);
    const municipioService = new MunicipioService(connection);
    
    try {
        // Get all municipalities from the database
        const municipios = await municipioService.findAll();
        console.log(`Found ${municipios.length} municipalities to seed`);
        
        if (municipios.length === 0) {
            console.log('No municipalities found in database. Skipping seed.');
            return;
        }

        // Get all missions
        const missoes = await missoesService.findAll();
        console.log(`Found ${missoes.length} missions to use for seeding`);
        
        if (missoes.length === 0) {
            console.log('No missions found in database. Skipping seed.');
            return;
        }

        // Select 10 random municipalities to have all missions completed
        const numFullyCompleted = Math.min(2, municipios.length);
        const shuffledMunicipios = [...municipios].sort(() => Math.random() - 0.5);
        const fullyCompletedMunicipios = shuffledMunicipios.slice(0, numFullyCompleted);
        const remainingMunicipios = shuffledMunicipios.slice(numFullyCompleted);

        // Verify and reset each municipality
        for (const municipio of municipios) {
            try {
                // Delete all existing desempenhos for this municipality
                await municipioDesempenhoService.deleteByIbgeCode(municipio.codIbge);
                console.log(`Deleted existing desempenhos for municipality ${municipio.codIbge}`);
                
                // Reset badges and points
                const resetMunicipio = {
                    ...municipio,
                    badges: 0,
                    points: 0
                };
                await municipioService.saveMunicipio(resetMunicipio);
                console.log(`Reset badges and points for municipality ${municipio.codIbge}`);
            } catch (error) {
                console.error(`Error resetting municipality ${municipio.codIbge}:`, error.message);
                continue;
            }
        }

        // Create desempenho records
        const createdRecords = [];
        
        // First, create VALID desempenhos for the fully completed municipalities
        console.log(`Creating VALID desempenhos for ${numFullyCompleted} fully completed municipalities`);
        for (const municipio of fullyCompletedMunicipios) {
            for (const missao of missoes) {
                try {
                    // Create evidence array based on missao.evidencias
                    let evidence = [];
                    if (missao.evidencias && Array.isArray(missao.evidencias)) {
                        evidence = missao.evidencias.map((_, index) => ({
                            evidencia: `https://drive.google.com/open?id=${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
                            title: `Evidência ${index + 1}`
                        }));
                    }
                    
                    // Calculate date in the past (0-30 days ago)
                    const daysAgo = Math.floor(Math.random() * 30);
                    const updatedAt = new Date();
                    updatedAt.setDate(updatedAt.getDate() - daysAgo);
                    
                    // Create DTO with VALID status
                    const desempenhoDTO = MunicipioDesempenhoDTO.builder()
                        .withCodIbge(municipio.codIbge)
                        .withMissaoId(missao.id)
                        .withValidationStatus('VALID')
                        .withUpdatedAt(updatedAt)
                        .withEvidence(evidence)
                        .build();
                    
                    // Save to database
                    const savedDesempenho = await municipioDesempenhoService.createDesempenho(desempenhoDTO);
                    createdRecords.push(savedDesempenho);
                    
                    console.log(`Created VALID desempenho for fully completed municipality ${municipio.codIbge}, mission ${missao.id}`);
                } catch (error) {
                    console.error(`Error creating desempenho for municipality ${municipio.codIbge}, mission ${missao.id}:`, error.message);
                }
            }
        }
        
        // Then create random status desempenhos for the remaining municipalities
        console.log(`Creating random status desempenhos for ${remainingMunicipios.length} remaining municipalities`);
        for (const municipio of remainingMunicipios) {
            for (const missao of missoes) {
                try {
                    // Create desempenho with random status (mostly VALID for demo purposes)
                    const random = Math.random();
                    let status;
                    if (random < 0.08) {
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
                            .filter(item => item !== null);
                    }
                    
                    // Calculate date in the past (0-30 days ago)
                    const daysAgo = Math.floor(Math.random() * 30);
                    const updatedAt = new Date();
                    updatedAt.setDate(updatedAt.getDate() - daysAgo);
                    
                    // Create DTO
                    const desempenhoDTO = MunicipioDesempenhoDTO.builder()
                        .withCodIbge(municipio.codIbge)
                        .withMissaoId(missao.id)
                        .withValidationStatus(status)
                        .withUpdatedAt(updatedAt)
                        .withEvidence(evidence)
                        .build();
                    
                    // Save to database
                    const savedDesempenho = await municipioDesempenhoService.createDesempenho(desempenhoDTO);
                    createdRecords.push(savedDesempenho);
                    
                    console.log(`Created desempenho for municipality ${municipio.codIbge}, mission ${missao.id} with status ${status}`);
                } catch (error) {
                    console.error(`Error creating desempenho for municipality ${municipio.codIbge}, mission ${missao.id}:`, error.message);
                }
            }
        }
        
        console.log(`Successfully created ${createdRecords.length} desempenho records`);
        
        // Update municipality points and badges
        for (const municipio of municipios) {
            try {
                // Get all completed missions for this municipality
                const desempenhos = await municipioDesempenhoService.findByIbgeCode(municipio.codIbge);
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
                
                // Update municipality with calculated points and badges
                const updatedMunicipio = {
                    ...municipio,
                    points: totalPoints,
                    badges: badgeCount
                };
                
                await municipioService.saveMunicipio(updatedMunicipio);
                console.log(`Updated municipality ${municipio.codIbge} with recalculated points (${totalPoints}) and badges (${badgeCount})`);
            } catch (error) {
                console.error(`Error updating municipality ${municipio.codIbge} points and badges:`, error.message);
            }
        }
    } catch (error) {
        console.error('Error in municipio_desempenho seed:', error.message);
    }
    
    console.log('Finished seed: municipio_desempenho');
}

module.exports = {
    seedMunicipioDesempenho
}; 