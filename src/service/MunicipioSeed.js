const MunicipioService = require('../service/MunicipioService');

async function seedMunicipios(connection) {
    console.log('Starting seed: municipios');
    const municipioService = new MunicipioService(connection);
    
    const municipiosData = [
        {
            cod_ibge: "mpce",
            nome: "Ministério Público do Estado do Ceará",
            status: "Participante",
            data_alteracao: new Date(0).toISOString(),
            imagem_avatar: "https://drive.google.com/file/d/13L40cl7VagIjuQtvStsH39omSGaLovvS/view?usp=sharing",
            badges: 0,
            points: 0,
            orgao: true
        },
        {
            cod_ibge: "govce",
            nome: "Governo do Estado do Ceará",
            status: "Participante",
            data_alteracao: new Date(0).toISOString(),
            imagem_avatar: "https://drive.google.com/file/d/13L40cl7VagIjuQtvStsH39omSGaLovvS/view?usp=sharing",
            badges: 0,
            points: 0,
            orgao: true
        },
        {
            cod_ibge: "tcece",
            nome: "TCE Ceará",
            status: "Participante",
            data_alteracao: new Date(0).toISOString(),
            imagem_avatar: "https://drive.google.com/file/d/13L40cl7VagIjuQtvStsH39omSGaLovvS/view?usp=sharing",
            badges: 0,
            points: 0,
            orgao: true
        },
        {
            cod_ibge: "podleg",
            nome: "Poder Legislativo do Estado do Ceará",
            status: "Participante",
            data_alteracao: new Date(0).toISOString(),
            imagem_avatar: "https://drive.google.com/file/d/13L40cl7VagIjuQtvStsH39omSGaLovvS/view?usp=sharing",
            badges: 0,
            points: 0,
            orgao: true
        },
    ];

    try {
        // Verificar se já existem os municipios específicos no banco
        const results = [];
        
        for (const municipioData of municipiosData) {
            const existingMunicipio = await municipioService.findById(municipioData.cod_ibge);

            console.log({existingMunicipio});
            
            if (existingMunicipio == null) {
                console.log(`Adding municipio: ${municipioData.nome}`);
                // Se o município não existir, adiciona-o
                const savedMunicipio = await municipioService.saveMunicipio(municipioData);
                results.push(savedMunicipio);
                console.log(`Added municipio: ${municipioData.nome}`);
            } else {
                console.log(`Skipped: ${municipioData.nome} already exists`);
            }
        }
        
        console.log(`Seed completed: ${results.length} new municipios added`);
    } catch (error) {
        console.error('Error in municipios seed:', error.message);
    }
    
    console.log('Finished seed: municipios');
}

module.exports = seedMunicipios;