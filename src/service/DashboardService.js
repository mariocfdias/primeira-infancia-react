const MissoesRepository = require('../repository/MissoesRepository');
const MunicipioRepository = require('../repository/MunicipioRepository');
const MunicipioDesempenhoRepository = require('../repository/MunicipioDesempenhoRepository');
const { MissionPanoramaDTO, MapPanoramaDTO, DesempenhoPanoramaDTO } = require('../dto/DashboardDTO');
const { MissoesDTO } = require('../dto/MissoesDTO');
const { MunicipioDTO } = require('../dto/MunicipioDTO');

class DashboardService {
    constructor(connection) {
        this.missoesRepository = new MissoesRepository(connection);
        this.municipioRepository = new MunicipioRepository(connection);
        this.municipioDesempenhoRepository = new MunicipioDesempenhoRepository(connection);
    }

    async getMissionPanoramaGeneral() {
        // Get all missions
        const missoes = await this.missoesRepository.findAll();
        
        // Get all municipios to count total
        const municipios = await this.municipioRepository.findAll();
        const totalMunicipios = municipios.length;
        
        // Create mission panorama for each mission
        const missionPanorama = [];
        
        for (const missao of missoes) {
            // Get all desempenhos for this mission
            const desempenhos = await this.municipioDesempenhoRepository.findByMissaoId(missao.id);
            
            // Count by status
            const countValid = desempenhos.filter(d => d.validation_status === 'VALID').length;
            const countPending = desempenhos.filter(d => d.validation_status === 'PENDING').length;
            const countStarted = desempenhos.filter(d => d.validation_status === 'STARTED').length;
            
            // Create panorama DTO
            const missionDTO = MissoesDTO.fromEntity(missao);
            
            const panoramaDTO = MissionPanoramaDTO.builder()
                .withMissao(missionDTO)
                .withCountValid(countValid)
                .withCountPending(countPending)
                .withCountStarted(countStarted)
                .withTotalMunicipios(totalMunicipios)
                .build();
            
            missionPanorama.push(panoramaDTO);
        }
        
        return missionPanorama;
    }

    async getMissionPanoramaById(missaoId) {
        // Get the specific mission
        const missao = await this.missoesRepository.findById(missaoId);
        if (!missao) {
            throw new Error('Missão não encontrada');
        }

        // Get all municipios to count total
        const municipios = await this.municipioRepository.findAll();
        const totalMunicipios = municipios.length;
        
        // Get all desempenhos for this mission
        const desempenhos = await this.municipioDesempenhoRepository.findByMissaoId(missaoId);
        
        // Count by status and filter desempenhos
        const validDesempenhos = desempenhos.filter(d => d.validation_status === 'VALID');
        const pendingDesempenhos = desempenhos.filter(d => d.validation_status === 'PENDING');
        
        // Separate pending desempenhos into started (with evidence) and just pending
        const startedDesempenhos = pendingDesempenhos.filter(d => {
            try {
                const evidence = JSON.parse(d.evidence);
                return Array.isArray(evidence) && evidence.length > 0;
            } catch (e) {
                return false;
            }
        });
        
        const justPendingDesempenhos = pendingDesempenhos.filter(d => {
            try {
                const evidence = JSON.parse(d.evidence);
                return !Array.isArray(evidence) || evidence.length === 0;
            } catch (e) {
                return true;
            }
        });

        const countValid = validDesempenhos.length;
        const countPending = justPendingDesempenhos.length;
        const countStarted = startedDesempenhos.length;
        
        // Get municipios that completed the mission
        const completedMunicipios = [];
        for (const desempenho of validDesempenhos) {
            const municipio = await this.municipioRepository.findOne(desempenho.codIbge);
            if (municipio) {
                completedMunicipios.push(MunicipioDTO.fromEntity(municipio));
            }
        }

        // Get municipios with pending status (no evidence)
        const pendingMunicipios = [];
        for (const desempenho of justPendingDesempenhos) {
            const municipio = await this.municipioRepository.findOne(desempenho.codIbge);
            if (municipio) {
                pendingMunicipios.push(MunicipioDTO.fromEntity(municipio));
            }
        }

        // Get municipios that started the mission (pending with evidence)
        const startedMunicipios = [];
        for (const desempenho of startedDesempenhos) {
            const municipio = await this.municipioRepository.findOne(desempenho.codIbge);
            if (municipio) {
                startedMunicipios.push(MunicipioDTO.fromEntity(municipio));
            }
        }
        
        // Create panorama DTO
        const missionDTO = MissoesDTO.fromEntity(missao);
        
        return MissionPanoramaDTO.builder()
            .withMissao(missionDTO)
            .withCountValid(countValid)
            .withCountPending(countPending)
            .withCountStarted(countStarted)
            .withTotalMunicipios(totalMunicipios)
            .withCompletedMunicipios(completedMunicipios)
            .withPendingMunicipios(pendingMunicipios)
            .withStartedMunicipios(startedMunicipios)
            .build();
    }

