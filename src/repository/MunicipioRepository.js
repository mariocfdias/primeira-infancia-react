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
            select: ["codIbge", "nome", "status", "badges", "points", "imagemAvatar", "orgao"]
        });
    }

    async findByIdWithJson(codIbge) {
        return await this.repository.findOne({
            where: { codIbge },
            select: ["codIbge", "json", "nome"]
        });
    }

    async searchByName(search, limit = 10) {
        return await this.repository.createQueryBuilder("municipio")
            .where("municipio.nome LIKE :search", { search: `%${search}%` })
            .select(["municipio.codIbge", "municipio.nome", "municipio.status", "municipio.badges", "municipio.points", "municipio.imagemAvatar"])
            .take(limit)
            .getMany();
    }

    async save(municipio) {
        return await this.repository.save(municipio);
    }

    async getMaxDataAlteracao() {
        const result = await this.repository.createQueryBuilder("municipio")
            .select("MAX(municipio.dataAlteracao)", "maxDate")
            .getRawOne();
        console.log({result})
        return result?.maxDate ? new Date(result.maxDate) : new Date(0);
    }
}

module.exports = MunicipioRepository;
