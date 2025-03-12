class MunicipioRepository {
    constructor(connection) {
        this.repository = connection.getRepository("Municipio");
    }

    async findAll() {
        return await this.repository.find({
            select: ["codIbge", "nome", "status", "badges", "points", "imagemAvatar"]
        });
    }

    async findParticipantes() {
        return await this.repository.find({
            where: { status: "Participante" },
            select: ["codIbge", "nome", "status", "badges", "points", "imagemAvatar"]
        });
    }

    async findByIdWithJson(codIbge) {
        return await this.repository.findOne({
            where: { codIbge },
            select: ["codIbge", "json", "nome"]
        });
    }

    async save(municipio) {
        return await this.repository.save(municipio);
    }
}

module.exports = MunicipioRepository;
