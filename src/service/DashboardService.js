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

    async getMissionPanorama() {
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
        const levelDistribution = [];
        const municipioPoints = [];
        
        for (const municipio of municipios) {
            // Get all desempenhos for this municipio
            const desempenhos = await this.municipioDesempenhoRepository.findByIbgeCode(municipio.codIbge);
            
            // Count by status
            const countValid = desempenhos.filter(d => d.validation_status === 'VALID').length;
            const countPending = desempenhos.filter(d => d.validation_status === 'PENDING').length;
            const countStarted = desempenhos.filter(d => d.validation_status === 'STARTED').length;
            
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
        
        // Calculate level distribution
        // Find max points to determine number of levels
        const maxPoints = Math.max(...municipioPoints, 1); // Default to at least 1 to avoid division by zero
        const numLevels = Math.ceil(maxPoints / pointsPerLevel);
        
        // Ensure we have at least one level more than required (guaranteed next level)
        const totalLevels = Math.max(numLevels + 1, 2); // At least 2 levels (0 and 1)
        
        // Initialize the level distribution array with municipality codes for each level
        for (let i = 0; i < totalLevels; i++) {
            levelDistribution.push({
                level: i,
                minPoints: i * pointsPerLevel,
                maxPoints: (i + 1) * pointsPerLevel - 1,
                count: 0,
                municipios: [] // Array to store municipality IBGE codes
            });
        }
        
        // Count municipalities in each level and add their IBGE codes
        for (let i = 0; i < municipioPoints.length; i++) {
            const points = municipioPoints[i];
            const levelIndex = Math.floor(points / pointsPerLevel);
            
            // Ensure we don't exceed the array bounds
            if (levelIndex < totalLevels) {
                levelDistribution[levelIndex].count++;
                levelDistribution[levelIndex].municipios.push(municipios[i].codIbge);
            }
        }
        
        // Create the desempenho panorama
        const desempenhoPanorama = DesempenhoPanoramaDTO.builder()
            .withLevelDistribution(levelDistribution)
            .withTotalMunicipios(municipios.length)
            .build();
        
        return {
            mapPanorama,
            desempenho: desempenhoPanorama
        };
    }
}

module.exports = DashboardService; 