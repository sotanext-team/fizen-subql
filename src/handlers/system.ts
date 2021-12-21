// tracker all the system config like liquid token, staking token
import { get } from 'lodash'

import { CurrencyId } from "@acala-network/types/interfaces"
import{ getToken } from './tokens'
import { SystemConsts } from '../types'

function getConsts<T> (path: string) {
    return get(api.consts, path) as T
}

export async function initSystemConsts () {
    const consts = await SystemConsts.get("SYSTEM")

    if (consts) return Promise.resolve(consts)

    const nativeToken = getConsts<CurrencyId>('transactionPayment.nativeCurrencyId');
    const stableToken =  getConsts<CurrencyId>('cdpEngine.getStableCurrencyId');

    const nativeTokenId = nativeToken?.asToken.toString()
    const stableTokenId = stableToken?.asToken.toString()

    await getToken(stableTokenId)
    await getToken(nativeTokenId)
    const temp = new SystemConsts('SYSTEM')

    temp.nativeTokenId = nativeTokenId
    temp.stableTokenId = stableTokenId

    await temp.save()

    return temp
}
