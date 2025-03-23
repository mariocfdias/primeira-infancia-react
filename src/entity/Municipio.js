const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Municipio",
    tableName: "municipio",
    columns: {
        codIbge: {
            primary: true,
            type: "varchar"
        },
        nome: {
            type: "varchar"
        },
        status: {
            type: "varchar"
        },
        dataAlteracao: {
            type: "datetime",
            nullable: true
        },
        imagemAvatar: {
            type: "varchar",
            nullable: true
        },
        badges: {
            type: "int",
            default: 0
        },
        points: {
            type: "int",
            default: 0
        },
        json: {
            type: "simple-json",
            nullable: true
        },
        orgao: {
            type: "boolean",
            nullable: true
        }
    }
});