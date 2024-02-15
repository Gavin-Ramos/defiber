import { checkKey, verifyRequestKey } from "@/utils/authKeys"
import { client } from "@/utils/client"
import { OrderStatus } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

async function POST(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const id = request.body['orderId'] as string
  const payment = request.body['paymentAmount'] as number
  const order = await client.order.findUnique({
    where: {
      id
    }
  })

  if (!order) {
    response.status(404).json({
      status: 404,
      statusText: 'Not Found',
    })

    return
  }

  if (!payment || order?.total !== payment) {
    response.status(400).json({
      status: 400,
      statusText: 'Insufficient payment made',
    })

    return
  }

  const apiKeyFound = await verifyRequestKey(request)

  if (!apiKeyFound) {
    return new Response('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
    })
  }

  await client.order.update({
    where: {
      id
    },
    data: {
      hasBeenPaid: true,
    }
  })

  response.status(200).json({
    status: 200,
    statusText: 'OK',
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    await POST(req, res)
  }
}