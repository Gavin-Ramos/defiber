import { checkKey, verifyRequestKey } from "@/utils/authKeys"
import { client } from "@/utils/client"
import { OrderStatus } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
require("dotenv").config();

async function POST(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const id = request.body['orderId'] as string

  const order = await client.order.findUnique({
    where: {
      id
    }
  }) 
console.log(order?.shippingLabel)
  if (!order) {
    response.status(404).json({
      status: 404,
      statusText: 'Not Found',
    })

    return
  }

  // const apiKeyFound = await verifyRequestKey(request)

  // if (!apiKeyFound) {
  //   return new Response('Unauthorized', {
  //     status: 401,
  //     statusText: 'Unauthorized',
  //   })
  // }

    const formData = {
      grant_type: 'client_credentials'
    };
  
    const resp = await fetch(
      `https://onlinetools.ups.com/security/v1/oauth/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-merchant-id': 'G2504G',
          Authorization: 'Basic ' + Buffer.from(String(process.env.USERNAME_PASSWORD)).toString('base64')
        },
        body: new URLSearchParams(formData).toString()
      }
    );
  
    const data = await resp.json();
    //console.log(data.access_token);
  
  
  
  
    const query = new URLSearchParams({
      locale: 'en_US',
      returnSignature: 'false',
      returnMilestones: 'false'
    }).toString();
    
    const inquiryNumber = order?.shippingLabel;
    const resp1 = await fetch(
      `https://onlinetools.ups.com/api/track/v1/details/${inquiryNumber}?${query}`,
      {
        method: 'GET',
        headers: {
          transId: 'string',
          transactionSrc: 'testing',
          Authorization: `Bearer ${data.access_token}`
        }
      }
    );
    
    const data1 = await resp1.json();
    //console.log(data1.trackResponse.shipment[0].package[0].currentStatus.description);
if(data1.trackResponse.shipment[0].package[0].currentStatus.description == "Delivered"){
  await client.order.update({
    where: {
      id
    },
    data: {
      hasBeenDelivered: true,
    }
  })

  response.status(200).json({
    status: 200,
    statusText: 'OK - Delivered',
  })}
  else{
    response.status(401).json({
      status:401,
      statusText: 'not delivered yet'
    })
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    await POST(req, res)
  }
}