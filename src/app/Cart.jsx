import { BUTTON_SIZE, BUTTON_TYPE, Box, Button, COLOR, Column, EmptyState, FONT_SIZE, GROUP_TYPE, Group, HEADING_SIZE, Heading, INPUT_SIZE, LABEL_SIZE, Label, Paragraph, Row, Select, TYPOGRAPHY_TYPE, TextInput } from "@/baseComponents"
import { BOX_SHADOW, Z_INDEX } from "@/baseComponents/theme/custom"
import TrashIcon from '@mui/icons-material/Delete'
import { API_ROOT, PLACEHOLDER_IMAGE } from "@/constants"
import { CartItemType, useCart } from "@/hooks/useCart"
import { useSDK } from "@metamask/sdk-react"
import React, { useContext, useEffect, useState } from "react"

import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
//import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
//import { ethers } from 'ethers'
const ethers = require('ethers');
import { US_STATE, US_STATE_OPTIONS, useAddress } from "@/hooks/useAddress"
import { useAuth } from "@/hooks/useAuth"
const abiPayments = require("../smartContracts/abi/abi/payment2.json")
require('dotenv').config()
//------------------------------
//const fs = require("fs");
//const path = require("path");
//import { readFileSync } from "fs-extra";
//import {SubscriptionManager} from "@chainlink/functions-toolkit"//{
  //SubscriptionManager,
  //simulateScript,
  //ResponseListener,
  //decodeResult} from
import {decodeResult} from "@chainlink/functions-toolkit/dist/decodeResult.js";
import {ReturnType} from "@chainlink/functions-toolkit/dist/types";
import {ResponseListener} from "@chainlink/functions-toolkit/dist/ResponseListener";
import {listenForResponseFromTransaction} from "@chainlink/functions-toolkit/dist/ResponseListener";
import {SecretsManager} from "@chainlink/functions-toolkit/dist/SecretsManager";


const functionsConsumerAbi = require("../smartContracts/abi/abi/payment2.json");
//const ethers = require("ethers");

const consumerAddress = "0xbEEC2507620cCB726d06741733a83f59bba3b09E"; // REPLACE this with your Functions consumer address
const subscriptionId = 50; // REPLACE this with your subscription ID
const routerAddress = "0xdc2AAF042Aeff2E68B3e8E33F19e4B9fA7C73F10";
const linkTokenAddress = "0xb0897686c545045aFc77CF20eC7A532E3120E0F1";
const donId = "fun-polygon-mainnet-1";
const explorerUrl = "https://polygonscan.com";
const gatewayUrls = [
  "https://01.functions-gateway.chain.link/",
  "https://02.functions-gateway.chain.link/",
];
const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

const privateKey = process.env.PRIVATE_KEY;
console.log("PRIVATE_KEY= ",privateKey);
const rpcUrl = process.env.POLYGON_RPC_URL; 



//String();//fs
// .readFileSync(path.resolve(__dirname, "source.js"))
// .toString();
//console.log("source.js ==",source)

const gasLimit = 300000;

//------------------------------

const Overlay = ({ onClick, children }) => {
  console.log('children', children)
  return (
    <Column
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bg: 'rgba(0, 0, 0, 0.05)',
        zIndex: Z_INDEX.ELEVATED
      }}
      onClick={onClick}
    >
      {children}
    </Column>
  )
}

