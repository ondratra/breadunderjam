import {FastifyInstance} from 'fastify'
import {
    calculateListedAssets,
    calculateListedAssetsFromUtxos,
    MarketplaceAddress,
    PolicyId,
    sendGraphqQlQuery,
} from './app/utils'
import {getSyncNodeStatus, getMarketplacePolicyTransactions, getMarketplacePolicyUtxos} from './app/gqlQueries'
import {marketplaces} from '../config'

const queryFunc = getMarketplacePolicyUtxos
const queryProcessFunc = calculateListedAssetsFromUtxos

// not working properly - due to large amount of transactions, GraphQL server will timeout in 60 seconds
// const queryFunc = getMarketplacePolicyTransactions
// const queryProcessFunc = calculateListedAssets

export function setupRoutes(fastify: FastifyInstance, graphqlServerUrl: string) {
    const graphqQlQueryRequest = sendGraphqQlQuery(graphqlServerUrl)

    fastify.get('/', (request, reply) => {
        // Policy example - Clay Nation
        const examplePolicyId = "40fa2aa67258b4ce7b5782f74831d46a84c59a0ff0c28262fab21728"

        reply
            .type('text/html')
            .send(`
                <h1>Hello :-)</h1>
                <h2>Routes:</h2>
                <a href="./nodeStatus">./nodeStatus</a> <br />
                <a href="./policyListingsSum/${examplePolicyId}">./policyListingsSum/\${policyId}</a> (will take ~15-20 seconds)<br />
                <br />

                <h2>Debug:</h2>
                - PolicyListingsSum with list of assets <br />
                <a href="./policyListingsSum/${examplePolicyId}?extendedInfo=1">
                    ./policyListingsSum/\${policyId}?extendedInfo=1
                </a> (will take ~15-20 seconds)<br />
                <br />
                - Transactions outputing selected policy into selected marketplace (will take ~15-20 seconds)<br />
                <a href="./transactionsOutputtingPolicy/${marketplaces[0].address}/${examplePolicyId}">
                    ./transactionsOutputtingPolicy/\${marketplaceAddress}/\${policyId}
                </a>
            `)
    })

    fastify.get('/nodeStatus', async (request, reply) => {
        const queryResult = await graphqQlQueryRequest(getSyncNodeStatus())

        reply.send(queryResult)
    })

    fastify.get('/policyListingsSum/:policyId', async (request, reply) => {
        const extendedInfo = !!(request.query as {extendedInfo?: string}).extendedInfo
        const {policyId} = request.params as {policyId: string}
        request.query

        const promises = marketplaces.map(async ({name, address: marketplaceAddress}) => {
            const gqlQueryResult = await graphqQlQueryRequest(queryFunc(
                marketplaceAddress,
                policyId,
            ))
            return {
                name,
                assets: queryProcessFunc(gqlQueryResult, marketplaceAddress)
            }
        })

        const queryResults = await Promise.all(promises)

        const result = queryResults
            .map(item => ({
                name: item.name,
                count: item.assets.length,
                ...(extendedInfo ? {assets: item.assets} : {}),
            }))

        reply.send(result)
    })

    fastify.get('/transactionsOutputtingPolicy/:marketplaceAddress/:policyId', async (request, reply) => {
        const {policyId, marketplaceAddress} = request.params as {policyId: PolicyId, marketplaceAddress: MarketplaceAddress}

        const queryResult = await graphqQlQueryRequest(queryFunc(
            marketplaceAddress,
            policyId,
        ))

        reply.send(queryResult)
    })
}
