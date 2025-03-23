class EventosDTO {
    constructor() {
        this.id = null;
        this.data_alteracao = new Date();
        this.event = '';
        this.description = '';
        this.cod_ibge = null;
        this.municipio = null;
    }

    static builder() {
        return new EventosBuilder();
    }

    static fromEntity(entity) {
        const builder = EventosDTO.builder()
            .withId(entity.id)
            .withDataAlteracao(entity.data_alteracao)
            .withEvent(entity.event)
            .withDescription(entity.description)
            .withCodIbge(entity.cod_ibge || (entity.municipio ? entity.municipio.codIbge : null));
            
        if (entity.municipio) {
            builder.withMunicipio({
                codIbge: entity.municipio.codIbge,
                nome: entity.municipio.nome,
                status: entity.municipio.status,
                badges: entity.municipio.badges,
                points: entity.municipio.points,
                imagemAvatar: entity.municipio.imagemAvatar
            });
        }
            
        return builder.build();
    }

    toEntity() {
        return {
            id: this.id,
            data_alteracao: this.data_alteracao,
            event: this.event,
            description: this.description,
            cod_ibge: this.cod_ibge
        };
    }
}

class EventosBuilder {
    constructor() {
        this.dto = new EventosDTO();
    }

    withId(id) {
        this.dto.id = id;
        return this;
    }

    withDataAlteracao(data) {
        this.dto.data_alteracao = data;
        return this;
    }

    withEvent(event) {
        this.dto.event = event;
        return this;
    }

    withDescription(description) {
        this.dto.description = description;
        return this;
    }

    withCodIbge(codIbge) {
        this.dto.cod_ibge = codIbge;
        return this;
    }

    withMunicipio(municipio) {
        this.dto.municipio = municipio;
        return this;
    }

    build() {
        return this.dto;
    }
}

module.exports = { EventosDTO, EventosBuilder }; 