class MissionPanoramaDTO {
    constructor() {
        this.missao = null;
        this.countValid = 0;
        this.countPending = 0;
        this.countStarted = 0;
        this.totalMunicipios = 0;
    }

    static builder() {
        return new MissionPanoramaBuilder();
    }
}

class MissionPanoramaBuilder {
    constructor() {
        this.dto = new MissionPanoramaDTO();
    }

    withMissao(missao) {
        this.dto.missao = missao;
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

    withTotalMunicipios(count) {
        this.dto.totalMunicipios = count;
        return this;
    }

    build() {
        return this.dto;
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