export const Cart = () => {
  const { cart, isOpen, addToCart, setIsOpen } = useCart()
  const { sdk, connected, connecting, provider, chainId } = useSDK();
  const { signature, handleSignIn, account } = useAuth()
  const [selectedCartAction, setSelectedCartAction] = React.useState(new Set(["USDT"]));
  const [USDTallowance, setUSDTallowance] = useState(0);
  const [USDTApproval, setUSDTApproval] = useState(null);
  const handleCartActionChange = (selected) => {
      setSelectedCartAction(selected);
      // Handle the selected action here (e.g., call functions for new, copy, edit, delete)
      const action = Array.from(selected)[0];
      if (action === 'USDT') { 
        //new order 
      } else if (action === 'USDC') { 
        //copy order id
      } else if (action === 'DAI') {
        //edit order
      } 
  };

  const {
    address1,
    address2,
    city,
    state,
    zip,
    setAddress1,
    setAddress2,
    setCity,
    setState,
    setZip,
    isValid: isAddressValid
  } = useAddress()

  if (typeof window === 'undefined') {
    return null
  }

  const total = cart ? cart.reduce((acc, item) => acc + (item.quantity * item.product.price), 0) : 0

  const _window = window

  const onCheckout = async () => {
    
    const response = await fetch(`${API_ROOT}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Account': account,
        'X-Signature': signature
      },
      body: JSON.stringify({
        summary: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        address1,
        address2,
        city,
        state,
        zip
      })
    }) 
    //console.log("body", body);
    const responseData = await response.json();
    const order = responseData;
    console.log("response== ", response);
    console.log("order == ",order);
    console.log("orderID= ", order.order.id);
    console.log("account= ", account);
    console.log("signature= ", signature);
    //console.log("item.quantity= ", quantity);
    //console.log("signature== ", signature);
    console.log("API= ",`${API_ROOT}/api/orders`);
    console.log(JSON.stringify({summary: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        }))}));
const orderID = order.order.id;
console.log("productId", order.order.summary[0].productId);



    // GAVIN'S CODE GOES HERE
  //   const client = await fetch('https://miby9omyy8.execute-api.us-east-1.amazonaws.com/default/return_js_as_string', {
  //   method: 'POST',
  //  headers: {
  //    "Content-Type": "text/html"},
  //   mode :'no-cors'});
    //const responseDataClient = await client.json();
    //console.log("client0= ", responseDataClient);
    //const clientR = await new Response('https://x9h27uo6ye.execute-api.us-east-1.amazonaws.com/default/return_js_as_string');
    //const clientRJSON = await clientR.json();
    //console.log("client Response= ", clientR);//, "client response json= ", clientRJSON);
    const stablecoinAddresses = {
      USDT: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
      USDC: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", 
      DAI:  "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063" 
    };
    const initialState = {
      selectedStablecoin: "USDT", // Default to USDT
      stablecoinAddress: stablecoinAddresses["USDT"], // Set default address
    };
    function cartReducer(state, action) {
      switch (action.type) {
        case "SET_STABLECOIN":
          return {
            ...state,
            selectedStablecoin: action.payload,
            stablecoinAddress: stablecoinAddresses[action.payload],
          };
        default:
          return state;
      }
    }

    const [state, dispatch] = useReducer(cartReducer, initialState);
    const {selectedStableCoin, stablecoinAddress} = state;
    // New state to track approval status
    const [needsApproval, setNeedsApproval] = useState(true);

  //   main().catch((error) => {
  //     console.error(error);
  //     process.exitCode = 1;
  //   });
  }
  // onCheckout().catch((error) => {
  //   console.error(error);
  //   process.exitCode = 1;
  // });
  console.log("it runs till here");
  useEffect(() => {
    async function main() {
    console.log("main function has started");
            // Get the provider and signer from the browser window
        //await window.ethereum.enable(); //watch out for typing issues with window. 
        //test
      //async function getClient(){
        //return responseDataClient;
      //}
    //   const source = fs
    //   .readFileSync(path.resolve(__dirname, "source.js"))
    //   .toString();
    // console.log("source.js ==",source);
    //const client = "const countryCode = ['JP'];\nconst url = \"https://countries.trevorblades.com/\";\nconst countryRequest = Functions.makeHttpRequest({\n  url: url,\n  method: \"POST\",\n  headers: {\n    \"Content-Type\": \"application/json\",\n  },\n  data: {\n    query: `{\\\n        country(code: \"${countryCode}\") { \\\n          name \\\n          capital \\\n          currency \\\n        } \\\n      }`,\n  },\n});\n\nconst countryResponse = await countryRequest;\nif (countryResponse.error) {\n  console.error(\n    countryResponse.response\n      ? `${countryResponse.response.status},${countryResponse.response.statusText}`\n      : \"\"\n  );\n  throw Error(\"Request failed\");\n}\n\nconst countryData = countryResponse[\"data\"][\"data\"];\n\nif (!countryData || !countryData.country) {\n  throw Error(`Make sure the country code \"${countryCode}\" exists`);\n}\n\nconsole.log(\"country response\", countryData);\n\n// result is in JSON object\nconst result = {\n  name: countryData.country.name,\n  capital: countryData.country.capital,\n  currency: countryData.country.currency,\n};\n\n// Use JSON.stringify() to convert from JSON object to JSON string\n// Finally, use the helper Functions.encodeString() to encode from string to bytes\nreturn Functions.encodeString(JSON.stringify(result));\n";
    // console.log("productId", order.order.summary[0].productId);
    // const productID = order.order.summary[0].productId;
    const client = "// No authentication. demonstrate POST with data in body\n// callgraphql api: https://github.com/trevorblades/countries\n// docs: https://trevorblades.github.io/countries/queries/continent\n\n// make HTTP request\nconst orderId= args[0];\nconst amount= parseInt(args[1]);\nconsole.log(\"amount= \",amount)\nconst url = \"https://defiber.io/api/orders/markPaid\";\n//console.log(`Get name, capital and currency for country code: ${countryCode}`);\nconsole.log(`HTTP POST Request to ${url}`);\nconst orderRequest = Functions.makeHttpRequest({\n  url: url,\n  method: \"POST\",\n  headers: {\n    \"Content-Type\": \"application/json\",\n   },\n  data: {\"orderId\": orderId,\n  \"paymentAmount\" : amount}\n});\n\n\n// Execute the API request (Promise)\nconst orderResponse = await orderRequest;\nconsole.log(\"orderResponse= \", orderResponse);\n//console.log(\"orderResponse.text()= \", orderResponse.text());\nif (orderResponse.error) {\n  console.error(\n    orderResponse.response\n      ? `${orderResponse.response.status},${orderResponse.response.statusText}`\n      : \"\"\n  );\n  throw Error(\"Request failed\");\n}\n\nconst orderData = orderResponse[\"data\"];\nconsole.log(\"orderData\", orderData[\"status\"]);\n//probably don't need [\"data\"][\"data\"]\n// if (!orderData || !orderData.country) {\n//   throw Error(`Make sure the country code \"${countryCode}\" exists`);\n// }\n\n//console.log(\"country response\", countryData);\n\n// result is in JSON object\n// const result = {\n//   name: countryData.country.name,\n//   capital: countryData.country.capital,\n//   currency: countryData.country.currency,\n// };\n\n// Use JSON.stringify() to convert from JSON object to JSON string\n// Finally, use the helper Functions.encodeString() to encode from string to bytes\nreturn Functions.encodeString(JSON.stringify(orderData));\n"
    console.log("client 0 first = ", client);
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const _accounts = await _window.ethereum.request({
          method: "eth_requestAccounts",
        })
        const accounts = _accounts || [] 
  
        console.log("accounts", accounts[0]);
        const signer1 = await provider.getSigner(0);
        console.log("_accounts[0]", _accounts[0]);
        console.log(typeof(accounts[0]))
        console.log("provider= ", provider);
        console.log("signer1= ", signer1);
        console.log("total= ", total);
        const amount = ethers.utils.parseUnits(String(total), "mwei");
        const obj =[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"userAddress","type":"address"},{"indexed":false,"internalType":"address payable","name":"relayerAddress","type":"address"},{"indexed":false,"internalType":"bytes","name":"functionSignature","type":"bytes"}],"name":"MetaTransactionExecuted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"CHILD_CHAIN_ID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"CHILD_CHAIN_ID_BYTES","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEPOSITOR_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ERC712_VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ROOT_CHAIN_ID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ROOT_CHAIN_ID_BYTES","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name_","type":"string"}],"name":"changeName","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"bytes","name":"depositData","type":"bytes"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"userAddress","type":"address"},{"internalType":"bytes","name":"functionSignature","type":"bytes"},{"internalType":"bytes32","name":"sigR","type":"bytes32"},{"internalType":"bytes32","name":"sigS","type":"bytes32"},{"internalType":"uint8","name":"sigV","type":"uint8"}],"name":"executeMetaTransaction","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"getDomainSeperator","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getNonce","outputs":[{"internalType":"uint256","name":"nonce","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint8","name":"decimals_","type":"uint8"},{"internalType":"address","name":"childChainManager","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]
        const USDT = await new ethers.Contract("0xc2132D05D31c914a87C6611C10748AEb04B58e8F", obj, signer1);
        
        //console.log("amount=",amount);
        console.log("issue is here");
        const USDTallowance = await USDT.allowance(accounts[0], consumerAddress);
        console.log("USDTallowance", BigInt(USDTallowance));
        setUSDTallowance(USDTallowance);


        const el = document.getElementById('approveButton');
        if (el){
        el.addEventListener('click', async () => {
          console.log('it did make it here')
            const USDTApproval = await USDT.approve(String(consumerAddress), amount);
            console.log('Approval successful:', USDTApproval);
        });}
    
        // if(USDTallowance < amount) {
        //   console.log("need to approve");
  
        // } else {
        //   console.log("no need to approve");
        // }
  
            // Get the provider and signer from the browser window
        //await window.ethereum.enable(); //watch out for typing issues with window. 
        //test
      //async function getClient(){
        //return responseDataClient;
      //}
    //   const source = fs
    //   .readFileSync(path.resolve(__dirname, "source.js"))
    //   .toString();
    // console.log("source.js ==",source);
    //const client = "const countryCode = ['JP'];\nconst url = \"https://countries.trevorblades.com/\";\nconst countryRequest = Functions.makeHttpRequest({\n  url: url,\n  method: \"POST\",\n  headers: {\n    \"Content-Type\": \"application/json\",\n  },\n  data: {\n    query: `{\\\n        country(code: \"${countryCode}\") { \\\n          name \\\n          capital \\\n          currency \\\n        } \\\n      }`,\n  },\n});\n\nconst countryResponse = await countryRequest;\nif (countryResponse.error) {\n  console.error(\n    countryResponse.response\n      ? `${countryResponse.response.status},${countryResponse.response.statusText}`\n      : \"\"\n  );\n  throw Error(\"Request failed\");\n}\n\nconst countryData = countryResponse[\"data\"][\"data\"];\n\nif (!countryData || !countryData.country) {\n  throw Error(`Make sure the country code \"${countryCode}\" exists`);\n}\n\nconsole.log(\"country response\", countryData);\n\n// result is in JSON object\nconst result = {\n  name: countryData.country.name,\n  capital: countryData.country.capital,\n  currency: countryData.country.currency,\n};\n\n// Use JSON.stringify() to convert from JSON object to JSON string\n// Finally, use the helper Functions.encodeString() to encode from string to bytes\nreturn Functions.encodeString(JSON.stringify(result));\n";
  
    //const amount2 = ethers.utils.parseUnits(String(total), "mwei");
      //console.log("amount2",amount2);
      const payments = await new ethers.Contract(consumerAddress,abiPayments,signer1);
      const args = [String(orderID), "1"]; 
      console.log("args[0]=", args[0], "args[1]=", args[1]);
      //const client = await new Request('https://x9h27uo6ye.execute-api.us-east-1.amazonaws.com/default/return_js_as_string');
      //console.log("client= ", client);
      //const clientTxt = await new Response(client);
      //console.log("clientTxt", clientTxt);
      /*client.open('GET', './foo.txt');
      /client.onreadystatechange = function() {
      alert(client.responseText);
    
      }
  
      client.send();*/
  //console.log("donIDformatted== ", donIDformatted);
  /*"0xc2132D05D31c914a87C6611C10748AEb04B58e8F", amount,*/
  
  console.log("amount= ", amount);
  console.log("it loads up to here");
  //---------
    // First encrypt secrets and upload the encrypted secrets to the DON
  
    const provider2 = await new ethers.providers.JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/ztQRx1-ILXqXE0JRpiIihcRDspxt2SCo");
    console.log("provider2= ", provider2);
  const wallet2 = await new ethers.Wallet("a83cf9322b88ed130d3f5592649a8ba6453542c0336ee442bf2d5d1ba8db1b25");
  const signer2 = await wallet2.connect(provider2); 
  //console.log("signer2", signer2);
  const secrets = { apiKey : process.env.SECRET_KEY };
  //const source = require("./source.js");
  //const source = String("test");
  console.log("secrets=",secrets)
   
  console.log("wallet2= ", wallet2);
    console.log("signer2= ",signer2);
    const secretsManager = new SecretsManager({
      signer : signer2,//signer,
      functionsRouterAddress: routerAddress,
      donId : donId
    });
    console.log("it's not throwing here")
    await secretsManager.initialize();
  
    // Encrypt secrets and upload to DON
    const encryptedSecretsObj = await secretsManager.encryptSecrets(secrets);
  
    console.log(
      `Upload encrypted secret to gateways ${gatewayUrls}. slotId ${slotIdNumber}. Expiration in minutes: ${expirationTimeMinutes}`
    );
    // Upload secrets
    const uploadResult = await secretsManager.uploadEncryptedSecretsToDON({
      encryptedSecretsHexstring: encryptedSecretsObj.encryptedSecrets,
      gatewayUrls: gatewayUrls,
      slotId: slotIdNumber,
      minutesUntilExpiration: expirationTimeMinutes,
    });
  
    if (!uploadResult.success)
      throw new Error(`Encrypted secrets not uploaded to ${gatewayUrls}`);
  
    console.log(
      `\n✅ Secrets uploaded properly to gateways ${gatewayUrls}! Gateways response: `,
      uploadResult
    );
  
    const donHostedSecretsVersion = parseInt(uploadResult.version); // fetch the reference of the encrypted secrets
  
  
  //---------
  const paymentSuccessful = await payments.depositPaymentWithTracking(amount,String(orderID),productID,/*client,*/"0x",slotIdNumber,donHostedSecretsVersion,args,[],subscriptionId, /*gasLimit,*/"0x66756e2d706f6c79676f6e2d6d61696e6e65742d310000000000000000000000");
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  await sleep(40000).then(() => { console.log('World!'); });
  
  const responseBytes = await payments.s_lastResponse();
  const responseError = await payments.s_lastError();
  //const responseMaybe = await payments.
  //const fufilRequest = payments.fufilRequest(responseBytes);
  console.log("responseError= ", responseError);
  //console.log("fufilRequest = ", fufilRequest)
  console.log("responseBytes= ", responseBytes);
  console.log("paymentSuccessful.hash== ", paymentSuccessful.hash);
  //--------------------------------------------------------------
  console.log("routerAddress = ",routerAddress, "typeof = ", typeof(routerAddress) );
  const responseListener = new ResponseListener({
    signer1,
    functionsRouterAddress: routerAddress,
  }); // Instantiate a ResponseListener object to wait for fulfillment.
  //(async () => {
    /*try {
      const response = await new Promise((resolve, reject) => {
        responseListener.listenForResponseFromTransaction(paymentSuccessful.hash)
          .then((response) => {
            resolve(response); // Resolves once the request has been fulfilled.
          })
          .catch((error) => {
            reject(error); // Indicate that an error occurred while waiting for fulfillment.
          });
      });
      console.log("response= ", response);
      const fulfillmentCode = response.fulfillmentCode;
      console.log("fulfillmentCode",fulfillmentCode);
  
      const errorString = response.errorString;
    } 
    catch (error) {
      console.error("Error listening for response:", error);
    };*/
  //};
  //work();
  
  //--------------------------------------------------------------
  //console.log("payment successful", responseBytes);
  console.log("response/bytes= ",responseBytes);//.responseBytesHexstring);//.responseBytesHexstring);
  // const hexdecoded = paymentSuccessful.data.toString();
  // console.log(hexdecoded);
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
  } main();
  },[]);


  if (!isOpen) {
    return null
  }
// async function getBalance(){
//   const USDT = await new ethers.Contract("0xc2132D05D31c914a87C6611C10748AEb04B58e8F", obj, signer1);
//   const USDTallowance = await USDT.allowance(accounts[0], consumerAddress);

 

  return (
    <Overlay onClick={() => {setIsOpen(false)}}>
      <Group
        sx={{
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
        }}

        onClick={e => {
          e.stopPropagation()
        }}
      >
        <Heading size={HEADING_SIZE.SM}>Your Cart</Heading>
        <Dropdown>
      <DropdownTrigger>
      <Button variant="bordered"> {selectedCartAction}</Button>
      </DropdownTrigger>
      <DropdownMenu 
                        aria-label="Actions" 
                        disallowEmptySelection // Prevent empty selection
                        selectionMode="single" // Single selection
                        selectedKeys={selectedCartAction} 
                        onSelectionChange={handleCartActionChange}
                    >
        <DropdownItem key="USDC" style={{ backgroundColor: 'white' }}>USDC</DropdownItem>
        <DropdownItem key="USDT" style={{ backgroundColor: 'white' }}>USDT</DropdownItem>
        <DropdownItem key="DAI" style={{ backgroundColor: 'white' }}>DAI</DropdownItem>
      </DropdownMenu>
    </Dropdown>

        <Column grow={1} sx={{mt: 4}}>
          {cart && cart.length === 0 && (
            <EmptyState omitIcon>Your cart is empty.</EmptyState>
          )}

          {cart && cart.length > 0 && (
            <>
              {cart.map((item) => (
                <CartItem item={item} key={item.product.id} />
              ))}

            </>
          )}
        </Column>

        <Column grow={0} justify={'flex-end'} align="center" sx={{p: 5}}>
          <TextInput
            label="Address 1"
            value={address1}
            onChange={setAddress1}
            sx={{ width: '250px' }}
          />
          <TextInput
            label="Address 2"
            value={address2}
            onChange={setAddress2}
            sx={{ width: '250px', mt: 4 }}
          />
          <Row sx={{ mt: 4 }}>
            <TextInput
              label="City"
              value={city}
              onChange={setCity}
              sx={{ width: '162px', mr: 2 }}
            />
            <Select
              label="State"
              value={state}
              options={US_STATE_OPTIONS}
              onSelectOption={setState}
              sx={{
                width: "80px"
              }}
            />
          </Row>
          <TextInput
            label="Zip"
            value={zip}
            onChange={setZip}
            sx={{ width: '250px', mt: 4 }}
          />
          
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
          {total > USDTallowance ? <Button
  id="approveButton"
  onClick={async () => {
    console.log("total= ", total, "USDTallowance= ", USDTallowance);
    await USDTApproval;
  }}
>
              Approve
            </Button> : connected ? (
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
                console.log(sdk, 'connecting')
                sdk?.connect()
              }}
            >
              Connect Wallet
            </Button>
          ) }
        </Column>
        
      </Group>
    </Overlay>
  )
}

 
const CartItem = ({ item }) => {
  const { addToCart, removeFromCart } = useCart()
  const [quantity, setQuantity] = React.useState(item.quantity.toString())

  useEffect(() => {
    const quantityInt = parseInt(quantity)
    const difference = quantityInt - item.quantity

    if (difference !== 0) {
      addToCart({
        product: item.product,
        quantity: difference
      })
    }
  }, [quantity])

  return (
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
              label="Qty"
              size={INPUT_SIZE.SM}
              type="number"
              onChange={setQuantity}
              value={quantity}
              min={1}
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
              onClick={() => {
                removeFromCart(item.product.id)
              }}
            />
          </Row>
        </Column>
      </Row>
    </Group>

  )
}