class MunicipioDTO {
    constructor() {
        this.codIbge = '';
        this.nome = '';
        this.status = '';
        this.dataAlteracao = null;
        this.imagemAvatar = null;
        this.badges = 0;
        this.points = 0;
        this.json = null;
        this.orgao = false;
    }

    static builder() {
        return new MunicipioBuilder();
    }

    static fromEntity(entity) {
        return MunicipioDTO.builder()
            .withCodIbge(entity.codIbge)
            .withNome(entity.nome)
            .withStatus(entity.status)
            .withDataAlteracao(entity.dataAlteracao)
            .withImagemAvatar(entity.imagemAvatar)
            .withBadges(entity.badges)
            .withPoints(entity.points)
            .withJson(entity.json)
            .withOrgao(entity.orgao)
            .build();
    }

    toEntity() {
        return {
            codIbge: this.codIbge,
            nome: this.nome,
            status: this.status,
            dataAlteracao: this.dataAlteracao,
            imagemAvatar: this.imagemAvatar,
            badges: this.badges,
            points: this.points,
            json: this.json,
            orgao: this.orgao
        };
    }
}

class MunicipioBuilder {
    constructor() {
        this.dto = new MunicipioDTO();
    }

    withCodIbge(codIbge) {
        this.dto.codIbge = codIbge;
        return this;
    }

    withNome(nome) {
        this.dto.nome = nome;
        return this;
    }

    withStatus(status) {
        this.dto.status = status;
        return this;
    }

    withDataAlteracao(dataAlteracao) {
        this.dto.dataAlteracao = dataAlteracao;
        return this;
    }

    withImagemAvatar(imagemAvatar) {
        this.dto.imagemAvatar = imagemAvatar;
        return this;
    }

    withBadges(badges) {
        this.dto.badges = badges;
        return this;
    }

    withPoints(points) {
        this.dto.points = points;
        return this;
    }

    withJson(json) {
        this.dto.json = json;
        return this;
    }

    withOrgao(orgao) {
        this.dto.orgao = orgao;
        return this;
    }

    build() {
        return this.dto;
    }
}

module.exports = { MunicipioDTO, MunicipioBuilder }; 