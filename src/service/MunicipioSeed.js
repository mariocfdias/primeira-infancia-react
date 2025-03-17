const MunicipioService = require('../service/MunicipioService');

async function seedMunicipios(connection) {
    console.log('Starting seed: municipios');
    const municipioService = new MunicipioService(connection);
    
    const municipiosData = [
        {
            cod_ibge: "mpce",
            nome: "Ministério Público do Estado do Ceará",
            status: "Participante",
            data_alteracao: new Date().toISOString(),
            imagem_avatar: "https://drive.google.com/file/d/13L40cl7VagIjuQtvStsH39omSGaLovvS/view?usp=sharing",
            badges: 0,
            points: 0,
            orgao: true
        }
    ];

    try {
        // Verificar se já existem municípios no banco
        const existingMunicipios = await municipioService.findAll();
        
        if (existingMunicipios.length === 0) {
            // Se não existirem municípios, adicionar os dados de seed
            const promises = municipiosData.map(municipioData => {
                return municipioService.saveMunicipio(municipioData);
            });
            
            await Promise.all(promises);
            console.log(`Seed completed: ${municipiosData.length} municipios added`);
        } else {
            console.log('Seed skipped: Database already contains municipios');
        }
    } catch (error) {
        console.error('Error in municipios seed:', error.message);
    }
    
    console.log('Finished seed: municipios');
}

module.exports = seedMunicipios;