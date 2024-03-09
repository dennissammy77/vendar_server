const http = require('http');
const app = require('./app.js');
const logger = require('./lib/logger.lib.js');
require('dotenv').config();

const server = http.createServer(app);

const port = process.env.port || 5001;

server.listen(port, (req,res)=>{
	logger.log('info',`server listening on http://localhost:${port}`);
	//console.log(`server listening on http://localhost:${port}`);
})