const typeorm = require('typeorm');

async function connectDB() {
    try {
        const connection = await typeorm.createConnection({
            type: "sqlite",
            database: "municipios.sqlite",
            entities: [__dirname + '/entity/*.js'],
            synchronize: true,
            logging: false
        });
        console.log('Connected to database');
        return connection;
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
    }
}

module.exports = { connectDB };