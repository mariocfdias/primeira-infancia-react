class EventosDTO {
    constructor() {
        this.id = null;
        this.data_alteracao = new Date();
        this.event = '';
        this.description = '';
        this.cod_ibge = null;
    }

    static builder() {
        return new EventosBuilder();
    }

    static fromEntity(entity) {
        return EventosDTO.builder()
            .withId(entity.id)
            .withDataAlteracao(entity.data_alteracao)
            .withEvent(entity.event)
            .withDescription(entity.description)
            .withCodIbge(entity.cod_ibge || (entity.municipio ? entity.municipio.codIbge : null))
            .build();
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

    build() {
        return this.dto;
    }
}

module.exports = { EventosDTO, EventosBuilder }; 