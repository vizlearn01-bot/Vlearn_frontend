const axios = require('axios');
const apiClient = axios.create({ headers: { 'Content-Type': 'application/json' } });
console.log(apiClient.defaults.headers);
