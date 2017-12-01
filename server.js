const Hapi = require('hapi')

const server = new Hapi.Server({  
  host: 'localhost',
  port: 3000 || process.env.PORT 
})

server.route(require('./routes'))

server.start();
    console.log(`Server started at ${server.info.uri}`);