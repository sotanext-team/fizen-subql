// tracker all the system config like liquid token, staking token
import { get } from 'lodash'

import{ getToken } from './tokens'
import { SystemConsts } from '../types'

function getConsts<T> (path: string) {
    return get(api.consts, path) as T
}

export async function initSystemConsts () {
    logger.info('initSystemConsts')
    try {
        const nativeTokenId = 'UNIT'
        const stableTokenId = 'ZUSD'
        
        await getToken(stableTokenId)
        await getToken(nativeTokenId)
        const temp = new SystemConsts('SYSTEM')

        temp.id = 'SYSTEM'
        temp.nativeTokenId = nativeTokenId
        temp.stableTokenId = stableTokenId

        await temp.save()

        return temp
    } catch (e) {
        console.log(e.message)
    }
}
