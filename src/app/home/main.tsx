'use client'

import { useState } from "react"
import MoneyIcon from '@mui/icons-material/AttachMoney'

import { BUTTON_TYPE, Button, Column, GROUP_TYPE, Group, HEADING_SIZE, Heading, INPUT_SIZE, Label, Modal, Paragraph, Row, TYPOGRAPHY_TYPE, TextInput, useDialog } from "@/baseComponents"
import { useAuth } from "@/hooks/useAuth"
import { useSDK } from "@metamask/sdk-react"
import { DEFAULT_CHAIN_ID } from "@/constants"
import { onCreateProduct } from './onCreateProduct'
import { ORDERS_CACHE_KEY, useOrders } from "@/hooks/useOrders"
import { MaxWidth } from "../MaxWidth"
import { TopBar } from "../TopBar"
import { Order, OrderStatus } from "@prisma/client"
import { useQueryClient } from "@tanstack/react-query"
const ethers = require('ethers');
import {decodeResult} from "@chainlink/functions-toolkit/dist/decodeResult.js";
import {ReturnType} from "@chainlink/functions-toolkit/dist/types";
import {ResponseListener} from "@chainlink/functions-toolkit/dist/ResponseListener";
//import {listenForResponseFromTransaction} from "@chainlink/functions-toolkit/dist/ResponseListener";

//const functionsConsumerAbi = require("../smartContracts/abi/abi/payment2.json");
//const ethers = require("ethers");

const consumerAddress = "0xDE74190f3293DdD7edAbA64ed38a680bCaF75555"; // REPLACE this with your Functions consumer address
const subscriptionId = 50; // REPLACE this with your subscription ID
const routerAddress = "0xdc2AAF042Aeff2E68B3e8E33F19e4B9fA7C73F10";
const linkTokenAddress = "0xb0897686c545045aFc77CF20eC7A532E3120E0F1";
const gasLimit = 300000;
const abiPayments = [
  {
    "inputs": [],
    "name": "acceptOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "router",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "EmptyArgs",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "EmptySecrets",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "EmptySource",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "response",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "err",
        "type": "bytes"
      }
    ],
    "name": "handleOracleFulfillment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "NoInlineSecrets",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "OnlyRouterCanFulfill",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
      }
    ],
    "name": "UnexpectedRequestID",
    "type": "error"
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
      }
    ],
    "name": "OwnershipTransferRequested",
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
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      }
    ],
    "name": "RequestFulfilled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      }
    ],
    "name": "RequestSent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "response",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "err",
        "type": "bytes"
      }
    ],
    "name": "Response",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "source",
        "type": "string"
      },
      {
        "internalType": "bytes",
        "name": "encryptedSecretsUrls",
        "type": "bytes"
      },
      {
        "internalType": "uint8",
        "name": "donHostedSecretsSlotID",
        "type": "uint8"
      },
      {
        "internalType": "uint64",
        "name": "donHostedSecretsVersion",
        "type": "uint64"
      },
      {
        "internalType": "string[]",
        "name": "args",
        "type": "string[]"
      },
      {
        "internalType": "bytes[]",
        "name": "bytesArgs",
        "type": "bytes[]"
      },
      {
        "internalType": "uint64",
        "name": "subscriptionId",
        "type": "uint64"
      },
      {
        "internalType": "uint32",
        "name": "gasLimit",
        "type": "uint32"
      },
      {
        "internalType": "bytes32",
        "name": "donID",
        "type": "bytes32"
      }
    ],
    "name": "sendRequest",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "request",
        "type": "bytes"
      },
      {
        "internalType": "uint64",
        "name": "subscriptionId",
        "type": "uint64"
      },
      {
        "internalType": "uint32",
        "name": "gasLimit",
        "type": "uint32"
      },
      {
        "internalType": "bytes32",
        "name": "donID",
        "type": "bytes32"
      }
    ],
    "name": "sendRequestCBOR",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
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
    "name": "s_lastError",
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
    "name": "s_lastRequestId",
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
    "name": "s_lastResponse",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

const getOrderStatusLabel = (order: Order) => {
  if (!order.hasBeenPaid) {
    return 'Unpaid'
  } else if (!order.hasBeenShipped) {
    return 'Needs Shipping'
  } else if (!order.hasBeenDelivered) {
    return 'In Transit'
  } else if (!order.fulfilled) {
    return 'Delivered'
  } else {
    return 'Payment Received'
  }
}

