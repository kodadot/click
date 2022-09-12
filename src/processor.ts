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

processor.addEvmLogHandler(Contracts.ExiledRacersPilots, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.ExilredRacersRacecrafts, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.GlmrApes, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.Moonpets, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.GlmrJungle, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.GlmrPunks, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.MoonbeamPunks, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.MoonbeamLegendaryPunks, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.ClipperSurvivorPatch, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.GlmrApesBoost, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.HamstersGang, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.Moonfit, transferFilter, mappings.mainFrame);

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
