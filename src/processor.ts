import {
  EvmLogHandlerContext,
  SubstrateEvmProcessor,
} from "@subsquid/substrate-evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import { CHAIN_NODE, contract, createContractEntity } from "./contract";
import * as erc721 from "./abi/erc721";
import logger from './mappings/utils/logger'

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

processor.addEvmLogHandler(
  contract.address,
  {
    filter: [erc721.events["Transfer(address,address,uint256)"].topic],
  },
  contractLogsHandler
);

export async function contractLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  const transfer =
    erc721.events["Transfer(address,address,uint256)"].decode(ctx);

    logger.debug(`Transfer: ${JSON.stringify(transfer)}`)
    logger.debug(`contractAddress: ${ctx.contractAddress}`)
    const caller = ctx.substrate.extrinsic?.signer.toString() || ''; 
    const blockNumber = ctx.substrate.block.height.toString();
    const timestamp = new Date(ctx.substrate.block.timestamp);
    logger.debug(`BASE: ${JSON.stringify({ caller, blockNumber, timestamp })}`)
  
}

processor.run();
