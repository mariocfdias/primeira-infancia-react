const express = require('express');
const cron = require('node-cron');
const { connectDB } = require('./db');
const { setupRoutes } = require('./routes');
const fetchMunicipios = require('./jobs/fetchMunicipios');
const updateJsonMunicipio = require('./jobs/updateJsonMunicipio');
const autofetch = require('./jobs/autofetch');
const seedMunicipios = require('./service/MunicipioSeed');

const app = express();
const PORT = process.env.PORT || 3000;
const FETCH_MUNICIPIOS_URL = process.env.FETCH_MUNICIPIOS_URL || 'https://script.google.com/macros/s/AKfycbw6hpFD1hZHLTRvNE3G97NzCFJmh8_nProKqrd1N1Ei5oHDQwY2GOVoCxYptnrev0le/exec?request=municipios';
const UPDATE_JSON_URL = process.env.UPDATE_JSON_URL || 'https://script.google.com/macros/s/AKfycbw6hpFD1hZHLTRvNE3G97NzCFJmh8_nProKqrd1N1Ei5oHDQwY2GOVoCxYptnrev0le/exec';

app.use(express.json());

async function startServer() {
    try {
        const connection = await connectDB();
        app.use(require('cors')());

        await seedMunicipios(connection);
        // Setup routes
        app.use('/api', setupRoutes(connection));
        
        // Schedule jobs
        // Run fetchMunicipios job every day at midnight
        cron.schedule('*/5  * * * *', () => {
            fetchMunicipios(connection, FETCH_MUNICIPIOS_URL);
        });

        cron.schedule('*/5  * * * *', () => {
            autofetch("https://primeira-infancia-backend.onrender.com/api/municipios");
        });
        
        // Run updateJsonMunicipio job every day at 2 AM
        cron.schedule('*/5  * * * *', () => {
            updateJsonMunicipio(connection, UPDATE_JSON_URL);
        });
        
        // Run the jobs immediately on startup
        fetchMunicipios(connection, FETCH_MUNICIPIOS_URL);
        updateJsonMunicipio(connection, UPDATE_JSON_URL);
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();