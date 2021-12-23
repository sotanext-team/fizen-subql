import {
  // forceToCurrencyIdName,
  MaybeCurrency } from "@acala-network/sdk-core";
import { SystemConsts, Token } from "../types/models";

let tokenDecimalMap: Map<string, number>;

function getDecimal(token: string) {
  return tokenDecimalMap.get(token) || 10;
}
export function forceToCurrencyIdName(token) {
  if (typeof token === "string") {
    return token
  } else {
    logger.info(token)
  }
}
// get token 
export async function getToken(currency: MaybeCurrency) {
  const tokenName = forceToCurrencyIdName(currency);
  logger.info("Token name: "+tokenName)
  let token = await Token.get(tokenName);

  if (!token) {
    // create token if the token doesn't exits
    token = new Token(tokenName);

    // build the token decimal map
    if (!tokenDecimalMap) {
      const tokens = api.registry.chainTokens;
      const decimals = api.registry.chainDecimals;

      tokenDecimalMap = new Map<string, number>(
        tokens.map((item, index) => [item, decimals[index]])
      );
    }

    let decimal = 10;
    decimal = getDecimal(tokenName);
    token.id = tokenName;
    token.decimal = decimal;
    token.name = tokenName;
    logger.info(tokenName + "-" + token.id)

    token.price = '0'

    token.issuance = '0'
    token.lockedInLoan = '0'
    token.volume = '0'
    token.volumeUSD = '0'
    token.txCount = 0;
    await token.save();
  }

  return token;
}

export async function initSystemTokens() {
  const tokens = api.registry.chainTokens;

  // ensure that all basic tokens are created
  await Promise.all(tokens.map((symbol) => getToken(symbol)));
}

export async function getNativeToken() {
  const systemConsts = await SystemConsts.get("SYSTEM");

  const token = await Token.get(systemConsts.nativeTokenId);

  return token;
}

export async function getStableToken() {
  const systemConsts = await SystemConsts.get("SYSTEM");

  const token = await Token.get(systemConsts.stableTokenId);

  return token;
}
