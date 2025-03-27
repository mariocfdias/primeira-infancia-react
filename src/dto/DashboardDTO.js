class MissionPanoramaDTO {
    constructor() {
        this.missao = null;
        this.countValid = 0;
        this.countPending = 0;
        this.countStarted = 0;
        this.totalMunicipios = 0;
        this.completedMunicipios = [];
        this.pendingMunicipios = [];
        this.startedMunicipios = [];
    }

    static builder() {
        return new class {
            withMissao(missao) {
                this.missao = missao;
                return this;
            }
            
            withCountValid(countValid) {
                this.countValid = countValid;
                return this;
            }
            
            withCountPending(countPending) {
                this.countPending = countPending;
                return this;
            }
            
            withCountStarted(countStarted) {
                this.countStarted = countStarted;
                return this;
            }
            
            withTotalMunicipios(totalMunicipios) {
                this.totalMunicipios = totalMunicipios;
                return this;
            }
            
            withCompletedMunicipios(completedMunicipios) {
                this.completedMunicipios = completedMunicipios;
                return this;
            }
            
            withPendingMunicipios(pendingMunicipios) {
                this.pendingMunicipios = pendingMunicipios;
                return this;
            }
            
            withStartedMunicipios(startedMunicipios) {
                this.startedMunicipios = startedMunicipios;
                return this;
            }
            
            build() {
                return {
                    missao: this.missao,
                    countValid: this.countValid,
                    countPending: this.countPending,
                    countStarted: this.countStarted,
                    totalMunicipios: this.totalMunicipios,
                    completedMunicipios: this.completedMunicipios || [],
                    pendingMunicipios: this.pendingMunicipios || [],
                    startedMunicipios: this.startedMunicipios || []
                };
            }
        }
    }
}

class MapPanoramaDTO {
    constructor() {
        this.municipio = null;
        this.countValid = 0;
        this.countPending = 0;
        this.countStarted = 0;
        this.totalMissoes = 0;
        this.points = 0;
    }

    static builder() {
        return new MapPanoramaBuilder();
    }
}

class MapPanoramaBuilder {
    constructor() {
        this.dto = new MapPanoramaDTO();
    }

    withMunicipio(municipio) {
        this.dto.municipio = municipio;
        return this;
    }

    withCountValid(count) {
        this.dto.countValid = count;
        return this;
    }

    withCountPending(count) {
        this.dto.countPending = count;
        return this;
    }

    withCountStarted(count) {
        this.dto.countStarted = count;
        return this;
    }

    withTotalMissoes(count) {
        this.dto.totalMissoes = count;
        return this;
    }

    withPoints(points) {
        this.dto.points = points;
        return this;
    }

    build() {
        return this.dto;
    }
}

class DesempenhoPanoramaDTO {
    constructor() {
        this.levelDistribution = [];
        this.totalMunicipios = 0;
    }

    static builder() {
        return new DesempenhoPanoramaBuilder();
    }
}

class DesempenhoPanoramaBuilder {
    constructor() {
        this.dto = new DesempenhoPanoramaDTO();
    }

    withLevelDistribution(distribution) {
        this.dto.levelDistribution = distribution;
        return this;
    }

    withTotalMunicipios(count) {
        this.dto.totalMunicipios = count;
        return this;
    }

    build() {
        return this.dto;
    }
}

module.exports = {
    MissionPanoramaDTO,
    MapPanoramaDTO,
    DesempenhoPanoramaDTO
}; 