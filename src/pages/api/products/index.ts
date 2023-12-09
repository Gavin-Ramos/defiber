import { SIGN_IN_MESSAGE } from '@/constants'
import { client } from '@/utils/client'
import { verifyUser } from '@/utils/verifyUser'
import { recoverPersonalSignature } from '@metamask/eth-sig-util'
import type { NextApiRequest, NextApiResponse } from 'next'

const GET = async (request: NextApiRequest, response: NextApiResponse) => {
  const query = (request.query['query'] || '') as string

  const products = await client.product.findMany({
    where: query ? {
      name: {
        contains: query ,
        mode: 'insensitive'
      }
    } : undefined,
  })

  response.status(200).json({ products })
}

const POST = async (request: NextApiRequest, response: NextApiResponse) => {
  const fields = request.body

  if (typeof fields !== 'object') {
    response.status(400).json({
      status: 400,
      statusText: 'Bad Request',
    })

    return
  }

  // const fields = await JSON.parse(request.body)
  const user = await verifyUser(request)

  if (!user) {
    response.status(401).json({
      status: 401,
      statusText: 'Unauthorized',
    })
  } else {
    const product = await client.product.create({
      data: {
        vendorId: user.id,
        name: fields.name,
        price: fields.price,
        description: fields.description,
        quantity: 0
      }
    })

    // response.status(200).json({ product })
    response.status(200).json({ product })
  }
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    await POST(req, res)
  } else if (req.method === 'GET') {
    await GET(req, res)
  }

}