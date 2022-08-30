import { lookupArchive } from "@subsquid/archive-registry"
import {
  EvmLogHandlerContext,
  SubstrateProcessor,
} from "@subsquid/substrate-processor";
import { FullTypeormDatabase as Database } from '@subsquid/typeorm-store'
import { CHAIN_NODE, getAddress } from "./contract"
import * as mappings from './mappings'
import { decode1155MultiTransfer, multiTransferFilter, singleTransferFilter, transferFilter } from './mappings/utils/evm'
import { Contracts } from './processable'
import * as erc721 from "./abi/erc721";
import { Context } from './mappings/utils/types'
import logger from './mappings/utils/logger'
import { serializer } from './mappings/utils/serializer'

const database = new Database();
const processor = new SubstrateProcessor(database)

processor.setBatchSize(500);

processor.setDataSource({
  chain: CHAIN_NODE,
  archive: lookupArchive("moonriver", { release: "FireSquid" }),
});

processor.setTypesBundle("moonbeam");

// processor.addPreHook({ range: { from: 0, to: 0 } }, async (ctx) => {
//   await ctx.store.save(createContractEntity());
// });

// processor.addPreHook({ range: { from: 0, to: 0 } }, mappings.forceCreateContract);

// processor.addEvmLogHandler(Contracts.Moonsama, transferFilter, mappings.mainFrame);
// processor.addEvmLogHandler(Contracts.Pondsama, transferFilter, mappings.mainFrame);
// processor.addEvmLogHandler(Contracts.Plot, transferFilter, mappings.mainFrame);
// // processor.addEvmLogHandler(Contracts.Blvck, transferFilter, mappings.mainFrame); // TODO: handle separately

// processor.addEvmLogHandler(Contracts.Moonx, singleTransferFilter, mappings.singleMainFrame);
// processor.addEvmLogHandler(Contracts.Factory, singleTransferFilter, mappings.singleMainFrame);
// processor.addEvmLogHandler(Contracts.Art, singleTransferFilter, mappings.singleMainFrame);
// processor.addEvmLogHandler(Contracts.Box, singleTransferFilter, mappings.singleMainFrame);
// processor.addEvmLogHandler(Contracts.Embassy, singleTransferFilter, mappings.singleMainFrame);

// processor.addEvmLogHandler(Contracts.Moonx, multiTransferFilter, mappings.mutliMainFrame);
// processor.addEvmLogHandler(Contracts.Factory, multiTransferFilter, mappings.mutliMainFrame);
// processor.addEvmLogHandler(Contracts.Art, multiTransferFilter, mappings.mutliMainFrame);
// processor.addEvmLogHandler(Contracts.Box, multiTransferFilter, mappings.mutliMainFrame);
// processor.addEvmLogHandler(Contracts.Embassy, multiTransferFilter, mappings.mutliMainFrame);

processor.addEvmLogHandler(
  Contracts.Moonx,
  {...multiTransferFilter, range: { from: 1303535, to: 1303535 }},
  contractLogsHandler
);

export async function contractLogsHandler(
  ctx: Context
): Promise<void> {
  // const data = { block: ctx.block, event: ctx.event, hash: ctx.event.evmTxHash }
  const transfer = decode1155MultiTransfer(ctx)
  logger.debug(`Transfer: ${JSON.stringify(transfer, serializer, 2)}`)
}

processor.run();
