'use client'

import { useState } from "react"
import MoneyIcon from '@mui/icons-material/AttachMoney'

import { BUTTON_TYPE, Button, Column, GROUP_TYPE, Group, HEADING_SIZE, Heading, INPUT_SIZE, Label, Modal, Paragraph, Row, TYPOGRAPHY_TYPE, TextInput, useDialog } from "@/baseComponents"
import { useAuth } from "@/hooks/useAuth"
import { useSDK } from "@metamask/sdk-react"
import { DEFAULT_CHAIN_ID } from "@/constants"
import { onCreateProduct } from './onCreateProduct'
import { ORDERS_CACHE_KEY, useOrders } from "@/hooks/useOrders"
import { ORDERS_CACHE_KEY_CLIENT , useOrdersClient } from "@/hooks/useOrdersClient"
import { MaxWidth } from "../MaxWidth"
import { TopBar } from "../TopBar"
import { Order, OrderStatus } from "@prisma/client"
import { useQueryClient } from "@tanstack/react-query"
const ethers = require('ethers');
import {decodeResult} from "@chainlink/functions-toolkit/dist/decodeResult.js";
import {ReturnType} from "@chainlink/functions-toolkit/dist/types";
import {ResponseListener} from "@chainlink/functions-toolkit/dist/ResponseListener";
const abiAddProduct =  require("../../smartContracts/abi/abi/abiAddProduct.json");
//import {listenForResponseFromTransaction} from "@chainlink/functions-toolkit/dist/ResponseListener";

const paymentsAbi = require("../../smartContracts/abi/abi/payment2.json");
//const ethers = require("ethers");

