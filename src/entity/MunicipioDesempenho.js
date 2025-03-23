const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "MunicipioDesempenho",
    tableName: "municipio_desempenho",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        codIbge: {
            type: "varchar"
        },
        missaoId: {
            type: "varchar"
        },
        validation_status: {
            type: "varchar",
            default: "PENDING"
        },
        updated_at: {
            type: "datetime",
            default: () => "CURRENT_TIMESTAMP"
        },
        evidence: {
            type: "simple-json",
            default: "[]"
        }
    },
    relations: {
        municipio: {
            target: "Municipio",
            type: "many-to-one",
            joinColumn: {
                name: "codIbge",
                referencedColumnName: "codIbge"
            }
        },
        missao: {
            target: "Missoes",
            type: "many-to-one",
            joinColumn: {
                name: "missaoId",
                referencedColumnName: "id"
            }
        }
    },
    checks: [
        {
            expression: "validation_status IN ('VALID', 'PENDING', 'STARTED')"
        }
    ]
}); 