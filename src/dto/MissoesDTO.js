class MissoesDTO {
    constructor() {
        this.id = '';
        this.categoria = '';
        this.descricao_da_categoria = '';
        this.emblema_da_categoria = '';
        this.descricao_da_missao = '';
        this.qnt_pontos = 0;
        this.link_formulario = null;
        this.evidencias = [];
    }

    static builder() {
        return new MissoesBuilder();
    }

    static fromEntity(entity) {
        return MissoesDTO.builder()
            .withId(entity.id)
            .withCategoria(entity.categoria)
            .withDescricaoCategoria(entity.descricao_da_categoria)
            .withEmblemaCategoria(entity.emblema_da_categoria)
            .withDescricaoMissao(entity.descricao_da_missao)
            .withQuantidadePontos(entity.qnt_pontos)
            .withLinkFormulario(entity.link_formulario)
            .withEvidencias(entity.evidencias ? JSON.parse(entity.evidencias) : [])
            .build();
    }

    toEntity() {
        return {
            id: this.id,
            categoria: this.categoria,
            descricao_da_categoria: this.descricao_da_categoria,
            emblema_da_categoria: this.emblema_da_categoria,
            descricao_da_missao: this.descricao_da_missao,
            qnt_pontos: this.qnt_pontos,
            link_formulario: this.link_formulario,
            evidencias: JSON.stringify(this.evidencias)
        };
    }
}

class MissoesBuilder {
    constructor() {
        this.dto = new MissoesDTO();
    }

    withId(id) {
        this.dto.id = id;
        return this;
    }

    withCategoria(categoria) {
        this.dto.categoria = categoria;
        return this;
    }

    withDescricaoCategoria(descricao) {
        this.dto.descricao_da_categoria = descricao;
        return this;
    }

    withEmblemaCategoria(emblema) {
        this.dto.emblema_da_categoria = emblema;
        return this;
    }

    withDescricaoMissao(descricao) {
        this.dto.descricao_da_missao = descricao;
        return this;
    }

    withQuantidadePontos(pontos) {
        this.dto.qnt_pontos = pontos;
        return this;
    }

    withLinkFormulario(link) {
        this.dto.link_formulario = link;
        return this;
    }

    withEvidencias(evidencias) {
        this.dto.evidencias = evidencias;
        return this;
    }

    build() {
        return this.dto;
    }
}

module.exports = { MissoesDTO, MissoesBuilder }; 