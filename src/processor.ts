import { lookupArchive } from "@subsquid/archive-registry"
import {
  SubstrateEvmProcessor
} from "@subsquid/substrate-evm-processor"
import * as erc721 from "./abi/erc721"
import * as erc1155 from "./abi/erc1155"
import { CHAIN_NODE } from "./contract"
import { Contracts } from './processable'
import * as mappings from './mappings';
import { transferFilter } from './mappings/utils/evm'

const processor = new SubstrateEvmProcessor("moonriver-substrate");

processor.setBatchSize(500);

processor.setDataSource({
  chain: CHAIN_NODE,
  archive: lookupArchive("moonriver")[0].url,
});

processor.setTypesBundle("moonbeam");

// processor.addPreHook({ range: { from: 0, to: 0 } }, async (ctx) => {
//   await ctx.store.save(createContractEntity());
// });

processor.addPreHook({ range: { from: 0, to: 0 } }, mappings.forceCreateContract);

processor.addEvmLogHandler(Contracts.Moonsama, transferFilter, mappings.mainFrame);

// processor.addEvmLogHandler(
//   Contracts.Moonx,
//   {
//     filter: [erc1155.events["TransferSingle(address,address,address,uint256,uint256)"].topic],
//   },
//   mappings.singleMainFrame
// );

// export async function contractLogsHandler(
//   ctx: EvmLogHandlerContext
// ): Promise<void> {
//   const transfer = decode721Transfer(ctx)

//   const data = unwrap(ctx, () => {})

//   logger.debug(`Transfer: ${JSON.stringify(transfer)}`)
//   logger.debug(`contractAddress: ${ctx.contractAddress}`)
//   metaLog('BASE', data)
// }

processor.run();
