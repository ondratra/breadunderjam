import {assert} from 'chai'
import {calculateListedAssets, calculateListedAssetsFromUtxos} from '../src/server/app/utils'
import {transactionsTestData, utxosTestData} from './testData'

describe('Array', function () {
    it('calculateListedAssets() minimum works', () => {
        const marketplaceAddress = 'addr1zxgx3far7qygq0k6epa0zcvcvrevmn0ypsnfsue94nsn3tvpw288a4x0xf8pxgcntelxmyclq83s0ykeehchz2wtspks905plm'

        const result = calculateListedAssets(transactionsTestData, marketplaceAddress)

        assert.equal(result.length, 3)
    })

    it('calculateListedAssetsFromUtxos() minimum works', () => {
        const marketplaceAddress = 'addr1zxgx3far7qygq0k6epa0zcvcvrevmn0ypsnfsue94nsn3tvpw288a4x0xf8pxgcntelxmyclq83s0ykeehchz2wtspks905plm'

        const result = calculateListedAssetsFromUtxos(utxosTestData, marketplaceAddress)

        assert.equal(result.length, 3)
    })
})
