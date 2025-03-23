const fetch = require('node-fetch');
const MissoesService = require('../service/MissoesService');
const { MissoesDTO } = require('../dto/MissoesDTO');

/**
 * Fetches the latest missions data from external API and updates the database
 * @param {Object} connection - Database connection
 * @param {String} url - URL to fetch missions from
 */
async function fetchMissoes(connection, url) {
    console.log('Starting job: fetchMissoes');
    
    const missoesService = new MissoesService(connection);
    
    try {
        // Construct URL with the request parameter
        const fetchUrl = `${url}?request=documentacao_missoes`;
        console.log(`Fetching from URL: ${fetchUrl}`);
        
        const response = await fetch(fetchUrl);
        const data = await response.json();
        
        if (data.status === 'success' && Array.isArray(data.data)) {
            console.log(`Received ${data.data.length} missions to process`);
            
            // Process and save each mission
            for (const missaoData of data.data) {
                try {
                    // Check if mission already exists
                    let existingMissao;
                    try {
                        existingMissao = await missoesService.findById(missaoData.id);
                    } catch (error) {
                        // Mission doesn't exist yet
                        existingMissao = null;
                    }
                    
                    // Create a DTO from the received data
                    const missaoDTO = MissoesDTO.builder()
                        .withId(missaoData.id)
                        .withCategoria(missaoData.categoria)
                        .withDescricaoCategoria(missaoData.descricao_da_categoria)
                        .withEmblemaCategoria(missaoData.emblema_da_categoria)
                        .withDescricaoMissao(missaoData.descricao_da_missao)
                        .withQuantidadePontos(missaoData.qnt_pontos)
                        .withLinkFormulario(missaoData.link_formulario)
                        .withEvidencias(missaoData.evidencias || [])
                        .build();
                    
                    // Save or update the mission in the database
                    if (existingMissao) {
                        await missoesService.updateMissao(missaoData.id, missaoDTO);
                        console.log(`Updated existing mission: ${missaoData.id}`);
                    } else {
                        await missoesService.createMissao(missaoDTO);
                        console.log(`Saved new mission: ${missaoData.id}`);
                    }
                } catch (missionError) {
                    console.error(`Error processing mission ${missaoData.id}:`, missionError.message);
                }
            }
            
            console.log(`Successfully processed ${data.data.length} missions`);
        } else {
            console.log('No missions data to process or invalid format received');
        }
    } catch (error) {
        console.error('Error in fetchMissoes job:', error.message);
    }
    
    console.log('Finished job: fetchMissoes');
}

module.exports = fetchMissoes; 