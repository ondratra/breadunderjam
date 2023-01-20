import Fastify from 'fastify'
import {setupRoutes} from './routes'

export async function createServer() {
    // configuration
    const serverConfig = {
        port: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3000,
        host: process.env.SERVER_HOST || '127.0.0.1',
    }
    const graphqlServerUrl = 'https://graphql-api.mainnet.dandelion.link/'

    // server setup
    const fastify = Fastify({
        logger: true,
        maxParamLength: 1000, // needed for long URLs to work
    })

    setupRoutes(fastify, graphqlServerUrl)

    // start server
    fastify.listen(serverConfig, (err, address) => {
        if (err) {
            throw err
        }
    })
}
