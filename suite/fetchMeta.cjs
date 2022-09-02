const fs = require('fs');
const path = require('path')
const { cwd } = require('node:process');
const { writeFile, access, mkdir } = require('node:fs/promises');

const { Contracts: NewContracts, ContractsMap } = require('../lib/processable')
const { tokenUriOf } = require('../lib/mappings/utils/graph')
const { fetchMetadata } = require('../lib/mappings/utils/metadata')



console.log(`Current directory: ${cwd()}`);

const assetDir = path.join(cwd(), 'assets')

const fetchMetaOf = async (name) => {
  const addr = NewContracts[name]
  const { max } = ContractsMap[addr]
  const dirpath = await handlePath(addr)
  const metadataList = await Promise.all(Array.from({length: max}, (_, i) => tokenUriOf(addr, i + 1)))
  const saver = fetchAndSave(dirpath)
  metadataList.forEach(saver)
}

const handlePath = async (addr) => {
  const dirname = await tokenUriOf(addr, 0).then((uri) => uri.replace('ipfs://', '').replace(/0.*$/, ''))
  const dirpath = path.join(assetDir, dirname)
  await access(dirpath, fs.constants.F_OK).catch(() => mkdir(dirpath))
  return dirpath
}



const fetchAndSave = (dirpath) => async (uri, index) => {
  const metadata = await fetchMetadata({ metadata: uri })
  const filepath = path.join(dirpath, `${index + 1}.json`)
  await writeFile(filepath, JSON.stringify(metadata, null, 2))
}


fetchMetaOf('DPS')

// x = path.resolve(assetDir)
// console.log(x)

// access(assetDir, fs.constants.F_OK).then(console.log).catch(console.log)

// writeFile(path.join(assetDir, 'QmPxvsXf97jd1ZdHAFfmbrH8CvBXw5nQPeB1HA47odRbLz', 'test.txt'), 'test').then(console.log).catch(console.log)