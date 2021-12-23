import { SubstrateEvent } from "@subql/types";
import { Dispatcher } from "../utils";
import { ensureBlock } from "./block";
import { Event } from "../types";
import { getKVData } from "../utils";
import { ensuerExtrinsic } from "./extrinsic";
import { DispatchedEventData } from "./types";

import {
    handleGlobalInterestRatePerSecUpdated,
    handleInterestRatePerSecUpdated,
    handleLiquidationPenaltyUpdated,
    handleLiquidationRatioUpdated,
    handleMaximumTotalDebitValueUpdated,
    handleRequiredCollateralRatioUpdated,
    updateLoanPosition,
    updateLoanPositionByLiquidate,
    // handleCloseLoanHasDebitByDex,
} from "./loan/position";
import {
    createPositionUpdatedHistory
} from "./history";
const dispatch = new Dispatcher<DispatchedEventData>();

dispatch.batchRegist([
    // loan
    { key: "loans-PositionUpdated", handler: createPositionUpdatedHistory },
    { key: "loans-PositionUpdated", handler: updateLoanPosition },
    // { key: "loans-ConfiscateCollateralAndDebit", handler: createConfiscateCollateralAndDebitHistory },
    // { key: "loans-transferLoan", handler: createTransferLoanHistory },

    // // all cdp params config update
    { key: "cdpEngine-InterestRatePerSecUpdated", handler: handleInterestRatePerSecUpdated, },
    { key: "cdpEngine-LiquidationRatioUpdated", handler: handleLiquidationRatioUpdated, },
    { key: "cdpEngine-LiquidationPenaltyUpdated", handler: handleLiquidationPenaltyUpdated, },
    { key: "cdpEngine-RequiredCollateralRatioUpdated", handler: handleRequiredCollateralRatioUpdated, },
    { key: "cdpEngine-MaximumTotalDebitValueUpdated", handler: handleMaximumTotalDebitValueUpdated, },
    { key: "cdpEngine-GlobalInterestRatePerSecUpdated", handler: handleGlobalInterestRatePerSecUpdated, },
    // { key: "cdpEngine-LiquidateUnsafeCDP", handler: createLiquidateUnsafeCDPHistory },
    { key: "cdpEngine-LiquidateUnsafeCDP", handler: updateLoanPositionByLiquidate },
    // { key: "honzon-CloseLoanHasDebitByDex", handler: handleCloseLoanHasDebitByDex},
]);
export async function ensureEvent(event: SubstrateEvent) {
    const block = await ensureBlock(event.block);
    const idx = event.idx;
    const recordId = `${block.number}-${idx}`;

    let data = await Event.get(recordId);

    if (!data) {
        data = new Event(recordId);
        data.index = idx;
        data.blockId = block.id;
        data.blockNumber = block.number;
        data.timestamp = block.timestamp;

        await data.save();
    }

    return data;
}

export async function createEvent(event: SubstrateEvent) {
    const extrinsic = await (event.extrinsic
        ? ensuerExtrinsic(event.extrinsic)
        : undefined);
    const data = await ensureEvent(event);
    const section = event.event.section;
    const method = event.event.method;
    const eventData = getKVData(event.event.data);
    data.section = section;
    data.method = method;
    data.data = eventData;
    if (extrinsic) {
        data.extrinsicId = extrinsic.id;
    }
    await dispatch.dispatch(`${section}-${data.method}`, {
        event: data,
        rawEvent: event,
    });
    await data.save();
    return data;
}
