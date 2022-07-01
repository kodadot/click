import { lookupArchive } from "@subsquid/archive-registry"
import {
  SubstrateEvmProcessor
} from "@subsquid/substrate-evm-processor"
import * as erc721 from "./abi/erc721"
import { CHAIN_NODE, createContractEntity } from "./contract"
import { Contracts } from './processable'
import * as mappings from './mappings';

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

processor.addEvmLogHandler(
  Contracts.Moonsama,
  {
    filter: [erc721.events["Transfer(address,address,uint256)"].topic],
  },
  mappings.mainFrame
);

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
