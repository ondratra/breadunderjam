import {MarketplaceAddress, PolicyId} from './utils'

export const getSyncNodeStatus = () => `
    query {
        cardanoDbMeta { initialized syncPercentage }
    }
`

// NOTE: this query unfortunately timeouts for most of the time when `limit: xxx` with sufficiently small number is not set
//       use `getMarketplacePolicyUtxos` instead
export const getMarketplacePolicyTransactions = (marketplaceAddress: MarketplaceAddress, policyId: PolicyId) => `
    query {
        transactions(
            where: {
                outputs: {
                    address: { _eq: "${marketplaceAddress}"}
                    tokens: {
                        asset: {
                            policyId: {_eq: "${policyId}"}
                        }
                    }
                }
            }
        ) {
            block {
                number
            }
            inputs {
                address
                value

            }
            outputs {
                tokens {
                    asset {
                        assetId
                    }
                }
                value
            }
        }
    }
`

export const getMarketplacePolicyUtxos = (marketplaceAddress: MarketplaceAddress, policyId: PolicyId) => `
    query {
        utxos(
            where: {
                address: { _eq: "${marketplaceAddress}"}
                tokens: {
                    asset: {
                        policyId: {_eq: "${policyId}"}
                    }
                }
            }
        ) {
            transaction {
                block {
                  number
                }
            }
            tokens{asset{assetId}}
        }
    }
`

/* Other semi-relevant queries:
- get asset
assets(where: {
    assetId: {_eq: "684ffa75d83ccd4dfe179bd37fe679e74d33cce181a6f473337df09868756e6b33343232"},
    policyId: {_eq: "684ffa75d83ccd4dfe179bd37fe679e74d33cce181a6f473337df098"}
}) {assetId, policyId, assetName}

- get total count of assets belonging to policy
assets_aggregate(where: {
    policyId: {_eq: "684ffa75d83ccd4dfe179bd37fe679e74d33cce181a6f473337df098"}
}) {aggregate {count}}
*/
