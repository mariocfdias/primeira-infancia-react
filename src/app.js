const express = require('express');
const { connectDB } = require('./db');
const { setupRoutes } = require('./routes');
const { setupSwagger } = require('./swagger');
const { setupJobs } = require('./jobs');
const seedMunicipios = require('./service/MunicipioSeed');

const app = express();
const PORT = process.env.PORT || 3000;

// Job configuration
const jobConfig = {
    FETCH_MUNICIPIOS_URL: process.env.FETCH_MUNICIPIOS_URL || 'https://script.google.com/macros/s/AKfycbxAzecewMjM7-oGGwy1zOImLpQX4TeyJXuKl2jbA6GGDXnLW2RebCAybku2uiMI3hmC/exec',
    UPDATE_JSON_URL: process.env.UPDATE_JSON_URL || 'https://script.google.com/macros/s/AKfycbxAzecewMjM7-oGGwy1zOImLpQX4TeyJXuKl2jbA6GGDXnLW2RebCAybku2uiMI3hmC/exec',
    FETCH_EVENTOS_URL: process.env.FETCH_EVENTOS_URL || 'https://script.google.com/macros/s/AKfycbxAzecewMjM7-oGGwy1zOImLpQX4TeyJXuKl2jbA6GGDXnLW2RebCAybku2uiMI3hmC/exec',
    AUTOFETCH_URL: process.env.AUTOFETCH_URL || 'https://primeira-infancia-backend.onrender.com/api/municipios',
    FETCH_MISSOES_URL: process.env.FETCH_MISSOES_URL || 'https://script.google.com/macros/s/AKfycbwC6X0BrzwzByMYVVOXdi-sGkytrYm7-6F1VBhvNoMJJWZsHyW_V0X1syzSUkyuheM/exec',
    FETCH_MISSAO_DESEMPENHO_URL: process.env.FETCH_MISSAO_DESEMPENHO_URL || 'https://script.google.com/macros/s/AKfycbxcTV4SrjXBnYOaTr47bFmYTbHyePKB-BdR6fddMXdZVMnsM9Qy_E8knZEIsMgjdZHJ/exec'
};

app.use(express.json());

async function startServer() {
    try {
        const connection = await connectDB();
        app.use(require('cors')());

        await seedMunicipios(connection);
        
        // Setup Swagger documentation
        setupSwagger(app);
        
        // Setup routes
        app.use('/api', setupRoutes(connection));
        
        // Setup scheduled jobs
        setupJobs(connection, jobConfig);
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();