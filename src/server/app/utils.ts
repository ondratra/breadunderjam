import {request, Variables} from 'graphql-request'

export type MarketplaceAddress = string
export type PolicyId = string

export const sendGraphqQlQuery = (graphqlServerUrl: string) => async (query: string) => {
    const result = await request(graphqlServerUrl, query)

    // manipulate result here if needed

    return result
}

// TODO: generate schema for `transactions` from GraphQL query
// TODO: take unlisting into account - current implementation returns all NFTs that were ever listed
// NOTE: processes output from `getMarketplacePolicyTransactions`
export function calculateListedAssets(queryResult: any, contractAddress: MarketplaceAddress) {
    const tmp = 'addr1zxgx3far7qygq0k6epa0zcvcvrevmn0ypsnfsue94nsn3tvpw288a4x0xf8pxgcntelxmyclq83s0ykeehchz2wtspks905plm'

    return queryResult.transactions
        .map((transaction: any) => transaction.outputs)
        .reduce((acc: any[], tokenArray: any[]) => [...acc, ...tokenArray], []) // flatten outputs
        .filter((output: any) => output.address == tmp) // keep only relevant output
        .map((output: any) => output.tokens[0].asset.assetId)
}

// TODO: generate schema for `transactions` from GraphQL query
// TODO: take unlisting into account - current implementation returns all NFTs that were ever listed
// NOTE: processes output from `getMarketplacePolicyUtxos`
export function calculateListedAssetsFromUtxos(queryResult: any, contractAddress: MarketplaceAddress) {
    const tmp = 'addr1zxgx3far7qygq0k6epa0zcvcvrevmn0ypsnfsue94nsn3tvpw288a4x0xf8pxgcntelxmyclq83s0ykeehchz2wtspks905plm'

    return queryResult.utxos
        //.map((transaction: any) => transaction.outputs)
        //.reduce((acc: any[], tokenArray: any[]) => [...acc, ...tokenArray], []) // flatten outputs
        //.filter((output: any) => output.address == tmp) // keep only relevant output
        //.map((output: any) => output.tokens[0].asset.assetId)
        .map((utxo: any) => utxo.tokens[0].asset.assetId)
}
