import { lookupArchive } from "@subsquid/archive-registry"
import {
  SubstrateProcessor
} from "@subsquid/substrate-processor"
import { FullTypeormDatabase as Database } from '@subsquid/typeorm-store'
import { CHAIN_NODE } from "./contract"
import * as mappings from './mappings'
import { multiTransferFilter, singleTransferFilter, transferFilter } from './mappings/utils/evm'
import { Contracts } from './processable'

const database = new Database();
const processor = new SubstrateProcessor(database)

processor.setBatchSize(50);

processor.setDataSource({
  chain: CHAIN_NODE,
  archive: lookupArchive("moonriver", { release: "FireSquid" }),
});

processor.setTypesBundle("moonbeam");

processor.addPreHook({ range: { from: 0, to: 0 } }, mappings.forceCreateContract);

processor.addEvmLogHandler(Contracts.DPS, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.Beanies, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.BUDS, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.NCR1, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.NCR2, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.MoonRiverQuest, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.BadDads, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.BAYMAP, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.BYPC, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.BlvckMarketCyan, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.BlvckSnakesForrest, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.CryptoButchers, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.MBAYC, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.MoonShroomiz, transferFilter, mappings.mainFrame);

// processor.addEvmLogHandler(
//   Contracts.Moonx,
//   {...multiTransferFilter, range: { from: 1303535, to: 1303535 }},
//   contractLogsHandler
// );

// export async function contractLogsHandler(
//   ctx: Context
// ): Promise<void> {
//   // const data = { block: ctx.block, event: ctx.event, hash: ctx.event.evmTxHash }
//   // const transfer = decode1155MultiTransfer(ctx)
//   const data = unwrap(ctx, getMultiTransferTokenEvent)
//   logger.debug(`Transfer: ${JSON.stringify(data, serializer, 2)}`)
// }

processor.run();
