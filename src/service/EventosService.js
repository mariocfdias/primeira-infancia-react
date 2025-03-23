const EventosRepository = require('../repository/EventosRepository');
const { EventosDTO } = require('../dto/EventosDTO');

class EventosService {
    constructor(connection) {
        this.eventosRepository = new EventosRepository(connection);
    }

    async findAll(options = {}) {
        const result = await this.eventosRepository.findAll(options);
        const eventos = result.data.map(evento => EventosDTO.fromEntity(evento));
        return {
            data: eventos,
            pagination: result.pagination
        };
    }

    async findById(id) {
        const evento = await this.eventosRepository.findById(id);
        if (!evento) {
            throw new Error(`Evento with id ${id} not found`);
        }
        return EventosDTO.fromEntity(evento);
    }

    async findByCodIbge(codIbge, options = {}) {
        const result = await this.eventosRepository.findByCodIbge(codIbge, options);
        const eventos = result.data.map(evento => EventosDTO.fromEntity(evento));
        return {
            data: eventos,
            pagination: result.pagination
        };
    }

    async createEvento(eventoDTO) {
        const entity = eventoDTO.toEntity();
        const savedEvento = await this.eventosRepository.create(entity);
        return EventosDTO.fromEntity(savedEvento);
    }

    async updateEvento(id, eventoDTO) {
        const evento = await this.eventosRepository.findById(id);
        if (!evento) {
            throw new Error(`Evento with id ${id} not found`);
        }
        
        const entity = eventoDTO.toEntity();
        const updatedEvento = await this.eventosRepository.update(id, entity);
        return EventosDTO.fromEntity(updatedEvento);
    }

    async deleteEvento(id) {
        const evento = await this.eventosRepository.findById(id);
        if (!evento) {
            throw new Error(`Evento with id ${id} not found`);
        }
        
        await this.eventosRepository.delete(id);
        return { success: true, message: `Evento with id ${id} deleted successfully` };
    }
}

module.exports = EventosService; 