    async getMapPanorama() {
        // Get all municipios
        const municipios = await this.municipioRepository.findAll();
        
        // Get all missoes to count total
        const missoes = await this.missoesRepository.findAll();
        const totalMissoes = missoes.length;
        
        // Create map panorama for each municipio
        const mapPanorama = [];
        
        // Initialize level distribution for desempenho panorama
        const pointsPerLevel = 100;
        const municipioPoints = [];
        
        // Count participating prefeituras
        const totalParticipatingPrefeituras = municipios.filter(m => m.status === 'Participante').length;
        
        // Count for percentage of finished missions
        let totalValidMissions = 0;
        let totalMissionEntries = 0;
        
        for (const municipio of municipios) {
            // Get all desempenhos for this municipio
            const desempenhos = await this.municipioDesempenhoRepository.findByIbgeCode(municipio.codIbge);
            
            // Count by status
            const countValid = desempenhos.filter(d => d.validation_status === 'VALID').length;
            const countPending = desempenhos.filter(d => d.validation_status === 'PENDING').length;
            const countStarted = desempenhos.filter(d => d.validation_status === 'STARTED').length;
            
            // Add to totals for percentage calculation
            totalValidMissions += countValid;
            totalMissionEntries += desempenhos.length;
            
            // Calculate total points from valid missions
            let totalPoints = 0;
            const validDesempenhos = desempenhos.filter(d => d.validation_status === 'VALID');
            
            for (const desempenho of validDesempenhos) {
                if (desempenho.missao && desempenho.missao.qnt_pontos) {
                    totalPoints += desempenho.missao.qnt_pontos;
                }
            }
            
            // Store the points for later desempenho calculation
            municipioPoints.push(totalPoints);
            
            // Create panorama DTO with municipio object and points
            const municipioDTO = MunicipioDTO.fromEntity(municipio);
            
            const panoramaDTO = MapPanoramaDTO.builder()
                .withMunicipio(municipioDTO)
                .withCountValid(countValid)
                .withCountPending(countPending)
                .withCountStarted(countStarted)
                .withTotalMissoes(totalMissoes)
                .withPoints(totalPoints)
                .build();
            
            mapPanorama.push(panoramaDTO);
        }
        
        // Calculate percentage of finished missions
        const percentageFinishedMissions = totalMissionEntries > 0 
            ? (totalValidMissions / totalMissionEntries) * 100 
            : 0;
        
        // Inicializa a distribuição de níveis com grupos especiais
        const levelDistribution = [
            {
                level: 'NP',  // Não Participante
                minPoints: 0,
                maxPoints: 0,
                count: 0,
                municipios: []
            },
            {
                level: 0,     // Zero pontos
                minPoints: 0,
                maxPoints: 0,
                count: 0,
                municipios: []
            }
        ];

        // Adiciona níveis regulares (1, 2, 3, etc)
        const maxPoints = Math.max(...municipioPoints, 1);
        const numLevels = Math.ceil(maxPoints / pointsPerLevel);
        
        for (let i = 1; i <= numLevels + 1; i++) {
            levelDistribution.push({
                level: i,
                minPoints: (i - 1) * pointsPerLevel + 1,
                maxPoints: i * pointsPerLevel,
                count: 0,
                municipios: []
            });
        }

        // Distribui os municípios nos níveis
        for (let i = 0; i < municipios.length; i++) {
            const municipio = municipios[i];
            const points = municipioPoints[i];

            // Verifica se é não participante
            if (municipio.status !== 'Participante') {
                levelDistribution[0].count++;
                levelDistribution[0].municipios.push(municipio.codIbge);
                continue;
            }

            // Grupo 0 (zero pontos)
            if (points === 0) {
                levelDistribution[1].count++;
                levelDistribution[1].municipios.push(municipio.codIbge);
                continue;
            }

            // Encontra o nível apropriado para os pontos
            const levelIndex = Math.floor((points - 1) / pointsPerLevel) + 2;
            
            // Garante que não exceda o array
            if (levelIndex < levelDistribution.length) {
                levelDistribution[levelIndex].count++;
                levelDistribution[levelIndex].municipios.push(municipio.codIbge);
            }
        }

        // Cria o panorama de desempenho
        const desempenhoPanorama = DesempenhoPanoramaDTO.builder()
            .withLevelDistribution(levelDistribution)
            .withTotalMunicipios(municipios.length)
            .build();
        
        return {
            mapPanorama,
            desempenho: desempenhoPanorama,
            totalParticipatingPrefeituras,
            percentageFinishedMissions
        };
    }

