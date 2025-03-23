class MunicipioDesempenhoRepository {
    constructor(connection) {
        this.repository = connection.getRepository("MunicipioDesempenho");
    }

    async findAll() {
        return await this.repository.find({
            relations: ["municipio", "missao"]
        });
    }

    async findById(id) {
        return await this.repository.findOne({
            where: { id },
            relations: ["municipio", "missao"]
        });
    }

    async findByIbgeCode(codIbge) {
        return await this.repository.find({
            where: { codIbge },
            relations: ["municipio", "missao"]
        });
    }

    async findByMissaoId(missaoId) {
        return await this.repository.find({
            where: { missaoId },
            relations: ["municipio", "missao"]
        });
    }

    async create(desempenho) {
        return await this.repository.save(desempenho);
    }

    async update(id, desempenho) {
        await this.repository.update(id, desempenho);
        return await this.findById(id);
    }

    async delete(id) {
        return await this.repository.delete(id);
    }
}

module.exports = MunicipioDesempenhoRepository; 