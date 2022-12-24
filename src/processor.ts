import { lookupArchive } from "@subsquid/archive-registry"
import {
  SubstrateProcessor
} from "@subsquid/substrate-processor"
import { FullTypeormDatabase as Database } from '@subsquid/typeorm-store'
import { CHAIN_NODE } from "./contract"
import * as mappings from './mappings'
import { transferFilter } from './mappings/utils/evm'
import { Contracts } from './processable'

const database = new Database();
const processor = new SubstrateProcessor(database)

processor.setDataSource({
  chain: CHAIN_NODE,
  archive: lookupArchive("moonbeam", { release: "FireSquid" }),
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
processor.addEvmLogHandler(Contracts.CanaryNetworkAgency, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.MoonFitBeastandBeauty, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.BoredPuppetYachtClub, transferFilter, mappings.mainFrame);
// processor.addEvmLogHandler(Contracts.TheUltimateHarvestMoonCampaign, transferFilter, mappings.mainFrame);

// const filter = {...transferFilter, range: { from: 2572550, to: 2572559 }}
// processor.addEvmLogHandler(
//   Contracts.DPS,
//   filter,
//   contractLogsHandler
// );

// export async function contractLogsHandler(
//   ctx: Context
// ): Promise<void> {
//   const data = { block: ctx.block, event: ctx.event, hash: ctx.event.evmTxHash }
//   // const transfer = decode1155MultiTransfer(ctx)
//   try {
//     const transfer = decode721Transfer(ctx)
//     console.log(`Transfer: ${JSON.stringify(transfer, serializer, 2)}`)
//   } catch (e) {
//     console.warn(`Error decoding transfer: ${e}`)
//     const log = getEvmLog(ctx, ctx.event)
//     // const transfer2 = decode721Transfer(ctx, log)
//     console.log(`Error: ${JSON.stringify(log, serializer, 2)}`)
//     exit(1);
//   } 
  
// }

processor.run();
