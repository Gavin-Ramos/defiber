// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

struct InputData {
   bytes32 amountRequested;
   bytes32 sellerAddress; //or as address?
   bytes32 buyerAddress;
   bytes32 transactionID;
 }


contract Payment2 is FunctionsClient, ConfirmedOwner {
    address private escAcc;
    uint256 private escFee;
    uint256 private totalDisputed = 0;
    address private _token = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F;
    uint32 private gasLimit = 300000;
    string private sourceWithdraw = "// No authentication. demonstrate POST with data in body\n// callgraphql api: https://github.com/trevorblades/countries\n// docs: https://trevorblades.github.io/countries/queries/continent\n\n// make HTTP request\n\nconst orderId = args[0];\n\n// const productName= args[0];\n// const productdescription = args[1];\n// const productPrice= parseInt(args[2]);\n// const imageUrl=args[3];\n// const chainID = args[4];\n// const account1 = args[5];\n// const signature1 = args[6];\n// console.log(\"typeof(price)= \", typeof(productPrice));\n// const body_text = {\n//   //vendorAddress: account,\n//   name: productName,\n//   price: productPrice,\n//   description: productDescription,\n//   chainId: chainId,\n//   image: imageUrl\n// }\n\n//const signature = args[5];\n//const account = args[6];\n//const orderId= args[0];\n// const amount= parseInt(args[1]);\n// console.log(\"amount= \",amount)\nconst url = \"https://defiber.io/api/orders/markFulfilled\";\n//console.log(`Get name, capital and currency for country code: ${countryCode}`);\nconsole.log(`HTTP POST Request to ${url}`);\nconst orderRequest = Functions.makeHttpRequest({\n  url: url,\n  method: \"POST\",\n  headers: {\n    'Content-Type': 'application/json'//,\n    //'X-Signature':signature1,\n    //'X-Account':account1\n   },\n   data: {\n    'orderId': orderId\n   }\n  });\n\n\n// Execute the API request (Promise)\nconst orderResponse = await orderRequest;\nconsole.log(\"orderResponse= \", orderResponse);\n//console.log(\"orderResponse.text()= \", orderResponse.text());\nif (orderResponse.error) {\n  console.error(\n    orderResponse.response\n      ? `${orderResponse.response.status},${orderResponse.response.statusText}`\n      : \"\"\n  );\n  throw Error(\"Request failed\");\n}\n\nconst orderData = orderResponse[\"data\"];\nconsole.log(\"orderData\", orderData[\"status\"]);\n//probably don't need [\"data\"][\"data\"]\n// if (!orderData || !orderData.country) {\n//   throw Error(`Make sure the country code \"${countryCode}\" exists`);\n// }\n\n//console.log(\"country response\", countryData);\n\n// result is in JSON object\n// const result = {\n//   name: countryData.country.name,\n//   capital: countryData.country.capital,\n//   currency: countryData.country.currency,\n// };\n\n// Use JSON.stringify() to convert from JSON object to JSON string\n// Finally, use the helper Functions.encodeString() to encode from string to bytes\nreturn Functions.encodeString(JSON.stringify(orderData));\n";
    string private sourcedepositPaymentWithTracking = "// No authentication. demonstrate POST with data in body\n// callgraphql api: https://github.com/trevorblades/countries\n// docs: https://trevorblades.github.io/countries/queries/continent\n\n// make HTTP request\nconst orderId= args[0];\nconst amount= parseInt(args[1]);\nconsole.log(\"amount= \",amount)\nconst url = \"https://defiber.io/api/orders/markPaid\";\n//console.log(`Get name, capital and currency for country code: ${countryCode}`);\nconsole.log(`HTTP POST Request to ${url}`);\nconst orderRequest = Functions.makeHttpRequest({\n  url: url,\n  method: \"POST\",\n  headers: {\n    \"Content-Type\": \"application/json\",\n   },\n  data: {\"orderId\": orderId,\n  \"paymentAmount\" : amount}\n});\n\n\n// Execute the API request (Promise)\nconst orderResponse = await orderRequest;\nconsole.log(\"orderResponse= \", orderResponse);\n//console.log(\"orderResponse.text()= \", orderResponse.text());\nif (orderResponse.error) {\n  console.error(\n    orderResponse.response\n      ? `${orderResponse.response.status},${orderResponse.response.statusText}`\n      : \"\"\n  );\n  throw Error(\"Request failed\");\n}\n\nconst orderData = orderResponse[\"data\"];\nconsole.log(\"orderData\", orderData[\"status\"]);\n//probably don't need [\"data\"][\"data\"]\n// if (!orderData || !orderData.country) {\n//   throw Error(`Make sure the country code \"${countryCode}\" exists`);\n// }\n\n//console.log(\"country response\", countryData);\n\n// result is in JSON object\n// const result = {\n//   name: countryData.country.name,\n//   capital: countryData.country.capital,\n//   currency: countryData.country.currency,\n// };\n\n// Use JSON.stringify() to convert from JSON object to JSON string\n// Finally, use the helper Functions.encodeString() to encode from string to bytes\nreturn Functions.encodeString(JSON.stringify(orderData));\n";
    string private sourceMarkReceived = "// No authentication. demonstrate POST with data in body\n// callgraphql api: https://github.com/trevorblades/countries\n// docs: https://trevorblades.github.io/countries/queries/continent\n\n// make HTTP request\n\nconst orderId = args[0];\n\n// const productName= args[0];\n// const productdescription = args[1];\n// const productPrice= parseInt(args[2]);\n// const imageUrl=args[3];\n// const chainID = args[4];\n// const account1 = args[5];\n// const signature1 = args[6];\n// console.log(\"typeof(price)= \", typeof(productPrice));\n// const body_text = {\n//   //vendorAddress: account,\n//   name: productName,\n//   price: productPrice,\n//   description: productDescription,\n//   chainId: chainId,\n//   image: imageUrl\n// }\n\n//const signature = args[5];\n//const account = args[6];\n//const orderId= args[0];\n// const amount= parseInt(args[1]);\n// console.log(\"amount= \",amount)\nconst url = \"https://defiber.io/api/orders/markDelivered\";\n//console.log(`Get name, capital and currency for country code: ${countryCode}`);\nconsole.log(`HTTP POST Request to ${url}`);\nconst orderRequest = Functions.makeHttpRequest({\n  url: url,\n  method: \"POST\",\n  headers: {\n    'Content-Type': 'application/json'//,\n    //'X-Signature':signature1,\n    //'X-Account':account1\n   },\n   data: {\n    'orderId': orderId\n   }\n  });\n\n\n// Execute the API request (Promise)\nconst orderResponse = await orderRequest;\nconsole.log(\"orderResponse= \", orderResponse);\n//console.log(\"orderResponse.text()= \", orderResponse.text());\nif (orderResponse.error) {\n  console.error(\n    orderResponse.response\n      ? `${orderResponse.response.status},${orderResponse.response.statusText}`\n      : \"\"\n  );\n  throw Error(\"Request failed\");\n}\n\nconst orderData = orderResponse[\"data\"];\nconsole.log(\"orderData\", orderData[\"status\"]);\n//probably don't need [\"data\"][\"data\"]\n// if (!orderData || !orderData.country) {\n//   throw Error(`Make sure the country code \"${countryCode}\" exists`);\n// }\n\n//console.log(\"country response\", countryData);\n\n// result is in JSON object\n// const result = {\n//   name: countryData.country.name,\n//   capital: countryData.country.capital,\n//   currency: countryData.country.currency,\n// };\n\n// Use JSON.stringify() to convert from JSON object to JSON string\n// Finally, use the helper Functions.encodeString() to encode from string to bytes\nreturn Functions.encodeString(JSON.stringify(orderData));\n";

    mapping(string => ItemStruct) public items;
    mapping(address => ItemStruct[]) private itemsOf;
    mapping(address => mapping(uint256 => bool)) public requested;
    mapping(string => address) public ownerOf;
    mapping(string => Available) public isAvailable;
    mapping (address => bool) public allowedTokenAddress;
    mapping (address => uint256) public amountPaidByAddress;
    mapping(bytes32 buyerAddress =>  bytes32 sellerAddress) public transactionID;
    mapping(string => OrderStruct) public orders;

    enum Status {
        OPEN,
        PENDING,
        DELIVERY,
        CONFIRMED,
        DISPUTTED,
        REFUNDED,
        WITHDRAWED
    }

    enum Available { NO, YES }

    struct ItemStruct {
        string itemId;
        uint256 amount;
        uint256 timestamp;
        address owner;
        address provider;
        Status status;
        bool provided;
        bool confirmed;
    }

    struct OrderStruct {
        string orderId;
        string itemNumber;
        uint256 orderTotal;
        address sellerAddress;
        address buyerAddress;
    }



    InputData ip;
    using FunctionsRequest for FunctionsRequest.Request;

    
    event tokenContractAllowed(address _address, bool _bool);
    event paymentSuccessful(address _from, address _to, uint256 _amount);

    constructor(
        address router,
        uint256 _escFee
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) {        
        escAcc = msg.sender;
        escFee = _escFee;
        }

       event Action (
        string itemId,
        string actionType,
        Status status,
        address indexed executor
    );


bytes32 public s_lastRequestId;
bytes public s_lastResponse;
bytes public s_lastError;    


// function allowedStableCoinAddress(address _token, bool _isAllowed) public onlyOwner {
//         allowedTokenAddress[_token] = _isAllowed;
//         emit tokenContractAllowed(_token, _isAllowed);
//     }


    function createItem(
        uint256 _amount,
        string memory itemID

    ) public returns (bool){//(bytes32 requestId) {
        ItemStruct storage item = items[itemID];
        

        item.itemId = itemID;
        item.amount = _amount;
        item.timestamp = block.timestamp;
        item.owner = msg.sender;
        item.status = Status.OPEN;

        itemsOf[msg.sender].push(item);
        ownerOf[itemID] = msg.sender;
        isAvailable[itemID] = Available.YES;

        emit Action (
            itemID,
            "ITEM CREATED",
            Status.OPEN,
            msg.sender
        );
        return true;//sendRequest(source, encryptedSecretsUrls, donHostedSecretsSlotID, donHostedSecretsVersion, args, bytesArgs, subscriptionId, gasLimit, donID);
    }


function depositPaymentWithTracking(
       uint256 _amount,
       string memory orderID,
        string memory itemID,
        //string memory source,
        bytes memory encryptedSecretsUrls,
        uint8 donHostedSecretsSlotID,
        uint64 donHostedSecretsVersion,
        string[] memory args,
        bytes[] memory bytesArgs,
        uint64 subscriptionId,
        //uint32 gasLimit,
        bytes32 donID) public returns(bytes32 requestId){
        //require(allowedTokenAddress[_token] == true, "This stable coin is not allowed");
        //require(IERC20(_token).allowance(msg.sender, address(this)) >=  _amount, "This contract is not allowed to withdraw from this token address");
        //ItemStruct storage item = items[itemID];
        OrderStruct storage order = orders[orderID];
        order.orderId = orderID;
        order.itemNumber = itemID;
        order.orderTotal = _amount;
        order.sellerAddress = ownerOf[itemID];
        order.buyerAddress = msg.sender;
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        //require(success, "Failed to deposit payment");
        //amountPaidByAddress[msg.sender] += _amount;
        //emit paymentSuccessful(msg.sender, address(this), _amount);
        return sendRequest(sourcedepositPaymentWithTracking, encryptedSecretsUrls, donHostedSecretsSlotID, donHostedSecretsVersion, args, bytesArgs, subscriptionId, gasLimit, donID);
    }


function markReceived(
    string memory orderID,
    bytes memory encryptedSecretsUrls,
    uint8 donHostedSecretsSlotID,
    uint64 donHostedSecretsVersion,
    string[] memory args,
    bytes[] memory bytesArgs,
    uint64 subscriptionId,
    bytes32 donID
) public returns(bytes32 requestId){
    require(orders[orderID].buyerAddress == msg.sender);
    return sendRequest(sourceMarkReceived, encryptedSecretsUrls, donHostedSecretsSlotID, donHostedSecretsVersion, args, bytesArgs, subscriptionId, gasLimit, donID);
}




function withdraw(
        //uint256 _amount, 
        string memory orderID,
        //string memory itemID,
        //string memory source,
        bytes memory encryptedSecretsUrls,
        uint8 donHostedSecretsSlotID,
        uint64 donHostedSecretsVersion,
        string[] memory args,
        bytes[] memory bytesArgs,
        uint64 subscriptionId,
        //uint32 gasLimit,
        bytes32 donID
        ) public returns(bytes32 requestId){
        //bytes32 requestSent = sendRequest(source,encryptedSecretsUrls,donHostedSecretsSlotID,donHostedSecretsVersion,args,bytesArgs,subscriptionId,gasLimit,donID);
        //require(requestSent == ip.amountRequested, "requestSent != ipamountRequested");
        //require(ownerOf[itemID] == msg.sender);
        require(orders[orderID].sellerAddress == msg.sender);
        uint256 _amount = orders[orderID].orderTotal;
        bool success = IERC20(_token).transfer(msg.sender, _amount);
        require(success, "Failed to withdraw payment");
        //amountPaidByAddress[msg.sender] += _amount;
        return sendRequest(
        sourceWithdraw, 
        encryptedSecretsUrls,
        donHostedSecretsSlotID,
        donHostedSecretsVersion,
        args,
        bytesArgs,
        subscriptionId,
        gasLimit,
        donID);
    }

function assignInputData(
 bytes32 amountRequested
   ) public {
   ip.amountRequested = amountRequested;
 }
    error UnexpectedRequestID(bytes32 requestId);

    event Response(bytes32 indexed requestId, bytes response, bytes err);

    /**
     * @notice Send a simple request
     * @param source JavaScript source code
     * @param encryptedSecretsUrls Encrypted URLs where to fetch user secrets
     * @param donHostedSecretsSlotID Don hosted secrets slotId
     * @param donHostedSecretsVersion Don hosted secrets version
     * @param args List of arguments accessible from within the source code
     * @param bytesArgs Array of bytes arguments, represented as hex strings
     * @param subscriptionId Billing ID
     */
     //it's still only transacting with the owner... this is a bug. 

    //  struct sourceFile {
    //     Request = //type in an array or mapping here here. 

    //  }
    function sendRequest(
        string memory source,
        bytes memory encryptedSecretsUrls,
        uint8 donHostedSecretsSlotID,
        uint64 donHostedSecretsVersion,
        string[] memory args,
        bytes[] memory bytesArgs,
        uint64 subscriptionId,
        uint32 GasLimit,
        bytes32 donID
    ) private returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        if (encryptedSecretsUrls.length > 0)
            req.addSecretsReference(encryptedSecretsUrls);
        else if (donHostedSecretsVersion > 0) {
            req.addDONHostedSecrets(
                donHostedSecretsSlotID,
                donHostedSecretsVersion
            );
        }
        if (args.length > 0) req.setArgs(args);
        if (bytesArgs.length > 0) req.setBytesArgs(bytesArgs);
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            GasLimit,
            donID
        );
        return s_lastRequestId;
    }

  

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId);
        }
        s_lastResponse = response;
        s_lastError = err;
        emit Response(requestId, s_lastResponse, s_lastError);
    }

    receive() external payable {}
    fallback() external payable {}



}