class MunicipioDesempenhoDTO {
    constructor() {
        this.id = null;
        this.codIbge = '';
        this.missaoId = '';
        this.validation_status = 'STARTED';
        this.updated_at = new Date();
        this.evidence = [];
        this.municipio = null;
        this.missao = null;
    }

    static builder() {
        return new MunicipioDesempenhoBuilder();
    }

    static fromEntity(entity) {
        const dto = MunicipioDesempenhoDTO.builder()
            .withId(entity.id)
            .withCodIbge(entity.codIbge)
            .withMissaoId(entity.missaoId)
            .withValidationStatus(entity.validation_status)
            .withUpdatedAt(entity.updated_at)
            .withEvidence(entity.evidence ? entity.evidence.length > 0 ? JSON.parse(entity.evidence) : [] : []);
            
        if (entity.municipio) {
            dto.withMunicipio({
                codIbge: entity.municipio.codIbge,
                nome: entity.municipio.nome,
                status: entity.municipio.status
            });
        }
        
        if (entity.missao) {
            dto.withMissao({
                id: entity.missao.id,
                categoria: entity.missao.categoria,
                descricao_da_missao: entity.missao.descricao_da_missao
            });
        }
        
        return dto.build();
    }

    toEntity() {
        return {
            id: this.id,
            codIbge: this.codIbge,
            missaoId: this.missaoId,
            validation_status: this.validation_status,
            updated_at: this.updated_at,
            evidence: JSON.stringify(this.evidence)
        };
    }
}

class MunicipioDesempenhoBuilder {
    constructor() {
        this.dto = new MunicipioDesempenhoDTO();
    }

    withId(id) {
        this.dto.id = id;
        return this;
    }

    withCodIbge(codIbge) {
        this.dto.codIbge = codIbge;
        return this;
    }

    withMissaoId(missaoId) {
        this.dto.missaoId = missaoId;
        return this;
    }

    withValidationStatus(status) {
        this.dto.validation_status = status;
        return this;
    }

    withUpdatedAt(date) {
        this.dto.updated_at = date;
        return this;
    }

    withEvidence(evidence) {
        this.dto.evidence = evidence;
        return this;
    }

    withMunicipio(municipio) {
        this.dto.municipio = municipio;
        return this;
    }

    withMissao(missao) {
        this.dto.missao = missao;
        return this;
    }

    build() {
        return this.dto;
    }
}

module.exports = { MunicipioDesempenhoDTO, MunicipioDesempenhoBuilder }; 