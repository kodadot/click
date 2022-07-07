import * as ethers from "ethers";

export const abi = new ethers.utils.Interface(getJsonAbi());

export interface Cancel0Event {
  orderHash: string;
  sellerGetsBackAmount: ethers.BigNumber;
}

export interface Fill0Event {
  orderHash: string;
  buyer: string;
  buyerSendsAmountFull: ethers.BigNumber;
  buyerSentAmount: ethers.BigNumber;
  sellerSendsAmountFull: ethers.BigNumber;
  sellerSentAmount: ethers.BigNumber;
  complete: boolean;
}

export interface Order0Event {
  orderHash: string;
  seller: string;
  sellAssetAddress: string;
  sellAssetId: ethers.BigNumber;
  sellAssetType: ethers.BigNumber;
  buyAssetAddress: string;
  buyAssetId: ethers.BigNumber;
  buyAssetType: ethers.BigNumber;
  strategy: string;
  salt: ethers.BigNumber;
  sellerEscrowsAmount: ethers.BigNumber;
}

export interface PaymentTokenSet0Event {
  token: string;
  assetType: number;
  enabled: boolean;
}

export interface WarehouseSet0Event {
  warehouse: string;
}

export interface EvmEvent {
  data: string;
  topics: string[];
}

export const events = {
  "Cancel(bytes32,uint256)":  {
    topic: abi.getEventTopic("Cancel(bytes32,uint256)"),
    decode(data: EvmEvent): Cancel0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("Cancel(bytes32,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        orderHash: result[0],
        sellerGetsBackAmount: result[1],
      }
    }
  }
  ,
  "Fill(bytes32,address,uint256,uint256,uint256,uint256,bool)":  {
    topic: abi.getEventTopic("Fill(bytes32,address,uint256,uint256,uint256,uint256,bool)"),
    decode(data: EvmEvent): Fill0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("Fill(bytes32,address,uint256,uint256,uint256,uint256,bool)"),
        data.data || "",
        data.topics
      );
      return  {
        orderHash: result[0],
        buyer: result[1],
        buyerSendsAmountFull: result[2],
        buyerSentAmount: result[3],
        sellerSendsAmountFull: result[4],
        sellerSentAmount: result[5],
        complete: result[6],
      }
    }
  }
  ,
  "Order(bytes32,address,address,uint256,uint256,address,uint256,uint256,bytes32,uint256,uint256)":  {
    topic: abi.getEventTopic("Order(bytes32,address,address,uint256,uint256,address,uint256,uint256,bytes32,uint256,uint256)"),
    decode(data: EvmEvent): Order0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("Order(bytes32,address,address,uint256,uint256,address,uint256,uint256,bytes32,uint256,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        orderHash: result[0],
        seller: result[1],
        sellAssetAddress: result[2],
        sellAssetId: result[3],
        sellAssetType: result[4],
        buyAssetAddress: result[5],
        buyAssetId: result[6],
        buyAssetType: result[7],
        strategy: result[8],
        salt: result[9],
        sellerEscrowsAmount: result[10],
      }
    }
  }
  ,
  "PaymentTokenSet(address,uint8,bool)":  {
    topic: abi.getEventTopic("PaymentTokenSet(address,uint8,bool)"),
    decode(data: EvmEvent): PaymentTokenSet0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("PaymentTokenSet(address,uint8,bool)"),
        data.data || "",
        data.topics
      );
      return  {
        token: result[0],
        assetType: result[1],
        enabled: result[2],
      }
    }
  }
  ,
  "WarehouseSet(address)":  {
    topic: abi.getEventTopic("WarehouseSet(address)"),
    decode(data: EvmEvent): WarehouseSet0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("WarehouseSet(address)"),
        data.data || "",
        data.topics
      );
      return  {
        warehouse: result[0],
      }
    }
  }
  ,
}

function getJsonAbi(): any {
  return [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "orderHash",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "sellerGetsBackAmount",
          "type": "uint256"
        }
      ],
      "name": "Cancel",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "orderHash",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "buyerSendsAmountFull",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "buyerSentAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "sellerSendsAmountFull",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "sellerSentAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "complete",
          "type": "bool"
        }
      ],
      "name": "Fill",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "orderHash",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sellAssetAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "sellAssetId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "sellAssetType",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "buyAssetAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "buyAssetId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "buyAssetType",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "strategy",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "salt",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "sellerEscrowsAmount",
          "type": "uint256"
        }
      ],
      "name": "Order",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "enum DomainV1.AssetType",
          "name": "assetType",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "enabled",
          "type": "bool"
        }
      ],
      "name": "PaymentTokenSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "warehouse",
          "type": "address"
        }
      ],
      "name": "WarehouseSet",
      "type": "event"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "strategy",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "salt",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "seller",
              "type": "address"
            },
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "addr",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "id",
                  "type": "uint256"
                },
                {
                  "internalType": "enum DomainV1.AssetType",
                  "name": "assetType",
                  "type": "uint8"
                }
              ],
              "internalType": "struct DomainV1.Asset",
              "name": "sellAsset",
              "type": "tuple"
            },
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "addr",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "id",
                  "type": "uint256"
                },
                {
                  "internalType": "enum DomainV1.AssetType",
                  "name": "assetType",
                  "type": "uint8"
                }
              ],
              "internalType": "struct DomainV1.Asset",
              "name": "buyAsset",
              "type": "tuple"
            }
          ],
          "internalType": "struct DomainV1.Order",
          "name": "_order",
          "type": "tuple"
        }
      ],
      "name": "calculateOrderHash",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "warehouse",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
}
