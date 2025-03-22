class EventosRepository {
    constructor(connection) {
        this.repository = connection.getRepository("Eventos");
    }

    async findAll() {
        return await this.repository.find();
    }

    async findById(id) {
        return await this.repository.findOne({
            where: { id }
        });
    }

    async findByCodIbge(codIbge) {
        return await this.repository.find({
            where: { cod_ibge: codIbge }
        });
    }

    async create(evento) {
        return await this.repository.save(evento);
    }

    async update(id, evento) {
        await this.repository.update(id, evento);
        return await this.findById(id);
    }

    async delete(id) {
        return await this.repository.delete(id);
    }
}

module.exports = EventosRepository; 