    async getMapPanoramaByIbgeCode(codIbge) {
        // Verifica se o município existe
        const municipio = await this.municipioRepository.findOne(codIbge);
        if (!municipio) {
            throw new Error('Município não encontrado');
        }
        
        // Obtém todas as missões para contar o total
        const missoes = await this.missoesRepository.findAll();
        const totalMissoes = missoes.length;
        
        // Obtém todos os desempenhos para este município
        const desempenhos = await this.municipioDesempenhoRepository.findByIbgeCode(codIbge);
        
        // Conta por status
        const countValid = desempenhos.filter(d => d.validation_status === 'VALID').length;
        const countPending = desempenhos.filter(d => d.validation_status === 'PENDING').length;
        const countStarted = desempenhos.filter(d => d.validation_status === 'STARTED').length;
        
        // Calcula o total de pontos das missões válidas
        let totalPoints = 0;
        const validDesempenhos = desempenhos.filter(d => d.validation_status === 'VALID');
        
        for (const desempenho of validDesempenhos) {
            if (desempenho.missao && desempenho.missao.qnt_pontos) {
                totalPoints += desempenho.missao.qnt_pontos;
            }
        }
        
        // Cria o DTO do panorama com o objeto município e pontos
        const municipioDTO = MunicipioDTO.fromEntity(municipio);
        
        const panoramaDTO = MapPanoramaDTO.builder()
            .withMunicipio(municipioDTO)
            .withCountValid(countValid)
            .withCountPending(countPending)
            .withCountStarted(countStarted)
            .withTotalMissoes(totalMissoes)
            .withPoints(totalPoints)
            .build();
        
        // Determina o nível do município com base nos pontos
        const pointsPerLevel = 100;
        let level;
        
        // Verifica se é não participante
        if (municipio.status !== 'Participante') {
            level = 'NP';  // Não Participante
        } else if (totalPoints === 0) {
            level = 0;     // Zero pontos
        } else {
            level = Math.floor((totalPoints - 1) / pointsPerLevel) + 1;
        }
        
        return {
            mapPanorama: panoramaDTO,
            level: level,
            totalPoints: totalPoints
        };
    }
}

module.exports = DashboardService; 