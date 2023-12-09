import { BUTTON_SIZE, BUTTON_TYPE, Box, Button, COLOR, Column, EmptyState, FONT_SIZE, GROUP_TYPE, Group, HEADING_SIZE, Heading, INPUT_SIZE, LABEL_SIZE, Label, Paragraph, Row, TYPOGRAPHY_TYPE, TextInput } from "@/baseComponents"
import { BOX_SHADOW, Z_INDEX } from "@/baseComponents/theme/custom"
import TrashIcon from '@mui/icons-material/Delete'
import { PLACEHOLDER_IMAGE } from "@/constants"
import { useCart } from "@/hooks/useCart"
import { useSDK } from "@metamask/sdk-react"
import React, { useContext } from "react"
import { ethers } from 'ethers'

export const Cart = () => {
  const { cart, isOpen } = useCart()
  const { sdk, connected, connecting, provider, chainId, account } = useSDK();

  if (typeof window === 'undefined') {
    return null
  }

  console.log('test')

  const _window = window as any

  const onCheckout = () => {
    // GAVIN'S CODE GOES HERE
    async function main() {
      // Get the provider and signer fyrom the browser window
      //await window.ethereum.enable(); //watch out for typing issues with window. 
      //test
      const provider = new ethers.BrowserProvider(_window.ethereum);
      const _accounts = await _window.ethereum.request({
        method: "eth_requestAccounts",
      })
      const accounts: any = _accounts || [] 

      // console.log("accounts", accounts[0]);
      const signer = await provider.getSigner(0);
      console.log("accounts[0]", accounts[0]);
      console.log("provider= ", provider);
      console.log("signer= ", signer);
      const amount = ethers.parseEther("0.000000000000000002");
      const obj = [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Approval",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "userAddress",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address payable",
              "name": "relayerAddress",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "bytes",
              "name": "functionSignature",
              "type": "bytes"
            }
          ],
          "name": "MetaTransactionExecuted",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "previousAdminRole",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "newAdminRole",
              "type": "bytes32"
            }
          ],
          "name": "RoleAdminChanged",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "account",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "sender",
              "type": "address"
            }
          ],
          "name": "RoleGranted",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "account",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "sender",
              "type": "address"
            }
          ],
          "name": "RoleRevoked",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "CHILD_CHAIN_ID",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "CHILD_CHAIN_ID_BYTES",
          "outputs": [
            {
              "internalType": "bytes",
              "name": "",
              "type": "bytes"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "DEFAULT_ADMIN_ROLE",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "DEPOSITOR_ROLE",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "ERC712_VERSION",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "ROOT_CHAIN_ID",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "ROOT_CHAIN_ID_BYTES",
          "outputs": [
            {
              "internalType": "bytes",
              "name": "",
              "type": "bytes"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            }
          ],
          "name": "allowance",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "approve",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "balanceOf",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "decimals",
          "outputs": [
            {
              "internalType": "uint8",
              "name": "",
              "type": "uint8"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "subtractedValue",
              "type": "uint256"
            }
          ],
          "name": "decreaseAllowance",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "bytes",
              "name": "depositData",
              "type": "bytes"
            }
          ],
          "name": "deposit",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "userAddress",
              "type": "address"
            },
            {
              "internalType": "bytes",
              "name": "functionSignature",
              "type": "bytes"
            },
            {
              "internalType": "bytes32",
              "name": "sigR",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "sigS",
              "type": "bytes32"
            },
            {
              "internalType": "uint8",
              "name": "sigV",
              "type": "uint8"
            }
          ],
          "name": "executeMetaTransaction",
          "outputs": [
            {
              "internalType": "bytes",
              "name": "",
              "type": "bytes"
            }
          ],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getChainId",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "pure",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getDomainSeperator",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getNonce",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "nonce",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            }
          ],
          "name": "getRoleAdmin",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            }
          ],
          "name": "getRoleMember",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            }
          ],
          "name": "getRoleMemberCount",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "grantRole",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "hasRole",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "addedValue",
              "type": "uint256"
            }
          ],
          "name": "increaseAllowance",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "name_",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "symbol_",
              "type": "string"
            },
            {
              "internalType": "uint8",
              "name": "decimals_",
              "type": "uint8"
            },
            {
              "internalType": "address",
              "name": "childChainManager",
              "type": "address"
            }
          ],
          "name": "initialize",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "name",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "renounceRole",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "revokeRole",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "symbol",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalSupply",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transfer",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transferFrom",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "withdraw",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];
      const USDT = await new ethers.Contract("0xc2132D05D31c914a87C6611C10748AEb04B58e8F", obj, signer);
      const USDTallowance = await USDT.allowance(accounts[0],"0x30E644CF4C3a6E69109957Db1EC7a01dd383a4aE")
      console.log("USDTallowance",USDTallowance);
      if(USDTallowance < amount) {
        console.log("need to approve");
        const USDTApproval = await USDT.approve("0x30E644CF4C3a6E69109957Db1EC7a01dd383a4aE", amount);//ethers.getContractAt("./smartContracts/artifacts/contracts/USDT.sol/UChildERC20.json", "0xc2132D05D31c914a87C6611C10748AEb04B58e8F");
        console.log("USDTApproval= ",USDTApproval);
      } else {
        console.log("no need to approve");
      }


     const abiPayments = [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "_from",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "_to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "paymentSuccessful",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "_address",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bool",
            "name": "_bool",
            "type": "bool"
          }
        ],
        "name": "tokenContractAllowed",
        "type": "event"
      },
      {
        "stateMutability": "payable",
        "type": "fallback"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_token",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "_isAllowed",
            "type": "bool"
          }
        ],
        "name": "allowedStableCoinAddress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "allowedTokenAddress",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "amountPaidByAddress",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "amountPaidByAddress2Contract",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_token",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "depositPayment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_token",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "depositPaymentWithTracking",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_token",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "depositePaymentToContract",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "stateMutability": "payable",
        "type": "receive"
      }
    ]
    console.log(amount);
    //before implementing this you need some type of reducer or something to track if the approve function has already been called
    const payments = await new ethers.Contract("0x30E644CF4C3a6E69109957Db1EC7a01dd383a4aE",abiPayments,signer);
    const paymentSuccessful = await payments.depositePaymentToContract("0xc2132D05D31c914a87C6611C10748AEb04B58e8F","0xbaf3bd3a8ee73249d77b91cf30b5294196124b45", amount);

    }
    main().catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  }
  
  if (!isOpen) {
    return null
  }

  const total = cart ? cart.reduce((acc, item) => acc + (item.quantity * item.product.price), 0) : 0

  return (
    <Group sx={{
      display: 'flex',
      my: 0,
      flexDirection: 'column',
      position: 'fixed',
      top: '64px',
      right: 0,
      width: '400px',
      height: 'calc(100vh - 64px)',
      bg: COLOR.WHITE,
      boxShadow: BOX_SHADOW.NORMAL,
      zIndex: Z_INDEX.ELEVATED,
      p: 4
    }}>
      <Heading size={HEADING_SIZE.SM}>Your Cart</Heading>
      <Column grow={1} sx={{mt: 4}}>
        {cart && cart.length === 0 && (
          <EmptyState omitIcon>Your cart is empty.</EmptyState>
        )}

        {cart && cart.length > 0 && (
          <>
            {cart.map((item) => (
              <Group type={GROUP_TYPE.GROUP}>
                <Row>
                  <Column>
                    <Box sx={{boxShadow: BOX_SHADOW.EMPHASIZED}}>
                      <img
                        src={PLACEHOLDER_IMAGE}
                        alt={item.product.name}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  </Column>
                  <Column sx={{ml: 4}}>
                    <Row>
                      <Label sx={{fontSize: FONT_SIZE.MD}}>{item.product.name}</Label>
                    </Row>
                    <Row align="center">
                      <TextInput
                        disabled
                        label="Qty"
                        size={INPUT_SIZE.SM}
                        type="number"
                        value={item.quantity.toString()}
                        sx={{mt: 3, mr: 1, width: '60px'}}
                      />
                      x ${item.product.price} = ${item.quantity * item.product.price}.00
                      <Button
                        type={BUTTON_TYPE.TEXT}
                        primaryIcon={TrashIcon}
                        color={COLOR.ND_TERTIARY_4}
                        size={BUTTON_SIZE.LG}
                        sx={{
                          ml: 2
                        }}
                      />
                    </Row>
                  </Column>
                </Row>
              </Group>
            ))}

          </>
        )}

      </Column>

      <Column grow={0} justify={'flex-end'} align="center" sx={{p: 5}}>
        <Group type={GROUP_TYPE.GROUP}>
          <Row>
            <Label sx={{mr: 2}} size={LABEL_SIZE.LG}>
              Total: 
            </Label>
            <Paragraph typography={TYPOGRAPHY_TYPE.CONDENSED_TEXT_LARGE}>
              ${total}.00
            </Paragraph>
          </Row>
        </Group>
        { connected ? (
          <Button
            onClick={() => {
              onCheckout()
            }} 
          >
            Check Out
          </Button>
        ) : (
          <Button
            onClick={() => {
              sdk?.connect()
            }}
          >
            Connect Wallet
          </Button>
        ) }
      </Column>
    </Group>
  )
}