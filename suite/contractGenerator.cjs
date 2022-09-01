//
const { contractify } = require('../lib/contract')
const { NewContracts } = require('../lib/processable')

const generate = async () => {
  try {
    const list = Object.entries(NewContracts)
    for (const [ct, addr] of list) {
      await printer(ct, addr)
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

const fetchContractMeta = async (addr) => {
  try {
    const contract = contractify(addr)
    const fields = ['name', 'symbol', 'totalSupply', 'owner']
    const mapper = (field) => contract[field]()
    const values = fields.map(mapper)
    const uri = contract.tokenURI('1').then((uri) => uri.replace('ipfs://', '')).catch((e) => '')
    return Promise.all([...values, uri])
  } catch (e) {
    console.log(e);
  }
}

generate()
