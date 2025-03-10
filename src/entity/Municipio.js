const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Municipio",
    tableName: "municipio",
    columns: {
        codIbge: {
            primary: true,
            type: "int"
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
            type: "text",
            nullable: true
        }
    }
});