export const Main = () => {
  const queryClient = useQueryClient()
  const {signature, account} = useAuth()
  const metamask = useSDK()
  const { orders } = useOrders()

  const chainId = metamask.chainId || DEFAULT_CHAIN_ID

  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [productPrice, setProductPrice] = useState(0)
  const [imageUrl, setImageUrl] = useState('')

  const [orderIdForShippingModal, setOrderIdForShippingModal] = useState<string | undefined>()
  const [shippingLabel, setShippingLabel] = useState<string>('')

  const { state, open, close } = useDialog('shipping-label')
  const [isProductSaving, setIsProductSaving] = useState(false)

  const addProduct = async () => {
    setIsProductSaving(true)

    try {
      const body = {
        name: productName,
        description: productDescription,
        price: productPrice,
        image: imageUrl,
        chainId
      }
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': signature!,
          'X-Account': account!
        },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      onCreateProduct({
        product: data.product,
        metamask
      })

    } catch (error) {
      console.log(error)
    }
    setIsProductSaving(false)
  }


  return (
    <Column>
      <Modal
        isOpen={state.isOpen}
        close={close}
        heading="Attach Shipping Label"
        actions={[{
          label: 'Cancel',
          onClick: () => {
            setShippingLabel('')
            setOrderIdForShippingModal(undefined)
            close()
          }
        }, {
          label: 'Submit',
          isPrimary: true,
          onClick: async () => {
            await fetch(`/api/orders/markShipped`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Signature': signature!,
                'X-Account': account!
              },
              body: JSON.stringify({
                orderId: orderIdForShippingModal,
                shippingLabel,
              })
            })
            queryClient.invalidateQueries({
              queryKey: [ORDERS_CACHE_KEY]
            })
            setShippingLabel('')
            setOrderIdForShippingModal(undefined)
            close()

            //going to try to add code here. 
            //async function main(){
            const client = "const countryCode = ['JP'];//args[0];\nconst url = \"https://countries.trevorblades.com/\";\nconsole.log(`Get name, capital and currency for country code: ${countryCode}`);\nconsole.log(`HTTP POST Request to ${url}`);\nconst countryRequest = Functions.makeHttpRequest({\n  url: url,\n  method: \"POST\",\n  headers: {\n    \"Content-Type\": \"application/json\",\n  },\n  data: {\n    query: `{\\\n        country(code: \"${countryCode}\") { \\\n          name \\\n          capital \\\n          currency \\\n        } \\\n      }`,\n  },\n});\n\n// Execute the API request (Promise)\nconst countryResponse = await countryRequest;\nif (countryResponse.error) {\n  console.error(\n    countryResponse.response\n      ? `${countryResponse.response.status},${countryResponse.response.statusText}`\n      : \"\"\n  );\n  throw Error(\"Request failed\");\n}\n\nconst countryData = countryResponse[\"data\"][\"data\"];\n\nif (!countryData || !countryData.country) {\n  throw Error(`Make sure the country code \"${countryCode}\" exists`);\n}\n\nconsole.log(\"country response\", countryData);\n\n// result is in JSON object\nconst result = {\n  name: countryData.country.name,\n  capital: countryData.country.capital,\n  currency: countryData.country.currency,\n};\n\n// Use JSON.stringify() to convert from JSON object to JSON string\n// Finally, use the helper Functions.encodeString() to encode from string to bytes\nreturn Functions.encodeString(JSON.stringify(result));\n"
            const args = ["JP"];
            //const amount2 = ethers.utils.parseUnits(String(total), "mwei");
            //console.log("amount2",amount2);
            //before implementing this you need some type of reducer or something to track if the approve function has already been called
            const _window: any = window;
            const provider = new ethers.BrowserProvider(window.ethereum);
            const _accounts = await _window.ethereum.request({
              method: "eth_requestAccounts",
            })
            const accounts = _accounts || [] 
          
            console.log("accounts", accounts[0]);
            const signer = await provider.getSigner(0);
            console.log("_accounts[0]", _accounts[0]);
            console.log(typeof(accounts[0]))
            console.log("provider= ", provider);
            console.log("signer= ", signer);
            
            const payments = await new ethers.Contract("0xc4E19e277A5c11550209E50e190A9b01C9D31df1",abiPayments,signer);
            const paymentSuccessful = await payments.sendRequest(client,"0x",0,0,args,[],subscriptionId, gasLimit,"0x66756e2d706f6c79676f6e2d6d61696e6e65742d310000000000000000000000");
            const responseBytes = await payments.s_lastResponse();
            const responseError = await payments.s_lastError();
            console.log("payments= ", paymentSuccessful);
            console.log("responseBytes", responseBytes);
            const responseListener = new ResponseListener({
              provider,
              functionsRouterAddress: routerAddress,
            });

            const returnType = ReturnType.string;
            const decodedError = decodeResult(
                responseError,
                returnType
              );
            console.log("decodedError== ", decodedError);
            const decodedResponse = decodeResult(
              responseBytes,
              returnType
            );
            console.log("decodedResponse== ", decodedResponse);

            console.log("you marked an order as shipped");
          //}
          }
        }]}
      >
        <TextInput
          label="Shipping Label"
          value={shippingLabel}
          onChange={setShippingLabel}
          sx={{
            width: '300px'
          }}
        />
      </Modal>
      <TopBar />
      <MaxWidth>
        <Group sx={{p: 4}}>
          <Column sx={{width: '400px'}}>
            <Heading size={HEADING_SIZE.SM}>Add New Product</Heading>
            <TextInput
              label="Product Name"
              value={productName}
              sx={{mt: 4}}
              onChange={setProductName}
            />
            <TextInput
              label="Product Description"
              sx={{mt: 4}}
              value={productDescription}
              onChange={setProductDescription}
            />
            <TextInput
              label="Image URL"
              value={imageUrl}
              sx={{mt: 4}}
              onChange={setImageUrl}
            />
            <TextInput
              label="Product Price"
              leftIcon={MoneyIcon}
              type="number"
              value={productPrice.toString()}
              sx={{mt: 4}}
              onChange={(value) => {
                setProductPrice(parseInt(value))
              }}
            />
            <Row align="center">
              <TextInput
                disabled
                size={INPUT_SIZE.LG}
                label="ChainId"
                sx={{
                  width: '100px',
                  mt: 4
                }}
                value={chainId || ''}
              />
              <Paragraph typography={TYPOGRAPHY_TYPE.CONDENSED_TEXT_SMALL} sx={{ml: 2, pt: 2}}>
                To change the chainId, change your network in MetaMask
              </Paragraph>
            </Row>
            <Button
              sx={{mt: 2}}
              onClick={addProduct}
            >
              Add
            </Button>
          </Column>
        </Group>
        <Group
          type={GROUP_TYPE.REGION}
          sx={{
            mt: 5,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Heading size={HEADING_SIZE.SM}>Orders</Heading>
          {orders && orders.map((order) => {
            const summary = order.summary as any[]

            return (
              <Group key={order.id} type={GROUP_TYPE.REGION} sx={{width: '100%'}}>
                <Column
                  key={order.id}
                  sx={{
                    mt: 4,
                    p: 4,
                    border: '1px solid #eee',
                    borderRadius: '4px',
                    alignItems: 'flex-start'
                  }}
                >
                  <Row sx={{width: '100%'}} align='center'>
                    <Heading size={HEADING_SIZE.SM}>
                      {order.id} - {getOrderStatusLabel(order)}
                    </Heading>
                    <Column grow={1} />
                    <Column>
                      {!order.hasBeenShipped && (
                        <Button
                          type={BUTTON_TYPE.TEXT}
                          onClick={() => {
                            setOrderIdForShippingModal(order.id)
                            open()
                          }}
                        >
                          Attach Shipping Label
                        </Button>
                      )}
                    </Column>
                  </Row>
                  <Row>
                    <Group
                      type={GROUP_TYPE.GROUP}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        width: '300px'
                      }}
                    >
                      <Label>Summary</Label>
                      {summary.map((item) => {
                        return (
                          <Paragraph
                            key={item.id}
                            typography={TYPOGRAPHY_TYPE.CONDENSED_TEXT_SMALL}
                          >
                            {item.productId} x {item.quantity}
                          </Paragraph>
                        )
                      })}
                    </Group>

                    <Group
                      type={GROUP_TYPE.GROUP}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                      }}
                    >
                      <Label>Address</Label>
                      <Paragraph typography={TYPOGRAPHY_TYPE.CONDENSED_TEXT_SMALL}>
                        {order.address1}
                      </Paragraph>
                      { order.address2 && (
                        <Paragraph typography={TYPOGRAPHY_TYPE.CONDENSED_TEXT_SMALL}>
                          {order.address2}
                        </Paragraph>
                      )}
                      <Paragraph typography={TYPOGRAPHY_TYPE.CONDENSED_TEXT_SMALL}>
                        {order.city}, {order.state} {order.zip}
                      </Paragraph>
                    </Group>
                  </Row>
                </Column>
              </Group>
            )
          })}
        </Group>
      </MaxWidth>

    </Column>
  )
}