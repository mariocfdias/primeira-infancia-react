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
        json: {
            type: "text",
            nullable: true
        }
    }
});