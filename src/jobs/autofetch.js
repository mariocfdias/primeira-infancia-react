const fetch = require('node-fetch');
const MunicipioService = require('../service/MunicipioService');

async function autofetch(url) {
    console.log('Starting job: autofetch');
    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log({autofetch: data})
        console.log({url})
    } catch (error) {
        console.error('Error in fetchMunicipios job:', error.message);
    }
    
    console.log('Finished job: fetchMunicipios');
}

module.exports = autofetch;
