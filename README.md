# Click

![](https://media.giphy.com/media/KZEniLNHKh2HRFEhdu/giphy.gif)

Support of Moonsama-based NFTs in the KodaDot

## How does it work

We basically index three types of events:

  * `Transfer` - events emitted by the ERC-721 contract when a token is transferred.
  * `TransferSingle` - events emitted by the ERC-1155 contract when a single token id is transferred.
  * `TransferBatch` - events emitted by the ERC-1155 contract when a batch of token ids are transferred.

```ts
// Snippet that shows how to handle events
processor.addEvmLogHandler(Contracts.Moonsama, transferFilter, mappings.mainFrame);
processor.addEvmLogHandler(Contracts.Moonx, singleTransferFilter, mappings.singleMainFrame);
processor.addEvmLogHandler(Contracts.Moonx, multiTransferFilter, mappings.mutliMainFrame);
```

What's the `Contracts.Moonsama` ? That's an excellent question.
In the `processable.ts,` we have an enum that defines the contract addresses.

```ts
enum Contracts {
  Moonsama = '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a', // ERC-721
  Moonx = '0x1974eeaf317ecf792ff307f25a3521c35eecde86', // ERC-1155
}
```
**What are the `transferFilter` and `singleTransferFilter` ?**

We simply tell the indexer that we want to listen to this specific event (topic) from the particular contract.
As shown in the snippet below, we have a filter that listens to the `Transfer` event.

```ts
export const transferFilter: EvmLogHandlerOptions = {
  filter: [erc721.events["Transfer(address,address,uint256)"].topic],
}
```

The last parameter of the `addEvmLogHandler` is a function that will be called when the event is emitted.
The algorithm is as follows:

```ts
export async function mainFrame(ctx: Context): Promise<void> {
  const transfer = decode721Transfer(ctx) // decode the event to [from, to, tokenId]
  
    switch (whatIsThisTransfer(transfer)) { // check what kind of transfer it is (mint, transfer, send)
    case Interaction.MINTNFT:
      transferDebug(Interaction.MINTNFT, transfer)
      await handleTokenCreate(ctx)
      break
    case Interaction.SEND:
      transferDebug(Interaction.SEND, transfer)
      await handleTokenTransfer(ctx)
      break
    case Interaction.CONSUME:
      transferDebug(Interaction.CONSUME, transfer)
      await handleTokenBurn(ctx)
      break
    default:
      logger.warn(`Unknown transfer: ${JSON.stringify(transfer, null, 2)}`)
  }
}
```

For example, we have a function that handles the `Transfer` event.
- First, we need to get base transaction data and data about the transferred token.
- This is done by calling the `unwrap(context, getTransferTokenEvent)` function.
- Then we need to check if the token exists in the database.
- In the last step, we need to update the `currentOwner` and save the token to the database.
- Moreover, for historical purposes, we also created an event where the NFT was transferred.

```ts
export async function handleTokenTransfer(context: Context): Promise<void> {
  const event = unwrap(context, getTransferTokenEvent)
  const id = createTokenId(event.collectionId, event.sn)
  const entity = ensure<NE>(await get(context.store, NE, id))
  plsBe(real, entity)

  entity.currentOwner = event.to
  
  await context.store.save(entity)
  await createEvent(entity, Interaction.SEND, event, event.to || '', context.store, currentOwner)
}
```

## Fast Forward

```
just up
just codegen
just build
just reset
just explore
```

Start processor
```
just process
```

Run GraphQL queries
```
just serve
```

## Prerequisites

* NodeJS 16.x
* npm
* docker

## Bootstrap

```bash
# 1. Install dependencies
npm ci

# 2. Compile typescript files
npm run build

# 3. Start target Postgres database
docker compose up -d

# 4. Apply database migrations from db/migrations
npx sqd db create
npx sqd db migrate

# 5. Now start the processor
node -r dotenv/config lib/processor.js

# 6. The above command will block the terminal
#    being busy with fetching the chain data, 
#    transforming and storing it in the target database.
#
#    To start the graphql server open the separate terminal
#    and run
npx squid-graphql-server
```

### Import ABI contract and set up interfaces to decode events

In order to be able to process EVM logs, it is necessary to import the respective ABI definition. In the case of this project, this has been done via the [`src/abis/ERC721.json`](src/abis/ERC721.json) file.

Furthermore, it is necessary to decode logs and this is shown in [`src/abis/erc721.ts`](src/abis/erc721.ts). The `events` dictionary define there maps the event name at the center of this project to the function used to decode it.

### Project structure

Hydra tools expect a certain directory layout:

* `src/generated` - model/server definitions created by `codegen`. Do not alter the contents of this directory manually.
* `src/server-extension` - module with custom `type-graphql` based resolvers
* `src/types` - data type definitions for chain events and extrinsics created by `typegen`.
* `src/mappings` - mapping module.
* `lib` - compiled js files. The structure of this directory must reflect `src`.
* `.env` - hydra tools are heavily driven by environment variables defined here or supplied by a shell.


### Viki's Randomnotes

1. [Squid EVM typegen](https://docs.subsquid.io/reference/squid-evm-typegen)

```sh
npx squid-evm-typegen --abi ./src/abi/ERC1155.json --output ./src/abi/erc1155.ts
```