const consumerAddress = "0xB41a92BbAdB9DCe8b22D12F287a3e40a4af98685";  // REPLACE this with your Functions consumer address
const subscriptionId = 50; // REPLACE this with your subscription ID
const routerAddress = "0xdc2AAF042Aeff2E68B3e8E33F19e4B9fA7C73F10";
const linkTokenAddress = "0xb0897686c545045aFc77CF20eC7A532E3120E0F1";
const gasLimit = 300000;



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
  const { ordersClient } = useOrdersClient()

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

    //try {
      
      const body = {
        name: productName,
        description: productDescription,
        price: productPrice,
        image: imageUrl,
        chainId: chainId
      }
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': signature!,//'0x5f816a83ef4be7b20720d0efcfcd9523d073caab00eb87f6f1c732f6d878e9416f9eedfb0ebda0542d8cecbcf3dda48ebb211393f70db618310bc1b8244348af1b',//signature!,
          'X-Account': account!//'0xa82722615e3b37b892ead5738c122e62c8b49604'//account!
        },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      onCreateProduct({
        product: data.product,
        metamask
      })

      //console.log('data',data.)
    /*} catch (error) {
      console.log("error=",error)
    }*/
    console.log("data.product.id= ", data.product.id);
    const productID = data.product.id;
    setIsProductSaving(false)
    
              //going to try to add code here. 
              console.log("yo")
              console.log("typeof(productPrice)",typeof(productPrice));
            //async function main(){
              //const client = "// No authentication. demonstrate POST with data in body\n// callgraphql api: https://github.com/trevorblades/countries\n// docs: https://trevorblades.github.io/countries/queries/continent\n\n// make HTTP request\nconst productName= args[0];\nconst productdescription = args[1];\nconst productPrice= parseInt(args[2]);\nconst imageUrl=args[3];\nconst chainID = args[4];\nconst account1 = args[5];\nconst signature1 = args[6];\nconsole.log(\"typeof(price)= \", typeof(productPrice));\n// const body_text = {\n//   //vendorAddress: account,\n//   name: productName,\n//   price: productPrice,\n//   description: productDescription,\n//   chainId: chainId,\n//   image: imageUrl\n// }\n\n//const signature = args[5];\n//const account = args[6];\n//const orderId= args[0];\n// const amount= parseInt(args[1]);\n// console.log(\"amount= \",amount)\nconst url = \"https://defiber.io/api/products\";\n//console.log(`Get name, capital and currency for country code: ${countryCode}`);\nconsole.log(`HTTP POST Request to ${url}`);\nconst orderRequest = Functions.makeHttpRequest({\n  url: url,\n  method: \"POST\",\n  headers: {\n    'Content-Type': 'application/json',\n    'X-Signature':signature1,\n    'X-Account':account1\n   },\n   data: {\n    name: productName,\n    description: productdescription,\n    price: productPrice,\n    image: imageUrl,\n    chainId: chainID\n   }\n  });\n\n\n// Execute the API request (Promise)\nconst orderResponse = await orderRequest;\nconsole.log(\"orderResponse= \", orderResponse);\n//console.log(\"orderResponse.text()= \", orderResponse.text());\nif (orderResponse.error) {\n  console.error(\n    orderResponse.response\n      ? `${orderResponse.response.status},${orderResponse.response.statusText}`\n      : \"\"\n  );\n  throw Error(\"Request failed\");\n}\n\nconst orderData = orderResponse[\"data\"];\nconsole.log(\"orderData\", orderData[\"status\"]);\n//probably don't need [\"data\"][\"data\"]\n// if (!orderData || !orderData.country) {\n//   throw Error(`Make sure the country code \"${countryCode}\" exists`);\n// }\n\n//console.log(\"country response\", countryData);\n\n// result is in JSON object\n// const result = {\n//   name: countryData.country.name,\n//   capital: countryData.country.capital,\n//   currency: countryData.country.currency,\n// };\n\n// Use JSON.stringify() to convert from JSON object to JSON string\n// Finally, use the helper Functions.encodeString() to encode from string to bytes\nreturn Functions.encodeString(JSON.stringify(orderData));\n"
              //const args = [productName,productDescription,productPrice.toString(),imageUrl,chainId,account,signature];
              const _window: any = window;
              const provider = new ethers.BrowserProvider(window.ethereum);
              const _accounts = await _window.ethereum.request({
                method: "eth_requestAccounts",
              })
              const accounts = _accounts || [] 
            
              console.log("accounts", accounts[0]);
              const signer = await provider.getSigner();
              console.log("_accounts[0]", _accounts[0]);
              console.log(typeof(accounts[0]))
              console.log("provider= ", provider);
              console.log("signer= ", signer);
              //const total = 1;
              console.log("productName", productName);
              const amount = ethers.parseUnits(String(productPrice), "mwei");
              console.log("amount= ", amount);
              const payments = await new ethers.Contract(consumerAddress,paymentsAbi,signer);
              
              const paymentSuccessful = await payments.createItem(amount,productID);//,client,"0x",0,0,args,[],subscriptionId, gasLimit,"0x66756e2d706f6c79676f6e2d6d61696e6e65742d310000000000000000000000");
              /*
              console.log("signature!= ", signature!);
              console.log("account!=", account!);
              //const paymentSuccessful = await payments.withdraw("0xc2132D05D31c914a87C6611C10748AEb04B58e8F",amount,client,"0x",0,0,args,[],subscriptionId, gasLimit,"0x66756e2d706f6c79676f6e2d6d61696e6e65742d310000000000000000000000");
              function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
              }
              
              await sleep(40000).then(() => { console.log('World!'); });
              const responseBytes = await payments.s_lastResponse();
              const responseError = await payments.s_lastError();
              console.log("payments= ", paymentSuccessful);
              console.log("responseBytes", responseBytes);
              const responseListener = new ResponseListener({
                signer,
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
  
              console.log("you just got paid");
              */
              
              
  }


  return (
    <Column>
      <Modal
        isOpen={state.isOpen}
        close={close}
        heading="Attach UPS Shipping Label"
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
            queryClient.invalidateQueries({
              queryKey: [ORDERS_CACHE_KEY_CLIENT]
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
            
            //const payments = await new ethers.Contract("0xc4E19e277A5c11550209E50e190A9b01C9D31df1",abiAddProduct,signer);
            //const paymentSuccessful = await payments.sendRequest(client,"0x",0,0,args,[],subscriptionId, gasLimit,"0x66756e2d706f6c79676f6e2d6d61696e6e65742d310000000000000000000000");
            //const responseBytes = await payments.s_lastResponse();
            //const responseError = await payments.s_lastError();
            //console.log("payments= ", paymentSuccessful);
            /*console.log("responseBytes", responseBytes);
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

            console.log("you marked an order as shipped");*/
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
          <Heading size={HEADING_SIZE.SM}>Orders to fulfill</Heading>
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
   
                    <Column>
                      {order.hasBeenDelivered && !order.fulfilled && (
                        <Button
                          type={BUTTON_TYPE.TEXT}
                          onClick={async() => {
                            //setOrderIdForShippingModal(order.id)
                            //open()

                            //going to try to add code here. 
                            //async function main(){
                            
                            const clientW = "// No authentication. demonstrate POST with data in body\n// callgraphql api: https://github.com/trevorblades/countries\n// docs: https://trevorblades.github.io/countries/queries/continent\n\n// make HTTP request\n\nconst orderId = args[0];\n\n// const productName= args[0];\n// const productdescription = args[1];\n// const productPrice= parseInt(args[2]);\n// const imageUrl=args[3];\n// const chainID = args[4];\n// const account1 = args[5];\n// const signature1 = args[6];\n// console.log(\"typeof(price)= \", typeof(productPrice));\n// const body_text = {\n//   //vendorAddress: account,\n//   name: productName,\n//   price: productPrice,\n//   description: productDescription,\n//   chainId: chainId,\n//   image: imageUrl\n// }\n\n//const signature = args[5];\n//const account = args[6];\n//const orderId= args[0];\n// const amount= parseInt(args[1]);\n// console.log(\"amount= \",amount)\nconst url = \"https://defiber.io/api/orders/markFulfilled\";\n//console.log(`Get name, capital and currency for country code: ${countryCode}`);\nconsole.log(`HTTP POST Request to ${url}`);\nconst orderRequest = Functions.makeHttpRequest({\n  url: url,\n  method: \"POST\",\n  headers: {\n    'Content-Type': 'application/json'//,\n    //'X-Signature':signature1,\n    //'X-Account':account1\n   },\n   data: {\n    'orderId': orderId\n   }\n  });\n\n\n// Execute the API request (Promise)\nconst orderResponse = await orderRequest;\nconsole.log(\"orderResponse= \", orderResponse);\n//console.log(\"orderResponse.text()= \", orderResponse.text());\nif (orderResponse.error) {\n  console.error(\n    orderResponse.response\n      ? `${orderResponse.response.status},${orderResponse.response.statusText}`\n      : \"\"\n  );\n  throw Error(\"Request failed\");\n}\n\nconst orderData = orderResponse[\"data\"];\nconsole.log(\"orderData\", orderData[\"status\"]);\n//probably don't need [\"data\"][\"data\"]\n// if (!orderData || !orderData.country) {\n//   throw Error(`Make sure the country code \"${countryCode}\" exists`);\n// }\n\n//console.log(\"country response\", countryData);\n\n// result is in JSON object\n// const result = {\n//   name: countryData.country.name,\n//   capital: countryData.country.capital,\n//   currency: countryData.country.currency,\n// };\n\n// Use JSON.stringify() to convert from JSON object to JSON string\n// Finally, use the helper Functions.encodeString() to encode from string to bytes\nreturn Functions.encodeString(JSON.stringify(orderData));\n"
                            const argsW = [String(order.id)];
                            //{summary.map((item) => {item.productId})
                            console.log("order= ", order.id);
                            //const amount2 = ethers.utils.parseUnits(String(total), "mwei");
                            //console.log("amount2",amount2);
                            //before implementing this you need some type of reducer or something to track if the approve function has already been called
                            const _window: any = window;
                            const provider1 = new ethers.BrowserProvider(window.ethereum);
                            const _accounts = await _window.ethereum.request({
                              method: "eth_requestAccounts",
                            })
                            const accounts = _accounts || [] 
                          
                            console.log("accounts", accounts[0]);
                            const signer = await provider1.getSigner(0);
                            console.log("_accounts[0]", _accounts[0]);
                            console.log(typeof(accounts[0]))
                            console.log("provider= ", provider1);
                            console.log("signer= ", signer);
                            const total = 1;
                            const amount = ethers.parseUnits(String(total), "mwei");
                            console.log("amount= ", amount);
                            
                            const paymentsW = await new ethers.Contract(consumerAddress,paymentsAbi,signer);
                            //const paymentSuccessful = await payments.store(amount);
                            const paymentSuccessfulW = await paymentsW.withdraw(order.id,"0x",0,0,argsW,[],subscriptionId,/* gasLimit,*/"0x66756e2d706f6c79676f6e2d6d61696e6e65742d310000000000000000000000");
                            const responseBytesW = await paymentsW.s_lastResponse();
                            const responseErrorW = await paymentsW.s_lastError();
                            console.log("payments= ", paymentSuccessfulW);
                            console.log("responseBytes", responseBytesW);
                            const responseListenerW = new ResponseListener({
                              provider: provider1,
                              functionsRouterAddress: routerAddress
                            });

                            const returnTypeW = ReturnType.string;
                            const decodedErrorW = decodeResult(
                                responseErrorW,
                                returnTypeW
                              );
                            console.log("decodedError== ", decodedErrorW);
                            const decodedResponseW = decodeResult(
                              responseBytesW,
                              returnTypeW
                            );
                            console.log("decodedResponse== ", decodedResponseW);

                            console.log("you just got paid");
                            //}
                                 }}
                        >
                          redeem funds
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
          <Heading size={HEADING_SIZE.SM}>Orders placed by me</Heading>
          {ordersClient && ordersClient.map((order) => {
            const summary = order.summary as any[]
            console.log("summary",summary);
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
                      {order.hasBeenShipped && !order.hasBeenDelivered && !order.fulfilled &&(
                        <Button
                          //type={BUTTON_TYPE.TEXT}
                          onClick={async() => {
                            setOrderIdForShippingModal(order.id)
                            //open()

                            const clientW = "// No authentication. demonstrate POST with data in body\n// callgraphql api: https://github.com/trevorblades/countries\n// docs: https://trevorblades.github.io/countries/queries/continent\n\n// make HTTP request\n\nconst orderId = args[0];\n\n// const productName= args[0];\n// const productdescription = args[1];\n// const productPrice= parseInt(args[2]);\n// const imageUrl=args[3];\n// const chainID = args[4];\n// const account1 = args[5];\n// const signature1 = args[6];\n// console.log(\"typeof(price)= \", typeof(productPrice));\n// const body_text = {\n//   //vendorAddress: account,\n//   name: productName,\n//   price: productPrice,\n//   description: productDescription,\n//   chainId: chainId,\n//   image: imageUrl\n// }\n\n//const signature = args[5];\n//const account = args[6];\n//const orderId= args[0];\n// const amount= parseInt(args[1]);\n// console.log(\"amount= \",amount)\nconst url = \"https://defiber.io/api/orders/markFulfilled\";\n//console.log(`Get name, capital and currency for country code: ${countryCode}`);\nconsole.log(`HTTP POST Request to ${url}`);\nconst orderRequest = Functions.makeHttpRequest({\n  url: url,\n  method: \"POST\",\n  headers: {\n    'Content-Type': 'application/json'//,\n    //'X-Signature':signature1,\n    //'X-Account':account1\n   },\n   data: {\n    'orderId': orderId\n   }\n  });\n\n\n// Execute the API request (Promise)\nconst orderResponse = await orderRequest;\nconsole.log(\"orderResponse= \", orderResponse);\n//console.log(\"orderResponse.text()= \", orderResponse.text());\nif (orderResponse.error) {\n  console.error(\n    orderResponse.response\n      ? `${orderResponse.response.status},${orderResponse.response.statusText}`\n      : \"\"\n  );\n  throw Error(\"Request failed\");\n}\n\nconst orderData = orderResponse[\"data\"];\nconsole.log(\"orderData\", orderData[\"status\"]);\n//probably don't need [\"data\"][\"data\"]\n// if (!orderData || !orderData.country) {\n//   throw Error(`Make sure the country code \"${countryCode}\" exists`);\n// }\n\n//console.log(\"country response\", countryData);\n\n// result is in JSON object\n// const result = {\n//   name: countryData.country.name,\n//   capital: countryData.country.capital,\n//   currency: countryData.country.currency,\n// };\n\n// Use JSON.stringify() to convert from JSON object to JSON string\n// Finally, use the helper Functions.encodeString() to encode from string to bytes\nreturn Functions.encodeString(JSON.stringify(orderData));\n"
                            const argsW = [String(order.id)];
                            //{summary.map((item) => {item.productId})
                            console.log("order= ", order.id);
                            //const amount2 = ethers.utils.parseUnits(String(total), "mwei");
                            //console.log("amount2",amount2);
                            //before implementing this you need some type of reducer or something to track if the approve function has already been called
                            const _window: any = window;
                            const provider2 = new ethers.BrowserProvider(window.ethereum);
                            const _accounts = await _window.ethereum.request({
                              method: "eth_requestAccounts",
                            })
                            const accounts = _accounts || [] 
                          
                            console.log("accounts", accounts[0]);
                            const signer = await provider2.getSigner(0);
                            console.log("_accounts[0]", _accounts[0]);
                            console.log(typeof(accounts[0]))
                            console.log("provider= ", provider2);
                            console.log("signer= ", signer);
                            const total = 1;
                            const amount = ethers.parseUnits(String(total), "mwei");
                            console.log("amount= ", amount);
                            
                            const paymentsW = await new ethers.Contract(consumerAddress,paymentsAbi,signer);
                            //const paymentSuccessful = await payments.store(amount);
                            const paymentSuccessfulW = await paymentsW.markReceived(order.id,"0x",0,0,argsW,[],subscriptionId,/* gasLimit,*/"0x66756e2d706f6c79676f6e2d6d61696e6e65742d310000000000000000000000");
                            const responseBytesW = await paymentsW.s_lastResponse();
                            const responseErrorW = await paymentsW.s_lastError();
                            console.log("payments= ", paymentSuccessfulW);
                            console.log("responseBytes", responseBytesW);
                            const responseListenerW = new ResponseListener({
                              provider: provider2,
                              functionsRouterAddress: routerAddress
                            });

                            const returnTypeW = ReturnType.string;
                            const decodedErrorW = decodeResult(
                                responseErrorW,
                                returnTypeW
                              );
                            console.log("decodedError== ", decodedErrorW);
                            const decodedResponseW = decodeResult(
                              responseBytesW,
                              returnTypeW
                            );
                            console.log("decodedResponse== ", decodedResponseW);

                            console.log("you just got paid");
                            
                          }}
                        >
                          Mark Received
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