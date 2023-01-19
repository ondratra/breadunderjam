import Fastify from 'fastify'

export async function createServer() {
    const fastify = Fastify({
        logger: true
    })

    fastify.get('/', (request, reply) => {
        console.log('server replying')

        reply.send({ hello: 'world' })
    })

    const serverConfig = {
        port: 3000,
        host: process.env.SERVER_HOST || '127.0.0.1',
    }

    fastify.listen(serverConfig, (err, address) => {
        if (err) {
            throw err
        }

        console.log('server starting')

        // Server is now listening on ${address}
    })
}

