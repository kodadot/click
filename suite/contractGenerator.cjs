//
const { contractify } = require('../lib/contract')
const { Contracts: NewContracts } = require('../lib/processable')

const generate = async () => {
  try {
    const list = Object.entries(NewContracts)
    for (const [ct, addr] of list) {
      // await printer(ct, addr)
      // await addLog(ct, addr)
      await graphMaker(ct, addr)
    }
  
  } catch (e) {
    console.log(e);
  }
}

const printer = async (ct, addr ) => {
  const value = await fetchContractMeta(addr)
  const [name, symbol, totalSupply, owner, uri] = value
  console.log(`[Contracts.${ct}]: toMap('${name}', '${symbol}', ${totalSupply}, '${owner}', '${uri || ''}'),`)    
}

const graphMaker = async  (ct, addr) => {
  const contract = contractify(addr)
  const uri = await contract.tokenURI('1').then((uri) => uri).catch((e) => '')
  console.log(`[Contracts.${ct}]: (id: string) => '${uri}',`)    
}

const addLog = (ct, addr) => {
  console.log(`processor.addEvmLogHandler(Contracts.${ct}, transferFilter, mappings.mainFrame);`)    
}

const fetchContractMeta = async (addr) => {
  try {
    const contract = contractify(addr)
    const fields = ['name', 'symbol', 'totalSupply', 'owner']
    const mapper = (field) => contract[field]().catch((e) => '')
    const values = fields.map(mapper)
    const uri = contract.tokenURI('1').then((uri) => uri.replace('ipfs://', '')).catch((e) => '')
    return Promise.all([...values, uri])
  } catch (e) {
    console.log(e);
  }
}

generate()
